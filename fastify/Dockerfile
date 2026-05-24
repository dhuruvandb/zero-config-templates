# =============================================================================
# Stage 1: Build the Fastify backend
# =============================================================================
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# =============================================================================
# Stage 2: Production runtime (single layer: install deps + generate)
# =============================================================================
FROM node:22-alpine AS runner
WORKDIR /app

# Copy compiled output and Prisma schema
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/prisma ./prisma

# Single RUN: install prod deps, generate Prisma client
RUN npm ci --omit=dev && \
    npx prisma generate && \
    rm -rf /app/node_modules/prisma \
           /app/node_modules/effect \
           /app/node_modules/fast-check \
           /app/node_modules/@prisma/config \
           /root/.npm /tmp/*

EXPOSE 5000
CMD ["node", "dist/index.js"]