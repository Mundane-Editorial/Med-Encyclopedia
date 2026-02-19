import Card from '@/components/Card';
import connectDB from '@/lib/mongodb';
import Compound from '@/models/Compound';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'All Compounds - MedEncyclopedia',
  description: 'Browse all chemical compounds and their educational information.',
};

async function getCompounds() {
  await connectDB();

  const compounds = await Compound.find()
    .sort({ name: 1 })
    .lean();

  return JSON.parse(JSON.stringify(compounds));
}

export default async function CompoundsPage() {
  const compounds = await getCompounds();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="section-padding bg-white border-b border-gray-100">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4">
              All Compounds
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Explore our comprehensive database of chemical compounds and their properties.
            </p>
          </div>
        </div>
      </div>

      <div className="section-padding">
        <div className="container-custom">
          {compounds.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-xl text-gray-600">
                No compounds available yet. Check back soon!
              </p>
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
}
