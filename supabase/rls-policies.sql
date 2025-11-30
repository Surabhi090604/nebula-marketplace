-- Row Level Security (RLS) Policies for Mini Marketplace
-- Run this SQL in Supabase Dashboard > SQL Editor

-- Enable RLS on profiles table
alter table profiles enable row level security;

-- Allow users to read all profiles (to see seller info)
create policy "Allow read all profiles" on profiles
for select using (true);

-- Allow anyone to insert profiles (for signup)
create policy "Allow insert own profile" on profiles
for insert with check (true);

-- Allow users to update their own profile
create policy "Allow update own profile" on profiles
for update using (auth.uid() = id);

-- Enable RLS on products table
alter table products enable row level security;

-- Allow anyone to read all products (public listing)
create policy "Allow read all products" on products
for select using (true);

-- Allow authenticated users to insert products
create policy "Allow insert products for authenticated users" on products
for insert with check (auth.role() = 'authenticated');

-- Allow users to update their own products
create policy "Allow update own products" on products
for update using (auth.uid() = seller_id);

-- Allow users to delete their own products
create policy "Allow delete own products" on products
for delete using (auth.uid() = seller_id);
