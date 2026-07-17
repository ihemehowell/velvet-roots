import { Category, Product, ShippingInfo } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed with status ${res.status}`);
  }
  return res.json();
}

export function fetchProducts(category?: Category): Promise<Product[]> {
  const url = new URL("/api/products", API_URL);
  if (category) url.searchParams.set("category", category);
  return fetch(url.toString()).then((res) => handle<Product[]>(res));
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const res = await fetch(`${API_URL}/api/products/${slug}`);
  if (res.status === 404) return null;
  return handle<Product>(res);
}

export interface CreateOrderPayload {
  items: { productId: string; swatch: string; quantity: number }[];
  shipping: ShippingInfo;
  paymentMethod: "Store Pickup" | "Bank Transfer";
}

export interface CreateOrderResponse {
  id: string;
  subtotal: number;
  paymentMethod: "Store Pickup" | "Bank Transfer";
  shipping: ShippingInfo;
}

export function createOrder(payload: CreateOrderPayload): Promise<CreateOrderResponse> {
  return fetch(`${API_URL}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then((res) => handle<CreateOrderResponse>(res));
}