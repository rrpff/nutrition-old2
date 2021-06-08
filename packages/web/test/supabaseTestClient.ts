import { createClient } from '@supabase/supabase-js'

export const SUPABASE_TEST_USER_EMAIL = 'test-user@example.com'
export const SUPABASE_TEST_USER_PASSWORD = 'test123'

export const supabaseTestClient = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
)
