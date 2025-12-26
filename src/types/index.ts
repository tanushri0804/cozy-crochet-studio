export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  images: string[];
  description: string;
  careInstructions: string;
  tag?: 'Bestseller' | 'New' | 'Popular' | 'Sale';
  inStock: boolean;
}

export type ProductCategory = 
  | 'bouquets'
  | 'scarves'
  | 'keyrings'
  | 'plushies'
  | 'gifts'
  | 'custom';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  addresses: Address[];
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  address: Address;
  subtotal: number;
  discount: number;
  couponCode?: string;
  shipping: number;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount?: number;
  maxUses?: number;
  usedCount: number;
  expiresAt?: string;
  isActive: boolean;
}

export type SortOption = 'newest' | 'price-low' | 'price-high' | 'popularity';
