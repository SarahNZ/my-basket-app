# Week 1: Challenge 1.2.4

- The Task: Use the @workspace command to find where the "API Gateway" defines its rate-limiting or routing rules.

The API Gateway defines its rate-limiting in the index.ts file (microservices/api-gateway/src/index.ts). The constant, limiter, points to an instance of the Express IP rate-limiting middleware. Currently, it is configured to allow each IP address 1000 requests per 15 minutes. 

Whereas the routing rules are clearly defined in the config.ts file (microservices/api-gateway/src/config.ts) in a serviceConfig array: 

export const serviceConfig: ServiceConfig[] = [
  { name: 'product-service', url: 'http://localhost:3001', path: '/api/products', healthCheck: '/api/health' },
  { name: 'cart-service', url: 'http://localhost:3002', path: '/api/cart', healthCheck: '/api/health' },
  { name: 'order-service', url: 'http://localhost:3003', path: '/api/orders', healthCheck: '/api/health' },
  { name: 'ai-service', url: 'http://localhost:3004', path: '/api/recommendations', healthCheck: '/api/health' },
];

- The Goal: Locate the configuration file (e.g., microservices/api-gateway/src/config.ts) and ask: "How many requests per minute are allowed before the Gateway returns a 429 error?"

The rate limit is requests per 15 minutes, so it depends how many requests are sent each minute. Copilot says that is equal to approximately 66.67 requests per minute per IP address. 