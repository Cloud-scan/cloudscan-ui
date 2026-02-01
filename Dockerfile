# Multi-stage Dockerfile for CloudScan UI
# Stage 1: Build the React application
FROM node:20-alpine AS builder

WORKDIR /build

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application (Vite uses VITE_* prefix for env vars)
ARG VITE_API_URL=http://localhost:8080/api/v1
ARG VITE_WS_URL=ws://localhost:9090
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_WS_URL=${VITE_WS_URL}

RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:1.25-alpine

# Install runtime dependencies
RUN apk add --no-cache ca-certificates tzdata curl

# Create non-root user (matching other CloudScan services)
RUN addgroup -g 1000 cloudscan && \
    adduser -D -u 1000 -G cloudscan cloudscan

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built application from builder stage
COPY --from=builder /build/build /usr/share/nginx/html

# Create necessary directories and set permissions
RUN mkdir -p /var/cache/nginx /tmp/nginx && \
    chown -R cloudscan:cloudscan /usr/share/nginx/html /var/cache/nginx /tmp/nginx && \
    chmod -R 755 /var/cache/nginx /tmp/nginx

# Switch to non-root user
USER cloudscan

# Expose HTTP port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
