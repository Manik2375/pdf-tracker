import Image from "next/image";

export default function BookCard({
  bookName,
  coverPicture,
  progress,
}: {
  bookName: string;
  coverPicture: string;
  progress: number;
}) {
  return (
    <div className="relative card min-w-[12em] bg-base-100 shadow-sm rounded-box overflow-hidden">
      <figure>
        <Image
          src={coverPicture}
          alt={bookName}
          width={100}
          height={200}
          className="w-full"
        />
      </figure>
      <div className="card-body pt-2">
        <p className="text-secondary text-sm">Manik2375</p>
        <h2 className="card-title">The chronicles of owl</h2>
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
