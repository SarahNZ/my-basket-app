import { test, expect } from '@playwright/test';
import { ProductPage } from '../../src/pages/ProductPage';
import { ResponseValidator } from '../../src/utils/validator';
import { testProducts } from '../../src/fixtures/productData';

test.describe('Product Filtering and Search @products @regression', () => {
  let productPage: ProductPage;
  const createdProductIds: string[] = [];

  test.beforeAll(async ({ request }) => {
    productPage = new ProductPage(request);
    
    // Create test products
    for (const product of testProducts) {
      const { body } = await productPage.createProduct(product);
      createdProductIds.push(body.id);
    }
  });

  test.afterAll(async () => {
    // Cleanup
    for (const id of createdProductIds) {
      await productPage.deleteProduct(id);
    }
  });

  test('should filter products by category', async () => {
    const { response, body } = await productPage.filterByCategory('fruits');
    
    expect(response.status()).toBe(200);
    ResponseValidator.validateProductList(body);
    
    body.products.forEach(product => {
      expect(product.category).toBe('fruits');
    });
  });

  test('should filter products by price range', async () => {
    const minPrice = 2.0;
    const maxPrice = 5.0;
    
    const { response, body } = await productPage.filterByPriceRange(minPrice, maxPrice);
    
    expect(response.status()).toBe(200);
    ResponseValidator.validateProductList(body);
    
    body.products.forEach(product => {
      expect(product.price).toBeGreaterThanOrEqual(minPrice);
      expect(product.price).toBeLessThanOrEqual(maxPrice);
    });
  });

  test('should filter products by stock availability', async () => {
    const { response, body } = await productPage.filterByStock(true);
    
    expect(response.status()).toBe(200);
    ResponseValidator.validateProductList(body);
    
    body.products.forEach(product => {
      expect(product.inStock).toBe(true);
    });
  });

  test('should search products by name', async () => {
    const searchTerm = 'Test';
    
    const { response, body } = await productPage.searchProducts(searchTerm);
    
    expect(response.status()).toBe(200);
    ResponseValidator.validateProductList(body);
    
    body.products.forEach(product => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      expect(matchesSearch).toBeTruthy();
    });
  });

  test('should handle pagination correctly', async () => {
    const page = 1;
    const limit = 5;
    
    const { response, body } = await productPage.getProductsWithPagination(page, limit);
    
    expect(response.status()).toBe(200);
    ResponseValidator.validateProductList(body);
    ResponseValidator.validatePagination(body.pagination, page, limit);
    expect(body.products.length).toBeLessThanOrEqual(limit);
  });

  test('should combine multiple filters', async () => {
    const { response, body } = await productPage.getAllProducts(
      {
        category: 'fruits',
        minPrice: 2.0,
        maxPrice: 5.0,
        inStock: true,
      },
      { page: 1, limit: 10 }
    );
    
    expect(response.status()).toBe(200);
    ResponseValidator.validateProductList(body);
    
    body.products.forEach(product => {
      expect(product.category).toBe('fruits');
      expect(product.price).toBeGreaterThanOrEqual(2.0);
      expect(product.price).toBeLessThanOrEqual(5.0);
      expect(product.inStock).toBe(true);
    });
  });

  test('should return empty results for non-existent category', async () => {
    const { response, body } = await productPage.filterByCategory('non-existent-category');
    
    expect(response.status()).toBe(200);
    expect(body.products.length).toBe(0);
  });
});
