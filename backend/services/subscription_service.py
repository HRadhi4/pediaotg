from datetime import datetime, timedelta, timezone
from typing import Optional, Tuple, List
from motor.motor_asyncio import AsyncIOMotorDatabase
from models.subscription import Subscription, SubscriptionStatus, PlanType, SubscriptionResponse
from services.email_service import email_service
import os
import logging

logger = logging.getLogger(__name__)


class SubscriptionService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.trial_days = int(os.environ.get('TRIAL_DAYS', 3))
    
    async def get_user_subscription(self, user_id: str) -> Optional[Subscription]:
        """Get the latest subscription for a user"""
        sub_doc = await self.db.subscriptions.find_one(
            {'user_id': user_id},
            {'_id': 0},
            sort=[('created_at', -1)]
        )
        
        if not sub_doc:
            return None
        
        # Convert datetime strings
        for key in ['started_at', 'trial_ends_at', 'renews_at', 'canceled_at', 'created_at', 'updated_at']:
            if sub_doc.get(key) and isinstance(sub_doc[key], str):
                sub_doc[key] = datetime.fromisoformat(sub_doc[key])
        
        return Subscription(**sub_doc)
    
    async def check_subscription_active(self, user_id: str, is_admin: bool = False) -> Tuple[bool, str]:
        """
        Check if a user has an active subscription
        
        Returns:
            Tuple of (is_active, reason)
        """
        # Admin always has access
        if is_admin:
            return True, 'admin'
        
        sub = await self.get_user_subscription(user_id)
        
        if not sub:
            return False, 'no_subscription'
        
        now = datetime.now(timezone.utc)
        
        if sub.status == SubscriptionStatus.TRIAL:
            if sub.trial_ends_at and sub.trial_ends_at > now:
                return True, 'trial'
            else:
                # Trial expired - update status
                await self.db.subscriptions.update_one(
                    {'id': sub.id},
                    {'$set': {'status': 'expired', 'updated_at': now.isoformat()}}
                )
                return False, 'trial_expired'
        
        elif sub.status == SubscriptionStatus.ACTIVE:
            if sub.renews_at and sub.renews_at > now:
                return True, 'active'
            else:
                # Subscription expired
                await self.db.subscriptions.update_one(
                    {'id': sub.id},
                    {'$set': {'status': 'expired', 'updated_at': now.isoformat()}}
                )
                return False, 'expired'
        
        elif sub.status == SubscriptionStatus.CANCELED:
            # Check if still within paid period
            if sub.renews_at and sub.renews_at > now:
                return True, 'canceled_but_active'
            return False, 'canceled'
        
        return False, 'expired'
    
    async def create_paid_subscription(
        self,
        user_id: str,
        plan_name: PlanType,
        gateway_order_id: str,
        gateway_customer_id: Optional[str] = None,
        capture_id: Optional[str] = None
    ) -> Subscription:
        """
        Create or update a subscription after successful payment
        """
        now = datetime.now(timezone.utc)
        
        # Calculate renewal date based on plan
        if plan_name == PlanType.MONTHLY:
            renews_at = now + timedelta(days=30)
        elif plan_name == PlanType.ANNUAL:
            renews_at = now + timedelta(days=365)
        else:
            renews_at = now + timedelta(days=30)  # Default
        
        # Check if user has existing subscription
        existing = await self.get_user_subscription(user_id)
        
        if existing:
            # Update existing subscription
            update_data = {
                'plan_name': plan_name,
                'status': 'active',
                'started_at': now.isoformat(),
                'renews_at': renews_at.isoformat(),
                'trial_ends_at': None,
                'gateway_order_id': gateway_order_id,
                'gateway_customer_id': gateway_customer_id,
                'gateway_subscription_id': capture_id,
                'updated_at': now.isoformat()
            }
            
            await self.db.subscriptions.update_one(
                {'id': existing.id},
                {'$set': update_data}
            )
            
            existing.plan_name = plan_name
            existing.status = SubscriptionStatus.ACTIVE
            existing.started_at = now
            existing.renews_at = renews_at
            existing.gateway_order_id = gateway_order_id
            existing.gateway_customer_id = gateway_customer_id
            existing.gateway_subscription_id = capture_id
            
            return existing
        else:
            # Create new subscription
            subscription = Subscription(
                user_id=user_id,
                plan_name=plan_name,
                status=SubscriptionStatus.ACTIVE,
                started_at=now,
                renews_at=renews_at,
                gateway_order_id=gateway_order_id,
                gateway_customer_id=gateway_customer_id,
                gateway_subscription_id=capture_id
            )
            
            sub_dict = subscription.model_dump()
            for key in ['started_at', 'renews_at', 'created_at', 'updated_at']:
                if sub_dict.get(key):
                    sub_dict[key] = sub_dict[key].isoformat()
            
            await self.db.subscriptions.insert_one(sub_dict)
            return subscription
    
    async def cancel_subscription(self, user_id: str) -> Tuple[bool, str]:
        """
        Cancel a user's subscription
        The subscription remains active until the current period ends
        """
        sub = await self.get_user_subscription(user_id)
        
        if not sub:
            return False, 'No subscription found'
        
        if sub.status in [SubscriptionStatus.CANCELED, SubscriptionStatus.EXPIRED]:
            return False, 'Subscription already canceled or expired'
        
        now = datetime.now(timezone.utc)
        
        await self.db.subscriptions.update_one(
            {'id': sub.id},
            {'$set': {
                'status': 'canceled',
                'canceled_at': now.isoformat(),
                'updated_at': now.isoformat()
            }}
        )
        
        return True, 'Subscription canceled. Access continues until current period ends.'
    
    async def change_plan(
        self,
        user_id: str,
        new_plan: PlanType,
        gateway_order_id: str,
        gateway_customer_id: Optional[str] = None,
        capture_id: Optional[str] = None
    ) -> Subscription:
        """
        Change a user's subscription plan
        """
        return await self.create_paid_subscription(
            user_id=user_id,
            plan_name=new_plan,
            gateway_order_id=gateway_order_id,
            gateway_customer_id=gateway_customer_id,
            capture_id=capture_id
        )
    
    async def handle_webhook_renewal(self, gateway_order_id: str) -> bool:
        """
        Handle subscription renewal from PayPal webhook
        
        TODO: Implement webhook handler for automatic renewals
        """
        sub_doc = await self.db.subscriptions.find_one(
            {'gateway_order_id': gateway_order_id},
            {'_id': 0}
        )
        
        if not sub_doc:
            return False
        
        now = datetime.now(timezone.utc)
        plan_name = sub_doc.get('plan_name')
        
        # Calculate new renewal date
        if plan_name == 'monthly':
            new_renews_at = now + timedelta(days=30)
        else:
            new_renews_at = now + timedelta(days=365)
        
        await self.db.subscriptions.update_one(
            {'gateway_order_id': gateway_order_id},
            {'$set': {
                'status': 'active',
                'renews_at': new_renews_at.isoformat(),
                'updated_at': now.isoformat()
            }}
        )
        
        return True
    
    async def handle_webhook_failed(self, gateway_order_id: str) -> bool:
        """
        Handle failed payment from PayPal webhook
        
        TODO: Implement webhook handler for failed payments
        """
        now = datetime.now(timezone.utc)
        
        result = await self.db.subscriptions.update_one(
            {'gateway_order_id': gateway_order_id},
            {'$set': {
                'status': 'expired',
                'updated_at': now.isoformat()
            }}
        )
        
        return result.modified_count > 0
    
    async def get_all_subscriptions(self, skip: int = 0, limit: int = 100) -> List[dict]:
        """Get all subscriptions (admin only)"""
        cursor = self.db.subscriptions.find({}, {'_id': 0}).skip(skip).limit(limit)
        subscriptions = await cursor.to_list(limit)
        return subscriptions
    
    async def get_subscription_stats(self) -> dict:
        """Get subscription statistics (admin only)"""
        pipeline = [
            {
                '$group': {
                    '_id': '$status',
                    'count': {'$sum': 1}
                }
            }
        ]
        
        results = await self.db.subscriptions.aggregate(pipeline).to_list(None)
        
        stats = {'total': 0, 'trial': 0, 'active': 0, 'canceled': 0, 'expired': 0}
        for r in results:
            status = r['_id']
            count = r['count']
            stats[status] = count
            stats['total'] += count
        
        return stats
