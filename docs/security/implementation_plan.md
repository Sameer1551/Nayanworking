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

