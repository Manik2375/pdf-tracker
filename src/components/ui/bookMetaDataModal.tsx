import React, { useState, useRef, useImperativeHandle } from "react";

export interface BookMetaDataModalRef {
  open: () => void;
  close: () => void;
}

export default function BookMetaDataModal({
  ref,
  handleUpdate,
  pdfTitle,
  author,
  description,
  loading,
}: {
  ref: React.RefObject<BookMetaDataModalRef | null>;
  handleUpdate: ({
    title,
    author,
    description,
  }: {
    title: string;
    author: string;
    description: string;
  }) => void;
  pdfTitle: string;
  author: string;
  description: string;
  loading: boolean;
}) {
  const editModalRef = useRef<HTMLDialogElement>(null);
  const [title, setTitle] = useState<string>(pdfTitle);
  const [authorText, setAuthorText] = useState<string>(author);
  const [descriptionText, setDescriptionText] = useState<string>(description);

  useImperativeHandle(ref, () => {
    const modalMethods: BookMetaDataModalRef = {
      open: () => editModalRef.current?.showModal(),
      close: () => editModalRef.current?.close(),
    };
    return modalMethods;
  });
  return (
    <dialog ref={editModalRef} className="modal backdrop-blur-xs">
      <div className="modal-box">
        <h3 className="font-bold text-lg text-warning">Edit details</h3>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="mt-5 mx-7 flex flex-col gap-5"
        >
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Title</legend>
            <input
              type="text"
              className="input w-full"
              placeholder="Type here"
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
            />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Author</legend>
            <input
              type="text"
              className="input w-full"
              placeholder="Type here"
              value={authorText}
              onChange={(e) => setAuthorText(e.currentTarget.value)}
            />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Description</legend>
            <textarea
              className="textarea h-24 w-full"
              placeholder="Bio"
              value={descriptionText}
              maxLength={200}
              onChange={(e) => setDescriptionText(e.currentTarget.value)}
            ></textarea>
          </fieldset>
        </form>
        <div className="mt-5 flex justify-end gap-5">
          <button
            className="btn btn-success"
            onClick={() => {
              if (
                title === pdfTitle &&
                authorText === author &&
                descriptionText === description
              ) {
                return;
              }

              handleUpdate({
                title: title || "No name given",
                author: authorText || "Unknown Author",
                description: descriptionText || "No description found",
              });
            }}
          >
            {loading ? (
              <span>
                Updating{" "}
                <span className="loading loading-spinner loading-l"></span>
              </span>
            ) : (
              "Update"
            )}
          </button>
          <button
            className="btn"
            onClick={() => {
              editModalRef.current?.close();
            }}
            disabled={loading}
          >
            Close
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button disabled={loading}>close</button>
      </form>
    </dialog>
  );
}
