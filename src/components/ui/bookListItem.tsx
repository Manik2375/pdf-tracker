import React from "react";

import Image from "next/image";

export default function BookListItem({
  pdfId,
  bookName,
  author,
  description,
  coverPicture,
  progress,
}: {
  pdfId: string;
  bookName: string;
  author: string;
  description: string;
  coverPicture: string;
  progress: number;
}) {
  return (
    <li className="relative grid grid-cols-[max-content_1fr_1fr_2fr_max-content] items-center gap-3 p-3 border-neutral border-b cursor-pointer hover:bg-base-300 active:scale-[0.99] has-[button:active]:scale-100 last:[&>.dropdown]:dropdown-top">
      <div
        className="radial-progress mx-4 text-primary"
        style={
          {
            "--value": progress,
            "--size": "4rem",
            "--thickness": "0.25em",
          } as React.CSSProperties
        }
        aria-valuenow={progress}
        role="progressbar"
      >
        <Image
          src={coverPicture}
          alt="Book cover"
          width="50"
          height="50"
          className="rounded-full aspect-square object-cover"
        />
      </div>
      <p className="tooltip" data-tip={bookName}>
        <span className=" block text-primary text-nowrap overflow-ellipsis overflow-x-hidden max-w-[8em]">
          {bookName}
        </span>
      </p>
      <p className="tooltip text-neutral font-light" data-tip={author}>
        <span>{author}</span>
      </p>
      <p
        className="tooltip text-base-content font-light"
        data-tip={description}
      >
        <span>{description}</span>
      </p>
      <button
        className="btn btn-soft btn-neutral"
        popoverTarget={`popover-${pdfId}`}
        style={{ anchorName: `--anchor-${pdfId}` } as React.CSSProperties}
      >
        Action
      </button>

      <ul
        className="dropdown dropdown-end  menu rounded-box w-32 bg-base-100 shadow-sm flex flex-col gap-3 py-3"
        popover="auto"
        id={`popover-${pdfId}`}
        style={{ positionAnchor: `--anchor-${pdfId}` } as React.CSSProperties}
      >
        <li>
          <button className="btn btn-neutral ">Edit</button>{" "}
        </li>
        <li>
          <button className="btn btn-error">Delete</button>{" "}
        </li>
      </ul>
    </li>
  );
}
