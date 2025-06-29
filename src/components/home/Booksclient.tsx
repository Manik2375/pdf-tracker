"use client";
import { useState } from "react";
import { IPDF } from "@/lib/db/models/pdf";
import PdfUploader from "@/components/PdfUploader";
import { Session } from "next-auth";
import BookListItem from "@/components/ui/bookListItem";

export default function BooksClient({
  session,
  initialPdfs,
}: {
  session: Session;
  initialPdfs: IPDF[];
}) {
  const [pdfs, setPdfs] = useState<IPDF[]>(initialPdfs);

  const fetchPdfs = () => {
    fetch("/api/pdfMetadata")
      .then((res) => res.json())
      .then(setPdfs);
  };

  if (!session?.user) return <p>Loading</p>;
  return (
    <section className="p-10 bg-base-200 rounded-box flex flex-col gap-10">
      <div className="flex justify-between flex-wrap gap-3 items-center p-5 rounded-box">
        <h1 className="text-3xl ">
          Your <span className="text-primary font-bold">Books:</span>
        </h1>
        <PdfUploader onSuccessfulUploadAction={fetchPdfs} />
      </div>
      <div className="rounded-box">
        <label className="input w-[min(90%,40em)] flex mx-auto">
          <svg
            className="h-[1em] opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input
            type="search"
            required
            placeholder="Search"
            className="w-full"
          />
        </label>
        <ul className="flex flex-col justify-center mt-10">
          <li className="p-3 gap-3 grid grid-cols-[max-content_1fr_1fr_2fr_max-content] border-neutral border-b">
            <div className="w-[100]"></div>
            <p>Book Name</p>
            <p>Author</p>
            <p>Description</p>
            <div className="w-[50]"></div>
          </li>
          {pdfs.map((pdf) => {
            return (
              <BookListItem
                key={pdf?._id}
                pdfId={pdf?._id}
                bookName={pdf?.title}
                description={pdf.description}
                author={pdf?.author}
                coverPicture={pdf?.cover}
                progress={pdf?.progress ?? 1}
              />
            );
          })}
        </ul>
      </div>
    </section>
  );
}
