"use client";

import { useEffect } from "react";
import { useProductsStore } from "@/lib/products-store";

export function ProductsHydrator() {
  const load = useProductsStore((s) => s.load);

  useEffect(() => {
    load();
  }, [load]);

  return null;
}