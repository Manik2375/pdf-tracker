"use server";
import { v2 as cloudinary } from "cloudinary";
import { countPdfsOfUser, deletePdfMetaData } from "./db";
import { UploadLimitError } from "../errors";

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
  try {
    const pdfCount = await countPdfsOfUser();
    if (pdfCount >= 5) {
      throw new UploadLimitError(
        "You have already uploaded 5 pdfs. Delete some to upload more",
      );
    }

    const timestamp = Math.round(Date.now() / 1000);
    const folder = folderName ?? "PdfTracker";

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder,
      },
      process.env.CLOUDINARY_API_SECRET as string,
    );

    return {
      signature,
      timestamp,
      folder,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
      apiKey: process.env.CLOUDINARY_API_KEY!,
    };
  } catch (error) {
    console.error("test" + error);
    throw error;
  }
}

export async function deletePdf(pdfId: string, cloudinaryPublicId: string) {
  try {
    console.log(cloudinaryPublicId);
    const result = await cloudinary.uploader.destroy(cloudinaryPublicId, {
      resource_type: "image",
    });
    const resultMetaData = await deletePdfMetaData(pdfId);
    console.log(`Deleting PDF with id: ${pdfId}`, result);
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
