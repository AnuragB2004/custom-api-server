const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Summary statistics
router.get('/summary', (req, res) => {
  const queries = [
    'SELECT COUNT(*) as total_users FROM users',
    'SELECT COUNT(*) as total_products FROM products',
    'SELECT COUNT(*) as total_orders FROM orders',
    'SELECT SUM(total_amount) as total_revenue FROM orders WHERE status != "cancelled"',
    'SELECT AVG(age) as average_user_age FROM users WHERE age IS NOT NULL'
  ];
  let results = {};
  let completed = 0;
  queries.forEach((query, index) => {
    db.get(query, (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      switch(index) {
        case 0: results.total_users = row.total_users; break;
        case 1: results.total_products = row.total_products; break;
        case 2: results.total_orders = row.total_orders; break;
        case 3: results.total_revenue = row.total_revenue || 0; break;
        case 4: results.average_user_age = Math.round(row.average_user_age || 0); break;
      }
      completed++;
      if (completed === queries.length) {
        res.json({ success: true, data: results });
      }
    });
  });
});

// Top selling products
router.get('/top-products', (req, res) => {
  const sql = `
    SELECT 
      p.id, p.name, p.price,
      SUM(o.quantity) as total_sold,
      SUM(o.total_amount) as total_revenue
    FROM products p
    JOIN orders o ON p.id = o.product_id
    WHERE o.status != 'cancelled'
    GROUP BY p.id, p.name, p.price
    ORDER BY total_sold DESC
    LIMIT 10
  `;
  db.all(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, data: rows });
  });
});

module.exports = router;
