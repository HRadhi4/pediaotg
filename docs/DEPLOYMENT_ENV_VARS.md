# Production Deployment - Required Environment Variables

## Email Configuration (REQUIRED for admin notifications)

These variables MUST be set in your production environment for emails to work:

```bash
# SMTP Configuration (Office 365)
SMTP_SERVER=smtp.office365.com
SMTP_PORT=587
SMTP_USERNAME=admin@pedotg.com      # Account used for SMTP authentication
SMTP_EMAIL=noreply@pedotg.com       # "From" address on emails
SMTP_PASSWORD=your_password_here    # ⚠️ REQUIRED - emails fail without this!

# Admin Notifications
ADMIN_EMAIL=admin@pedotg.com        # Where admin notifications are sent

# Application URLs
FRONTEND_URL=https://app.pedotg.com
EMAIL_LOGO_URL=https://app.pedotg.com/icon.svg
```

## How to Set Environment Variables

### Option 1: Emergent Platform Deployment
When deploying via Emergent, set these in the deployment configuration:
1. Go to your app's deployment settings
2. Add each variable under "Environment Variables"
3. Redeploy the application

### Option 2: Railway/Render/Vercel
Add these variables in the platform's environment settings dashboard.

### Option 3: Docker
```bash
docker run -e SMTP_PASSWORD=your_password ...
```

### Option 4: .env file (if supported)
Create a `.env` file in the backend directory with these values.

## Verification

After deployment, check your backend logs for:
```
EmailService initialized:
  SMTP Server: smtp.office365.com:587
  From: noreply@pedotg.com
  Auth User: admin@pedotg.com
  Password: configured
```

If you see:
```
EMAIL SERVICE: SMTP_PASSWORD not configured - emails will NOT be sent!
```
Then the `SMTP_PASSWORD` environment variable is not set correctly.

## Testing Email After Deployment

Use the admin test endpoint:
```bash
curl -X POST "https://your-app.com/api/admin/test-email" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

This will send test emails and report success/failure.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Emails not sending | Check `SMTP_PASSWORD` is set |
| Auth error in logs | Verify `SMTP_USERNAME` and `SMTP_PASSWORD` match your Office 365 account |
| Connection timeout | Check firewall allows outbound port 587 |
| "Recipient reserved" error | This is normal for test emails to `@example.com` |

## All Required Environment Variables for Production

```bash
# Database
MONGO_URL=mongodb+srv://...
DB_NAME=pedotg

# Authentication
JWT_SECRET_KEY=your-secret-key-min-32-chars
ADMIN_EMAIL=admin@pedotg.com
ADMIN_PASSWORD_HASH=$2b$12$...  # bcrypt hash

# Email (REQUIRED)
SMTP_SERVER=smtp.office365.com
SMTP_PORT=587
SMTP_USERNAME=admin@pedotg.com
SMTP_EMAIL=noreply@pedotg.com
SMTP_PASSWORD=your_password

# PayPal
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
PAYPAL_MODE=live

# URLs
FRONTEND_URL=https://app.pedotg.com
EMAIL_LOGO_URL=https://app.pedotg.com/icon.svg

# Optional
ENVIRONMENT=production
CORS_ORIGINS=https://app.pedotg.com
```
