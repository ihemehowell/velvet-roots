export interface Swatch {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: "hair" | "cosmetics";
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

export interface OrderItemInput {
  productId: string;
  swatch: string;
  quantity: number;
}

export interface CreateOrderInput {
  items: OrderItemInput[];
  shipping: {
    fullName: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    state: string;
    note?: string;
  };
  paymentMethod: "Pay on Delivery" | "Bank Transfer";
}