import { APIRequestContext, APIResponse } from '@playwright/test';
import { ApiHelper } from '../../utils/apiHelper';
import { TestLogger } from '../../utils/logger';
import { RequestOptions } from '../../types/api.types';
import { getEnvironment } from '../../config/environments';

export class BasePage {
  protected request: APIRequestContext;
  protected baseURL: string;

  constructor(request: APIRequestContext) {
    this.request = request;
    this.baseURL = getEnvironment().baseURL;
  }

  protected async get(endpoint: string, options?: RequestOptions): Promise<APIResponse> {
    const url = `${this.baseURL}${endpoint}`;
    return ApiHelper.makeRequest(this.request, 'GET', url, options);
  }

  protected async post(
    endpoint: string,
    data: any,
    options?: RequestOptions
  ): Promise<APIResponse> {
    const url = `${this.baseURL}${endpoint}`;
    return ApiHelper.makeRequest(this.request, 'POST', url, { ...options, data });
  }

  protected async put(
    endpoint: string,
    data: any,
    options?: RequestOptions
  ): Promise<APIResponse> {
    const url = `${this.baseURL}${endpoint}`;
    return ApiHelper.makeRequest(this.request, 'PUT', url, { ...options, data });
  }

  protected async delete(endpoint: string, options?: RequestOptions): Promise<APIResponse> {
    const url = `${this.baseURL}${endpoint}`;
    return ApiHelper.makeRequest(this.request, 'DELETE', url, options);
  }

  protected async getResponseBody<T>(response: APIResponse): Promise<T> {
    return ApiHelper.getResponseBody(response);
  }

  protected buildQueryString(params: Record<string, any>): string {
    return ApiHelper.buildQueryString(params);
  }

  async verifyHealthCheck(): Promise<boolean> {
    try {
      const response = await this.get('/api/health');
      return response.status() === 200;
    } catch (error) {
      TestLogger.error('Health check failed', error);
      return false;
    }
  }
}
