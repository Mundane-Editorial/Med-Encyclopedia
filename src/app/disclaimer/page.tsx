import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Disclaimer',
  description:
    'Important disclaimer: MedEncyclopedia is for educational purposes only. Not medical advice. Always consult a healthcare professional.',
  openGraph: {
    title: `Disclaimer | ${SITE_NAME}`,
    description:
      'Educational use only. Not medical advice. Consult a healthcare professional.',
    url: '/disclaimer',
  },
  alternates: { canonical: '/disclaimer' },
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Disclaimer</h1>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">⚠️ Important Notice</h2>
        <p className="text-gray-700 leading-relaxed">
          This website provides general educational information only. It is NOT medical
          advice and should NOT be relied upon as a substitute for professional medical
          consultation.
        </p>
      </div>

      <div className="space-y-8 text-gray-700">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Educational Purpose</h2>
          <p className="leading-relaxed">
            MedEncyclopedia is designed solely for educational and informational purposes.
            The content on this website is intended to provide general knowledge about
            medicines, compounds, and related health topics.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Not Medical Advice</h2>
          <p className="leading-relaxed mb-4">
            The information provided on this website does NOT constitute medical advice,
            diagnosis, or treatment. It should not be used to:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Self-diagnose any medical condition</li>
            <li>Prescribe or recommend medications</li>
            <li>Determine appropriate dosages</li>
            <li>Replace professional medical consultation</li>
            <li>Make treatment decisions</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Consult Healthcare Professionals
          </h2>
          <p className="leading-relaxed">
            Always seek the advice of your physician, pharmacist, or other qualified
            healthcare provider with any questions you may have regarding a medical
            condition, medication, or treatment. Never disregard professional medical
            advice or delay seeking it because of information you have read on this
            website.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Warranty</h2>
          <p className="leading-relaxed">
            While we strive to provide accurate and up-to-date information, we make no
            representations or warranties of any kind, express or implied, about the
            completeness, accuracy, reliability, suitability, or availability of the
            information contained on this website.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
          <p className="leading-relaxed">
            Under no circumstances shall MedEncyclopedia, its owners, or contributors be
            liable for any loss or damage arising from the use of this website or reliance
            on any information provided herein.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Links</h2>
          <p className="leading-relaxed">
            This website may contain links to external websites. We have no control over
            the content of these sites and accept no responsibility for them or for any
            loss or damage that may arise from your use of them.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Medical Emergencies</h2>
          <p className="leading-relaxed">
            If you think you may have a medical emergency, call your doctor or emergency
            services immediately. Do not rely on information from this website for
            emergency medical decisions.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to Content</h2>
          <p className="leading-relaxed">
            We reserve the right to modify, update, or remove any content on this website
            at any time without prior notice.
          </p>
        </section>
      </div>

      <div className="mt-12 p-6 bg-gray-100 rounded-lg">
        <p className="text-sm text-gray-600 text-center">
          By using this website, you acknowledge that you have read and understood this
          disclaimer and agree to its terms.
        </p>
      </div>
    </div>
  );
}
