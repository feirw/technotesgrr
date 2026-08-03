import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { MenuIconImg, MENU_ICONS } from '@/data/menuIcons';
import {
  adoptWarmGloglossaIframe,
  ensureGloglossaPreconnect,
  GLOGLOSSA_EMBED_URL,
  prefetchGloglossaEmbed,
  styleGloglossaIframe,
} from '@/utils/gloglossaPrefetch';

export { prefetchGloglossaEmbed };

const GloglossaEmbedPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ensureGloglossaPreconnect();
    const container = containerRef.current;
    if (!container) return;

    const adopted = adoptWarmGloglossaIframe(container);
    const iframe =
      adopted ??
      (() => {
        const el = document.createElement('iframe');
        el.src = GLOGLOSSA_EMBED_URL;
        el.title = 'GloGlossa Embedded';
        el.referrerPolicy = 'strict-origin-when-cross-origin';
        styleGloglossaIframe(el);
        container.appendChild(el);
        return el;
      })();

    const finish = () => setLoading(false);
    try {
      if (iframe.contentDocument?.readyState === 'complete') {
        finish();
        return () => {
          iframe.remove();
        };
      }
    } catch {
      // Cross-origin: rely on load event.
    }
    iframe.addEventListener('load', finish, { once: true });

    return () => {
      iframe.remove();
    };
  }, []);

  return (
    <div
      className="overflow-hidden flex flex-col overscroll-none bg-coral-wash dark:bg-gradient-to-br dark:from-gray-950 dark:via-gray-900 dark:to-gray-900 px-4 sm:px-6 pt-3 sm:pt-4 pb-2"
      style={{
        overscrollBehavior: 'none',
        overflowAnchor: 'none',
        height: 'calc(100dvh - 5.75rem - env(safe-area-inset-top, 0px))',
        maxHeight: 'calc(100dvh - 5.75rem - env(safe-area-inset-top, 0px))',
      }}
    >
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-2 sm:gap-3 flex-1 min-h-0">
        <div className="flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <MenuIconImg src={MENU_ICONS.gloglossa} className="w-9 h-9 sm:w-10 sm:h-10" />
            <h1 className="text-2xl sm:text-3xl font-black text-coral-accent dark:text-coral-light">GloGlossa</h1>
          </div>
          <a
            href={GLOGLOSSA_EMBED_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-[#3a2658] border-2 border-coral-accent/30 dark:border-white/15 text-coral-strong dark:text-coral-light font-semibold hover:border-coral-accent"
          >
            Άνοιγμα σε νέο tab
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div className="relative flex-1 min-h-0 rounded-2xl overflow-hidden border-2 border-coral-accent/25 dark:border-white/15 shadow-xl bg-white dark:bg-[#3a2658] overscroll-y-contain isolate">
          {loading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-white/90 dark:bg-[#3a2658]/90">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-coral-accent border-t-transparent" />
              <p className="text-sm font-semibold text-coral-strong dark:text-coral-light">Φόρτωση GloGlossa…</p>
            </div>
          )}
          <div ref={containerRef} className="h-full w-full min-h-0" />
        </div>

        <details className="shrink-0 max-h-[28vh] overflow-y-auto overscroll-y-contain rounded-xl border border-coral-accent/25 dark:border-white/15 bg-white/60 dark:bg-[#3a2658]/60 text-sm text-gray-600 dark:text-gray-300">
          <summary className="cursor-pointer select-none px-4 py-3 font-semibold text-coral-strong dark:text-coral-light sticky top-0 bg-white/90 dark:bg-[#3a2658]/90 backdrop-blur-sm z-[1]">
            Ευχαριστίες &amp; σχετικά
          </summary>
          <p className="px-4 pb-4 pt-0 leading-relaxed">
            Ευχαριστούμε θερμά τον κ.{' '}
            <span className="font-semibold text-coral-accent dark:text-coral-light">Κομνηνό Χατζηπάπα</span> για τον
            Online Διερμηνευτή της Γλώσσας.
          </p>
        </details>
      </div>
    </div>
  );
};

export default GloglossaEmbedPage;
