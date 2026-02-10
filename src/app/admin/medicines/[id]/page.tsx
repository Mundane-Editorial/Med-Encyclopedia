'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

interface Compound {
  _id: string;
  name: string;
}

export default function EditMedicinePage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [compounds, setCompounds] = useState<Compound[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    compound: '',
    brand_names: '',
    general_usage_info: '',
    general_dosage_info: '',
    interactions: '',
    safety_info: '',
  });

  useEffect(() => {
    fetchCompounds();
    fetchMedicine();
  }, []);

  const fetchCompounds = async () => {
    try {
      const res = await fetch('/api/compounds');
      const data = await res.json();
      if (data.success) {
        setCompounds(data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch compounds');
    }
  };

  const fetchMedicine = async () => {
    try {
      const res = await fetch(`/api/medicines/${params.id}`);
      const data = await res.json();

      if (data.success) {
        const medicine = data.data;
        setFormData({
          name: medicine.name,
          description: medicine.description,
          compound: medicine.compound._id,
          brand_names: medicine.brand_names.join('\n'),
          general_usage_info: medicine.general_usage_info,
          general_dosage_info: medicine.general_dosage_info,
          interactions: medicine.interactions,
          safety_info: medicine.safety_info,
        });
      }
    } catch (error) {
      toast.error('Failed to fetch medicine');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        brand_names: formData.brand_names.split('\n').filter((s) => s.trim()),
      };

      const res = await fetch(`/api/medicines/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Medicine updated successfully!');
        router.push('/admin/medicines');
      } else {
        toast.error(data.error || 'Failed to update medicine');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Medicine</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 max-w-4xl">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Medicine Name *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Compound *
            </label>
            <select
              name="compound"
              required
              value={formData.compound}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select a compound</option>
              {compounds.map((compound) => (
                <option key={compound._id} value={compound._id}>
                  {compound.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand Names (one per line)
            </label>
            <textarea
              name="brand_names"
              value={formData.brand_names}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              General Usage Info *
            </label>
            <textarea
              name="general_usage_info"
              required
              value={formData.general_usage_info}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              General Dosage Info
            </label>
            <textarea
              name="general_dosage_info"
              value={formData.general_dosage_info}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interactions
            </label>
            <textarea
              name="interactions"
              value={formData.interactions}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Safety Info *
            </label>
            <textarea
              name="safety_info"
              required
              value={formData.safety_info}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Medicine'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
