"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiPackage, FiFileText, FiTrendingUp } from "react-icons/fi";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    compounds: 0,
    medicines: 0,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [compoundsRes, medicinesRes] = await Promise.all([
          fetch("/api/compounds"),
          fetch("/api/medicines"),
        ]);

        const compoundsData = await compoundsRes.json();
        const medicinesData = await medicinesRes.json();

        setStats({
          compounds: compoundsData.data?.length || 0,
          medicines: medicinesData.data?.length || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    if (status === "authenticated") {
      fetchStats();
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Welcome back, Admin!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Total Compounds
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.compounds}
              </p>
            </div>
            <div className="bg-primary-100 p-4 rounded-full">
              <FiPackage className="w-8 h-8 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Total Medicines
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.medicines}
              </p>
            </div>
            <div className="bg-green-100 p-4 rounded-full">
              <FiFileText className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Entries</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.compounds + stats.medicines}
              </p>
            </div>
            <div className="bg-purple-100 p-4 rounded-full">
              <FiTrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/admin/compounds"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Manage Compounds
          </h3>
          <p className="text-gray-600">
            Add, edit, or delete compound information
          </p>
        </Link>

        <Link
          href="/admin/medicines"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Manage Medicines
          </h3>
          <p className="text-gray-600">
            Add, edit, or delete medicine information
          </p>
        </Link>
      </div>
    </div>
  );
}
