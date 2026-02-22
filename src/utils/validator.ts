import { Product, ProductListResponse } from '../types/product.types';
import { expect } from '@playwright/test';

export class ResponseValidator {
  static validateProduct(product: Product) {
    expect(product).toBeDefined();
    expect(product.id).toBeDefined();
    expect(typeof product.id).toBe('string');
    expect(typeof product.name).toBe('string');
    expect(product.name.length).toBeGreaterThan(0);
    expect(typeof product.price).toBe('number');
    expect(product.price).toBeGreaterThan(0);
    expect(typeof product.description).toBe('string');
    expect(product.description.length).toBeGreaterThan(0);
    expect(typeof product.image).toBe('string');
    expect(typeof product.dataAiHint).toBe('string');
  }

  static validateProductList(response: ProductListResponse) {
    expect(response).toBeDefined();
    expect(Array.isArray(response.products)).toBe(true);
    expect(typeof response.total).toBe('number');
    expect(typeof response.page).toBe('number');
    expect(typeof response.limit).toBe('number');
    expect(typeof response.totalPages).toBe('number');
    
    response.products.forEach(product => this.validateProduct(product));
  }

  static validateErrorResponse(error: any, expectedStatus: number) {
    expect(error).toBeDefined();
    expect(error.error || error.message).toBeDefined();
  }

  static validateResponseTime(duration: number, maxTime: number = 2000) {
    expect(duration).toBeLessThan(maxTime);
  }

  static validateHeaders(headers: Record<string, string>) {
    expect(headers['content-type']).toContain('application/json');
  }

  static validatePagination(
    pagination: any,
    expectedPage: number,
    expectedLimit: number
  ) {
    expect(pagination.page).toBe(expectedPage);
    expect(pagination.limit).toBe(expectedLimit);
    expect(pagination.totalPages).toBeGreaterThanOrEqual(1);
  }
}
