// frontend/src/utils/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are missing
const hasValidConfig =
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://placeholder.supabase.co' &&
  supabaseAnonKey !== 'placeholder_key';

if (!hasValidConfig) {
  console.error('⚠️ SUPABASE CONFIGURATION MISSING!');
  console.error('Please create a .env file in the frontend directory with:');
  console.error('VITE_SUPABASE_URL=your_supabase_url');
  console.error('VITE_SUPABASE_ANON_KEY=your_supabase_anon_key');
  console.warn('🔧 Running in MOCK MODE - Authentication will not work!');
}

// Create client with fallback values
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder_key'
);

// Export a flag to check if Supabase is properly configured
export const isSupabaseConfigured = hasValidConfig;

// Helper to check if we're in mock mode
export const isMockMode = !hasValidConfig;
