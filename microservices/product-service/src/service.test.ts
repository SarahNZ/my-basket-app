import { ProductService } from './service';
import { Product, ProductFilters, PaginationParams } from './types';
import { sampleProducts } from './data';

describe('ProductService', () => {
  let productService: ProductService;
  let mockDate: Date;
  let originalDateNow: () => number;

  beforeEach(() => {
    productService = new ProductService();
    mockDate = new Date('2024-01-01T00:00:00.000Z');
    
    // Preserve Date.now() while mocking Date constructor
    originalDateNow = Date.now;
    jest.spyOn(global, 'Date').mockImplementation((() => mockDate) as any);
    Date.now = originalDateNow;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getAllProducts', () => {
    it('should return all products without filters or pagination', async () => {
      const result = await productService.getAllProducts();

      expect(result.products).toHaveLength(Math.min(10, sampleProducts.length));
      expect(result.total).toBe(sampleProducts.length);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBeGreaterThan(0);
    });

    it('should filter products by category', async () => {
      const filters: ProductFilters = { category: 'fruits' };
      const result = await productService.getAllProducts(filters);

      result.products.forEach((product) => {
        expect(product.category).toBe('fruits');
      });
    });

    it('should filter products by minPrice', async () => {
      const filters: ProductFilters = { minPrice: 5.0 };
      const result = await productService.getAllProducts(filters);

      result.products.forEach((product) => {
        expect(product.price).toBeGreaterThanOrEqual(5.0);
      });
    });

    it('should filter products by maxPrice', async () => {
      const filters: ProductFilters = { maxPrice: 5.0 };
      const result = await productService.getAllProducts(filters);

      result.products.forEach((product) => {
        expect(product.price).toBeLessThanOrEqual(5.0);
      });
    });

    it('should filter products by price range', async () => {
      const filters: ProductFilters = { minPrice: 3.0, maxPrice: 6.0 };
      const result = await productService.getAllProducts(filters);

      result.products.forEach((product) => {
        expect(product.price).toBeGreaterThanOrEqual(3.0);
        expect(product.price).toBeLessThanOrEqual(6.0);
      });
    });

    it('should filter products by inStock status', async () => {
      const filters: ProductFilters = { inStock: true };
      const result = await productService.getAllProducts(filters);

      result.products.forEach((product) => {
        expect(product.inStock).toBe(true);
      });
    });

    it('should filter products by search term in name', async () => {
      const filters: ProductFilters = { search: 'apple' };
      const result = await productService.getAllProducts(filters);

      expect(result.products.length).toBeGreaterThan(0);
      result.products.forEach((product) => {
        const matchFound =
          product.name.toLowerCase().includes('apple') ||
          product.description.toLowerCase().includes('apple') ||
          product.dataAiHint.toLowerCase().includes('apple');
        expect(matchFound).toBe(true);
      });
    });

    it('should filter products by search term in description', async () => {
      const filters: ProductFilters = { search: 'organic' };
      const result = await productService.getAllProducts(filters);

      expect(result.products.length).toBeGreaterThan(0);
      result.products.forEach((product) => {
        const matchFound =
          product.name.toLowerCase().includes('organic') ||
          product.description.toLowerCase().includes('organic') ||
          product.dataAiHint.toLowerCase().includes('organic');
        expect(matchFound).toBe(true);
      });
    });

    it('should apply pagination with custom page and limit', async () => {
      const pagination: PaginationParams = { page: 2, limit: 5 };
      const result = await productService.getAllProducts({}, pagination);

      expect(result.products.length).toBeLessThanOrEqual(5);
      expect(result.page).toBe(2);
      expect(result.limit).toBe(5);
    });

    it('should calculate correct total pages', async () => {
      const pagination: PaginationParams = { page: 1, limit: 3 };
      const result = await productService.getAllProducts({}, pagination);

      const expectedTotalPages = Math.ceil(sampleProducts.length / 3);
      expect(result.totalPages).toBe(expectedTotalPages);
    });

    it('should return empty array for page beyond available data', async () => {
      const pagination: PaginationParams = { page: 999, limit: 10 };
      const result = await productService.getAllProducts({}, pagination);

      expect(result.products).toHaveLength(0);
      expect(result.total).toBe(sampleProducts.length);
    });

    it('should combine multiple filters', async () => {
      const filters: ProductFilters = {
        category: 'fruits',
        minPrice: 2.0,
        maxPrice: 10.0,
        inStock: true,
      };
      const result = await productService.getAllProducts(filters);

      result.products.forEach((product) => {
        expect(product.category).toBe('fruits');
        expect(product.price).toBeGreaterThanOrEqual(2.0);
        expect(product.price).toBeLessThanOrEqual(10.0);
        expect(product.inStock).toBe(true);
      });
    });
  });

  describe('getProductById', () => {
    it('should return a product by valid ID', async () => {
      const product = await productService.getProductById('1');

      expect(product).not.toBeNull();
      expect(product?.id).toBe('1');
      expect(product?.name).toBe('Organic Apples');
    });

    it('should return null for non-existent ID', async () => {
      const product = await productService.getProductById('non-existent-id');

      expect(product).toBeNull();
    });

    it('should return correct product data', async () => {
      const product = await productService.getProductById('2');

      expect(product).not.toBeNull();
      expect(product?.id).toBe('2');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('price');
      expect(product).toHaveProperty('description');
      expect(product).toHaveProperty('category');
    });
  });

  describe('createProduct', () => {
    it('should create a new product with all fields', async () => {
      const newProductData = {
        name: 'Test Product',
        price: 9.99,
        description: 'Test description',
        image: 'https://placehold.co/300x200.png',
        dataAiHint: 'test',
        category: 'test-category',
        inStock: true,
      };

      const createdProduct = await productService.createProduct(newProductData);

      expect(createdProduct).toHaveProperty('id');
      expect(createdProduct.name).toBe(newProductData.name);
      expect(createdProduct.price).toBe(newProductData.price);
      expect(createdProduct.description).toBe(newProductData.description);
      expect(createdProduct.category).toBe(newProductData.category);
      expect(createdProduct.inStock).toBe(true);
      expect(createdProduct.createdAt).toEqual(mockDate);
      expect(createdProduct.updatedAt).toEqual(mockDate);
    });

    it('should default inStock to true if not provided', async () => {
      const newProductData = {
        name: 'Test Product',
        price: 9.99,
        description: 'Test description',
        image: 'https://placehold.co/300x200.png',
        dataAiHint: 'test',
      };

      const createdProduct = await productService.createProduct(newProductData);

      expect(createdProduct.inStock).toBe(true);
    });

    it('should generate a unique ID for new product', async () => {
      const newProductData = {
        name: 'Test Product',
        price: 9.99,
        description: 'Test description',
        image: 'https://placehold.co/300x200.png',
        dataAiHint: 'test',
      };

      const product1 = await productService.createProduct(newProductData);
      // Add a small delay to ensure Date.now() returns different values
      await new Promise(resolve => setTimeout(resolve, 10));
      const product2 = await productService.createProduct(newProductData);

      expect(product1.id).not.toBe(product2.id);
    });

    it('should add product to the products list', async () => {
      const initialProducts = await productService.getAllProducts();
      const initialTotal = initialProducts.total;

      const newProductData = {
        name: 'Test Product',
        price: 9.99,
        description: 'Test description',
        image: 'https://placehold.co/300x200.png',
        dataAiHint: 'test',
      };

      await productService.createProduct(newProductData);

      const updatedProducts = await productService.getAllProducts();
      expect(updatedProducts.total).toBe(initialTotal + 1);
    });
  });

  describe('updateProduct', () => {
    it('should update an existing product', async () => {
      const updates = {
        name: 'Updated Product Name',
        price: 19.99,
      };

      const updatedProduct = await productService.updateProduct('1', updates);

      expect(updatedProduct).not.toBeNull();
      expect(updatedProduct?.name).toBe(updates.name);
      expect(updatedProduct?.price).toBe(updates.price);
      expect(updatedProduct?.updatedAt).toEqual(mockDate);
    });

    it('should return null for non-existent product ID', async () => {
      const updates = { name: 'Updated Name' };
      const result = await productService.updateProduct('non-existent-id', updates);

      expect(result).toBeNull();
    });

    it('should preserve unchanged fields', async () => {
      const originalProduct = await productService.getProductById('1');
      const updates = { price: 99.99 };

      const updatedProduct = await productService.updateProduct('1', updates);

      expect(updatedProduct?.name).toBe(originalProduct?.name);
      expect(updatedProduct?.description).toBe(originalProduct?.description);
      expect(updatedProduct?.category).toBe(originalProduct?.category);
      expect(updatedProduct?.price).toBe(99.99);
    });

    it('should update multiple fields at once', async () => {
      const updates = {
        name: 'New Name',
        price: 25.00,
        description: 'New Description',
        inStock: false,
      };

      const updatedProduct = await productService.updateProduct('1', updates);

      expect(updatedProduct?.name).toBe(updates.name);
      expect(updatedProduct?.price).toBe(updates.price);
      expect(updatedProduct?.description).toBe(updates.description);
      expect(updatedProduct?.inStock).toBe(updates.inStock);
    });

    it('should update the updatedAt timestamp', async () => {
      const updates = { name: 'Updated Name' };
      const updatedProduct = await productService.updateProduct('1', updates);

      expect(updatedProduct?.updatedAt).toEqual(mockDate);
    });
  });

  describe('deleteProduct', () => {
    it('should delete an existing product', async () => {
      const result = await productService.deleteProduct('1');

      expect(result).toBe(true);

      const deletedProduct = await productService.getProductById('1');
      expect(deletedProduct).toBeNull();
    });

    it('should return false for non-existent product ID', async () => {
      const result = await productService.deleteProduct('non-existent-id');

      expect(result).toBe(false);
    });

    it('should reduce total product count after deletion', async () => {
      const initialProducts = await productService.getAllProducts();
      const initialTotal = initialProducts.total;

      await productService.deleteProduct('1');

      const updatedProducts = await productService.getAllProducts();
      expect(updatedProducts.total).toBe(initialTotal - 1);
    });

    it('should only delete the specified product', async () => {
      const productToKeep = await productService.getProductById('2');
      
      await productService.deleteProduct('1');

      const remainingProduct = await productService.getProductById('2');
      expect(remainingProduct).toEqual(productToKeep);
    });
  });

  describe('getCategories', () => {
    it('should return an array of unique categories', async () => {
      const categories = await productService.getCategories();

      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBeGreaterThan(0);
      
      // Check uniqueness
      const uniqueCategories = [...new Set(categories)];
      expect(categories.length).toBe(uniqueCategories.length);
    });

    it('should return categories from all products', async () => {
      const categories = await productService.getCategories();
      
      // Based on sampleProducts, we should have categories like 'fruits', 'bakery', etc.
      expect(categories.length).toBeGreaterThan(0);
      categories.forEach((category) => {
        expect(typeof category).toBe('string');
      });
    });

    it('should filter out undefined categories', async () => {
      const categories = await productService.getCategories();
      
      categories.forEach((category) => {
        expect(category).toBeDefined();
        expect(category).not.toBeNull();
      });
    });

    it('should update categories when new product is added', async () => {
      const initialCategories = await productService.getCategories();

      const newProductData = {
        name: 'Test Product',
        price: 9.99,
        description: 'Test description',
        image: 'https://placehold.co/300x200.png',
        dataAiHint: 'test',
        category: 'new-test-category',
      };

      await productService.createProduct(newProductData);

      const updatedCategories = await productService.getCategories();
      expect(updatedCategories).toContain('new-test-category');
      expect(updatedCategories.length).toBeGreaterThanOrEqual(initialCategories.length);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty search term', async () => {
      const filters: ProductFilters = { search: '' };
      const result = await productService.getAllProducts(filters);

      expect(result.total).toBe(sampleProducts.length);
    });

    it('should handle case-insensitive search', async () => {
      const filters1: ProductFilters = { search: 'APPLE' };
      const filters2: ProductFilters = { search: 'apple' };
      const filters3: ProductFilters = { search: 'ApPlE' };

      const result1 = await productService.getAllProducts(filters1);
      const result2 = await productService.getAllProducts(filters2);
      const result3 = await productService.getAllProducts(filters3);

      expect(result1.total).toBe(result2.total);
      expect(result2.total).toBe(result3.total);
    });

    it('should handle pagination with page 1', async () => {
      const pagination: PaginationParams = { page: 1, limit: 5 };
      const result = await productService.getAllProducts({}, pagination);

      expect(result.page).toBe(1);
      expect(result.products.length).toBeLessThanOrEqual(5);
    });

    it('should handle very large limit', async () => {
      const pagination: PaginationParams = { page: 1, limit: 1000 };
      const result = await productService.getAllProducts({}, pagination);

      expect(result.products.length).toBe(sampleProducts.length);
      expect(result.totalPages).toBe(1);
    });

    it('should handle minPrice equal to maxPrice', async () => {
      const filters: ProductFilters = { minPrice: 5.0, maxPrice: 5.0 };
      const result = await productService.getAllProducts(filters);

      result.products.forEach((product) => {
        expect(product.price).toBe(5.0);
      });
    });
  });
});
