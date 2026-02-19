import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'MedEncyclopedia - Medicine & Compound Information',
    template: '%s | MedEncyclopedia',
  },
  description:
    'Educational platform providing structured, safe information about medicines, compounds, uses, and safety notes. For educational purposes only.',
  keywords: [
    'medicine',
    'compounds',
    'pharmacy',
    'medications',
    'health education',
    'drug encyclopedia',
    'medicine information',
    'compound information',
  ],
  openGraph: {
    type: 'website',
    siteName: 'MedEncyclopedia',
    title: 'MedEncyclopedia - Medicine & Compound Information',
    description:
      'Educational platform providing structured, safe information about medicines, compounds, uses, and safety notes. For educational purposes only.',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MedEncyclopedia - Medicine & Compound Information',
    description:
      'Educational platform providing structured, safe information about medicines, compounds, uses, and safety notes. For educational purposes only.',
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans`}>
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
