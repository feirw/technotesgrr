// frontend/src/utils/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

type SupabaseEnvKey = 'VITE_SUPABASE_URL' | 'VITE_SUPABASE_ANON_KEY';

/** Build-time (Vite) + optional runtime (/env.js from Docker entrypoint). */
function envValue(key: SupabaseEnvKey): string {
  if (typeof window !== 'undefined') {
    const fromRuntime = window.__ENV__?.[key];
    if (typeof fromRuntime === 'string' && fromRuntime.trim().length > 0) {
      return fromRuntime.trim();
    }
  }
  const v = import.meta.env[key];
  return typeof v === 'string' ? v.trim() : '';
}

function computeHasValidConfig(): boolean {
  const supabaseUrl = envValue('VITE_SUPABASE_URL');
  const supabaseAnonKey = envValue('VITE_SUPABASE_ANON_KEY');
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    supabaseUrl !== 'https://placeholder.supabase.co' &&
    supabaseAnonKey !== 'placeholder_key'
  );
}

const hasValidConfig = computeHasValidConfig();

if (!hasValidConfig && import.meta.env.DEV) {
  console.error('⚠️ SUPABASE CONFIGURATION MISSING!');
  console.error('Add frontend/.env with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY,');
  console.error('or for Docker set those as container env vars (written to /env.js at start).');
  console.warn('🔧 Running in MOCK MODE - Authentication will not work!');
}

export const supabase = createClient(
  envValue('VITE_SUPABASE_URL') || 'https://placeholder.supabase.co',
  envValue('VITE_SUPABASE_ANON_KEY') || 'placeholder_key'
);

export function isSupabaseConfigured(): boolean {
  return computeHasValidConfig();
}

export function isMockMode(): boolean {
  return !computeHasValidConfig();
}

/** For diagnostics UI (effective config after runtime override). */
export function getSupabaseEnvDebug(): {
  url: string;
  keyLength: number;
  source: 'runtime' | 'build' | 'none';
} {
  const urlBuild =
    typeof import.meta.env.VITE_SUPABASE_URL === 'string'
      ? import.meta.env.VITE_SUPABASE_URL.trim()
      : '';
  const keyBuild =
    typeof import.meta.env.VITE_SUPABASE_ANON_KEY === 'string'
      ? import.meta.env.VITE_SUPABASE_ANON_KEY.trim()
      : '';
  const urlRt =
    typeof window !== 'undefined' ? (window.__ENV__?.VITE_SUPABASE_URL || '').trim() : '';
  const keyRt =
    typeof window !== 'undefined' ? (window.__ENV__?.VITE_SUPABASE_ANON_KEY || '').trim() : '';

  const url = envValue('VITE_SUPABASE_URL');
  const key = envValue('VITE_SUPABASE_ANON_KEY');
  let source: 'runtime' | 'build' | 'none' = 'none';
  if (urlRt || keyRt) source = 'runtime';
  else if (urlBuild || keyBuild) source = 'build';

  return {
    url: url || 'NOT SET',
    keyLength: key.length,
    source,
  };
}
