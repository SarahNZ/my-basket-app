import { APIRequestContext, APIResponse } from '@playwright/test';
import { BasePage } from './base/BasePage';
import {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  ProductListResponse,
  ProductFilters,
  PaginationParams,
  CategoryResponse,
} from '../types/product.types';
import { config } from '../config/environments';

export class ProductPage extends BasePage {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async getAllProducts(
    filters?: ProductFilters,
    pagination?: PaginationParams
  ): Promise<{ response: APIResponse; body: ProductListResponse }> {
    const params: Record<string, any> = {
      ...filters,
      ...pagination,
    };

    const queryString = this.buildQueryString(params);
    const endpoint = `${config.productsEndpoint}${queryString ? `?${queryString}` : ''}`;
    
    const response = await this.get(endpoint);
    const body = await this.getResponseBody<ProductListResponse>(response);
    
    return { response, body };
  }

  async getProductById(id: string): Promise<{ response: APIResponse; body: Product }> {
    const response = await this.get(`${config.productsEndpoint}/${id}`);
    const body = await this.getResponseBody<Product>(response);
    
    return { response, body };
  }

  async createProduct(
    productData: CreateProductRequest
  ): Promise<{ response: APIResponse; body: Product }> {
    const response = await this.post(config.productsEndpoint, productData);
    const body = await this.getResponseBody<Product>(response);
    
    return { response, body };
  }

  async updateProduct(
    id: string,
    updates: UpdateProductRequest
  ): Promise<{ response: APIResponse; body: Product }> {
    const response = await this.put(`${config.productsEndpoint}/${id}`, updates);
    const body = await this.getResponseBody<Product>(response);
    
    return { response, body };
  }

  async deleteProduct(id: string): Promise<APIResponse> {
    return this.delete(`${config.productsEndpoint}/${id}`);
  }

  async getCategories(): Promise<{ response: APIResponse; body: CategoryResponse }> {
    const response = await this.get(config.categoriesEndpoint);
    const body = await this.getResponseBody<CategoryResponse>(response);
    
    return { response, body };
  }

  async searchProducts(searchTerm: string): Promise<{ response: APIResponse; body: ProductListResponse }> {
    return this.getAllProducts({ search: searchTerm });
  }

  async filterByCategory(category: string): Promise<{ response: APIResponse; body: ProductListResponse }> {
    return this.getAllProducts({ category });
  }

  async filterByPriceRange(
    minPrice: number,
    maxPrice: number
  ): Promise<{ response: APIResponse; body: ProductListResponse }> {
    return this.getAllProducts({ minPrice, maxPrice });
  }

  async filterByStock(inStock: boolean): Promise<{ response: APIResponse; body: ProductListResponse }> {
    return this.getAllProducts({ inStock });
  }

  async getProductsWithPagination(
    page: number,
    limit: number
  ): Promise<{ response: APIResponse; body: ProductListResponse }> {
    return this.getAllProducts({}, { page, limit });
  }
}
