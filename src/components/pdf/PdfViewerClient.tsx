"use client";
import React, { useRef, useState } from "react";
import { SerializedIPDF } from "@/lib/db/models/pdf";
import { updatePdfProgress } from "@/lib/actions";

import { Viewer, Worker } from "@react-pdf-viewer/core";
import {
  zoomPlugin,
  RenderZoomInProps,
  RenderZoomOutProps,
} from "@react-pdf-viewer/zoom";
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/zoom/lib/styles/index.css";

interface PdfViewerClientProps {
  pdfLink: string;
  pdfDoc: SerializedIPDF;
}

export function PdfViewerClient({ pdfLink, pdfDoc }: PdfViewerClientProps) {
  const [currentPage, setCurrentPage] = useState<number>(pdfDoc.progress);
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const pageNavigationInstance = pageNavigationPlugin();
  const { jumpToNextPage, jumpToPreviousPage, jumpToPage } =
    pageNavigationInstance;
  const zoomPluginInstance = zoomPlugin();
  const { ZoomIn, ZoomOut } = zoomPluginInstance;

  const handlePageChange = (e: { currentPage: number }) => {
    const newPage = e.currentPage + 1;
    setCurrentPage(newPage);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(async () => {
      try {
        await updatePdfProgress(pdfDoc._id, newPage);
      } catch (error) {
        console.error(error);
      }
    }, 2000);
  };

  const handlePageInputChange = (
    e:
      | React.FocusEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>,
  ) => {
    const val = +e.currentTarget?.value;
    setCurrentPage(val);
    jumpToPage(val - 1);
  };

  const handleFullScreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
      setFullscreen(false);
    } else {
      container.requestFullscreen();
      setFullscreen(true);
    }
  };

  return (
    <div
      className={`${fullscreen ? "" : "px-5 py-6 rounded-box"} relative flex  pt-0 pr-0 space-y-6 bg-base-200`}
    >
      <div
        className={`overflow-y-auto w-full flex flex-col items-center  ${fullscreen ? "h-full" : " mt-20 h-[85vh]"}`}
        ref={containerRef}
      >
        <div
          className={`${fullscreen ? "sticky" : "absolute rounded-t-box"} flex justify-between items-center top-0 left-0 right-0 p-5 w-full bg-base-100 z-10`}
        >
          <p className="hidden md:block max-w-[15em] overflow-hidden overflow-ellipsis">
            {pdfDoc.title}
          </p>
          <div className="flex gap-5 items-center">
            <div className="flex gap-2">
              <button
                className="btn btn-neutral aspect-square w-10 p-0"
                onClick={jumpToPreviousPage}
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
                max={pdfDoc.totalPages}
                className="input w-20 text-center input-no-spinner"
                onChange={(e) => setCurrentPage(+e.currentTarget.value)}
                onBlur={handlePageInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handlePageInputChange(e);
                  }
                }}
              />
              <button
                className="btn btn-neutral aspect-square w-10 p-0"
                onClick={jumpToNextPage}
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
            <div className="flex gap-2">
              <ZoomOut>
                {(props: RenderZoomOutProps) => (
                  <button
                    className="btn btn-ghost btn-neutral  p-1 rounded-full aspect-square"
                    onClick={props.onClick}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <line x1="8" y1="11" x2="14" y2="11" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </button>
                )}
              </ZoomOut>
              <ZoomIn>
                {(props: RenderZoomInProps) => (
                  <button
                    className="btn btn-ghost btn-neutral p-1 rounded-full aspect-square"
                    onClick={props.onClick}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <line x1="11" y1="8" x2="11" y2="14" />
                      <line x1="8" y1="11" x2="14" y2="11" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </button>
                )}
              </ZoomIn>
            </div>
          </div>
          <div>
            <button
              className="btn btn-ghost btn-neutral"
              onClick={handleFullScreen}
            >
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

        <Worker workerUrl="/pdf.worker.js">
          <Viewer
            theme="auto"
            fileUrl={pdfLink}
            plugins={[zoomPluginInstance, pageNavigationInstance]}
            onPageChange={handlePageChange}
            initialPage={pdfDoc.progress - 1}
          />
        </Worker>
      </div>
    </div>
  );
}
