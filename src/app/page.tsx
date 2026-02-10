import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import Card from '@/components/Card';
import connectDB from '@/lib/mongodb';
import Compound from '@/models/Compound';
import Medicine from '@/models/Medicine';

export const metadata = {
  title: 'MedEncyclopedia - Medicine & Compound Information',
  description:
    'Comprehensive educational platform for medicine and compound information. Learn about compounds, medicines, uses, and safety.',
};

async function getPopularData() {
  await connectDB();

  const compounds = await Compound.find()
    .limit(6)
    .sort({ createdAt: -1 })
    .lean();

  const medicines = await Medicine.find()
    .populate('compound')
    .limit(6)
    .sort({ createdAt: -1 })
    .lean();

  return {
    compounds: JSON.parse(JSON.stringify(compounds)),
    medicines: JSON.parse(JSON.stringify(medicines)),
  };
}

export default async function Home() {
  const { compounds, medicines } = await getPopularData();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-900 mb-6 text-balance">
              Medicine & Compound Encyclopedia
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Educational platform providing structured, safe information about medicines, compounds, and general health education.
            </p>
            <div className="mb-6">
              <SearchBar />
            </div>
            <p className="text-sm text-gray-500">
              For educational purposes only. Not medical advice. Consult healthcare professionals.
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-12 text-center">
            Browse Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/compounds"
              className="card-hover p-8 text-center group"
            >
              <div className="text-5xl mb-4">💊</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                Compounds
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Explore chemical compounds and their properties
              </p>
            </Link>

            <Link
              href="/medicines"
              className="card-hover p-8 text-center group"
            >
              <div className="text-5xl mb-4">💉</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                Medicines
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Learn about medicines, brands, and usage
              </p>
            </Link>

            <Link
              href="/contribute"
              className="card-hover p-8 text-center group"
            >
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                Contribute
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Suggest new content or corrections
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Compounds */}
      {compounds.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
                Recently Added Compounds
              </h2>
              <Link
                href="/compounds"
                className="text-primary-600 hover:text-primary-700 font-medium text-sm inline-flex items-center gap-1 transition-colors"
              >
                View All
                <span>→</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {compounds.map((compound: any) => (
                <Card
                  key={compound._id}
                  title={compound.name}
                  description={compound.description}
                  href={`/compound/${compound.slug}`}
                  badge={compound.chemical_class}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Medicines */}
      {medicines.length > 0 && (
        <section className="section-padding bg-gray-50">
          <div className="container-custom">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
                Recently Added Medicines
              </h2>
              <Link
                href="/medicines"
                className="text-primary-600 hover:text-primary-700 font-medium text-sm inline-flex items-center gap-1 transition-colors"
              >
                View All
                <span>→</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {medicines.map((medicine: any) => (
                <Card
                  key={medicine._id}
                  title={medicine.name}
                  description={medicine.description}
                  href={`/medicine/${medicine.slug}`}
                  badge={medicine.compound?.name}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Disclaimer */}
      <section className="section-padding bg-white border-t border-gray-100">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Important Disclaimer
            </h3>
            <p className="text-gray-600 leading-relaxed">
              This website provides educational information only. It does not provide
              medical advice, diagnosis, or treatment. Always consult qualified
              healthcare professionals for any health concerns or before making any
              decisions related to your health or treatment.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
