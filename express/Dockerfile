# =============================================================================
# Stage 1: Build the Express backend
# =============================================================================
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# =============================================================================
# Stage 2: Production runtime
# =============================================================================
FROM node:22-alpine AS runner
WORKDIR /app

# Copy compiled output and dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma

# Generate Prisma client (architecture-specific)
RUN npx prisma generate

EXPOSE 5000
CMD ["node", "dist/index.js"]