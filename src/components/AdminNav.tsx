"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  FiHome,
  FiPackage,
  FiFileText,
  FiLogOut,
  FiInbox,
  FiBell,
} from "react-icons/fi";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminNav() {
  const pathname = usePathname();

  const { data } = useSWR("/api/contributions?status=pending", fetcher);
  const pending = data?.data?.length ?? 0;

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: FiHome },
    { href: "/admin/compounds", label: "Compounds", icon: FiPackage },
    { href: "/admin/medicines", label: "Medicines", icon: FiFileText },
    { href: "/admin/contributions", label: "Contributions", icon: FiInbox },
  ];

  return (
    <nav
      className="
        h-screen
        w-64
        flex-shrink-0
        bg-white
        border-r
        border-gray-200
        flex
        flex-col
        overflow-hidden
      "
    >
      {/* Header with logo */}
      <div className="p-4 flex items-center gap-3">
        <svg
          className="w-8 h-8 text-primary-600 flex-shrink-0"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
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
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Admin Panel</h1>
          <p className="text-sm text-gray-500 mt-0.5">Content Management</p>
        </div>
      </div>

      {/* Navigation (scrollable) */}
      <ul className="overflow-y-auto px-4 space-y-1 max-h-[calc(100vh-220px)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <li key={item.href} className="relative">
              <Link
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium truncate">
                  {item.label}
                </span>
              </Link>

              {/* Notification bell */}
              {item.label === "Contributions" && pending > 0 && (
                <FiBell className="absolute right-3 top-3 h-5 w-5 text-red-500 animate-pulse" />
              )}
            </li>
          );
        })}
      </ul>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <Link
          href="/"
          className="flex items-center space-x-3 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-sm font-medium"
        >
          <FiHome className="w-5 h-5 flex-shrink-0" />
          <span className="truncate">View Site</span>
        </Link>

        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors text-sm font-medium"
        >
          <FiLogOut className="w-5 h-5 flex-shrink-0" />
          <span className="truncate">Logout</span>
        </button>
      </div>
    </nav>
  );
}
