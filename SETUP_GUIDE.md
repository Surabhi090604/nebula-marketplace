# Mini Marketplace - Manual Supabase Setup Guide

Your environment variables are already configured in `.env.local`. Now you need to complete the database and storage setup in Supabase.

## Step 1: Create Database Tables

1. Open your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project `lbbauajaohrayayidqhcwz`
3. Go to **SQL Editor** (left sidebar)
4. Click **New query** (or paste in the SQL editor)
5. Copy and paste the SQL below, then click **Run**:

```sql
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
```

6. Confirm the tables are created by going to **Database > Tables** in the left sidebar

## Step 2: Create Storage Bucket

1. In Supabase Dashboard, go to **Storage** (left sidebar)
2. Click **Create a new bucket**
3. Fill in:
   - **Bucket name**: `product-images`
   - **Public bucket**: Toggle ON (so images are publicly accessible)
4. Click **Create bucket**

## Step 3: Disable Email Confirmation (for demo)

1. In Supabase Dashboard, go to **Authentication** (left sidebar)
2. Click **Providers**
3. Click **Email**
4. Toggle **Confirm email** to **OFF**
5. Click **Save**

This allows users to sign up and login immediately without email verification.

## Step 4: Set Up Row Level Security (RLS) Policies

1. In Supabase Dashboard, go to **SQL Editor**
2. Create a new query and paste the contents of `supabase/rls-policies.sql`
3. Click **Run**

This configures security policies so:
- Anyone can read products and profiles (public)
- Only authenticated users can insert products
- Users can only update/delete their own data

## Step 5: Start the App Locally

Run these commands:

```bash
cd "Mini Marketplace"
npm run dev
```

Open: **http://localhost:3001** (or 3000 if available)

## Testing the App

1. **Sign Up** — create an account with email, password, name, and phone
2. **Go to Sell** — list a product (name, price, image)
3. **Go to Home** — see the product listed and click to view seller details

## Troubleshooting

- **"Failed to fetch" on signup?** 
  - Make sure you disabled email confirmation (Step 3 above)
  - Check that RLS policies are set up (Step 4 above)
  - Open browser DevTools (F12) > Console to see the exact error
- **Auth not working?** — Verify email confirmation is OFF in Supabase > Authentication > Providers > Email
- **Images not showing?** — Check that the `product-images` bucket is set to public
- **Tables not found?** — Verify you ran the SQL from Step 1
- **RLS errors?** — Make sure you ran the SQL from Step 4 (rls-policies.sql)

## Deployment

When ready to deploy:
1. Push your code to GitHub
2. Connect Vercel to your GitHub repo
3. Add these environment variables in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL=https://lbbauajaohrayayidqhcwz.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxiYmF1YWphb2hyYXlpZHFoY3d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0OTI3ODIsImV4cCI6MjA4MDA2ODc4Mn0.YdsLvX1tkykQbdGVOhpyAzASJcoDsUtDp5RC11jc5VI`
4. Deploy!
