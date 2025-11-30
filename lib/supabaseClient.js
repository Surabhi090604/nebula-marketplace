import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const useMock = process.env.NEXT_PUBLIC_USE_MOCK_SUPABASE === 'true'

let supabase

if (useMock) {
  console.log('⚠️ Using MOCK Supabase (for local testing without network access)')
  const { supabase: mockSupabase } = require('./supabaseClientMock.js')
  supabase = mockSupabase
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
}

export { supabase }
