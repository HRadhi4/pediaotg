"""
=============================================================================
AUTH SERVICE - Authentication & User Management
=============================================================================
This service handles all authentication-related operations including:
- User registration and login
- Password hashing and verification (bcrypt)
- JWT token generation and validation
- Subscription status checking
- Special account handling (Admin, Tester)

SPECIAL ACCOUNTS:
- Admin (admin@pedotg.com): Full access + admin dashboard
- Tester (test@pedotg.com): Full app access, NO admin dashboard, NO subscription needed

CONFIGURATION: All settings loaded from environment variables in .env file
=============================================================================
"""

from datetime import datetime, timedelta, timezone
from typing import Optional, Tuple
import os
import re
import bcrypt
import jwt
from motor.motor_asyncio import AsyncIOMotorDatabase
from models.user import User, UserCreate, UserResponse
from models.subscription import Subscription, SubscriptionStatus, PlanType


class AuthService:
    """
    Main authentication service class.
    Instantiated with a MongoDB database connection.
    """
    
    def __init__(self, db: AsyncIOMotorDatabase):
        """
        Initialize AuthService with database and configuration.
        
        Args:
            db: MongoDB database instance (async motor client)
        
        Configuration loaded from environment:
            - JWT_SECRET_KEY: Secret for signing tokens
            - JWT_ALGORITHM: Algorithm for JWT (default: HS256)
            - ACCESS_TOKEN_EXPIRE_MINUTES: Token expiry (default: 30)
            - ADMIN_EMAIL/PASSWORD: Hardcoded admin credentials
            - TESTER_EMAIL/PASSWORD: Hardcoded tester credentials
            - TRIAL_DAYS: Trial subscription length (default: 3)
        """
        self.db = db
        
        # SECURITY: Required secrets - fail fast if not provided
        self.jwt_secret = os.environ.get('JWT_SECRET_KEY')
        if not self.jwt_secret:
            raise ValueError("JWT_SECRET_KEY environment variable is required")
        
        self.jwt_algorithm = os.environ.get('JWT_ALGORITHM', 'HS256')
        self.access_token_expire = int(os.environ.get('ACCESS_TOKEN_EXPIRE_MINUTES', 30))
        self.refresh_token_expire = int(os.environ.get('REFRESH_TOKEN_EXPIRE_DAYS', 7))
        
        # Admin account - MUST be configured via environment
        self.admin_email = os.environ.get('ADMIN_EMAIL')
        if not self.admin_email:
            raise ValueError("ADMIN_EMAIL environment variable is required")
        self.admin_email = self.admin_email.lower()
        
        # Admin password - prefer hash, require at least one
        self._admin_password_hash = os.environ.get('ADMIN_PASSWORD_HASH', '')
        self._admin_password_plain = os.environ.get('ADMIN_PASSWORD', '')
        if not self._admin_password_hash and not self._admin_password_plain:
            raise ValueError("ADMIN_PASSWORD_HASH or ADMIN_PASSWORD environment variable is required")
        
        # Tester account configuration
        # SECURITY: Tester account is DISABLED by default in production
        # Enable with ENABLE_TESTER_LOGIN=true (use with caution)
        self.tester_email = os.environ.get('TESTER_EMAIL', '').lower()
        self._tester_password_hash = os.environ.get('TESTER_PASSWORD_HASH', '')
        self._tester_password_plain = os.environ.get('TESTER_PASSWORD', '')
        
        # Production gate for tester account
        is_production = os.environ.get('ENVIRONMENT', 'development').lower() == 'production'
        enable_tester = os.environ.get('ENABLE_TESTER_LOGIN', 'false').lower() == 'true'
        
        self._tester_enabled = True
        if is_production and not enable_tester:
            self._tester_enabled = False
            import logging
            logging.getLogger(__name__).info(
                "Tester account DISABLED in production. "
                "Set ENABLE_TESTER_LOGIN=true to enable (not recommended)."
            )
        elif is_production and enable_tester:
            import logging
            logging.getLogger(__name__).warning(
                "SECURITY: Tester account ENABLED in production via ENABLE_TESTER_LOGIN=true. "
                "This is not recommended for production environments."
            )
        
        self.trial_days = int(os.environ.get('TRIAL_DAYS', 3))
    
    def _verify_special_account_password(self, password: str, stored_hash: str, fallback_plain: str) -> bool:
        """
        Verify password for special accounts (admin/tester).
        
        SECURITY BEHAVIOR:
        - Production (ENVIRONMENT=production): ONLY accepts bcrypt hash verification
        - Non-production: Falls back to plain text comparison for development convenience
        
        Args:
            password: The password attempt
            stored_hash: The bcrypt hash from environment (ADMIN_PASSWORD_HASH/TESTER_PASSWORD_HASH)
            fallback_plain: Plain text password (ADMIN_PASSWORD/TESTER_PASSWORD) - ignored in production
        
        Returns:
            True if password is valid, False otherwise
        """
        import logging
        logger = logging.getLogger(__name__)
        
        is_production = os.environ.get('ENVIRONMENT', 'development').lower() == 'production'
        
        # SECURITY: In production, ONLY accept hash verification
        if is_production:
            if fallback_plain:
                logger.warning(
                    "SECURITY WARNING: Plain text password env var detected in production. "
                    "Use ADMIN_PASSWORD_HASH or TESTER_PASSWORD_HASH instead. "
                    "Plain text passwords are ignored in production mode."
                )
            
            if not stored_hash:
                logger.error("No password hash configured for special account in production mode")
                return False
            
            try:
                clean_hash = stored_hash.strip('"\'')
                result = bcrypt.checkpw(password.encode('utf-8'), clean_hash.encode('utf-8'))
                if result:
                    logger.info("Password verified via bcrypt hash (production mode)")
                return result
            except Exception as e:
                logger.error(f"Hash verification error in production: {e}")
                return False
        
        # Non-production: Try hash first, then fall back to plain text
        if stored_hash:
            try:
                clean_hash = stored_hash.strip('"\'')
                result = bcrypt.checkpw(password.encode('utf-8'), clean_hash.encode('utf-8'))
                if result:
                    logger.info("Password verified via bcrypt hash")
                    return True
            except Exception as e:
                logger.debug(f"Hash verification failed, trying plain text: {e}")
        
        # Development fallback: plain text comparison
        if fallback_plain and password == fallback_plain:
            logger.info("Password verified via plain text match (development mode only)")
            return True
        
        return False
    
    def validate_password_strength(self, password: str) -> tuple[bool, str]:
        """
        Validate password meets security requirements.
        
        Requirements:
        - Minimum 8 characters
        - At least one uppercase letter
        - At least one lowercase letter
        - At least one digit
        - At least one special character
        
        Returns:
            Tuple of (is_valid, error_message)
        """
        if len(password) < 8:
            return False, "Password must be at least 8 characters long"
        
        if not re.search(r'[A-Z]', password):
            return False, "Password must contain at least one uppercase letter"
        
        if not re.search(r'[a-z]', password):
            return False, "Password must contain at least one lowercase letter"
        
        if not re.search(r'\d', password):
            return False, "Password must contain at least one digit"
        
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            return False, "Password must contain at least one special character (!@#$%^&*(),.?\":{}|<>)"
        
        # Check for common weak passwords
        weak_passwords = ['password', '12345678', 'qwerty', 'letmein', 'welcome', 'admin123']
        if password.lower() in weak_passwords:
            return False, "Password is too common. Please choose a stronger password."
        
        return True, ""
    
    def hash_password(self, password: str) -> str:
        """
        Hash a password using bcrypt with auto-generated salt.
        
        Args:
            password: Plain text password
        Returns:
            Hashed password string
        """
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
    
    def verify_password(self, password: str, hashed_password: str) -> bool:
        """Verify a password against its hash"""
        return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))
    
    def create_access_token(self, user_id: str, is_admin: bool = False) -> str:
        """Create a JWT access token"""
        expire = datetime.now(timezone.utc) + timedelta(minutes=self.access_token_expire)
        payload = {
            'sub': user_id,
            'is_admin': is_admin,
            'type': 'access',
            'exp': expire,
            'iat': datetime.now(timezone.utc)
        }
        return jwt.encode(payload, self.jwt_secret, algorithm=self.jwt_algorithm)
    
    def create_refresh_token(self, user_id: str, remember_me: bool = False) -> str:
        """
        Create a JWT refresh token.
        
        Args:
            user_id: User's unique identifier
            remember_me: If True, uses longer expiry (configured days). 
                        If False, uses shorter expiry (1 day) for better security.
        """
        # Shorter expiry for non-remembered sessions (better security)
        if remember_me:
            expiry_days = self.refresh_token_expire  # Default: 7 days
        else:
            expiry_days = 1  # 1 day for non-remembered sessions
        
        expire = datetime.now(timezone.utc) + timedelta(days=expiry_days)
        
        # Add jti (JWT ID) for token revocation support
        import uuid
        jti = str(uuid.uuid4())
        
        payload = {
            'sub': user_id,
            'type': 'refresh',
            'exp': expire,
            'iat': datetime.now(timezone.utc),
            'jti': jti  # Unique token ID for future revocation support
        }
        return jwt.encode(payload, self.jwt_secret, algorithm=self.jwt_algorithm)
    
    def decode_token(self, token: str) -> Optional[dict]:
        """Decode and validate a JWT token"""
        try:
            payload = jwt.decode(token, self.jwt_secret, algorithms=[self.jwt_algorithm])
            return payload
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None
    
    async def revoke_token(self, jti: str, user_id: str, reason: str = "logout") -> bool:
        """
        Revoke a refresh token by its JTI (JWT ID).
        
        Stores the JTI in a revoked_tokens collection to prevent reuse.
        
        Args:
            jti: The JWT ID of the token to revoke
            user_id: The user ID associated with the token
            reason: Reason for revocation (e.g., 'logout', 'device_revoked', 'password_changed')
        
        Returns:
            True if successfully revoked, False otherwise
        """
        try:
            await self.db.revoked_tokens.insert_one({
                'jti': jti,
                'user_id': user_id,
                'revoked_at': datetime.now(timezone.utc).isoformat(),
                'reason': reason,
                # Auto-expire after 30 days (tokens expire in 7 days max, so this is safe)
                'expires_at': (datetime.now(timezone.utc) + timedelta(days=30)).isoformat()
            })
            return True
        except Exception as e:
            import logging
            logging.error(f"Failed to revoke token: {e}")
            return False
    
    async def is_token_revoked(self, jti: str) -> bool:
        """
        Check if a token has been revoked.
        
        Args:
            jti: The JWT ID to check
        
        Returns:
            True if the token is revoked, False otherwise
        """
        if not jti:
            return False
        
        revoked = await self.db.revoked_tokens.find_one({'jti': jti})
        return revoked is not None
    
    async def revoke_all_user_tokens(self, user_id: str, reason: str = "password_changed") -> int:
        """
        Revoke all active refresh tokens for a user.
        
        Used when password is changed or user requests logout from all devices.
        
        Args:
            user_id: The user ID whose tokens should be revoked
            reason: Reason for revocation
        
        Returns:
            Number of device sessions revoked
        """
        try:
            # Get all active device sessions for the user
            sessions = await self.db.user_devices.find({'user_id': user_id}).to_list(length=100)
            
            # Mark all sessions as revoked
            for session in sessions:
                if session.get('refresh_token_jti'):
                    await self.revoke_token(session['refresh_token_jti'], user_id, reason)
            
            return len(sessions)
        except Exception as e:
            import logging
            logging.error(f"Failed to revoke all user tokens: {e}")
            return 0
    
    async def create_user(self, user_data: UserCreate) -> Tuple[User, Optional[str]]:
        """Create a new user with optional trial subscription"""
        email_lower = user_data.email.lower()
        
        # Check if user already exists
        existing = await self.db.users.find_one({'email': email_lower})
        if existing:
            return None, 'Email already registered'
        
        # Check if this is the admin account
        is_admin = email_lower == self.admin_email
        
        # Create user
        user = User(
            email=email_lower,
            name=user_data.name,
            hashed_password=self.hash_password(user_data.password),
            is_admin=is_admin
        )
        
        user_dict = user.model_dump()
        user_dict['created_at'] = user_dict['created_at'].isoformat()
        user_dict['updated_at'] = user_dict['updated_at'].isoformat()
        
        await self.db.users.insert_one(user_dict)
        
        # Create trial subscription for non-admin users
        if not is_admin:
            trial_ends = datetime.now(timezone.utc) + timedelta(days=self.trial_days)
            subscription = Subscription(
                user_id=user.id,
                plan_name=PlanType.TRIAL,
                status=SubscriptionStatus.TRIAL,
                started_at=datetime.now(timezone.utc),
                trial_ends_at=trial_ends
            )
            sub_dict = subscription.model_dump()
            for key in ['started_at', 'trial_ends_at', 'created_at', 'updated_at']:
                if sub_dict.get(key):
                    sub_dict[key] = sub_dict[key].isoformat()
            await self.db.subscriptions.insert_one(sub_dict)
        
        return user, None
    
    async def authenticate_user(self, email: str, password: str) -> Tuple[Optional[User], Optional[str]]:
        """
        Authenticate a user by email and password.
        
        AUTHENTICATION FLOW:
        1. Check if admin account -> validate against hardcoded credentials
        2. Check if tester account -> validate against hardcoded credentials  
        3. Regular user -> validate against database hashed password
        
        Args:
            email: User's email (case-insensitive)
            password: Plain text password
            
        Returns:
            Tuple of (User object, error message)
            - Success: (User, None)
            - Failure: (None, "Invalid credentials")
        """
        email_lower = email.lower()
        
        # =================================================================
        # ADMIN LOGIN - Hardcoded bypass for admin account
        # Admin has full access including admin dashboard
        # =================================================================
        if email_lower == self.admin_email:
            if self._verify_special_account_password(password, self._admin_password_hash, self._admin_password_plain):
                # Check if admin exists in DB, if not create it
                admin_doc = await self.db.users.find_one({'email': email_lower})
                if not admin_doc:
                    admin_user = User(
                        email=email_lower,
                        name='Administrator',
                        hashed_password=self.hash_password(password),
                        is_admin=True
                    )
                    admin_dict = admin_user.model_dump()
                    admin_dict['created_at'] = admin_dict['created_at'].isoformat()
                    admin_dict['updated_at'] = admin_dict['updated_at'].isoformat()
                    await self.db.users.insert_one(admin_dict)
                    return admin_user, None
                else:
                    admin_doc['created_at'] = datetime.fromisoformat(admin_doc['created_at']) if isinstance(admin_doc['created_at'], str) else admin_doc['created_at']
                    admin_doc['updated_at'] = datetime.fromisoformat(admin_doc['updated_at']) if isinstance(admin_doc['updated_at'], str) else admin_doc['updated_at']
                    return User(**admin_doc), None
            else:
                return None, 'Invalid credentials'
        
        # =================================================================
        # TESTER LOGIN - Full access but no admin dashboard
        # SECURITY: Disabled in production unless ENABLE_TESTER_LOGIN=true
        # =================================================================
        if email_lower == self.tester_email and self._tester_enabled:
            if self._verify_special_account_password(password, self._tester_password_hash, self._tester_password_plain):
                # Check if tester exists in DB, if not create it
                tester_doc = await self.db.users.find_one({'email': email_lower})
                if not tester_doc:
                    tester_user = User(
                        email=email_lower,
                        name='Tester',
                        hashed_password=self.hash_password(password),
                        is_admin=False  # Tester has no admin access
                    )
                    tester_dict = tester_user.model_dump()
                    tester_dict['created_at'] = tester_dict['created_at'].isoformat()
                    tester_dict['updated_at'] = tester_dict['updated_at'].isoformat()
                    await self.db.users.insert_one(tester_dict)
                    
                    # Create active subscription for tester (bypasses trial)
                    subscription = Subscription(
                        user_id=tester_user.id,
                        plan_name=PlanType.ANNUAL,  # Full access
                        status=SubscriptionStatus.ACTIVE,
                        started_at=datetime.now(timezone.utc),
                        expires_at=datetime.now(timezone.utc) + timedelta(days=365*10)  # 10 years
                    )
                    sub_dict = subscription.model_dump()
                    for key in ['started_at', 'expires_at', 'trial_ends_at', 'created_at', 'updated_at']:
                        if sub_dict.get(key):
                            sub_dict[key] = sub_dict[key].isoformat()
                    await self.db.subscriptions.insert_one(sub_dict)
                    
                    return tester_user, None
                else:
                    tester_doc['created_at'] = datetime.fromisoformat(tester_doc['created_at']) if isinstance(tester_doc['created_at'], str) else tester_doc['created_at']
                    tester_doc['updated_at'] = datetime.fromisoformat(tester_doc['updated_at']) if isinstance(tester_doc['updated_at'], str) else tester_doc['updated_at']
                    return User(**tester_doc), None
            else:
                return None, 'Invalid credentials'
        
        # Regular user login
        user_doc = await self.db.users.find_one({'email': email_lower})
        if not user_doc:
            return None, 'Invalid credentials'
        
        if not self.verify_password(password, user_doc['hashed_password']):
            return None, 'Invalid credentials'
        
        user_doc['created_at'] = datetime.fromisoformat(user_doc['created_at']) if isinstance(user_doc['created_at'], str) else user_doc['created_at']
        user_doc['updated_at'] = datetime.fromisoformat(user_doc['updated_at']) if isinstance(user_doc['updated_at'], str) else user_doc['updated_at']
        
        return User(**user_doc), None
    
    async def get_user_by_id(self, user_id: str) -> Optional[User]:
        """Get a user by their ID"""
        user_doc = await self.db.users.find_one({'id': user_id}, {'_id': 0})
        if not user_doc:
            return None
        
        user_doc['created_at'] = datetime.fromisoformat(user_doc['created_at']) if isinstance(user_doc['created_at'], str) else user_doc['created_at']
        user_doc['updated_at'] = datetime.fromisoformat(user_doc['updated_at']) if isinstance(user_doc['updated_at'], str) else user_doc['updated_at']
        
        return User(**user_doc)
    
    async def get_user_with_subscription(self, user_id: str) -> Optional[UserResponse]:
        """Get user with their subscription status"""
        user = await self.get_user_by_id(user_id)
        if not user:
            return None
        
        # Admin always has full access
        if user.is_admin:
            return UserResponse(
                id=user.id,
                email=user.email,
                name=user.name,
                is_admin=True,
                is_active=user.is_active,
                created_at=user.created_at,
                has_active_subscription=True,
                subscription_plan='Admin',
                subscription_status='active'
            )
        
        # Tester account has permanent full access (no subscription needed)
        if user.email == self.tester_email:
            return UserResponse(
                id=user.id,
                email=user.email,
                name=user.name,
                is_admin=False,
                is_active=user.is_active,
                created_at=user.created_at,
                has_active_subscription=True,
                subscription_plan=None,
                subscription_status=None
            )
        
        # Get subscription
        sub_doc = await self.db.subscriptions.find_one(
            {'user_id': user_id},
            {'_id': 0},
            sort=[('created_at', -1)]
        )
        
        has_active = False
        plan_name = None
        status = None
        trial_ends = None
        renews_at = None
        
        if sub_doc:
            status = sub_doc.get('status')
            plan_name = sub_doc.get('plan_name')
            
            if sub_doc.get('trial_ends_at'):
                trial_ends = datetime.fromisoformat(sub_doc['trial_ends_at']) if isinstance(sub_doc['trial_ends_at'], str) else sub_doc['trial_ends_at']
                # Make timezone-aware if naive
                if trial_ends and trial_ends.tzinfo is None:
                    trial_ends = trial_ends.replace(tzinfo=timezone.utc)
            if sub_doc.get('renews_at'):
                renews_at = datetime.fromisoformat(sub_doc['renews_at']) if isinstance(sub_doc['renews_at'], str) else sub_doc['renews_at']
                # Make timezone-aware if naive
                if renews_at and renews_at.tzinfo is None:
                    renews_at = renews_at.replace(tzinfo=timezone.utc)
            
            now = datetime.now(timezone.utc)
            
            if status == 'trial':
                if trial_ends and trial_ends > now:
                    has_active = True
                else:
                    # Trial expired
                    await self.db.subscriptions.update_one(
                        {'id': sub_doc['id']},
                        {'$set': {'status': 'expired', 'updated_at': now.isoformat()}}
                    )
                    status = 'expired'
            elif status == 'active':
                if renews_at and renews_at > now:
                    has_active = True
                else:
                    # Subscription expired
                    await self.db.subscriptions.update_one(
                        {'id': sub_doc['id']},
                        {'$set': {'status': 'expired', 'updated_at': now.isoformat()}}
                    )
                    status = 'expired'
        
        return UserResponse(
            id=user.id,
            email=user.email,
            name=user.name,
            is_admin=user.is_admin,
            is_active=user.is_active,
            created_at=user.created_at,
            has_active_subscription=has_active,
            subscription_plan=plan_name,
            subscription_status=status,
            trial_ends_at=trial_ends,
            subscription_renews_at=renews_at
        )
