# Part 4 — Customer & Sales Flow

> 📂 Part of the [System Architecture Docs](./00_INDEX.md)

---

## 👥 Customer Data Sources

Customers come from **two separate data sources** that are merged:

```
Source 1: customers table
          API: GET /api/customers
          Service: CustomerService.java
          
Source 2: billing_records table
          API: GET /api/billing-records
          Service: BillingRecordService.java
          
              ↓
billingService.mergeCustomerAndBillingData()
              ↓
Unified CustomerBillingSummary
  source: 'customer_record' | 'billing_record' | 'combined'
```

### Merge Logic
- Match by `mobileNo` (mobile number is the primary key for identity)
- If a customer exists in both → marked as `COMBINED`
- If only in `customers` table → `CUSTOMER_RECORD`
- If only referenced in billing → `BILLING_RECORD`

---

## 👤 Customer Entity Fields

**DB Table**: `customers`  
**Java Entity**: `Customer.java`

| Field | Type | Notes |
|-------|------|-------|
| `id` | bigint PK | |
| `mobile_no` | string UNIQUE | Primary identifier |
| `full_name` | string | |
| `branch_name` | string | |
| `branch_code` | string | |
| `title` | string | Mr/Mrs/Ms etc. |
| `mobile_no2` | string | Secondary number |
| `gender` | enum | MALE / FEMALE / OTHER |
| `gstin_no` | string | |
| `date_of_birth` | date | |
| `age` | int | |
| `notes` | text | |
| `email` | string | |
| `city` | string | |
| `anniversary` | date | |
| `date_of_visit` | date | |
| `last_visit_date` | date | Auto-updated on billing |
| `visit_count` | int | Incremented on each sale |
| `total_spent` | double | Cumulative sales amount |
| `average_bill_amount` | double | totalSpent / visitCount |
| `last_bill_number` | string | |
| `last_bill_date` | date | |
| `source` | enum | CUSTOMER_RECORD / BILLING_RECORD / COMBINED |
| `created_at` / `updated_at` | datetime | |

---

