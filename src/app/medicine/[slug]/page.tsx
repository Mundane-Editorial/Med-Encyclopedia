import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Medicine from '@/models/Medicine';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await connectDB();
  const medicine = await Medicine.findOne({ slug: params.slug })
    .populate('compound')
    .lean();

  if (!medicine) {
    return {
      title: 'Medicine Not Found',
    };
  }

  return {
    title: `${medicine.name} - Medicine Information | MedEncyclopedia`,
    description: medicine.description,
    keywords: [medicine.name, ...medicine.brand_names, 'medicine', 'medication'],
    openGraph: {
      title: medicine.name,
      description: medicine.description,
      type: 'article',
    },
  };
}

async function getMedicine(slug: string) {
  await connectDB();

  const medicine = await Medicine.findOne({ slug }).populate('compound').lean();

  if (!medicine) {
    return null;
  }

  return JSON.parse(JSON.stringify(medicine));
}

export default async function MedicinePage({ params }: Props) {
  const medicine = await getMedicine(params.slug);

  if (!medicine) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="section-padding bg-white border-b border-gray-100">
        <div className="container-custom">
          <div className="max-w-4xl">
            <div className="mb-4">
              <Link
                href={`/compound/${medicine.compound.slug}`}
                className="badge-primary hover:bg-primary-200 transition-colors inline-block"
              >
                {medicine.compound.name}
              </Link>
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4">
              {medicine.name}
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              {medicine.description}
            </p>
          </div>
        </div>
      </div>

      <div className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl space-y-8">
            {/* Brand Names */}
            {medicine.brand_names && medicine.brand_names.length > 0 && (
              <div className="card p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Brand Names
                </h2>
                <div className="flex flex-wrap gap-2">
                  {medicine.brand_names.map((brand: string, index: number) => (
                    <span key={index} className="badge-gray">
                      {brand}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* General Usage */}
            <div className="card p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                General Usage
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {medicine.general_usage_info}
              </p>
            </div>

            {/* Dosage Information */}
            <div className="card p-8 bg-blue-50/50 border-l-4 border-blue-400">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                General Dosage Information
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {medicine.general_dosage_info}
              </p>
              <p className="text-sm text-gray-600 italic">
                Always consult your healthcare provider for personalized dosage recommendations.
              </p>
            </div>

            {/* Interactions */}
            {medicine.interactions && (
              <div className="card p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Drug Interactions
                </h2>
                <p className="text-gray-700 leading-relaxed">{medicine.interactions}</p>
              </div>
            )}

            {/* Safety Information */}
            <div className="card p-8 border-l-4 border-yellow-400 bg-yellow-50/50">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">⚠️</span> Safety Information
              </h2>
              <p className="text-gray-700 leading-relaxed">{medicine.safety_info}</p>
            </div>

            {/* Related Compound */}
            <div className="card p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Active Compound
              </h2>
              <Link
                href={`/compound/${medicine.compound.slug}`}
                className="card-hover p-6 block group"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {medicine.compound.name}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {medicine.compound.description}
                </p>
                <span className="text-primary-600 font-medium text-sm inline-flex items-center gap-1 group-hover:underline">
                  Learn more
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </Link>
            </div>

            {/* JSON-LD Structured Data for SEO */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'Drug',
                  name: medicine.name,
                  description: medicine.description,
                  nonProprietaryName: medicine.compound.name,
                  identifier: medicine._id,
                }),
              }}
            />

            {/* Disclaimer */}
            <div className="card p-6 bg-gray-50 text-center">
              <p className="text-sm text-gray-600 leading-relaxed">
                This information is for educational purposes only. Always consult a
                qualified healthcare professional for medical advice, diagnosis, or
                treatment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
