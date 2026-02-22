import type { Metadata } from 'next';
import { Suspense } from "react";
import SearchComponent from "./SearchComponent";
import { SITE_NAME } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Search',
  description: `Search medicines and compounds on ${SITE_NAME}. Find drug information, mechanism of action, uses, and safety.`,
  openGraph: {
    title: `Search | ${SITE_NAME}`,
    description: `Search medicines and compounds. Find drug information and safety.`,
    url: '/search',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: '/search' },
};

export default function SearchPageWrapper() {
  return (
    <Suspense
      fallback={<div className="p-10 text-center">Loading search...</div>}
    >
      <SearchComponent />
    </Suspense>
  );
}
