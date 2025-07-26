"use client";

import React, { useState, useRef } from "react";
import { generateUploadSignature, uploadPdfMetadata } from "@/lib/actions";
import { UploadLimitError } from "@/lib/errors";

import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.js";

interface PdfUploaderProps {
  onSuccessfulUploadAction: () => void;
}

interface Pdfinfo {
  Title?: string;
  Subject?: string;
  Author?: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

async function uploadPdf(
  file: File,
  folderName?: string,
): Promise<{ public_id: string; folder: string }> {
  try {
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

    return { public_id: uploadResponse.public_id, folder: folder };
  } catch (error) {
    console.log("TEST", error instanceof UploadLimitError, error);
    if ((error as Error).name === "UploadLimitError") {
      alert((error as Error).message);
    }
    throw error;
  }
}

export const PdfUploader = ({ onSuccessfulUploadAction }: PdfUploaderProps) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setSuccess(false);
    const file = event.target.files?.[0];
    if (!file) {
      alert("Error uploading file");
      return;
    }
    setLoading(true);

    try {
      const { public_id: pdfId, folder: pdfFolder } = await uploadPdf(file);

      const filename = file.name;

      const arrayBuffer = await file.arrayBuffer();

      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const metadata: { info: Pdfinfo } = await pdf.getMetadata();

      const title = metadata.info.Title || filename;
      const description = metadata.info.Subject || "No description found";
      const author = metadata.info.Author || "Unknown Author";
      const numPages = pdf.numPages;
      await uploadPdfMetadata({
        pdfId: pdfId ?? "test",
        folder: pdfFolder ?? "test",
        title: title,
        description: description,
        totalPages: numPages,
        author: author,
      });

      onSuccessfulUploadAction();
      setSuccess(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };
  return (
    <>
      <button
        className="text-xl btn btn-primary px-5 font-normal"
        onClick={() => {
          modalRef.current?.showModal();
          setSuccess(false);
        }}
      >
        Upload PDF
      </button>
      <dialog className="modal backdrop-blur-xs" ref={modalRef}>
        <div className="modal-box ">
          <h3 className="font-bold text-2xl text-primary">Upload PDF</h3>
          <div className="flex mt-12 gap-2 items-center">
            <input
              ref={inputRef}
              type="file"
              className="file-input  border-primary"
              accept="application/pdf"
              onChange={handleUpload}
              disabled={loading}
            />
            <span>
              {loading ? (
                <span className="loading loading-spinner loading-l"></span>
              ) : (
                ""
              )}
            </span>
          </div>
          <div>
            {success ? (
              <div role="alert" className="alert alert-success mt-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 shrink-0 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>PDF Uploaded!</span>
              </div>
            ) : (
              ""
            )}
          </div>
          <div role="alert" className="alert mt-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="h-6 w-6 shrink-0 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>Maximum file size limit is 10MB</span>
          </div>
          <div role="alert" className="alert alert-warning mt-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>
              Note: You are responsible for ensuring the uploaded PDF is for
              personal use only. We do not share your file.
            </span>
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};
