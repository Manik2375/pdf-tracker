"use client";
import dynamic from "next/dynamic";
import "react-pdf/dist/Page/TextLayer.css";
import { ComponentType, useRef, useState } from "react";

interface PdfViewerClientProps {
  pdfLink: string;
}

const DynamicPdfViewer = dynamic(async () => {
  const { Document, Page, pdfjs } = await import("react-pdf");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

  const PdfComponent: ComponentType<PdfViewerClientProps> = ({ pdfLink }) => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [numPages, setNumPages] = useState<number>(0);
    const [outline, setOutline] = useState({});
    const pageRefs = useRef<HTMLDivElement[] | null>([]);

    const changePageNumber = (pageNum: number) => {
      const page = pageRefs.current?.find((page) => {
        if (page.dataset.pagenumber) {
          return pageNum === +page.dataset.pagenumber;
        }
      });
      setCurrentPage(pageNum);
      page?.scrollIntoView();
    };

    const handleNavButton = (action: "prev" | "next") => {
      const newPage = action === "prev" ? currentPage - 1 : currentPage + 1;
      changePageNumber(newPage);
    };
    return (
      <div className="relative flex px-5 py-6 pt-0 space-y-6 bg-base-200 rounded-box">
        <div className="mt-20 overflow-y-auto h-[80vh] w-full flex flex-col items-center">
          <div className="absolute flex justify-between items-center top-0 left-0 right-0 p-5 rounded-t-box w-full bg-[#0000006b] backdrop-blur-xs z-10">
            <p>Chronicles of owl</p>
            <div className="flex gap-2">
              <button
                className="btn btn-neutral aspect-square w-10 p-0"
                onClick={() => {
                  handleNavButton("prev");
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 6L9 12L15 18"
                    className="stroke-neutral-content"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <input
                type="number"
                value={currentPage}
                min={1}
                max={numPages}
                onChange={(e) => {
                  const pageNum = Math.min(
                    numPages,
                    Math.max(1, parseInt(e.currentTarget.value) || 1),
                  );
                  changePageNumber(pageNum);
                }}
                className="input w-20 text-center"
              />
              <button
                className="btn btn-neutral aspect-square w-10 p-0"
                onClick={() => {
                  handleNavButton("next");
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 6L15 12L9 18"
                    className="stroke-neutral-content"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <div>
              <button className="btn text-neutral-content btn-ghost btn-neutral">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-maximize"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 3H5a2 2 0 0 0-2 2v3" />
                  <path d="M16 3h3a2 2 0 0 1 2 2v3" />
                  <path d="M8 21H5a2 2 0 0 1-2-2v-3" />
                  <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
                </svg>
              </button>
            </div>
          </div>

          <Document
            file={"/test.pdf"}
            onLoadSuccess={async (pdf) => {
              console.log(pdf.numPages);
              setNumPages(pdf.numPages);
              pageRefs.current = Array(pdf.numPages).fill(null);

              const out = await pdf.getOutline();
              setOutline(out);
            }}
          >
            {Array.from(Array(numPages)).map((_, i) => {
              return (
                <div
                  key={i}
                  data-pagenumber={i + 1}
                  ref={(el) => {
                    if (pageRefs.current && el) pageRefs.current[i] = el;
                  }}
                >
                  <Page
                    pageNumber={i + 1}
                    renderTextLayer={true}
                    renderAnnotationLayer={false}
                    className="shadow rounded mx-auto"
                  />
                </div>
              );
            })}
          </Document>
        </div>
      </div>
    );
  };
  return PdfComponent;
});

export function PdfViewerClient({ pdfLink }: PdfViewerClientProps) {
  return <DynamicPdfViewer pdfLink={pdfLink} />;
}
