# Velvet Roots

Hair & cosmetics ecommerce storefront. Next.js 16 (App Router) + TypeScript + Tailwind v4 + shadcn-style components + Zustand.

## Stack
- **Next.js 16** (Turbopack, App Router)
- **React 19**
- **Tailwind CSS v4** — theme tokens live in `app/globals.css` under `@theme`, not a JS config file
- **shadcn/ui-style primitives** — hand-rolled in `components/ui/` on top of Radix (Dialog, Label, Slot) + CVA, so no CLI dependency
- **lucide-react** for icons
- **Zustand** for cart state (`lib/store.ts`)
- Mock product data in `lib/products.ts` — swap for Supabase whenever you're ready

## Getting started
```bash
pnpm install
pnpm dev
```
Visit `http://localhost:3000`.

## ⚠️ Important: TypeScript version pin
`package.json` pins **`typescript@5.9.3`**, not the newest `7.0.x`. TypeScript 7 is the brand-new native/Corsa rewrite and it currently breaks the Next.js 16 build worker with a cryptic `The "id" argument must be of type string` error. Don't bump past `5.9.x` until Next.js officially supports TS 7 — I confirmed this by building against both.

## ⚠️ Important: pnpm 11 supply-chain settings
This project uses **pnpm 11**, which ships two new default safety gates that can block a plain `pnpm install`:
- **`minimumReleaseAge`** (default 24h) refuses to install any package published in the last day. `caniuse-lite` and `electron-to-chromium` (pulled in by Autoprefixer/Browserslist) publish near-daily, so a freshly generated lockfile can trip this on a different machine/day. Fixed by pinning both to slightly older versions in **`pnpm-workspace.yaml`** under `overrides` — this is the correct location in pnpm 11 (the old `pnpm.overrides` key in `package.json` is silently ignored now).
- **`strictDepBuilds`** (default on) blocks native postinstall scripts unless explicitly approved. `sharp` and `unrs-resolver` are approved via `allowBuilds` in `pnpm-workspace.yaml`.

If `pnpm install` ever complains about either of these again on a fresh dependency bump, it's not a bug in the app — just update the versions/allowlist in `pnpm-workspace.yaml` (or run `pnpm approve-builds` for the build-script prompt).


## What's built
- **Home** (`/`) — hero, category picker, bestsellers
- **Catalog** (`/shop`) — filterable by Hair / Cosmetics
- **Product detail** (`/product/[slug]`) — shade/texture swatch picker, quantity, add to bag
- **Cart** — slide-in drawer (Radix Dialog), accessible from the header on every page
- **Checkout** (`/checkout`) — shipping form + payment method selection (Pay on Delivery / Bank Transfer — no gateway wired up yet)
- **Order confirmation** (`/order-confirmation`) — order summary pulled from the last placed order

## Known gaps / next steps
- No payment gateway — wire Paystack or Flutterwave into checkout when ready
- Products are in-memory mock data — swap `lib/products.ts` for a Supabase table + query
- No auth/account pages yet
- No real product photography — cards use CSS gradients as placeholders by design (swap for real images per product)
- Cart is not persisted across page refreshes (Zustand store is in-memory only) — add `persist` middleware or Supabase-backed cart when you have auth
# velvet-roots
