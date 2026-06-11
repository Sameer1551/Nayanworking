# 🏥 Nayan Eye Care — Complete System Flow Diagram
> **Both Customer & Supplier sides — Full lifecycle in one diagram**

---

## 🗺️ Legend

```
[Page/Screen]       → User-facing UI
{Service/API}       → Backend logic or service call
(DB Table)          → Database table
⚠️ WARNING          → Gap / incomplete feature
✅                  → Fully implemented
❌                  → Missing / not implemented
```

---

## 🔐 LAYER 0 — Authentication Gateway

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        WEBSITE ENTRY POINT  (/)                         │
│                                                                         │
│   Visitor arrives → authService.isAuthenticated() checks sessionStorage │
│                                                                         │
│         ┌──────────────────┬──────────────────────────┐                 │
│         │                  │                          │                 │
│    NOT LOGGED IN      LOGGED IN (Supplier)       LOGGED IN (Customer)   │
│         │                  │                          │                 │
│   [Home Page]    [/supplier/dashboard]          ⚠️ NOT IMPLEMENTED       │
│   (Customer-     (Supplier Panel)               Customer portal         │
│    facing site)                                 login does not exist    │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 👤 LAYER 1 — CUSTOMER SIDE (Public Facing)

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                               CUSTOMER JOURNEY (Public Website)                                 │
│                                                                                                 │
│  [Home Page /]                                                                                  │
│       │                                                                                         │
│       ├──→ [/spectacles]     Browse Spectacles catalog                                          │
│       ├──→ [/sunglasses]     Browse Sunglasses catalog                                          │
│       ├──→ [/contact-lenses] Browse Contact Lenses catalog                                      │
│       ├──→ [/frames]         Browse Frames catalog                                              │
│       └──→ [/solutions]      Browse Solutions catalog                                           │
│                                                                                                 │
│       ⚠️ ALL ABOVE PAGES ARE STATIC — No real inventory data shown from DB                      │
│       ❌ No Add to Cart                                                                         │
│       ❌ No Customer Login / Registration portal                                                │
│       ❌ No Online Order / Booking system                                                       │
│       ❌ No Prescription upload / Eye test booking                                              │
│       ❌ No Customer account to view past orders                                                │
│       ❌ No Customer payment gateway                                                            │
│                                                                                                 │
│  HOW CUSTOMER ACTUALLY BUYS (Current real flow):                                               │
│       Customer visits physical store                                                            │
│            ↓                                                                                    │
│       Staff (Supplier) creates billing on their behalf                                          │
│            ↓                                                                                    │
│       Customer exists only in backend (customers table)                                         │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🏪 LAYER 2 — SUPPLIER SIDE (Management Panel)

### 2A. Supplier Login

```
[Header → Login Button]
        ↓
[Login Modal / Form]
  email + password submitted
        ↓
{authService.login()}
        ↓
  → POST /api/auth/login
        ↓
  ┌─────────────────┐
  │  Auth Response  │
  ├─────────────────┤
  │ SUCCESS         │ → JWT token stored in sessionStorage
  │                 │ → window.dispatchEvent('authChange')
  │                 │ → Redirect to /supplier/dashboard
  ├─────────────────┤
  │ FAILURE         │ → Show error (currently mock only)
  └─────────────────┘
        ↓
⚠️ Currently: hardcoded mock — siddhesh@amityonline.com / Sameer123
❌ No real multi-user auth from DB
❌ Session lost on tab close (sessionStorage, not localStorage)
```

---

### 2B. Supplier Dashboard

```
[/supplier/dashboard]
        ↓
{dashboardService.getDashboardData(timeFilter, year)}
        ↓
  Reads from JSON files (NOT live API):
  ├── purchase-records.json  → Total Purchases
  ├── billing-records.json   → Total Sales
  ├── customer-records.json  → Active Customers
  └── inventory-records.json → Stock Value

  Calculations:
  ┌──────────────────────────────────────────────────────────────┐
  │  Net Profit    = Total Sales Revenue − COGS                  │
  │  COGS          = Σ (unitCost × qtySold) + GST on cost        │
  │  Profit Margin = (Net Profit / Total Sales) × 100%           │
  │  Monthly Growth= (This Month − Last Month) / Last Month × %  │
  └──────────────────────────────────────────────────────────────┘

  Cards shown:
  ├── Total Revenue
  ├── Net Profit
  ├── Active Customers
  ├── Monthly Growth %
  ├── Category Breakdown (by item count, NOT revenue)
