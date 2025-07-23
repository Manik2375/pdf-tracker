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
  totalPages,
  author,
}: {
  pdfId: string;
  folder: string;
  title: string;
  description: string;
  totalPages: number;
  author: string;
}) {
  await connectToDatabase();

  const session = await auth();

  if (!session?.user) return null;

  console.log(pdfId);
  try {
    console.log(folder);
    await PDF.create({
      _id: pdfId.split("/")[1].split(".")[0],
      cloudinaryPublicId: pdfId,
      folder,
      title,
      description,
      author,
      totalPages,
      progress: 1,
      userId: session.user._id,
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

export async function updatePdfProgress(pdfId: string, progress: number) {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("No session");
    }
    await connectToDatabase();
    const pdf = await PDF.findOneAndUpdate(
      {
        _id: pdfId,
        userId: session.user._id,
      },
      {
        progress: progress,
      },
    );
    if (!pdf) {
      throw new Error("No pdf found");
    }
    return {
      success: true,
      message: "PDF metadata updated successfully",
      progress: progress,
    };
  } catch (e) {
    console.error(e);
  }
}

export async function updatePdfMetadata(
  pdfId: string,
  newPdfMetadata: {
    title: string;
    author: string;
    description: string;
  },
): Promise<
  { success: false; error: string } | { success: true; data: string }
> {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("No session");
    }

    await connectToDatabase();

    console.log(newPdfMetadata);
    const doc = await PDF.findOneAndUpdate(
      {
        _id: pdfId,
        userId: session.user._id,
      },
      {
        title: newPdfMetadata.title,
        author: newPdfMetadata.author,
        description: newPdfMetadata.description,
      },
    );

    if (!doc) throw new Error("No pdf found to update data");

    return { success: true, data: "PDF metadata updated successfully" };
  } catch (error) {
    console.error(error);
    return { success: false, error: String(error) };
  }
}

export async function countPdfsOfUser(): Promise<number> {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("No session");
    }

    await connectToDatabase();

    const numPdfs = await PDF.countDocuments({
      userId: session.user._id,
    });

    if (!numPdfs) {
      throw new Error("No pdf found for user");
    }
    return numPdfs;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
