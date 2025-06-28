"use client";
import PdfUploader from "@/components/PdfUploader";
import BookCard from "@/components/ui/bookCard";

export default function Books() {
  return (
    <section className="p-10 bg-base-200 rounded-box flex flex-col gap-10">
      <div className="flex justify-between flex-wrap gap-3 items-center p-5 rounded-box">
        <h1 className="text-3xl ">
          Your <span className="text-primary font-bold">Books:</span>
        </h1>
        <PdfUploader />
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
        <div className="flex mt-5 flex-wrap justify-center gap-5">
          {/*{PdfList.map((pdf) => {*/}
          {/*  return (*/}
          {/*    <BookCard*/}
          {/*      key={pdf._id}*/}
          {/*      bookName={pdf.title}*/}
          {/*      author={pdf.author}*/}
          {/*      coverPicture={pdf.cover}*/}
          {/*      progress={pdf.progress ?? 1}*/}
          {/*    />*/}
          {/*  );*/}
          {/*})}*/}
        </div>
      </div>
    </section>
  );
}
