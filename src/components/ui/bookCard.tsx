import Image from "next/image";

export default function BookCard({
  bookName,
  author,
  coverPicture,
  progress,
}: {
  bookName: string;
  author: string,
  coverPicture: string;
  progress: number;
}) {
  return (
    <div className="relative card min-w-[12em] max-w-[14em] flex-1 bg-base-100 shadow-sm rounded-box overflow-hidden aspect-[1/1.5]">
      <figure>
        <Image
          src={coverPicture}
          alt={bookName}
          width={100}
          height={100}
          className="w-full scale-105"
        />
      </figure>
       <div className="card-body pt-2 h-[16em]">
        <p className="text-secondary text-sm overflow-ellipsis wrap-anywhere">
          {author?.slice(0, 25)}
        </p>
        <h2 className="card-title overflow-ellipsis wrap-anywhere">
          {bookName.slice(0, 25) + "..."}
        </h2>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">Read</button>
        </div>
        <progress
          className="progress progress-primary w-full absolute top-full left-0 translate-y-[-100%]"
          value={progress}
          max="100"
        ></progress>
      </div>
    </div>
  );
}
