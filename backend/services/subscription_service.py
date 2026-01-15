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
            
            # Send subscription confirmation email
            await self._send_subscription_email(user_id, plan_name, renews_at)
            
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
            
            # Send subscription confirmation email
            await self._send_subscription_email(user_id, plan_name, renews_at)
            
            return subscription
    
    async def _send_subscription_email(self, user_id: str, plan_name: PlanType, renews_at: datetime) -> None:
        """
        Send subscription confirmation email to user.
        
        Args:
            user_id: User's ID
            plan_name: Subscription plan type
            renews_at: Renewal date
        """
        try:
            # Fetch user details
            user = await self.db.users.find_one({'id': user_id}, {'_id': 0, 'email': 1, 'name': 1})
            
            if not user:
                logger.warning(f"User not found for subscription email: {user_id}")
                return
            
            # Format plan name for display
            plan_display = plan_name.value.capitalize() if hasattr(plan_name, 'value') else str(plan_name).capitalize()
            
            # Format renewal date (e.g., "January 15, 2026")
            renews_at_str = renews_at.strftime("%B %d, %Y")
            
            # Send email
            success = email_service.send_subscription_change_email(
                to_email=user['email'],
                user_name=user.get('name', 'User'),
                plan_name=plan_display,
                renews_at=renews_at_str
            )
            
            if success:
                logger.info(f"Subscription email sent to {user['email']}")
            else:
                logger.warning(f"Failed to send subscription email to {user['email']}")
                
        except Exception as e:
            # Log error but don't break subscription creation
            logger.error(f"Error sending subscription email: {e}")
    
    async def cancel_subscription(self, user_id: str) -> Tuple[bool, str]:
        """
        Cancel a user's subscription.
        The subscription remains active until the current period ends.
        Sends cancellation confirmation email to user.
        """
        sub = await self.get_user_subscription(user_id)
        
        if not sub:
            return False, 'No subscription found'
        
        if sub.status in [SubscriptionStatus.CANCELED, SubscriptionStatus.EXPIRED]:
            return False, 'Subscription already canceled or expired'
        
        now = datetime.now(timezone.utc)
        
        # Determine when access ends
        access_until = sub.renews_at or sub.trial_ends_at or now
        
        await self.db.subscriptions.update_one(
            {'id': sub.id},
            {'$set': {
                'status': 'canceled',
                'canceled_at': now.isoformat(),
                'updated_at': now.isoformat()
            }}
        )
        
        # Send cancellation email
        try:
            user_doc = await self.db.users.find_one(
                {'id': user_id}, 
                {'_id': 0, 'email': 1, 'name': 1}
            )
            if user_doc:
                access_until_str = access_until.strftime("%B %d, %Y") if access_until else "N/A"
                email_service.send_subscription_canceled_email(
                    to_email=user_doc.get('email'),
                    user_name=user_doc.get('name', 'User'),
                    access_until=access_until_str
                )
                logger.info(f"Cancellation email sent to {user_doc.get('email')}")
        except Exception as e:
            logger.error(f"Failed to send cancellation email: {e}")
        
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

    async def send_renewal_reminders(self, days_before: int = 3) -> dict:
        """
        Send renewal reminder emails to users whose subscriptions are expiring soon.
        
        Args:
            days_before: Number of days before expiration to send reminder (default: 3)
            
        Returns:
            Dict with counts of emails sent and any errors
        """
        now = datetime.now(timezone.utc)
        reminder_window_start = now
        reminder_window_end = now + timedelta(days=days_before + 1)
        
        results = {
            'checked': 0,
            'reminders_sent': 0,
            'trials_sent': 0,
            'errors': [],
            'skipped': 0
        }
        
        try:
            # Find active subscriptions expiring within the window
            active_subs = await self.db.subscriptions.find({
                'status': 'active',
                'renews_at': {
                    '$gte': reminder_window_start.isoformat(),
                    '$lte': reminder_window_end.isoformat()
                }
            }, {'_id': 0}).to_list(None)
            
            # Find trial subscriptions expiring within the window
            trial_subs = await self.db.subscriptions.find({
                'status': 'trial',
                'trial_ends_at': {
                    '$gte': reminder_window_start.isoformat(),
                    '$lte': reminder_window_end.isoformat()
                }
            }, {'_id': 0}).to_list(None)
            
            results['checked'] = len(active_subs) + len(trial_subs)
            
            # Process active subscriptions
            for sub in active_subs:
                try:
                    user_id = sub.get('user_id')
                    renews_at_str = sub.get('renews_at')
                    plan_name = sub.get('plan_name', 'monthly')
                    
                    if not user_id or not renews_at_str:
                        results['skipped'] += 1
                        continue
                    
                    # Check if we already sent a reminder recently (within last 24 hours)
                    last_reminder = sub.get('last_reminder_sent')
                    if last_reminder:
                        last_reminder_dt = datetime.fromisoformat(last_reminder) if isinstance(last_reminder, str) else last_reminder
                        if now - last_reminder_dt < timedelta(hours=24):
                            results['skipped'] += 1
                            continue
                    
                    # Get user details
                    user = await self.db.users.find_one({'id': user_id}, {'_id': 0, 'email': 1, 'name': 1})
                    if not user:
                        results['skipped'] += 1
                        continue
                    
                    # Calculate days remaining
                    renews_at = datetime.fromisoformat(renews_at_str) if isinstance(renews_at_str, str) else renews_at_str
                    days_remaining = (renews_at - now).days
                    
                    if days_remaining < 0:
                        results['skipped'] += 1
                        continue
                    
                    # Format dates
                    expires_at_formatted = renews_at.strftime("%B %d, %Y")
                    plan_display = plan_name.capitalize() if isinstance(plan_name, str) else str(plan_name).capitalize()
                    
                    # Send reminder email
                    success = email_service.send_subscription_renewal_reminder_email(
                        to_email=user['email'],
                        user_name=user.get('name', 'User'),
                        plan_name=plan_display,
                        expires_at=expires_at_formatted,
                        days_remaining=days_remaining
                    )
                    
                    if success:
                        results['reminders_sent'] += 1
                        # Update last reminder sent timestamp
                        await self.db.subscriptions.update_one(
                            {'id': sub.get('id')},
                            {'$set': {'last_reminder_sent': now.isoformat()}}
                        )
                        logger.info(f"Renewal reminder sent to {user['email']} ({days_remaining} days remaining)")
                    else:
                        results['errors'].append(f"Failed to send to {user['email']}")
                        
                except Exception as e:
                    results['errors'].append(f"Error processing subscription: {str(e)}")
            
            # Process trial subscriptions
            for sub in trial_subs:
                try:
                    user_id = sub.get('user_id')
                    trial_ends_at_str = sub.get('trial_ends_at')
                    
                    if not user_id or not trial_ends_at_str:
                        results['skipped'] += 1
                        continue
                    
                    # Check if we already sent a reminder recently
                    last_reminder = sub.get('last_reminder_sent')
                    if last_reminder:
                        last_reminder_dt = datetime.fromisoformat(last_reminder) if isinstance(last_reminder, str) else last_reminder
                        if now - last_reminder_dt < timedelta(hours=24):
                            results['skipped'] += 1
                            continue
                    
                    # Get user details
                    user = await self.db.users.find_one({'id': user_id}, {'_id': 0, 'email': 1, 'name': 1})
                    if not user:
                        results['skipped'] += 1
                        continue
                    
                    # Calculate days remaining
                    trial_ends_at = datetime.fromisoformat(trial_ends_at_str) if isinstance(trial_ends_at_str, str) else trial_ends_at_str
                    days_remaining = (trial_ends_at - now).days
                    
                    if days_remaining < 0:
                        results['skipped'] += 1
                        continue
                    
                    # Format date
                    expires_at_formatted = trial_ends_at.strftime("%B %d, %Y")
                    
                    # Send trial reminder email
                    success = email_service.send_trial_expiring_reminder_email(
                        to_email=user['email'],
                        user_name=user.get('name', 'User'),
                        expires_at=expires_at_formatted,
                        days_remaining=days_remaining
                    )
                    
                    if success:
                        results['trials_sent'] += 1
                        # Update last reminder sent timestamp
                        await self.db.subscriptions.update_one(
                            {'id': sub.get('id')},
                            {'$set': {'last_reminder_sent': now.isoformat()}}
                        )
                        logger.info(f"Trial reminder sent to {user['email']} ({days_remaining} days remaining)")
                    else:
                        results['errors'].append(f"Failed to send trial reminder to {user['email']}")
                        
                except Exception as e:
                    results['errors'].append(f"Error processing trial subscription: {str(e)}")
            
        except Exception as e:
            logger.error(f"Error in send_renewal_reminders: {e}")
            results['errors'].append(str(e))
        
        return results
