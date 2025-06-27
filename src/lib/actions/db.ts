"use server";

import { PDF } from "@/lib/db/models/pdf";
import { auth } from "@/lib/auth";
import connectToDatabase from "@/lib/db/connection";

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
