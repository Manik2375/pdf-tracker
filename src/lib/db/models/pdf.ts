import mongoose, { Schema, Model } from "mongoose";

export interface IPDF {
  _id: string;
  cloudinaryPublicId: string;
  title: string;
  description: string;
  author: string;
  folder: string;
  userId: mongoose.Types.ObjectId;
  progress: number;
  cover: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SerializedIPDF {
  _id: string;
  cloudinaryPublicId: string;
  title: string;
  description: string;
  author: string;
  folder: string | null;
  cover: string;
  progress: number;
  userId?: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export const pdfSchema = new Schema<IPDF>(
  {
    _id: {
      type: String,
      required: true,
    },

    cloudinaryPublicId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: [true, "Please enter a valid title"],
    },
    description: {
      type: String,
      required: [true, "Please enter a valid description"],
    },
    author: {
      type: String,
      required: true,
    },
    folder: {
      type: String,
      required: true,
    },
    cover: {
      type: String,
      required: true,
    },
    progress: {
      type: Number,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true },
);

export const PDF: Model<IPDF> =
  mongoose.models.PDF || mongoose.model<IPDF>("PDF", pdfSchema);
