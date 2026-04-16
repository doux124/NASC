# syntax=docker/dockerfile:1.7

# ─ Stage 1: Build the Vite bundle ────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install deps separately to leverage Docker layer caching
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund || npm install --no-audit --no-fund

# Copy source and build
COPY . .
RUN npm run build


# ─ Stage 2: Serve the static bundle via Nginx ────────────────
FROM nginx:1.27-alpine AS runner

# Remove default nginx welcome page and install curl for healthcheck
RUN rm -rf /usr/share/nginx/html/* && apk add --no-cache curl

# Copy custom nginx config (SPA-aware, gzip, long-cache for assets)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
