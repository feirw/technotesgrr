/// <reference types="vite/client" />

/** Filled by public/env.js; Docker entrypoint overwrites with runtime values. */
interface Window {
  __ENV__?: Record<string, string | undefined>;
}

interface ImportMetaEnv {
  /** Public site URL for auth emails, e.g. https://www.technotes.gr (no trailing slash). */
  readonly VITE_SITE_URL?: string;
  /** Google Search Console HTML tag token. */
  readonly VITE_GOOGLE_SITE_VERIFICATION?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}