import { Suspense } from "react";
import { ShopContent } from "./shop-content";

export default function ShopPage() {
  return (
    <Suspense fallback={null}>
      <ShopContent />
    </Suspense>
  );
}
