import { useEffect, useRef } from "react";
import { PhotoFrame, type Photo } from "../photos";

export function MemoriesDialog({
  photos,
  onClose,
}: {
  photos: Photo[];
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const node = dialog.current!;
    const trigger = document.activeElement as HTMLElement | null;
    node.showModal();
    return () => {
      node.close();
      trigger?.focus();
    };
  }, []);
  return (
    <dialog
      className="memories-dialog"
      ref={dialog}
      aria-labelledby="memories-title"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="memories-header">
        <div>
          <p className="eyebrow cyan">NUESTRO ARCHIVO FAVORITO</p>
          <h2 id="memories-title">
            Pequeños momentos.
            <br />
            Grandes recuerdos.
          </h2>
        </div>
        <button className="button secondary" onClick={onClose} autoFocus>
          Cerrar <span aria-hidden="true">×</span>
        </button>
      </div>
      <div className="memories-grid">
        {photos.length ? (
          photos.map((p, i) => (
            <figure key={p.id}>
              <PhotoFrame photo={p} small />
              <figcaption className="mono">
                RECUERDO_{String(i + 1).padStart(2, "0")} / PROMO 2026
              </figcaption>
            </figure>
          ))
        ) : (
          <PhotoFrame />
        )}
      </div>
      <p className="scene-description">
        Lo mejor de estos recuerdos es haberlos compartido.
      </p>
    </dialog>
  );
}
