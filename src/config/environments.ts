export interface EnvironmentConfig {
  baseURL: string;
  timeout: number;
  retries: number;
}

export const environments: Record<string, EnvironmentConfig> = {
  dev: {
    baseURL: process.env.BASE_URL || 'http://localhost:3001',
    timeout: 30000,
    retries: 1,
  },
  staging: {
    baseURL: process.env.STAGING_URL || 'http://staging-api.mybasket.com',
    timeout: 60000,
    retries: 2,
  },
  prod: {
    baseURL: process.env.PROD_URL || 'http://api.mybasket.com',
    timeout: 60000,
    retries: 3,
  },
};

export function getEnvironment(): EnvironmentConfig {
  const env = process.env.ENVIRONMENT || 'dev';
  return environments[env] || environments.dev;
}

export const config = {
  apiBasePath: '/api',
  productsEndpoint: '/api/products',
  categoriesEndpoint: '/api/categories',
  healthEndpoint: '/api/health',
};
