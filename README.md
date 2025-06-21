# Custom API Server

A professional Node.js REST API server using Express and SQLite, featuring full CRUD operations for users, products, and orders, plus analytics endpoints. Includes robust error handling, automated tests, and built-in API documentation.

---

## 🚀 Features

- **Full CRUD** for Users and Products
- **Order management** with stock control
- **Analytics**: Summary stats and top-selling products
- **SQLite** database integration (zero config)
- **Automated tests** (Jest & Supertest)
- **VS Code REST Client** support via `test.http`
- **Self-documenting** root endpoint

---

## 📚 API Endpoints

### Users API (`/api/users`)
- `GET /api/users` — List all users
- `GET /api/users/:id` — Get user by ID
- `POST /api/users` — Create user
- `PUT /api/users/:id` — Update user
- `DELETE /api/users/:id` — Delete user

### Products API (`/api/products`)
- `GET /api/products` — List all products (supports `minPrice`, `maxPrice` filters)
- `POST /api/products` — Create product
- `PUT /api/products/:id` — Update product
- `DELETE /api/products/:id` — Delete product

### Orders API (`/api/orders`)
- `GET /api/orders` — List all orders (with user/product details)
- `POST /api/orders` — Create order (decrements product stock)
- `PUT /api/orders/:id/status` — Update order status

### Analytics API (`/api/analytics`)
- `GET /api/analytics/summary` — Business statistics (users, products, orders, revenue, avg. age)
- `GET /api/analytics/top-products` — Top selling products

### System
- `GET /api/health` — Health check
- `GET /` — API documentation

---

## 🗄️ Database

- **Type**: SQLite (local file, no setup required)
- **Integration**: Managed via `sqlite3` Node.js package. Tables are auto-created on server start.
- **Schema**:
    - **users**: `id`, `name`, `email`, `age`, `created_at`
    - **products**: `id`, `name`, `description`, `price`, `stock`, `created_at`
    - **orders**: `id`, `user_id`, `product_id`, `quantity`, `total_amount`, `status`, `created_at`

---

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/custom-api-server.git
cd custom-api-server
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Server

For development (auto-reload):

```bash
npm run dev
```

For production:

```bash
npm start
```

The server runs at [http://localhost:3000](http://localhost:3000).

---

## 🧪 Testing

### Automated Tests

Run all tests with:

```bash
npm test
```

### Manual API Testing

- Use the included `test.http` file with the [VS Code REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client).
- Or use Postman/cURL.

#### Example cURL requests

```bash
# Health check
curl http://localhost:3000/api/health

# Create a user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","age":28}'
```

---

## 💡 Sample Request & Response

**Request:**
```http
GET /api/users
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "age": 30,
      "created_at": "2025-06-21T09:13:00.000Z"
    }
  ],
  "count": 1
}
```

---

## 📑 Documentation

- Visit [http://localhost:3000/](http://localhost:3000/) for a full list of endpoints and their descriptions.
- Health check: [http://localhost:3000/api/health](http://localhost:3000/api/health)

---

## ⚙️ Project Structure

```
custom-api-server/
├── server.js
├── package.json
├── .env
├── .gitignore
├── README.md
├── test.http
├── src/
│   ├── config/
│   │   └── database.js
│   ├── routes/
│   │   ├── users.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   └── analytics.js
│   └── middleware/
│       └── errorHandler.js
└── tests/
    └── api.test.js
```

---

## 📝 License

MIT

---

**Feel free to use, modify, and extend this project for your own learning or development!**
