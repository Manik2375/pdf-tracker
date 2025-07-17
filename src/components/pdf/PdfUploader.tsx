"use client";

import React, { useState, useRef, ComponentType } from "react";
import { uploadPdf, uploadPdfCover, uploadPdfMetadata } from "@/lib/actions";
import dynamic from "next/dynamic";

interface PdfUploaderProps {
  onSuccessfulUploadAction: () => void;
}

interface Pdfinfo {
  Title?: string;
  Subject?: string;
  Author?: string;

  [key: string]: any;
}

const DynamicPdfUploader = dynamic(
  async () => {
    const { pdfjs } = await import("react-pdf");
    pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

    const PdfUploaderComponent: ComponentType<PdfUploaderProps> = ({
      onSuccessfulUploadAction,
    }) => {
      const modalRef = useRef<HTMLDialogElement>(null);
      const inputRef = useRef<HTMLInputElement>(null);
      const [loading, setLoading] = useState<boolean>(false);
      const [success, setSuccess] = useState<boolean>(false);
      const handleUpload = async (
        event: React.ChangeEvent<HTMLInputElement>,
      ) => {
        setSuccess(false);
        const file = event.target.files?.[0];
        if (!file) {
          alert("Error uploading file");
          return;
        }
        setLoading(true);
        try {
          const { public_id: pdfId, folder: pdfFolder } = await uploadPdf(file);

          const filereader = new FileReader();
          const filename = file.name;

          filereader.addEventListener("load", async (e) => {
            try {
              if (!e.target?.result) return;
              const typedArray = new Uint8Array(e.target.result as ArrayBuffer);
              const pdf = await pdfjs.getDocument({ data: typedArray }).promise;

              const totalPages = pdf.numPages;
              const { info }: { info: Pdfinfo } = await pdf.getMetadata();

              const title = info.Title || filename;
              const description = info.Subject || "No description found";
              const author = info.Author || "Unknown Author";

              const page = await pdf.getPage(1);
              const viewport = page.getViewport({ scale: 0.6 });
              const canvas = document.createElement("canvas");
              const context = canvas.getContext("2d");
              canvas.width = viewport.width;
              canvas.height = viewport.height;

              if (!context) {
                console.error("Error getting canvas context for cover upload");
                return;
              }
              await page.render({ canvasContext: context, viewport }).promise;

              const coverBlob = await new Promise<Blob>((resolve) => {
                canvas.toBlob((blob) => {
                  if (!blob) {
                    console.error("Couldn't covert canvas to blob");
                    return;
                  }
                  resolve(blob);
                }, "image/png");
              });

              const coverFile = new File([coverBlob], `cover_${pdfId}`, {
                type: "image/png",
              });

              const { public_id: coverId } = await uploadPdfCover(
                coverFile,
                "PdfTracker/covers",
              );
              // I am not sure if storing id and folder of Cover would be better. I am believing that ids and folder once set, will never change;

              const coverLink = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_400/${coverId}`;

              await uploadPdfMetadata({
                pdfId: pdfId,
                folder: pdfFolder,
                title: title,
                description: description,
                totalPages: totalPages,
                author: author,
                cover: coverLink,
              });

              onSuccessfulUploadAction();
              setSuccess(true);
            } catch (error) {
              console.error("Error uploading pdf metadata", error);
            }
          });
          filereader.readAsArrayBuffer(file);
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
    return PdfUploaderComponent;
  },
  {
    ssr: false,
  },
);

export const PdfUploader = ({ onSuccessfulUploadAction }: PdfUploaderProps) => {
  return (
    <DynamicPdfUploader onSuccessfulUploadAction={onSuccessfulUploadAction} />
  );
};
