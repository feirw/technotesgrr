import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';

/**
 * Native-only wiring (no-ops in the browser): Android hardware back button
 * navigates router history instead of instantly killing the app, and exits
 * only from a page with no history to go back to.
 */
const NativeAppBridge: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let removeListener: (() => void) | undefined;
    let cancelled = false;

    import('@capacitor/app').then(({ App }) => {
      if (cancelled) return;
      App.addListener('backButton', () => {
        if (window.history.state?.idx > 0) {
          navigate(-1);
        } else {
          App.exitApp();
        }
      }).then((handle) => {
        removeListener = () => handle.remove();
      });
    });

    return () => {
      cancelled = true;
      removeListener?.();
    };
    // location intentionally excluded — this only needs to (re)bind once per mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    // Status bar sits on the light pink brand background in both themes, so it
    // always needs dark icons/text for contrast — set once, not per route.
    import('@capacitor/status-bar').then(({ StatusBar, Style }) => {
      StatusBar.setStyle({ style: Style.Dark }).catch(() => undefined);
      StatusBar.setBackgroundColor({ color: '#fff5f8' }).catch(() => undefined);
    });
  }, []);

  return null;
};

export default NativeAppBridge;
