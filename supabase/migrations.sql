-- Supabase migration SQL for Mini Marketplace

-- profiles table (store basic seller info)
create table if not exists profiles (
  id uuid primary key,
  email text,
  name text,
  phone text,
  created_at timestamptz default now()
);

-- products table
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid,
  seller_name text,
  seller_phone text,
  name text not null,
  description text,
  price numeric,
  image_path text,
  created_at timestamptz default now()
);

-- Note: Create a storage bucket named `product-images` in Supabase Storage.
-- Make it public or use signed URLs for access. Example (in SQL you can't create bucket)
