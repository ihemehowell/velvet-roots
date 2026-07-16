-- Run this in the Supabase SQL editor

create extension if not exists "pgcrypto";

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null check (category in ('hair', 'cosmetics')),
  subcategory text not null,
  price integer not null,               -- kobo/naira as integer, no floats
  compare_at_price integer,
  description text not null,
  details text[] not null default '{}',
  swatches jsonb not null default '[]', -- [{ "name": "Honey Blonde", "hex": "#B8863B" }]
  badge text check (badge in ('New', 'Bestseller', 'Low Stock')),
  rating numeric(2,1) not null default 0,
  review_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id text primary key,                  -- e.g. "VR-ABC123"
  full_name text not null,
  phone text not null,
  email text,
  address text not null,
  city text not null,
  state text not null,
  note text,
  payment_method text not null check (payment_method in ('Pay on Delivery', 'Bank Transfer')),
  subtotal integer not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'delivered', 'cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id text not null references orders(id) on delete cascade,
  product_id uuid not null references products(id),
  swatch text not null,
  quantity integer not null check (quantity > 0),
  unit_price integer not null            -- snapshot of product price at order time
);

create index if not exists idx_products_category on products(category);
create index if not exists idx_order_items_order_id on order_items(order_id);

-- Row Level Security: API talks to Supabase with the service role key
-- (server-side only), so RLS can stay strict — no client ever touches
-- Supabase directly.
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;