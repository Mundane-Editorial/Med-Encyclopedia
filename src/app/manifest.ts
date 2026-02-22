import type { MetadataRoute } from 'next';
import { getBaseUrl, SITE_DEFAULT_DESCRIPTION, SITE_NAME } from '@/lib/seo';

export default function manifest(): MetadataRoute.Manifest {
  const baseUrl = getBaseUrl();

  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: SITE_DEFAULT_DESCRIPTION,
    start_url: '/',
    scope: '/',
    display: 'browser',
    background_color: '#ffffff',
    theme_color: '#475872',
    categories: ['education', 'medical', 'reference'],
    lang: 'en',
  };
}
