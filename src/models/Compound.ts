import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICompound extends Document {
  name: string;
  description: string;
  chemical_class: string;
  mechanism_of_action: string;
  common_uses: string[];
  common_side_effects: string[];
  warnings: string;
  related_medicines: mongoose.Types.ObjectId[];
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

const CompoundSchema = new Schema<ICompound>(
  {
    name: {
      type: String,
      required: [true, 'Compound name is required'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    chemical_class: {
      type: String,
      required: [true, 'Chemical class is required'],
    },
    mechanism_of_action: {
      type: String,
      required: [true, 'Mechanism of action is required'],
    },
    common_uses: {
      type: [String],
      default: [],
    },
    common_side_effects: {
      type: [String],
      default: [],
    },
    warnings: {
      type: String,
      default: '',
    },
    related_medicines: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Medicine',
      },
    ],
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
CompoundSchema.index({ name: 'text', description: 'text', chemical_class: 'text' });

const Compound: Model<ICompound> =
  mongoose.models.Compound || mongoose.model<ICompound>('Compound', CompoundSchema);

export default Compound;
