/// <reference types="vite/client" />

/** Filled by public/env.js; Docker entrypoint overwrites with runtime values. */
interface Window {
  __ENV__?: Record<string, string | undefined>;
}