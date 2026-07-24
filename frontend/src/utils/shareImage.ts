/**
 * Δημιουργεί εικόνες τύπου Instagram Story (1080x1920) για μοιρασμα score/streak,
 * και τις μοιράζεται μέσω Web Share API ή τις κατεβάζει ως fallback.
 */

export type ShareCardData =
  | { kind: 'quiz'; quizTitle: string; correct: number; total: number }
  | { kind: 'streak'; days: number; minutesToday: number };

const WIDTH = 1080;
const HEIGHT = 1920;
const SITE_LABEL = 'technotesgr.com';
const LOGO_SRC = '/images/logo.png';

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
  const ctx = canvas.getContext('2d');
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

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Η δημιουργία της εικόνας απέτυχε'));
    }, 'image/png');
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

export type ShareOutcome = 'story' | 'shared' | 'downloaded' | 'cancelled';

function isIOS(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window);
}

/**
 * Μοιράζεται την εικόνα μέσω Web Share API (ανοίγει native share sheet, π.χ. Instagram Stories)
 * αν υποστηρίζεται, αλλιώς την κατεβάζει ώστε ο χρήστης να την ανεβάσει χειροκίνητα.
 */
export async function shareOrDownloadImage(
  blob: Blob,
  filename: string,
  caption: string
): Promise<ShareOutcome> {
  const file = new File([blob], filename, { type: 'image/png' });
  const nav = navigator as Navigator & {
    canShare?: (data?: ShareData) => boolean;
    share?: (data: ShareData) => Promise<void>;
  };

  if (nav.share && nav.canShare?.({ files: [file] })) {
    try {
      await nav.share({ files: [file], text: caption });
      return 'shared';
    } catch (err) {
      if ((err as { name?: string })?.name === 'AbortError') return 'cancelled';
      // Πέφτουμε σε download για οποιοδήποτε άλλο σφάλμα (π.χ. μη υποστηριζόμενος τύπος αρχείου).
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
 * Στέλνει την εικόνα κατευθείαν στο Instagram Stories composer (όχι σε post/feed).
 * Σε iOS αντιγράφει την εικόνα στο system pasteboard και ανοίγει το τεκμηριωμένο
 * `instagram-stories://share` URL scheme (λειτουργεί χωρίς registered app id για
 * απλό background image — βλ. developers.facebook.com/docs/instagram/sharing-to-stories).
 * Αν αποτύχει ή δεν τρέχει σε iOS (π.χ. Android/desktop, όπου δεν υπάρχει αντίστοιχο
 * web deep-link), πέφτει στο γενικό Web Share API / download· εκεί μέσα στο Instagram
 * ο χρήστης διαλέγει ο ίδιος «Story» από το δικό του share sheet.
 *
 * Σημαντικό: το `navigator.clipboard.write` πρέπει να κληθεί όσο το δυνατόν πιο κοντά
 * στο user gesture (το click) — στη Safari/iOS, οποιοδήποτε `await` πριν από αυτό
 * (π.χ. να περιμένουμε να «ψηθεί» πρώτα η εικόνα) καταναλώνει το transient user
 * activation και το write αποτυγχάνει σιωπηλά με NotAllowedError. Γι' αυτό περνάμε
 * το promise της εικόνας ΑΠΕΥΘΕΙΑΣ μέσα στο ClipboardItem αντί να κάνουμε πρώτα await.
 */
export async function shareToInstagramStory(
  data: ShareCardData,
  filename: string,
  caption: string
): Promise<ShareOutcome> {
  if (isIOS() && typeof ClipboardItem !== 'undefined') {
    const blobPromise = generateShareImageBlob(data);
    try {
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blobPromise })]);
      window.location.href = 'instagram-stories://share?source_application=technotesgr';

      const openedInstagram = await new Promise<boolean>((resolve) => {
        let settled = false;
        const finish = (result: boolean) => {
          if (settled) return;
          settled = true;
          document.removeEventListener('visibilitychange', onVisibilityChange);
          window.clearTimeout(timer);
          resolve(result);
        };
        const onVisibilityChange = () => {
          if (document.hidden) finish(true);
        };
        document.addEventListener('visibilitychange', onVisibilityChange);
        const timer = window.setTimeout(() => finish(false), 1500);
      });

      if (openedInstagram) return 'story';
      return shareOrDownloadImage(await blobPromise, filename, caption);
    } catch {
      // Clipboard write ή deep link απέτυχαν — πέφτουμε στο γενικό share flow.
      return shareOrDownloadImage(await blobPromise, filename, caption);
    }
  }

  return shareOrDownloadImage(await generateShareImageBlob(data), filename, caption);
}
