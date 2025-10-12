# Multi-stage Dockerfile for CloudScan UI (React)
# Stage 1: Build the React application
FROM node:20-alpine AS builder

WORKDIR /build

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm config set fetch-timeout 600000 && \
    npm config set fetch-retries 5 && \
    npm install

# Copy source code
COPY . .

# Build the React application
ARG REACT_APP_API_URL
ARG REACT_APP_WS_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL:-http://localhost:8080}
ENV REACT_APP_WS_URL=${REACT_APP_WS_URL:-ws://localhost:9090}

RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:1.25-alpine

# Install runtime dependencies
RUN apk add --no-cache ca-certificates tzdata curl

# Create default nginx configuration
RUN cat > /etc/nginx/conf.d/default.conf <<'EOF'
server {
    listen 3000;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://cloudscan-api-gateway:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Copy built application from builder
COPY --from=builder /build/build /usr/share/nginx/html

# Create non-root user (nginx already runs as nginx user)
RUN chown -R nginx:nginx /usr/share/nginx/html /var/cache/nginx /var/run

# Create necessary directories with proper permissions
RUN mkdir -p /tmp /var/cache/nginx /var/run && \
    chown -R nginx:nginx /tmp /var/cache/nginx /var/run

# Switch to non-root user
USER nginx

# Expose HTTP port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:3000/ || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]