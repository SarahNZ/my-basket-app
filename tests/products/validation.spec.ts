import { test, expect } from '@playwright/test';
import { ProductPage } from '../../src/pages/ProductPage';
import { invalidProductData, boundaryTestData } from '../../src/fixtures/productData';
import { ResponseValidator } from '../../src/utils/validator';

test.describe('Product Validation Tests @products @regression', () => {
  let productPage: ProductPage;

  test.beforeEach(async ({ request }) => {
    productPage = new ProductPage(request);
  });

  test('should reject product without required name field', async () => {
    const { response, body } = await productPage.createProduct(
      invalidProductData.missingName as any
    );
    
    expect(response.status()).toBe(400);
    ResponseValidator.validateErrorResponse(body, 400);
  });

  test('should reject product without required price field', async () => {
    const { response, body } = await productPage.createProduct(
      invalidProductData.missingPrice as any
    );
    
    expect(response.status()).toBe(400);
    ResponseValidator.validateErrorResponse(body, 400);
  });

  test('should reject product with negative price', async () => {
    const { response, body } = await productPage.createProduct(
      invalidProductData.invalidPrice as any
    );
    
    expect(response.status()).toBe(400);
    ResponseValidator.validateErrorResponse(body, 400);
  });

  test('should reject product with empty required strings', async () => {
    const { response, body } = await productPage.createProduct(
      invalidProductData.emptyStrings as any
    );
    
    expect(response.status()).toBe(400);
    ResponseValidator.validateErrorResponse(body, 400);
  });

  test('should handle minimum price boundary', async () => {
    const { response, body } = await productPage.createProduct(boundaryTestData.minPrice);
    
    expect(response.status()).toBe(201);
    expect(body.price).toBe(0.01);
    
    await productPage.deleteProduct(body.id);
  });

  test('should handle maximum price boundary', async () => {
    const { response, body } = await productPage.createProduct(boundaryTestData.maxPrice);
    
    expect(response.status()).toBe(201);
    expect(body.price).toBe(9999.99);
    
    await productPage.deleteProduct(body.id);
  });

  test('should validate response headers', async () => {
    const { response } = await productPage.getAllProducts();
    const headers = response.headers();
    
    ResponseValidator.validateHeaders(headers);
  });

  test('should validate pagination parameters', async () => {
    // Test invalid page number
    const { response: response1 } = await productPage.getProductsWithPagination(0, 10);
    expect([200, 400]).toContain(response1.status());
    
    // Test invalid limit
    const { response: response2 } = await productPage.getProductsWithPagination(1, 0);
    expect([200, 400]).toContain(response2.status());
    
    // Test limit exceeding maximum
    const { response: response3 } = await productPage.getProductsWithPagination(1, 1000);
    expect([200, 400]).toContain(response3.status());
  });
});
