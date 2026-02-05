# MyBasket Lite - AI Coding Assistant Guide

## Architecture Overview

This is a **microservices-based** retail application with a Next.js 15 frontend. The system was refactored from a monolithic architecture into distributed services.

**Service Topology:**
- **Next.js App** (port 9002) → **API Gateway** (port 3000) → **Microservices** (ports 3001-3004)
- Frontend communicates ONLY through API Gateway (`NEXT_PUBLIC_API_URL`)
- Microservices communicate directly with each other (e.g., Cart Service → Product Service)

**Services:**
- `product-service` (3001): Product catalog with in-memory storage
- `cart-service` (3002): Shopping cart, calls Product Service for validation
- `order-service` (3003): Order management, calls Cart Service
- `ai-service` (3004): AI recommendations using Genkit
- `api-gateway` (3000): Request routing, rate limiting, health checks

All services use TypeScript, Express, and follow a class-based service pattern (e.g., `ProductService`, `CartService`).

## Critical Workflows

### Starting Development Environment
**WINDOWS USERS:** Always use `.bat` scripts, not `.sh` files:
```bash
npm run microservices:start:win  # NOT microservices:start
npm run dev                      # In separate terminal
```

**Unix/Mac:**
```bash
npm run microservices:start
npm run dev
```

The `.sh` scripts use `lsof` for port cleanup (not available on Windows). Microservices MUST be running before frontend starts, or API calls will fail silently.

### Testing
- **E2E Tests:** Playwright with Allure reporting (`npm test`)
- **Test Structure:** Page Object Model pattern in `tests/`
- **Base URL:** Tests default to `http://localhost:3001` (Product Service directly)
- **Run order:** Start microservices → Run tests
- **Known issue:** `npm run test:allure:generate` requires Java (exit code 49 = missing dependency)

### Docker Deployment
All services containerized in `docker-compose.yml`. Each microservice has identical Dockerfile pattern:
- Multi-stage build (deps → build → production)
- Built artifacts in `dist/` via `tsc`
- Startup: `node dist/index.js`

**Network issues:** See `DOCKER_NETWORK_FIXES.md` for corporate proxy/registry workarounds.

## Code Patterns & Conventions

### Frontend (Next.js 15)
- **App Router** structure (`src/app/`)
- **Path aliases:** `@/*` maps to `src/*` (configured in `tsconfig.json`)
- **UI Components:** shadcn/ui in `src/components/ui/` (see `components.json` for config)
  - Uses Radix UI primitives + Tailwind
  - CVA (class-variance-authority) for variant management
  - Example: [button.tsx](src/components/ui/button.tsx)
- **API Client:** Centralized `ApiClient` class in [src/lib/api/client.ts](src/lib/api/client.ts)
  - All frontend API calls go through this
  - Wraps fetch with error handling and JSON serialization
- **State:** React Context pattern (`CartProvider` in `ApiCartContext`)

### Microservices Structure
Each service follows the same pattern:
```
microservices/{service-name}/
├── src/
│   ├── index.ts        # Express setup + Swagger
│   ├── service.ts      # Business logic class
│   ├── types.ts        # TypeScript interfaces
│   ├── data.ts         # In-memory data (no real DB)
│   ├── swagger.ts      # API documentation
│   └── {name}-client.ts # Optional: inter-service HTTP client
├── package.json
└── tsconfig.json
```

**Service-to-Service Communication:**
- Uses environment variables for URLs (e.g., `PRODUCT_SERVICE_URL`)
- HTTP clients use axios (see [product-client.ts](microservices/cart-service/src/product-client.ts))
- No shared database - each service owns its data

### API Documentation
All services expose Swagger UI at `/api-docs`:
- Gateway: `http://localhost:3000/api-docs`
- Product: `http://localhost:3001/api-docs`
- Use JSDoc `@swagger` comments for endpoint definitions

### Data Management
**No persistence layer** - all data is in-memory via TypeScript arrays:
- Products: `sampleProducts` in `product-service/src/data.ts`
- Cart: In-memory Map in `CartService`
- Orders: In-memory array in `OrderService`

Changes reset on service restart. This is intentional for the demo/prototype.

## Project-Specific Gotchas

1. **Port Conflicts:** If microservices fail to start, previous processes may be holding ports 3000-3004. Windows users must manually kill processes (`netstat -ano | findstr :3000`).

2. **Proxy Routing:** Frontend requests to `/api/*` go through Next.js API routes in `src/app/api/`, which then proxy to API Gateway. Don't create conflicting routes.

3. **Type Inconsistencies:** Product type definitions exist in both `src/types/` (frontend) and `microservices/*/src/types.ts` (backend). Keep them synchronized.

4. **TypeScript Strict Mode:** `next.config.ts` has `ignoreBuildErrors: true`. Don't rely on this - fix type errors properly.

5. **Health Checks:** Gateway's `/health` endpoint checks ALL services. If one fails, entire system reports unhealthy (503 status).

6. **AI Service:** Uses Google Genkit but requires API keys. Check `src/ai/` for configuration (not fully documented in README).

## Key Files Reference

| File | Purpose |
|------|---------|
| [src/lib/api/client.ts](src/lib/api/client.ts) | All frontend API calls |
| [microservices/api-gateway/src/index.ts](microservices/api-gateway/src/index.ts) | Service routing logic |
| [docker-compose.yml](docker-compose.yml) | Full service topology |
| [scripts/start-microservices.sh](scripts/start-microservices.sh) | Dev startup sequence |
| [playwright.config.ts](playwright.config.ts) | Test configuration |
| [components.json](components.json) | shadcn/ui settings |

## When Making Changes

- **Adding API endpoint:** Update service's `index.ts`, add `@swagger` docs, update corresponding API client in frontend
- **New microservice:** Copy structure from existing service, update `docker-compose.yml`, add proxy route in API Gateway
- **Frontend component:** Use shadcn/ui patterns, place in `src/components/`, follow CVA variant system
- **Tests:** Add to `tests/{feature}/`, follow POM pattern, ensure Product Service is running

## Environment Variables

Frontend (`.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Each microservice (`.env` in service dir):
```
NODE_ENV=development
PORT=300X
{SERVICE}_SERVICE_URL=http://localhost:300Y
```

Gateway needs ALL service URLs configured.
