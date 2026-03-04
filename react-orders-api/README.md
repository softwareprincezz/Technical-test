# Order Management API

REST API for managing orders and products built with Node.js, Express and MySQL.

**Author:** Sharon Barrial  
**Date:** 2026-03-04

## 📋 Requirements

- Node.js v16+
- MySQL 8.0+
- npm

## 🚀 Installation

### 1. Install dependencies

```bash
cd react-orders-api
npm install
```

### 2. Set up the database

#### Option A: Using MySQL command line
```bash
mysql -u root -p < database.sql
```

#### Option B: Manually
1. Open MySQL Workbench or run `mysql -u root -p`
2. Copy and execute the contents of `database.sql`

### 3. Create the `.env` file

Create a `.env` file at the root of the project:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=order_management
PORT=5000
```

**Adjust the values according to your MySQL configuration.**

### 4. Start the server

```bash
npm run dev
```

The server will be available at: `http://localhost:5000`

## 📚 API Endpoints

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a product by ID
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product

### Orders

- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get an order by ID
- `POST /api/orders` - Create a new order
- `PUT /api/orders/:id` - Update an order
- `DELETE /api/orders/:id` - Delete an order

## 📝 Data Structure

### POST/PUT /api/products

```json
{
  "name": "Laptop",
  "unitPrice": 999.99
}
```

### POST/PUT /api/orders

```json
{
  "orderNumber": "ORD-005",
  "date": "2026-03-04",
  "status": "Pending",
  "productsCount": 2,
  "finalPrice": 1074.99,
  "items": [
    {
      "productId": 1,
      "quantity": 2
    }
  ]
}
```

### Response GET /api/orders

```json
[
  {
    "id": 1,
    "orderNumber": "ORD-001",
    "date": "2026-03-04",
    "status": "Pending",
    "productsCount": 3,
    "finalPrice": 1050.48
  }
]
```

### Response GET /api/orders/:id

```json
{
  "id": 1,
  "orderNumber": "ORD-001",
  "date": "2026-03-04",
  "status": "Pending",
  "productsCount": 3,
  "finalPrice": 1050.48,
  "items": [
    {
      "id": 1,
      "productId": 1,
      "name": "Laptop",
      "unitPrice": 999.99,
      "quantity": 1,
      "totalPrice": 999.99
    }
  ]
}
```

## 🔧 Development

To run with auto-reload:

```bash
npm run dev
```

## 📦 Dependencies

- **express**: Web framework
- **mysql2/promise**: MySQL driver with Promises
- **cors**: CORS middleware
- **dotenv**: Environment variables

## ✅ Features

- ✅ Full CRUD for orders
- ✅ Full CRUD for products
- ✅ Database transactions
- ✅ Data validation
- ✅ Descriptive error messages
- ✅ Completed orders cannot be edited
- ✅ Automatic total calculation
- ✅ Cascade deletion of items when an order is deleted

## 🚨 Notes

- Orders with status "Completed" cannot be edited
- Deleting an order automatically removes its associated items
- Items are optional when creating or updating orders