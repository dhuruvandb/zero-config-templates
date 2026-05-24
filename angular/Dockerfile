# =============================================================================
# Stage 1: Build the Angular application (with SSR)
# =============================================================================
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# =============================================================================
# Stage 2: Production runtime (single layer: install deps + strip dev leftovers)
# =============================================================================
FROM node:22-alpine AS runner
WORKDIR /app

# Copy production artifacts
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./

# Single RUN: install only production deps
RUN npm ci --omit=dev && \
    rm -rf /app/node_modules/typescript \
           /root/.npm /tmp/*

EXPOSE 4000
CMD ["node", "dist/angular/server/server.mjs"]