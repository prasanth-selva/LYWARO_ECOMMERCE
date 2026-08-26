# LYWARO — Move Different

Premium sneaker e-commerce platform built with the MERN stack.

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, Three.js, Framer Motion, Wouter
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Auth:** JWT, bcryptjs, HTTP-only cookies
- **Payment:** Razorpay-ready (test mode)

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- pnpm

## Setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your MongoDB URI and a secure JWT secret.

### 3. Start MongoDB

```bash
# Local
mongod

# Or use MongoDB Atlas connection string in .env
```

### 4. Seed the database

```bash
pnpm seed
```

This creates:
- **Admin account:** `admin@lywaro.com` / `admin123`
- **Test account:** `user@lywaro.com` / `user123`
- **4 LYWARO products:** APEX, VECTOR, SHIFT, CORE + 2 more

### 5. Start the dev servers

```bash
# Frontend (Vite, port 3000)
pnpm dev

# Backend (Express, port 5000) — in another terminal
pnpm server
```

### 6. Open

- **Storefront:** http://localhost:3000
- **Admin:** http://localhost:3000/admin

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| POST | /api/auth/logout | Logout |
| GET | /api/auth/me | Current user |
| PUT | /api/auth/profile | Update profile |
| PUT | /api/auth/change-password | Change password |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products | List products (pagination, filters) |
| GET | /api/products/:id | Product by ID |
| GET | /api/products/slug/:slug | Product by slug |
| GET | /api/products/search?q=... | Search products |
| GET | /api/products/featured | Featured products |
| GET | /api/products/bestsellers | Bestsellers |
| GET | /api/products/new-arrivals | New arrivals |

### Cart (authenticated)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/cart | Get cart |
| POST | /api/cart | Add to cart |
| PUT | /api/cart/:itemId | Update quantity |
| DELETE | /api/cart/:itemId | Remove item |
| DELETE | /api/cart | Clear cart |

### Wishlist (authenticated)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/wishlist | Get wishlist |
| POST | /api/wishlist/:productId | Add to wishlist |
| DELETE | /api/wishlist/:productId | Remove from wishlist |

### Orders (authenticated)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/orders | Create order |
| GET | /api/orders | User orders |
| GET | /api/orders/:id | Order detail |

### Payment (authenticated)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/payment/create-order | Create payment order |
| POST | /api/payment/verify | Verify payment |

### Admin (admin only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/admin/dashboard | Dashboard stats |
| POST | /api/products | Create product |
| PUT | /api/products/:id | Update product |
| DELETE | /api/products/:id | Delete product |
| GET | /api/admin/users | List users |
| GET | /api/orders/admin/all | All orders |
| PUT | /api/orders/admin/:id/status | Update order status |

## Project Structure

```
lywaro/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── contexts/       # React contexts (Auth, Store, Theme)
│   │   ├── pages/          # Route pages
│   │   ├── services/       # API service layer
│   │   └── ...
│   └── public/             # Static assets (models, images)
├── server/                 # Express backend
│   ├── config/             # Database config
│   ├── controllers/        # Route handlers
│   ├── middleware/          # Auth, error handling
│   ├── models/             # Mongoose schemas
│   ├── routes/             # Express routes
│   ├── utils/              # Token helpers
│   ├── seed.js             # Database seeder
│   └── server.js           # Entry point
└── .env.example
```

## Production

```bash
pnpm build          # Build frontend
pnpm start          # Start production server (serves frontend + API)
```

## License

MIT
