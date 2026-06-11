# Nayan Eye Care Project Completion Step-By-Step Plan

Last updated: 2026-04-04

Status legend:
- `? Done` = completed in core form
- `?? Partial` = started / working, but still needs more cleanup
- `? Pending` = not finished yet

## Phase 1. Stabilize The Current Frontend / Backend Contract

| Step | Status | Task | What Is Left |
|------|--------|------|--------------|
| 1 | ?? Partial | Freeze the source-of-truth decision | Purchase history and customers still use mixed fallback logic |
| 2 | ? Done | Replace mock-first auth with backend-first auth | Core flow done; security enforcement still separate |
| 3 | ? Pending | Add real backend request protection | `SecurityConfig` still permits `/api/**` |
| 4 | ?? Partial | Standardize shared data contracts | Returns fixed better; inventory and billing shapes still need cleanup |
| 5 | ? Pending | Fix the billing contract gaps first | `getNextInvoiceNumber()` is still missing |
| 6 | ? Done | Fix broken service-to-service calls | Purchase/inventory broken calls from the review pass were fixed |
| 7 | ? Pending | Resolve the inventory cleanup mismatch | Final cleanup decision still needed |
| 8 | ? Pending | Add stable stock identity to billing items | Billing still needs stronger `productCode` use |

## Phase 2. Make The Core Stock Loop Fully Correct

