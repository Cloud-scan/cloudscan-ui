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

# Set up proper permissions for nginx to run as non-root
# Keep these commands running as root
RUN chown -R nginx:nginx /usr/share/nginx/html && \
  # Pre-create cache directories that nginx needs with proper ownership
  mkdir -p /var/cache/nginx/client_temp \
           /var/cache/nginx/proxy_temp \
           /var/cache/nginx/fastcgi_temp \
           /var/cache/nginx/uwsgi_temp \
           /var/cache/nginx/scgi_temp && \
  chown -R nginx:nginx /var/cache/nginx && \
  chmod -R 755 /var/cache/nginx && \
  # Set permissions for runtime directories
  chown -R nginx:nginx /var/run && \
  chmod -R 755 /var/run && \
  # Create pid file location
  touch /var/run/nginx.pid && \
  chown nginx:nginx /var/run/nginx.pid

# Expose HTTP port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# Switch to non-root user
USER nginx

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
