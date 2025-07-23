import { auth } from "@/lib/auth";
import { getAllPdfMetaData } from "@/lib/actions";
import BooksClient from "@/components/home/BooksClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Books"
}

export default async function Books() {
  const session = await auth();
  const pdfList = await getAllPdfMetaData();

  if (!session?.user) return <p>USER not authenticated</p>;

  return <BooksClient session={session} initialPdfs={pdfList} />;
}
