-- RYVENO Supabase schema (integration-ready)
-- Run this in the Supabase SQL editor, then set the env vars in .env.local.

create extension if not exists "pgcrypto";

-- Profiles (mirrors auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  role text not null default 'customer' check (role in ('customer','admin')),
  created_at timestamptz not null default now()
);

-- Categories
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  parent_slug text,
  image text,
  created_at timestamptz not null default now()
);

-- Products
create table if not exists public.products (
  id text primary key,
  slug text unique not null,
  name text not null,
  price numeric not null,
  compare_at_price numeric,
  category text not null,
  gender text not null default 'unisex',
  tags text[] not null default '{}',
  description text not null default '',
  details text[] not null default '{}',
  images text[] not null default '{}',
  colors jsonb not null default '[]'::jsonb,
  sizes text[] not null default '{}',
  stock integer not null default 0,
  rating numeric not null default 4.5,
  review_count integer not null default 0,
  created_at timestamptz not null default now()
);

-- Orders
create table if not exists public.orders (
  id text primary key,
  tracking_number text unique not null,
  user_id uuid references public.profiles(id),
  lines jsonb not null default '[]'::jsonb,
  address jsonb not null,
  payment text not null,
  payment_details jsonb,
  subtotal numeric not null,
  shipping numeric not null default 0,
  discount numeric not null default 0,
  total numeric not null,
  coupon text,
  status text not null default 'Pending',
  timeline jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

-- Coupons
create table if not exists public.coupons (
  code text primary key,
  type text not null check (type in ('percent','fixed')),
  value numeric not null,
  min_spend numeric not null default 0,
  active boolean not null default true,
  usage integer not null default 0
);

-- Reviews
create table if not exists public.reviews (
  id text primary key,
  product_id text references public.products(id) on delete cascade,
  name text not null,
  rating integer not null check (rating between 1 and 5),
  title text not null,
  body text not null,
  verified boolean not null default false,
  status text not null default 'published',
  created_at timestamptz not null default now()
);

-- Banners
create table if not exists public.banners (
  id text primary key,
  title text not null,
  subtitle text,
  cta text,
  href text,
  image text,
  active boolean not null default true
);

-- Row Level Security
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.coupons enable row level security;
alter table public.reviews enable row level security;
alter table public.banners enable row level security;

-- Public can browse products, active coupons, published reviews and banners.
create policy "products are readable by everyone" on public.products for select using (true);
create policy "coupons are readable by everyone" on public.coupons for select using (active);
create policy "reviews are readable by everyone" on public.reviews for select using (status = 'published');
create policy "banners are readable by everyone" on public.banners for select using (active);

-- Customers can read and create their own orders.
create policy "users read own orders" on public.orders for select using (auth.uid() = user_id);
create policy "users create own orders" on public.orders for insert with check (auth.uid() = user_id);

-- Admin full access (add your admin's UUID to this policy in production).
create policy "admin full access products" on public.products for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "admin full access orders" on public.orders for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "admin full access coupons" on public.coupons for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "admin full access reviews" on public.reviews for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "admin full access banners" on public.banners for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
