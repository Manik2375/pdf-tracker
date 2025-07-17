"use client";
import { useCallback, useState } from "react";
import { SerializedIPDF } from "@/lib/db/models/pdf";
import BookCard from "@/components/ui/bookCard";
import { PdfUploader } from "@/components/pdf";
import { Session } from "next-auth";

export default function HomeClient({
  session,
  initialPdfs,
}: {
  session: Session;
  initialPdfs: SerializedIPDF[];
}) {
  const [pdfs, setPdfs] = useState<SerializedIPDF[]>(initialPdfs);

  const fetchPdfs = useCallback(() => {
    fetch("/api/pdfMetadata")
      .then((res) => res.json())
      .then(setPdfs);
  }, []);

  if (!session?.user) return <p>Loading</p>;
  return (
    <section className="p-10 bg-base-200 rounded-box flex flex-col gap-10">
      <div className="flex justify-between flex-wrap gap-3 items-center p-5 rounded-box">
        <h1 className="text-3xl ">
          Welcome{" "}
          <span className="text-primary font-bold">{session.user.name}!</span>
        </h1>
        <PdfUploader onSuccessfulUploadAction={fetchPdfs} />
      </div>
      <div className="rounded-box">
        <h2 className="text-2xl">
          Pick where you <span className="text-primary">left:</span>
        </h2>
        <div className="flex mt-5 flex-wrap justify-center gap-5">
          {pdfs.map((pdf) => {
            return (
              <BookCard
                key={pdf?._id}
                pdfId={pdf._id}
                bookName={pdf?.title}
                author={pdf?.author}
                coverPicture={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/pg_1/w_400/${pdf.cloudinaryPublicId}.png`}
                progress={pdf?.progress}
                totalPages={pdf?.totalPages}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
