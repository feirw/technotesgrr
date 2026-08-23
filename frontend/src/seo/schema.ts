import type { BreadcrumbItem, PageSeo } from '@/seo/seoConfig';
import {
  DEFAULT_SITE_ORIGIN,
  LOGO_URL,
  SITE_NAME,
  SITE_NAME_FULL,
  SOCIAL_LINKS,
  absoluteUrl,
  canonicalUrl,
} from '@/seo/siteMeta';

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: SITE_NAME,
    alternateName: SITE_NAME_FULL,
    url: DEFAULT_SITE_ORIGIN,
    logo: LOGO_URL,
    description:
      'Online πλατφόρμα προετοιμασίας για Πανελλήνιες Πληροφορικής: quiz, flashcards, δομές δεδομένων, αλγόριθμοι, παλιά θέματα και ασκήσεις.',
    areaServed: {
      '@type': 'Country',
      name: 'Greece',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Αθήνα',
      addressRegion: 'Αττική',
      addressCountry: 'GR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 37.9838,
      longitude: 23.7275,
    },
    inLanguage: 'el-GR',
    sameAs: [...SOCIAL_LINKS],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      availableLanguage: ['Greek'],
      url: SOCIAL_LINKS[0],
    },
  };
}

export function buildCourseSchema(pageUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'Προετοιμασία Πανελληνίων Πληροφορικής',
    description:
      'Δωρεάν online προετοιμασία Πληροφορικής Γ\' Λυκείου: quiz, flashcards, δομές δεδομένων, αλγόριθμοι, παλιά θέματα και ασκήσεις.',
    provider: {
      '@type': 'EducationalOrganization',
      name: SITE_NAME,
      url: DEFAULT_SITE_ORIGIN,
    },
    url: pageUrl,
    inLanguage: 'el-GR',
    educationalLevel: 'Secondary education',
    teaches: [
      'Quiz Πληροφορικής',
      'Flashcards',
      'Δομές Δεδομένων',
      'Αλγόριθμοι',
      'Παλιά Θέματα Πανελληνίων',
      'Πληροφορική Πανελλήνιες',
    ],
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: 'P1Y',
    },
  };
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildStructuredData(page: PageSeo, pathname: string): object[] {
  const pageUrl = canonicalUrl(pathname);
  const graphs: object[] = [buildOrganizationSchema()];

  if (page.includeCourseSchema) {
    graphs.push(buildCourseSchema(pageUrl));
  }

  if (page.breadcrumbs && page.breadcrumbs.length > 0) {
    graphs.push(buildBreadcrumbSchema(page.breadcrumbs));
  }

  return graphs;
}
