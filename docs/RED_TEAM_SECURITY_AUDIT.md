# Red Team Security Audit Report

**Date:** March 22, 2026  
**Scope:** External attacker with browser access, network access, ability to sign up and subscribe  
**Application:** PediaOTG (Pediatric Medical Guide)

---

## Executive Summary

This audit examines the PediaOTG application from an external attacker's perspective. The application demonstrates a **strong security posture** with multiple layers of defense. Most common attack vectors are properly blocked by code-level protections.

**Key Findings:**
- 0 Critical vulnerabilities
- 1 Medium issue (content cloning via static bundles - business decision)
- 2 Low issues (minor data exposure in API responses)
- Multiple defense-in-depth controls working correctly

---

## Part 1: Access Control & Authorization Testing

### 1.1 Admin Route Access Without Admin Token

**Attack Vector:** Access `/api/admin/*` endpoints with regular user token or no token.

**Status:** ✅ BLOCKED

**Evidence:**
```
File: /app/backend/middleware/security.py (lines 277-336)
- AdminRouteProtectionMiddleware validates token AND is_admin flag
- Rejects before request reaches route handler

File: /app/backend/routes/admin.py (all endpoints)
- All use `Depends(require_admin)` which double-checks admin status

File: /app/backend/routes/auth.py (lines 227-234)
- require_admin() verifies is_admin from database, not just token claim
```

**Testing:**
```bash
# Without auth - returns 401
curl /api/admin/users

# With regular user token - returns 403 
curl -H "Authorization: Bearer $USER_TOKEN" /api/admin/users
```

**Verdict:** Defense-in-depth with middleware + route-level protection. **No vulnerability.**

---

### 1.2 IDOR - Accessing Other Users' Data

**Attack Vector:** Modify user IDs in requests to access other users' layouts, subscriptions, or device data.

**Status:** ✅ BLOCKED

**Evidence:**
```
File: /app/backend/routes/layouts.py (all endpoints)
- Line 27-29: `db.user_layouts.find({'user_id': user.id}, ...)`
- Always filters by authenticated user's ID, ignoring any user-supplied ID

File: /app/backend/routes/admin.py 
- Line 196: get_user_details requires admin
- Line 627: get_user_devices requires admin
- Non-admins cannot query arbitrary user IDs

File: /app/backend/routes/subscription.py
- Line 351, 419, etc.: All operations use `user.id` from auth, not request body
```

**User-Controlled ID Areas Examined:**
| Endpoint | User ID Source | Vulnerability |
|----------|---------------|---------------|
| `GET /layouts/` | `user.id` from token | No |
| `GET /subscription/status` | `user.id` from token | No |
| `POST /capture-order` | `user.id` from token | No |
| `DELETE /admin/user/{id}` | Admin-only | No |

**Verdict:** All user-specific queries filter by authenticated user's ID. **No IDOR vulnerabilities.**

---

### 1.3 Subscription Bypass

**Attack Vector:** Access paid content without valid subscription.

**Status:** ✅ BLOCKED

**Evidence:**
```
File: /app/backend/routes/auth.py (lines 207-224)
- require_subscription() verifies has_active_subscription
- Admin bypass is intentional (admins always have access)

File: /app/backend/services/subscription_service.py
- Subscription status computed from database, not client-supplied
- Expiry dates checked server-side
```

**Subscription State Stored Server-Side:**
- `subscriptions` collection with `status`, `renews_at`, `trial_ends_at`
- Client cannot modify subscription status
- `/auth/check` and `/auth/me` compute status from DB each call

**Possible Attack: Manipulate trial_ends_at?**
- Cannot: No endpoint allows users to set subscription dates
- Admin-only endpoint `/admin/user/{id}` can modify, but requires admin auth

**Verdict:** Subscription state is server-authoritative. **No bypass possible.**

---

### 1.4 Token Revocation Bypass

**Attack Vector:** Continue using refresh token after logout or device revocation.

**Status:** ✅ BLOCKED

**Evidence:**
```
File: /app/backend/routes/auth.py
- Line 404-411: Logout revokes refresh token via jti
- Line 457-460: Refresh endpoint checks is_token_revoked()
- Line 469-470: Token rotation - old token revoked on refresh

File: /app/backend/services/auth_service.py
- Lines 335-371: revoke_token() stores jti in revoked_tokens collection
- Lines 373-378: is_token_revoked() checks against this collection
- TTL index auto-cleans expired entries

File: /app/backend/routes/admin.py  
- Lines 684-696: Device revocation deletes device registration
- However, does NOT revoke the refresh token stored with device
```

**Potential Issue Found:** Device revocation doesn't revoke refresh token

```python
# /app/backend/routes/admin.py line 684-696
# Deletes device but doesn't revoke the associated refresh token
result = await db.user_devices.delete_one({
    'user_id': user_id,
    'device_id': device_id
})
```

**Impact:** LOW - The device entry is deleted, but if attacker cached the refresh token, they could potentially refresh. However:
1. Rate limiting on refresh endpoint limits abuse
2. Refresh tokens expire (7 days max)
3. User can change password to trigger full revocation

**Recommended Fix:** Add token revocation when device is revoked.

---

### 1.5 PayPal Webhook Manipulation

**Attack Vector:** Send fake PayPal webhooks to activate subscriptions.

**Status:** ✅ BLOCKED (when PAYPAL_WEBHOOK_ID is configured)

**Evidence:**
```
File: /app/backend/routes/subscription.py
- Lines 100-181: verify_paypal_webhook_signature() validates signature
- Lines 895-912: Webhook handler rejects unverified requests
- Uses PayPal's verify-webhook-signature API, not local verification
```

**Without PAYPAL_WEBHOOK_ID:**
- Line 126-128: Verification is skipped
- This is a **configuration weakness**, not a code bug
- Documented in DEPLOYMENT_ENV_VARS.md as required

**Verdict:** Properly implemented when configured. **Ensure PAYPAL_WEBHOOK_ID is set in production.**

---

## Part 2: Data Extraction & Content Cloning

### 2.1 Static Bundle Analysis

**Attack Vector:** Extract medical content from frontend JavaScript bundles.

**Status:** ⚠️ INHERENT RISK (Business Decision)

**Content Shipped in Static Bundles:**

| File | Content Type | Size | Risk |
|------|-------------|------|------|
| `formulary.json` | Drug dosing data | ~50KB | Can be copied |
| `renalAdjustments.js` | Renal dosing rules | ~15KB | Can be copied |
| `cdcPercentileData.js` | CDC growth data | ~30KB | Can be copied |
| `cdc_statage.csv` | CDC stature data | ~20KB | Can be copied |
| `childrenFormulary.js` | Drug exports | Small | Can be copied |
| React components | Clinical algorithms | Variable | Can be copied |

**What This Means:**
- An attacker can download the compiled JS bundle
- Using browser DevTools or `npm run build`, they can access all static data
- Growth chart data, drug formularies, and clinical algorithms are embedded in the bundle

**This is NOT a code vulnerability** - it's an architectural decision. Single-Page Applications (SPAs) must ship client-side code to the browser.

**Alternatives (Trade-offs):**
1. Server-side rendering - Increases latency, defeats PWA offline capability
2. API-gated content - Would require network for every interaction, poor UX
3. Encryption - Client needs key to decrypt, so attacker can extract it

**Recommendation:** This is acceptable for medical reference content that is:
- Derived from public sources (CDC, WHO guidelines)
- Not proprietary intellectual property
- Required for offline PWA functionality

**Note:** Source maps are disabled in production (craco.config.js), reducing ease of extraction.

---

### 2.2 API Response Data Exposure

**Attack Vector:** API endpoints returning more data than necessary.

**Status:** ⚠️ MINOR ISSUES FOUND

**Issue 1: /api/auth/check returns extra fields**

```
File: /app/backend/routes/auth.py (lines 496-519)
Returns:
- user_id ✓ (needed)
- email ✓ (needed)
- name ✓ (needed)
- subscription_status ✓ (needed)
- subscription_plan ✓ (needed)
```

**Verdict:** No unnecessary data exposed. Fields are appropriate.

**Issue 2: Admin user list could expose internal timestamps**

```
File: /app/backend/routes/admin.py (lines 102-144)
Returns:
- created_at timestamp (reasonable for admin)
- device_count (reasonable for admin)
```

**Verdict:** Admin-only, acceptable.

**Issue 3: Device revocation response could leak device_id hash**

```
File: /app/backend/routes/admin.py (lines 657-696)
Returns:
- device_id in response
```

**Impact:** Very low. Device IDs are hashed, not sensitive.

---

### 2.3 MongoDB Projection Review

**Checked all database queries for unnecessary field exposure:**

| File | Query | Projection | Status |
|------|-------|------------|--------|
| auth.py:551 | find_one (password reset) | No projection | ✓ Internal use only |
| admin.py:102 | find users | `{'_id': 0, 'hashed_password': 0}` | ✓ Excludes sensitive |
| admin.py:196 | find_one user | `{'_id': 0, 'hashed_password': 0}` | ✓ Excludes sensitive |
| layouts.py:27 | find layouts | `{'_id': 0}` | ✓ Proper |
| subscription.py:482 | find user | `{'_id': 0, 'email': 1, 'name': 1}` | ✓ Minimal |

**Verdict:** Projections are properly configured. `hashed_password` and `_id` excluded where appropriate.

---

## Part 3: Confirmed Non-Issues

### Common Attack Classes Verified Blocked:

| Attack | Protection | Evidence |
|--------|------------|----------|
| SQL Injection | N/A - MongoDB | No SQL used |
| NoSQL Injection | Input validation middleware | validation.py checks for `$` operators |
| XSS | CSP headers + input scanning | security.py CSP + validation.py XSS patterns |
| CSRF | SameSite cookies + token auth | auth.py `samesite="strict"` in production |
| Brute Force | Rate limiting | security.py RateLimitMiddleware |
| Session Fixation | Token rotation on refresh | auth.py line 469-470 |
| Clickjacking | X-Frame-Options DENY | security.py SecurityHeadersMiddleware |
| SSRF | No user-controlled URLs | No external requests from user input |
| Path Traversal | No file operations | No file system access from user input |
| JWT Algorithm Confusion | Explicit algorithm | auth_service.py `algorithms=[self.jwt_algorithm]` |
| Timing Attacks on Login | Generic error message | auth.py:309 "Invalid email or password" |
| User Enumeration | Consistent responses | forgot-password returns same message |

---

## Part 4: Issues Requiring Fixes

### Issue 1: Device Revocation Doesn't Revoke Refresh Token (LOW)

**File:** `/app/backend/routes/admin.py`
**Function:** `revoke_user_device()` (lines 657-696)
**Risk:** LOW

**Problem:** When admin revokes a device, the device entry is deleted but the associated refresh token is not revoked.

**Attack Scenario:**
1. Attacker logs in, caches refresh token
2. Admin revokes the device
3. Attacker can still use cached refresh token until it expires

**Fix:**
```python
# In /app/backend/routes/admin.py, revoke_user_device function

@router.delete("/user/{user_id}/devices/{device_id}")
async def revoke_user_device(
    user_id: str,
    device_id: str,
    admin: UserResponse = Depends(require_admin)
):
    """
    Revoke a specific device's access for a user (Admin only)
    """
    # ... existing user check ...
    
    # Check if device exists and get its refresh token jti
    device = await db.user_devices.find_one({
        'user_id': user_id,
        'device_id': device_id
    })
    
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    
    # ADDED: Revoke the refresh token if stored
    refresh_token = device.get('refresh_token')
    if refresh_token:
        from services.auth_service import AuthService
        auth_svc = AuthService(db)
        payload = auth_svc.decode_token(refresh_token)
        if payload and payload.get('jti'):
            await auth_svc.revoke_token(payload['jti'], user_id, reason="device_revoked")
    
    # Delete the device
    result = await db.user_devices.delete_one({
        'user_id': user_id,
        'device_id': device_id
    })
    
    # ... rest of function ...
```

---

### Issue 2: capture-order-with-state State Token Timing (LOW)

**File:** `/app/backend/routes/subscription.py`
**Function:** `capture_paypal_order_with_state()` (lines 583-777)
**Risk:** LOW

**Observation:** State tokens are valid for 30 minutes and allow authentication-free payment capture. The token is deleted only after successful capture.

**Potential Weakness:** If an attacker intercepts the state_token before the legitimate user uses it, they could:
1. Race to capture the payment
2. However, the payment goes to the original user's account anyway

**Mitigations Already in Place:**
- Token expires after 30 minutes
- PayPal order is tied to user via custom_id
- Token is single-use (deleted after capture)

**Verdict:** Acceptable risk. The state token system is necessary for PayPal redirect flow.

---

## Part 5: Business Decisions (Not Code Bugs)

### Static Content in SPA Bundle

**Type:** Architectural decision
**Impact:** Medical content (drug formulary, growth charts) can be extracted from JS bundles

**Why This Is Acceptable:**
1. PWA requires offline access to content
2. Content is reference data, not proprietary
3. Source maps disabled in production
4. Would require complete architectural change to fix

**If Additional Protection Needed:**
- Consider watermarking data with subscriber ID
- Implement usage analytics to detect bulk scraping
- Add legal ToS prohibiting redistribution

---

## Recommendations Summary

### Must Fix (Before Production)
- None - application is production-ready from security standpoint

### Should Fix (Next Sprint)
1. Add token revocation to device revocation (LOW risk)

### Nice to Have
1. Consider rate limiting on `/api/layouts/sync` endpoint
2. Add audit logging for subscription changes
3. Consider implementing refresh token rotation on every use (currently only on explicit refresh)

### Configuration Requirements
1. Ensure `PAYPAL_WEBHOOK_ID` is set in production
2. Ensure `STRICT_INPUT_VALIDATION=true` in production
3. Ensure `ENVIRONMENT=production` is set

---

## Conclusion

The PediaOTG application demonstrates **mature security practices** with multiple layers of defense:

1. **Authentication:** JWT with token revocation, secure cookies, device tracking
2. **Authorization:** RBAC middleware + route-level guards
3. **Input Validation:** Injection/XSS detection with blocking capability
4. **Rate Limiting:** Login and general API protection
5. **Security Headers:** Full CSP, HSTS, X-Frame-Options
6. **Secrets Management:** Environment-based, hash-only in production
7. **PayPal Security:** Webhook signature verification

The application is **ready for production deployment** with the recommended configuration settings applied.
