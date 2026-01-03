# Database Alternatives for NestJS Template

This directory contains alternative database configurations for the NestJS starter template. Choose the setup that best fits your project requirements.

## Available Options

### 1. PostgreSQL + Prisma ORM (Default)
**Location:** `../prisma/`

**Best for:**
- Production applications
- Type-safe database access
- Complex queries and migrations
- Strong relational data models

**Setup:**
```bash
npm install @prisma/client prisma
npx prisma migrate dev
```

---

### 2. MongoDB + Mongoose
**Location:** `./mongodb/schemas/`

**Best for:**
- Document-based data models
- Rapid prototyping
- Flexible schemas
- High scalability

**Key Files:**
- `mongodb/schemas/user.schema.ts` - User document schema
- `mongodb/schemas/item.schema.ts` - Item document schema
- `mongodb/schemas/refresh-token.schema.ts` - Refresh token schema

**Setup:**
```bash
npm install mongoose

# Update .env with MongoDB connection:
MONGODB_URI=mongodb://localhost:27017/nestjs-app
```

**Entity Structure:**
```typescript
// User
interface User {
  _id: ObjectId;
  email: string; (unique, indexed)
  passwordHash: string;
  refreshTokens: string[];
  timestamps: { createdAt, updatedAt }
}

// Item
interface Item {
  _id: ObjectId;
  name: string;
  userId: ObjectId; (ref: User, indexed)
  timestamps: { createdAt, updatedAt }
}

// RefreshToken
interface RefreshToken {
  _id: ObjectId;
  userId: ObjectId; (ref: User)
  token: string; (unique)
  isRevoked: boolean;
  expiresAt: Date; (indexed with TTL)
  timestamps: { createdAt, updatedAt }
}
```

---

### 3. SQL Database + TypeORM
**Location:** `./typeorm/entities/`

**Best for:**
- Traditional relational databases
- Complex transactions
- ACID compliance requirements
- Enterprise applications

**Supported Databases:**
- PostgreSQL (recommended)
- MySQL/MariaDB
- SQLite (development)
- SQL Server

**Key Files:**
- `typeorm/entities/user.entity.ts` - User entity with UUID primary key
- `typeorm/entities/item.entity.ts` - Item entity with foreign key to User
- `typeorm/entities/refresh-token.entity.ts` - Refresh token entity

**Setup:**
```bash
npm install typeorm reflect-metadata pg

# Update .env with database connection:
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=nestjs_app
```

**Entity Structure:**
```typescript
// User
@Entity('users')
class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column({ unique: true })
  email: string;
  
  @Column()
  passwordHash: string;
  
  @OneToMany(() => ItemEntity, item => item.user, { cascade: true })
  items: ItemEntity[];
  
  @OneToMany(() => RefreshTokenEntity, token => token.user, { cascade: true })
  refreshTokens: RefreshTokenEntity[];
  
  @CreateDateColumn()
  createdAt: Date;
  
  @UpdateDateColumn()
  updatedAt: Date;
}

// Item
@Entity('items')
class ItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column()
  name: string;
  
  @ManyToOne(() => UserEntity, user => user.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
  
  @Column()
  userId: string;
  
  @CreateDateColumn()
  createdAt: Date;
  
  @UpdateDateColumn()
  updatedAt: Date;
}

// RefreshToken
@Entity('refresh_tokens')
class RefreshTokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column({ unique: true })
  token: string;
  
  @Column({ default: false })
  isRevoked: boolean;
  
  @Column()
  expiresAt: Date;
  
  @ManyToOne(() => UserEntity, user => user.refreshTokens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
  
  @Column()
  userId: string;
  
  @CreateDateColumn()
  createdAt: Date;
  
  @UpdateDateColumn()
  updatedAt: Date;
}
```

---

## Comparison Table

| Feature | Prisma | Mongoose | TypeORM |
|---------|--------|----------|----------|
| Type Safety | ✅ Excellent | ⚠️ Partial | ✅ Excellent |
| Schema Flexibility | ⚠️ Strict | ✅ Very Flexible | ⚠️ Strict |
| Database Support | PostgreSQL, MySQL, SQLite | MongoDB Only | PostgreSQL, MySQL, SQLite, MSSQL |
| Learning Curve | ✅ Easy | ⚠️ Medium | ⚠️ Medium |
| Performance | ✅ Fast | ✅ Fast | ✅ Fast |
| Migration Tools | ✅ Built-in | ❌ Manual | ⚠️ Requires Setup |
| Transaction Support | ✅ Full | ⚠️ Partial | ✅ Full |
| Community | ✅ Large | ✅ Very Large | ✅ Large |

---

## Migration Guide

### From Prisma to Mongoose
1. Install Mongoose: `npm install mongoose`
2. Replace Prisma imports with Mongoose schemas from `./mongodb/schemas/`
3. Update service methods to use Mongoose methods (.save(), .findById(), etc.)
4. Update connection string in .env to MongoDB URI

### From Prisma to TypeORM
1. Install TypeORM: `npm install typeorm reflect-metadata`
2. Replace Prisma imports with TypeORM entities from `./typeorm/entities/`
3. Update service methods to use TypeORM repositories
4. Update database connection configuration
5. Create migrations with TypeORM CLI

---

## Environment Variables

### MongoDB (.env)
```
MONGODB_URI=mongodb://localhost:27017/nestjs-db
MONGO_DB_NAME=nestjs-db
```

### TypeORM (.env)
```
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=nestjs_app
DB_SYNCHRONIZE=false
```

---

## Auth Flow Compatibility

All three database options support the same JWT authentication flow:
- Access tokens (short-lived, in memory)
- Refresh tokens (long-lived, stored in database)
- Token rotation on refresh
- Token revocation

See main README.md for complete authentication documentation.

---

## Contributing

When adding new features, remember to update all three database implementations to maintain consistency across the template options.
