const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all users
router.get('/', (req, res) => {
  db.all('SELECT * FROM users ORDER BY created_at DESC', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, data: rows, count: rows.length });
  });
});

// Get user by ID
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM users WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true, data: row });
  });
});

// Create new user
router.post('/', (req, res) => {
  const { name, email, age } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });
  db.run('INSERT INTO users (name, email, age) VALUES (?, ?, ?)', [name, email, age], function(err) {
    if (err) {
      if (err.code === 'SQLITE_CONSTRAINT') return res.status(400).json({ error: 'Email already exists' });
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ success: true, data: { id: this.lastID, name, email, age } });
  });
});

// Update user
router.put('/:id', (req, res) => {
  const { name, email, age } = req.body;
  db.run('UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?', [name, email, age, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true, data: { id: req.params.id, name, email, age } });
  });
});

// Delete user
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM users WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true, message: 'User deleted successfully' });
  });
});

module.exports = router;
