import { APIRequestContext, APIResponse } from '@playwright/test';
import { TestLogger } from './logger';
import { RequestOptions } from '../types/api.types';

export class ApiHelper {
  static async makeRequest(
    request: APIRequestContext,
    method: string,
    url: string,
    options?: RequestOptions
  ): Promise<APIResponse> {
    const startTime = Date.now();
    
    TestLogger.logRequest(method, url, options?.data);
    
    let response: APIResponse;
    
    try {
      switch (method.toUpperCase()) {
        case 'GET':
          response = await request.get(url, {
            headers: options?.headers,
            params: options?.params,
            timeout: options?.timeout,
          });
          break;
        case 'POST':
          response = await request.post(url, {
            headers: options?.headers,
            data: options?.data,
            timeout: options?.timeout,
          });
          break;
        case 'PUT':
          response = await request.put(url, {
            headers: options?.headers,
            data: options?.data,
            timeout: options?.timeout,
          });
          break;
        case 'DELETE':
          response = await request.delete(url, {
            headers: options?.headers,
            timeout: options?.timeout,
          });
          break;
        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }
      
      const duration = Date.now() - startTime;
      const body = await this.getResponseBody(response);
      
      TestLogger.logResponse(method, url, response.status(), body);
      TestLogger.debug(`Response time: ${duration}ms`);
      
      return response;
    } catch (error) {
      TestLogger.error(`API request failed: ${method} ${url}`, error);
      throw error;
    }
  }

  static async getResponseBody(response: APIResponse): Promise<any> {
    try {
      const text = await response.text();
      return text ? JSON.parse(text) : null;
    } catch {
      return null;
    }
  }

  static buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    return searchParams.toString();
  }

  static async waitForCondition(
    condition: () => Promise<boolean>,
    timeout: number = 10000,
    interval: number = 500
  ): Promise<void> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      if (await condition()) {
        return;
      }
      await new Promise(resolve => setTimeout(resolve, interval));
    }
    
    throw new Error(`Condition not met within ${timeout}ms`);
  }
}
