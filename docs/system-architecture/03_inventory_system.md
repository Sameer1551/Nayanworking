# Part 3 — Inventory System

> 📂 Part of the [System Architecture Docs](./00_INDEX.md)

---

## 📦 Inventory Table Structure

**DB Table**: `inventory_items`  
**Java Entity**: `InventoryItem.java`  
**Key Unique Field**: `product_code`

| Field | Type | Notes |
|-------|------|-------|
| `id` | bigint PK | Auto-generated |
| `product_code` | string UNIQUE | Primary lookup key |
| `product_name` | string | |
| `category` | string | Spectacles / Frame / etc. |
| `subcategory` | string | |
| `description` | text | |
| `hsn_code` | string | GST HSN code |
| `quantity` | int | **Current stock level** |
| `purchase_price` | decimal | Cost from supplier |
| `selling_price` | decimal | Retail price |
| `gst_percentage` | decimal | |
| `supplier_name` | string | |
| `supplier_address` | text | |
| `supplier_gstin` | string | |
| `purchase_date` | date | Date of last purchase |
| `expiry_date` | date | For contact lenses / solutions |
| `minimum_stock` | int | Default: 0 (bulk sets 5) |
| `maximum_stock` | int | Default: null (bulk sets qty×2) |
| `reorder_point` | int | Default: 0 (bulk sets 10) |
| `remarks` | text | |
| `created_at` | datetime | Auto-set on insert |
| `updated_at` | datetime | Auto-set on update |

---

## ➕ Stock Increment (After Purchase)

### Triggered by Single Purchase
```
PurchaseService.java → updateInventoryFromPurchase()

findByProductCode(productCode)
    ├── FOUND → existingItem.quantity += purchasedQty
    │            save(existingItem)
    └── NOT FOUND → create new InventoryItem
                     set all fields from Purchase
                     save(newItem)
```

### Triggered by Bulk Purchase
```
BulkPurchaseService.java → updateInventoryFromBulkPurchase()

foreach PurchaseItem in bulkPurchase:
    findByProductCode(item.productCode)
    ├── FOUND → existingItem.quantity += item.quantity
    │            update purchaseDate if newer
    │            save(existingItem)
