/**
 * @file orders.js
 * @description Express routes for orders and products CRUD operations.
 * @author Sharon Barrial
 * @date 2026-03-04
 */

const express = require('express');
const router = express.Router();
const db = require('../config/db');

// producst

router.get('/products', async (req, res) => {
  try {
    const [products] = await db.execute('SELECT * FROM products ORDER BY id ASC');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/products/:id', async (req, res) => {
  try {
    const [products] = await db.execute('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (products.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(products[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/products', async (req, res) => {
  const { name, unitPrice } = req.body;
  if (!name || unitPrice === undefined) {
    return res.status(400).json({ message: 'name y unitPrice son requeridos' });
  }
  try {
    const [result] = await db.execute(
      'INSERT INTO products (name, unitPrice) VALUES (?, ?)',
      [name.trim(), unitPrice]
    );
    res.status(201).json({ id: result.insertId, message: 'Producto creado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/products/:id', async (req, res) => {
  const { name, unitPrice } = req.body;
  if (!name || unitPrice === undefined) {
    return res.status(400).json({ message: 'name y unitPrice son requeridos' });
  }
  try {
    const [products] = await db.execute('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (products.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    await db.execute(
      'UPDATE products SET name = ?, unitPrice = ? WHERE id = ?',
      [name.trim(), unitPrice, req.params.id]
    );
    res.json({ message: 'Producto actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    const [products] = await db.execute('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (products.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    await db.execute('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// orders

router.get('/orders', async (req, res) => {
  try {
    const [orders] = await db.execute(`
      SELECT 
        id,
        orderNumber,
        date,
        status,
        productsCount,
        finalPrice
      FROM orders
      ORDER BY id DESC
    `);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/orders/:id', async (req, res) => {
  try {
    const [orders] = await db.execute('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (orders.length === 0) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }
    
    const order = orders[0];

    const [items] = await db.execute(`
      SELECT 
        oi.id, oi.productId, p.name, p.unitPrice, oi.quantity,
        (oi.quantity * p.unitPrice) as totalPrice
      FROM order_items oi
      JOIN products p ON oi.productId = p.id
      WHERE oi.orderId = ?
    `, [req.params.id]);

    res.json({ 
      ...order, 
      items
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/orders', async (req, res) => {
  const { orderNumber, date, status, items, productsCount, finalPrice } = req.body;
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const [result] = await conn.execute(
      'INSERT INTO orders (orderNumber, date, status, productsCount, finalPrice) VALUES (?, ?, ?, ?, ?)',
      [orderNumber || `ORD-${Date.now()}`, date || new Date().toISOString().split('T')[0], status || 'Pending', productsCount || 0, finalPrice || 0]
    );
    const orderId = result.insertId;

    if (items && Array.isArray(items) && items.length > 0) {
      for (const item of items) {
        await conn.execute(
          'INSERT INTO order_items (orderId, productId, quantity) VALUES (?, ?, ?)',
          [orderId, item.productId, item.quantity]
        );
      }
    }
    
    await conn.commit();
    res.json({ id: orderId, message: 'Orden creada exitosamente' });
  } catch (error) {
    await conn.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    conn.release();
  }
});

router.put('/orders/:id', async (req, res) => {
  const { orderNumber, date, status, items, productsCount, finalPrice } = req.body;
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    
    const [orders] = await conn.execute('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (orders.length === 0) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    await conn.execute(
      'UPDATE orders SET orderNumber = ?, date = ?, status = ?, productsCount = ?, finalPrice = ? WHERE id = ?',
      [orderNumber, date, status, productsCount || 0, finalPrice || 0, req.params.id]
    );

    if (items && Array.isArray(items) && items.length > 0) {
      await conn.execute('DELETE FROM order_items WHERE orderId = ?', [req.params.id]);
      
      for (const item of items) {
        await conn.execute(
          'INSERT INTO order_items (orderId, productId, quantity) VALUES (?, ?, ?)',
          [req.params.id, item.productId, item.quantity]
        );
      }
    }

    await conn.commit();
    res.json({ message: 'Orden actualizada exitosamente' });
  } catch (error) {
    await conn.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    conn.release();
  }
});

router.delete('/orders/:id', async (req, res) => {
  try {
    const [orders] = await db.execute('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (orders.length === 0) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    await db.execute('DELETE FROM order_items WHERE orderId = ?', [req.params.id]);
    await db.execute('DELETE FROM orders WHERE id = ?', [req.params.id]);
    
    res.json({ message: 'Orden eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;