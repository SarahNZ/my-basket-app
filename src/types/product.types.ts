export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  dataAiHint: string;
  category?: string;
  inStock?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductRequest {
  name: string;
  price: number;
  description: string;
  image: string;
  dataAiHint: string;
  category?: string;
  inStock?: boolean;
}

export interface UpdateProductRequest {
  name?: string;
  price?: number;
  description?: string;
  image?: string;
  dataAiHint?: string;
  category?: string;
  inStock?: boolean;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ProductListResponse {
  products: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CategoryResponse {
  categories: string[];
}
