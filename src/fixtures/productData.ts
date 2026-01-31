import { CreateProductRequest } from '../types/product.types';

export const validProductData: CreateProductRequest = {
  name: 'Test Organic Bananas',
  price: 2.99,
  description: 'Fresh organic bananas, perfect for snacking',
  image: 'https://placehold.co/300x200.png',
  dataAiHint: 'fruit organic banana',
  category: 'fruits',
  inStock: true,
};

export const testProducts: CreateProductRequest[] = [
  {
    name: 'Test Apples',
    price: 3.99,
    description: 'Crisp red apples',
    image: 'https://placehold.co/300x200.png',
    dataAiHint: 'fruit apple',
    category: 'fruits',
    inStock: true,
  },
  {
    name: 'Test Bread',
    price: 4.49,
    description: 'Whole wheat bread',
    image: 'https://placehold.co/300x200.png',
    dataAiHint: 'bread bakery',
    category: 'bakery',
    inStock: true,
  },
  {
    name: 'Test Milk',
    price: 3.29,
    description: 'Fresh whole milk',
    image: 'https://placehold.co/300x200.png',
    dataAiHint: 'dairy milk',
    category: 'dairy',
    inStock: false,
  },
];

export const invalidProductData = {
  missingName: {
    price: 5.99,
    description: 'Product without name',
    image: 'https://placehold.co/300x200.png',
    dataAiHint: 'test',
  },
  missingPrice: {
    name: 'Product without price',
    description: 'Description here',
    image: 'https://placehold.co/300x200.png',
    dataAiHint: 'test',
  },
  invalidPrice: {
    name: 'Invalid price product',
    price: -10,
    description: 'Negative price',
    image: 'https://placehold.co/300x200.png',
    dataAiHint: 'test',
  },
  emptyStrings: {
    name: '',
    price: 1.99,
    description: '',
    image: '',
    dataAiHint: '',
  },
};

export const boundaryTestData = {
  minPrice: {
    name: 'Minimum price product',
    price: 0.01,
    description: 'Test minimum price',
    image: 'https://placehold.co/300x200.png',
    dataAiHint: 'test',
  },
  maxPrice: {
    name: 'Maximum price product',
    price: 9999.99,
    description: 'Test maximum price',
    image: 'https://placehold.co/300x200.png',
    dataAiHint: 'test',
  },
  longName: {
    name: 'A'.repeat(500),
    price: 5.99,
    description: 'Test long name',
    image: 'https://placehold.co/300x200.png',
    dataAiHint: 'test',
  },
};
