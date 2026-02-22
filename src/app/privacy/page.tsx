import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Privacy policy for MedEncyclopedia. How we collect, use, and protect your information when you use our educational medicine and compound database.',
  openGraph: {
    title: `Privacy Policy | ${SITE_NAME}`,
    description: 'Privacy policy for MedEncyclopedia.',
    url: '/privacy',
  },
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

      <div className="space-y-8 text-gray-700">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
          <p className="leading-relaxed">
            MedEncyclopedia ("we", "our", "us") is committed to protecting your privacy.
            This Privacy Policy explains how we collect, use, and safeguard information
            when you visit our website.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Information We Collect
          </h2>
          <p className="leading-relaxed mb-4">
            We collect minimal information necessary to operate the website:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Usage Data:</strong> Browser type, pages visited, time spent on
              pages
            </li>
            <li>
              <strong>Cookies:</strong> Session cookies for admin authentication
            </li>
            <li>
              <strong>Admin Data:</strong> Email and encrypted password for admin users
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            How We Use Information
          </h2>
          <p className="leading-relaxed mb-4">We use collected information to:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Provide and maintain the website</li>
            <li>Improve user experience</li>
            <li>Authenticate admin users</li>
            <li>Monitor website performance</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies</h2>
          <p className="leading-relaxed">
            We use cookies for admin session management only. You can disable cookies in
            your browser settings, but this may affect admin functionality.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
          <p className="leading-relaxed">
            We implement appropriate security measures to protect your information.
            However, no method of transmission over the Internet is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Services</h2>
          <p className="leading-relaxed">
            We do not share your personal information with third parties except as
            required by law or to protect our rights.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
          <p className="leading-relaxed">
            Our website is not directed to children under 13. We do not knowingly collect
            information from children.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Changes to This Policy
          </h2>
          <p className="leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of
            any changes by posting the new policy on this page.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
          <p className="leading-relaxed">
            If you have questions about this Privacy Policy, please contact us through
            our website.
          </p>
        </section>
      </div>

      <div className="mt-12 p-6 bg-gray-100 rounded-lg">
        <p className="text-sm text-gray-600 text-center">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
