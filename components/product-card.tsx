"use client";

import Link from "next/link";
import { useState } from "react";
import { Product } from "@/lib/types";
import { formatNaira, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ShadeSwatch } from "@/components/shade-swatch";
import { Plus, Star } from "lucide-react";
import { useCartStore } from "@/lib/store";

const gradients: Record<string, string> = {
  hair: "from-[#3B2418] via-[#6B3A28] to-[#B8863B]",
  cosmetics: "from-[#7A2333] via-[#9A4A4A] to-[#D4A65E]",
};

export function ProductCard({ product }: { product: Product }) {
  const [selected, setSelected] = useState(product.swatches[0].name);
  const addLine = useCartStore((s) => s.addLine);

  return (
    <div className="group flex flex-col">
      <Link href={`/product/${product.slug}`} className="block">
        <div
          className={cn(
            "relative aspect-[4/5] w-full overflow-hidden rounded-md bg-gradient-to-br",
            gradients[product.category]
          )}
        >
          {product.badge && (
            <Badge
              variant={product.badge === "Low Stock" ? "berry" : "bronze"}
              className="absolute left-3 top-3"
            >
              {product.badge}
            </Badge>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              addLine(product.id, selected);
            }}
            aria-label={`Add ${product.name} to cart`}
            className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-ivory text-espresso opacity-0 shadow-md transition-opacity group-hover:opacity-100 hover:bg-bronze hover:text-ivory"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </Link>

      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-espresso/50">{product.subcategory}</p>
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-display text-base leading-snug hover:text-bronze">{product.name}</h3>
          </Link>
        </div>
        <div className="flex shrink-0 items-center gap-1 text-xs text-espresso/60">
          <Star className="h-3.5 w-3.5 fill-bronze text-bronze" />
          {product.rating}
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <span className="font-semibold">{formatNaira(product.price)}</span>
        {product.compareAtPrice && (
          <span className="text-sm text-espresso/40 line-through">{formatNaira(product.compareAtPrice)}</span>
        )}
      </div>

      {product.swatches.length > 1 && (
        <div className="mt-2">
          <ShadeSwatch swatches={product.swatches} selected={selected} onSelect={setSelected} size="sm" />
        </div>
      )}
    </div>
  );
}
