"use server";

import { auth } from "@/lib/auth";
import connectToDatabase from "@/lib/db/connection";
import { PDF } from "@/lib/db/models/pdf";
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

  console.log(session.user);
  const pdfDocument = await PDF.create({
    _id: pdfId.split("/")[1].split(".")[0],
    folder,
    title,
    description,
    author,
    progress: 1,
    userId: session.user._id,
    cover,
  });

  try {
    await pdfDocument.save();
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

export async function getAllPdfMetaData() {
  const session = await auth();
  if (!session) {
    throw new Error("No session");
  }
  await connectToDatabase();

  const userId = session.user._id;
  const pdfList = await PDF.find({ userId }).lean();
  return pdfList.map(serializePdf);
}
