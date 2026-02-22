import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Providers } from "./providers";
import {
  getBaseUrl,
  getOrganizationJsonLd,
  getWebSiteJsonLd,
  SITE_DEFAULT_DESCRIPTION,
  SITE_NAME,
} from "@/lib/seo";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const siteUrl = getBaseUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE_NAME} - Medicine & Compound Information`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "medicine",
    "compounds",
    "pharmacy",
    "medications",
    "health education",
    "drug encyclopedia",
    "medicine information",
    "compound information",
    "drug information",
    "medical education",
  ],
  authors: [{ name: SITE_NAME, url: siteUrl }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} - Medicine & Compound Information`,
    description: SITE_DEFAULT_DESCRIPTION,
    url: "/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} - Medicine & Compound Information`,
    description: SITE_DEFAULT_DESCRIPTION,
  },
  alternates: {
    canonical: "/",
  },
  category: "education",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationJsonLd = getOrganizationJsonLd();
  const websiteJsonLd = getWebSiteJsonLd();

  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
          }}
        />
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
