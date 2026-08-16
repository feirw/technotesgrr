import { getConfiguredSiteOrigin, getSiteOrigin } from '@/utils/siteUrl';

/** Canonical production domain when env is unset (local dev uses window.location). */
export const DEFAULT_SITE_ORIGIN = 'https://www.technotes.gr';

export const SITE_NAME = 'Technotes';
export const SITE_NAME_FULL = 'technotesgr';
export const SITE_TAGLINE = 'Πληροφορική για τις Πανελλήνιες';

export const DEFAULT_OG_IMAGE_PATH = '/og/default.png';

export const LOGO_PATH = '/images/logo.png';
export const LOGO_URL = `${DEFAULT_SITE_ORIGIN}${LOGO_PATH}`;

export const DISCORD_INVITE_URL = 'https://discord.gg/b7BEHVFhaZ';

export const SOCIAL_LINKS = [
  'https://instagram.com/technotesgr',
  'https://tiktok.com/@technotesgr',
  'https://www.linkedin.com/company/technotesgr/',
  'https://www.youtube.com/@technotesgr-elenizafeiri',
  DISCORD_INVITE_URL,
] as const;

export function resolveSiteOrigin(): string {
  return getConfiguredSiteOrigin() || (import.meta.env.PROD ? DEFAULT_SITE_ORIGIN : getSiteOrigin() || DEFAULT_SITE_ORIGIN);
}

export function absoluteUrl(path: string): string {
  const origin = resolveSiteOrigin();
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${origin}${normalized}`;
}

export function canonicalUrl(pathname: string): string {
  const path =
    pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname || '/';
  return absoluteUrl(path);
}

export function ogImageUrl(imagePath: string): string {
  return absoluteUrl(imagePath);
}
