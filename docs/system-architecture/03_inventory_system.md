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
