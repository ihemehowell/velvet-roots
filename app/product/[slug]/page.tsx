"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import { fetchProductBySlug } from "@/lib/api";
import { useProductsStore, getRelated } from "@/lib/products-store";
import { Product } from "@/lib/types";
import { formatNaira, cn } from "@/lib/utils";
import { ShadeSwatch } from "@/components/shade-swatch";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, Star, Truck, ShieldCheck } from "lucide-react";
import { useCartStore } from "@/lib/store";

const gradients: Record<string, string> = {
  hair: "from-[#3B2418] via-[#6B3A28] to-[#B8863B]",
  cosmetics: "from-[#7A2333] via-[#9A4A4A] to-[#D4A65E]",
};

export default function ProductPage() {
  const params = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null | undefined>(undefined);
  const [selected, setSelected] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const addLine = useCartStore((s) => s.addLine);
  const { products: allProducts, load } = useProductsStore();

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    let cancelled = false;
    setProduct(undefined);
    fetchProductBySlug(params.slug).then((p) => {
      if (!cancelled) {
        setProduct(p);
        setSelected(p?.swatches[0]?.name ?? null);
        setQty(1);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [params.slug]);

  if (product === undefined) {
    return <main className="mx-auto max-w-7xl px-5 py-24 text-center md:px-8 text-espresso/60">Loading…</main>;
  }
  if (product === null) return notFound();

  const related = getRelated(product, allProducts);

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 md:px-8">
      <div className="grid gap-12 md:grid-cols-2">
        <div
          className={cn(
            "aspect-square w-full rounded-lg bg-gradient-to-br",
            gradients[product.category]
          )}
        />

        <div>
          {product.badge && (
            <Badge variant={product.badge === "Low Stock" ? "berry" : "bronze"} className="mb-3">
              {product.badge}
            </Badge>
          )}
          <p className="eyebrow">{product.subcategory}</p>
          <h1 className="mt-2 font-display text-3xl">{product.name}</h1>

          <div className="mt-2 flex items-center gap-1.5 text-sm text-espresso/60">
            <Star className="h-4 w-4 fill-bronze text-bronze" />
            {product.rating} · {product.reviewCount} reviews
          </div>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-semibold">{formatNaira(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-espresso/40 line-through">{formatNaira(product.compareAtPrice)}</span>
            )}
          </div>

          <p className="mt-5 text-espresso/70">{product.description}</p>

          {selected && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-semibold">
                Shade: <span className="font-normal text-espresso/60">{selected}</span>
              </p>
              <ShadeSwatch swatches={product.swatches} selected={selected} onSelect={setSelected} />
            </div>
          )}

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center gap-3 rounded-sm border border-border px-3 py-2">
              <button aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-4 text-center">{qty}</span>
              <button aria-label="Increase quantity" onClick={() => setQty((q) => q + 1)}>
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Button
              variant="bronze"
              size="lg"
              className="flex-1"
              disabled={!selected}
              onClick={() => selected && addLine(product.id, selected, qty)}
            >
              Add to Bag — {formatNaira(product.price * qty)}
            </Button>
          </div>

          <ul className="mt-8 space-y-2 border-t border-border pt-6 text-sm text-espresso/70">
            {product.details.map((d) => (
              <li key={d} className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-bronze" />
                {d}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-col gap-2 text-sm text-espresso/60">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4" /> Delivery across Nigeria, 2–5 business days
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" /> Store pickup or bank transfer
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-6 font-display text-2xl">You may also like</h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}