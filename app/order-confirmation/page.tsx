import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import OrderConfirmationClient from "@/components/order-confirmation-client";



function OrderConfirmationFallback() {
  return (
    <main className="mx-auto max-w-xl px-5 py-24 text-center md:px-8">
      <Loader2 className="mx-auto h-12 w-12 animate-spin text-bronze" />
      <h1 className="mt-4 font-display text-2xl">Loading order details...</h1>
      <p className="mt-2 text-espresso/60">Please wait while we fetch your order.</p>
    </main>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<OrderConfirmationFallback />}>
      <OrderConfirmationClient />
    </Suspense>
  );
}