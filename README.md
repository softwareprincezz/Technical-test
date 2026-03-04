# Order Management System

Full-stack application for managing orders and products.

**Author:** Sharon Barrial  
**Date:** 2026-03-04

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Database | MySQL |

## 📁 Repository Structure

```
order-management/
├── react-orders/         # Frontend - React + Vite
└── react-orders-api/     # Backend - Node.js + Express
```

## 🚀 Quick Start

### 1. Set up the database
```bash
mysql -u root -p < react-orders-api/database.sql
```

### 2. Start the backend
```bash
cd react-orders-api
npm install
npm run dev
# Running on http://localhost:5000
```

### 3. Start the frontend
```bash
cd react-orders
npm install
npm run dev
# Running on http://localhost:5173
```

## 🗂️ Views

| Route | Description |
|-------|-------------|
| `/my-orders` | List, edit, delete and manage order status |
| `/add-order` | Create a new order |
| `/add-order/:id` | Edit an existing order |
| `/products` | List, add, edit and delete products |

## ✅ Technical Requirements

- ✅ React JS
- ✅ 2 main views with their own routes
- ✅ REST API with Express JS / Node.js
- ✅ MySQL database connection
- ✅ No login or token required

## ⭐ Extra Points

- ✅ **a)** Products view (list, add, edit, delete)
- ✅ **b)** Order status management (Pending, InProgress, Completed)
- ✅ **c)** Completed orders are locked from editing
