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
