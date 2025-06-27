import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPDF extends Document {
  _id: string;
  title: string;
  description: string;
  author: string;
  folder: string;
  userId: mongoose.Types.ObjectId;
  cover: string;
  createdAt: Date;
  updatedAt: Date;
}

export const pdfSchema = new Schema<IPDF>(
  {
    _id: String,
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
