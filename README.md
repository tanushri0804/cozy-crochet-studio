# Cozy Crochet Studio

A full-stack e-commerce platform for handmade crochet creations, built with React (frontend) and Node.js/Express/Prisma (backend).

## Project Structure

```
cozy-crochet-studio/
├── frontend/          # React + Vite frontend application
│   ├── src/          # Source code
│   ├── public/       # Static assets
│   ├── package.json  # Frontend dependencies
│   └── vite.config.js
│
├── backend/          # Node.js + Express + Prisma backend API
│   ├── src/          # Server source code
│   ├── prisma/       # Database schema and migrations
│   ├── package.json  # Backend dependencies
│   └── .env          # Environment variables (create from .env.example)
│
└── README.md         # This file
```

## Getting Started

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

   Frontend will run on `http://localhost:5173`

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and update:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `JWT_SECRET` - A random secret string for JWT tokens
   - `PORT` - Server port (default: 5000)
   - `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:5173)

4. Set up the database:
   ```bash
   # Generate Prisma Client
   npm run prisma:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed initial data
   npm run prisma:seed
   ```

5. Start the server:
   ```bash
   npm run dev
   ```

   Backend will run on `http://localhost:5000`

## Features

- 🔐 User authentication (JWT)
- 📦 Product catalog with categories
- 🛒 Shopping cart
- 📍 Address management
- 🎫 Coupon system
- 📦 Order management
- 🗄️ PostgreSQL database with Prisma ORM

## Tech Stack

### Frontend
- React 18
- Vite
- React Router
- Tailwind CSS
- Radix UI components
- React Hook Form
- Zod validation

### Backend
- Node.js
- Express
- Prisma ORM
- PostgreSQL
- JWT authentication
- bcryptjs for password hashing

## Development

- Frontend dev server: `cd frontend && npm run dev`
- Backend dev server: `cd backend && npm run dev`
- View database: `cd backend && npm run prisma:studio`

## Deployment

Both frontend and backend can be deployed separately:
- Frontend: Deploy to Vercel, Netlify, or any static hosting
- Backend: Deploy to Railway, Render, Heroku, or any Node.js hosting

Make sure to set production environment variables in your hosting platform.
