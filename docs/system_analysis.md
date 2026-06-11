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
        ├── Updates Customer: visitCount++, totalSpent, averageBillAmount, lastBillNumber, lastBillDate
        └── reduceInventoryFromSale() → decrements InventoryItem.quantity for each product
```

**BillingRecord fields**: id, billNumber (unique), billDate, branchCode, branchName, customerName, customerContact, customerEmail, customerAddress, Eye Prescription (lensPowerRight/Left, sph/cyl/axis/pd for both eyes), subtotal, totalGst, amount, discount, advancePaid, finalPayable, paymentMethod, paymentStatus, warrantyDetails, returnPolicy, prescriptionDeliveryDate, authorizedSignatory, products (OneToMany → BillingProduct)

---

## 🔄 4. Return Management

### Sales Return Lifecycle
```
Customer returns product
        ↓
SalesReturn.tsx → handleSaveReturn()
        ↓
Creates SalesReturnRecord: {
  returnDate, originalSaleBillNo, serialNo, branch,
  customerName/Contact/Email/Address,
  productName/Code, category, subcategory, hsn,
  returnQuantity, originalQuantity,
  salePrice, outputGSTPercent, outputGSTAmount, totalAmount,
  returnReason, remarks
}
        ↓
localStorage['salesReturns']
        ↓
⚠️ MISSING: Should → POST /api/billing-records/{id}/return
⚠️ MISSING: Should → inventoryService.addStock() to restore quantity
⚠️ MISSING: Should → update financial records (reduce sales revenue)
```

### Purchase Return Lifecycle
```
Supplier is sent goods back
        ↓
PurchaseReturn.tsx → handleSaveReturn()
        ↓
Creates PurchaseReturnRecord: {
  returnDate, originalPurchaseBillNo, branch,
  materialName, productCode, category, hsn,
  returnQuantity, originalQuantity,
  purchasePrice, inputGSTPercent, inputGSTAmount, totalAmount,
  returnReason, supplier: { name, address, gstin }, remarks
}
        ↓
localStorage['purchaseReturns']
        ↓
⚠️ MISSING: Should → PUT /api/purchases/{id} to reduce quantity
⚠️ MISSING: Should → inventoryService.removeStock() to reduce quantity
⚠️ MISSING: Should → update financial records (reduce purchase cost)
```

---

## 📊 5. Dashboard & Analytics

### Data Sources (dashboardService.ts)
```
getDashboardData(timeFilter, year)
  ├── readDataFile('purchase-records.json')   → PurchaseData[]
  ├── readDataFile('billing-records.json')    → SalesData[]
  ├── readDataFile('customer-records.json')   → Customer[]
  └── readDataFile('inventory-records.json')  → InventoryItem[]
```

> ⚠️ **GAP**: Dashboard reads from JSON FILES (not the backend API). This means if data is only in the H2 database (not synced to JSON), the dashboard will show stale/empty data.

### Profit & Loss Calculation
```
Net Profit = Total Sales Revenue - Cost of Goods Sold (COGS)

COGS per product = (unitCost from InventoryItem × quantity_sold) + GST on cost
                         ↑
               Matched by productName or productCode or category

Profit Margin = (Net Profit / Total Sales) × 100%

Monthly Growth = (Current Month Sales - Previous Month Sales) / Previous Month Sales × 100%
```

### Summary Stats Structure
```typescript
SummaryStats {
  totalPurchases: number   // Sum of purchase amounts
  totalSales: number       // Sum of final billing amounts
  netProfit: number        // totalSales - COGS
  profitMargin: number     // %
  activeCustomers: number  // Unique names from Customer + BillingRecord
  monthlyGrowth: number    // %
}
```

### Category Breakdown
- **Sales**: counted by **quantity** (not monetary amount, each item sold = 1)
- **Purchases**: aggregated by monetary amount
- Percentage = category_sales_count / total_items_sold × 100

### Branch Performance
- Branches: DIGL, MAYA, RANG, JUNG
- Aggregates sales + purchase amounts per branch
- Profit per branch = branch_sales - branch_purchases

---

## 🚨 6. Identified Gaps & Issues

### Critical Gaps

| # | Gap | Location | Impact |
|---|-----|----------|--------|
| 1 | **Sales Return does NOT update inventory** | `SalesReturn.tsx` | Stock levels wrong after customer return |
| 2 | **Purchase Return does NOT update inventory** | `PurchaseReturn.tsx` | Stock levels wrong after supplier return |
| 3 | **Dashboard reads JSON files, not DB** | `dashboardService.ts` | Analytics may show stale data |
| 4 | **Returns not stored in backend DB** | Both return pages | Data loss on localStorage clear |
| 5 | **No `SalesReturn` entity in Java** | `src/main/java/.../entity/` | No backend support for returns |
| 6 | **No `PurchaseReturn` entity in Java** | `src/main/java/.../entity/` | No backend support for returns |

### Design Inconsistencies

| # | Issue | Location |
|---|-------|----------|
| 1 | `SalesReturn` references `salesRecords` from localStorage but the actual sales are `BillingRecords` in DB | `SalesReturn.tsx` line 147 |
| 2 | Inventory `movements[]` array defined in TypeScript type but NOT in Java entity | `inventory.ts` vs `InventoryItem.java` |
| 3 | `InventoryItem.ts` has `currentStock` but Java entity uses `quantity` | Field naming inconsistency |
| 4 | Auth is mock only (hardcoded: siddhesh@amityonline.com / Sameer123) | `authService.ts` |
| 5 | Selling price formula in bulk purchase: `purchasePrice × 1.30` (30% margin) — hardcoded | `BulkPurchaseService.java` line 157 |
| 6 | Single Purchase does NOT have the 30% markup logic | `PurchaseService.java` |
| 7 | Dashboard `processSalesData` uses `amount: 1` per item (count) not actual price | `dashboardService.ts` line 133 |

---

## 📐 Database Schema (ER Summary)

```
purchases (id PK, purchase_bill_no UNIQUE, purchase_date, branch, material_name, 
           product_code, product_description, category ENUM, subcategory, hsn,
           quantity, purchase_price, input_gst_percent, input_gst_amount, total_amount,
           supplier_name, supplier_address, supplier_gstin, remarks, created_at, updated_at)

bulk_purchases (id PK, purchase_bill_no UNIQUE, purchase_date, branch,
                supplier_name, supplier_address, supplier_gstin, remarks,
                total_bill_amount, total_gst_amount, created_at, updated_at)
