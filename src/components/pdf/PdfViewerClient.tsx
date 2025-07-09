"use client";
import dynamic from "next/dynamic";
import { ComponentType } from "react";

interface PdfViewerClientProps {
  pdfLink: string;
}

const DynamicPdfViewer = dynamic(async () => {
  const { Document, Page, pdfjs } = await import("react-pdf");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

  const PdfComponent: ComponentType<PdfViewerClientProps> = ({ pdfLink }) => (
    <div>
      <Document
        file={pdfLink}
        onLoadSuccess={() => {
          console.log("pdf loaded");
        }}
      >
        <Page
          pageNumber={15}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          className="shadow rounded mx-auto"
        />
      </Document>
    </div>
  );
  return PdfComponent;
});

export function PdfViewerClient({ pdfLink }: PdfViewerClientProps) {
  return <DynamicPdfViewer pdfLink={pdfLink} />;
}
