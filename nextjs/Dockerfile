# =============================================================================
# Stage 1: Build the Next.js application
# =============================================================================
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# =============================================================================
# Stage 2: Run with Next.js standalone server
# =============================================================================
FROM node:22-alpine AS runner
WORKDIR /app

# Next.js standalone output bundles everything into .next/standalone/
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
CMD ["node", "server.js"]