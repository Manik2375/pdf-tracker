import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { deletePdf } from "@/lib/actions";

export default function BookListItem({
  pdfId,
  cloudinaryPublicId,
  bookName,
  author,
  description,
  coverPicture,
  progress,
}: {
  pdfId: string;
  cloudinaryPublicId: string;
  bookName: string;
  author: string;
  description: string;
  coverPicture: string;
  progress: number;
}) {
  const deleteRef = useRef<HTMLDialogElement | null>(null);
  const [loading, setLoading] = useState<boolean>(false)

  const handleDelete = useCallback(async () => {
    try {
      setLoading(true)
      console.log(cloudinaryPublicId)
      const result = await deletePdf(pdfId, cloudinaryPublicId);
      if (result?.success == true) alert("PDF deleted successfully");
    } catch (e) {
      console.error("Error deleting PDF ", e);
    } finally {
      setLoading(false);
    }
  }, [pdfId, cloudinaryPublicId]);

  return (
    <>
      <li className="relative grid p-5 flex-1 max-w-[20em] md:max-w-[initial] md:grid-cols-[max-content_1fr_1fr_2fr_max-content] items-center gap-3 md:p-3 border-neutral border rounded-box md:border-b cursor-pointer hover:bg-base-300 active:scale-[0.99] has-[button:active]:scale-100 last-of-type:[&>.dropdown]:dropdown-top">
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
        <p className="tooltip " data-tip={bookName}>
          <span className=" block text-primary text-nowrap overflow-ellipsis overflow-x-hidden w-max max-w-[12em] md:max-w-[8em]">
            {bookName}
          </span>
        </p>
        <p className="tooltip text-neutral font-light w-max" data-tip={author}>
          <span>{author}</span>
        </p>
        <p
          className="tooltip text-base-content font-light w-max"
          data-tip={description}
        >
          <span>{description}</span>
        </p>
        <button
          className="btn btn-soft btn-neutral ml-auto md:ml-0"
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
            <button
              className="btn btn-error"
              onClick={() => deleteRef.current?.showModal()}
            >
              Delete
            </button>{" "}
          </li>
        </ul>
      </li>
      <dialog ref={deleteRef} className="modal backdrop-blur-xs">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-warning">Delete PDF?</h3>
          <p className="py-4">
            Are you sure you want to delete{" "}
            <span className="inline-block align-middle overflow-hidden max-w-44 overflow-ellipsis text-nowrap text-primary">
              {bookName}
            </span>{" "}
            PDF?
          </p>
          <div role="alert" className="alert alert-warning">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>Warning: This action can&apos;t be undone</span>
          </div>
          <div className="mt-5 flex justify-end gap-5">
            <button className="btn btn-error" onClick={handleDelete}>
              {loading ? (
                <span>Deleting <span className="loading loading-spinner loading-l"></span></span>
              ) : (
                "Yes, Delete"
              )}
            </button>
            <button
              className="btn"
              onClick={() => {
                deleteRef.current?.close();
              }}
            >
              Nope
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
