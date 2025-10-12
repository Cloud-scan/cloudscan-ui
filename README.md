# cloudscan-ui

> Full-stack UI service for CloudScan - Spring Boot backend + React frontend with real-time security scanning dashboard

---

## 🎨 Overview

The **cloudscan-ui** is a full-stack web application that serves as the interface for CloudScan platform. It combines:

- **Backend (Spring Boot)**: Lightweight API server for authentication, session management, and proxying requests
- **Frontend (React)**: Beautiful, responsive UI for security scanning

**Features:**
- 🔐 User authentication (login/signup) with session management
- 📊 Real-time scan progress with live logs
- 🔍 Security findings dashboard with filters
- 📈 Analytics and trends
- ⚙️ Project and organization management
- 📱 Responsive design (desktop, tablet, mobile)
- 🌓 Dark/light theme support
- 🛡️ CSRF protection and security headers
- 🔄 API Gateway proxy to backend services

---

## 🏗️ Tech Stack

### Backend
- **Framework**: Spring Boot 3.2+
- **Language**: Java 17+
- **Security**: Spring Security (JWT/Session)
- **Database**: PostgreSQL (user sessions, preferences)
- **API Client**: WebClient (for backend service calls)
- **Build Tool**: Maven/Gradle

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS + HeadlessUI
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **WebSocket**: native WebSocket API
- **Icons**: Heroicons

---

## 📁 Project Structure

```
cloudscan-ui/
├── backend/                          # Spring Boot backend
│   ├── src/
│   │   └── main/
│   │       ├── java/com/cloudscan/ui/
│   │       │   ├── CloudscanUiApplication.java
│   │       │   ├── config/
│   │       │   │   ├── SecurityConfig.java      # Spring Security config
│   │       │   │   ├── WebClientConfig.java     # WebClient for backend calls
│   │       │   │   └── CorsConfig.java          # CORS configuration
│   │       │   ├── controller/
│   │       │   │   ├── AuthController.java      # Login/logout endpoints
│   │       │   │   ├── ProxyController.java     # Proxy to backend services
│   │       │   │   └── UserController.java      # User management
│   │       │   ├── service/
│   │       │   │   ├── AuthService.java         # Authentication logic
│   │       │   │   ├── SessionService.java      # Session management
│   │       │   │   └── BackendProxyService.java # Backend service proxy
│   │       │   ├── model/
│   │       │   │   ├── User.java
│   │       │   │   ├── Session.java
│   │       │   │   └── dto/                     # DTOs for API
│   │       │   ├── repository/
│   │       │   │   ├── UserRepository.java
│   │       │   │   └── SessionRepository.java
│   │       │   └── security/
│   │       │       ├── JwtTokenProvider.java
│   │       │       └── UserDetailsServiceImpl.java
│   │       └── resources/
│   │           ├── application.yml              # Spring Boot config
│   │           ├── application-dev.yml
│   │           └── application-prod.yml
│   ├── pom.xml / build.gradle                   # Maven/Gradle config
│   └── README.md
│
├── frontend/                         # React frontend
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── common/          # Buttons, inputs, modals, etc.
│   │   │   ├── scan/            # Scan-specific components
│   │   │   ├── findings/        # Finding display components
│   │   │   └── layout/          # Layout components (Header, Sidebar)
│   │   ├── pages/               # Page components
│   │   │   ├── Login.tsx
│   │   │   ├── Signup.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Projects.tsx
│   │   │   ├── ScanNew.tsx
│   │   │   ├── ScanDetails.tsx
│   │   │   └── FindingsPage.tsx
│   │   ├── hooks/               # Custom React hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useScans.ts
│   │   │   ├── useWebSocket.ts
│   │   │   └── useFindings.ts
│   │   ├── services/            # API clients
│   │   │   ├── api.ts           # Base API client (calls Spring Boot backend)
│   │   │   ├── scans.ts         # Scan API
│   │   │   ├── auth.ts          # Authentication API
│   │   │   └── websocket.ts     # WebSocket client
│   │   ├── utils/               # Utility functions
│   │   │   ├── format.ts        # Date/number formatting
│   │   │   └── constants.ts     # App constants
│   │   ├── types/               # TypeScript types
│   │   │   ├── scan.ts
│   │   │   ├── finding.ts
│   │   │   └── user.ts
│   │   ├── stores/              # Zustand stores
│   │   │   ├── authStore.ts
│   │   │   └── uiStore.ts
│   │   ├── App.tsx              # Root component
│   │   ├── main.tsx             # Application entry
│   │   └── index.css            # Global styles
│   ├── public/
│   │   ├── favicon.ico
│   │   └── logo.svg
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── docker-compose.yml               # Local development setup
├── Dockerfile                       # Multi-stage build (Spring Boot + React)
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- **Backend**: Java 17+, Maven/Gradle
- **Frontend**: Node.js 20+, npm
- **Database**: PostgreSQL 15+

### Local Development

#### Option 1: Using Docker Compose (Recommended)

```bash
cd cloudscan-ui

# Start all services (Spring Boot + React + PostgreSQL)
docker-compose up

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8080
```

#### Option 2: Manual Setup

**1. Start Backend (Spring Boot)**

```bash
cd backend

# Set up environment variables
cp src/main/resources/application-dev.yml.example src/main/resources/application-dev.yml
# Edit application-dev.yml with database credentials

# Run PostgreSQL (via Docker)
docker run --name postgres-ui \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=cloudscan_ui \
  -p 5432:5432 \
  -d postgres:15

# Build and run Spring Boot
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
# Or with Gradle:
# ./gradlew bootRun --args='--spring.profiles.active=dev'
```

Backend will be available at `http://localhost:8080`

**2. Start Frontend (React)**

```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with backend URL

# Start development server
npm run dev
```

Frontend will be available at `http://localhost:3000`

---

## 🔧 Configuration

### Backend Configuration (`backend/src/main/resources/application.yml`)

```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/cloudscan_ui
    username: postgres
    password: postgres
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true

# Backend service URLs
cloudscan:
  services:
    orchestrator: http://localhost:9999
    storage: http://localhost:8082
    api-gateway: http://localhost:8080
    websocket: ws://localhost:9090

# JWT configuration
jwt:
  secret: your-secret-key-change-in-production
  expiration: 86400000  # 24 hours in milliseconds
```

### Frontend Configuration (`frontend/.env`)

```bash
# Backend API URL (Spring Boot)
VITE_API_URL=http://localhost:8080

# WebSocket URL
VITE_WS_URL=ws://localhost:9090

# Feature flags
VITE_ENABLE_DARK_MODE=true
VITE_ENABLE_ANALYTICS=false
```

---

## 📜 Available Scripts

### Backend Scripts

```bash
# Development
./mvnw spring-boot:run               # Start Spring Boot app
./mvnw clean package                 # Build JAR
./mvnw test                          # Run tests

# With Gradle
./gradlew bootRun                    # Start Spring Boot app
./gradlew build                      # Build JAR
./gradlew test                       # Run tests
```

### Frontend Scripts

```bash
# Development
npm run dev              # Start dev server with HMR
npm run build            # Build for production
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript compiler check
npm run format           # Format code with Prettier

# Testing
npm run test             # Run unit tests
npm run test:e2e         # Run E2E tests (Playwright)
npm run test:coverage    # Generate coverage report
```

---

## 🎨 Key Features

### 1. Authentication

**Login Page** (`/login`)
- Email/password login
- "Remember me" option
- Password reset link
- JWT token management

**Signup Page** (`/signup`)
- User registration
- Organization creation
- Email verification

### 2. Dashboard

**Overview Page** (`/dashboard`)
- Recent scans summary
- Security trends (7/30/90 days)
- Quick actions
- Critical findings alerts

### 3. Scan Management

**New Scan Wizard** (`/scans/new`)
- Step 1: Select project
- Step 2: Configure source (Git repo, branch)
- Step 3: Choose scan types (SAST, SCA, Secrets, License)
- Step 4: Notifications and options

**Scan Details** (`/scans/:id`)
- Real-time progress bar
- Live log streaming (WebSocket)
- Step-by-step execution status
- Cancel scan button

**Scan Results** (`/scans/:id/findings`)
- Findings table with filters
  - By severity (critical, high, medium, low)
  - By type (SAST, SCA, secrets, license)
  - By status (new, fixed, ignored)
- Finding detail modal
  - Vulnerable code snippet
  - Remediation steps
  - References (CWE, CVE, OWASP)

### 4. Real-time Updates

Uses WebSocket for:
- Live scan logs
- Status changes
- Progress updates

```typescript
// Example WebSocket usage
const ws = useWebSocket(`${WS_URL}/scans/${scanId}`, {
  onMessage: (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'log') {
      appendLog(data.message);
    }
  }
});
```

---

## 🎨 UI Components

### Common Components

```typescript
// Button with variants
<Button variant="primary" size="md" onClick={handleClick}>
  Start Scan
</Button>

// Alert/Toast notifications
<Alert type="success" message="Scan completed!" />

// Modal dialog
<Modal isOpen={isOpen} onClose={onClose} title="Finding Details">
  <FindingDetails finding={selectedFinding} />
</Modal>

// Loading spinner
<Spinner size="lg" />

// Progress bar
<ProgressBar value={60} max={100} label="60% complete" />
```

### Scan Components

```typescript
// Scan status badge
<ScanStatusBadge status="running" />  // Shows colored badge

// Finding severity icon
<SeverityIcon severity="critical" />  // Red icon

// Live logs viewer
<LogViewer logs={logs} isStreaming={true} />

// Findings table
<FindingsTable findings={findings} onSelect={handleSelect} />
```

---

## 🧪 Testing

### Unit Tests (Vitest)

```bash
# Run tests
npm run test

# Watch mode
npm run test:watch
```

### E2E Tests (Playwright)

```bash
# Install Playwright
npx playwright install

# Run E2E tests
npm run test:e2e

# Run specific test
npx playwright test tests/scan-flow.spec.ts
```

**Example E2E test:**
```typescript
test('create and monitor scan', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name=email]', 'test@example.com');
  await page.fill('[name=password]', 'password');
  await page.click('button[type=submit]');

  await page.goto('/scans/new');
  await page.selectOption('[name=project]', 'my-project');
  await page.click('button:has-text("Start Scan")');

  await expect(page.locator('.scan-status')).toHaveText(/running/i);
});
```

---

## 🎨 Styling Guide

Uses TailwindCSS with custom theme:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          900: '#1e3a8a',
        },
        severity: {
          critical: '#dc2626',  // Red
          high: '#ea580c',      // Orange
          medium: '#ca8a04',    // Yellow
          low: '#2563eb',       // Blue
          info: '#6b7280',      // Gray
        }
      }
    }
  }
}
```

**Usage:**
```tsx
<div className="bg-primary-500 text-white px-4 py-2 rounded-lg">
  Critical Finding
</div>

<span className="text-severity-critical font-bold">
  CRITICAL
</span>
```

---

## 🌐 API Integration

### API Client Setup

```typescript
// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Example API Calls

```typescript
// src/services/scans.ts
import api from './api';

export const scansService = {
  // Create scan
  create: async (data: CreateScanRequest) => {
    const response = await api.post('/api/v1/scans', data);
    return response.data;
  },

  // Get scan details
  getById: async (id: string) => {
    const response = await api.get(`/api/v1/scans/${id}`);
    return response.data;
  },

  // List scans
  list: async (filters?: ScanFilters) => {
    const response = await api.get('/api/v1/scans', { params: filters });
    return response.data;
  },
};
```

### React Query Integration

```typescript
// src/hooks/useScans.ts
import { useQuery } from '@tanstack/react-query';
import { scansService } from '../services/scans';

export const useScans = () => {
  return useQuery({
    queryKey: ['scans'],
    queryFn: () => scansService.list(),
    refetchInterval: 10000, // Auto-refresh every 10s
  });
};

export const useScanDetails = (scanId: string) => {
  return useQuery({
    queryKey: ['scans', scanId],
    queryFn: () => scansService.getById(scanId),
    enabled: !!scanId,
  });
};
```

---

## 🐳 Docker

### Build

```bash
docker build -t cloudscan/ui:latest .
```

### Run

```bash
docker run -p 3000:80 \
  -e VITE_API_URL=http://api-gateway:8080 \
  cloudscan/ui:latest
```

### Dockerfile

```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 📱 Responsive Design

Breakpoints:
- **sm**: 640px (mobile)
- **md**: 768px (tablet)
- **lg**: 1024px (desktop)
- **xl**: 1280px (large desktop)

Example:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Responsive grid */}
</div>
```

---

## 🤝 Contributing

1. Follow the component structure
2. Use TypeScript for all new code
3. Add tests for new features
4. Follow Airbnb style guide
5. Use Prettier for formatting

---

## 📄 License

Apache 2.0 - See [LICENSE](../LICENSE)