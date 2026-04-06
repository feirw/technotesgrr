/// <reference types="vite/client" />

/** Filled by public/env.js; Docker entrypoint overwrites with runtime values. */
interface Window {
  __ENV__?: Record<string, string | undefined>;
}

interface ImportMetaEnv {
  /** Public site URL for auth emails, e.g. https://technotesgr.com (no trailing slash). */
  readonly VITE_SITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}