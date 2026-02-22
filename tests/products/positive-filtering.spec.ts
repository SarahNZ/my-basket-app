import { test, expect, request as playwrightRequest, APIRequestContext } from '@playwright/test';
import { ProductPage } from '../../src/pages/ProductPage';
import { ResponseValidator } from '../../src/utils/validator';

/**
 * Positive (Happy Path) test cases for getAllProducts filtering logic.
 * Target: GET /api/products (Product Service, port 3001)
 * Seed data reference (8 products):
 *   - Brown Rice      $2.49  grains
 *   - Organic Spinach $2.99  vegetables
 *   - Almond Milk     $3.79  dairy
 *   - Organic Apples  $3.99  fruits
 *   - Whole Wheat Bread $4.49 bakery
 *   - Greek Yogurt    $4.99  dairy
 *   - Free-Range Eggs $5.99  dairy
 *   - Chicken Breast  $9.99  meat
 */
test.describe('Positive Filtering — getAllProducts @products @positive @regression', () => {
  let productPage: ProductPage;
  let apiRequestContext: APIRequestContext;

  test.beforeAll(async () => {
    apiRequestContext = await playwrightRequest.newContext({
      baseURL: process.env.BASE_URL || 'http://localhost:3001',
      extraHTTPHeaders: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    productPage = new ProductPage(apiRequestContext);
  });

  test.afterAll(async () => {
    await apiRequestContext.dispose();
  });

  // TC-P-01
  test('TC-P-01: should return all products when no filters are applied', async () => {
    const { response, body } = await productPage.getAllProducts();

    expect(response.status()).toBe(200);
    ResponseValidator.validateProductList(body);
    expect(body.products.length).toBeGreaterThanOrEqual(8);
    expect(body.total).toBeGreaterThanOrEqual(8);
  });

  // TC-P-02
  test('TC-P-02: should return only products at or above a given minPrice', async () => {
    const minPrice = 5.00;

    const { response, body } = await productPage.getAllProducts({ minPrice });

    expect(response.status()).toBe(200);
    ResponseValidator.validateProductList(body);
    expect(body.products.length).toBeGreaterThan(0);
    body.products.forEach((product) => {
      expect(product.price).toBeGreaterThanOrEqual(minPrice);
    });
  });

  // TC-P-03
  test('TC-P-03: should return only products at or below a given maxPrice', async () => {
    const maxPrice = 4.00;

    const { response, body } = await productPage.getAllProducts({ maxPrice });

    expect(response.status()).toBe(200);
    ResponseValidator.validateProductList(body);
    expect(body.products.length).toBeGreaterThan(0);
    body.products.forEach((product) => {
      expect(product.price).toBeLessThanOrEqual(maxPrice);
    });
  });

  // TC-P-04
  test('TC-P-04: should return products within a valid minPrice + maxPrice range', async () => {
    const minPrice = 3.00;
    const maxPrice = 5.00;

    const { response, body } = await productPage.filterByPriceRange(minPrice, maxPrice);

    expect(response.status()).toBe(200);
    ResponseValidator.validateProductList(body);
    expect(body.products.length).toBeGreaterThan(0);
    body.products.forEach((product) => {
      expect(product.price).toBeGreaterThanOrEqual(minPrice);
      expect(product.price).toBeLessThanOrEqual(maxPrice);
    });
  });

  // TC-P-05
  test('TC-P-05: should return only products matching a given category', async () => {
    const category = 'dairy';

    const { response, body } = await productPage.filterByCategory(category);

    expect(response.status()).toBe(200);
    ResponseValidator.validateProductList(body);
    // seed data has 3 dairy products
    expect(body.products.length).toBeGreaterThanOrEqual(3);
    body.products.forEach((product) => {
      expect(product.category).toBe(category);
    });
  });

  // TC-P-06
  test('TC-P-06: should return only products matching category AND price range', async () => {
    const category = 'dairy';
    const minPrice = 4.00;
    const maxPrice = 6.00;

    const { response, body } = await productPage.getAllProducts({
      category,
      minPrice,
      maxPrice,
    });

    expect(response.status()).toBe(200);
    ResponseValidator.validateProductList(body);
    // Greek Yogurt ($4.99) and Free-Range Eggs ($5.99) qualify; Almond Milk ($3.79) is excluded
    expect(body.products.length).toBeGreaterThanOrEqual(2);
    body.products.forEach((product) => {
      expect(product.category).toBe(category);
      expect(product.price).toBeGreaterThanOrEqual(minPrice);
      expect(product.price).toBeLessThanOrEqual(maxPrice);
    });
  });

  // TC-P-07
  test('TC-P-07: should return all products when minPrice is 0', async () => {
    const minPrice = 0;

    const { response, body } = await productPage.getAllProducts({ minPrice });

    expect(response.status()).toBe(200);
    ResponseValidator.validateProductList(body);
    // minPrice=0 excludes nothing — all seed products returned
    expect(body.products.length).toBeGreaterThanOrEqual(8);
    body.products.forEach((product) => {
      expect(product.price).toBeGreaterThanOrEqual(minPrice);
    });
  });

  // TC-P-08
  test('TC-P-08: should return all products when maxPrice equals the most expensive product price', async () => {
    const maxPrice = 9.99; // Chicken Breast — highest seed price

    const { response, body } = await productPage.getAllProducts({ maxPrice });

    expect(response.status()).toBe(200);
    ResponseValidator.validateProductList(body);
    // maxPrice at ceiling includes every seed product
    expect(body.products.length).toBeGreaterThanOrEqual(8);
    body.products.forEach((product) => {
      expect(product.price).toBeLessThanOrEqual(maxPrice);
    });
  });

  // TC-P-09
  test('TC-P-09: should return all products when minPrice equals the cheapest product price', async () => {
    const minPrice = 2.49; // Brown Rice — lowest seed price

    const { response, body } = await productPage.getAllProducts({ minPrice });

    expect(response.status()).toBe(200);
    ResponseValidator.validateProductList(body);
    // minPrice at floor includes every seed product
    expect(body.products.length).toBeGreaterThanOrEqual(8);
    body.products.forEach((product) => {
      expect(product.price).toBeGreaterThanOrEqual(minPrice);
    });
  });

  // TC-P-10
  test('TC-P-10: should return only products at an exact price when minPrice equals maxPrice', async () => {
    const price = 9.99; // Chicken Breast is the only seed product at this price

    const { response, body } = await productPage.filterByPriceRange(price, price);

    expect(response.status()).toBe(200);
    ResponseValidator.validateProductList(body);
    expect(body.products.length).toBeGreaterThanOrEqual(1);
    body.products.forEach((product) => {
      expect(product.price).toBe(price);
    });
  });
});
