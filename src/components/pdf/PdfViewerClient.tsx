"use client";
import dynamic from "next/dynamic";
import "react-pdf/dist/Page/TextLayer.css";
import { ComponentType, useState } from "react";

interface PdfViewerClientProps {
  pdfLink: string;
}

const DynamicPdfViewer = dynamic(async () => {
  const { Document, Page, pdfjs } = await import("react-pdf");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

  const PdfComponent: ComponentType<PdfViewerClientProps> = ({ pdfLink }) => {
    const [numPages, setNumPages] = useState<number>(0);
    const [outline, setOutline] = useState({});
    return (
      <div className="overflow-y-scroll h-[80vh] px-4 py-6 flex flex-col items-center space-y-6">
        <Document
          file={"/test.pdf"}
          onLoadSuccess={async (pdf) => {
            console.log(pdf.numPages);
            setNumPages(pdf.numPages);
            const out = await pdf.getOutline();
            setOutline(out);
          }}
        >
          {Array.from(Array(numPages)).map((_, i) => {
            return (
              <Page
                key={i}
                pageNumber={i + 1}
                renderTextLayer={true}
                renderAnnotationLayer={false}
                className="shadow rounded mx-auto"
              />
            );
          })}
        </Document>
      </div>
    );
  };
  return PdfComponent;
});

export function PdfViewerClient({ pdfLink }: PdfViewerClientProps) {
  return <DynamicPdfViewer pdfLink={pdfLink} />;
}
