import { useState } from "react";
import type { ContentImage } from "../../content/types";

export function ChapterImage({
  image,
  className = "",
}: {
  image: ContentImage;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div
      className={
        "chapter-image " +
        className +
        (image.kind === "screenshot" ? " is-screenshot" : "")
      }
    >
      {failed ? (
        <div
          className="media-error"
          role="img"
          aria-label={image.alt + ". Imagen no disponible."}
        >
          Imagen no disponible
        </div>
      ) : (
        <img
          src={image.src}
          alt={image.alt}
          decoding="async"
          onError={() => setFailed(true)}
          style={{
            objectPosition: image.position ?? "center",
            objectFit: image.kind === "screenshot" ? "contain" : image.fit,
          }}
        />
      )}
    </div>
  );
}
export function PendingMedia({ label }: { label: string }) {
  return import.meta.env.DEV ? (
    <div className="pending-media" data-development-only>
      <span aria-hidden="true">▧</span>
      <strong>Fotografías pendientes</strong>
      <p>{label}</p>
      <small>Sólo visible en desarrollo</small>
    </div>
  ) : null;
}
