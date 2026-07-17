"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/lib/store";
import { useProductsStore } from "@/lib/products-store";
import { useOrderCreation } from "@/lib/order-loader"; // Import the new hook
import { formatNaira, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShippingInfo, Order } from "@/lib/types";
import { Store, Banknote } from "lucide-react";

// ...existing code...

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, clear } = useCartStore(); // Use clear instead of setOrder
  const { products } = useProductsStore();
  const { creating, error: createError, createOrder } = useOrderCreation(); // Use the new hook
  const [shipping, setShipping] = useState<ShippingInfo>(initialShipping);
  const [paymentMethod, setPaymentMethod] = useState<Order["paymentMethod"]>("Store Pickup");

  // ...existing code...

  const canSubmit =
    items.length > 0 &&
    shipping.fullName &&
    shipping.phone &&
    shipping.address &&
    shipping.city &&
    shipping.state &&
    !creating; // Use creating from the hook

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    try {
      const response = await createOrder({
        items: lines.map((l) => ({ productId: l.productId, swatch: l.swatch, quantity: l.quantity })),
        shipping,
        paymentMethod,
      });
      clear(); // Clear the cart after successful order
      router.push(`/order-confirmation?orderId=${response.id}`); // Pass orderId as query param
    } catch (err) {
      // Error handling is now inside the hook
    } finally {
      // Submitting state is managed by the hook
    }
  };

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-xl px-5 py-24 text-center md:px-8">
        <h1 className="font-display text-2xl">Your bag is empty</h1>
        <p className="mt-2 text-espresso/60">Add a few products before checking out.</p>
        <Button variant="bronze" className="mt-6" asChild>
          <Link href="/shop">Browse products</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-12 md:px-8">
      <h1 className="mb-8 font-display text-3xl">Checkout</h1>
      <form onSubmit={handleSubmit} className="grid gap-12 md:grid-cols-[1.3fr_1fr]">
        <div className="space-y-8">
          <section>
            <h2 className="mb-4 font-display text-lg">Shipping details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input id="fullName" required className="mt-1.5" value={shipping.fullName} onChange={update("fullName")} />
              </div>
              <div>
                <Label htmlFor="phone">Phone number</Label>
                <Input id="phone" required className="mt-1.5" value={shipping.phone} onChange={update("phone")} />
              </div>
              <div>
                <Label htmlFor="email">Email (optional)</Label>
                <Input id="email" type="email" className="mt-1.5" value={shipping.email} onChange={update("email")} />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="address">Delivery address</Label>
                <Input id="address" required className="mt-1.5" value={shipping.address} onChange={update("address")} />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" required className="mt-1.5" value={shipping.city} onChange={update("city")} />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input id="state" required className="mt-1.5" value={shipping.state} onChange={update("state")} />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="note">Delivery note (optional)</Label>
                <Input id="note" className="mt-1.5" value={shipping.note} onChange={update("note")} />
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-4 font-display text-lg">Payment method</h2>
            <p className="mb-3 text-sm text-espresso/60">
              Online payment isn't set up yet — choose how you'd like to complete this order for now.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {(["Store Pickup", "Bank Transfer"] as const).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={cn(
                    "flex items-center gap-3 rounded-md border px-4 py-4 text-left text-sm font-medium transition-colors",
                    paymentMethod === method
                      ? "border-espresso bg-espresso text-ivory"
                      : "border-border text-espresso/70 hover:border-espresso"
                  )}
                >
                  {method === "Store Pickup" ? <Store className="h-5 w-5" /> : <Banknote className="h-5 w-5" />}
                  {method}
                </button>
              ))}
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-md border border-border p-6">
          <h2 className="mb-4 font-display text-lg">Order summary</h2>
          <ul className="space-y-3">
            {items.map(({ line, product }) => (
              <li key={`${line.productId}-${line.swatch}`} className="flex justify-between text-sm">
                <span className="text-espresso/70">
                  {product.name} · {line.swatch} × {line.quantity}
                </span>
                <span className="font-medium">{formatNaira(product.price * line.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-border pt-4 text-base font-semibold">
            <span>Subtotal</span>
            <span>{formatNaira(subtotal)}</span>
          </div>
          <p className="mt-1 text-xs text-espresso/40">Delivery fees confirmed by our team after order placement.</p>
          {createError && <p className="mt-3 text-sm text-berry">{createError}</p>}
          <Button type="submit" variant="bronze" size="lg" className="mt-6 w-full" disabled={!canSubmit}>
            {creating ? "Placing order…" : "Place order"}
          </Button>
        </aside>
      </form>
    </main>
  );
}