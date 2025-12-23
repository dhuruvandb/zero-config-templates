# NestJS Starter with PostgreSQL, Prisma & JWT Authentication

A production-ready NestJS starter template with TypeScript strict mode, PostgreSQL, Prisma ORM, and complete JWT authentication including access/refresh token rotation.

## Features

✅ **NestJS 11** - Latest version with full TypeScript support  
✅ **PostgreSQL** - Robust relational database  
✅ **Prisma ORM** - Type-safe database access  
✅ **JWT Authentication** - Access tokens + HTTP-only refresh tokens  
✅ **Token Rotation** - Secure refresh token rotation on refresh  
✅ **Strict TypeScript** - Maximum type safety, no `any` types  
✅ **Validation** - Request validation with class-validator  
✅ **Password Security** - Bcrypt hashing with strong password requirements  
✅ **CORS** - Configured for frontend integration  
✅ **Cookie-based Refresh Tokens** - HTTP-only cookies for security

---

## Prerequisites

- **Node.js** >= 18.x
- **PostgreSQL** >= 14.x
- **npm** or **yarn**

---

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file and configure your database:

```bash
cp .env.example .env
```

Edit `.env` and update the following:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/your_database?schema=public"
ACCESS_TOKEN_SECRET=your_strong_random_secret_here
REFRESH_TOKEN_SECRET=another_strong_random_secret_here
```

**Generate secure secrets:**

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Set Up the Database

Initialize Prisma and run migrations:

```bash
# Generate Prisma Client
npx prisma generate

# Create and apply migrations
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view your data
npx prisma studio
```

### 4. Run the Application

**Development mode:**

```bash
npm run start:dev
```

**Production mode:**

```bash
npm run build
npm run start:prod
```

The server will start on `http://localhost:5000`

---

## Project Structure

```
src/
├── auth/                      # Authentication module
│   ├── decorators/           # Custom decorators (GetUser)
│   ├── dto/                  # Data Transfer Objects
│   ├── guards/               # Auth guards (JWT)
│   ├── strategies/           # Passport strategies
│   ├── auth.controller.ts    # Auth endpoints
│   ├── auth.service.ts       # Auth business logic
│   └── auth.module.ts        # Auth module definition
├── items/                    # Items CRUD module
│   ├── dto/                  # Item DTOs
│   ├── items.controller.ts   # Item endpoints
│   ├── items.service.ts      # Item business logic
│   └── items.module.ts       # Item module definition
├── prisma/                   # Prisma integration
│   ├── prisma.service.ts     # Prisma client service
│   └── prisma.module.ts      # Global Prisma module
├── users/                    # Users module
│   ├── users.service.ts      # User management
│   └── users.module.ts       # User module definition
├── app.module.ts             # Root application module
└── main.ts                   # Application entry point
```

---

## API Endpoints

### Authentication

#### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Password Requirements:**

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

**Response:**

```json
{
  "accessToken": "eyJhbGc..."
}
```

Sets `jid` HTTP-only cookie with refresh token.

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

New refresh token is set in cookie.

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

### Items (Protected Routes)

All item endpoints require authentication via `Authorization: Bearer <access_token>` header.

#### Get All Items

```http
GET /api/items
Authorization: Bearer <access_token>
```

**Response:**

```json
[
  {
    "id": "uuid",
    "name": "Item 1",
    "createdAt": "2025-12-23T...",
    "updatedAt": "2025-12-23T..."
  }
]
```

---

#### Create Item

```http
POST /api/items
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "New Item"
}
```

**Response:**

```json
{
  "id": "uuid",
  "name": "New Item",
  "createdAt": "2025-12-23T...",
  "updatedAt": "2025-12-23T..."
}
```

---

#### Delete Item

```http
DELETE /api/items/:id
Authorization: Bearer <access_token>
```

**Response:**

```json
{
  "message": "Deleted"
}
```

---

## Database Management

### Prisma Commands

```bash
# Generate Prisma Client after schema changes
npx prisma generate

# Create a new migration
npx prisma migrate dev --name migration_name

# Apply migrations in production
npx prisma migrate deploy

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Open Prisma Studio (database GUI)
npx prisma studio

# Format schema file
npx prisma format
```

---

## TypeScript Configuration

This project uses **strict TypeScript** settings:

- ✅ `strictNullChecks`
- ✅ `noImplicitAny`
- ✅ `strictBindCallApply`
- ✅ `forceConsistentCasingInFileNames`

No relaxation of type safety is allowed. All code must be fully typed.

---

## Security Features

1. **Password Hashing** - bcrypt with 10 rounds
2. **HTTP-only Cookies** - Refresh tokens not accessible via JavaScript
3. **Token Rotation** - Refresh tokens rotated on each refresh
4. **Token Revocation** - Old refresh tokens invalidated
5. **CORS** - Configured for specific frontend origin
6. **Input Validation** - All requests validated with DTOs
7. **Environment Variables** - Secrets stored in .env

---

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

---

## Production Deployment

### 1. Build the Application

```bash
npm run build
```

### 2. Set Environment Variables

Ensure all production environment variables are set:

```env
NODE_ENV=production
DATABASE_URL=<production_database_url>
ACCESS_TOKEN_SECRET=<strong_random_secret>
REFRESH_TOKEN_SECRET=<strong_random_secret>
FRONTEND_URL=<production_frontend_url>
PORT=5000
```

### 3. Run Migrations

```bash
npx prisma migrate deploy
```

### 4. Start the Server

```bash
npm run start:prod
```

---

## Environment Variables Reference

| Variable               | Description                  | Example                                    |
| ---------------------- | ---------------------------- | ------------------------------------------ |
| `DATABASE_URL`         | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `PORT`                 | Server port                  | `5000`                                     |
| `NODE_ENV`             | Environment                  | `development` or `production`              |
| `FRONTEND_URL`         | Frontend origin for CORS     | `http://localhost:5173`                    |
| `ACCESS_TOKEN_SECRET`  | JWT access token secret      | Random 64-byte hex string                  |
| `REFRESH_TOKEN_SECRET` | JWT refresh token secret     | Random 64-byte hex string                  |
| `ACCESS_TOKEN_EXPIRY`  | Access token expiration      | `15m`                                      |
| `REFRESH_TOKEN_EXPIRY` | Refresh token expiration     | `7d`                                       |

---

## Contributing

This is a starter template. Feel free to customize it for your needs.

---

## License

UNLICENSED - Private project template
$ npm run test

# e2e tests

$ npm run test:e2e

# test coverage

$ npm run test:cov

````

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
````

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
