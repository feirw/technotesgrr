/**
 * After Vite build, writes one HTML file per indexable route so crawlers
 * see unique <title>/description/canonical/JSON-LD without running JS.
 *
 * Output: frontend/build/index.html (home) and frontend/build/<path>/index.html
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PAGE_SEO } from '../frontend/src/seo/seoConfig.ts';
import {
  DEFAULT_OG_IMAGE_PATH,
  DEFAULT_SITE_ORIGIN,
  OG_IMAGE_CACHE_VERSION,
} from '../frontend/src/seo/siteMeta.ts';
import { buildStructuredData } from '../frontend/src/seo/schema.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BUILD_DIR = join(__dirname, '..', 'frontend', 'build');
const INDEX_PATH = join(BUILD_DIR, 'index.html');
const SEO_START = '<!-- seo:start -->';
const SEO_END = '<!-- seo:end -->';

function escapeAttr(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function pageUrl(path) {
  return `${DEFAULT_SITE_ORIGIN}${path === '/' ? '/' : path}`;
}

function imageUrl(imagePath) {
  const path = imagePath || DEFAULT_OG_IMAGE_PATH;
  const abs = path.startsWith('http') ? path : `${DEFAULT_SITE_ORIGIN}${path}`;
  const sep = abs.includes('?') ? '&' : '?';
  return `${abs}${sep}v=${OG_IMAGE_CACHE_VERSION}`;
}

function seoBlock(page) {
  const title = escapeAttr(page.title);
  const description = escapeAttr(page.description);
  const ogTitle = escapeAttr(page.ogTitle ?? page.title);
  const canonical = pageUrl(page.path);
  const image = imageUrl(page.ogImage);
  const robots = escapeAttr(page.robots ?? (page.noindex ? 'noindex, follow' : 'index, follow'));
  const imageAlt = escapeAttr(ogTitle);

  return `    <meta
      name="description"
      content="${description}"
    />
    <meta name="robots" content="${robots}" />
    <link rel="canonical" href="${canonical}" />

    <!-- Open Graph / Messenger / Instagram: crawlers do not run JS -->
    <meta property="og:site_name" content="technotesgr" />
    <meta property="og:title" content="${ogTitle}" />
    <meta
      property="og:description"
      content="${description}"
    />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="el_GR" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:secure_url" content="${image}" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${imageAlt}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${ogTitle}" />
    <meta
      name="twitter:description"
      content="${description}"
    />
    <meta name="twitter:image" content="${image}" />
    <meta name="twitter:image:alt" content="${imageAlt}" />`;
}

function jsonLdScript(page) {
  const graphs = buildStructuredData(page, page.path);
  const json = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': graphs,
  }).replace(/</g, '\\u003c');
  return `<script type="application/ld+json" id="seo-jsonld-graph">${json}</script>`;
}

function applyPage(html, page) {
  const start = html.indexOf(SEO_START);
  const end = html.indexOf(SEO_END);
  if (start === -1 || end === -1 || end < start) {
    throw new Error('Missing <!-- seo:start --> / <!-- seo:end --> markers in built index.html');
  }

  let next = html.slice(0, start + SEO_START.length) + '\n' + seoBlock(page) + '\n    ' + html.slice(end);
  next = next.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttr(page.title)}</title>`);

  const ld = jsonLdScript(page);
  if (next.includes('id="seo-jsonld-graph"')) {
    next = next.replace(
      /<script type="application\/ld\+json" id="seo-jsonld-graph">[\s\S]*?<\/script>/,
      ld,
    );
  } else {
    next = next.replace('</head>', `    ${ld}\n  </head>`);
  }
  return next;
}

function outPathFor(path) {
  if (path === '/') return INDEX_PATH;
  return join(BUILD_DIR, path.replace(/^\//, ''), 'index.html');
}

if (!existsSync(INDEX_PATH)) {
  console.error('generate-html-shells: missing', INDEX_PATH);
  process.exit(1);
}

const template = readFileSync(INDEX_PATH, 'utf8');
const pages = Object.values(PAGE_SEO).filter((page) => !page.noindex);

for (const page of pages) {
  const html = applyPage(template, page);
  const dest = outPathFor(page.path);
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, html, 'utf8');
  console.log('HTML:', dest);
}

console.log('Done —', pages.length, 'HTML shells');
