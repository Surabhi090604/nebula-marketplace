# Mini Marketplace

This is a minimal marketplace demo built with Next.js and Supabase (Postgres + Auth + Storage).

Features implemented:
- Email/password sign up (collects name and phone)
- Login and Logout
- Protected Sell page to list products (name, price, images)
- Home page lists products from all users
- Product modal shows seller name and phone and details

Quick setup

1. Create a Supabase project (https://supabase.com) and a table or run the SQL in `supabase/migrations.sql`.
2. Create a Storage bucket named `product-images` (public or use signed URLs).
3. Copy `.env.local.example` to `.env.local` and set your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

Local run

```bash
cd "Mini Marketplace"
npm install
npm run dev
```

Supabase notes
- This project uses the client anon key for auth and simple calls. For production, configure Row Level Security (RLS) and appropriate policies.
- When a user signs up, a row is inserted into `profiles` with their `id` (supabase auth user id). Make sure the `profiles` table exists before signing up.

Deployment
- Deploy to Vercel: add the same environment variables in your project settings.

Tables & Storage
- `profiles` (id uuid primary key, name, phone, email)
- `products` (id, seller_id, seller_name, seller_phone, name, description, price, image_path)
