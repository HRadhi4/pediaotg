from datetime import datetime, timedelta, timezone
from typing import Optional, Tuple
import os
import bcrypt
import jwt
from motor.motor_asyncio import AsyncIOMotorDatabase
from models.user import User, UserCreate, UserResponse
from models.subscription import Subscription, SubscriptionStatus, PlanType


class AuthService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.jwt_secret = os.environ.get('JWT_SECRET_KEY', 'default-secret-key')
        self.jwt_algorithm = os.environ.get('JWT_ALGORITHM', 'HS256')
        self.access_token_expire = int(os.environ.get('ACCESS_TOKEN_EXPIRE_MINUTES', 30))
        self.refresh_token_expire = int(os.environ.get('REFRESH_TOKEN_EXPIRE_DAYS', 7))
        self.admin_email = os.environ.get('ADMIN_EMAIL', 'admin@pedotg.com').lower()
        self.admin_password = os.environ.get('ADMIN_PASSWORD', 'SMC159951')
        self.tester_email = os.environ.get('TESTER_EMAIL', 'test@pedotg.com').lower()
        self.tester_password = os.environ.get('TESTER_PASSWORD', 'SMC2000')
        self.trial_days = int(os.environ.get('TRIAL_DAYS', 3))
    
    def hash_password(self, password: str) -> str:
        """Hash a password using bcrypt"""
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
    
    def create_refresh_token(self, user_id: str) -> str:
        """Create a JWT refresh token"""
        expire = datetime.now(timezone.utc) + timedelta(days=self.refresh_token_expire)
        payload = {
            'sub': user_id,
            'type': 'refresh',
            'exp': expire,
            'iat': datetime.now(timezone.utc)
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
        """Authenticate a user by email and password"""
        email_lower = email.lower()
        
        # Check for admin login
        if email_lower == self.admin_email:
            if password == self.admin_password:
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
        
        # Check for tester login (full access but no admin dashboard)
        if email_lower == self.tester_email:
            if password == self.tester_password:
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
            if sub_doc.get('renews_at'):
                renews_at = datetime.fromisoformat(sub_doc['renews_at']) if isinstance(sub_doc['renews_at'], str) else sub_doc['renews_at']
            
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
