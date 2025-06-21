const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all products (with optional price filters)
router.get('/', (req, res) => {
  const { minPrice, maxPrice } = req.query;
  let sql = 'SELECT * FROM products WHERE 1=1';
  let params = [];
  if (minPrice) {
    sql += ' AND price >= ?';
    params.push(parseFloat(minPrice));
  }
  if (maxPrice) {
    sql += ' AND price <= ?';
    params.push(parseFloat(maxPrice));
  }
  sql += ' ORDER BY created_at DESC';
  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, data: rows, count: rows.length });
  });
});

// Create new product
router.post('/', (req, res) => {
  const { name, description, price, stock } = req.body;
  if (!name || !price) return res.status(400).json({ error: 'Name and price are required' });
  db.run('INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)', [name, description, price, stock || 0], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ success: true, data: { id: this.lastID, name, description, price, stock } });
  });
});

// Update product
router.put('/:id', (req, res) => {
  const { name, description, price, stock } = req.body;
  db.run('UPDATE products SET name = ?, description = ?, price = ?, stock = ? WHERE id = ?', [name, description, price, stock, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Product not found' });
    res.json({ success: true, data: { id: req.params.id, name, description, price, stock } });
  });
});

// Delete product
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM products WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Product not found' });
    res.json({ success: true, message: 'Product deleted successfully' });
  });
});

module.exports = router;
