# Part 2 — Purchase & Supplier Flow

> 📂 Part of the [System Architecture Docs](./00_INDEX.md)

---

## 🔄 Single Purchase Flow

**Frontend**: `src/pages/supplier/Purchase.tsx`  
**Service**: `src/services/purchaseService.ts`  
**Backend**: `PurchaseService.java` → `PurchaseController.java`  
**DB Table**: `purchases`

```
User fills Purchase Form
        ↓
purchaseService.appendPurchaseData(purchaseData)
        ↓
  → POST /api/purchases  (backend REST endpoint)
  → Backend saves to H2 `purchases` table
  → Backend auto-creates/updates InventoryItem  ← KEY STEP
        ↓
purchaseService.saveToLocalFile()  (backup to purchase-records.json)
        ↓
inventoryService.refreshInventory()  (refresh frontend state cache)
```

### PurchaseData Fields (TypeScript Interface)

