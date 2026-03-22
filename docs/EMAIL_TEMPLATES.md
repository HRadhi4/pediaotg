# Email Templates Documentation

## Overview

The application sends transactional emails via SMTP (Microsoft Exchange/Office 365). All emails use consistent branding with the PediaOTG logo and gradient header design.

**Configuration:**
- SMTP Server: `smtp.office365.com:587`
- From Address: `noreply@pedotg.com`
- Admin Notification Address: `ADMIN_EMAIL` env variable

---

## User Email Templates (6)

### 1. Welcome Email
**Trigger:** New user registration
**Method:** `send_welcome_email(to_email, user_name)`
**Subject:** `Welcome to Pediatrics On The Go!`

**Content:**
- Greeting with user's name
- Welcome message
- Brief description of available features
- Teal gradient header with logo

---

### 2. Password Reset Email
**Trigger:** User requests password reset via `/forgot-password`
**Method:** `send_password_reset_email(to_email, user_name, reset_token, frontend_url)`
**Subject:** `Reset Your Password - Pediatrics On The Go`

**Content:**
- Greeting with user's name
- Reset password button (teal)
- Warning: Link expires in 1 hour
- Fallback text link at bottom
- Yellow warning box for expiry notice

---

### 3. Subscription Confirmed Email
**Trigger:** Successful PayPal payment (new or renewal)
**Method:** `send_subscription_change_email(to_email, user_name, plan_name, renews_at)`
**Subject:** `Subscription Confirmed - Pediatrics On The Go`

**Content:**
- Greeting with user's name
- Green checkmark icon
- Plan name (Monthly/Annual)
- Renewal date
- Thank you message

---

### 4. Subscription Canceled Email
**Trigger:** User cancels subscription via PayPal
**Method:** `send_subscription_canceled_email(to_email, user_name, access_until)`
**Subject:** `Subscription Canceled - Pediatrics On The Go`

**Content:**
- Red gradient header
- Greeting with user's name
- Yellow info box showing access end date
- Encouragement to resubscribe
- "We hope to see you again" message

---

### 5. Subscription Renewal Reminder Email
**Trigger:** Scheduled job (daily at 9:00 AM UTC) for subscriptions expiring within configured days
**Method:** `send_subscription_renewal_reminder_email(to_email, user_name, plan_name, expires_at, days_remaining)`
**Subject:** `⏰ Subscription EXPIRES IN X DAYS - Pediatrics On The Go`

**Content:**
- Orange/yellow gradient header
- Urgency box with color-coded border:
  - Red: 1 day remaining
  - Yellow: 2-3 days remaining
  - Blue: 4-7 days remaining
  - Gray: 7+ days remaining
- Current plan info
- Warning about losing access
- "Renew Now" button
- Note about automatic PayPal renewal

---

### 6. Trial Expiring Reminder Email
**Trigger:** Scheduled job for trials expiring within configured days
**Method:** `send_trial_expiring_reminder_email(to_email, user_name, expires_at, days_remaining)`
**Subject:** `⏰ Free Trial EXPIRES IN X DAYS - Pediatrics On The Go`

**Content:**
- Purple gradient header
- Urgency box (red for 1 day, yellow for 2+ days)
- Feature list of what they'll lose:
  - NICU Calculators
  - Children's ER/Ward Tools
  - Blood Gas Analysis with OCR
  - Customizable Dashboard Layouts
- "Subscribe Now" button

---

## Admin Email Templates (2)

### 1. New User Registration Notification
**Trigger:** User completes registration
**Method:** `send_admin_new_registration_email(user_email, user_name)`
**Subject:** `🆕 New User Registration - Pediatrics On The Go`

**Content:**
- Green gradient header
- "NEW USER" badge
- User details box:
  - Name
  - Email
  - Registration timestamp
  - Trial status (3-day trial started)
- Note about trial period

---

### 2. Subscription Payment Notification
**Trigger:** Successful PayPal payment
**Method:** `send_admin_subscription_renewal_email(user_email, user_name, plan_name, amount, is_new)`
**Subject:** 
- New: `🎉 New Subscription - Pediatrics On The Go`
- Renewal: `🔄 Subscription Renewal - Pediatrics On The Go`

**Content:**
- Teal gradient header
- Badge: "NEW SUBSCRIPTION" or "RENEWAL"
- User details:
  - Name
  - Email
  - Plan (Monthly/Annual)
  - Transaction timestamp
- Large payment amount display
- "Payment processed via PayPal" note

---

## Scheduler Configuration

Renewal reminder emails are sent automatically via APScheduler:

**Job:** `renewal_reminders`
**Schedule:** Daily at 9:00 AM UTC
**Default:** Sends reminders 3 days before expiration

**Admin Trigger:** POST `/api/admin/send-renewal-reminders?days_before=3`

---

## Adding New Email Templates

To add a new email template:

1. Add method to `/app/backend/services/email_service.py`:
```python
def send_your_email(self, to_email: str, ...) -> bool:
    subject = "Subject Line"
    html_body = f"""<html>...</html>"""
    text_body = f"""Plain text version"""
    return self._send_email(to_email, subject, html_body, text_body)
```

2. Call from appropriate service/route:
```python
from services.email_service import email_service
email_service.send_your_email(user.email, ...)
```

---

## Testing Emails

Test email sending via admin API:
```bash
curl -X POST "https://your-app.com/api/admin/send-renewal-reminders?days_before=7" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

Check email logs in backend:
```bash
tail -f /var/log/supervisor/backend.err.log | grep -i email
```
