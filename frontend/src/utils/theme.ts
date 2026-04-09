const THEME_KEY = 'theme';

export type Theme = 'light' | 'dark';

export function getPreferredTheme(): Theme {
  const stored = localStorage.getItem(THEME_KEY) as Theme | null;
  if (stored === 'light' || stored === 'dark') return stored;
  // First visit defaults to light theme for predictable UX.
  return 'light';
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export function initTheme() {
  try {
    const t = getPreferredTheme();
    applyTheme(t);
  } catch {
    // no-op
  }
}

export function toggleTheme(): Theme {
  const current = getPreferredTheme();
  const next: Theme = current === 'dark' ? 'light' : 'dark';
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
  return next;
}
