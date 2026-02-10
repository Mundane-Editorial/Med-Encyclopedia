'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiSearch } from 'react-icons/fi';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search medicines, compounds..."
          className="w-full px-5 py-3.5 pl-12 text-base border border-gray-200 rounded-xl bg-white shadow-soft focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
        />
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
          <FiSearch className="w-5 h-5" />
        </div>
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-primary px-6 py-2.5 rounded-lg"
          aria-label="Search"
        >
          Search
        </button>
      </div>
    </form>
  );
}
