import { fetchAllCompounds, fetchAllMedicines } from "@/lib/sitemap-data";

export default async function sitemap() {
  const compounds = await fetchAllCompounds();
  const medicines = await fetchAllMedicines();

  const base = "https://yourdomain.com";

  return [
    { url: base, lastModified: new Date() },
    { url: `${base}/compounds` },
    { url: `${base}/medicines` },
    { url: `${base}/search` },
    { url: `${base}/disclaimer` },
    { url: `${base}/privacy` },

    ...compounds.map((c) => ({
      url: `${base}/compound/${c.slug}`,
      lastModified: new Date(),
    })),

    ...medicines.map((m) => ({
      url: `${base}/medicine/${m.slug}`,
      lastModified: new Date(),
    })),
  ];
}
