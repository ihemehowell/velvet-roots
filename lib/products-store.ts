"use client";

import { create } from "zustand";
import { Product } from "./types";
import { fetchProducts } from "./api";

interface ProductsState {
  products: Product[];
  status: "idle" | "loading" | "loaded" | "error";
  error: string | null;
  load: () => Promise<void>;
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  status: "idle",
  error: null,
  load: async () => {
    if (get().status === "loading" || get().status === "loaded") return;
    set({ status: "loading", error: null });
    try {
      const products = await fetchProducts();
      set({ products, status: "loaded" });
    } catch (err) {
      set({ status: "error", error: err instanceof Error ? err.message : "Failed to load products" });
    }
  },
}));

export function getRelated(product: Product, all: Product[], count = 4) {
  return all.filter((p) => p.category === product.category && p.id !== product.id).slice(0, count);
}