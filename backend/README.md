# Cozy Crochet Studio - Backend API

Backend API for the Cozy Crochet Studio e-commerce platform built with Node.js, Express, and Prisma.

## Features

- 🔐 User authentication (JWT)
- 📦 Product management
- 🛒 Order processing
- 📍 Address management
- 🎫 Coupon validation
- 🗄️ PostgreSQL database with Prisma ORM

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and update:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `JWT_SECRET` - A random secret string for JWT tokens
   - `PORT` - Server port (default: 5000)
   - `FRONTEND_URL` - Your frontend URL for CORS

3. **Set up the database:**
   ```bash
   # Generate Prisma Client
   npm run prisma:generate
   
   # Run migrations
   npm run prisma:migrate
   
   # Seed the database
   npm run prisma:seed
   ```

4. **Start the server:**
   ```bash
   # Development mode (with auto-reload)
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)
- `PUT /api/auth/profile` - Update user profile (requires auth)

### Products
- `GET /api/products` - Get all products (supports query: category, search, inStock)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders
- `GET /api/orders` - Get user's orders (requires auth)
- `GET /api/orders/:id` - Get single order (requires auth)
- `POST /api/orders` - Create order (requires auth)
- `PATCH /api/orders/:id/status` - Update order status (requires auth)

### Addresses
- `GET /api/addresses` - Get user's addresses (requires auth)
- `GET /api/addresses/:id` - Get single address (requires auth)
- `POST /api/addresses` - Create address (requires auth)
- `PUT /api/addresses/:id` - Update address (requires auth)
- `DELETE /api/addresses/:id` - Delete address (requires auth)
- `PATCH /api/addresses/:id/default` - Set default address (requires auth)

### Coupons
- `POST /api/coupons/validate` - Validate coupon code
- `GET /api/coupons` - Get all coupons (admin)
- `POST /api/coupons` - Create coupon (admin)

## Authentication

Protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Database Schema

- **User** - User accounts
- **Address** - Shipping addresses
- **Product** - Product catalog
- **Order** - Customer orders
- **OrderItem** - Order line items
- **Coupon** - Discount coupons

## Development

- View database: `npm run prisma:studio`
- Reset database: `npm run db:reset`
- Push schema changes: `npm run db:push`

## Deployment

1. Set production environment variables
2. Run migrations: `npm run prisma:migrate`
3. Start server: `npm start`

Make sure to set `NODE_ENV=production` in your production environment.

