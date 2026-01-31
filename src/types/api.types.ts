import { APIResponse } from '@playwright/test';

export interface ApiResponse<T = any> {
  status: number;
  body: T;
  headers: Record<string, string>;
  ok: boolean;
}

export interface ErrorResponse {
  error: string;
  details?: any[];
  message?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  data?: any;
  timeout?: number;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
