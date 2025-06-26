import { auth } from "@/lib/auth";
import BookCard from "@/components/ui/bookCard";
import PdfUploader from "@/components/PdfUploader";

export default async function Home() {
  const session = await auth();
  if (!session) throw new Error("Not logged in");

  return (
    <div className="p-10 bg-base-200 rounded-box flex flex-col gap-10">
      <div className="flex justify-between flex-wrap gap-3 items-center p-5 rounded-box">
        <h1 className="text-3xl ">
          Welcome{" "}
          <span className="text-primary font-bold">{session.user.name}!</span>
        </h1>
        <PdfUploader />
      </div>
      <div className="rounded-box">
        <h2 className="text-2xl">
          Your <span className="text-primary">Books:</span>
        </h2>
        <div className="flex mt-5 flex-wrap justify-center gap-5">
          <BookCard
            bookName="Something"
            coverPicture={"/logo.png"}
            progress={50}
          />
          <BookCard
            bookName="Something"
            coverPicture={"/logo.png"}
            progress={20}
          />
          <BookCard
            bookName="Something"
            coverPicture={"/logo.png"}
            progress={60}
          />
        </div>
      </div>
    </div>
  );
}