"use client";

import Link from "next/link";
import { useState } from "react";
import { FiMenu, FiX, FiSearch } from "react-icons/fi";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white/80 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50">
      <div className="container-custom">
        {/* TOP BAR */}
        <div className="flex items-center justify-between h-16">
          {/* LEFT — LOGO */}
          <Link href="/" className="flex items-center gap-2 group">
            <svg
              className="w-8 h-8 text-primary-600 dark:text-primary-400 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors flex-shrink-0"
              viewBox="0 0 40 40"
              fill="none"
            >
              <rect
                x="6"
                y="14"
                width="28"
                height="12"
                rx="6"
                fill="currentColor"
                opacity="0.9"
              />
              <rect
                x="8"
                y="16"
                width="24"
                height="8"
                rx="4"
                fill="white"
                opacity="0.3"
              />
              <path
                d="M12 10v4M28 10v4M20 6v4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.8"
              />
            </svg>
            <span className="text-xl font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              MedEncyclopedia
            </span>
          </Link>

          {/* MIDDLE + RIGHT — DESKTOP */}
          <div className="hidden md:flex items-center justify-between w-full ml-10">
            {/* CENTER NAVIGATION */}
            <div className="flex items-center gap-8 mx-auto">
              <Link href="/" className="nav-link">
                Home
              </Link>
              <Link href="/compounds" className="nav-link">
                Compounds
              </Link>
              <Link href="/medicines" className="nav-link">
                Medicines
              </Link>
              <Link href="/contribute" className="nav-link">
                Contribute
              </Link>

              {/* Search Icon */}
              <Link
                href="/search"
                aria-label="Search"
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                <FiSearch className="w-5 h-5" />
              </Link>
            </div>

            {/* RIGHT — Theme toggle */}
            <div>
              <ThemeToggle />
            </div>
          </div>

          {/* RIGHT — MOBILE */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
          <div className="container-custom py-4 space-y-1">
            <Link
              href="/"
              className="mobile-link"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>

            <Link
              href="/compounds"
              className="mobile-link"
              onClick={() => setIsOpen(false)}
            >
              Compounds
            </Link>

            <Link
              href="/medicines"
              className="mobile-link"
              onClick={() => setIsOpen(false)}
            >
              Medicines
            </Link>

            <Link
              href="/contribute"
              className="mobile-link"
              onClick={() => setIsOpen(false)}
            >
              Contribute
            </Link>

            <Link
              href="/search"
              className="mobile-link"
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
