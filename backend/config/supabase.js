import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY; // service role key

if (!supabaseUrl || !supabaseSecretKey) {
  console.error('CRITICAL: SUPABASE_URL or SUPABASE_SECRET_KEY is not defined in environment variables.');
}

// Client with privileged access to perform authentication checks and admin overrides
export const supabase = createClient(supabaseUrl, supabaseSecretKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

console.log('Supabase client initialized.');
