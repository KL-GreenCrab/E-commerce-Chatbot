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

export interface CartItem {
  id: number;
  productId: number;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  image: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  password?: string;
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

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'processing' | 'completed' | 'cancelled';
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
  };
  paymentMethod: 'credit_card' | 'bank_transfer' | 'cash_on_delivery';
  createdAt: string;
}