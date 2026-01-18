import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AI Service API',
      version: '1.0.0',
      description: 'API documentation for the AI Recommendations microservice',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3004',
        description: 'Development server',
      },
      {
        url: 'http://localhost:3000',
        description: 'API Gateway',
      },
    ],
    tags: [
      {
        name: 'Recommendations',
        description: 'AI-powered recommendation endpoints',
      },
      {
        name: 'Health',
        description: 'Health check endpoints',
      },
    ],
    components: {
      schemas: {
        GrocerySuggestionsRequest: {
          type: 'object',
          properties: {
            cartItems: {
              type: 'array',
              items: { type: 'string' },
              example: ['bananas', 'milk', 'bread'],
              default: [],
            },
          },
        },
        PersonalizedRecommendationsRequest: {
          type: 'object',
          properties: {
            cartItems: {
              type: 'array',
              items: { type: 'string' },
              example: ['bananas', 'milk'],
              default: [],
            },
            userId: {
              type: 'string',
              example: 'user_123',
            },
            maxSuggestions: {
              type: 'number',
              minimum: 1,
              maximum: 20,
              default: 6,
              example: 6,
            },
          },
        },
        Suggestion: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Greek Yogurt' },
            reason: { type: 'string', example: 'Pairs well with bananas' },
            category: { type: 'string', example: 'dairy' },
            confidence: { type: 'number', example: 0.85 },
          },
        },
        GrocerySuggestionsResponse: {
          type: 'object',
          properties: {
            suggestions: {
              type: 'array',
              items: { $ref: '#/components/schemas/Suggestion' },
            },
            generatedAt: { type: 'string', format: 'date-time' },
            confidence: { type: 'number', example: 0.8 },
          },
        },
        PersonalizedRecommendationsResponse: {
          type: 'object',
          properties: {
            suggestions: {
              type: 'array',
              items: { $ref: '#/components/schemas/Suggestion' },
            },
            userId: { type: 'string' },
            generatedAt: { type: 'string', format: 'date-time' },
            confidence: { type: 'number', example: 0.85 },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            details: { type: 'array', items: { type: 'object' } },
          },
        },
      },
    },
  },
  apis: ['./src/routes.ts', './src/index.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'AI Service API Docs',
  }));
  
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};
