import { CreateProductRequest } from '../types/product.types';

export class DataGenerator {
  static randomString(length: number = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }

  static randomNumber(min: number = 1, max: number = 100): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static randomPrice(min: number = 1, max: number = 100): number {
    return parseFloat((Math.random() * (max - min) + min).toFixed(2));
  }

  static randomBoolean(): boolean {
    return Math.random() < 0.5;
  }

  static randomEmail(): string {
    return `test${this.randomString(5)}@example.com`;
  }

  static randomUrl(): string {
    return `https://placehold.co/300x200.png?text=${this.randomString(5)}`;
  }

  static generateProductData(override?: Partial<CreateProductRequest>): CreateProductRequest {
    const categories = ['fruits', 'vegetables', 'dairy', 'bakery', 'meat', 'snacks'];
    
    return {
      name: `Test Product ${this.randomString(5)}`,
      price: this.randomPrice(0.99, 99.99),
      description: `Test description for product ${this.randomString(8)}`,
      image: this.randomUrl(),
      dataAiHint: `test ${this.randomString(6)}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      inStock: this.randomBoolean(),
      ...override,
    };
  }

  static generateMultipleProducts(count: number): CreateProductRequest[] {
    return Array.from({ length: count }, () => this.generateProductData());
  }

  static generateInvalidProductData(): Partial<CreateProductRequest> {
    return {
      name: '',
      price: -10,
      description: '',
    };
  }

  static generateLargePayload(): CreateProductRequest {
    return {
      name: 'A'.repeat(5000),
      price: this.randomPrice(),
      description: 'B'.repeat(10000),
      image: this.randomUrl(),
      dataAiHint: 'C'.repeat(5000),
    };
  }
}
