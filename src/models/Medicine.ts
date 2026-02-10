import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMedicine extends Document {
  name: string;
  description: string;
  compound: mongoose.Types.ObjectId;
  brand_names: string[];
  general_usage_info: string;
  general_dosage_info: string;
  interactions: string;
  safety_info: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

const MedicineSchema = new Schema<IMedicine>(
  {
    name: {
      type: String,
      required: [true, 'Medicine name is required'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    compound: {
      type: Schema.Types.ObjectId,
      ref: 'Compound',
      required: [true, 'Compound reference is required'],
    },
    brand_names: {
      type: [String],
      default: [],
    },
    general_usage_info: {
      type: String,
      required: [true, 'General usage info is required'],
    },
    general_dosage_info: {
      type: String,
      default: 'Consult a healthcare professional for dosage information.',
    },
    interactions: {
      type: String,
      default: '',
    },
    safety_info: {
      type: String,
      required: [true, 'Safety info is required'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search functionality
MedicineSchema.index({ name: 'text', description: 'text' });

const Medicine: Model<IMedicine> =
  mongoose.models.Medicine || mongoose.model<IMedicine>('Medicine', MedicineSchema);

export default Medicine;
