"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { toast } from "react-hot-toast";
import { FiCheck, FiX, FiClock, FiEye } from "react-icons/fi";

interface Contribution {
  _id: string;
  type: "compound" | "medicine" | "correction";
  title: string;
  description: string;
  relatedId?: string;
  userEmail?: string;
  status: "pending" | "approved" | "rejected";
  adminNotes?: string;
  acceptedBy?: {
    adminId: string | null;
    name: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export default function ContributionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");
  const [selectedContribution, setSelectedContribution] =
    useState<Contribution | null>(null);

  const [adminName, setAdminName] = useState("");
  const [isInvalidName, setIsInvalidName] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchContributions();
    }
  }, [status, filter]);

  const fetchContributions = async () => {
    try {
      setLoading(true);
      const url =
        filter === "all"
          ? "/api/contributions"
          : `/api/contributions?status=${filter}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.success) {
        setContributions(data.data);
      }
    } catch (error) {
      console.error("Error fetching contributions:", error);
      toast.error("Failed to load contributions");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (
    id: string,
    newStatus: "approved" | "rejected",
    notes?: string,
  ) => {
    if (!adminName.trim()) {
      setIsInvalidName(true);
      toast.error("Please enter your name before proceeding.");
      return;
    }

    try {
      const res = await fetch(`/api/contributions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          adminNotes: notes || "",
          acceptedBy: {
            adminId: null,
            name: adminName,
          },
        }),
      });

      if (res.status === 403) {
        const error = await res.json().catch(() => null);
        setIsInvalidName(true); // 🔥 shake + red
        toast.error(error?.message || "You are not allowed to approve this.");
        return;
      }

      const data = await res.json();

      if (data.success) {
        toast.success(`Contribution ${newStatus} successfully`);
        fetchContributions();
        setSelectedContribution(null);
        setAdminName("");
        setIsInvalidName(false);
      } else {
        toast.error(data.message || "Failed to update contribution");
      }
    } catch (error) {
      console.error("Error updating contribution:", error);
      toast.error("Failed to update contribution");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const filteredContributions =
    filter === "all"
      ? contributions
      : contributions.filter((c) => c.status === filter);

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: "bg-yellow-100 text-yellow-700",
      approved: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
    };
    return badges[status as keyof typeof badges] || "bg-gray-100 text-gray-700";
  };

  const getTypeBadge = (type: string) => {
    const badges = {
      compound: "bg-blue-100 text-blue-700",
      medicine: "bg-purple-100 text-purple-700",
      correction: "bg-orange-100 text-orange-700",
    };
    return badges[type as keyof typeof badges] || "bg-gray-100 text-gray-700";
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Contributions
          </h1>
          <p className="text-gray-600">Review and manage user contributions</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        {(["all", "pending", "approved", "rejected"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? "bg-primary-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Contributions List */}
      {filteredContributions.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-600">No contributions found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredContributions.map((contribution) => (
            <div key={contribution._id} className="card p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`badge ${getTypeBadge(contribution.type)}`}
                    >
                      {contribution.type}
                    </span>
                    <span
                      className={`badge ${getStatusBadge(contribution.status)}`}
                    >
                      {contribution.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {contribution.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-2 mb-3">
                    {contribution.description}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span>
                      {new Date(contribution.createdAt).toLocaleDateString()}
                    </span>
                    {contribution.userEmail && (
                      <span>{contribution.userEmail}</span>
                    )}
                  </div>
                  {contribution.adminNotes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Admin Notes:</strong> {contribution.adminNotes}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedContribution(contribution)}
                  >
                    <FiEye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  {contribution.status === "pending" && (
                    <>
                      <Button
                        variant="primary"
                        onClick={() =>
                          handleStatusUpdate(contribution._id, "approved")
                        }
                      >
                        <FiCheck className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() =>
                          handleStatusUpdate(contribution._id, "rejected")
                        }
                      >
                        <FiX className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for viewing full contribution */}
      {/* Modal for viewing full contribution */}
      {selectedContribution && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between px-6 py-4 border-b">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedContribution.title}
                </h2>
                <div className="flex gap-2 mt-2">
                  <span
                    className={`badge ${getTypeBadge(selectedContribution.type)}`}
                  >
                    {selectedContribution.type}
                  </span>
                  <span
                    className={`badge ${getStatusBadge(selectedContribution.status)}`}
                  >
                    {selectedContribution.status}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedContribution(null)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            {/* Content */}
            <div className="px-6 py-5 space-y-6">
              {/* Meta info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {selectedContribution.userEmail && (
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="text-gray-800 font-medium">
                      {selectedContribution.userEmail}
                    </p>
                  </div>
                )}

                {selectedContribution.relatedId && (
                  <div>
                    <p className="text-gray-500">Related ID</p>
                    <p className="text-gray-800 font-medium">
                      {selectedContribution.relatedId}
                    </p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Description
                </h3>
                <div className="bg-gray-50 border rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {selectedContribution.description}
                  </p>
                </div>
              </div>

              {/* Admin Notes */}
              {selectedContribution.adminNotes && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Admin Notes
                  </h3>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {selectedContribution.adminNotes}
                    </p>
                  </div>
                </div>
              )}

              {/* Admin Name Input */}
              {/* Admin Name / Approved By */}
              {selectedContribution.status === "pending" ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name (required)
                  </label>
                  <input
                    type="text"
                    className={`w-full border rounded-lg px-3 py-2 transition-all
                      ${isInvalidName ? "border-red-500 shake" : "border-gray-300"}
                    `}
                    placeholder="Type your name before approving/rejecting"
                    value={adminName}
                    onChange={(e) => {
                      setAdminName(e.target.value);
                      setIsInvalidName(false); // reset as soon as user types
                    }}
                  />
                  {isInvalidName && (
                    <p className="text-red-500 text-sm mt-1">
                      HOO LEE SHEET!! You don't have permission to handle
                      changes.
                    </p>
                  )}
                </div>
              ) : (
                selectedContribution.acceptedBy && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-gray-700">
                      <strong>
                        {selectedContribution.status === "approved"
                          ? "Approved"
                          : "Rejected"}{" "}
                        by:
                      </strong>{" "}
                      {selectedContribution.acceptedBy?.name}
                    </p>
                  </div>
                )
              )}
            </div>{" "}
            {/* Actions */}
            {selectedContribution.status === "pending" && (
              <div className="px-6 py-4 border-t bg-gray-50 flex gap-3">
                <Button
                  variant="primary"
                  disabled={!adminName.trim()}
                  className="flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() =>
                    handleStatusUpdate(selectedContribution._id, "approved")
                  }
                >
                  <FiCheck className="w-4 h-4 mr-2" />
                  Approve
                </Button>

                <Button
                  variant="secondary"
                  disabled={!adminName.trim()}
                  className="flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() =>
                    handleStatusUpdate(selectedContribution._id, "rejected")
                  }
                >
                  <FiX className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
