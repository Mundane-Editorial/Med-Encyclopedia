'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Textarea from '@/components/Textarea';
import { toast } from 'react-hot-toast';

type ContributionType = 'compound' | 'medicine' | 'correction';

export default function ContributePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'compound' as ContributionType,
    title: '',
    description: '',
    relatedId: '',
    userEmail: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    if (formData.type === 'correction' && !formData.relatedId.trim()) {
      newErrors.relatedId = 'Please provide the ID or name of the item to correct';
    }

    if (formData.userEmail && !/^\S+@\S+\.\S+$/.test(formData.userEmail)) {
      newErrors.userEmail = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/contributions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: formData.type,
          title: formData.title.trim(),
          description: formData.description.trim(),
          relatedId: formData.relatedId.trim() || undefined,
          userEmail: formData.userEmail.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Thank you! Your contribution has been submitted for review.');
        setFormData({
          type: 'compound',
          title: '',
          description: '',
          relatedId: '',
          userEmail: '',
        });
      } else {
        toast.error(data.message || 'Failed to submit contribution. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting contribution:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="section-padding bg-white border-b border-gray-100">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4">
              Contribute
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Help us improve by suggesting new content or corrections to existing information.
            </p>
          </div>
        </div>
      </div>

      <div className="section-padding">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <div className="card p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contribution Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contribution Type
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {(['compound', 'medicine', 'correction'] as ContributionType[]).map(
                      (type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, type, relatedId: type === 'correction' ? formData.relatedId : '' })
                          }
                          className={`px-4 py-3 rounded-lg border-2 transition-all ${
                            formData.type === type
                              ? 'border-primary-600 bg-primary-50 text-primary-700 font-medium'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Title */}
                <Input
                  label="Title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder={
                    formData.type === 'correction'
                      ? 'Title of the correction'
                      : `Name of the ${formData.type}`
                  }
                  error={errors.title}
                  required
                />

                {/* Description */}
                <Textarea
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={
                    formData.type === 'correction'
                      ? 'Describe the correction needed...'
                      : `Provide detailed information about the ${formData.type}...`
                  }
                  error={errors.description}
                  required
                />

                {/* Related ID (for corrections) */}
                {formData.type === 'correction' && (
                  <Input
                    label="Item to Correct"
                    type="text"
                    value={formData.relatedId}
                    onChange={(e) => setFormData({ ...formData, relatedId: e.target.value })}
                    placeholder="Name or ID of the compound/medicine to correct"
                    error={errors.relatedId}
                    required
                  />
                )}

                {/* Email (optional) */}
                <Input
                  label="Your Email (Optional)"
                  type="email"
                  value={formData.userEmail}
                  onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                  placeholder="your.email@example.com"
                  error={errors.userEmail}
                />

                {/* Disclaimer */}
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Note:</strong> All contributions are reviewed by administrators before
                    being published. We reserve the right to edit or reject submissions that
                    contain inappropriate content, synthesis instructions, or harmful guidance.
                  </p>
                </div>

                {/* Submit Button */}
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Submitting...' : 'Submit Contribution'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
