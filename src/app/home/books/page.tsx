import { auth } from "@/lib/auth";
import { getAllPdfMetaData } from "@/lib/actions";
import BooksClient from "@/components/home/Booksclient";

export default async function Books() {
  const session = await auth();
  const pdfList = await getAllPdfMetaData();

  if (!session?.user) return <p>USER not authenticated</p>;

  // @ts-ignore
  return <BooksClient session={session} initialPdfs={pdfList} />;
}
