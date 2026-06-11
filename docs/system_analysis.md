# 🏥 Nayan Eye Care — Complete System Architecture Analysis

> **Full-stack system**: React (Vite + TypeScript) frontend + Spring Boot (Java) backend + H2 database  
> **Backend API**: `http://localhost:8080/api`  
> **Branches**: DIGL (Diglipur), MAYA (Mayabunder), RANG (Rangat), JUNG (Junglighat)

---

## 📦 Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite + TailwindCSS |
| Backend | Spring Boot (Java) + JPA/Hibernate |
| Database | H2 (embedded, file: `data/nayan-db.mv.db`) |
| Auth | JWT (sessionStorage) + Mock fallback |
| File Storage | JSON files (`data/`) + localStorage fallback |

---

## 🗂️ Module Overview

| Module | Route | Description |
|--------|-------|-------------|
| Dashboard | `/supplier/dashboard` | Analytics, P&L, charts |
| Purchase (Single) | `/supplier/purchase` | One product per bill |
| Bulk Purchase | `/supplier/bulk-purchase` | Multiple products per bill |
| Purchase History | `/supplier/purchase-history` | View/edit/delete purchases |
| Purchase Return | `/supplier/purchase-return` | Return goods to supplier |
| Inventory | `/supplier/inventory` | Stock tracking |
| New Billing | `/supplier/billing` | Create sales invoice |
| Billing Records | `/supplier/billing-records` | Sales history |
| Customers | `/supplier/customers` | Customer management |
| Sales Return | `/supplier/sales-return` | Return from customer |

---

## 🔄 1. Supplier & Purchase Flow

### Single Purchase (`purchaseService.ts` → Java `PurchaseService.java`)

```
User fills Purchase Form
        ↓
purchaseService.appendPurchaseData(purchaseData)
        ↓  
  → POST /api/purchases (backend)
  → Backend saves to H2 `purchases` table
  → Backend auto-creates/updates InventoryItem  ← KEY STEP
        ↓
purchaseService.saveToLocalFile()  (backup to JSON)
        ↓
inventoryService.refreshInventory()  (refresh frontend cache)
```

**PurchaseData fields** (frontend TS interface):
- `id`, `purchaseBillNo` (unique), `purchaseDate`, `branch`
- `materialName`, `productCode`, `productDescription`
- `category` (enum: Spectacles/Sunglasses/Lens/Contact Lens/Frame/Solution/Other/Non-Chargeable)
- `subcategory`, `hsn`, `quantity`, `purchasePrice`
- `inputGSTPercent`, `inputGSTAmount`, `totalAmount`
- `supplier: { name, address, gstin }`, `remarks`

### Bulk Purchase (`bulkPurchaseService.ts` → Java `BulkPurchaseService.java`)

```
User fills Bulk Purchase Form (multiple items)
        ↓
bulkPurchaseService.createBulkPurchase(bulkPurchaseData)
        ↓
  → POST /api/bulk-purchases (backend)
  → Creates BulkPurchase + PurchaseItems (cascade)
  → For EACH PurchaseItem:
       if inventory exists for productCode → ADD quantity
       if not exists → CREATE new InventoryItem (30% markup for selling price)
        ↓
Both Single & Bulk purchases update the SAME inventory_items table
```

---

## 📦 2. Inventory System

### Stock Increment (after Purchase)
- **Single Purchase** → Java `PurchaseService.updateInventoryFromPurchase()` 
  - finds by `productCode` → updates `quantity`
  - if not found → creates new `InventoryItem`
  
- **Bulk Purchase** → Java `BulkPurchaseService.updateInventoryFromBulkPurchase()`
  - iterates all `PurchaseItems`
  - same logic: find by `productCode` → add quantity or create new

### Stock Decrement (after Sale)
- `BillingRecordService.reduceInventoryFromSale()`
  - iterates `BillingProduct` list in billing record
  - finds `InventoryItem` by `productCode` (fallback: by name)
  - `newQuantity = max(0, currentQuantity - soldQuantity)`
  - saves updated `InventoryItem`

### Stock Adjustment (Returns)
> ⚠️ **GAP IDENTIFIED**: Both `SalesReturn.tsx` and `PurchaseReturn.tsx` currently save returns **only to `localStorage`** — they do NOT call the backend to update inventory!

**SalesReturn** (current behavior):
- Creates `SalesReturnRecord` with: returnDate, originalSaleBillNo, customerInfo, productInfo, returnQuantity, returnReason
- Saves to `localStorage['salesReturns']`
- ❌ Does NOT reverse the inventory decrement

**PurchaseReturn** (current behavior):
- Creates `PurchaseReturnRecord` with: returnDate, originalPurchaseBillNo, supplierInfo, productInfo, returnQuantity, returnReason
- Saves to `localStorage['purchaseReturns']`
- When deleting a Purchase Return, it DOES try to restore purchase quantity in localStorage
- ❌ Does NOT call backend API to reverse inventory

---

## 👥 3. Customer & Sales Flow

### Customer Data Sources (merged)
```
Source 1: customers table (API /api/customers)
         ↓ via CustomerService.java
         
Source 2: billing_records table (API /api/billing-records)
         ↓ via BillingRecordService.java
         
billingService.mergeCustomerAndBillingData()
         ↓
Unified CustomerBillingSummary (source: 'customer_record' | 'billing_record' | 'combined')
```

**Customer fields**: id, branchName, branchCode, title, fullName, mobileNo (UNIQUE), mobileNo2, gender, gstinNo, dateOfBirth, age, notes, email, city, anniversary, dateOfVisit, lastVisitDate, visitCount, totalSpent, averageBillAmount, lastBillNumber, lastBillDate

### Sales / Billing Flow
```
New Billing Page (NewBilling.tsx)
        ↓
User selects Customer + adds Products from Inventory
        ↓
POST /api/billing-records
        ↓
BillingRecordService.createBillingRecord()
        ├── Looks up Customer by mobileNo
        ├── Links BillingRecord ↔ Customer (FK: customer_id)
