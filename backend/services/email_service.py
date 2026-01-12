"""
=============================================================================
EMAIL SERVICE - SMTP Email Functionality
=============================================================================
This service handles all email-related operations including:
- Welcome emails for new user registration
- Password reset emails with secure tokens
- Subscription change notifications
- General email sending via SMTP

CONFIGURATION: Uses Microsoft Exchange SMTP via GoDaddy
- SMTP_SERVER: smtp.office365.com
- SMTP_PORT: 587 (STARTTLS)
- SMTP_USERNAME: admin@pedotg.com (for authentication)
- SMTP_EMAIL: noreply@pedotg.com (for sending/From address)

NOTE: Authentication uses SMTP_USERNAME, but emails are sent FROM SMTP_EMAIL (alias)
=============================================================================
"""

import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
import logging

logger = logging.getLogger(__name__)


class EmailService:
    """
    Email service for sending transactional emails via SMTP.
    Supports authentication with a primary account while sending from an alias.
    """
    
    def __init__(self):
        """
        Initialize EmailService with SMTP configuration from environment.
        
        Environment Variables:
            - SMTP_SERVER: SMTP server address (default: smtp.office365.com)
            - SMTP_PORT: SMTP port (default: 587 for STARTTLS)
            - SMTP_USERNAME: Account for authentication (e.g., admin@pedotg.com)
            - SMTP_EMAIL: Alias/address to send from (e.g., noreply@pedotg.com)
            - SMTP_PASSWORD: Password for SMTP_USERNAME account
        """
        self.smtp_server = os.environ.get('SMTP_SERVER', 'smtp.office365.com')
        self.smtp_port = int(os.environ.get('SMTP_PORT', 587))
        self.smtp_username = os.environ.get('SMTP_USERNAME', 'admin@pedotg.com')  # For authentication
        self.smtp_email = os.environ.get('SMTP_EMAIL', 'noreply@pedotg.com')  # For sending (From address)
        self.smtp_password = os.environ.get('SMTP_PASSWORD', '')
        self.app_name = "Pediatrics On The Go"
        self.frontend_url = os.environ.get('FRONTEND_URL', 'https://pedotg-repair.preview.emergentagent.com')
        self.logo_url = f"{self.frontend_url}/icon.svg"
    
    def _send_email(self, to_email: str, subject: str, html_body: str, text_body: str = None) -> bool:
        """
        Send an email via SMTP.
        
        Authentication: Uses SMTP_USERNAME + SMTP_PASSWORD
        Sending From: Uses SMTP_EMAIL (alias)
        
        Args:
            to_email: Recipient email address
            subject: Email subject line
            html_body: HTML content of the email
            text_body: Plain text fallback (optional)
            
        Returns:
            True if email sent successfully, False otherwise
        """
        if not self.smtp_password:
            logger.error("SMTP password not configured")
            return False
        
        try:
            # Create message
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = f"{self.app_name} <{self.smtp_email}>"  # Send FROM alias
            msg['To'] = to_email
            
            # Add plain text and HTML parts
            if text_body:
                msg.attach(MIMEText(text_body, 'plain'))
            msg.attach(MIMEText(html_body, 'html'))
            
            # Connect and send
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()  # Enable STARTTLS
                # Authenticate with primary account (SMTP_USERNAME)
                server.login(self.smtp_username, self.smtp_password)
                # Send from alias (SMTP_EMAIL)
                server.sendmail(self.smtp_email, to_email, msg.as_string())
            
            logger.info(f"Email sent successfully to {to_email}")
            return True
            
        except smtplib.SMTPAuthenticationError as e:
            logger.error(f"SMTP Authentication failed: {e}")
            return False
        except smtplib.SMTPException as e:
            logger.error(f"SMTP error sending email: {e}")
            return False
        except Exception as e:
            logger.error(f"Error sending email: {e}")
            return False
    
    def send_welcome_email(self, to_email: str, user_name: str) -> bool:
        """
        Send a welcome email to newly registered users.
        
        Args:
            to_email: User's email address
            user_name: User's display name
        """
        subject = f"Welcome to {self.app_name}!"
        
        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #00d9c5 0%, #00b4a0 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .header img {{ width: 60px; height: 60px; margin-bottom: 10px; }}
                .header h1 {{ color: white; margin: 0; font-size: 22px; }}
                .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="{self.logo_url}" alt="Logo" />
                    <h1>Welcome to {self.app_name}!</h1>
                </div>
                <div class="content">
                    <p>Hi <strong>{user_name}</strong>,</p>
                    <p>Thank you for joining! You now have access to pediatric medical calculators for NICU and Children's ward.</p>
                    <p>Best regards,<br>The {self.app_name} Team</p>
                </div>
                <div class="footer">
                    <p>© 2026 {self.app_name}. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        text_body = f"""
        Welcome to {self.app_name}!
        
        Hi {user_name},
        
        Thank you for joining! You now have access to pediatric medical calculators for NICU and Children's ward.
        
        Best regards,
        The {self.app_name} Team
        
        © 2026 {self.app_name}. All rights reserved.
        """
        
        return self._send_email(to_email, subject, html_body, text_body)
    
    def send_password_reset_email(self, to_email: str, user_name: str, reset_token: str, frontend_url: str) -> bool:
        """
        Send a password reset email with a secure link.
        
        Args:
            to_email: User's email address
            user_name: User's display name
            reset_token: Secure token for password reset
            frontend_url: Base URL of the frontend app
        """
        reset_link = f"{frontend_url}/reset-password?token={reset_token}"
        subject = f"Reset Your Password - {self.app_name}"
        
        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #00d9c5 0%, #00b4a0 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .header img {{ width: 60px; height: 60px; margin-bottom: 10px; }}
                .header h1 {{ color: white; margin: 0; font-size: 22px; }}
                .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                .button {{ display: inline-block; background: #00d9c5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; font-weight: bold; }}
                .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
                .warning {{ background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 5px; margin: 15px 0; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="{self.logo_url}" alt="Logo" />
                    <h1>Password Reset</h1>
                </div>
                <div class="content">
                    <p>Hi <strong>{user_name}</strong>,</p>
                    <p>Click the button below to reset your password:</p>
                    <p style="text-align: center;">
                        <a href="{reset_link}" class="button">Reset Password</a>
                    </p>
                    <div class="warning">
                        <strong>⚠️</strong> This link expires in 1 hour.
                    </div>
                    <p>If you didn't request this, ignore this email.</p>
                </div>
                <div class="footer">
                    <p style="word-break: break-all; font-size: 10px;">{reset_link}</p>
                    <p>© 2026 {self.app_name}. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        text_body = f"""
        Password Reset - {self.app_name}
        
        Hi {user_name},
        
        Click this link to reset your password:
        {reset_link}
        
        This link expires in 1 hour.
        
        If you didn't request this, ignore this email.
        
        © 2026 {self.app_name}. All rights reserved.
        """
        
        return self._send_email(to_email, subject, html_body, text_body)
    
    def send_subscription_change_email(self, to_email: str, user_name: str, plan_name: str, renews_at: str) -> bool:
        """
        Send a subscription change notification email.
        
        Args:
            to_email: User's email address
            user_name: User's display name
            plan_name: Name of the subscription plan (e.g., "Monthly", "Annual")
            renews_at: Formatted renewal date string (e.g., "January 15, 2026")
        """
        subject = f"Subscription Confirmed - {self.app_name}"
        
        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #00d9c5 0%, #00b4a0 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .header img {{ width: 60px; height: 60px; margin-bottom: 10px; }}
                .header h1 {{ color: white; margin: 0; font-size: 22px; }}
                .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                .plan-box {{ background: white; border: 2px solid #00d9c5; border-radius: 10px; padding: 20px; margin: 20px 0; text-align: center; }}
                .plan-name {{ font-size: 24px; font-weight: bold; color: #00d9c5; margin-bottom: 10px; }}
                .plan-detail {{ color: #666; font-size: 14px; }}
                .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
                .checkmark {{ color: #00d9c5; font-size: 48px; margin-bottom: 10px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="{self.logo_url}" alt="Logo" />
                    <h1>Subscription Confirmed!</h1>
                </div>
                <div class="content">
                    <p>Hi <strong>{user_name}</strong>,</p>
                    <p>Your subscription has been activated.</p>
                    
                    <div class="plan-box">
                        <div class="checkmark">✓</div>
                        <div class="plan-name">{plan_name} Plan</div>
                        <div class="plan-detail">Renews: <strong>{renews_at}</strong></div>
                    </div>
                    
                    <p>Thank you for subscribing!</p>
                </div>
                <div class="footer">
                    <p>© 2026 {self.app_name}. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        text_body = f"""
        Subscription Confirmed - {self.app_name}
        
        Hi {user_name},
        
        Your subscription has been activated.
        
        Plan: {plan_name}
        Renews: {renews_at}
        
        Thank you for subscribing!
        
        © 2026 {self.app_name}. All rights reserved.
        """
        
        return self._send_email(to_email, subject, html_body, text_body)


# Singleton instance
email_service = EmailService()
