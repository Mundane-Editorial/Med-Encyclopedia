import mongoose, { Schema, Document, Model } from "mongoose";

export type ContributionType = "compound" | "medicine" | "correction";
export type ContributionStatus = "pending" | "approved" | "rejected";

export interface IContribution extends Document {
  type: ContributionType;
  title: string;
  description: string;
  relatedId?: string; // For corrections (target entity ID)
  userEmail?: string;
  status: ContributionStatus;
  acceptedBy?: {
    adminId: string | null;
    name: string | null;
  };
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
  // Correction-specific (so admin modal can show them)
  correctionType?: "compound" | "medicine";
  correctionTarget?: string; // Same as relatedId for corrections, for display/link
  // Submitted fields (compound / medicine / correction form data)
  name?: string;
  chemical_class?: string;
  mechanism_of_action?: string;
  common_uses?: string[];
  common_side_effects?: string[];
  warnings?: string;
  compound?: string; // Compound ID for medicine
  brand_names?: string[];
  general_usage_info?: string;
  general_dosage_info?: string;
  interactions?: string;
  safety_info?: string;
}

const ContributionSchema = new Schema<IContribution>(
  {
    type: {
      type: String,
      required: [true, "Contribution type is required"],
      enum: ["compound", "medicine", "correction"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    relatedId: {
      type: String, // Store as string for flexibility (can be ID or name)
    },
    userEmail: {
      type: String,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v: string | undefined) {
          return !v || /^\S+@\S+\.\S+$/.test(v);
        },
        message: "Please enter a valid email address",
      },
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    acceptedBy: {
      adminId: { type: Schema.Types.ObjectId, ref: "AdminUser", default: null },
      name: { type: String, default: null },
    },

    adminNotes: {
      type: String,
      default: "",
    },
    correctionType: { type: String, enum: ["compound", "medicine"] },
    correctionTarget: { type: String, trim: true },
    name: { type: String, trim: true },
    chemical_class: { type: String, trim: true },
    mechanism_of_action: { type: String, trim: true },
    common_uses: [{ type: String, trim: true }],
    common_side_effects: [{ type: String, trim: true }],
    warnings: { type: String, trim: true },
    compound: { type: String, trim: true },
    brand_names: [{ type: String, trim: true }],
    general_usage_info: { type: String, trim: true },
    general_dosage_info: { type: String, trim: true },
    interactions: { type: String, trim: true },
    safety_info: { type: String, trim: true },
  },
  {
    timestamps: true,
  },
);

// Index for filtering
ContributionSchema.index({ status: 1, type: 1, createdAt: -1 });

const Contribution: Model<IContribution> =
  mongoose.models.Contribution ||
  mongoose.model<IContribution>("Contribution", ContributionSchema);

export default Contribution;
