import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";

const heroSwatches = [
  { label: "Honey Blonde", hex: "#B8863B" },
  { label: "Berry Wine", hex: "#7A2333" },
  { label: "Deep Espresso", hex: "#3B2418" },
  { label: "Rosewood", hex: "#9A4A4A" },
  { label: "Ash Brown", hex: "#5A4636" },
];

export default function Home() {
  const bestsellers = products.filter((p) => p.badge === "Bestseller");

  return (
    <main>
      {/* Hero */}
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-2 md:items-center md:px-8 md:py-24">
        <div className="animate-fade-up">
          <p className="eyebrow">New in — silk press bundles</p>
          <h1 className="mt-3 font-display text-4xl leading-[1.1] md:text-6xl">
            Every shade, texture, and tone — worn true.
          </h1>
          <p className="mt-5 max-w-md text-espresso/70">
            Human hair bundles, HD lace wigs, and cosmetics built for a full range of skin tones and curl patterns.
            Pick your shade before you buy, not after.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="bronze" size="lg" asChild>
              <Link href="/shop?category=hair">Shop Hair</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/shop?category=cosmetics">Shop Cosmetics</Link>
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="aspect-square rounded-lg bg-linear-to-br from-espresso via-berry to-bronze" />
          <div className="absolute -bottom-6 left-1/2 w-[88%] -translate-x-1/2 rounded-md bg-ivory p-4 shadow-lg md:w-4/5">
            <p className="eyebrow mb-2">This week's shade story</p>
            <div className="flex items-center gap-3">
              {heroSwatches.map((s) => (
                <div key={s.label} className="flex flex-col items-center gap-1.5" title={s.label}>
                  <div className="h-8 w-8 rounded-full ring-1 ring-espresso/15" style={{ backgroundColor: s.hex }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Category picker */}
      <section className="mx-auto max-w-7xl px-5 pb-14 md:px-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/shop?category=hair"
            className="group flex items-center justify-between rounded-md bg-espresso px-8 py-10 text-ivory transition-colors hover:bg-charcoal"
          >
            <div>
              <p className="eyebrow text-bronze-light">Bundles · Wigs · Braiding</p>
              <p className="mt-1 font-display text-2xl">Hair</p>
            </div>
            <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/shop?category=cosmetics"
            className="group flex items-center justify-between rounded-md bg-berry px-8 py-10 text-ivory transition-colors hover:bg-berry-light"
          >
            <div>
              <p className="eyebrow text-ivory/70">Face · Lips · Eyes</p>
              <p className="mt-1 font-display text-2xl">Cosmetics</p>
            </div>
            <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="mx-auto max-w-7xl px-5 pb-24 md:px-8">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-2xl">Bestsellers</h2>
          <Link href="/shop" className="text-sm font-medium text-bronze hover:underline">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {bestsellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
