export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  description: string;
  shortDescription?: string;
  category: string;
  gender: string;
  colors: ColorOption[];
  sizes: number[];
  images: string[];
  modelPath?: string;
  rating: number;
  reviewCount: number;
  badge?: string;
  stock: number;
  materials?: string[];
  technology?: string[];
  fit?: string;
  features?: string[];
}

export interface ColorOption {
  name: string;
  hex: string;
  images?: string[];
}

export interface CartItem {
  product: Product;
  size: number;
  color: string;
  quantity: number;
}

export interface WishlistItem {
  productId: string;
  addedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  addresses: Address[];
  createdAt: Date;
}

export interface Address {
  id: string;
  label: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  shippingAddress: Address;
  createdAt: Date;
  tracking?: OrderTracking;
}

export interface OrderItem {
  product: Product;
  size: number;
  color: string;
  quantity: number;
  price: number;
}

export type OrderStatus = 
  | 'placed' 
  | 'confirmed' 
  | 'packed' 
  | 'shipped' 
  | 'out_for_delivery' 
  | 'delivered';

export interface OrderTracking {
  status: OrderStatus;
  timeline: TrackingEvent[];
}

export interface TrackingEvent {
  status: OrderStatus;
  date: Date;
  location?: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  productId: string;
  rating: number;
  title: string;
  comment: string;
  isVerified: boolean;
  createdAt: Date;
  helpful: number;
}

export interface FilterState {
  category: string[];
  gender: string[];
  size: number[];
  color: string[];
  priceRange: [number, number];
  availability: 'all' | 'in-stock' | 'out-of-stock';
  sortBy: SortOption;
}

export type SortOption = 
  | 'featured' 
  | 'newest' 
  | 'best-selling' 
  | 'price-low' 
  | 'price-high';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

export interface SearchResult {
  products: Product[];
  recentSearches: string[];
  popularSearches: string[];
}

export interface Newsletter {
  email: string;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}
