import { test, expect } from '@playwright/test';
import { ProductPage } from '../../src/pages/ProductPage';
import { DataGenerator } from '../../src/utils/dataGenerator';
import { ResponseValidator } from '../../src/utils/validator';
import { validProductData } from '../../src/fixtures/productData';

test.describe('Product CRUD Operations @smoke @products', () => {
  let productPage: ProductPage;
  let createdProductId: string;

  test.beforeEach(async ({ request }) => {
    productPage = new ProductPage(request);
  });

  test('should create a new product @regression', async () => {
    const productData = DataGenerator.generateProductData();
    
    const { response, body } = await productPage.createProduct(productData);
    
    expect(response.status()).toBe(201);
    expect(response.ok()).toBeTruthy();
    
    ResponseValidator.validateProduct(body);
    expect(body.name).toBe(productData.name);
    expect(body.price).toBe(productData.price);
    expect(body.description).toBe(productData.description);
    expect(body.category).toBe(productData.category);
    
    createdProductId = body.id;
    
    // Cleanup
    await productPage.deleteProduct(createdProductId);
  });

  test('should get all products', async () => {
    const { response, body } = await productPage.getAllProducts();
    
    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();
    
    ResponseValidator.validateProductList(body);
    expect(body.products.length).toBeGreaterThan(0);
  });

  test('should get product by ID', async () => {
    // First create a product
    const { body: createdProduct } = await productPage.createProduct(validProductData);
    
    // Get the product by ID
    const { response, body } = await productPage.getProductById(createdProduct.id);
    
    expect(response.status()).toBe(200);
    ResponseValidator.validateProduct(body);
    expect(body.id).toBe(createdProduct.id);
    expect(body.name).toBe(validProductData.name);
    
    // Cleanup
    await productPage.deleteProduct(createdProduct.id);
  });

  test('should update a product', async () => {
    // Create a product first
    const { body: createdProduct } = await productPage.createProduct(validProductData);
    
    // Update the product
    const updates = {
      name: 'Updated Product Name',
      price: 9.99,
      inStock: false,
    };
    
    const { response, body } = await productPage.updateProduct(createdProduct.id, updates);
    
    expect(response.status()).toBe(200);
    ResponseValidator.validateProduct(body);
    expect(body.name).toBe(updates.name);
    expect(body.price).toBe(updates.price);
    expect(body.inStock).toBe(updates.inStock);
    
    // Cleanup
    await productPage.deleteProduct(createdProduct.id);
  });

  test('should delete a product', async () => {
    // Create a product first
    const { body: createdProduct } = await productPage.createProduct(validProductData);
    
    // Delete the product
    const response = await productPage.deleteProduct(createdProduct.id);
    
    expect(response.status()).toBe(204);
    
    // Verify product is deleted
    const getResponse = await productPage.getProductById(createdProduct.id);
    expect(getResponse.response.status()).toBe(404);
  });

  test('should create multiple products in sequence', async () => {
    const productsToCreate = DataGenerator.generateMultipleProducts(3);
    const createdIds: string[] = [];
    
    for (const productData of productsToCreate) {
      const { response, body } = await productPage.createProduct(productData);
      expect(response.status()).toBe(201);
      createdIds.push(body.id);
    }
    
    expect(createdIds.length).toBe(3);
    
    // Cleanup
    for (const id of createdIds) {
      await productPage.deleteProduct(id);
    }
  });
});
