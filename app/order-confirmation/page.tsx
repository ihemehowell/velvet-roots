"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/store";
import { products } from "@/lib/products";
import { formatNaira } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function OrderConfirmationPage() {
  const order = useCartStore((s) => s.lastOrder);

  if (!order) {
    return (
      <main className="mx-auto max-w-xl px-5 py-24 text-center md:px-8">
        <h1 className="font-display text-2xl">No recent order found</h1>
        <p className="mt-2 text-espresso/60">Place an order to see your confirmation here.</p>
        <Button variant="bronze" className="mt-6" asChild>
          <Link href="/shop">Browse products</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-5 py-16 md:px-8">
      <div className="text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-bronze" />
        <h1 className="mt-4 font-display text-3xl">Order placed</h1>
        <p className="mt-2 text-espresso/60">
          Order <span className="font-semibold text-espresso">{order.id}</span> — we'll reach out at{" "}
          {order.shipping.phone} to confirm delivery.
        </p>
      </div>

      <div className="mt-10 rounded-md border border-border p-6">
        <h2 className="mb-4 font-display text-lg">Order details</h2>
        <ul className="space-y-3">
          {order.lines.map((line) => {
            const product = products.find((p) => p.id === line.productId);
            if (!product) return null;
            return (
              <li key={`${line.productId}-${line.swatch}`} className="flex justify-between text-sm">
                <span className="text-espresso/70">
                  {product.name} · {line.swatch} × {line.quantity}
                </span>
                <span className="font-medium">{formatNaira(product.price * line.quantity)}</span>
              </li>
            );
          })}
        </ul>
        <div className="mt-4 flex justify-between border-t border-border pt-4 text-base font-semibold">
          <span>Subtotal</span>
          <span>{formatNaira(order.subtotal)}</span>
        </div>

        <div className="mt-6 grid gap-1 text-sm text-espresso/70">
          <p className="font-semibold text-espresso">Deliver to</p>
          <p>{order.shipping.fullName}</p>
          <p>{order.shipping.address}, {order.shipping.city}, {order.shipping.state}</p>
          <p className="mt-2 font-semibold text-espresso">Payment method</p>
          <p>{order.paymentMethod}</p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Button variant="outline" asChild>
          <Link href="/shop">Continue shopping</Link>
        </Button>
      </div>
    </main>
  );
}
