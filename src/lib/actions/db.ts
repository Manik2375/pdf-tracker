"use server";

import { auth } from "@/lib/auth";
import connectToDatabase from "@/lib/db/connection";
import { PDF, SerializedIPDF } from "@/lib/db/models/pdf";
import { serializePdf } from "@/lib/utils/serializePdf";

export async function uploadPdfMetadata({
  pdfId,
  folder,
  title,
  description,
  author,
  cover,
}: {
  pdfId: string;
  folder: string;
  title: string;
  description: string;
  author: string;
  cover: string;
}) {
  await connectToDatabase();

  const session = await auth();

  if (!session?.user) return null;

  console.log(pdfId);
  try {
    await PDF.create({
      _id: pdfId.split("/")[1].split(".")[0],
      cloudinaryPublicId: pdfId,
      folder,
      title,
      description,
      author,
      progress: 1,
      userId: session.user._id,
      cover,
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

export async function getAllPdfMetaData(): Promise<SerializedIPDF[]> {
  const session = await auth();
  if (!session) {
    throw new Error("No session");
  }
  await connectToDatabase();

  const userId = session.user._id;
  const pdfList = await PDF.find({ userId }).lean();
  return pdfList.map(serializePdf);
}

export async function getPdfMetaData(pdfId: string): Promise<SerializedIPDF> {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("No session");
    }
    await connectToDatabase();
    const pdf = await PDF.findOne({
      _id: pdfId,
      userId: session.user._id,
    }).lean();

    if (!pdf) {
      throw new Error("No pdf found");
    }
    return serializePdf(pdf);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deletePdfMetaData(pdfId: string) {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("No session");
    }
    await connectToDatabase();

    const deletedPdf = await PDF.findOneAndDelete({
      _id: pdfId,
      userId: session.user._id,
    });

    console.log(deletedPdf);
    return {
      success: true,
      message: "PDF metadata deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting PDF metadata ", error);
    throw error;
  }
}
