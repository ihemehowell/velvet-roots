"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartLine, Order } from "./types";

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
  setOrder: (order: Order) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
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
      setOrder: (order) => set({ lastOrder: order, lines: [] }),
    }),
    {
      name: "velvet-roots-cart",
      storage: createJSONStorage(() => localStorage),
      // Rehydrate manually (see CartHydrator) instead of on store creation,
      // so the very first client render matches the server-rendered HTML —
      // avoids a hydration mismatch on the cart count badge in the header.
      skipHydration: true,
      // isOpen shouldn't survive a refresh (drawer popping open unprompted
      // on load is jarring); lines and lastOrder are the things worth keeping.
      partialize: (state) => ({ lines: state.lines, lastOrder: state.lastOrder }),
    }
  )
);