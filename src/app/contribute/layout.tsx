import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Contribute',
  description:
    'Suggest new compounds or medicines, or submit corrections to existing entries. Help improve MedEncyclopedia for educational use.',
  keywords: ['contribute', 'submit', 'corrections', 'medicine database', 'compound database'],
  openGraph: {
    title: `Contribute | ${SITE_NAME}`,
    description:
      'Suggest new compounds or medicines, or submit corrections to existing entries.',
    url: '/contribute',
  },
  alternates: { canonical: '/contribute' },
};

export default function ContributeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
