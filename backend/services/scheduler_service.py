"""
=============================================================================
SCHEDULER SERVICE - Automated Task Scheduling
=============================================================================
This service handles scheduled background tasks including:
- Subscription renewal reminders (daily at 9 AM UTC)
- Future: Automated cleanup, reports, etc.

Uses APScheduler for reliable job scheduling with persistence.
=============================================================================
"""

import os
import logging
from datetime import datetime, timezone
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from motor.motor_asyncio import AsyncIOMotorClient

logger = logging.getLogger(__name__)


class SchedulerService:
    """
    Scheduler service for automated background tasks.
    Integrates with APScheduler for cron-based job execution.
    """
    
    def __init__(self, db):
        """
        Initialize the scheduler service.
        
        Args:
            db: MongoDB database instance
        """
        self.db = db
        self.scheduler = AsyncIOScheduler(timezone='UTC')
        self._is_running = False
        
    async def send_renewal_reminders_job(self):
        """
        Scheduled job to send subscription renewal reminders.
        Runs daily and sends reminders to users whose subscriptions expire in 7 days.
        """
        logger.info(f"[SCHEDULER] Running renewal reminders job at {datetime.now(timezone.utc)}")
        
        try:
            # Import here to avoid circular imports
            from services.subscription_service import SubscriptionService
            
            subscription_service = SubscriptionService(self.db)
            
            # Send reminders for subscriptions expiring in 7 days (one week)
            results = await subscription_service.send_renewal_reminders(days_before=7)
            
            # Log results
            logger.info(f"[SCHEDULER] Renewal reminders job completed: "
                       f"checked={results.get('checked', 0)}, "
                       f"reminders_sent={results.get('reminders_sent', 0)}, "
                       f"trials_sent={results.get('trials_sent', 0)}, "
                       f"skipped={results.get('skipped', 0)}, "
                       f"errors={len(results.get('errors', []))}")
            
            # Store job execution log
            await self.db.scheduler_logs.insert_one({
                'job_name': 'renewal_reminders',
                'executed_at': datetime.now(timezone.utc).isoformat(),
                'results': results,
                'status': 'success' if not results.get('errors') else 'partial_success'
            })
            
            return results
            
        except Exception as e:
            logger.error(f"[SCHEDULER] Error in renewal reminders job: {e}")
            
            # Log error
            await self.db.scheduler_logs.insert_one({
                'job_name': 'renewal_reminders',
                'executed_at': datetime.now(timezone.utc).isoformat(),
                'error': str(e),
                'status': 'error'
            })
            
            return {'error': str(e)}
    
    def start(self):
        """
        Start the scheduler and register all jobs.
        """
        if self._is_running:
            logger.warning("[SCHEDULER] Scheduler is already running")
            return
            
        try:
            # Add renewal reminders job - runs daily at 9:00 AM UTC
            self.scheduler.add_job(
                self.send_renewal_reminders_job,
                trigger=CronTrigger(hour=9, minute=0, timezone='UTC'),
                id='renewal_reminders',
                name='Send Subscription Renewal Reminders',
                replace_existing=True
            )
            
            # Start the scheduler
            self.scheduler.start()
            self._is_running = True
            
            logger.info("[SCHEDULER] Scheduler started successfully")
            logger.info("[SCHEDULER] Jobs registered:")
            for job in self.scheduler.get_jobs():
                logger.info(f"  - {job.id}: {job.name} (next run: {job.next_run_time})")
                
        except Exception as e:
            logger.error(f"[SCHEDULER] Failed to start scheduler: {e}")
            raise
    
    def stop(self):
        """
        Stop the scheduler gracefully.
        """
        if self._is_running:
            self.scheduler.shutdown(wait=False)
            self._is_running = False
            logger.info("[SCHEDULER] Scheduler stopped")
    
    def get_jobs(self):
        """
        Get list of all scheduled jobs with their next run times.
        
        Returns:
            List of job information dictionaries
        """
        jobs = []
        for job in self.scheduler.get_jobs():
            jobs.append({
                'id': job.id,
                'name': job.name,
                'next_run_time': job.next_run_time.isoformat() if job.next_run_time else None,
                'trigger': str(job.trigger)
            })
        return jobs
    
    async def run_job_now(self, job_id: str):
        """
        Manually trigger a job to run immediately.
        
        Args:
            job_id: ID of the job to run
            
        Returns:
            Job execution result
        """
        if job_id == 'renewal_reminders':
            return await self.send_renewal_reminders_job()
        else:
            raise ValueError(f"Unknown job ID: {job_id}")


# Global scheduler instance (initialized in server.py)
scheduler_service = None


def get_scheduler() -> SchedulerService:
    """Get the global scheduler service instance."""
    return scheduler_service


def init_scheduler(db) -> SchedulerService:
    """
    Initialize the global scheduler service.
    
    Args:
        db: MongoDB database instance
        
    Returns:
        Initialized SchedulerService instance
    """
    global scheduler_service
    scheduler_service = SchedulerService(db)
    return scheduler_service
