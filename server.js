const express = require('express');
const cors = require('cors');
require('dotenv').config();

const usersRouter = require('./src/routes/users');
const productsRouter = require('./src/routes/products');
const ordersRouter = require('./src/routes/orders');
const analyticsRouter = require('./src/routes/analytics');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// API routes
app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/analytics', analyticsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running successfully',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API documentation
app.get('/', (req, res) => {
  res.json({
    message: 'Custom API Server',
    version: '1.0.0',
    endpoints: {
      users: {
        'GET /api/users': 'Get all users',
        'GET /api/users/:id': 'Get user by ID',
        'POST /api/users': 'Create new user',
        'PUT /api/users/:id': 'Update user',
        'DELETE /api/users/:id': 'Delete user'
      },
      products: {
        'GET /api/products': 'Get all products (supports query params: minPrice, maxPrice)',
        'POST /api/products': 'Create new product',
        'PUT /api/products/:id': 'Update product',
        'DELETE /api/products/:id': 'Delete product'
      },
      orders: {
        'GET /api/orders': 'Get all orders with details',
        'POST /api/orders': 'Create new order',
        'PUT /api/orders/:id/status': 'Update order status'
      },
      analytics: {
        'GET /api/analytics/summary': 'Get general statistics',
        'GET /api/analytics/top-products': 'Get top selling products'
      },
      system: {
        'GET /api/health': 'Health check',
        'GET /': 'API documentation'
      }
    }
  });
});

// Error handling and 404
app.use(errorHandler);
app.use('*', (req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = app;
