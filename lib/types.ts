export type Category = "hair" | "cosmetics";

export interface Swatch {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  subcategory: string;
  price: number;
  compareAtPrice?: number;
  description: string;
  details: string[];
  swatches: Swatch[];
  badge?: "New" | "Bestseller" | "Low Stock";
  rating: number;
  reviewCount: number;
}

export interface CartLine {
  productId: string;
  swatch: string;
  quantity: number;
}

export interface ShippingInfo {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  note?: string;
}

export interface Order {
  id: string;
  lines: CartLine[];
  shipping: ShippingInfo;
  paymentMethod: "Pay on Delivery" | "Bank Transfer";
  subtotal: number;
  createdAt: string;
}
