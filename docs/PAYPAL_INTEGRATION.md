# PayPal Integration Guide

## Overview

This document describes the PayPal payment integration for PediaOTG subscriptions.

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PAYPAL_MODE` | Payment mode: `sandbox` or `live` | `live` |
| `PAYPAL_CLIENT_ID` | Client ID from PayPal Developer Dashboard | `AYbh4gzFPMXMc9-...` |
| `PAYPAL_CLIENT_SECRET` | Client Secret from PayPal Developer Dashboard | `EKlAaqY77vwbGRh...` |
| `FRONTEND_URL` | Base URL for return/cancel redirects | `https://app.pedotg.com` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONTHLY_PRICE_BHD` | Monthly subscription price in BHD | `1.0` |
| `ANNUAL_PRICE_BHD` | Annual subscription price in BHD | `10.0` |

## API Endpoints

### Self-Test Endpoint

Run a comprehensive test of the PayPal integration:

```bash
curl https://your-domain.com/api/subscription/self-test
```

**Response:**
```json
{
  "overall_status": "PASSED",
  "mode": "live",
  "steps": [
    {"step": "1. Environment Variables", "passed": true},
    {"step": "2. OAuth Token", "passed": true},
    {"step": "3. API Connectivity Test", "passed": true}
  ]
}
```

### Verify Configuration

Check PayPal configuration without running full tests:

```bash
curl https://your-domain.com/api/subscription/verify-paypal
```

## Switching Between Sandbox and Live

### To use Sandbox (Testing):

1. Get sandbox credentials from [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/applications/sandbox)
2. Set environment variables:
   ```
   PAYPAL_MODE=sandbox
   PAYPAL_CLIENT_ID=<sandbox-client-id>
   PAYPAL_CLIENT_SECRET=<sandbox-client-secret>
   ```
3. The system will automatically use `https://api-m.sandbox.paypal.com`

### To use Live (Production):

1. Get live credentials from [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/applications/live)
2. Set environment variables:
   ```
   PAYPAL_MODE=live
   PAYPAL_CLIENT_ID=<live-client-id>
   PAYPAL_CLIENT_SECRET=<live-client-secret>
   ```
3. The system will automatically use `https://api-m.paypal.com`

**Important:** Sandbox credentials only work with sandbox API, and live credentials only work with live API.

## Payment Flow

1. **User clicks Subscribe** → `POST /api/subscription/create-order`
   - Creates PayPal order
   - Stores state token for post-redirect authentication
   - Returns approval URL

2. **User redirected to PayPal** → User logs in and approves payment

3. **User returns to app** → `POST /api/subscription/capture-order-with-state`
   - Uses state token to re-authenticate (cookies may be lost during redirect)
   - Captures payment from PayPal
   - Activates subscription
   - Returns new auth tokens

## Error Handling

The API returns structured errors:

```json
{
  "success": false,
  "error_code": "PAYPAL_CREDENTIALS_INVALID",
  "error_message": "PayPal authentication failed. Verify credentials are for live mode.",
  "error_details": { ... },
  "user_message": "Payment service error. Please contact support."
}
```

### Error Codes

| Code | Meaning | User Action |
|------|---------|-------------|
| `PAYPAL_CONFIG_MISSING` | Env vars not set | Contact support |
| `PAYPAL_CREDENTIALS_INVALID` | Wrong credentials for mode | Contact support |
| `PAYPAL_ORDER_NOT_APPROVED` | User didn't complete PayPal approval | Retry and complete approval |
| `PAYPAL_CAPTURE_FAILED` | Payment couldn't be captured | Try different payment method |
| `PAYPAL_NETWORK_ERROR` | Network connectivity issue | Check connection, retry |
| `PAYPAL_TIMEOUT` | Request timed out | Retry |
| `INVALID_STATE_TOKEN` | Session expired | Start new subscription |

## Troubleshooting

### Generic "An error occurred" message

**Root Cause:** The original code used generic error messages that didn't help users understand what went wrong.

**Fix:** The updated code now returns structured error responses with:
- `error_code`: Machine-readable code for programmatic handling
- `error_message`: Technical description
- `user_message`: User-friendly message for display

### 401 Unauthorized Error

**Cause:** Usually indicates credential mismatch - using sandbox credentials with live API or vice versa.

**Fix:**
1. Verify `PAYPAL_MODE` matches your credentials source
2. Run `/api/subscription/self-test` to diagnose
3. Ensure credentials are from the correct environment in PayPal Developer Dashboard

### "Payment not approved" Error

**Cause:** User didn't complete the PayPal login/approval process.

**Fix:** User needs to:
1. Log into their PayPal account
2. Review and confirm the payment
3. Be redirected back to the app

### State Token Expired

**Cause:** User took too long (>30 minutes) to complete the PayPal flow.

**Fix:** Start a new subscription process.

## Security Notes

- Secrets are never logged
- State tokens expire after 30 minutes
- OAuth tokens are cached and refreshed automatically
- All PayPal communication uses HTTPS

## Files Modified

- `/app/backend/services/paypal_service.py` - PayPal API integration
- `/app/backend/routes/subscription.py` - API endpoints
- `/app/frontend/src/pages/subscription/PricingPage.jsx` - Subscription selection
- `/app/frontend/src/pages/subscription/SuccessPage.jsx` - Payment completion
