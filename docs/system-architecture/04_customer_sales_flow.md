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

