'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FiMenu, FiX, FiSearch } from 'react-icons/fi';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center group">
            <span className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
              MedEncyclopedia
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/compounds"
              className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
            >
              Compounds
            </Link>
            <Link
              href="/medicines"
              className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
            >
              Medicines
            </Link>
            <Link
              href="/contribute"
              className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
            >
              Contribute
            </Link>
            <Link
              href="/search"
              className="text-gray-600 hover:text-primary-600 transition-colors p-2"
              aria-label="Search"
            >
              <FiSearch className="w-5 h-5" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700 hover:text-primary-600 p-2"
            aria-label="Toggle menu"
          >
            {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="container-custom py-4 space-y-1">
            <Link
              href="/"
              className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/compounds"
              className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Compounds
            </Link>
            <Link
              href="/medicines"
              className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Medicines
            </Link>
            <Link
              href="/contribute"
              className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Contribute
            </Link>
            <Link
              href="/search"
              className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Search
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
