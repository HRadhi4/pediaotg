"""
=============================================================================
EMAIL SERVICE - SMTP Email Functionality
=============================================================================
This service handles all email-related operations including:
- Welcome emails for new user registration
- Password reset emails with secure tokens
- General email sending via SMTP

CONFIGURATION: Uses Microsoft Exchange SMTP via GoDaddy
- SMTP_SERVER: smtp-mail.outlook.com
- SMTP_PORT: 587 (STARTTLS)
- SMTP_EMAIL: noreply@pedotg.com
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
    """
    
    def __init__(self):
        """
        Initialize EmailService with SMTP configuration from environment.
        """
        self.smtp_server = os.environ.get('SMTP_SERVER', 'smtp-mail.outlook.com')
        self.smtp_port = int(os.environ.get('SMTP_PORT', 587))
        self.smtp_email = os.environ.get('SMTP_EMAIL', 'noreply@pedotg.com')
        self.smtp_password = os.environ.get('SMTP_PASSWORD', '')
        self.app_name = "Pediatrics On The Go"
    
    def _send_email(self, to_email: str, subject: str, html_body: str, text_body: str = None) -> bool:
        """
        Send an email via SMTP.
        
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
            msg['From'] = f"{self.app_name} <{self.smtp_email}>"
            msg['To'] = to_email
            
            # Add plain text and HTML parts
            if text_body:
                msg.attach(MIMEText(text_body, 'plain'))
            msg.attach(MIMEText(html_body, 'html'))
            
            # Connect and send
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()  # Enable STARTTLS
                server.login(self.smtp_email, self.smtp_password)
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
        subject = f"Welcome to {self.app_name}! 🎉"
        
        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #00d9c5 0%, #00b4a0 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .header h1 {{ color: white; margin: 0; font-size: 24px; }}
                .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                .button {{ display: inline-block; background: #00d9c5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; }}
                .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Welcome to {self.app_name}!</h1>
                </div>
                <div class="content">
                    <p>Hi <strong>{user_name}</strong>,</p>
                    <p>Thank you for joining {self.app_name}! We're excited to have you on board.</p>
                    <p>Our app provides essential pediatric medical calculators and tools designed to help healthcare professionals deliver the best care for children.</p>
                    <p><strong>What you can do:</strong></p>
                    <ul>
                        <li>Access NICU calculators (fluid, TPN, growth charts)</li>
                        <li>Use pediatric drug dosing calculators</li>
                        <li>Calculate IV infusions and blood products</li>
                        <li>Reference CPR/PALS algorithms</li>
                    </ul>
                    <p>If you have any questions, feel free to reach out to our support team.</p>
                    <p>Best regards,<br>The {self.app_name} Team</p>
                </div>
                <div class="footer">
                    <p>© 2024 {self.app_name}. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        text_body = f"""
        Welcome to {self.app_name}!
        
        Hi {user_name},
        
        Thank you for joining {self.app_name}! We're excited to have you on board.
        
        Our app provides essential pediatric medical calculators and tools designed to help healthcare professionals deliver the best care for children.
        
        Best regards,
        The {self.app_name} Team
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
                .header h1 {{ color: white; margin: 0; font-size: 24px; }}
                .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                .button {{ display: inline-block; background: #00d9c5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; font-weight: bold; }}
                .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
                .warning {{ background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 5px; margin: 15px 0; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Password Reset Request</h1>
                </div>
                <div class="content">
                    <p>Hi <strong>{user_name}</strong>,</p>
                    <p>We received a request to reset your password for your {self.app_name} account.</p>
                    <p>Click the button below to reset your password:</p>
                    <p style="text-align: center;">
                        <a href="{reset_link}" class="button">Reset Password</a>
                    </p>
                    <div class="warning">
                        <strong>⚠️ Important:</strong> This link will expire in 1 hour for security reasons.
                    </div>
                    <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
                    <p>Best regards,<br>The {self.app_name} Team</p>
                </div>
                <div class="footer">
                    <p>If the button doesn't work, copy and paste this link into your browser:</p>
                    <p style="word-break: break-all;">{reset_link}</p>
                    <p>© 2024 {self.app_name}. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        text_body = f"""
        Password Reset Request
        
        Hi {user_name},
        
        We received a request to reset your password for your {self.app_name} account.
        
        Click this link to reset your password:
        {reset_link}
        
        This link will expire in 1 hour for security reasons.
        
        If you didn't request a password reset, you can safely ignore this email.
        
        Best regards,
        The {self.app_name} Team
        """
        
        return self._send_email(to_email, subject, html_body, text_body)


# Singleton instance
email_service = EmailService()
