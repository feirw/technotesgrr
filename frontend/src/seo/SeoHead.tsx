import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getSeoForPathname } from '@/seo/seoConfig';
import { buildStructuredData } from '@/seo/schema';
import {
  DEFAULT_OG_IMAGE_PATH,
  SITE_NAME_FULL,
  SITE_TAGLINE,
  canonicalUrl,
  ogImageUrl,
} from '@/seo/siteMeta';

function upsertMeta(
  key: string,
  content: string,
  type: 'name' | 'property',
  attribute: string = type,
) {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attribute}="${key}"][data-seo-managed="true"]`,
  );
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attribute, key);
    el.dataset.seoManaged = 'true';
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(
    `link[rel="${rel}"][data-seo-managed="true"]`,
  );
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    el.dataset.seoManaged = 'true';
    document.head.appendChild(el);
  }
  el.href = href;
}

function upsertJsonLd(id: string, data: object) {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement('script');
    el.id = id;
    el.type = 'application/ld+json';
    el.dataset.seoManaged = 'true';
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

function removeManagedJsonLd(id: string) {
  document.getElementById(id)?.remove();
}

const SeoHead: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const page = getSeoForPathname(pathname);
    const canonical = canonicalUrl(pathname);
    const robots = page.robots ?? (page.noindex ? 'noindex, follow' : 'index, follow');
    const ogTitle = page.ogTitle ?? page.title;
    const imagePath = page.ogImage ?? DEFAULT_OG_IMAGE_PATH;
    const imageUrl = ogImageUrl(imagePath);
    const imageAlt = `${ogTitle} — ${SITE_TAGLINE}`;

    document.title = page.title;
    document.documentElement.lang = 'el';

    upsertMeta('description', page.description, 'name');
    upsertMeta('robots', robots, 'name');
    upsertMeta('title', page.title, 'name');

    upsertMeta('og:title', ogTitle, 'property');
    upsertMeta('og:description', page.description, 'property');
    upsertMeta('og:image', imageUrl, 'property');
    upsertMeta('og:image:secure_url', imageUrl, 'property');
    upsertMeta('og:image:alt', imageAlt, 'property');
    upsertMeta('og:url', canonical, 'property');
    upsertMeta('og:type', 'website', 'property');
    upsertMeta('og:locale', 'el_GR', 'property');
    upsertMeta('og:site_name', SITE_NAME_FULL, 'property');

    upsertMeta('twitter:card', 'summary_large_image', 'name');
    upsertMeta('twitter:title', ogTitle, 'name');
    upsertMeta('twitter:description', page.description, 'name');
    upsertMeta('twitter:image', imageUrl, 'name');
    upsertMeta('twitter:image:alt', imageAlt, 'name');

    upsertLink('canonical', canonical);

    const graphs = buildStructuredData(page, pathname);
    removeManagedJsonLd('seo-jsonld-graph');
    upsertJsonLd('seo-jsonld-graph', {
      '@context': 'https://schema.org',
      '@graph': graphs,
    });
  }, [pathname]);

  return null;
};

export default SeoHead;
