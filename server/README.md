# Velvet Roots API

Express + TypeScript API backing the Velvet Roots storefront. Owns all Supabase access — the Next.js frontend never talks to Supabase directly.

## Stack
- **Express 5** + TypeScript (ESM)
- **Supabase** (Postgres) via `@supabase/supabase-js`, service role key, RLS on
- **Zod** for request validation
- **tsx** for dev, plain `tsc` build for prod

## Setup
1. Create the schema and seed data in your Supabase project's SQL editor, in order:
   - `sql/schema.sql`
   - `sql/seed.sql` (matches the product catalog that was previously mocked in the frontend)
2. Copy `.env.example` to `.env` and fill in your Supabase project URL + **service role** key (Project Settings → API). Never expose the service role key to the frontend.
3. Install and run:
   ```bash
   pnpm install
   pnpm dev
   ```
   Server listens on `http://localhost:4000` by default.

## Routes
| Method | Path | Description |
|---|---|---|
| GET | `/health` | Liveness check |
| GET | `/api/products` | List products, optional `?category=hair\|cosmetics` |
| GET | `/api/products/:slug` | Single product |
| POST | `/api/orders` | Create an order — prices are looked up server-side, never trusted from the client |
| GET | `/api/orders/:id` | Fetch an order with its line items |

`POST /api/orders` body shape:
```json
{
  "items": [{ "productId": "uuid", "swatch": "Honey Blonde", "quantity": 1 }],
  "shipping": {
    "fullName": "...", "phone": "...", "email": "...",
    "address": "...", "city": "...", "state": "...", "note": "..."
  },
  "paymentMethod": "Pay on Delivery"
}
```

## Notes on dependency choices
- **TypeScript pinned to `5.9.3`**, not `7.0.x` — same reasoning as the frontend: TS 7 is a brand-new native rewrite that isn't reliably supported by surrounding tooling yet.
- **`server/pnpm-workspace.yaml`** exists so pnpm treats this folder as its own project root, independent of the frontend's workspace config one level up. Without it, `pnpm install` here silently no-ops because pnpm walks up and finds the frontend's `pnpm-workspace.yaml` first.
- The Supabase client wraps `fetch` with a 10s timeout — confirmed while testing that an unreachable Supabase host otherwise hangs a request indefinitely instead of failing fast.

## Wiring up the frontend
Point the Next.js app at this API (e.g. `NEXT_PUBLIC_API_URL=http://localhost:4000`) and replace the direct reads in `lib/products.ts` and the checkout submit handler with `fetch` calls to `/api/products` and `/api/orders`. Happy to do that swap next if you want it done end-to-end.