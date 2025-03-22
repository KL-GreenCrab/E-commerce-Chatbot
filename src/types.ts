export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  rating: number;
  reviews: number;
  category: string;
  stock: number;
  description?: string;
  specifications?: Record<string, string>;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
}

export interface SearchFilters {
  priceRange: [number, number];
  brands: string[];
  categories: string[];
  rating: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
}