import { FlattenMaps } from "mongoose";
import { IPDF } from "@/lib/db/models/pdf";

export function serializePdf(pdf: FlattenMaps<IPDF>) {
  return {
    _id: pdf._id.toString(),
    cloudinaryPublicId: pdf.cloudinaryPublicId,
    title: pdf.title,
    description: pdf.description,
    author: pdf.author,
    folder: pdf.folder?.toString() ?? null,
    cover: pdf.cover ? pdf.cover.toString() : null,
    progress: pdf.progress ?? 1,
    userId: pdf.userId?.toString(),
    createdAt: pdf.createdAt?.toISOString?.() ?? null,
    updatedAt: pdf.updatedAt?.toISOString?.() ?? null,
  };
}