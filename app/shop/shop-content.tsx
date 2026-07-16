"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

const filters: { label: string; value: Category | "all" }[] = [
  { label: "All Products", value: "all" },
  { label: "Hair", value: "hair" },
  { label: "Cosmetics", value: "cosmetics" },
];

export function ShopContent() {
  const searchParams = useSearchParams();
  const initial = (searchParams.get("category") as Category | null) ?? "all";
  const [active, setActive] = useState<Category | "all">(initial);

  const filtered = useMemo(
    () => (active === "all" ? products : products.filter((p) => p.category === active)),
    [active]
  );

  return (
    <main className="mx-auto max-w-7xl px-5 py-12 md:px-8">
      <div className="mb-10">
        <p className="eyebrow">Catalog</p>
        <h1 className="mt-2 font-display text-3xl md:text-4xl">All Products</h1>
      </div>

      <div className="mb-8 flex gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setActive(f.value)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              active === f.value
                ? "border-espresso bg-espresso text-ivory"
                : "border-border text-espresso/70 hover:border-espresso"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-espresso/60">No products found in this category yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
