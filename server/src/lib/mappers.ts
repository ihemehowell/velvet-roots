import { Product } from "../types.js";

// Supabase rows are snake_case; the frontend contract is camelCase.
// Centralizing the mapping here means the route handlers stay clean.
export function mapProductRow(row: any): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    subcategory: row.subcategory,
    price: row.price,
    compareAtPrice: row.compare_at_price ?? undefined,
    description: row.description,
    details: row.details ?? [],
    swatches: row.swatches ?? [],
    badge: row.badge ?? undefined,
    rating: Number(row.rating),
    reviewCount: row.review_count,
  };
}