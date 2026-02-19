import mongoose, { Schema, Document, Model } from "mongoose";

export type ContributionType = "compound" | "medicine" | "correction";
export type ContributionStatus = "pending" | "approved" | "rejected";

export interface IContribution extends Document {
  type: ContributionType;
  title: string;
  description: string;
  relatedId?: string; // For corrections (can be ID or name)
  userEmail?: string;
  status: ContributionStatus;
  acceptedBy?: {
    adminId: string | null;
    name: string | null;
  };
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
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
