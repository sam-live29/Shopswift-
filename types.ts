
export interface Product {
  id: string;
  name: string;
  category: string;
  subCategory: string; // Added for better navigation and grouping
  price: number;
  oldPrice?: number;
  discount?: string;
  rating: number;
  reviewsCount: number;
  image: string;
  description: string;
  brand: string;
  specifications: Record<string, string>;
  isAssured?: boolean;
  stock: number; // Added to support availability status
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface User {
  name: string;
  email: string;
  address: string;
  orders: Order[];
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
}
