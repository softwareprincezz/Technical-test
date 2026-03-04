-- ============================================================
-- @file       database.sql
-- @description Creates and initializes the order_management
--              database with tables for products, orders,
--              and order items, along with sample data.
-- @author     Sharon Barrial
-- @date       2026-03-04
-- ============================================================

DROP DATABASE IF EXISTS order_management;
CREATE DATABASE order_management;
USE order_management;

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  unitPrice DECIMAL(10, 2) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- orders table
CREATE TABLE IF NOT EXISTS orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  orderNumber VARCHAR(50) UNIQUE NOT NULL,
  date DATE NOT NULL,
  productsCount INT DEFAULT 0,
  finalPrice DECIMAL(10, 2) DEFAULT 0.00,
  status ENUM('Pending', 'InProgress', 'Completed') DEFAULT 'Pending',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- order items table
CREATE TABLE IF NOT EXISTS order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  orderId INT NOT NULL,
  productId INT NOT NULL,
  quantity INT DEFAULT 1,
  FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (productId) REFERENCES products(id)
);

-- add some products to init the database with some data
INSERT INTO products (name, unitPrice) VALUES
('Laptop', 999.99),
('Mouse', 25.50),
('Teclado', 75.00),
('Monitor', 299.99),
('Webcam', 89.99);

-- add some orders
INSERT INTO orders (orderNumber, date, status, productsCount, finalPrice) VALUES
('ORD-001', '2026-03-04', 'Pending', 3, 1050.99),
('ORD-002', '2026-03-03', 'InProgress', 2, 374.99),
('ORD-003', '2026-03-02', 'Completed', 4, 1269.96);

-- Add order items for the orders
INSERT INTO order_items (orderId, productId, quantity) VALUES
(1, 1, 1),
(1, 2, 2),
(2, 3, 1),
(2, 4, 1),
(3, 5, 3),
(3, 1, 1);
