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
# Stage 2: Run the Angular SSR server
# =============================================================================
FROM node:22-alpine AS runner
WORKDIR /app

# Copy production artifacts
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 4000
CMD ["node", "dist/angular/server/server.mjs"]