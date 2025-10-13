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

# Create custom nginx.conf that doesn't require root
RUN cat > /etc/nginx/nginx.conf <<'EOF'
worker_processes auto;
error_log /tmp/nginx_error.log warn;
pid /tmp/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /tmp/nginx_access.log main;

    sendfile on;
    tcp_nopush on;
    keepalive_timeout 65;
    gzip on;

    # Use /tmp for cache directories (writable by nginx user)
    client_body_temp_path /tmp/client_temp;
    proxy_temp_path /tmp/proxy_temp;
    fastcgi_temp_path /tmp/fastcgi_temp;
    uwsgi_temp_path /tmp/uwsgi_temp;
    scgi_temp_path /tmp/scgi_temp;

    include /etc/nginx/conf.d/*.conf;
}
EOF

# Create default server configuration
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

# Create necessary directories and set permissions
RUN chown -R nginx:nginx /usr/share/nginx/html /etc/nginx/conf.d && \
    mkdir -p /tmp/client_temp /tmp/proxy_temp /tmp/fastcgi_temp /tmp/uwsgi_temp /tmp/scgi_temp && \
    chown -R nginx:nginx /tmp && \
    chmod -R 755 /tmp

# Expose HTTP port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# Switch to non-root user
USER nginx

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
