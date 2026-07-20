import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { initWebVitalsTracking } from '@/utils/webVitals';
import { initTheme } from '@/utils/theme';
import { AuthProvider } from '@/context/AuthContext';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

// Initialize theme before first paint
initTheme();

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);

if (typeof window.requestIdleCallback === 'function') {
  window.requestIdleCallback(() => initWebVitalsTracking());
} else {
  window.setTimeout(() => initWebVitalsTracking(), 1200);
}
