# Zero-Config Templates

Production-ready starter templates for modern full-stack web applications with **TypeScript** and **JWT-based authentication** pre-configured.

## 🎯 Overview

This repository is a collection of zero-configuration boilerplate templates covering multiple popular frontend and backend stacks. Each template comes with enterprise-grade authentication, database integration, and best practices baked in - so you can start building features immediately.

## 📦 Available Templates

### Frontend Templates

| Framework | Version | Features | Port |
|-----------|---------|----------|------|
| **React** | Vite + TypeScript | Auth context, Protected routes, Token refresh | 5173 |
| **Angular** | v21 + SSR | Auth guards, Signals, Tailwind CSS 4 | 4200 |
| **Next.js** | App Router | SQLite auth, Server Actions, Full CRUD | 3000 |

### Backend Templates

| Framework | Database | ORM | Features | Port |
|-----------|----------|-----|----------|------|
| **Express** | MongoDB | Mongoose | In-memory fallback, Auto-migration | 5000 |
| **NestJS** | PostgreSQL | Prisma | Modular architecture, Strict TypeScript | 5000 |

## 🚀 Quick Start Combinations

### Option 1: MERN Stack (React + Express)
**Best for:** Rapid prototyping, JavaScript-focused teams
```bash
# Terminal 1 - Backend
cd express
npm install
cp .env.example .env
# Edit .env with your MongoDB URI (optional - uses in-memory DB if not provided)
npm run dev

# Terminal 2 - Frontend
cd react
npm install
npm run dev
```
**Access:** http://localhost:5173

---

### Option 2: Enterprise Stack (Angular + NestJS)
**Best for:** Large-scale applications, strict type safety
```bash
# Terminal 1 - Backend
cd nestjs
npm install
cp .env.example .env
# Edit .env with PostgreSQL URI and JWT secrets
npx prisma generate
npx prisma migrate dev --name init
npm run start:dev

# Terminal 2 - Frontend
cd angular
npm install
npm start
```
**Access:** http://localhost:4200

---

### Option 3: Full-Stack Next.js
**Best for:** Serverless deployments, single deployment unit
```bash
cd nextjs
npm install
npm run dev
```
**Access:** http://localhost:3000

---

## ✨ Features

### 🔐 Security-First Authentication
- ✅ **JWT Access Tokens** (15 min expiry)
- ✅ **HTTP-only Refresh Tokens** (7 day expiry)
- ✅ **Token Rotation** on refresh
- ✅ **Strong Password Requirements**:
  - Minimum 8 characters
  - At least 1 uppercase letter
  - At least 1 lowercase letter
  - At least 1 number
  - At least 1 special character
- ✅ **bcrypt Password Hashing** (10 rounds)

### 🛠️ Developer Experience
- ✅ **100% TypeScript** - Full type safety
- ✅ **Zero Configuration** - Works out of the box
- ✅ **Environment Variables** - Easy configuration
- ✅ **CORS Configured** - Frontend-backend communication ready
- ✅ **Hot Module Replacement** - Fast development

### 📚 Database Flexibility
- **MongoDB** (Express) - Document database with in-memory fallback
- **PostgreSQL** (NestJS) - Relational database with Prisma ORM
- **SQLite** (Next.js) - Embedded database for full-stack apps

---

## 📖 Detailed Setup Guides

### Prerequisites
- **Node.js** v18+ (v20 recommended)
- **npm** or **yarn**
- **Database** (based on chosen stack):
  - MongoDB URI for Express (optional - uses in-memory if not provided)
  - PostgreSQL for NestJS
  - SQLite auto-created for Next.js

---

### Express Backend Setup

```bash
cd express
npm install
```

**Environment Configuration:**
```bash
cp .env.example .env
```

Edit `.env`:
```env
MONGO_URI=mongodb://localhost:27017/myapp  # Optional
PORT=5000
ACCESS_TOKEN_SECRET=your_random_secret_here
REFRESH_TOKEN_SECRET=another_random_secret_here
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
FRONTEND_URL=http://localhost:5173
```

**Generate Secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Run:**
```bash
npm run dev
```

**Features:**
- Smart MongoDB fallback to in-memory server
- Automatic migration from in-memory to real DB when available
- Cookie-based refresh tokens

---

### NestJS Backend Setup

```bash
cd nestjs
npm install
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/mydb?schema=public"
ACCESS_TOKEN_SECRET=your_strong_random_secret
REFRESH_TOKEN_SECRET=another_strong_random_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
FRONTEND_URL=http://localhost:4200
PORT=5000
NODE_ENV=development
```

**Database Setup:**
```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma studio  # Optional: View your data
```

**Run:**
```bash
npm run start:dev
```

**Features:**
- Prisma ORM with type-safe queries
- Modular NestJS architecture
- Request validation with class-validator
- Swagger API docs ready

---

### React Frontend Setup

```bash
cd react
npm install
npm run dev
```

**Features:**
- React 18 with TypeScript
- Vite for blazing-fast HMR
- React Router v6 with protected routes
- Auth context for state management
- Automatic token refresh
- Tailwind CSS ready

**Connect to Backend:**
Update API URL in your environment or code to point to:
- Express: `http://localhost:5000`
- NestJS: `http://localhost:5000`

---

### Angular Frontend Setup

```bash
cd angular
npm install
npm start
```

**Features:**
- Angular 21 with standalone components
- Server-Side Rendering (SSR)
- Tailwind CSS 4.x
- Vitest for testing
- Auth guards and interceptors
- RxJS for reactive state management

---

### Next.js Full-Stack Setup

```bash
cd nextjs
npm install
npm run dev
```

**Features:**
- Next.js 15 with App Router
- SQLite database (auto-created)
- Server Actions for mutations
- API Routes for authentication
- Full CRUD with inline editing
- Optimistic UI updates

---

## 🔌 API Endpoints

### Authentication Routes (All Backends)

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGc..."
}
```
*Sets `jid` HTTP-only cookie with refresh token*

---

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGc..."
}
```

---

#### Refresh Token
```http
POST /api/auth/refresh
Cookie: jid=<refresh_token>
```

**Response:**
```json
{
  "accessToken": "eyJhbGc..."
}
```
*New refresh token set in cookie*

---

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "message": "Logged out"
}
```

---

### Protected Routes Example

#### Get Items
```http
GET /api/items
Authorization: Bearer <access_token>
```

#### Create Item
```http
POST /api/items
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "New Item"
}
```

#### Delete Item
```http
DELETE /api/items/:id
Authorization: Bearer <access_token>
```

---

## 🏗️ Project Structure

### Express Backend
```
express/
├── src/
│   ├── config/
│   │   └── db.ts              # MongoDB connection with fallback
│   ├── middleware/
│   │   └── auth.ts            # JWT verification middleware
│   ├── models/
│   │   ├── user.ts            # User schema
│   │   └── item.ts            # Item schema
│   ├── routes/
│   │   ├── authRoutes.ts      # Auth endpoints
│   │   └── itemRoutes.ts      # CRUD endpoints
│   └── index.ts               # App entry point
├── .env.example
├── package.json
└── tsconfig.json
```

### NestJS Backend
```
nestjs/
├── src/
│   ├── auth/                  # Authentication module
│   │   ├── decorators/
│   │   ├── dto/
│   │   ├── guards/
│   │   ├── strategies/
│   │   ├── auth.controller.ts
│   │   └── auth.service.ts
│   ├── items/                 # Items CRUD module
│   ├── users/                 # Users module
│   ├── prisma/                # Prisma ORM module
│   ├── app.module.ts
│   └── main.ts
├── prisma/
│   └── schema.prisma          # Database schema
├── .env.example
└── package.json
```

### React Frontend
```
react/
├── src/
│   ├── components/
│   ├── contexts/
│   │   └── AuthContext.tsx    # Auth state management
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── Dashboard.tsx
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── vite.config.ts
```

### Angular Frontend
```
angular/
├── src/
│   ├── app/
│   │   ├── auth/              # Auth module
│   │   ├── guards/            # Route guards
│   │   ├── interceptors/      # HTTP interceptors
│   │   └── services/          # API services
│   └── main.ts
├── angular.json
└── package.json
```

### Next.js Full-Stack
```
nextjs/
├── app/
│   ├── api/
│   │   ├── auth/              # Auth API routes
│   │   └── items/             # Items API routes
│   ├── login/
│   ├── register/
│   ├── dashboard/
│   └── layout.tsx
├── .data/
│   └── database.db            # SQLite (auto-created)
└── package.json
```

---

## 🎓 Use Cases

This template collection is perfect for:

- ✅ **Hackathons** - Skip auth setup, focus on features
- ✅ **MVPs & Prototypes** - Production-ready patterns from day one
- ✅ **Learning Projects** - Study different stack architectures
- ✅ **Interview Assignments** - Professional boilerplate
- ✅ **Freelance Projects** - Quick project kickstart
- ✅ **Teaching** - Demonstrate full-stack concepts

---

## 🤝 Stack Comparison

| Aspect | React + Express | Angular + NestJS | Next.js |
|--------|----------------|------------------|---------|
| **Type Safety** | Good | Excellent | Excellent |
| **Learning Curve** | Low | High | Medium |
| **Scalability** | Medium | High | High |
| **Deployment** | Separate | Separate | Unified |
| **Best For** | Startups, MVPs | Enterprise | Serverless |
| **Database** | MongoDB | PostgreSQL | SQLite |
| **Bundle Size** | Small | Large | Medium |

---

## 🔧 Environment Variables Reference

### Express
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MONGO_URI` | No | In-memory | MongoDB connection string |
| `PORT` | No | 5000 | Server port |
| `ACCESS_TOKEN_SECRET` | Yes | - | JWT access token secret |
| `REFRESH_TOKEN_SECRET` | Yes | - | JWT refresh token secret |
| `ACCESS_TOKEN_EXPIRY` | No | 15m | Access token expiration |
| `REFRESH_TOKEN_EXPIRY` | No | 7d | Refresh token expiration |
| `FRONTEND_URL` | No | localhost:5173 | CORS origin |

### NestJS
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | - | PostgreSQL connection string |
| `PORT` | No | 5000 | Server port |
| `NODE_ENV` | No | development | Environment |
| `ACCESS_TOKEN_SECRET` | Yes | - | JWT access token secret |
| `REFRESH_TOKEN_SECRET` | Yes | - | JWT refresh token secret |
| `ACCESS_TOKEN_EXPIRY` | No | 15m | Access token expiration |
| `REFRESH_TOKEN_EXPIRY` | No | 7d | Refresh token expiration |
| `FRONTEND_URL` | No | localhost:4200 | CORS origin |

---

## 📝 License

This is a template repository - use it freely for your projects!

## 🌟 Contributing

This is a personal template collection, but suggestions are welcome! Open an issue to discuss improvements.

## 📞 Support

For questions or issues:
- Check the individual README files in each template folder
- Review the `.env.example` files for configuration
- Open an issue on GitHub

---

**Happy Building! 🚀**
