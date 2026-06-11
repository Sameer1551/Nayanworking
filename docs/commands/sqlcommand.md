& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -proot

-- BASIC COMMANDS
SHOW DATABASES;USE `nayan-db`;SHOW TABLES;

-- USER MANAGEMENT
SELECT * FROM users;
SELECT id, first_name, last_name, email, user_type FROM users WHERE user_type = 'SUPPLIER';
SELECT id, first_name, last_name, email, user_type FROM users WHERE user_type = 'CUSTOMER';
-- Mark a user as inactive: UPDATE users SET is_active = 0 WHERE id = <user_id>;

-- INVENTORY & STOCK
SELECT * FROM inventory_items;
