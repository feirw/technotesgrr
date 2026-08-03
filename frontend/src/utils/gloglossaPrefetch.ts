export const GLOGLOSSA_EMBED_ORIGIN = 'https://gloglossa.gr';
export const GLOGLOSSA_EMBED_URL = `${GLOGLOSSA_EMBED_ORIGIN}/`;

let preconnectDone = false;
let warmIframe: HTMLIFrameElement | null = null;

export function ensureGloglossaPreconnect() {
  if (preconnectDone || typeof document === 'undefined') return;
  preconnectDone = true;
  for (const rel of ['preconnect', 'dns-prefetch'] as const) {
    const link = document.createElement('link');
    link.rel = rel;
    link.href = GLOGLOSSA_EMBED_ORIGIN;
    if (rel === 'preconnect') link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  }
}

function styleWarmIframe(iframe: HTMLIFrameElement) {
  Object.assign(iframe.style, {
    position: 'absolute',
    width: '0',
    height: '0',
    border: '0',
    visibility: 'hidden',
    pointerEvents: 'none',
  });
}

export function styleGloglossaIframe(iframe: HTMLIFrameElement) {
  iframe.removeAttribute('aria-hidden');
  iframe.tabIndex = 0;
  Object.assign(iframe.style, {
    position: '',
    width: '100%',
    height: '100%',
    border: '0',
    visibility: '',
    pointerEvents: '',
    display: 'block',
  });
  iframe.className = 'w-full h-full min-h-0 border-0 block';
}

/** DNS/TLS + hidden iframe warmup (menu/home hover). */
export function prefetchGloglossaEmbed() {
  ensureGloglossaPreconnect();
  if (warmIframe || typeof document === 'undefined') return;

  warmIframe = document.createElement('iframe');
  warmIframe.src = GLOGLOSSA_EMBED_URL;
  warmIframe.title = 'GloGlossa preload';
  warmIframe.setAttribute('aria-hidden', 'true');
  warmIframe.tabIndex = -1;
  warmIframe.referrerPolicy = 'strict-origin-when-cross-origin';
  styleWarmIframe(warmIframe);
  document.body.appendChild(warmIframe);
}

export function adoptWarmGloglossaIframe(container: HTMLElement): HTMLIFrameElement | null {
  if (!warmIframe) return null;
  const iframe = warmIframe;
  warmIframe = null;
  iframe.title = 'GloGlossa Embedded';
  styleGloglossaIframe(iframe);
  container.appendChild(iframe);
  return iframe;
}
