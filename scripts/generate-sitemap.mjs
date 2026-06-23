/**
 * Regenerates public/sitemap.xml from seoConfig (run: bun scripts/generate-sitemap.mjs).
 */
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITEMAP_PATHS } from '../frontend/src/seo/seoConfig.ts';
import { DEFAULT_SITE_ORIGIN } from '../frontend/src/seo/siteMeta.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'frontend', 'public', 'sitemap.xml');

const PRIORITY = {
  '/': '1.0',
  '/quiz': '0.9',
  '/flashcards': '0.9',
  '/askiseis': '0.9',
  '/paliathemata': '0.9',
  '/methodologies': '0.85',
  '/algorithms': '0.85',
};

const urls = SITEMAP_PATHS.map((path) => {
  const loc = `${DEFAULT_SITE_ORIGIN}${path === '/' ? '/' : path}`;
  const priority = PRIORITY[path] ?? '0.8';
  const changefreq = path === '/' ? 'weekly' : path.includes('privacy') || path === '/data' ? 'yearly' : 'monthly';
  return `  <url><loc>${loc}</loc><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;
}).join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

writeFileSync(OUT, xml, 'utf8');
console.log('Wrote', OUT, `(${SITEMAP_PATHS.length} URLs)`);
