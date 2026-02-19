"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import Card from "@/components/Card";
import { FiPackage, FiFileText } from "react-icons/fi";

interface SearchResults {
  compounds: any[];
  medicines: any[];
  total: number;
}

export default function SearchComponent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<SearchResults>({
    compounds: [],
    medicines: [],
    total: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query) performSearch(query);
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    setLoading(true);

    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}`,
      );
      const data = await res.json();

      if (data.success) setResults(data.data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="section-padding bg-white border-b border-gray-100">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-8 text-center">
              Search
            </h1>
            <SearchBar />
          </div>
        </div>
      </div>

      <div className="section-padding">
        <div className="container-custom">
          {query && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Results for &quot;{query}&quot;
              </h2>
              <p className="text-gray-600">
                Found {results.total} result{results.total !== 1 ? "s" : ""}
              </p>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-2 border-primary-600 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Searching...</p>
            </div>
          )}

          {/* No results */}
          {!loading && query && results.total === 0 && (
            <div className="card p-12 text-center">
              <p className="text-xl text-gray-600">
                No results found for &quot;{query}&quot;. Try a different search
                term.
              </p>
            </div>
          )}

          {/* Compounds */}
          {!loading && results.compounds.length > 0 && (
            <div className="mb-12">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FiPackage className="w-6 h-6 text-primary-600" />
                Compounds ({results.compounds.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.compounds.map((compound) => (
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
          )}

          {/* Medicines */}
          {!loading && results.medicines.length > 0 && (
            <div className="mb-12">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FiFileText className="w-6 h-6 text-accent-600" />
                Medicines ({results.medicines.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.medicines.map((medicine) => (
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
          )}

          {/* No query */}
          {!query && !loading && (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600">
                Enter a search term to find compounds and medicines
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
