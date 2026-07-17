"use client";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store";
import { useProductsStore } from "@/lib/products-store";
import { formatNaira } from "@/lib/utils";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import Link from "next/link";

export function CartDrawer() {
  const { lines, isOpen, close, updateQuantity } = useCartStore();
  const { products } = useProductsStore();

  const items = lines
    .map((line) => {
      const product = products.find((p) => p.id === line.productId);
      return product ? { line, product } : null;
    })
    .filter(Boolean) as { line: typeof lines[number]; product: (typeof products)[number] }[];

  const subtotal = items.reduce((sum, { line, product }) => sum + product.price * line.quantity, 0);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && close()}>
      <SheetContent>
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h2 className="font-display text-lg">Your Bag ({items.length})</h2>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <ShoppingBag className="h-10 w-10 text-espresso/30" />
            <p className="text-sm text-espresso/60">Your bag is empty. Add something you'll love.</p>
            <Button variant="outline" size="sm" onClick={close} asChild>
              <Link href="/shop">Browse products</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <ul className="space-y-5">
                {items.map(({ line, product }) => (
                  <li key={`${line.productId}-${line.swatch}`} className="flex gap-4">
                    <div
                      className="h-20 w-16 shrink-0 rounded-sm"
                      style={{
                        background:
                          product.swatches.find((s) => s.name === line.swatch)?.hex ?? "#B8863B",
                      }}
                    />
                    <div className="flex flex-1 flex-col">
                      <p className="text-sm font-semibold">{product.name}</p>
                      <p className="text-xs text-espresso/50">{line.swatch}</p>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-2 rounded-sm border border-border">
                          <button
                            className="p-1.5"
                            aria-label="Decrease quantity"
                            onClick={() => updateQuantity(line.productId, line.swatch, line.quantity - 1)}
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-4 text-center text-sm">{line.quantity}</span>
                          <button
                            className="p-1.5"
                            aria-label="Increase quantity"
                            onClick={() => updateQuantity(line.productId, line.swatch, line.quantity + 1)}
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <span className="text-sm font-semibold">
                          {formatNaira(product.price * line.quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-border px-6 py-5">
              <div className="flex items-center justify-between text-sm text-espresso/60">
                <span>Subtotal</span>
                <span className="text-base font-semibold text-espresso">{formatNaira(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-espresso/40">Shipping and delivery calculated at checkout.</p>
              <Button variant="bronze" size="lg" className="mt-4 w-full" onClick={close} asChild>
                <Link href="/checkout">Checkout</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}