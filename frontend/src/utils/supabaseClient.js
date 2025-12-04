import { createClient } from '@supabase/supabase-js';

// Load variables from .env
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabasePublishableKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  console.error('⚠️ Supabase keys are missing! Check your frontend/.env file.');
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey);