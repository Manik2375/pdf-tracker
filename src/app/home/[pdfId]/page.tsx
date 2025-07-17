"use client";
import { useState, useEffect } from "react";
import { SerializedIPDF } from "@/lib/db/models/pdf";
import { getPdfMetaData } from "@/lib/actions";
import { PdfViewerClient } from "@/components/pdf";

export default function PDFViewer({
  params,
}: {
  params: Promise<{ pdfId: string }>;
}) {
  const [pdfData, setPdfData] = useState<SerializedIPDF>();
  useEffect(() => {
    const fetchData = async () => {
      const { pdfId } = await params;
      const pdfMetaData = await getPdfMetaData(pdfId);
      setPdfData(pdfMetaData);
    };
    fetchData();
  }, [params]);

  const pdfLink = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${pdfData?.cloudinaryPublicId}`;
  if (!pdfData) {
    return <p>No PDF found.</p>;
  }

  return <PdfViewerClient pdfLink={pdfLink} pdfDoc={pdfData} />;
}
