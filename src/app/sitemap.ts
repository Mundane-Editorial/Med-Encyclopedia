import type { MetadataRoute } from 'next';
import connectDB from '@/lib/mongodb';
import Compound from '@/models/Compound';
import Medicine from '@/models/Medicine';
import { getBaseUrl } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const now = new Date();

  // Static routes – important for discoverability
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/compounds`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/medicines`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contribute`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
  ];

  // Dynamic routes based on current database contents
  try {
    await connectDB();

    const [compounds, medicines] = await Promise.all([
      Compound.find({}, { slug: 1, updatedAt: 1 }).lean(),
      Medicine.find({}, { slug: 1, updatedAt: 1 }).lean(),
    ]);

    const compoundEntries: MetadataRoute.Sitemap = compounds.map(
      (compound: { slug: string; updatedAt?: Date }) => ({
        url: `${baseUrl}/compound/${compound.slug}`,
        lastModified: compound.updatedAt ?? now,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })
    );

    const medicineEntries: MetadataRoute.Sitemap = medicines.map(
      (medicine: { slug: string; updatedAt?: Date }) => ({
        url: `${baseUrl}/medicine/${medicine.slug}`,
        lastModified: medicine.updatedAt ?? now,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })
    );

    return [...routes, ...compoundEntries, ...medicineEntries];
  } catch {
    // If the database is not reachable (e.g., during certain build scenarios),
    // still return the static routes so the sitemap is never completely broken.
    return routes;
  }
}
