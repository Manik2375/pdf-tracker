import { auth } from "@/lib/auth";
import { PDF } from "@/lib/db/models/pdf";
import connectToDatabase from "@/lib/db/connection";
import BookCard from "@/components/ui/bookCard";
import PdfUploader from "@/components/PdfUploader";


export default async function Home() {
  const session = await auth();
  if (!session) throw new Error("Not logged in");

  await connectToDatabase();

  const userId = session.user._id;
  const PdfList = await PDF.find({ userId: userId });

  return (
    <section className="p-10 bg-base-200 rounded-box flex flex-col gap-10">
      <div className="flex justify-between flex-wrap gap-3 items-center p-5 rounded-box">
        <h1 className="text-3xl ">
          Welcome{" "}
          <span className="text-primary font-bold">{session.user.name}!</span>
        </h1>
        <PdfUploader />
      </div>
      <div className="rounded-box">
        <h2 className="text-2xl">
          Pick where you <span className="text-primary">left:</span>
        </h2>
        <div className="flex mt-5 flex-wrap justify-center gap-5">
          {PdfList.map((pdf) => {
            return (
              <BookCard
                key={pdf._id}
                bookName={pdf.title}
                author={pdf.author}
                coverPicture={pdf.cover}
                progress={pdf.progress ?? 1}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
