const request = require('supertest');
const app = require('../server');

describe('API Endpoints', () => {
  // Root API docs
  describe('GET /', () => {
    it('should return API documentation', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Custom API Server');
    });
  });

  // Health check
  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toMatch(/API is running/);
    });
  });

  // USERS
  describe('Users API', () => {
    let userId;

    it('should create a user', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({ name: 'Test User', email: 'testuser@example.com', age: 22 });
      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      userId = res.body.data.id;
    });

    it('should get all users', async () => {
      const res = await request(app).get('/api/users');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should get user by id', async () => {
      const res = await request(app).get(`/api/users/${userId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.id).toBe(userId);
    });

    it('should update user', async () => {
      const res = await request(app)
        .put(`/api/users/${userId}`)
        .send({ name: 'User Updated', email: 'testuser@example.com', age: 23 });
      expect(res.statusCode).toBe(200);
      expect(res.body.data.name).toBe('User Updated');
    });

    it('should delete user', async () => {
      const res = await request(app).delete(`/api/users/${userId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // PRODUCTS
  describe('Products API', () => {
    let productId;

    it('should create a product', async () => {
      const res = await request(app)
        .post('/api/products')
        .send({ name: 'Test Product', description: 'desc', price: 10.5, stock: 5 });
      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      productId = res.body.data.id;
    });

    it('should get all products', async () => {
      const res = await request(app).get('/api/products');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should update product', async () => {
      const res = await request(app)
        .put(`/api/products/${productId}`)
        .send({ name: 'Updated Product', description: 'desc2', price: 20, stock: 10 });
      expect(res.statusCode).toBe(200);
      expect(res.body.data.name).toBe('Updated Product');
    });

    it('should delete product', async () => {
      const res = await request(app).delete(`/api/products/${productId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // ORDERS
  describe('Orders API', () => {
    let userId, productId, orderId;

    beforeAll(async () => {
      // Create user and product for order
      const userRes = await request(app)
        .post('/api/users')
        .send({ name: 'Order User', email: 'orderuser@example.com', age: 30 });
      userId = userRes.body.data.id;

      const productRes = await request(app)
        .post('/api/products')
        .send({ name: 'Order Product', description: 'desc', price: 50, stock: 20 });
      productId = productRes.body.data.id;
    });

    it('should create an order', async () => {
      const res = await request(app)
        .post('/api/orders')
        .send({ user_id: userId, product_id: productId, quantity: 2 });
      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      orderId = res.body.data.id;
    });

    it('should get all orders', async () => {
      const res = await request(app).get('/api/orders');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should update order status', async () => {
      const res = await request(app)
        .put(`/api/orders/${orderId}/status`)
        .send({ status: 'shipped' });
      expect(res.statusCode).toBe(200);
      expect(res.body.data.status).toBe('shipped');
    });
  });

  // ANALYTICS
  describe('Analytics API', () => {
    it('should get summary statistics', async () => {
      const res = await request(app).get('/api/analytics/summary');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('total_users');
    });

    it('should get top products', async () => {
      const res = await request(app).get('/api/analytics/top-products');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  // 404
  describe('404 Handler', () => {
    it('should return 404 for unknown endpoint', async () => {
      const res = await request(app).get('/api/unknown');
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});
