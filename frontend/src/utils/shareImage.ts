/**
 * Δημιουργεί εικόνες τύπου Instagram Story (1080x1920) για μοιρασμα score/streak,
 * και τις μοιράζεται μέσω Web Share API ή τις κατεβάζει ως fallback.
 */

export type ShareCardData =
  | { kind: 'quiz'; quizTitle: string; correct: number; total: number }
  | { kind: 'streak'; days: number; minutesToday: number };

const WIDTH = 1080;
const HEIGHT = 1920;
const SITE_LABEL = 'technotes.gr';
const LOGO_SRC = '/images/logo-80.webp';

async function ensureFontsReady(): Promise<void> {
  try {
    await Promise.all([
      document.fonts.load('800 46px Manrope'),
      document.fonts.load('900 220px Manrope'),
      document.fonts.load('700 56px Manrope'),
      document.fonts.load('600 44px Manrope'),
    ]);
    await document.fonts.ready;
  } catch {
    // Αν αποτύχει η φόρτωση της γραμματοσειράς, το canvas πέφτει σε system sans-serif.
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

function drawBackground(ctx: CanvasRenderingContext2D) {
  const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  gradient.addColorStop(0, '#2d1c48');
  gradient.addColorStop(1, '#1a1028');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const glow = (x: number, y: number, r: number, color: string) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  };
  glow(140, 260, 460, 'rgba(255,151,178,0.35)');
  glow(WIDTH - 120, HEIGHT - 340, 520, 'rgba(255,128,163,0.22)');
}

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Σπάει το κείμενο σε γραμμές ώστε να χωράει σε maxWidth, κεντραρισμένο. */
function wrapCenteredText(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  startY: number,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.split(' ');
  let line = '';
  let y = startY;
  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, centerX, y);
      line = word;
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line) {
    ctx.fillText(line, centerX, y);
    y += lineHeight;
  }
  return y;
}

export async function generateShareImageBlob(data: ShareCardData): Promise<Blob> {
  const [, logoImg] = await Promise.all([ensureFontsReady(), loadImage(LOGO_SRC).catch(() => null)]);

  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) throw new Error('Canvas 2D context is not available');

  drawBackground(ctx);
  ctx.textAlign = 'center';

  // Brand lockup: λογότυπο + wordmark
  const wordmark = 'technotesgr';
  ctx.font = '800 48px Manrope, sans-serif';
  const wordmarkWidth = ctx.measureText(wordmark).width;
  const logoSize = 76;
  const logoGap = logoImg ? 20 : 0;
  const lockupWidth = (logoImg ? logoSize : 0) + logoGap + wordmarkWidth;
  const lockupStartX = WIDTH / 2 - lockupWidth / 2;
  const lockupY = 130;

  if (logoImg) {
    const logoHeight = logoSize * (logoImg.height / logoImg.width);
    ctx.drawImage(logoImg, lockupStartX, lockupY - logoHeight / 2, logoSize, logoHeight);
  }
  ctx.textAlign = 'left';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(wordmark, lockupStartX + (logoImg ? logoSize + logoGap : 0), lockupY + 17);
  ctx.textAlign = 'center';

  // Big emoji
  ctx.font = '160px sans-serif';
  ctx.fillText('🔥', WIDTH / 2, 430);

  ctx.fillStyle = '#ffffff';
  if (data.kind === 'quiz') {
    const pct = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;

    ctx.font = '900 220px Manrope, sans-serif';
    ctx.fillText(`${data.correct}/${data.total}`, WIDTH / 2, 730);

    ctx.font = '700 56px Manrope, sans-serif';
    ctx.fillStyle = '#ffc4d6';
    ctx.fillText(`${pct}% σωστές απαντήσεις`, WIDTH / 2, 820);

    ctx.font = '600 44px Manrope, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.88)';
    wrapCenteredText(ctx, `στο quiz «${data.quizTitle}»`, WIDTH / 2, 910, WIDTH - 180, 58);
  } else {
    ctx.font = '900 220px Manrope, sans-serif';
    ctx.fillText(`${data.days}`, WIDTH / 2, 730);

    ctx.font = '700 56px Manrope, sans-serif';
    ctx.fillStyle = '#ffc4d6';
    ctx.fillText(
      data.days === 1 ? 'μέρα σερί διαβάσματος' : 'μέρες σερί διαβάσματος',
      WIDTH / 2,
      820
    );

    ctx.font = '600 44px Manrope, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.88)';
    ctx.fillText(`${data.minutesToday} λεπτά μελέτης σήμερα`, WIDTH / 2, 910);
  }

  // Bottom CTA pill
  const pillW = 620;
  const pillH = 110;
  const pillX = WIDTH / 2 - pillW / 2;
  const pillY = HEIGHT - 260;
  roundRectPath(ctx, pillX, pillY, pillW, pillH, pillH / 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.font = '800 44px Manrope, sans-serif';
  ctx.fillStyle = '#2d1c48';
  ctx.fillText(SITE_LABEL, WIDTH / 2, pillY + pillH / 2 + 16);

  ctx.font = '500 34px Manrope, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.fillText('Διάβασμα για τις Πανελλήνιες Πληροφορικής', WIDTH / 2, HEIGHT - 110);

  // JPEG: μικρότερο αρχείο + καλύτερη συμβατότητα με Instagram / iOS share sheet.
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Η δημιουργία της εικόνας απέτυχε'));
      },
      'image/jpeg',
      0.92
    );
  });
}

export function buildShareCaption(data: ShareCardData): string {
  const url = `https://${SITE_LABEL}`;
  if (data.kind === 'quiz') {
    const pct = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
    return `Πέτυχα ${data.correct}/${data.total} (${pct}%) στο quiz «${data.quizTitle}» στο technotesgr 🔥 ${url}`;
  }
  const label = data.days === 1 ? 'μέρα' : 'μέρες';
  return `${data.days} ${label} σερί διαβάσματος στο technotesgr 🔥 ${url}`;
}

export type ShareOutcome = 'shared' | 'downloaded' | 'cancelled';

/**
 * Μοιράζεται την εικόνα μέσω Web Share API (ανοίγει native share sheet, π.χ. Instagram Stories)
 * αν υποστηρίζεται, αλλιώς την κατεβάζει ώστε ο χρήστης να την ανεβάσει χειροκίνητα.
 *
 * Σημαντικό για iOS: το `navigator.share({ files, text })` κάνει πολλές εφαρμογές
 * (Instagram, WhatsApp, …) να αγνοήσουν το αρχείο και να μοιραστούν μόνο κείμενο.
 * Μοιραζόμαστε ΜΟΝΟ `{ files }` — το caption μένει για fallback / download.
 */
export async function shareOrDownloadImage(
  blob: Blob,
  filename: string,
  _caption: string
): Promise<ShareOutcome> {
  const mime = blob.type || 'image/jpeg';
  const file = new File([blob], filename, { type: mime });
  const nav = navigator as Navigator & {
    canShare?: (data?: ShareData) => boolean;
    share?: (data: ShareData) => Promise<void>;
  };

  const filesOnly = { files: [file] };

  if (typeof nav.share === 'function') {
    const canShareFiles =
      typeof nav.canShare !== 'function' || nav.canShare(filesOnly) === true;

    if (canShareFiles) {
      try {
        await nav.share(filesOnly);
        return 'shared';
      } catch (err) {
        if ((err as { name?: string })?.name === 'AbortError') return 'cancelled';
        // Πέφτουμε σε download για οποιοδήποτε άλλο σφάλμα.
      }
    }
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  return 'downloaded';
}

/**
 * Μοιράζεται την εικόνα για Instagram Story μέσω του native share sheet (Web Share API).
 * Ο χρήστης επιλέγει Instagram από το sheet και μέσα στο Instagram διαλέγει «Story».
 * (Τα deep-links `instagram-stories://share` δεν δουλεύουν από web.)
 */
export async function shareToInstagramStory(
  data: ShareCardData,
  filename: string,
  caption: string,
  preparedBlob?: Blob | null
): Promise<ShareOutcome> {
  const blob = preparedBlob ?? (await generateShareImageBlob(data));
  return shareOrDownloadImage(blob, filename, caption);
}
