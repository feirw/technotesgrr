import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { initWebVitalsTracking } from '@/utils/webVitals';
import { initTheme } from '@/utils/theme';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

// Initialize theme before first paint
initTheme();

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

if ('requestIdleCallback' in window) {
  (window as any).requestIdleCallback(() => initWebVitalsTracking());
} else {
  window.setTimeout(() => initWebVitalsTracking(), 1200);
}
