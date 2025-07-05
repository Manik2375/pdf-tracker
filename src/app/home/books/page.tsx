import { auth } from "@/lib/auth";
import { getAllPdfMetaData } from "@/lib/actions";
import BooksClient from "@/components/home/BooksClient";

export default async function Books() {
  const session = await auth();
  const pdfList = await getAllPdfMetaData();

  if (!session?.user) return <p>USER not authenticated</p>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <BooksClient session={session} initialPdfs={pdfList as any} />;
}
