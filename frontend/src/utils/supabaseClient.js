import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 1. Throw a clear error to the console if keys are missing
if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    '🛑 Supabase URL and Key are missing! Please create a .env file in the frontend folder with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  );
}

// 2. Export the client (it will now definitely exist if no error was thrown)
export const supabase = createClient(supabaseUrl, supabasePublishableKey);