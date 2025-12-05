import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabasePublishableKey) {
  console.error('🛑 CRITICAL: Supabase keys are missing in .env! App functionality will fail.');
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey);
