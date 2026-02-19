import mongoose, { Schema, Model, Document } from "mongoose";

export interface IApprovedAdmin extends Document {
  name: string;
}

const ApprovedAdminSchema = new Schema<IApprovedAdmin>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true },
);

const ApprovedAdmin: Model<IApprovedAdmin> =
  mongoose.models.ApprovedAdmin ||
  mongoose.model<IApprovedAdmin>("ApprovedAdmin", ApprovedAdminSchema);

export default ApprovedAdmin;
