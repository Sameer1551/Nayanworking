# Extreme Security Upgrade Plan ("Fortress Security")

This plan outlines the steps to upgrade Nayan Eye Care's security from "Basic Standard" to "Extreme Level" (similar to high-security systems like Facebook/Google).

## User Review Required

> [!IMPORTANT]
> Some of these changes involve database schema updates and will require the user to configure an email server (SMTP) for OTP codes.

> [!WARNING]
> Moving from `localStorage` to `HttpOnly Cookies` for JWT will require frontend changes to how tokens are handled and may affect cross-domain requests.

## Proposed Changes

### 1. Account & Authentication (MFA)
Implement Multi-Factor Authentication to prevent account takeover even if the password is leaked.

- **TOTP (Time-based One-Time Password)**: Support for apps like Google Authenticator or Authy.
- **Email OTP**: Fallback for users without authenticator apps.
- **Backup Codes**: Generate one-time use codes for account recovery.

### 2. Session & Device Management
Track where and when the user is logged in.

- **Device Fingerprinting**: Store `User-Agent` and `IP Address` for every session.
- **Active Sessions Table**: A new `user_sessions` table to track all active JWTs.
- **Remote Logout**: UI to view active devices and "Log out from all other devices."
- **New Device Alerts**: Email notification when a login occurs from an unrecognized IP or browser.

### 3. Protection Against Attacks
Harden the system against common automated attacks.

- **Brute Force Protection**: Account lockout after 5 consecutive failed attempts (with incremental cooldown).
- **Rate Limiting**: Limit API requests per IP (e.g., max 10 login attempts per minute).
