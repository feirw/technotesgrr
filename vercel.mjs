/**
 * Vercel config (programmatic). Env vars are read at deploy/build from Project → Settings → Environment Variables.
 *
 * BACKEND_URL — Base URL του FastAPI (χωρίς / στο τέλος), π.χ. https://api.technotesgr.gr
 *   Αν το βάλεις, το /api/* του Vercel κάνει reverse proxy εκεί → το frontend μπορεί να καλεί same-origin /api/...
 *   χωρίς VITE_BACKEND_URL (ή με κενό).
 *
 * Αν ΔΕΝ βάλεις BACKEND_URL, όρισε στο build: VITE_BACKEND_URL=το-ίδιο-url (άμεσα στο API) και CORS στο backend για *.vercel.app.
 */

const backend = (process.env.BACKEND_URL || '').trim().replace(/\/+$/, '');

const rewrites = [];

if (backend) {
  rewrites.push({
    source: '/api/:path*',
    destination: `${backend}/api/:path*`,
  });
}

rewrites.push({ source: '/(.*)', destination: '/index.html' });

export const config = {
  installCommand: 'cd frontend && yarn install --frozen-lockfile',
  buildCommand: 'cd frontend && yarn build',
  outputDirectory: 'frontend/build',
  rewrites,
};
