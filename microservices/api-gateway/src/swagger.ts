import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My Basket App - API Gateway',
      version: '1.0.0',
      description: 'Unified API documentation for all microservices in the My Basket App',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'API Gateway',
      },
      {
        url: 'http://localhost:3001',
        description: 'Product Service (Direct)',
      },
      {
        url: 'http://localhost:3002',
        description: 'Cart Service (Direct)',
      },
      {
        url: 'http://localhost:3003',
        description: 'Order Service (Direct)',
      },
      {
        url: 'http://localhost:3004',
        description: 'AI Service (Direct)',
      },
    ],
    tags: [
      {
        name: 'Gateway',
        description: 'API Gateway endpoints',
      },
      {
        name: 'Products',
        description: 'Product management (Port 3001)',
      },
      {
        name: 'Cart',
        description: 'Shopping cart management (Port 3002)',
      },
      {
        name: 'Orders',
        description: 'Order management (Port 3003)',
      },
      {
        name: 'Recommendations',
        description: 'AI recommendations (Port 3004)',
      },
    ],
    components: {
      schemas: {
        HealthStatus: {
          type: 'object',
          properties: {
            gateway: { type: 'string', example: 'api-gateway' },
            status: { type: 'string', enum: ['healthy', 'unhealthy'], example: 'healthy' },
            services: {
              type: 'object',
              properties: {
                'product-service': { 
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    responseTime: { type: 'number' },
                  },
                },
                'cart-service': { 
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    responseTime: { type: 'number' },
                  },
                },
                'order-service': { 
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    responseTime: { type: 'number' },
                  },
                },
                'ai-service': { 
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    responseTime: { type: 'number' },
                  },
                },
              },
            },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
        GatewayInfo: {
          type: 'object',
          properties: {
            gateway: { type: 'string', example: 'api-gateway' },
            version: { type: 'string', example: '1.0.0' },
            services: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  path: { type: 'string' },
                },
              },
            },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    externalDocs: {
      description: 'Individual Service Documentation',
      url: '#',
    },
  },
  apis: ['./src/index.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

// Enhance spec with service links
(swaggerSpec as any).info.description += `
## Service-Specific Documentation

Access detailed API documentation for each service:

- **Product Service**: [http://localhost:3001/api-docs](http://localhost:3001/api-docs)
- **Cart Service**: [http://localhost:3002/api-docs](http://localhost:3002/api-docs)
- **Order Service**: [http://localhost:3003/api-docs](http://localhost:3003/api-docs)
- **AI Service**: [http://localhost:3004/api-docs](http://localhost:3004/api-docs)

## Architecture

All requests to microservices can be routed through the API Gateway at port 3000, or you can access services directly at their respective ports.

### Service Routes
- Products: \`/api/products/*\` → Product Service (3001)
- Cart: \`/api/cart/*\` → Cart Service (3002)
- Orders: \`/api/orders/*\` → Order Service (3003)
- Recommendations: \`/api/recommendations/*\` → AI Service (3004)
`;

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'My Basket App - API Gateway',
    explorer: true,
  }));
  
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};
