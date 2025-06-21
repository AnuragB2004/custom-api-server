const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all orders with details
router.get('/', (req, res) => {
  const sql = `
    SELECT 
      o.id, o.quantity, o.total_amount, o.status, o.created_at,
      u.name as user_name, u.email as user_email,
      p.name as product_name, p.price as product_price
    FROM orders o
    JOIN users u ON o.user_id = u.id
    JOIN products p ON o.product_id = p.id
    ORDER BY o.created_at DESC
  `;
  db.all(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, data: rows, count: rows.length });
  });
});

// Create new order
router.post('/', (req, res) => {
  const { user_id, product_id, quantity } = req.body;
  if (!user_id || !product_id || !quantity) return res.status(400).json({ error: 'user_id, product_id, and quantity are required' });
  db.get('SELECT price, stock FROM products WHERE id = ?', [product_id], (err, product) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    if (product.stock < quantity) return res.status(400).json({ error: 'Insufficient stock' });
    const total_amount = product.price * quantity;
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');
      db.run('INSERT INTO orders (user_id, product_id, quantity, total_amount) VALUES (?, ?, ?, ?)', [user_id, product_id, quantity, total_amount], function(err) {
        if (err) {
          db.run('ROLLBACK');
          return res.status(500).json({ error: err.message });
        }
        const order_id = this.lastID;
        db.run('UPDATE products SET stock = stock - ? WHERE id = ?', [quantity, product_id], function(err) {
          if (err) {
            db.run('ROLLBACK');
            return res.status(500).json({ error: err.message });
          }
          db.run('COMMIT');
          res.status(201).json({
            success: true,
            data: { id: order_id, user_id, product_id, quantity, total_amount, status: 'pending' }
          });
        });
      });
    });
  });
});

// Update order status
router.put('/:id/status', (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) return res.status(400).json({ error: 'Invalid status' });
  db.run('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Order not found' });
    res.json({ success: true, data: { id: req.params.id, status } });
  });
});

module.exports = router;
