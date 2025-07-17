"use server";
import { v2 as cloudinary } from "cloudinary";
import { deletePdfMetaData } from "./db";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function generateUploadSignature(folderName?: string): Promise<{
  signature: string;
  timestamp: number;
  folder: string;
  cloudName: string;
  apiKey: string;
}> {
  const timestamp = Math.round(Date.now() / 1000);
  const folder = folderName ?? "PdfTracker";

  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      folder,
    },
    process.env.CLOUDINARY_API_SECRET!,
  );

  return {
    signature,
    timestamp,
    folder,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    apiKey: process.env.CLOUDINARY_API_KEY!,
  };
}

export async function deletePdf(pdfId: string, cloudinaryPublicId: string) {
  try {
    console.log(cloudinaryPublicId);
    const result = await cloudinary.uploader.destroy(cloudinaryPublicId, {
      resource_type: "raw",
    });
    const resultMetaData = await deletePdfMetaData(pdfId);
    console.log(pdfId, result);
    if (result.result === "ok" && resultMetaData.success) {
      {
        return {
          success: true,
          message: "PDF deleted successfully",
        };
      }
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}
