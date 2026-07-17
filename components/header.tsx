"use client";

import Link from "next/link";
import { Search, ShoppingBag, Menu, X } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const nav = [
  { label: "Hair", href: "/shop?category=hair" },
  { label: "Cosmetics", href: "/shop?category=cosmetics" },
  { label: "All Products", href: "/shop" },
];

export function Header() {
  const lines = useCartStore((s) => s.lines);
  const openCart = useCartStore((s) => s.open);
  const [mobileOpen, setMobileOpen] = useState(false);
  const count = lines.reduce((sum, l) => sum + l.quantity, 0);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-ivory/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
        <button
          type="button"
          className="md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link href="/" className="font-display text-xl tracking-tight flex items-center gap-2">
         <Image 
          src="/logo.svg"
          alt="Velvet Roots"
          width={40}
          height={40}
         /> Velvet Roots
        </Link>

        <nav className="hidden gap-8 md:flex">
          {nav.map((item) => (
            <Link key={item.label} href={item.href} className="text-sm font-medium hover:text-bronze">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button type="button" aria-label="Search" className="hover:text-bronze">
            <Search className="h-5 w-5" />
          </button>
          <button type="button" aria-label="Open cart" onClick={openCart} className="relative hover:text-bronze">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-berry text-[10px] font-bold text-ivory">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      <div id="mobile-nav" className={cn("md:hidden overflow-hidden transition-all", mobileOpen ? "max-h-40" : "max-h-0")}>
        <nav className="flex flex-col gap-1 border-t border-border px-5 py-3">
          {nav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="py-2 text-sm font-medium"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
