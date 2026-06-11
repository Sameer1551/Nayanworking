Good — open-source only. That works well; some of the best security tooling is free.

  Based on your goals, let me propose 2-3 approaches:

  ---
  Approach A: Layered Defense (Recommended)
  Harden layer by layer following OWASP Top 10 + ASVS standards:
  1. Input validation (SQLi/XSS prevention)
  2. Auth hardening (password policy, MFA placeholder, token rotation)
  3. Security headers (HSTS, CSP, X-Frame-Options)
