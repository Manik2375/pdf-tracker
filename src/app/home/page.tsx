import { auth } from "@/lib/auth";
import { getAllPdfMetaData } from "@/lib/actions";
import HomeClient from "@/components/home/HomeClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home"
}

export default async function Home() {
  const session = await auth();
  const pdfList = await getAllPdfMetaData();

  if (!session?.user) return <p>USER not authenticated</p>;

  return <HomeClient session={session} initialPdfs={pdfList} />;
}
