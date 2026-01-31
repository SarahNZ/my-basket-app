# MY-BASKET-APP API Test Framework

Comprehensive Playwright TypeScript framework for API testing of the Product Service microservice.

## 🏗️ Architecture

This framework follows the Page Object Model (POM) pattern for API testing with:
- **Page Objects**: API endpoint wrappers with business logic
- **Base Classes**: Reusable HTTP methods and utilities
- **Type Safety**: Full TypeScript support with interfaces
- **Fixtures**: Test data management
- **Reporting**: Multiple report formats (HTML, JSON, Allure)

## 📋 Prerequisites

- Node.js 18+ installed
- Product Service running on `http://localhost:3001`
- npm or yarn package manager

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
The `.env.test` file is already configured with:
```env
BASE_URL=http://localhost:3001
ENVIRONMENT=dev
LOG_LEVEL=info
```

### 3. Start Product Service
```bash
# From the root of MY-BASKET-APP
cd microservices/product-service
npm install
npm run dev
```

### 4. Run Tests
```bash
# Run all tests
npm test

# Run specific test suite
npm run test:products

# Run with UI mode
npm run test:ui

# Run smoke tests
npm run test:smoke

# Run in headed mode
npm run test:headed

# Debug tests
npm run test:debug
```

## 📁 Project Structure

```
tests/
├── src/
│   ├── pages/              # API Page Objects
│   │   ├── base/
│   │   │   └── BasePage.ts
│   │   └── ProductPage.ts
│   ├── utils/              # Utility functions
│   │   ├── apiHelper.ts
│   │   ├── logger.ts
│   │   ├── dataGenerator.ts
│   │   └── validator.ts
│   ├── types/              # TypeScript types
│   │   ├── product.types.ts
│   │   └── api.types.ts
│   ├── fixtures/           # Test data
│   │   └── productData.ts
│   └── config/             # Configuration
│       └── environments.ts
├── products/               # Test specs
│   ├── crud.spec.ts
│   ├── filters.spec.ts
│   ├── validation.spec.ts
│   └── errors.spec.ts
└── integration/
    └── workflow.spec.ts
```

## 🧪 Test Categories

### CRUD Operations
- Create products
- Read/Get products
- Update products
- Delete products

### Filtering & Pagination
- Category filtering
- Price range filtering
- Stock filtering
- Search functionality
- Pagination

### Validation Tests
- Required field validation
- Data type validation
- Boundary testing
- Invalid data handling

### Error Scenarios
- 404 Not Found
- 400 Bad Request
- 500 Internal Server Error

## 📊 Reports

### HTML Report
```bash
npm test
npm run test:report
```

### Allure Report
```bash
npm test
npm run test:allure:generate
npm run test:allure:open
```

## 🔧 Configuration

### Environment Configuration
Edit `src/config/environments.ts` to add new environments.

### Test Tags
- `@smoke` - Critical path tests
- `@regression` - Full regression suite
- `@products` - Product-related tests
- `@validation` - Validation tests

## 📝 Writing Tests

### Example Test
```typescript
test('should create a new product', async ({ request }) => {
  const productPage = new ProductPage(request);
  const productData = DataGenerator.generateProductData();
  
  const { response, body } = await productPage.createProduct(productData);
  
  expect(response.status()).toBe(201);
  expect(body.name).toBe(productData.name);
});
```

## 🐛 Troubleshooting

### Product Service Not Running
```bash
# Start the product service
cd microservices/product-service
npm install
npm run dev
```

### Port Already in Use
Update `BASE_URL` in `.env.test` file or `playwright.config.ts`

### Test Failures
- Check service logs at http://localhost:3001/api-docs
- Review test-results for detailed error messages
- Enable debug mode: `npm run test:debug`

## 🤝 Contributing

1. Create feature branch
2. Add tests with proper tags
3. Update documentation
4. Submit pull request

## 📚 API Documentation

Product Service API Docs: http://localhost:3001/api-docs

## 📄 License

Part of the MY-BASKET-APP project.
