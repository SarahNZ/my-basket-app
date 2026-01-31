import { test, expect } from '@playwright/test';
import { ProductPage } from '../../src/pages/ProductPage';
import { DataGenerator } from '../../src/utils/dataGenerator';
import { ResponseValidator } from '../../src/utils/validator';

test.describe('Integration Workflow Tests @integration @smoke', () => {
  let productPage: ProductPage;

  test.beforeEach(async ({ request }) => {
    productPage = new ProductPage(request);
  });

  test('complete product lifecycle workflow', async () => {
    // 1. Create a new product
    const productData = DataGenerator.generateProductData({
      category: 'integration-test',
      inStock: true,
    });
    
    const { response: createResponse, body: createdProduct } = 
      await productPage.createProduct(productData);
    
    expect(createResponse.status()).toBe(201);
    ResponseValidator.validateProduct(createdProduct);
    const productId = createdProduct.id;
    
    // 2. Verify product was created by fetching it
    const { response: getResponse, body: fetchedProduct } = 
      await productPage.getProductById(productId);
    
    expect(getResponse.status()).toBe(200);
    expect(fetchedProduct.id).toBe(productId);
    expect(fetchedProduct.name).toBe(productData.name);
    
    // 3. Update the product
    const updates = {
      name: `Updated ${productData.name}`,
      price: productData.price! * 1.5,
      inStock: false,
    };
    
    const { response: updateResponse, body: updatedProduct } = 
      await productPage.updateProduct(productId, updates);
    
    expect(updateResponse.status()).toBe(200);
    expect(updatedProduct.name).toBe(updates.name);
    expect(updatedProduct.price).toBe(updates.price);
    expect(updatedProduct.inStock).toBe(false);
    
    // 4. Search for the updated product
    const { response: searchResponse, body: searchResults } = 
      await productPage.searchProducts(updates.name);
    
    expect(searchResponse.status()).toBe(200);
    const foundProduct = searchResults.products.find(p => p.id === productId);
    expect(foundProduct).toBeDefined();
    expect(foundProduct?.name).toBe(updates.name);
    
    // 5. Filter by category
    const { response: filterResponse, body: filterResults } = 
      await productPage.filterByCategory('integration-test');
    
    expect(filterResponse.status()).toBe(200);
    const foundInFilter = filterResults.products.find(p => p.id === productId);
    expect(foundInFilter).toBeDefined();
    
    // 6. Delete the product
    const deleteResponse = await productPage.deleteProduct(productId);
    expect(deleteResponse.status()).toBe(204);
    
    // 7. Verify product is deleted
    const { response: verifyResponse } = await productPage.getProductById(productId);
    expect(verifyResponse.status()).toBe(404);
  });

  test('bulk operations workflow', async () => {
    const productCount = 5;
    const products = DataGenerator.generateMultipleProducts(productCount);
    const createdIds: string[] = [];
    
    // 1. Create multiple products
    for (const product of products) {
      const { body } = await productPage.createProduct(product);
      createdIds.push(body.id);
    }
    
    expect(createdIds.length).toBe(productCount);
    
    // 2. Fetch all created products
    for (const id of createdIds) {
      const { response } = await productPage.getProductById(id);
      expect(response.status()).toBe(200);
    }
    
    // 3. Update all products
    for (const id of createdIds) {
      const { response } = await productPage.updateProduct(id, {
        name: `Bulk Updated Product ${id}`,
      });
      expect(response.status()).toBe(200);
    }
    
    // 4. Delete all products
    for (const id of createdIds) {
      const response = await productPage.deleteProduct(id);
      expect(response.status()).toBe(204);
    }
    
    // 5. Verify all deleted
    for (const id of createdIds) {
      const { response } = await productPage.getProductById(id);
      expect(response.status()).toBe(404);
    }
  });

  test('pagination workflow', async () => {
    // Create test products
    const testProducts = DataGenerator.generateMultipleProducts(15);
    const createdIds: string[] = [];
    
    for (const product of testProducts) {
      const { body } = await productPage.createProduct(product);
      createdIds.push(body.id);
    }
    
    // Test pagination
    const page1 = await productPage.getProductsWithPagination(1, 5);
    expect(page1.body.products.length).toBe(5);
    expect(page1.body.pagination.page).toBe(1);
    
    const page2 = await productPage.getProductsWithPagination(2, 5);
    expect(page2.body.products.length).toBe(5);
    expect(page2.body.pagination.page).toBe(2);
    
    // Verify no duplicate products between pages
    const page1Ids = page1.body.products.map(p => p.id);
    const page2Ids = page2.body.products.map(p => p.id);
    const intersection = page1Ids.filter(id => page2Ids.includes(id));
    expect(intersection.length).toBe(0);
    
    // Cleanup
    for (const id of createdIds) {
      await productPage.deleteProduct(id);
    }
  });

  test('category and filtering workflow', async () => {
    const categories = ['test-category-1', 'test-category-2'];
    const productsPerCategory = 3;
    const allCreatedIds: string[] = [];
    
    // Create products in different categories
    for (const category of categories) {
      for (let i = 0; i < productsPerCategory; i++) {
        const product = DataGenerator.generateProductData({ category });
        const { body } = await productPage.createProduct(product);
        allCreatedIds.push(body.id);
      }
    }
    
    // Test category filtering
    for (const category of categories) {
      const { body } = await productPage.filterByCategory(category);
      const categoryProducts = body.products.filter(p => 
        allCreatedIds.includes(p.id)
      );
      expect(categoryProducts.length).toBeGreaterThanOrEqual(productsPerCategory);
      categoryProducts.forEach(p => expect(p.category).toBe(category));
    }
    
    // Cleanup
    for (const id of allCreatedIds) {
      await productPage.deleteProduct(id);
    }
  });
});
