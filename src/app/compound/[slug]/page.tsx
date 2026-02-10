import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Compound from '@/models/Compound';
import Medicine from '@/models/Medicine';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await connectDB();
  const compound = await Compound.findOne({ slug: params.slug }).lean();

  if (!compound) {
    return {
      title: 'Compound Not Found',
    };
  }

  return {
    title: `${compound.name} - Compound Information | MedEncyclopedia`,
    description: compound.description,
    keywords: [compound.name, compound.chemical_class, 'compound', 'medicine'],
    openGraph: {
      title: compound.name,
      description: compound.description,
      type: 'article',
    },
  };
}

async function getCompound(slug: string) {
  await connectDB();

  const compound = await Compound.findOne({ slug })
    .populate('related_medicines')
    .lean();

  if (!compound) {
    return null;
  }

  return JSON.parse(JSON.stringify(compound));
}

export default async function CompoundPage({ params }: Props) {
  const compound = await getCompound(params.slug);

  if (!compound) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="section-padding bg-white border-b border-gray-100">
        <div className="container-custom">
          <div className="max-w-4xl">
            <div className="mb-4">
              <span className="badge-primary">
                {compound.chemical_class}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4">
              {compound.name}
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              {compound.description}
            </p>
          </div>
        </div>
      </div>

      <div className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl space-y-8">
            {/* Mechanism of Action */}
            <div className="card p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Mechanism of Action
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {compound.mechanism_of_action}
              </p>
            </div>

            {/* Common Uses */}
            {compound.common_uses && compound.common_uses.length > 0 && (
              <div className="card p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Common Uses
                </h2>
                <ul className="space-y-2">
                  {compound.common_uses.map((use: string, index: number) => (
                    <li key={index} className="text-gray-700 flex items-start">
                      <span className="text-primary-600 mr-2 mt-1.5">•</span>
                      <span>{use}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Side Effects */}
            {compound.common_side_effects && compound.common_side_effects.length > 0 && (
              <div className="card p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Common Side Effects
                </h2>
                <ul className="space-y-2">
                  {compound.common_side_effects.map((effect: string, index: number) => (
                    <li key={index} className="text-gray-700 flex items-start">
                      <span className="text-primary-600 mr-2 mt-1.5">•</span>
                      <span>{effect}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Warnings */}
            {compound.warnings && (
              <div className="card p-8 border-l-4 border-yellow-400 bg-yellow-50/50">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">⚠️</span> Warnings
                </h2>
                <p className="text-gray-700 leading-relaxed">{compound.warnings}</p>
              </div>
            )}

            {/* Related Medicines */}
            {compound.related_medicines && compound.related_medicines.length > 0 && (
              <div className="card p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Medicines Using This Compound
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {compound.related_medicines.map((medicine: any) => (
                    <Link
                      key={medicine._id}
                      href={`/medicine/${medicine.slug}`}
                      className="card-hover p-5 group"
                    >
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                        {medicine.name}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {medicine.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* JSON-LD Structured Data for SEO */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'MedicalEntity',
                  name: compound.name,
                  description: compound.description,
                  identifier: compound._id,
                }),
              }}
            />

            {/* Disclaimer */}
            <div className="card p-6 bg-gray-50 text-center">
              <p className="text-sm text-gray-600 leading-relaxed">
                This information is for educational purposes only. Always consult a
                qualified healthcare professional for medical advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
