# Nayan Eye Care Page Audit And Missing Scope

Last updated: 2026-04-04

Status legend:
- [x] Created and routed
- [~] Exists, but still incomplete or mixed
- [ ] Still missing

## 1. Current Project Snapshot

This project is no longer just a frontend prototype.

Backend modules now exist for:
- [x] auth
- [x] inventory
- [x] purchases
- [x] bulk purchases
- [x] billing records
- [x] customers
- [x] dashboard
- [x] sales returns
- [x] purchase returns
- [x] file sync helpers
- [x] numbering service

The main gap now is not "backend missing everywhere".

The main gap now is:
- [ ] backend security is still not enforced properly
- [ ] several supplier pages still carry old `localStorage` or file-fallback logic
- [ ] billing flow still has contract gaps
- [ ] reports/alerts/admin pages are still missing
- [ ] public catalog pages are still mostly static

## 2. Pages Already Created And Routed

### Public Pages

| Route | Status | Notes |
|------|--------|-------|
| `/` | [x] | Home page exists |
| `/spectacles` | [x] | Category page exists, but still not fully live-data driven |
| `/sunglasses` | [x] | Category page exists, but still not fully live-data driven |
| `/contact-lenses` | [x] | Category page exists, but still not fully live-data driven |
| `/frames` | [x] | Category page exists, but still not fully live-data driven |
| `/solutions` | [x] | Category page exists, but still not fully live-data driven |

### Supplier / Staff Pages

| Route | Status | Notes |
|------|--------|-------|
| `/supplier/dashboard` | [~] | Page exists and dashboard frontend now uses backend API, but analytics still need further hardening |
| `/supplier/billing` | [~] | Page exists, but billing contract gaps still remain |
| `/supplier/billing-records` | [x] | Routed and usable |
| `/supplier/customers` | [~] | Page exists, but still has mixed backend/file/localStorage logic |
| `/supplier/purchase` | [~] | Backend create flow exists, but broader cleanup is still pending |
| `/supplier/bulk-purchase` | [~] | Backend exists, but cleanup/security work is still pending |
| `/supplier/purchase-history` | [~] | Page exists, but still contains heavy local fallback logic |
| `/supplier/purchase-return` | [x] | Page exists and is now backend-connected |
| `/supplier/sales-return` | [x] | Page exists and is now backend-connected |
| `/supplier/data` | [ ] | Still only a placeholder instead of a real reports page |
| `/supplier/inventory` | [~] | Page exists, but frontend/backend model cleanup is still not complete |

### Customer Portal Pages

| Route | Status | Notes |
|------|--------|-------|
| `/customer/login` | [x] | Created and routed |
| `/customer/register` | [x] | Created and routed |
| `/customer/dashboard` | [x] | Created and protected |
| `/customer/profile` | [x] | Created and protected |
| `/customer/bills` | [x] | Created and protected |
| `/customer/prescriptions` | [x] | Created and protected |
| `/customer/returns` | [x] | Created and protected |
| `/customer/book-eye-test` | [x] | Created and protected |
| `/customer/contact-lens-reorders` | [x] | Created and protected |

## 3. Existing UI Files That Exist But Still Need Product Cleanup

- [~] `src/components/LoginModal.tsx` still exists even though auth is now more route-driven.
- [~] `src/components/MovementHistory.tsx` exists, but there is still no real movement ledger backend behind it.
- [ ] `src/pages/categories/Others.tsx` exists, but is not routed.
- [~] `src/components/BillingRecords.tsx` is usable, but structurally it still belongs in `pages/`.

## 4. Backend Modules That Already Exist

- [x] `AuthController` / `AuthService`
- [x] `InventoryController` / `InventoryItemService`
- [x] `PurchaseController` / `PurchaseService`
- [x] `BulkPurchaseController` / `BulkPurchaseService`
- [x] `BillingRecordController` / `BillingRecordService`
- [x] `CustomerController` / `CustomerService`
- [x] `DashboardController` / `DashboardService`
- [x] `SalesReturnController` / `SalesReturnService`
- [x] `PurchaseReturnController` / `PurchaseReturnService`
- [x] `FileController`
- [x] `NumberingService`

## 5. Pages That Exist But Are Still Functionally Incomplete

- [~] Public category pages still need live catalog/inventory connection.
- [~] Supplier dashboard is wired better than before, but analytics are still not fully normalized around all business flows.
- [~] Billing page still needs invoice-number, product-source, and overall contract cleanup.
- [~] Customers page still needs full backend-first cleanup.
- [~] Purchase history still needs localStorage cleanup and stock-safe reconciliation.
- [~] Inventory page still needs frontend/backend field-shape cleanup.
- [~] Customer portal pages exist, but some flows still rely on local/client-side service layers until deeper backend support is finished.
- [ ] Data page is still a placeholder.

## 6. Pages You Still Need To Create

### Supplier / Staff Pages Still Missing

- [ ] `/supplier/reports`
- [ ] `/supplier/low-stock`
- [ ] `/supplier/suppliers`
- [ ] `/supplier/inventory-adjustments`
- [ ] `/supplier/stock-audit`
- [ ] `/supplier/prescriptions`
- [ ] `/supplier/expiry-alerts`
- [ ] `/supplier/warranty`
- [ ] `/supplier/settings`
- [ ] `/supplier/users`

### Public Experience Pages Still Missing

- [ ] `/products/search`
- [ ] `/product/:productCode`
