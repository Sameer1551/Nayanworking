# Nayan Eye Care Missing Features Report

Last updated: 2026-04-04

Status legend:
- [x] Done in core form
- [~] Partially done, but still needs hardening or deeper backend work
- [ ] Still missing

## Work Completed Recently

- [x] Sales return backend module added with entity, service, controller, JSON persistence, and inventory stock-restore logic.
- [x] Sales return page moved off browser-only storage and now calls the backend return API.
- [x] Purchase return backend module added with entity, service, controller, JSON persistence, and inventory stock-deduction logic.
- [x] Purchase return page moved off browser-only storage and now calls the backend return API.
- [x] Return numbering is now centralized server-side for sales returns and purchase returns.
- [x] `src/services/dashboardService.ts` now calls the backend dashboard API instead of reading JSON files directly in the browser.
- [x] Customer portal pages and routes now exist for login, register, dashboard, profile, bills, prescriptions, returns, eye-test booking, and contact-lens reorders.
- [x] Supplier auth is no longer hardcoded mock-only on the frontend; it now calls the Java backend first.
- [x] Auth session persistence now uses `localStorage` instead of tab-only session storage.
- [x] `src/services/purchaseService.ts` no longer uses `localStorage` as the primary fallback for purchase records.
- [x] Broken inventory calls inside `purchaseService.ts` were fixed.

## Critical / High Priority Items Still Left

- [ ] Backend security is still open. `SecurityConfig` still permits `/api/**`, so JWT auth is not yet enforcing protected APIs.
- [~] Returns are backend-connected now, but they are still file-backed modules, not full repository-backed DB modules.
- [~] Dashboard frontend uses the backend API now, but backend dashboard aggregation still needs stronger live-source normalization and return-aware analytics.
- [ ] `billingService.getNextInvoiceNumber()` is still missing while `NewBilling.tsx` calls it.
- [ ] `PurchaseHistory.tsx` still contains heavy `localStorage` and file-fallback logic.
- [ ] `Customers.tsx` still contains `localStorage` fallback/sync logic.
- [ ] Inventory movement ledger / audit trail is still missing.
- [ ] Billing records should store and use stable `productCode` identity more consistently.

## Supplier-Side Work Status

- [x] Purchase page exists.
- [x] Bulk purchase page exists.
- [x] Purchase history page exists.
- [x] Sales return page exists and is backend-connected.
- [x] Purchase return page exists and is backend-connected.
- [x] Inventory page exists.
