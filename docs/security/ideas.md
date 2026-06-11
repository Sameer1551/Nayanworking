Good — open-source only. That works well; some of the best security tooling is free.

  Based on your goals, let me propose 2-3 approaches:

  ---
  Approach A: Layered Defense (Recommended)
  Harden layer by layer following OWASP Top 10 + ASVS standards:
  1. Input validation (SQLi/XSS prevention)
  2. Auth hardening (password policy, MFA placeholder, token rotation)
  3. Security headers (HSTS, CSP, X-Frame-Options)
  4. Rate limiting + account lockout
  5. Audit logging with integrity hashing
  6. Dependency vulnerability scanning (OWASP Dependency-Check)

  Visible proof: Security headers in responses, audit logs visible in dashboard, rate
  limit headers shown.

  ---
  Approach B: Defense + Formal Audit Trail
  Everything in A + adds:
  - Tamper-evident audit logs (hash chains)
  - GDPR-style data access logs
  - Session management with device tracking
  - Login history for users

  Visible proof: "Security Audit Log" UI panel for admins.

  ---
  Approach C: Full Enterprise Simulation
  B + simulates enterprise features:
