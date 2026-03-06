/**
 * Central SEO config and helpers for MedEncyclopedia.
 * Use NEXT_PUBLIC_SITE_URL in production (e.g. https://medencyclopedia.com).
 */

export const SITE_NAME = 'MedEncyclopedia';
export const SITE_DEFAULT_DESCRIPTION =
  'Educational platform providing structured, safe information about medicines, compounds, uses, and safety notes. For educational purposes only.';

/** Base URL without trailing slash */
export function getBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(
    /\/$/,
    ''
  );
}

/** Absolute URL for a path (path should start with /) */
export function absoluteUrl(path: string): string {
  const base = getBaseUrl();
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}

/** Truncate text for meta description (recommended 150–160 chars) */
export function truncateMetaDescription(text: string, maxLength = 160): string {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3).trim() + '...';
}

/** Default OG image path (optional: add a real image to /public/og-default.png) */
export function getDefaultOgImageUrl(): string {
  return absoluteUrl('/og-default.png');
}

/** JSON-LD Organization for the site (omit logo if not present to avoid 404) */
export function getOrganizationJsonLd() {
  const url = getBaseUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url,
    description: SITE_DEFAULT_DESCRIPTION,
  };
}

/** JSON-LD WebSite with optional SearchAction (sitelinks search box) */
export function getWebSiteJsonLd() {
  const url = getBaseUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url,
    description: SITE_DEFAULT_DESCRIPTION,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}
