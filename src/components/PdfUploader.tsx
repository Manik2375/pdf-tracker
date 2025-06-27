"use client";

import React, { useState, useRef } from "react";
import { generateUploadSignature, uploadPdfMetadata } from "@/lib/actions";

export default function PdfUploader() {
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

    const { signature, timestamp, folder, cloudName, apiKey } =
      await generateUploadSignature();
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
    console.log(uploadResponse.public_id);
    await uploadPdfMetadata({
      pdfId: uploadResponse.public_id,
      folder,
      title: "The chronicales of owl",
      description: "The owl",
      author: "The owl",
      cover: "http://localhost:3000/_next/image?url=%2Flogo.png&w=256&q=75",
    });
    console.log(uploadResponse);
    try {
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
      <dialog className="modal" ref={modalRef}>
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
              personal use only. We do not store or share your files.
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
}
