'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';

interface Medicine {
  _id: string;
  name: string;
  description: string;
  compound: {
    name: string;
  };
  slug: string;
}

export default function MedicinesPage() {
  const { status } = useSession();
  const router = useRouter();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const res = await fetch('/api/medicines');
      const data = await res.json();
      if (data.success) {
        setMedicines(data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch medicines');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this medicine?')) return;

    try {
      const res = await fetch(`/api/medicines/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Medicine deleted successfully');
        fetchMedicines();
      } else {
        toast.error('Failed to delete medicine');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Medicines</h1>
        <Link
          href="/admin/medicines/new"
          className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition flex items-center space-x-2"
        >
          <FiPlus />
          <span>Add Medicine</span>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Compound
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {medicines.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  No medicines found. Add your first medicine!
                </td>
              </tr>
            ) : (
              medicines.map((medicine) => (
                <tr key={medicine._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {medicine.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {medicine.compound?.name || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 line-clamp-2">
                      {medicine.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Link
                      href={`/admin/medicines/${medicine._id}`}
                      className="text-primary-600 hover:text-primary-900 inline-flex items-center space-x-1"
                    >
                      <FiEdit />
                      <span>Edit</span>
                    </Link>
                    <button
                      onClick={() => handleDelete(medicine._id)}
                      className="text-red-600 hover:text-red-900 inline-flex items-center space-x-1"
                    >
                      <FiTrash2 />
                      <span>Delete</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
