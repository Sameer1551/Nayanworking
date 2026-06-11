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

| Step | Status | Task | What Is Left |
|------|--------|------|--------------|
| 9 | ? Pending | Move the billing save flow onto `/api/billing-records` | Billing page cleanup still pending |
| 10 | ? Pending | Make the billing page use inventory as the product source | Billing still needs a cleaner sellable-product source |
| 11 | ? Pending | Make billing update customer and stock only once | Still needs a full contract review |
| 12 | ?? Partial | Create the backend sales-return module | Entity/service/controller exist, but it is still file-backed rather than repository-backed |
| 13 | ? Done | Connect the sales-return page to the backend | Page now uses backend return flow |
| 14 | ? Done | Make sales returns restore stock | Inventory add-stock logic now exists |
| 15 | ?? Partial | Create the backend purchase-return module | Entity/service/controller exist, but it is still file-backed rather than repository-backed |
| 16 | ? Done | Connect the purchase-return page to the backend | Page now uses backend return flow |
| 17 | ? Done | Make purchase returns reduce stock | Inventory remove-stock logic now exists |
| 18 | ? Pending | Add a real inventory movement ledger | Not built yet |
| 19 | ? Pending | Make edit and delete flows reconcile stock impact | Still incomplete across billing, bulk purchase, and older flows |
| 20 | ? Pending | Finish JSON migration or officially retire it | Final migration cleanup still pending |

## Phase 3. Complete Supplier Operations

| Step | Status | Task | What Is Left |
|------|--------|------|--------------|
| 21 | ?? Partial | Rebuild the dashboard on live APIs | Frontend now calls backend API, but backend analytics still need more normalization |
| 22 | ? Pending | Make dashboard analytics return-aware | Still needs deeper metrics work |
| 23 | ? Pending | Replace the placeholder Data page with a real reports page | `Data.tsx` is still not a finished reports module |
| 24 | ? Pending | Build the low-stock page | Missing |
| 25 | ? Pending | Build supplier master management | Missing |
