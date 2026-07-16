import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 bg-charcoal text-ivory">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <p className="font-display text-lg">Velvet Roots</p>
            <p className="mt-3 text-sm text-ivory/60">
              Hair and cosmetics chosen for texture, tone, and how they actually wear — not just how they photograph.
            </p>
          </div>
          <div>
            <p className="eyebrow text-bronze-light">Shop</p>
            <ul className="mt-3 space-y-2 text-sm text-ivory/70">
              <li><Link href="/shop?category=hair">Hair</Link></li>
              <li><Link href="/shop?category=cosmetics">Cosmetics</Link></li>
              <li><Link href="/shop">All Products</Link></li>
            </ul>
          </div>
          <div>
            <p className="eyebrow text-bronze-light">Help</p>
            <ul className="mt-3 space-y-2 text-sm text-ivory/70">
              <li>Shipping &amp; Delivery</li>
              <li>Returns</li>
              <li>Contact Us</li>
            </ul>
          </div>
          <div>
            <p className="eyebrow text-bronze-light">Based in</p>
            <p className="mt-3 text-sm text-ivory/70">Lagos, Nigeria</p>
          </div>
        </div>
        <div className="mt-10 border-t border-ivory/10 pt-6 text-xs text-ivory/40">
          © {new Date().getFullYear()} Velvet Roots. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
