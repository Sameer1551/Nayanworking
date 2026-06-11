# Security Implementation Details

This file is maintained as a living record of every security change made to the project.
It is updated at the end of each implementation phase.

---

## Phase 1: Core Security Hardening ✅ COMPLETE

**Date:** 2026-04-29

### Files Modified

| File | Change Summary |
|------|---------------|
| `src/main/java/com/nayaneyecare/config/SecurityConfig.java` | Added Security Headers, Strict CORS |
| `src/main/java/com/nayaneyecare/service/AuthService.java` | Fixed User Enumeration vulnerability |

---

### 1.1 Strict CORS Configuration

**File:** `SecurityConfig.java`

**What changed:** Replaced the `setAllowedOriginPatterns(List.of("*"))` wildcard with `setAllowedOrigins(List.of(allowedOrigins))`, where `allowedOrigins` is read from `application.properties` (`app.cors.allowed-origins`). Also replaced `setAllowedHeaders(Arrays.asList("*"))` with an explicit list.

**How it works:**
- Only requests from the exact origin `http://localhost:5173` (your React dev server) are accepted.
- Any request from a different domain (e.g., a malicious website) will receive a CORS error and the browser will block the response.
- Preflight (`OPTIONS`) responses are cached for 1 hour.

**Why it improves security:** A wildcard CORS policy means any website in the world could make API calls to your backend using a logged-in user's credentials. Strict CORS prevents Cross-Origin attacks.

**How to test:**
1. Open the browser Console on any website (e.g., google.com).
2. Run: `fetch('http://localhost:8080/api/dashboard/overview').then(r => console.log(r))`
3. You will see: `Access to fetch at '...' has been blocked by CORS policy: The 'Access-Control-Allow-Origin' header has a value 'http://localhost:5173' that is not equal to the supplied origin.`

---

### 1.2 Security Headers

**File:** `SecurityConfig.java` — `.headers()` block

**Headers added and their purpose:**

| Header | Value | Protection |
|--------|-------|------------|
| `X-Content-Type-Options` | `nosniff` | Prevents browsers from guessing content type (MIME sniffing attacks) |
| `X-Frame-Options` | `DENY` | Prevents your app from being embedded in iframes (Clickjacking) |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | Forces HTTPS for 1 year after first visit |
| `Content-Security-Policy` | `default-src 'self'; ...` | Restricts which resources the browser can load |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limits URL information sent in Referer headers |
| `Permissions-Policy` | `geolocation=(), microphone=(), camera=(), payment=()` | Disables dangerous browser APIs |

**How to test:**
1. Make any API request from the React app.
2. Open Chrome DevTools → Network → Select any request → Response Headers.
3. You will see all the above headers in the response.

---

### 1.3 API Error Standardization (User Enumeration Prevention)

**File:** `AuthService.java`

**What changed:**
- `updateProfile()` — Changed `"User not found"` → `"Invalid credentials"`
- `getUserProfile()` — Changed `"User not found"` → `"Invalid credentials"`

**How it works:** When an attacker tries to find valid user accounts by submitting different emails, they no longer get different error messages for "email exists" vs. "email not found". All failures return the same generic error.

**Why it improves security:** Without this, an attacker could enumerate all valid email addresses in the system by scripting login/profile requests and watching for "User not found" vs. "Invalid credentials".

**How to test:**
1. Send a `PUT /api/auth/profile` request with a non-existent email.
2. Confirm the response is `"Invalid credentials"` (not `"User not found"`).

---

## Phase 2: Session, Token Security & CSRF ✅ COMPLETE

**Date:** 2026-04-29

### Files Created

| File | Purpose |
|------|---------|
| `entity/RefreshToken.java` | JPA entity backed by `refresh_tokens` MySQL table |
| `repository/RefreshTokenRepository.java` | DB access with revocation & cleanup queries |
| `service/RefreshTokenService.java` | Token issuance, validation, rotation, and revocation |
| `dto/RefreshRequest.java` | Request body for the `/api/auth/refresh` endpoint |

### Files Modified

| File | Change Summary |
|------|---------------|
| `dto/AuthResponse.java` | Added `refreshToken` field returned on every login |
| `service/AuthService.java` | Issues refresh tokens on login; added `refreshAccessToken()` and `logout()` |
| `controller/AuthController.java` | Added `/api/auth/refresh` and upgraded `/api/auth/logout` |
| `config/SecurityConfig.java` | Added Role Hierarchy (`ROLE_ADMIN > ROLE_SUPPLIER > ROLE_CUSTOMER`) |
| `resources/application.properties` | Reduced access token lifetime to 15 min; added 7-day refresh expiry config |

---

### 2.1 Refresh Token Storage (MySQL-backed)

**Why:** Stateless JWTs cannot be revoked — once issued, they are valid until expiry. A DB-backed refresh token table allows us to instantly invalidate any session (on logout, on suspicious activity).

**How it works:**
- On every login, two tokens are now issued: a short-lived **Access Token** (15 minutes) and a long-lived **Refresh Token** (7 days).
- The Refresh Token is stored in the `refresh_tokens` MySQL table with fields: `token`, `user_email`, `user_type`, `expiry_date`, `revoked`, `created_at`.
- The Access Token is short-lived so even if stolen, it expires quickly.

**How to test:**
1. Login and check the response JSON — it now contains both `token` (access) and `refreshToken`.
2. Run `SELECT * FROM refresh_tokens;` in MySQL to see the stored token.

---

### 2.2 Token Rotation (Anti-Theft)

**Why:** If a refresh token is stolen, an attacker could use it to get new access tokens forever. Token Rotation prevents this by invalidating the old token every time it is used.

**How it works:**
- Client calls `POST /api/auth/refresh` with the current refresh token.
- Backend validates the token, marks it as `revoked=true` in the DB.
- A brand-new refresh token is issued and returned alongside the new access token.
- If an attacker tries to reuse the old token, they get a `401 Unauthorized`.

**How to test:**
1. Login and capture the `refreshToken` from the response.
2. Call `POST /api/auth/refresh` with `{ "refreshToken": "<token>" }` — get new tokens.
3. Call `POST /api/auth/refresh` again with the **same old token** — get `401: Refresh token has been revoked`.

---

### 2.3 Strict Logout Flow

**Before:** `POST /api/auth/logout` simply returned a success message. Client-side token deletion was the only protection.

**After:** The endpoint now extracts the user's email from the Authorization header and calls `refreshTokenService.revokeAllUserTokens(email)`. All active refresh tokens for that user are marked `revoked=true` in the DB.

**How to test:**
1. Login → capture both tokens.
2. Call `POST /api/auth/logout` with the `Authorization: Bearer <accessToken>` header.
3. Run `SELECT revoked FROM refresh_tokens WHERE user_email = 'your@email.com';` — all rows should show `1` (revoked).

---

### 2.4 Role Hierarchy

**File:** `SecurityConfig.java`

**Hierarchy:** `ROLE_ADMIN > ROLE_SUPPLIER > ROLE_CUSTOMER`

**Why:** Without this, you need to write `hasAnyRole('ADMIN', 'SUPPLIER')` everywhere. With hierarchy, since Admin inherits Supplier, writing `hasRole('SUPPLIER')` automatically grants access to Admins too — without code duplication.

**How to test:** Login as Admin and confirm you can access endpoints that only say `hasAnyRole("SUPPLIER")` — they now work for Admin automatically.

---

### 2.5 Access Token Lifetime Reduced

**Before:** `app.jwt.expiration=86400000` (24 hours)

**After:** `app.jwt.expiration=900000` (15 minutes)

**Why:** Shorter-lived access tokens minimize the damage if a token is intercepted. The Refresh Token (7 days) is stored server-side and can be revoked.

---

## Phase 3: Tamper-Evident Audit Logging ✅ COMPLETE

**Date:** 2026-04-29

### Files Created

| File | Purpose |
|------|---------|
| `entity/AuditLog.java` | JPA entity for the audit log with hash chaining fields |
| `repository/AuditLogRepository.java` | DB access for fetching the log chain |
| `service/AuditLogService.java` | Cryptographic hash chaining logic and startup verification |
| `controller/AuditLogController.java` | Exposes `/api/admin/audit/verify` for manual verification |
