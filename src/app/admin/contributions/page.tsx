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

  correctionType?: "compound" | "medicine";
  correctionTarget?: string;

  // dynamic fields
  name?: string;
  chemical_class?: string;
  mechanism_of_action?: string;
  common_uses?: string[] | string;
  common_side_effects?: string[] | string;
  warnings?: string;

  compound?: string;
  brand_names?: string[] | string;
  general_usage_info?: string;
  general_dosage_info?: string;
  interactions?: string;
  safety_info?: string;

  // ⭐ ADD THIS — fixes your error
  [key: string]: any;
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

  // Field labels for modal display
  const FIELD_LABELS: Record<string, string> = {
    name: "Name",
    chemical_class: "Chemical class",
    mechanism_of_action: "Mechanism of action",
    common_uses: "Common uses",
    common_side_effects: "Common side effects",
    warnings: "Warnings",
    compound: "Related compound",
    brand_names: "Brand names",
    general_usage_info: "General usage info",
    general_dosage_info: "General dosage info",
    interactions: "Interactions",
    safety_info: "Safety info",
  };

  const getSubmittedFieldsForModal = (c: Contribution) => {
    const isCompound =
      c.type === "compound" || c.correctionType === "compound";
    const isMedicine =
      c.type === "medicine" || c.correctionType === "medicine";
    const compoundFields = [
      "name",
      "chemical_class",
      "mechanism_of_action",
      "common_uses",
      "common_side_effects",
      "warnings",
    ];
    const medicineFields = [
      "name",
      "compound",
      "brand_names",
      "general_usage_info",
      "general_dosage_info",
      "interactions",
      "safety_info",
    ];
    const keys = isCompound ? compoundFields : isMedicine ? medicineFields : [];
    return keys
      .map((key) => {
        const value = c[key as keyof Contribution];
        if (value === undefined || value === null) return null;
        if (typeof value === "string" && !value.trim()) return null;
        if (Array.isArray(value) && value.length === 0) return null;
        const label = FIELD_LABELS[key] || key.replace(/_/g, " ");
        return { key, label, value };
      })
      .filter((x): x is { key: string; label: string; value: unknown } =>
        Boolean(x),
      );
  };

  const getModalSubtitle = (c: Contribution) => {
    if (c.type === "correction") {
      const target =
        c.correctionTarget || c.relatedId;
      const typeLabel = c.correctionType
        ? `${c.correctionType.charAt(0).toUpperCase() + c.correctionType.slice(1)}`
        : "Item";
      return target ? `Correction for ${typeLabel} (${target})` : "Correction";
    }
    if (c.type === "compound") return "New compound";
    if (c.type === "medicine") return "New medicine";
    return null;
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
      {selectedContribution && (() => {
        const submittedFields = getSubmittedFieldsForModal(selectedContribution);
        const hasSubmittedFields = submittedFields.length > 0;
        const modalSubtitle = getModalSubtitle(selectedContribution);
        return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between px-6 py-4 border-b">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedContribution.title}
                </h2>
                {modalSubtitle && (
                  <p className="text-sm text-gray-500 mt-1">{modalSubtitle}</p>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
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
                  {selectedContribution.userEmail && (
                    <span className="text-xs text-gray-500">
                      {selectedContribution.userEmail}
                    </span>
                  )}
                  <span className="text-xs text-gray-400">
                    {new Date(selectedContribution.createdAt).toLocaleDateString()}
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
            <div className="px-6 py-5 space-y-5">
              {/* Correction: link to target (only for corrections) */}
              {selectedContribution.type === "correction" &&
                (selectedContribution.correctionTarget ||
                  selectedContribution.relatedId) && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-gray-500">Correcting:</span>
                    <button
                      type="button"
                      onClick={() => {
                        const targetId =
                          selectedContribution.correctionTarget ||
                          selectedContribution.relatedId;
                        const cType =
                          selectedContribution.correctionType || "compound";
                        router.push(
                          cType === "compound"
                            ? `/admin/compounds/${targetId}`
                            : `/admin/medicines/${targetId}`,
                        );
                      }}
                      className="text-sm text-primary-600 hover:text-primary-700 underline"
                    >
                      View {selectedContribution.correctionType || "item"} →
                    </button>
                  </div>
                )}

              {/* Description */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Description
                </h3>
                <div className="bg-gray-50 border rounded-lg p-4">
                  <p className="whitespace-pre-wrap text-gray-700 text-sm">
                    {selectedContribution.description}
                  </p>
                </div>
              </div>

              {/* Submitted data: only when we have stored fields */}
              {hasSubmittedFields && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Submitted data
                  </h3>
                  <div className="bg-gray-50 border rounded-lg divide-y divide-gray-200">
                    {submittedFields.map(({ key, label, value }) => (
                      <div key={key} className="px-4 py-3">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                          {label}
                        </p>
                        <p className="text-sm text-gray-800 whitespace-pre-wrap">
                          {Array.isArray(value) ? value.join(", ") : String(value)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ADMIN NOTES */}
              {selectedContribution.adminNotes && (
                <div>
                  <h3 className="text-sm font-medium mb-2 text-gray-700">
                    Admin Notes
                  </h3>
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                    <p className="whitespace-pre-wrap">
                      {selectedContribution.adminNotes}
                    </p>
                  </div>
                </div>
              )}

              {/* Admin Name */}
              {selectedContribution.status === "pending" ? (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Your Name (required)
                  </label>
                  <input
                    className={`w-full border rounded-lg px-3 py-2 ${
                      isInvalidName ? "border-red-500 shake" : "border-gray-300"
                    }`}
                    value={adminName}
                    onChange={(e) => {
                      setAdminName(e.target.value);
                      setIsInvalidName(false);
                    }}
                  />
                </div>
              ) : (
                selectedContribution.acceptedBy && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm">
                      <strong>
                        {selectedContribution.status === "approved"
                          ? "Approved"
                          : "Rejected"}{" "}
                        by:
                      </strong>{" "}
                      {selectedContribution.acceptedBy.name}
                    </p>
                  </div>
                )
              )}
            </div>

            {/* ACTION BUTTONS */}
            {selectedContribution.status === "pending" && (
              <div className="px-6 py-4 border-t bg-gray-50 flex gap-3">
                <Button
                  variant="primary"
                  disabled={!adminName.trim()}
                  className="flex-1"
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
                  className="flex-1"
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
        );
      })()}
    </div>
  );
}
