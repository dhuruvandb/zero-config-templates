# Zero-Config Templates

Production-ready starter templates for modern full-stack web applications with **TypeScript** and **JWT-based authentication** pre-configured.

## 🎯 Overview

This repository is a collection of zero-configuration boilerplate templates covering multiple popular frontend and backend stacks. Each template comes with enterprise-grade authentication, database integration, and best practices baked in - so you can start building features immediately.

## 📦 Available Templates

### Frontend Templates

| Framework | Version | Features | Port |
|-----------|---------|----------|------|
| **React** | v19 + Vite | Auth context, Protected routes, Token refresh | 5173 |
| **Angular** | v21 + SSR | Auth guards, Signals, Tailwind CSS 4 | 4200 |
| **Vue.js** | v3 + Vite | Pinia store, Composition API, Oxlint | 5173 |
| **Next.js** | v15 App Router | SQLite auth, Server Actions, Full CRUD | 3000 |

### Backend Templates

| Framework | Database | ORM | Features | Port |
|-----------|----------|-----|----------|------|
| **Express** | MongoDB | Mongoose | In-memory fallback, Auto-migration | 5000 |
| **NestJS** | PostgreSQL | Prisma | Modular architecture, Passport.js | 5000 |
| **Spring Boot** | MySQL | JPA | Spring Security, Enterprise-grade | 8080 |

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

### Option 4: Vue Stack (Vue.js + Express)
**Best for:** Modern progressive framework with reactive state management
```bash
# Terminal 1 - Backend
cd express
npm install
cp .env.example .env
# Edit .env with your MongoDB URI (optional - uses in-memory DB if not provided)
npm run dev

# Terminal 2 - Frontend
cd vuejs
npm install
npm run dev
```
**Access:** http://localhost:5173

---

### Option 5: Java Enterprise Stack (Spring Boot + Any Frontend)
**Best for:** Enterprise applications, Java ecosystem integration
```bash
# Terminal 1 - Backend
cd springboot
./mvnw spring-boot:run
# Make sure MySQL is running and configured

# Terminal 2 - Frontend (choose one)
cd react  # or angular, or vuejs
npm install
npm run dev
```
**Access:** Backend: http://localhost:8080

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
- **MySQL** (Spring Boot) - Popular relational database with JPA integration

---

## 📖 Detailed Setup Guides

### Prerequisites
- **Node.js** v18+ (v20 recommended for JavaScript stacks)
- **Java 17+** (for Spring Boot)
- **Maven** (for Spring Boot, included via wrapper)
- **npm** or **yarn**
- **Database** (based on chosen stack):
  - MongoDB URI for Express (optional - uses in-memory if not provided)
  - PostgreSQL for NestJS
  - SQLite auto-created for Next.js
  - MySQL for Spring Boot

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
- Signal-based reactive state management
- RxJS for async operations

---

### Vue.js Frontend Setup

```bash
cd vuejs
npm install
npm run dev
```

**Features:**
- Vue 3 with Composition API
- Pinia for state management
- Vite for blazing-fast HMR
- Vue Router with navigation guards
- TypeScript support
- Oxlint (Rust-based) for fast linting
- Tailwind CSS ready
- Vue DevTools integration

**Connect to Backend:**
Update API URL in your environment or code to point to:
- Express: `http://localhost:5000`
- NestJS: `http://localhost:5000`
- Spring Boot: `http://localhost:8080`

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
- Tailwind CSS 4
- Zero external database dependencies

---

### Spring Boot Backend Setup

```bash
cd springboot
```

**Environment Configuration:**
Create `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/myapp
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

jwt.access.secret=your_access_token_secret
jwt.refresh.secret=your_refresh_token_secret
jwt.access.expiration=900000
jwt.refresh.expiration=604800000

cors.allowed.origins=http://localhost:5173,http://localhost:4200
```

**Database Setup:**
1. Install MySQL Server
2. Create database:
```sql
CREATE DATABASE myapp;
```

**Run:**
```bash
./mvnw spring-boot:run
```

**Features:**
- Spring Boot 4.0.2 with Spring Security
- JWT authentication with stateless sessions
- Spring Data JPA with MySQL
- Jakarta Bean Validation
- Custom JWT filter in security chain
- CORS pre-configured
- BCrypt password encoding
- Refresh token rotation
- Hot reload with DevTools

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
│   │   ├── Items.tsx          # CRUD component
│   │   └── ProtectedRoute.tsx # Auth wrapper
│   ├── contexts/
│   │   └── AuthContext.tsx    # Auth state management
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── Dashboard.tsx
│   ├── services/
│   │   └── api.ts             # Backend communication
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
│   │   ├── services/          # API services
│   │   └── components/        # UI components
│   └── main.ts
├── angular.json
└── package.json
```

### Vue.js Frontend
```
vuejs/
├── src/
│   ├── components/
│   │   └── Items.vue          # CRUD component
│   ├── stores/
│   │   └── auth.ts            # Pinia auth store
│   ├── views/
│   │   ├── LoginView.vue
│   │   ├── RegisterView.vue
│   │   └── DashboardView.vue
│   ├── router/
│   │   └── index.ts           # Vue Router config
│   ├── services/
│   │   └── api.ts             # API integration
│   ├── App.vue
│   └── main.ts
├── package.json
└── vite.config.ts
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

### Spring Boot Backend
```
springboot/
├── src/
│   └── main/
│       ├── java/
│       │   └── com/example/springboot/
│       │       ├── config/
│       │       │   └── SecurityConfig.java     # Security configuration
│       │       ├── controller/
│       │       │   └── AuthController.java     # REST endpoints
│       │       ├── entity/
│       │       │   └── User.java               # JPA entity
│       │       ├── filter/
│       │       │   └── JwtAuthenticationFilter.java
│       │       ├── repository/
│       │       │   └── UserRepository.java     # JPA repository
│       │       ├── service/
│       │       │   ├── AuthService.java
│       │       │   └── JwtService.java         # Token management
│       │       └── SpringbootApplication.java
│       └── resources/
│           └── application.properties          # Configuration
├── pom.xml                                     # Maven dependencies
└── mvnw                                        # Maven wrapper
```

---

## 🎓 Use Cases

This template collection is perfect for:

- ✅ **Hackathons** - Skip auth setup, focus on features
- ✅ **MVPs & Prototypes** - Production-ready patterns from day one
- ✅ **Learning Projects** - Study different stack architectures side-by-side
- ✅ **Interview Assignments** - Professional boilerplate with best practices
- ✅ **Freelance Projects** - Quick project kickstart with client-ready code
- ✅ **Teaching** - Demonstrate full-stack concepts across multiple frameworks
- ✅ **Portfolio Projects** - Showcase knowledge of modern web development
- ✅ **Code Migration** - Compare implementations across different tech stacks

---

## 🤝 Stack Comparison

| Aspect | React + Express | Angular + NestJS | Vue + Express | Next.js | Spring Boot + ? |
|--------|----------------|------------------|---------------|---------|-----------------|
| **Type Safety** | Good | Excellent | Good | Excellent | Excellent |
| **Learning Curve** | Low | High | Low-Medium | Medium | High |
| **Scalability** | Medium | High | Medium | High | Very High |
| **Deployment** | Separate | Separate | Separate | Unified | Separate |
| **Best For** | Startups, MVPs | Enterprise | Modern SPAs | Serverless | Enterprise Java |
| **Database** | MongoDB | PostgreSQL | MongoDB | SQLite | MySQL |
| **Bundle Size** | Small | Large | Small | Medium | N/A (JVM) |
| **Setup Time** | ~5 min | ~10 min | ~5 min | ~2 min | ~15 min |
| **Backend Port** | 5000 | 5000 | 5000 | 3000 | 8080 |
| **Frontend Port** | 5173 | 4200 | 5173 | 3000 | N/A |

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

### Spring Boot
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `spring.datasource.url` | Yes | - | MySQL JDBC connection string |
| `spring.datasource.username` | Yes | - | Database username |
| `spring.datasource.password` | Yes | - | Database password |
| `jwt.access.secret` | Yes | - | JWT access token secret (base64) |
| `jwt.refresh.secret` | Yes | - | JWT refresh token secret (base64) |
| `jwt.access.expiration` | No | 900000 | Access token expiration (ms) |
| `jwt.refresh.expiration` | No | 604800000 | Refresh token expiration (ms) |
| `cors.allowed.origins` | No | localhost:5173 | CORS origins (comma-separated) |
| `spring.jpa.hibernate.ddl-auto` | No | update | Database auto-update mode |

---

## 📝 License

MIT License - Use freely for your projects!

## 🛠️ Tech Stack Details

### Frontend Technologies

#### React Template
- **React 19** - Latest React with improved concurrent features
- **Vite 7.2** - Next-generation build tool with instant HMR
- **React Router v6** - Declarative routing with data loading
- **TypeScript 5.9** - Full type safety across components
- **Context API** - Built-in state management for auth
- **Tailwind CSS** - Utility-first CSS framework

#### Angular Template
- **Angular 21** - Latest with standalone components
- **Angular SSR** - Server-Side Rendering for better SEO
- **Signals** - Fine-grained reactivity (Angular's new reactive primitive)
- **Tailwind CSS 4.1** - Latest version with new features
- **Vitest** - Blazing fast unit test framework
- **RxJS** - Powerful reactive programming library

#### Vue.js Template
- **Vue 3.5** - Latest with Composition API
- **Pinia 3.0** - Official state management (Vuex successor)
- **Vue Router 4.6** - Official routing library
- **Vite 7.3** - Ultra-fast development server
- **Oxlint** - Rust-based linter (50-100x faster than ESLint)
- **Vue DevTools** - Official debugging plugin

### Backend Technologies

#### Express Template
- **Express 4.18** - Minimal and flexible Node.js framework
- **Mongoose 7** - Elegant MongoDB object modeling
- **mongodb-memory-server** - In-memory MongoDB for development
- **jsonwebtoken** - JWT implementation
- **bcrypt** - Industry-standard password hashing
- **express-validator** - Middleware for request validation

#### NestJS Template
- **NestJS 11** - Progressive Node.js framework
- **Prisma 6.2** - Next-generation ORM with type safety
- **Passport.js** - Authentication middleware (JWT + Local strategies)
- **class-validator** - Decorator-based validation
- **class-transformer** - Transform plain objects to class instances
- **Jest** - Delightful JavaScript testing framework

#### Spring Boot Template
- **Spring Boot 4.0** - Latest Spring Boot version
- **Spring Security** - Comprehensive security framework
- **Spring Data JPA** - Data access layer abstraction
- **JJWT 0.12** - Java JWT library
- **MySQL Connector** - Official MySQL driver
- **Jakarta Validation** - Bean validation API
- **Hibernate** - ORM implementation (via JPA)

### Database Technologies

| Database | Template | Type | Key Features |
|----------|----------|------|--------------|
| **MongoDB** | Express | NoSQL Document | Schema-less, JSON-like documents, horizontal scaling |
| **PostgreSQL** | NestJS | SQL Relational | ACID compliance, advanced features, excellent performance |
| **SQLite** | Next.js | SQL Embedded | Zero-config, serverless, single-file database |
| **MySQL** | Spring Boot | SQL Relational | Popular, reliable, great for enterprise apps |

---

## 🔐 Security Features Deep Dive

### Token Management
- **Access Token**: Short-lived (15 min) JWT for API authentication
- **Refresh Token**: Long-lived (7 days) token stored in HTTP-only cookie
- **Token Rotation**: New token pair generated on each refresh
- **Revocation List**: Refresh tokens tracked per user for instant invalidation

### Password Security
- **Hashing Algorithm**: bcrypt with 10 rounds (industry standard)
- **Password Requirements**:
  - Minimum 8 characters
  - At least 1 uppercase letter (A-Z)
  - At least 1 lowercase letter (a-z)
  - At least 1 number (0-9)
  - At least 1 special character (!@#$%^&*)

### CORS Configuration
- Pre-configured for local development
- Whitelisted origins for frontend URLs
- Credentials support enabled for cookies
- Easily customizable for production deployment

### HTTP-Only Cookies
- **Protection**: XSS-resistant (JavaScript cannot access)
- **Cookie Name**: `jid` (JWT ID)
- **SameSite**: Strict/Lax (CSRF protection)
- **Secure**: Set to true in production (HTTPS only)

---

## 📊 Framework Recommendations

### Choose React + Express When:
- ✅ You want the fastest time to market
- ✅ Team is comfortable with JavaScript/TypeScript
- ✅ Project requires rapid prototyping
- ✅ You prefer minimal boilerplate
- ✅ Document database fits your data model

### Choose Angular + NestJS When:
- ✅ Building large-scale enterprise applications
- ✅ Strict type safety is critical
- ✅ Team has Java/C# background (similar patterns)
- ✅ Need modular, testable architecture
- ✅ Relational database with complex queries
- ✅ SEO is important (SSR built-in)

### Choose Vue + Express When:
- ✅ You prefer progressive framework adoption
- ✅ Want gentle learning curve
- ✅ Team values developer experience
- ✅ Need reactive state management
- ✅ Modern frontend with document database

### Choose Next.js When:
- ✅ Building full-stack app with single deployment
- ✅ Serverless deployment (Vercel, Netlify)
- ✅ SEO and performance are critical
- ✅ Don't want to manage separate backend
- ✅ Embedded database is sufficient
- ✅ Want unified TypeScript codebase

### Choose Spring Boot When:
- ✅ Team is Java-focused
- ✅ Enterprise environment with Java ecosystem
- ✅ Need maximum scalability and performance
- ✅ Integration with existing Java systems
- ✅ Prefer strongly-typed, compiled backend
- ✅ MySQL is your standard database

---

## 🚀 Deployment Tips

### Frontend Deployment
- **React/Vue/Angular**: Deploy to Vercel, Netlify, or AWS Amplify
- **Next.js**: Vercel (optimized), or Docker container
- **Environment Variables**: Set `VITE_API_URL` or equivalent for backend URL

### Backend Deployment
- **Express/NestJS**: Deploy to Railway, Render, Heroku, or AWS
- **Spring Boot**: Deploy to AWS Elastic Beanstalk, Heroku, or as JAR
- **Database**: Use managed services (MongoDB Atlas, AWS RDS, PlanetScale)
- **Environment Variables**: Ensure all secrets are set in production

### Production Checklist
- [ ] Set `NODE_ENV=production` (Node.js apps)
- [ ] Use strong, randomly generated JWT secrets
- [ ] Enable HTTPS for secure cookies
- [ ] Update CORS origins to production URLs
- [ ] Set appropriate token expiration times
- [ ] Enable database connection pooling
- [ ] Configure proper logging
- [ ] Set up monitoring and error tracking
- [ ] Use environment-specific configurations
- [ ] Test authentication flow end-to-end

---

## 📝 License

MIT License - Use freely for your projects!

## 🌟 Contributing

This is a personal template collection, but suggestions are welcome! Open an issue to discuss improvements.

## 💡 Common Workflows

### Testing Authentication Flow

1. **Register a new user**:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePass123!"}'
```

2. **Login**:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePass123!"}' \
  -c cookies.txt
```

3. **Access Protected Route**:
```bash
curl -X GET http://localhost:5000/api/items \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

4. **Refresh Token**:
```bash
curl -X POST http://localhost:5000/api/auth/refresh \
  -b cookies.txt \
  -c cookies.txt
```

### Adding New Protected Routes

#### Express Example:
```typescript
// In your routes file
router.get('/api/my-route', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  // Your logic here
});
```

#### NestJS Example:
```typescript
@Controller('my-route')
export class MyController {
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@GetUser() user: User) {
    // user is automatically injected
  }
}
```

#### Spring Boot Example:
```java
@GetMapping("/api/my-route")
public ResponseEntity<?> myRoute(@AuthenticationPrincipal String userId) {
    // userId is automatically extracted from JWT
}
```

### Customizing Token Expiration

Edit `.env` file (Node.js) or `application.properties` (Spring Boot):
```env
# Short-lived for high security
ACCESS_TOKEN_EXPIRY=5m
REFRESH_TOKEN_EXPIRY=1d

# Long-lived for better UX
ACCESS_TOKEN_EXPIRY=1h
REFRESH_TOKEN_EXPIRY=30d
```

---

## 🔧 Troubleshooting

### "CORS Error" when calling backend from frontend
**Solution**: Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL exactly
```env
# Express/NestJS
FRONTEND_URL=http://localhost:5173

# Spring Boot
cors.allowed.origins=http://localhost:5173
```

### "MongoDB connection failed" (Express)
**Solution**: The template automatically falls back to in-memory database. Check:
1. Is MongoDB running? `sudo systemctl status mongod`
2. Is `MONGO_URI` correct in `.env`?
3. Can you connect via `mongosh`?

**To use in-memory mode**: Simply don't set `MONGO_URI` or leave it empty

### "Database migration failed" (NestJS)
**Solution**:
```bash
# Reset and regenerate
npx prisma migrate reset
npx prisma generate
npx prisma migrate dev --name init
```

### "JWT secret not configured"
**Solution**: Generate and set secrets in `.env`:
```bash
# Generate a secure secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Add to .env
ACCESS_TOKEN_SECRET=<generated-secret-1>
REFRESH_TOKEN_SECRET=<generated-secret-2>
```

### "Port already in use"
**Solution**: Kill existing process or change port
```bash
# Find process using port 5000
lsof -ti:5000

# Kill it
kill -9 $(lsof -ti:5000)

# Or change port in .env
PORT=5001
```

### "Module not found" errors
**Solution**: Reinstall dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

### Spring Boot - "MySQL connection refused"
**Solution**:
1. Ensure MySQL is running: `sudo systemctl status mysql`
2. Database exists: `mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS myapp;"`
3. Credentials are correct in `application.properties`

### Frontend - "Token expired" errors
**Solution**: Token might have expired. The frontend should automatically refresh. If not:
1. Check browser console for refresh errors
2. Ensure refresh endpoint is working
3. Clear localStorage/cookies and login again

---

## 📚 Further Learning

### Documentation Links
- **React**: https://react.dev
- **Angular**: https://angular.dev
- **Vue.js**: https://vuejs.org
- **Next.js**: https://nextjs.org
- **Express**: https://expressjs.com
- **NestJS**: https://nestjs.com
- **Spring Boot**: https://spring.io/projects/spring-boot
- **Prisma**: https://prisma.io
- **Mongoose**: https://mongoosejs.com

### Best Practices Resources
- **JWT**: https://jwt.io/introduction
- **OWASP Security**: https://owasp.org/www-project-top-ten/
- **TypeScript**: https://www.typescriptlang.org/docs/
- **REST API Design**: https://restfulapi.net/

---

## 🌟 Contributing

This is a personal template collection, but suggestions are welcome! Open an issue to discuss improvements.

## 📞 Support

For questions or issues:
- Check the individual README files in each template folder
- Review the `.env.example` files for configuration
- Open an issue on GitHub

---

**Happy Building! 🚀**
