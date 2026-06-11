# Comprehensive MySQL Commands Guide

This file provides the essential raw MySQL commands allowing anyone (even beginners) to interact with the database directly. To run these, open a terminal or command prompt and log into MySQL first.

### Login to MySQL
```bash
mysql -u root -proot
```

### 1. Database Operations
```sql
-- Show all databases
SHOW DATABASES;

-- Select our application database
USE `nayan-db`;

-- Show all tables inside nayan-db
SHOW TABLES;
```

### 2. View Data (SELECT)
Use `SELECT` commands to read information from the database without modifying anything.
```sql
-- See all users (including usernames, emails, hashed passwords)
SELECT * FROM users;

-- See all branches 
SELECT * FROM branches;

-- See all inventory items
SELECT id, product_code, product_name, category, quantity, purchase_price, selling_price FROM inventory_items;

-- See items that are out of stock
SELECT * FROM inventory_items WHERE quantity = 0;

