import Card from '@/components/Card';
import connectDB from '@/lib/mongodb';
import Medicine from '@/models/Medicine';

export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'All Medicines',
  description:
    'Browse all medicines with usage, dosage, interactions, and safety information. Educational resource for medications and brand names.',
  keywords: ['medicines', 'medications', 'drugs', 'pharmacy', 'brand names', 'safety information'],
  openGraph: {
    title: `All Medicines | ${SITE_NAME}`,
    description:
      'Browse all medicines with usage, dosage, interactions, and safety information.',
    url: '/medicines',
  },
  alternates: { canonical: '/medicines' },
};

async function getMedicines() {
  await connectDB();

  const medicines = await Medicine.find()
    .populate('compound')
    .sort({ name: 1 })
    .lean();

  return JSON.parse(JSON.stringify(medicines));
}

export default async function MedicinesPage() {
  const medicines = await getMedicines();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="section-padding bg-white border-b border-gray-100">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4">
              All Medicines
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Explore our comprehensive database of medicines and their educational information.
            </p>
          </div>
        </div>
      </div>

      <div className="section-padding">
        <div className="container-custom">
          {medicines.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-xl text-gray-600">
                No medicines available yet. Check back soon!
              </p>
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
}
