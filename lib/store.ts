"use client";

import { create } from "zustand";
import { CartLine, Order, ShippingInfo } from "./types";

interface CartState {
  lines: CartLine[];
  isOpen: boolean;
  lastOrder: Order | null;
  open: () => void;
  close: () => void;
  addLine: (productId: string, swatch: string, quantity?: number) => void;
  removeLine: (productId: string, swatch: string) => void;
  updateQuantity: (productId: string, swatch: string, quantity: number) => void;
  clear: () => void;
  placeOrder: (shipping: ShippingInfo, paymentMethod: Order["paymentMethod"], subtotal: number) => Order;
}

export const useCartStore = create<CartState>((set, get) => ({
  lines: [],
  isOpen: false,
  lastOrder: null,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  addLine: (productId, swatch, quantity = 1) =>
    set((state) => {
      const existing = state.lines.find((l) => l.productId === productId && l.swatch === swatch);
      if (existing) {
        return {
          lines: state.lines.map((l) =>
            l.productId === productId && l.swatch === swatch ? { ...l, quantity: l.quantity + quantity } : l
          ),
          isOpen: true,
        };
      }
      return { lines: [...state.lines, { productId, swatch, quantity }], isOpen: true };
    }),
  removeLine: (productId, swatch) =>
    set((state) => ({
      lines: state.lines.filter((l) => !(l.productId === productId && l.swatch === swatch)),
    })),
  updateQuantity: (productId, swatch, quantity) =>
    set((state) => ({
      lines: state.lines
        .map((l) => (l.productId === productId && l.swatch === swatch ? { ...l, quantity } : l))
        .filter((l) => l.quantity > 0),
    })),
  clear: () => set({ lines: [] }),
  placeOrder: (shipping, paymentMethod, subtotal) => {
    const order: Order = {
      id: `VR-${Date.now().toString(36).toUpperCase()}`,
      lines: get().lines,
      shipping,
      paymentMethod,
      subtotal,
      createdAt: new Date().toISOString(),
    };
    set({ lastOrder: order, lines: [] });
    return order;
  },
}));
