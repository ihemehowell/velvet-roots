"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useOrderLoader } from "@/lib/order-loader";
import { formatNaira } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { order, loading, error, loadOrder } = useOrderLoader();

  useEffect(() => {
    if (orderId) {
      loadOrder(orderId);
    }
  }, [orderId, loadOrder]);

  if (loading) {
    return (
      <main className="mx-auto max-w-xl px-5 py-24 text-center md:px-8">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-bronze" />
        <h1 className="mt-4 font-display text-2xl">Loading order details...</h1>
        <p className="mt-2 text-espresso/60">Please wait while we fetch your order.</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-xl px-5 py-24 text-center md:px-8">
        <h1 className="font-display text-2xl">Error loading order</h1>
        <p className="mt-2 text-espresso/60">{error}</p>
        <Button variant="bronze" className="mt-6" asChild>
          <Link href="/shop">Browse products</Link>
        </Button>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="mx-auto max-w-xl px-5 py-24 text-center md:px-8">
        <h1 className="font-display text-2xl">No order found</h1>
        <p className="mt-2 text-espresso/60">The order could not be found or may have been removed.</p>
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
          {order.items?.map((item) => (
            <li key={`${item.productId}-${item.swatch}`} className="flex justify-between text-sm">
              <span className="text-espresso/70">
                {item.productName} · {item.swatch} × {item.quantity}
              </span>
              <span className="font-medium">
                {formatNaira((item as any).unitPrice * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
        
        {order.calculated && (
          <div className="mt-4 space-y-2 border-t border-border pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-espresso/70">Subtotal</span>
              <span>{order.formatted?.subtotal || formatNaira(order.calculated.subtotal)}</span>
            </div>
            {order.calculated.tax > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-espresso/70">Tax ({(order.calculated.taxRate * 100).toFixed(0)}%)</span>
                <span>{order.formatted?.tax || formatNaira(order.calculated.tax)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
              <span>Total</span>
              <span>{order.formatted?.total || formatNaira(order.calculated.total)}</span>
            </div>
          </div>
        )}

        <div className="mt-6 grid gap-1 text-sm text-espresso/70">
          <p className="font-semibold text-espresso">Deliver to</p>
          <p>{order.shipping.fullName}</p>
          <p>{order.shipping.address}, {order.shipping.city}, {order.shipping.state}</p>
          <p className="mt-2 font-semibold text-espresso">Payment method</p>
          <p>{order.paymentMethod}</p>
          {order.formatted?.createdAt && (
            <p className="mt-2 text-xs text-espresso/40">Order placed on {order.formatted.createdAt}</p>
          )}
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
