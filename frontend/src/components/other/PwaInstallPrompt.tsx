import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Share } from 'lucide-react';
import { hasCookieConsent } from '@/utils/cookieConsent';

const DISMISS_KEY = 'technotesgr_pwa_install_dismissed_at';
const DISMISS_DAYS = 14;

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function isDismissedRecently(): boolean {
  try {
    const raw = localStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    const dismissedAt = Number(raw);
    if (!Number.isFinite(dismissedAt)) return false;
    return Date.now() - dismissedAt < DISMISS_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

function markDismissed(): void {
  try {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
  } catch {
    /* ignore */
  }
}

function isStandalone(): boolean {
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isIos(): boolean {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

/** Εγκατάσταση ως εφαρμογή — Android/desktop χρησιμοποιούν το native prompt, iOS δείχνει οδηγία. */
const PwaInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosHint, setShowIosHint] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isStandalone() || isDismissedRecently()) return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setVisible(false);
      markDismissed();
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    let timer: ReturnType<typeof setTimeout> | undefined;
    if (isIos()) {
      timer = setTimeout(() => {
        if (!isDismissedRecently() && hasCookieConsent()) {
          setShowIosHint(true);
          setVisible(true);
        }
      }, 2500);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      if (timer) clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (deferredPrompt && hasCookieConsent() && !isDismissedRecently()) {
      setVisible(true);
    }
  }, [deferredPrompt]);

  const handleDismiss = () => {
    setVisible(false);
    markDismissed();
  };

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    setVisible(false);
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome !== 'accepted') markDismissed();
    setDeferredPrompt(null);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-labelledby="pwa-install-title"
          aria-describedby="pwa-install-desc"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed z-[80] left-3 right-3 sm:left-4 sm:right-4 bottom-[calc(env(safe-area-inset-bottom)+0.75rem)] sm:bottom-4 max-w-sm mx-auto sm:mx-0 sm:right-4 sm:left-auto pointer-events-auto"
        >
          <div className="rounded-2xl border border-[#ff97b2]/40 dark:border-[#ff97b2]/30 bg-white/95 dark:bg-[#241a2e]/95 backdrop-blur-xl shadow-[0_20px_50px_-12px_rgba(255,151,178,0.45)] p-4">
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-11 h-11 rounded-xl overflow-hidden border border-[#ff97b2]/30 bg-[#fff5f8] dark:bg-[#2d1c48]">
                <img src="/icons/icon-96.png" alt="" className="w-full h-full object-contain p-1" />
              </div>

              <div className="flex-1 min-w-0">
                <h2
                  id="pwa-install-title"
                  className="text-sm font-black text-gray-900 dark:text-white leading-snug"
                >
                  Εγκατάστησε το TechNotesGR
                </h2>
                <p
                  id="pwa-install-desc"
                  className="mt-1 text-xs text-gray-600 dark:text-gray-300 leading-relaxed"
                >
                  {showIosHint
                    ? 'Πάτα Κοινοποίηση, μετά "Προσθήκη στην Αρχική Οθόνη".'
                    : 'Γρήγορη πρόσβαση, λειτουργεί και offline — σαν πραγματική εφαρμογή.'}
                </p>

                <div className="mt-3 flex items-center gap-2">
                  {showIosHint ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#fff5f8] dark:bg-[#2d1c48] text-[#ff6b8a] dark:text-[#ff97b2] text-xs font-bold">
                      <Share className="w-3.5 h-3.5" /> Κοινοποίηση → Προσθήκη
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleInstall}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#ff97b2] hover:bg-[#ff80a3] text-white font-bold text-xs shadow-md transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" /> Εγκατάσταση
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleDismiss}
                    className="px-3 py-2 rounded-xl text-gray-500 dark:text-gray-400 text-xs font-semibold hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                  >
                    Όχι τώρα
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDismiss}
                aria-label="Κλείσιμο"
                className="shrink-0 p-1 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PwaInstallPrompt;
