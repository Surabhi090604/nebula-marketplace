#!/usr/bin/env node
/**
 * Supabase Setup Script
 * Creates storage bucket using REST API
 */

const fs = require('fs')
const path = require('path')

// Extract credentials from .env.local
const envPath = path.join(__dirname, '.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')
const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)

const supabaseUrl = urlMatch ? urlMatch[1].trim() : null
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL in .env.local')
  process.exit(1)
}

if (!serviceRoleKey) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
  console.error('   Please run: export SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>')
  process.exit(1)
}

async function runSetup() {
  try {
    console.log('🚀 Starting Supabase setup...\n')

    // 1. Remind about migrations
    console.log('1️⃣  Database migrations')
    console.log('   ⚠️  You must run the SQL in supabase/migrations.sql manually:')
    console.log('   → Go to Supabase Dashboard > SQL Editor')
    console.log('   → Create a new query and paste the contents of supabase/migrations.sql')
    console.log('   → Execute the query')
    console.log('   ℹ️  This creates the "profiles" and "products" tables\n')

    // 2. Create storage bucket via REST API
    console.log('2️⃣  Creating product-images storage bucket...')
    
    const storageEndpoint = `${supabaseUrl}/storage/v1/b`
    const response = await fetch(storageEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'product-images',
        public: true,
        allowed_mime_types: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      })
    })

    if (response.status === 200 || response.status === 201) {
      console.log('   ✓ Bucket created successfully')
    } else if (response.status === 400) {
      const text = await response.text()
      if (text.includes('already exists')) {
        console.log('   ✓ Bucket already exists')
      } else {
        console.error('   ❌ Error:', text)
        process.exit(1)
      }
    } else {
      const text = await response.text()
      console.error('   ❌ Error creating bucket:', response.status, text)
      process.exit(1)
    }

    console.log('\n✅ Storage bucket setup completed!')
    console.log('\n📝 Next steps:')
    console.log('   1. Run SQL migrations in Supabase Dashboard (see step 1 above)')
    console.log('   2. Verify .env.local has NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
    console.log('   3. Start the app: npm run dev')
    console.log('\n🎉 Your Mini Marketplace is ready!')

  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
    process.exit(1)
  }
}

runSetup()
