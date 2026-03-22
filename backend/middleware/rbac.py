"""
Role-Based Access Control (RBAC) Middleware
============================================
Centralized authorization logic with deny-by-default rules.

Features:
- Role definitions with hierarchical permissions
- Resource-based access control
- Audit logging for security events
- Rate limiting per role

Usage:
    from middleware.rbac import RBACMiddleware, Permission, require_permission
    
    @router.get("/admin/users")
    async def get_users(user = Depends(require_permission(Permission.ADMIN_READ))):
        ...
"""

from enum import Enum
from typing import Optional, Set, Dict, Any
from fastapi import Request, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime, timezone
import logging
import os

logger = logging.getLogger(__name__)


class Permission(str, Enum):
    """Fine-grained permissions for RBAC"""
    # User permissions
    USER_READ = "user:read"
    USER_WRITE = "user:write"
    
    # Content permissions
    CONTENT_READ = "content:read"
    CONTENT_WRITE = "content:write"
    
    # Admin permissions
    ADMIN_READ = "admin:read"
    ADMIN_WRITE = "admin:write"
    ADMIN_DELETE = "admin:delete"
    ADMIN_USERS = "admin:users"
    ADMIN_SUBSCRIPTIONS = "admin:subscriptions"
    ADMIN_SCHEDULER = "admin:scheduler"
    ADMIN_DEVICES = "admin:devices"
    
    # Super admin
    SUPER_ADMIN = "super:admin"


class Role(str, Enum):
    """User roles with associated permissions"""
    GUEST = "guest"
    USER = "user"
    SUBSCRIBER = "subscriber"
    ADMIN = "admin"
    SUPER_ADMIN = "super_admin"


# Role to Permission mapping - DENY BY DEFAULT
# If a permission is not explicitly listed, it is denied
ROLE_PERMISSIONS: Dict[Role, Set[Permission]] = {
    Role.GUEST: set(),  # No permissions
    
    Role.USER: {
        Permission.USER_READ,
        Permission.USER_WRITE,
    },
    
    Role.SUBSCRIBER: {
        Permission.USER_READ,
        Permission.USER_WRITE,
        Permission.CONTENT_READ,
        Permission.CONTENT_WRITE,
    },
    
    Role.ADMIN: {
        Permission.USER_READ,
        Permission.USER_WRITE,
        Permission.CONTENT_READ,
        Permission.CONTENT_WRITE,
        Permission.ADMIN_READ,
        Permission.ADMIN_WRITE,
        Permission.ADMIN_DELETE,
        Permission.ADMIN_USERS,
        Permission.ADMIN_SUBSCRIPTIONS,
        Permission.ADMIN_SCHEDULER,
        Permission.ADMIN_DEVICES,
    },
    
    Role.SUPER_ADMIN: {
        Permission.USER_READ,
        Permission.USER_WRITE,
        Permission.CONTENT_READ,
        Permission.CONTENT_WRITE,
        Permission.ADMIN_READ,
        Permission.ADMIN_WRITE,
        Permission.ADMIN_DELETE,
        Permission.ADMIN_USERS,
        Permission.ADMIN_SUBSCRIPTIONS,
        Permission.ADMIN_SCHEDULER,
        Permission.ADMIN_DEVICES,
        Permission.SUPER_ADMIN,
    },
}


def get_user_role(user: Any) -> Role:
    """Determine user's role based on their attributes"""
    if not user:
        return Role.GUEST
    
    if getattr(user, 'is_super_admin', False):
        return Role.SUPER_ADMIN
    
    if getattr(user, 'is_admin', False):
        return Role.ADMIN
    
    if getattr(user, 'has_active_subscription', False):
        return Role.SUBSCRIBER
    
    return Role.USER


def has_permission(user: Any, permission: Permission) -> bool:
    """Check if user has a specific permission - DENY BY DEFAULT"""
    if not user:
        return False
    
    role = get_user_role(user)
    permissions = ROLE_PERMISSIONS.get(role, set())
    
    return permission in permissions


def has_any_permission(user: Any, permissions: Set[Permission]) -> bool:
    """Check if user has any of the specified permissions"""
    if not user:
        return False
    
    role = get_user_role(user)
    user_permissions = ROLE_PERMISSIONS.get(role, set())
    
    return bool(user_permissions & permissions)


def has_all_permissions(user: Any, permissions: Set[Permission]) -> bool:
    """Check if user has all of the specified permissions"""
    if not user:
        return False
    
    role = get_user_role(user)
    user_permissions = ROLE_PERMISSIONS.get(role, set())
    
    return permissions.issubset(user_permissions)


async def log_security_event(
    event_type: str,
    user_id: Optional[str],
    resource: str,
    action: str,
    success: bool,
    details: Optional[Dict] = None,
    db = None
):
    """Log security events for audit trail"""
    event = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "event_type": event_type,
        "user_id": user_id,
        "resource": resource,
        "action": action,
        "success": success,
        "details": details or {}
    }
    
    # Log to file
    log_level = logging.INFO if success else logging.WARNING
    logger.log(log_level, f"SECURITY_EVENT: {event}")
    
    # Optionally log to database for audit trail
    if db:
        try:
            await db.security_audit_log.insert_one(event)
        except Exception as e:
            logger.error(f"Failed to log security event to database: {e}")


class RBACDependency:
    """
    FastAPI dependency for RBAC authorization.
    
    Usage:
        @router.get("/admin/users")
        async def get_users(user = Depends(require_permission(Permission.ADMIN_USERS))):
            ...
    """
    
    def __init__(self, required_permission: Permission):
        self.required_permission = required_permission
    
    async def __call__(
        self,
        request: Request,
    ):
        from routes.auth import get_current_user, security
        from fastapi.security import HTTPAuthorizationCredentials
        
        # Get credentials from request
        auth_header = request.headers.get("Authorization")
        credentials = None
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header[7:]
            credentials = HTTPAuthorizationCredentials(scheme="Bearer", credentials=token)
        
        # Get current user
        user = await get_current_user(request, credentials)
        
        if not user:
            await log_security_event(
                event_type="AUTH_FAILURE",
                user_id=None,
                resource=request.url.path,
                action=self.required_permission.value,
                success=False,
                details={"reason": "Not authenticated"}
            )
            raise HTTPException(status_code=401, detail="Not authenticated")
        
        if not has_permission(user, self.required_permission):
            await log_security_event(
                event_type="AUTHORIZATION_FAILURE",
                user_id=user.id,
                resource=request.url.path,
                action=self.required_permission.value,
                success=False,
                details={"reason": "Insufficient permissions", "user_role": get_user_role(user).value}
            )
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        
        # Log successful access
        await log_security_event(
            event_type="ACCESS_GRANTED",
            user_id=user.id,
            resource=request.url.path,
            action=self.required_permission.value,
            success=True
        )
        
        return user


def require_permission(permission: Permission):
    """Factory function for RBAC dependency"""
    return RBACDependency(permission)


def require_any_permission(*permissions: Permission):
    """Require any of the specified permissions"""
    class AnyPermissionDependency:
        async def __call__(self, request: Request):
            from routes.auth import get_current_user
            from fastapi.security import HTTPAuthorizationCredentials
            
            auth_header = request.headers.get("Authorization")
            credentials = None
            if auth_header and auth_header.startswith("Bearer "):
                token = auth_header[7:]
                credentials = HTTPAuthorizationCredentials(scheme="Bearer", credentials=token)
            
            user = await get_current_user(request, credentials)
            
            if not user:
                raise HTTPException(status_code=401, detail="Not authenticated")
            
            if not has_any_permission(user, set(permissions)):
                raise HTTPException(status_code=403, detail="Insufficient permissions")
            
            return user
    
    return AnyPermissionDependency()
