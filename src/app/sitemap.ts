import type { MetadataRoute } from 'next';
import connectDB from '@/lib/mongodb';
import Compound from '@/models/Compound';
import Medicine from '@/models/Medicine';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(
      /\/$/,
      ''
    );

  // Static routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/compounds`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/medicines`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/search`,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/disclaimer`,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      changeFrequency: 'yearly',
      priority: 0.3,
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
      (compound: any) => ({
        url: `${baseUrl}/compound/${compound.slug}`,
        lastModified: compound.updatedAt ?? new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    );

    const medicineEntries: MetadataRoute.Sitemap = medicines.map(
      (medicine: any) => ({
        url: `${baseUrl}/medicine/${medicine.slug}`,
        lastModified: medicine.updatedAt ?? new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    );

    return [...routes, ...compoundEntries, ...medicineEntries];
  } catch {
    // If the database is not reachable (e.g., during certain build scenarios),
    // still return the static routes so the sitemap is never completely broken.
    return routes;
  }
}
