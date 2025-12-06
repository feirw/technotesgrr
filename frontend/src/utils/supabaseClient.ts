// frontend/src/utils/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // This alert helps you realize if env vars are missing immediately
  console.error('Missing Supabase Environment Variables!');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
