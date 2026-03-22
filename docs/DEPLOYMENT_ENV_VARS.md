# Production Deployment - Environment Variables Guide

**Last Updated:** March 2026

This document provides a comprehensive guide to all environment variables used by PediaOTG, with security recommendations for production deployments.

---

## Quick Reference - Production Checklist

```bash
# CRITICAL - Required for security
ENVIRONMENT=production
JWT_SECRET_KEY=<random-64-char-string>  # Generate: openssl rand -base64 48
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD_HASH=<bcrypt-hash>       # Generate: python3 -c "import bcrypt; print(bcrypt.hashpw(b'YourPassword', bcrypt.gensalt()).decode())"

# Database
MONGO_URL=mongodb+srv://...
DB_NAME=pedotg

# PayPal (LIVE mode)
PAYPAL_MODE=live
PAYPAL_CLIENT_ID=<live-client-id>
PAYPAL_CLIENT_SECRET=<live-client-secret>
PAYPAL_WEBHOOK_ID=<webhook-id>          # For signature verification

# Email
SMTP_SERVER=smtp.office365.com
SMTP_PORT=587
SMTP_USERNAME=admin@yourdomain.com
SMTP_EMAIL=noreply@yourdomain.com
SMTP_PASSWORD=<smtp-password>

# URLs
FRONTEND_URL=https://yourdomain.com
```

---

## Detailed Variable Reference

### 1. Core Security Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ENVIRONMENT` | Yes | `development` | Set to `production` for production mode |
| `JWT_SECRET_KEY` | Yes | None | **Min 32 chars** in production. Use cryptographically random value |
| `JWT_ALGORITHM` | No | `HS256` | JWT signing algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | No | `30` | Access token expiration |
| `REFRESH_TOKEN_EXPIRE_DAYS` | No | `7` | Refresh token expiration |

**Security Notes:**
- In production, `JWT_SECRET_KEY` < 32 chars will cause startup failure
- Weak-looking secrets (containing 'password', 'secret', etc.) will trigger warnings

### 2. Admin Account

| Variable | Required | Production | Description |
|----------|----------|------------|-------------|
| `ADMIN_EMAIL` | Yes | Yes | Admin account email |
| `ADMIN_PASSWORD_HASH` | Yes (prod) | **REQUIRED** | bcrypt hash of admin password |
| `ADMIN_PASSWORD` | Dev only | **IGNORED** | Plain text password (development only) |

**How to generate bcrypt hash:**
```bash
# Python
python3 -c "import bcrypt; print(bcrypt.hashpw(b'YourStrongPassword123!', bcrypt.gensalt()).decode())"

# Output example: $2b$12$LO9nNtdm8.8GkXodfDejtuGvxX6BTaxkxTtQZY5lf59HAGfzQ33ge
```

### 3. Tester Account (Optional)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `TESTER_EMAIL` | No | None | Tester account email |
| `TESTER_PASSWORD_HASH` | If tester enabled | None | bcrypt hash (required if enabled in prod) |
| `TESTER_PASSWORD` | Dev only | None | Plain text (development only) |
| `ENABLE_TESTER_LOGIN` | No | `false` | **Security gate** - Set to `true` to enable tester in production |

**Security Notes:**
- Tester account is **DISABLED by default in production**
- If enabled in production, `TESTER_PASSWORD_HASH` is required
- Tester has full app access but NO admin privileges

### 4. Security Feature Flags

| Variable | Default | Recommended Prod | Description |
|----------|---------|-----------------|-------------|
| `STRICT_INPUT_VALIDATION` | `false` | `true` | Block (vs log) injection/XSS attempts |
| `ALLOW_REMOTE_LLM` | `false` | `false` | Allow OCR text to be sent to external LLM |
| `ENABLE_SUBSCRIPTION_DEBUG` | `false` | `false` | Enable PayPal debug endpoints |
| `PAYPAL_DEBUG` | `false` | `false` | Log full webhook payloads |

**Detailed Behavior:**

#### `STRICT_INPUT_VALIDATION`
- `false`: Potential threats are **logged** but requests proceed
- `true`: Potential threats **block** the request (400 error)
- May cause false positives with special characters
- Review `/backend/middleware/validation.py` to adjust patterns

#### `ALLOW_REMOTE_LLM`
- `false`: Blood gas analysis uses 100% local OCR only
- `true`: Falls back to Gemini LLM for text parsing if local parsing fails
- **PHI Warning**: OCR text (not images) may be sent externally when enabled

### 5. Database

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_URL` | Yes | MongoDB connection string |
| `DB_NAME` | Yes | Database name |

### 6. PayPal Configuration

| Variable | Required | Description |
|----------|----------|-------------|
| `PAYPAL_MODE` | Yes | `sandbox` or `live` |
| `PAYPAL_CLIENT_ID` | Yes | PayPal API client ID |
| `PAYPAL_CLIENT_SECRET` | Yes | PayPal API client secret |
| `PAYPAL_WEBHOOK_ID` | Highly recommended | Webhook endpoint ID for signature verification |
| `PAYPAL_PRIMARY_EMAIL` | No | Primary PayPal account email |
| `MONTHLY_PRICE_BHD` | No | `1.0` | Monthly subscription price |
| `ANNUAL_PRICE_BHD` | No | `10.0` | Annual subscription price |

**Webhook Verification:**
- Without `PAYPAL_WEBHOOK_ID`, webhook signature verification is **DISABLED**
- This is a security risk - always set in production
- Get the webhook ID from PayPal Developer Dashboard > Webhooks

### 7. Email Configuration

| Variable | Required | Description |
|----------|----------|-------------|
| `SMTP_SERVER` | For email | SMTP server hostname |
| `SMTP_PORT` | For email | Port (587 for TLS recommended) |
| `SMTP_USERNAME` | For email | SMTP auth username |
| `SMTP_EMAIL` | For email | "From" address |
| `SMTP_PASSWORD` | For email | SMTP auth password |
| `FRONTEND_URL` | For email | Base URL for email links |
| `EMAIL_LOGO_URL` | No | Logo URL in email templates |

### 8. Application URLs and CORS

| Variable | Required | Description |
|----------|----------|-------------|
| `FRONTEND_URL` | Yes | Frontend application URL |
| `CORS_ORIGINS` | No | Comma-separated allowed origins |

**CORS Notes:**
- In production, if `CORS_ORIGINS` is not set, only production domains are allowed
- Development mode includes `localhost:3000`

---

## Environment Templates

### Production Template
```bash
# === SECURITY (REQUIRED) ===
ENVIRONMENT=production
JWT_SECRET_KEY=<generate-with-openssl-rand>
ADMIN_EMAIL=admin@pedotg.com
ADMIN_PASSWORD_HASH=<bcrypt-hash>

# Security flags (recommended defaults)
STRICT_INPUT_VALIDATION=true
ALLOW_REMOTE_LLM=false
ENABLE_TESTER_LOGIN=false
ENABLE_SUBSCRIPTION_DEBUG=false
PAYPAL_DEBUG=false

# === DATABASE ===
MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/
DB_NAME=pedotg_production

# === PAYPAL (LIVE) ===
PAYPAL_MODE=live
PAYPAL_CLIENT_ID=<live-client-id>
PAYPAL_CLIENT_SECRET=<live-secret>
PAYPAL_WEBHOOK_ID=<webhook-id>

# === EMAIL ===
SMTP_SERVER=smtp.office365.com
SMTP_PORT=587
SMTP_USERNAME=admin@pedotg.com
SMTP_EMAIL=noreply@pedotg.com
SMTP_PASSWORD=<smtp-password>

# === URLS ===
FRONTEND_URL=https://app.pedotg.com
CORS_ORIGINS=https://app.pedotg.com,https://pedotg.com,https://www.pedotg.com
```

### Development Template
```bash
# === SECURITY (development) ===
ENVIRONMENT=development
JWT_SECRET_KEY=dev-secret-key-not-for-production
ADMIN_EMAIL=admin@pedotg.com
ADMIN_PASSWORD=DevPassword123!

# Tester account (optional)
TESTER_EMAIL=test@pedotg.com
TESTER_PASSWORD=TestPassword123!

# === DATABASE ===
MONGO_URL=mongodb://localhost:27017
DB_NAME=pedotg_dev

# === PAYPAL (SANDBOX) ===
PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID=<sandbox-client-id>
PAYPAL_CLIENT_SECRET=<sandbox-secret>

# === URLS ===
FRONTEND_URL=http://localhost:3000
```

---

## Startup Validation

On application startup, the following checks are performed:

### Production Mode
1. `JWT_SECRET_KEY` must be ≥32 characters
2. `ADMIN_PASSWORD_HASH` must be set (plain text ignored)
3. If `ENABLE_TESTER_LOGIN=true`, `TESTER_PASSWORD_HASH` required
4. Warnings logged for security flags that differ from recommended

### Development Mode
1. At least one admin password (hash or plain) required
2. Warnings for missing recommended variables
3. Startup proceeds despite configuration issues

---

## Verification After Deployment

### Check Security Headers
```bash
curl -sI https://your-app.com/api/health | grep -E "^(x-|content-security|strict-transport)"
```

### Check Auth Protection
```bash
# Should return 401
curl -s https://your-app.com/api/admin/stats
```

### Check Rate Limiting
```bash
# Rapid requests should eventually return 429
for i in {1..20}; do
  curl -s -o /dev/null -w "%{http_code}\n" -X POST \
    https://your-app.com/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test","password":"test"}'
done
```

### Check Email Configuration
```bash
# Look for this in logs on startup:
# "EmailService initialized: SMTP Server: smtp.office365.com:587"
# NOT: "SMTP_PASSWORD not configured"
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Startup fails with JWT error | Ensure `JWT_SECRET_KEY` is ≥32 chars |
| Startup fails with admin error | Set `ADMIN_PASSWORD_HASH` in production |
| Emails not sending | Check `SMTP_PASSWORD` is set correctly |
| PayPal webhooks failing | Set `PAYPAL_WEBHOOK_ID` for verification |
| CORS errors | Check `CORS_ORIGINS` includes your frontend domain |
| Login rate limited | Wait 15 minutes or clear rate limit state |
