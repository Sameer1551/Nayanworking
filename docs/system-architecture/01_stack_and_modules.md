# Part 1 — Technology Stack & Module Overview

> 📂 Part of the [System Architecture Docs](./00_INDEX.md)

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
