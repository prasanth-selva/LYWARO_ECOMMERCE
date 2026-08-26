# LYWARO — Interactive 3D E-Commerce Platform

> An interactive 3D footwear e-commerce platform built with the MERN stack, featuring WebGL-based product visualization for enhanced online shopping experiences.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Tailwind CSS 4, Three.js |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| 3D | Three.js (GLB model viewer) |
| Deploy | Vercel (frontend + serverless API) |

## Features

### Customer
- Interactive 3D product viewer (drag, zoom, rotate)
- Product browsing with search, filters, and sorting
- Cart with size/color selection
- Wishlist management
- Checkout with address management
- Order history and tracking
- User authentication (register, login, profile)

### Admin
- Dashboard with revenue, orders, products, customers
- Product CRUD with image management
- Order management with status updates
- User management

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- pnpm

### Local Development

```bash
# Install dependencies
pnpm install

# Set up environment
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Seed the database
pnpm seed

# Start the backend (port 5000)
pnpm server:dev

# Start the frontend (port 3000) — in another terminal
pnpm dev
```

Open http://localhost:3000

### Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@lywaro.com | admin123 |
| User | user@lywaro.com | user123 |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Backend server port | 5000 |
| `MONGO_URI` | MongoDB connection string | mongodb://localhost:27017/lywaro |
| `JWT_SECRET` | Secret key for JWT tokens | — |
| `JWT_EXPIRES_IN` | Token expiration | 7d |
| `CLIENT_URL` | Frontend URL for CORS | http://localhost:3000 |
| `RAZORPAY_KEY_ID` | Razorpay API key | — |
| `RAZORPAY_KEY_SECRET` | Razorpay API secret | — |

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Login |
| POST | /api/auth/logout | Logout |
| GET | /api/auth/me | Get current user |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products | List products (with filters) |
| GET | /api/products/:id | Get product by ID |
| GET | /api/products/slug/:slug | Get product by slug |
| GET | /api/products/featured | Featured products |
| GET | /api/products/bestsellers | Bestseller products |
| GET | /api/products/new-arrivals | New arrivals |
| GET | /api/products/search?q=term | Search products |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/cart | Get cart |
| POST | /api/cart | Add to cart |
| PUT | /api/cart/:itemId | Update cart item |
| DELETE | /api/cart/:itemId | Remove from cart |

### Wishlist
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/wishlist | Get wishlist |
| POST | /api/wishlist/:productId | Add to wishlist |
| DELETE | /api/wishlist/:productId | Remove from wishlist |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/orders | Create order |
| GET | /api/orders | Get user orders |
| GET | /api/orders/:id | Get order details |

### Admin (requires admin role)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/admin/dashboard | Dashboard stats |
| GET | /api/admin/users | List users |
| PUT | /api/admin/users/:id/toggle | Toggle user status |
| POST | /api/products | Create product |
| PUT | /api/products/:id | Update product |
| DELETE | /api/products/:id | Delete product |

## Deployment

### Vercel

1. Push to GitHub
2. Import in Vercel dashboard
3. Set environment variables:
   - `MONGO_URI` — MongoDB Atlas connection string
   - `JWT_SECRET` — Secure random string
   - `CLIENT_URL` — Your Vercel domain
4. Deploy

The API runs as a Vercel serverless function at `/api/*`.

### MongoDB Atlas (Free Tier)

1. Create account at mongodb.com
2. Create a free M0 cluster
3. Create a database user
4. Whitelist all IPs (0.0.0.0/0) for serverless
5. Copy the connection string to `MONGO_URI`

## Project Structure

```
LYWARO_ECOMMERCE/
├── api/
│   └── index.js          # Vercel serverless function
├── client/
│   ├── public/            # Static assets (SVGs, GLB model)
│   └── src/
│       ├── components/    # React components
│       ├── contexts/      # React Context (Auth, Store)
│       ├── pages/         # Page components
│       ├── services/      # API service layer
│       └── App.tsx
├── server/
│   ├── config/            # MongoDB connection
│   ├── controllers/       # Route handlers
│   ├── middleware/         # Auth, error handling
│   ├── models/            # Mongoose schemas
│   ├── routes/            # Express routes
│   ├── seed.js            # Database seeder
│   └── server.js          # Express server (local dev)
├── vercel.json            # Vercel configuration
├── vite.config.ts         # Vite configuration
└── package.json
```

## License

MIT
