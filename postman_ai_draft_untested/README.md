# Product Service API - Postman Test Collection

This directory contains comprehensive API test cases for the Product Service microservice.

## 📦 Files

- **Product-Service-API-Tests.postman_collection.json** - Complete test collection with 70+ test cases
- **Product-Service-Environment.postman_environment.json** - Environment variables for local testing

## 🚀 Getting Started

### Prerequisites

1. **Start the microservices:**
   ```bash
   npm run microservices:start
   # OR on Windows
   .\scripts\start-microservices.bat
   ```

2. **Verify Product Service is running:**
   - Direct access: http://localhost:3001/api/health
   - API Documentation: http://localhost:3001/api-docs

### Import into Postman

#### Option 1: Postman Desktop App
1. Open Postman
2. Click **Import** button (top left)
3. Select **File** tab
4. Choose both files:
   - `Product-Service-API-Tests.postman_collection.json`
   - `Product-Service-Environment.postman_environment.json`
5. Click **Import**
6. Select the environment from the dropdown (top right)

#### Option 2: Postman Web
1. Go to https://web.postman.co
2. Click **Import** → **Upload Files**
3. Upload both JSON files
4. Select the environment from the top-right dropdown

## 📋 Test Collection Structure

### 1. Valid Requests - Required Fields (5 tests)
- GET all products with default pagination
- GET product by ID
- POST create product with all required fields
- PUT update product (partial update)
- DELETE product by ID

### 2. Valid Requests - Optional Fields (8 tests)
- Category filtering
- Price range filtering
- Search functionality
- In-stock filtering
- Custom pagination
- Create product with optional fields
- Multiple filters combined

### 3. Authentication & Authorization (1 test)
- Verify no authentication required for read operations

### 4. Missing Required Fields (3 tests)
- Missing name field
- Missing price field
- Empty request body

### 5. Invalid Data Types & Formats (6 tests)
- Invalid price type (string instead of number)
- Invalid boolean format
- Invalid image URL format
- Negative price values
- Empty string fields
- Various type mismatches

### 6. Boundary Value Testing (10 tests)
- Page number validation (0, negative, very large)
- Limit validation (0, 1, 100, 150)
- Price boundaries (zero, negative)
- Edge cases for pagination

### 7. Large Payload Testing (3 tests)
- Very long search queries (5000 characters)
- Maximum page size (100 items)
- Products with very long field values

### 8. Concurrent Request Testing (3 tests)
- Multiple simultaneous requests
- Different query parameters
- Load testing scenarios

### 9. Rate Limiting Scenarios (1 test)
- Rate limit detection (via API Gateway)

### 10. Error Response Validation (4 tests)
- 404 Not Found responses
- Invalid endpoints
- Malformed JSON

### 11. Header & Content-Type Validation (2 tests)
- Content-Type header verification
- CORS header validation
- Wrong Content-Type handling

### 12. Performance & Response Time (2 tests)
- Response time assertions (<300ms for lists, <200ms for single items)
- Response size validation

## 🧪 Running Tests

### Run All Tests
1. Select the collection
2. Click **Run** button
3. Click **Run Product Service API - Comprehensive Test Suite**
4. Review results

### Run Specific Folder
1. Expand the collection
2. Right-click on a folder (e.g., "5. Invalid Data Types & Formats")
3. Select **Run folder**

### Run Single Test
1. Navigate to the specific request
2. Click **Send**
3. View results in the **Test Results** tab

## 📊 Test Assertions

Each test includes:
- ✅ **HTTP Status Code** - Validates correct response codes (200, 201, 400, 404, etc.)
- ✅ **Response Structure** - Ensures proper JSON structure
- ✅ **Field Validation** - Verifies required and optional fields
- ✅ **Data Type Checks** - Confirms correct data types
- ✅ **Response Time** - Performance assertions
- ✅ **Header Validation** - Content-Type and CORS headers
- ✅ **Error Messages** - Proper error response format

## 🔄 Using with Newman (CLI)

### Install Newman
```bash
npm install -g newman
```

### Run Collection
```bash
# Basic run
newman run postman/Product-Service-API-Tests.postman_collection.json \
  -e postman/Product-Service-Environment.postman_environment.json

# With HTML report
newman run postman/Product-Service-API-Tests.postman_collection.json \
  -e postman/Product-Service-Environment.postman_environment.json \
  --reporters cli,html \
  --reporter-html-export postman-report.html

# With iterations (stress testing)
newman run postman/Product-Service-API-Tests.postman_collection.json \
  -e postman/Product-Service-Environment.postman_environment.json \
  --iteration-count 10
```

### Windows (PowerShell)
```powershell
newman run .\postman\Product-Service-API-Tests.postman_collection.json `
  -e .\postman\Product-Service-Environment.postman_environment.json `
  --reporters cli,html
```

## 🎯 Test Coverage

| Category | Test Cases | Coverage |
|----------|------------|----------|
| Valid Requests | 13 | ✅ Complete |
| Validation Errors | 12 | ✅ Complete |
| Boundary Testing | 10 | ✅ Complete |
| Error Handling | 7 | ✅ Complete |
| Performance | 5 | ✅ Complete |
| Headers/CORS | 2 | ✅ Complete |
| **Total** | **49+** | **Comprehensive** |

## 🌍 Environment Variables

### Current Environment
- `baseUrl` - Product Service URL (http://localhost:3001)
- `gatewayUrl` - API Gateway URL (http://localhost:3000)
- `testProductId` - Auto-populated after creating a test product

### Dynamic Variables
The collection uses Postman's pre-request scripts to generate:
- Long strings for payload testing
- Unique IDs for test data
- Random values for stress testing

## 📝 API Endpoints Tested

### GET /api/products
- Query parameters: category, minPrice, maxPrice, inStock, search, page, limit
- Response: Paginated product list with metadata

### GET /api/products/:id
- Path parameter: Product ID
- Response: Single product object or 404

### POST /api/products
- Body: Product object with required fields
- Response: Created product with ID and timestamps (201)

### PUT /api/products/:id
- Path parameter: Product ID
- Body: Partial product updates
- Response: Updated product or 404

### DELETE /api/products/:id
- Path parameter: Product ID
- Response: Success message or 404

## 🔍 Validation Rules Tested

### Product Schema
```json
{
  "name": "string (min: 1)",
  "price": "number (positive)",
  "description": "string (min: 1)",
  "image": "string (valid URL)",
  "dataAiHint": "string (min: 1)",
  "category": "string (optional)",
  "inStock": "boolean (optional)"
}
```

### Query Parameters
- `page`: Positive integer
- `limit`: Positive integer, max 100
- `minPrice`: Number
- `maxPrice`: Number
- `inStock`: Boolean
- `category`: String
- `search`: String

## 🐛 Known Issues & Notes

1. **Rate Limiting**: Direct Product Service calls (port 3001) don't have rate limiting. Test via API Gateway (port 3000) for rate limit validation.

2. **In-Memory Storage**: Products are stored in memory and reset on service restart.

3. **Concurrent Tests**: For true concurrent testing, use Newman with parallel execution or Postman's Collection Runner with multiple iterations.

4. **DELETE Tests**: May need to create test products first. Some tests automatically create and clean up data.

## 📚 Additional Resources

- [Product Service API Documentation](http://localhost:3001/api-docs)
- [Postman Learning Center](https://learning.postman.com/)
- [Newman Documentation](https://learning.postman.com/docs/running-collections/using-newman-cli/command-line-integration-with-newman/)

## 🤝 Contributing

To add new test cases:
1. Add request to appropriate folder in Postman
2. Include comprehensive test scripts
3. Update this README with new test descriptions
4. Export updated collection

## 📄 License

Part of the MyBasket application project.
