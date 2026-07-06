import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Bundles the actual Vite build (frontend/build) as the app's web assets —
 * same codebase as technotesgr.com, no remote-URL WebView wrapper. Run
 * `bun run build && npx cap sync` whenever native config or the web build
 * changes, before opening Android Studio / Xcode.
 */
const config: CapacitorConfig = {
  appId: 'gr.technotesgr.app',
  appName: 'TechNotesGR',
  webDir: 'build',
  backgroundColor: '#fff5f8',
  android: {
    backgroundColor: '#fff5f8',
  },
  ios: {
    backgroundColor: '#fff5f8',
    contentInset: 'automatic',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1000,
      backgroundColor: '#fff5f8',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#fff5f8',
      overlaysWebView: false,
    },
    Keyboard: {
      resize: 'body',
      style: 'light',
      resizeOnFullScreen: true,
    },
  },
};

export default config;
