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

export async function uploadPdf(
  file: File,
  folderName?: strin,
): Promise<{ public_id: string; folder: string }> {
  const { signature, timestamp, folder, cloudName, apiKey } =
    await generateUploadSignature(folderName);
  const formData = new FormData();

  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  formData.append("folder", folder);

  const uploadResponse = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`,
    {
      method: "POST",
      body: formData,
    },
  ).then((res) => res.json());

  return { public_id: uploadResponse.public_id, folder: folder };
}

export async function uploadPdfCover(
  file: File,
  folderName?: string,
): Promise<{ public_id: string; folder: string }> {
  const { signature, timestamp, folder, cloudName, apiKey } =
    await generateUploadSignature(folderName);
  const formData = new FormData();

  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  formData.append("folder", folder);

  const uploadResponse = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  ).then((res) => res.json());

  return { public_id: uploadResponse.public_id, folder: uploadResponse.folder };
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
