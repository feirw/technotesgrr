import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  console.error('⚠️ Supabase keys are missing! Check your frontend/.env file.');
}

export const supabase =
  supabaseUrl && supabasePublishableKey ? createClient(supabaseUrl, supabasePublishableKey) : null;
