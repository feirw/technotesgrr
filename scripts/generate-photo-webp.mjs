/**
 * Compress photos used on About / reviews / theme toggle to WebP.
 * Run: bun scripts/generate-photo-webp.mjs
 */
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const sharp = require('../frontend/node_modules/sharp');

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, '..', 'frontend', 'public');

const PHOTOS = [
  { rel: 'images/eg1.jpg', max: 900 },
  { rel: 'images/eg2.jpg', max: 900 },
  { rel: 'images/eg3.jpg', max: 900 },
  { rel: 'images/eg4.jpg', max: 900 },
  { rel: 'images/eg5.jpg', max: 900 },
  { rel: 'images/eg6.jpg', max: 900 },
  { rel: 'images/c2.png', max: 1100 },
  { rel: 'images/c3.png', max: 1100 },
  { rel: 'images/home page/stars-removebg-preview.png', max: 160 },
  { rel: 'images/home page/starr.png', max: 96 },
  { rel: 'images/home page/sun.png', max: 96 },
];

let created = 0;
let skipped = 0;

for (const { rel, max } of PHOTOS) {
  const input = join(PUBLIC, rel);
  if (!existsSync(input)) {
    console.warn(`skip missing: ${rel}`);
    skipped += 1;
    continue;
  }

  const output = input.replace(/\.(jpe?g|png)$/i, '.webp');
  await sharp(input)
    .rotate()
    .resize(max, max, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 72, effort: 4 })
    .toFile(output);

  created += 1;
  console.log(`✓ ${rel} → ${output.replace(PUBLIC + '\\', '').replace(PUBLIC + '/', '')}`);
}

console.log(`Done: ${created} webp files, ${skipped} skipped.`);
