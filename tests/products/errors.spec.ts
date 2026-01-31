import { test, expect } from '@playwright/test';
import { ProductPage } from '../../src/pages/ProductPage';
import { ResponseValidator } from '../../src/utils/validator';
import { DataGenerator } from '../../src/utils/dataGenerator';

test.describe('Error Scenario Tests @products @regression', () => {
  let productPage: ProductPage;

  test.beforeEach(async ({ request }) => {
    productPage = new ProductPage(request);
  });

  test('should return 404 for non-existent product', async () => {
    const nonExistentId = 'non-existent-id-12345';
    
    const { response, body } = await productPage.getProductById(nonExistentId);
    
    expect(response.status()).toBe(404);
    ResponseValidator.validateErrorResponse(body, 404);
  });

  test('should return 404 when updating non-existent product', async () => {
    const nonExistentId = 'non-existent-id-12345';
    const updates = { name: 'Updated Name' };
    
    const { response, body } = await productPage.updateProduct(nonExistentId, updates);
    
    expect(response.status()).toBe(404);
    ResponseValidator.validateErrorResponse(body, 404);
  });

  test('should return 404 when deleting non-existent product', async () => {
    const nonExistentId = 'non-existent-id-12345';
    
    const response = await productPage.deleteProduct(nonExistentId);
    
    expect(response.status()).toBe(404);
  });

  test('should handle malformed JSON in request body', async () => {
    const response = await productPage['post']('/api/products', 'invalid-json');
    
    expect([400, 500]).toContain(response.status());
  });

  test('should handle very large payload', async () => {
    const largePayload = DataGenerator.generateLargePayload();
    
    const { response } = await productPage.createProduct(largePayload);
    
    // Should either accept or reject with 400
    expect([201, 400]).toContain(response.status());
    
    if (response.status() === 201) {
      const body = await response.json();
      await productPage.deleteProduct(body.id);
    }
  });

  test('should validate response time for GET requests', async () => {
    const startTime = Date.now();
    
    await productPage.getAllProducts();
    
    const duration = Date.now() - startTime;
    ResponseValidator.validateResponseTime(duration, 3000);
  });

  test('should validate response time for POST requests', async () => {
    const productData = DataGenerator.generateProductData();
    const startTime = Date.now();
    
    const { body } = await productPage.createProduct(productData);
    
    const duration = Date.now() - startTime;
    ResponseValidator.validateResponseTime(duration, 3000);
    
    await productPage.deleteProduct(body.id);
  });

  test('should handle concurrent requests', async ({ request }) => {
    const productPage1 = new ProductPage(request);
    const productPage2 = new ProductPage(request);
    const productPage3 = new ProductPage(request);
    
    const promises = [
      productPage1.getAllProducts(),
      productPage2.getAllProducts(),
      productPage3.getAllProducts(),
    ];
    
    const results = await Promise.all(promises);
    
    results.forEach(({ response }) => {
      expect(response.status()).toBe(200);
    });
  });
});
