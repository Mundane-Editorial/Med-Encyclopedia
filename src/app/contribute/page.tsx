"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Textarea from "@/components/Textarea";
import { toast } from "react-hot-toast";

type ContributionType = "compound" | "medicine" | "correction";

interface Compound {
  _id: string;
  name: string;
}

interface Medicine {
  _id: string;
  name: string;
}

export default function ContributePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [compounds, setCompounds] = useState<Compound[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);

  const [correctionType, setCorrectionType] = useState<
    "" | "compound" | "medicine"
  >("");

  const [correctionTarget, setCorrectionTarget] = useState("");

  const [originalData, setOriginalData] = useState<any>(null);

  const [formData, setFormData] = useState({
    type: "compound" as ContributionType,

    // compounds & corrections
    name: "",
    chemical_class: "",
    mechanism_of_action: "",
    common_uses: "",
    common_side_effects: "",
    warnings: "",

    // medicines & corrections
    compound: "",
    brand_names: "",
    general_usage_info: "",
    general_dosage_info: "",
    interactions: "",
    safety_info: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load dropdown data
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const c = await fetch("/api/compounds").then((r) => r.json());
      if (c.success) setCompounds(c.data);

      const m = await fetch("/api/medicines").then((r) => r.json());
      if (m.success) setMedicines(m.data);
    } catch {
      toast.error("Failed to load reference data.");
    }
  };

  // Load existing data when correction target changes
  useEffect(() => {
    async function loadOriginal() {
      if (!correctionType || !correctionTarget) {
        setOriginalData(null);
        return;
      }

      const endpoint =
        correctionType === "compound"
          ? `/api/compounds/${correctionTarget}`
          : `/api/medicines/${correctionTarget}`;

      try {
        const res = await fetch(endpoint);
        const data = await res.json();

        if (data.success) {
          setOriginalData(data.data);

          // Pre-fill form with existing values so the user can edit
          setFormData((prev) => ({
            ...prev,
            name: data.data.name || "",
            description: data.data.description || "",
            chemical_class: data.data.chemical_class || "",
            mechanism_of_action: data.data.mechanism_of_action || "",
            common_uses: data.data.common_uses?.join("\n") || "",
            common_side_effects:
              data.data.common_side_effects?.join("\n") || "",
            warnings: data.data.warnings || "",
            compound: data.data.compound?._id || "",
            brand_names: data.data.brand_names?.join("\n") || "",
            general_usage_info: data.data.general_usage_info || "",
            general_dosage_info: data.data.general_dosage_info || "",
            interactions: data.data.interactions || "",
            safety_info: data.data.safety_info || "",
          }));
        }
      } catch (e) {
        console.error(e);
        toast.error("Failed to load existing data");
      }
    }

    loadOriginal();
  }, [correctionType, correctionTarget]);

  //------------------------------------------------
  // VALIDATION
  //------------------------------------------------
  const validateForm = () => {
    const e: Record<string, string> = {};

    if (!formData.title.trim()) e.title = "Title is required";

    if (!formData.description.trim()) e.description = "Description is required";

    if (formData.type === "compound") {
      if (!formData.name.trim()) e.name = "Compound name is required";
      if (!formData.chemical_class.trim())
        e.chemical_class = "Chemical class is required";
      if (!formData.mechanism_of_action.trim())
        e.mechanism_of_action = "Mechanism of action is required";
    }

    if (formData.type === "medicine") {
      if (!formData.name.trim()) e.name = "Medicine name is required";
      if (!formData.compound.trim()) e.compound = "Select a related compound";
      if (!formData.general_usage_info.trim())
        e.general_usage_info = "General usage info required";
      if (!formData.safety_info.trim()) e.safety_info = "Safety info required";
    }

    // Correction validation
    if (formData.type === "correction") {
      if (!correctionType) e.correctionType = "Choose what you want to correct";
      if (!correctionTarget) e.correctionTarget = "Select an item to correct";

      // Require at least one edited field
      const keysToCheck =
        correctionType === "compound"
          ? [
              "name",
              "description",
              "chemical_class",
              "mechanism_of_action",
              "common_uses",
              "common_side_effects",
              "warnings",
            ]
          : [
              "name",
              "description",
              "general_usage_info",
              "general_dosage_info",
              "interactions",
              "safety_info",
              "brand_names",
            ];

      const hasSomething = keysToCheck.some(
        (k) => formData[k as keyof typeof formData].trim() !== "",
      );

      if (!hasSomething)
        e.correctionFields = "Enter at least one field to correct.";
    }

    if (formData.userEmail && !/^\S+@\S+\.\S+$/.test(formData.userEmail))
      e.userEmail = "Enter a valid email";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  //------------------------------------------------
  // SUBMIT HANDLER
  //------------------------------------------------
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    const payload = {
      ...formData,
      correctionType,
      correctionTarget,

      // convert multi-line → array
      common_uses: formData.common_uses
        ? formData.common_uses.split("\n").filter((s) => s.trim())
        : [],
      common_side_effects: formData.common_side_effects
        ? formData.common_side_effects.split("\n").filter((s) => s.trim())
        : [],
      brand_names: formData.brand_names
        ? formData.brand_names.split("\n").filter((s) => s.trim())
        : [],
    };

    try {
      const res = await fetch("/api/contributions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Your contribution has been submitted!");

        // Reset
        setFormData({
          type: "compound",
          title: "",
          description: "",
          userEmail: "",
          name: "",
          chemical_class: "",
          mechanism_of_action: "",
          common_uses: "",
          common_side_effects: "",
          warnings: "",
          compound: "",
          brand_names: "",
          general_usage_info: "",
          general_dosage_info: "",
          interactions: "",
          safety_info: "",
        });

        setCorrectionType("");
        setCorrectionTarget("");
      } else {
        toast.error(data.error || "Failed to submit.");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    }

    setLoading(false);
  };

  //------------------------------------------------
  // COMPONENT UI
  //------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="section-padding bg-white border-b">
        <div className="container-custom text-center">
          <h1 className="text-4xl font-bold mb-2">Contribute</h1>
          <p className="text-gray-600">
            Suggest new entries or corrections to existing content.
          </p>
        </div>
      </div>

      <div className="section-padding">
        <div className="container-custom max-w-3xl mx-auto">
          <div className="card p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* TYPE SELECTOR */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Contribution Type
                </label>

                <div className="grid grid-cols-3 gap-3">
                  {(
                    ["compound", "medicine", "correction"] as ContributionType[]
                  ).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, type });
                        setCorrectionType("");
                        setCorrectionTarget("");
                      }}
                      className={`px-4 py-3 rounded-lg border-2 transition ${
                        formData.type === type
                          ? "border-primary-600 bg-primary-50"
                          : "border-gray-200"
                      }`}
                    >
                      {type[0].toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              {/* --------------------------- */}
              {/* NEW COMPOUND FORM */}
              {/* --------------------------- */}
              {formData.type === "compound" && (
                <div className="space-y-4">
                  <Input
                    label="Compound Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    error={errors.name}
                    required
                  />

                  <Input
                    label="Chemical Class"
                    value={formData.chemical_class}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        chemical_class: e.target.value,
                      })
                    }
                    error={errors.chemical_class}
                    required
                  />

                  <Textarea
                    label="Mechanism of Action"
                    value={formData.mechanism_of_action}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mechanism_of_action: e.target.value,
                      })
                    }
                    error={errors.mechanism_of_action}
                    required
                  />

                  <Textarea
                    label="Common Uses (one per line)"
                    value={formData.common_uses}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        common_uses: e.target.value,
                      })
                    }
                  />

                  <Textarea
                    label="Common Side Effects (one per line)"
                    value={formData.common_side_effects}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        common_side_effects: e.target.value,
                      })
                    }
                  />

                  <Textarea
                    label="Warnings"
                    value={formData.warnings}
                    onChange={(e) =>
                      setFormData({ ...formData, warnings: e.target.value })
                    }
                  />
                </div>
              )}

              {/* --------------------------- */}
              {/* NEW MEDICINE FORM */}
              {/* --------------------------- */}
              {formData.type === "medicine" && (
                <div className="space-y-4">
                  <Input
                    label="Medicine Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    error={errors.name}
                    placeholder="eg. tylenol"
                    required
                  />

                  {/* compound dropdown */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Related Compound
                    </label>
                    <select
                      className="w-full border rounded-lg px-3 py-2"
                      value={formData.compound}
                      onChange={(e) =>
                        setFormData({ ...formData, compound: e.target.value })
                      }
                    >
                      <option value="">Select a compound</option>
                      {compounds.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    {errors.compound && (
                      <p className="text-sm text-red-500">{errors.compound}</p>
                    )}
                  </div>

                  <Textarea
                    label="General Usage Info"
                    value={formData.general_usage_info}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        general_usage_info: e.target.value,
                      })
                    }
                    error={errors.general_usage_info}
                    placeholder="general description..."
                    required
                  />

                  <Textarea
                    label="General Dosage Info"
                    value={formData.general_dosage_info}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        general_dosage_info: e.target.value,
                      })
                    }
                    placeholder="consult a healthcare professional for dosage information..."
                  />

                  <Textarea
                    label="Interactions"
                    value={formData.interactions}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        interactions: e.target.value,
                      })
                    }
                    placeholder="general interaction information..."
                  />

                  <Textarea
                    label="Safety Info"
                    value={formData.safety_info}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        safety_info: e.target.value,
                      })
                    }
                    error={errors.safety_info}
                    placeholder="Important safety information ... "
                    required
                  />

                  <Textarea
                    label="Brand Names (one per line)"
                    value={formData.brand_names}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        brand_names: e.target.value,
                      })
                    }
                    placeholder="Brand Names"
                  />
                </div>
              )}

              {/* --------------------------- */}
              {/* CORRECTION MODE */}
              {/* --------------------------- */}
              {formData.type === "correction" && (
                <div className="space-y-4">
                  {/* Select what is being corrected */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Correction For
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {(["compound", "medicine"] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => {
                            setCorrectionType(t);
                            setCorrectionTarget("");
                          }}
                          className={`px-4 py-3 rounded-lg border-2 transition ${
                            correctionType === t
                              ? "border-primary-600 bg-primary-50"
                              : "border-gray-200"
                          }`}
                        >
                          {t[0].toUpperCase() + t.slice(1)}
                        </button>
                      ))}
                    </div>
                    {errors.correctionType && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.correctionType}
                      </p>
                    )}
                  </div>

                  {/* Dropdown to choose the target */}
                  {correctionType === "compound" && (
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Select Compound to Correct
                      </label>
                      <select
                        className="w-full border rounded-lg px-3 py-2"
                        value={correctionTarget}
                        onChange={(e) => setCorrectionTarget(e.target.value)}
                      >
                        <option value="">Select a compound</option>
                        {compounds.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                      {errors.correctionTarget && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.correctionTarget}
                        </p>
                      )}
                    </div>
                  )}

                  {correctionType === "medicine" && (
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Select Medicine to Correct
                      </label>
                      <select
                        className="w-full border rounded-lg px-3 py-2"
                        value={correctionTarget}
                        onChange={(e) => setCorrectionTarget(e.target.value)}
                      >
                        <option value="">Select a medicine</option>
                        {medicines.map((m) => (
                          <option key={m._id} value={m._id}>
                            {m.name}
                          </option>
                        ))}
                      </select>
                      {errors.correctionTarget && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.correctionTarget}
                        </p>
                      )}
                    </div>
                  )}

                  {/* --------------------------- */}
                  {/* Correction form fields (ALL OPTIONAL) */}
                  {/* --------------------------- */}
                  {correctionType === "compound" && (
                    <div className="space-y-4">
                      <Input
                        label="New Name (optional)"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />

                      <Textarea
                        label="New Description (optional)"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                      />

                      <Input
                        label="Chemical Class"
                        value={formData.chemical_class}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            chemical_class: e.target.value,
                          })
                        }
                      />

                      <Textarea
                        label="Mechanism of Action"
                        value={formData.mechanism_of_action}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            mechanism_of_action: e.target.value,
                          })
                        }
                      />

                      <Textarea
                        label="Common Uses (one per line)"
                        value={formData.common_uses}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            common_uses: e.target.value,
                          })
                        }
                      />

                      <Textarea
                        label="Common Side Effects (one per line)"
                        value={formData.common_side_effects}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            common_side_effects: e.target.value,
                          })
                        }
                      />

                      <Textarea
                        label="Warnings"
                        value={formData.warnings}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            warnings: e.target.value,
                          })
                        }
                      />

                      {errors.correctionFields && (
                        <p className="text-sm text-red-600">
                          {errors.correctionFields}
                        </p>
                      )}
                    </div>
                  )}

                  {correctionType === "medicine" && (
                    <div className="space-y-4">
                      <Input
                        label="New Name (optional)"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />

                      <Textarea
                        label="New Description"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                      />

                      <Textarea
                        label="General Usage Info"
                        value={formData.general_usage_info}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            general_usage_info: e.target.value,
                          })
                        }
                      />

                      <Textarea
                        label="General Dosage Info"
                        value={formData.general_dosage_info}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            general_dosage_info: e.target.value,
                          })
                        }
                      />

                      <Textarea
                        label="Interactions"
                        value={formData.interactions}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            interactions: e.target.value,
                          })
                        }
                      />

                      <Textarea
                        label="Safety Info"
                        value={formData.safety_info}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            safety_info: e.target.value,
                          })
                        }
                      />

                      <Textarea
                        label="Brand Names (one per line)"
                        value={formData.brand_names}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            brand_names: e.target.value,
                          })
                        }
                      />

                      {errors.correctionFields && (
                        <p className="text-sm text-red-600">
                          {errors.correctionFields}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Note:</strong> All contributions are reviewed manually
                  before acceptance.
                </p>
              </div>

              {/* EMAIL */}
              <Input
                label="Your Email (optional)"
                value={formData.userEmail}
                type="email"
                onChange={(e) =>
                  setFormData({ ...formData, userEmail: e.target.value })
                }
                error={errors.userEmail}
              />

              <Button className="w-full" disabled={loading}>
                {loading ? "Submitting..." : "Submit Contribution"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
