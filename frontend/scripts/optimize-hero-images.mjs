/**
 * Δημιουργεί .webp δίπλα στα hero JPG και μικρό logo-rain.webp για τη βροχή.
 * Τρέχει πριν το build (prebuild). Αν λείπει το sharp, η σελίδα χρησιμοποιεί μόνο JPG.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.join(__dirname, '..', 'public', 'images');

function allWebpFresh() {
  if (!fs.existsSync(imagesDir)) return false;
  const jpegs = ['panellinies.jpg', 'grades.jpg', 'diav.jpg', 'cat.jpg'];
  for (const name of jpegs) {
    const input = path.join(imagesDir, name);
    const out = path.join(imagesDir, name.replace(/\.jpe?g$/i, '.webp'));
    if (!fs.existsSync(input) || !fs.existsSync(out)) return false;
    if (fs.statSync(out).mtimeMs < fs.statSync(input).mtimeMs) return false;
  }
  const logo = path.join(imagesDir, 'logo.png');
  const rain = path.join(imagesDir, 'logo-rain.webp');
  if (fs.existsSync(logo)) {
    if (!fs.existsSync(rain)) return false;
    if (fs.statSync(rain).mtimeMs < fs.statSync(logo).mtimeMs) return false;
  }
  return true;
}

async function main() {
  if (!fs.existsSync(imagesDir)) {
    console.warn('[optimize-hero-images] public/images missing; skip.');
    return;
  }

  if (allWebpFresh()) {
    console.log('[optimize-hero-images] WebP up to date; skip.');
    return;
  }

  let sharp;
  try {
    const m = await import('sharp');
    sharp = m.default;
  } catch {
    console.warn('[optimize-hero-images] sharp not installed; commit .webp under public/images or install devDependencies.');
    return;
  }

  const jpegs = ['panellinies.jpg', 'grades.jpg', 'diav.jpg', 'cat.jpg'];
  for (const name of jpegs) {
    const input = path.join(imagesDir, name);
    if (!fs.existsSync(input)) continue;
    const out = path.join(imagesDir, name.replace(/\.jpe?g$/i, '.webp'));
    const inStat = fs.statSync(input);
    if (fs.existsSync(out) && fs.statSync(out).mtimeMs >= inStat.mtimeMs) continue;
    await sharp(input).webp({ quality: 82, effort: 4 }).toFile(out);
    console.log('[optimize-hero-images] wrote', path.basename(out));
  }

  const logoPath = path.join(imagesDir, 'logo.png');
  if (fs.existsSync(logoPath)) {
    const rainOut = path.join(imagesDir, 'logo-rain.webp');
    const inStat = fs.statSync(logoPath);
    if (!fs.existsSync(rainOut) || fs.statSync(rainOut).mtimeMs < inStat.mtimeMs) {
      await sharp(logoPath)
        .resize(72, 72, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 88, effort: 4 })
        .toFile(rainOut);
      console.log('[optimize-hero-images] wrote logo-rain.webp');
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
