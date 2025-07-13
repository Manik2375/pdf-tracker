import { FlattenMaps } from "mongoose";
import { IPDF, SerializedIPDF } from "@/lib/db/models/pdf";

export function serializePdf(pdf: FlattenMaps<IPDF>): SerializedIPDF {
  return {
    _id: pdf._id.toString(),
    cloudinaryPublicId: pdf.cloudinaryPublicId,
    title: pdf.title,
    description: pdf.description,
    author: pdf.author,
    folder: pdf.folder?.toString() ?? null,
    cover: pdf.cover.toString(),
    progress: pdf.progress ?? 1,
    totalPages: pdf.totalPages ?? 100,
    userId: pdf.userId?.toString(),
    createdAt: pdf.createdAt?.toISOString?.() ?? null,
    updatedAt: pdf.updatedAt?.toISOString?.() ?? null,
  };
}