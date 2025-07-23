import React, { useRef, useImperativeHandle } from "react";

export interface BookDeleteModalRef {
  open: () => void;
  close: () => void;
}

export default function BookDeleteModal({
  ref,
  pdfTitle,
  handleDelete,
  loading,
}: {
  ref: React.RefObject<BookDeleteModalRef | null>;
  pdfTitle: string;
  handleDelete: () => void;
  loading?: boolean;
}) {
  const deleteRef = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => {
    const modalMethods: BookDeleteModalRef = {
      open: () => deleteRef.current?.showModal(),
      close: () => deleteRef.current?.close(),
    };
    return modalMethods;
  }, []);

  return (
    <dialog ref={deleteRef} className="modal backdrop-blur-xs">
      <div className="modal-box">
        <h3 className="font-bold text-lg text-warning">Delete PDF?</h3>
        <p className="py-4">
          Are you sure you want to delete{" "}
          <span className="inline-block align-middle overflow-hidden max-w-44 overflow-ellipsis text-nowrap text-primary">
            {pdfTitle}
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
          <button className="btn btn-error" onClick={() => handleDelete()}>
            {loading ? (
              <span>
                Deleting{" "}
                <span className="loading loading-spinner loading-l"></span>
              </span>
            ) : (
              "Yes, Delete"
            )}
          </button>
          <button
            className="btn"
            disabled={loading}
            onClick={() => {
              deleteRef.current?.close();
            }}
          >
            Nope
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button disabled={loading}>close</button>
      </form>
    </dialog>
  );
}
