'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

export default function EditCompoundPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    chemical_class: '',
    mechanism_of_action: '',
    common_uses: '',
    common_side_effects: '',
    warnings: '',
  });

  useEffect(() => {
    fetchCompound();
  }, []);

  const fetchCompound = async () => {
    try {
      const res = await fetch(`/api/compounds/${params.id}`);
      const data = await res.json();

      if (data.success) {
        const compound = data.data;
        setFormData({
          name: compound.name,
          description: compound.description,
          chemical_class: compound.chemical_class,
          mechanism_of_action: compound.mechanism_of_action,
          common_uses: compound.common_uses.join('\n'),
          common_side_effects: compound.common_side_effects.join('\n'),
          warnings: compound.warnings,
        });
      }
    } catch (error) {
      toast.error('Failed to fetch compound');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
        common_uses: formData.common_uses.split('\n').filter((s) => s.trim()),
        common_side_effects: formData.common_side_effects
          .split('\n')
          .filter((s) => s.trim()),
      };

      const res = await fetch(`/api/compounds/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Compound updated successfully!');
        router.push('/admin/compounds');
      } else {
        toast.error(data.error || 'Failed to update compound');
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Compound</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 max-w-4xl">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Compound Name *
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
              Chemical Class *
            </label>
            <input
              type="text"
              name="chemical_class"
              required
              value={formData.chemical_class}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
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
              Mechanism of Action *
            </label>
            <textarea
              name="mechanism_of_action"
              required
              value={formData.mechanism_of_action}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Common Uses (one per line)
            </label>
            <textarea
              name="common_uses"
              value={formData.common_uses}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Common Side Effects (one per line)
            </label>
            <textarea
              name="common_side_effects"
              value={formData.common_side_effects}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Warnings
            </label>
            <textarea
              name="warnings"
              value={formData.warnings}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Compound'}
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
