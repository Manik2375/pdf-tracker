import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { deletePdf } from "@/lib/actions";
import { useRouter } from "next/navigation";
import BookDeleteModal, {
  BookDeleteModalRef,
} from "@/components/ui/bookDeleteModal";
import BookMetaDataModal, {
  BookMetaDataModalRef,
} from "@/components/ui/bookMetaDataModal";
import { updatePdfMetadata } from "@/lib/actions";

export default function BookListItem({
  pdfId,
  cloudinaryPublicId,
  bookName,
  author,
  description,
  progress,
  totalPages,
  onDataChang,
}: {
  pdfId: string;
  cloudinaryPublicId: string;
  bookName: string;
  author: string;
  description: string;
  progress: number;
  totalPages: number;
  onDataChange: () => void;
}) {
  const router = useRouter();

  const deleteRef = useRef<BookDeleteModalRef | null>(null);

  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [editLoading, setEditLoading] = useState<boolean>(false);

  const editModalRef = useRef<BookMetaDataModalRef | null>(null);

  const handleDelete = useCallback(async () => {
    try {
      setDeleteLoading(true);
      console.log(cloudinaryPublicId);
      const result = await deletePdf(pdfId, cloudinaryPublicId);
      if (result?.success == true) {
        onDataChange();
        alert("PDF deleted successfully");
        deleteRef.current?.close();
      }
    } catch (e) {
      console.error("Error deleting PDF ", e);
    } finally {
      setDeleteLoading(false);
    }
  }, [pdfId, cloudinaryPublicId]);

  const handleMetadataUpdate = useCallback(
    async ({
      title,
      author,
      description,
    }: {
      title: string;
      author: string;
      description: string;
    }) => {
      try {
        if (!editModalRef.current) return;
        setEditLoading(true);
        const result = await updatePdfMetadata(pdfId, {
          title,
          author,
          description,
        });
        if (result.success) {
          onDataChange();
          alert("PDF updated successfully");
          editModalRef.current.close();
        } else {
          alert("PDF Updating failed");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setEditLoading(false);
      }
    },
    [pdfId],
  );

  const coverPicture = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/pg_1/w_400/${cloudinaryPublicId}.png`;
  return (
    <>
      <li
        onClick={() => {
          router.push(`/home/${pdfId}`);
        }}
        className="last-of-type:[&>.dropdown]:dropdown-top relative grid p-5 flex-1 max-w-[20em] md:max-w-[initial] md:grid-cols-[max-content_1fr_1fr_2fr_max-content] items-center gap-3 md:p-3 border-neutral border rounded-box md:border-b cursor-pointer hover:bg-base-300 active:scale-[0.99] has-[button:active]:scale-100"
      >
        <div
          className="radial-progress mx-4 text-primary"
          style={
            {
              "--value": (progress / totalPages) * 100,
              "--size": "4rem",
              "--thickness": "0.25em",
            } as React.CSSProperties
          }
          aria-valuenow={(progress / totalPages) * 100}
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
          <span className="block text-nowrap overflow-ellipsis overflow-x-hidden max-w-[7em]">
            {author}
          </span>
        </p>
        <p
          className="tooltip text-base-content font-light w-max"
          data-tip={description}
        >
          <span className="block text-nowrap overflow-ellipsis overflow-x-hidden max-w-[15em]">
            {description}
          </span>
        </p>
        <button
          className="btn btn-soft btn-neutral ml-auto md:ml-0"
          popoverTarget={`popover-${pdfId}`}
          style={{ anchorName: `--anchor-${pdfId}` } as React.CSSProperties}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          Action
        </button>

        <ul
          className="dropdown dropdown-end  menu rounded-box w-32 bg-base-100 shadow-sm flex flex-col gap-3 py-3"
          popover="auto"
          id={`popover-${pdfId}`}
          style={{ positionAnchor: `--anchor-${pdfId}` } as React.CSSProperties}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <li>
            <button
              className="btn btn-neutral "
              onClick={() => editModalRef.current?.open()}
            >
              Edit
            </button>{" "}
          </li>
          <li>
            <button
              className="btn btn-error"
              onClick={() => deleteRef.current?.open()}
            >
              Delete
            </button>{" "}
          </li>
        </ul>
      </li>
      <BookDeleteModal
        ref={deleteRef}
        pdfTitle={bookName}
        handleDelete={handleDelete}
        loading={deleteLoading}
      />
      <BookMetaDataModal
        ref={editModalRef}
        handleUpdate={handleMetadataUpdate}
        pdfTitle={bookName}
        author={author}
        description={description}
        loading={editLoading}
      />
    </>
  );
}
