-- ============================================================
-- Schema Migration: nayan-db integrity repair
-- Date: 2026-04-17
-- Purpose: Add missing unique indexes and foreign key constraints
--          to bring the live schema in line with JPA entity declarations.
-- ============================================================

-- Run ALL statements in order.
-- Safe to re-run: uses IF NOT EXISTS / IF EXISTS guards.

USE `nayan-db`;

-- ----------------------------------------------------------------
-- 1. UNIQUE INDEXES on users table
-- ----------------------------------------------------------------

-- 1a. Unique index on email (JPA entity declares @Column(unique=true))
SELECT COUNT(*) INTO @idx_exists
FROM information_schema.STATISTICS
WHERE table_schema = 'nayan-db'
  AND table_name   = 'users'
  AND index_name   = 'uq_users_email';

SET @stmt = IF(@idx_exists = 0,
  'ALTER TABLE users ADD CONSTRAINT uq_users_email UNIQUE (email)',
  'SELECT ''uq_users_email already exists, skipping.'' AS info'
);
PREPARE s FROM @stmt; EXECUTE s; DEALLOCATE PREPARE s;

-- 1b. Unique index on phone (JPA entity declares @Column(unique=true))
SELECT COUNT(*) INTO @idx_exists
FROM information_schema.STATISTICS
WHERE table_schema = 'nayan-db'
  AND table_name   = 'users'
  AND index_name   = 'uq_users_phone';

SET @stmt = IF(@idx_exists = 0,
  'ALTER TABLE users ADD CONSTRAINT uq_users_phone UNIQUE (phone)',
  'SELECT ''uq_users_phone already exists, skipping.'' AS info'
);
PREPARE s FROM @stmt; EXECUTE s; DEALLOCATE PREPARE s;

-- 1c. Unique index on gst_number
SELECT COUNT(*) INTO @idx_exists
FROM information_schema.STATISTICS
WHERE table_schema = 'nayan-db'
  AND table_name   = 'users'
  AND index_name   = 'uq_users_gst_number';

SET @stmt = IF(@idx_exists = 0,
  'ALTER TABLE users ADD CONSTRAINT uq_users_gst_number UNIQUE (gst_number)',
  'SELECT ''uq_users_gst_number already exists, skipping.'' AS info'
);
PREPARE s FROM @stmt; EXECUTE s; DEALLOCATE PREPARE s;

-- ----------------------------------------------------------------
-- 2. FOREIGN KEYS from supplier-linked tables to users
-- ----------------------------------------------------------------

-- Disable FK checks temporarily so we can add constraints safely
-- even if there are pre-existing orphaned rows (log them below first).
-- WARNING: Review the orphan queries below before applying FKs in production.

-- 2a. Orphan check — find purchases with no matching user
SELECT 'Orphan check: purchases.supplier_id not in users.id' AS check_label;
SELECT p.id, p.supplier_id
FROM purchases p
WHERE p.supplier_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM users u WHERE u.id = p.supplier_id)
LIMIT 20;

-- 2b. Orphan check — inventory_items
SELECT 'Orphan check: inventory_items.supplier_id not in users.id' AS check_label;
SELECT i.id, i.supplier_id
FROM inventory_items i
WHERE i.supplier_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM users u WHERE u.id = i.supplier_id)
LIMIT 20;

-- 2c. Orphan check — bulk_purchases
SELECT 'Orphan check: bulk_purchases.supplier_id not in users.id' AS check_label;
SELECT b.id, b.supplier_id
FROM bulk_purchases b
WHERE b.supplier_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM users u WHERE u.id = b.supplier_id)
LIMIT 20;

