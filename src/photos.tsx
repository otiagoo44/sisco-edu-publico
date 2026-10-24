import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

export type Photo = {
  id: string;
  src: string;
  thumbnail: string;
  alt: string;
  width: number;
  height: number;
};
export function usePhotos(enabled: boolean) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    fetch("/photos/profe/manifest.json", { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error("Manifest no disponible");
        return r.json();
      })
      .then((data: { photos?: unknown }) => {
        if (!Array.isArray(data.photos)) return;
        const valid = data.photos.filter(
          (p): p is Photo =>
            p &&
            typeof p.id === "string" &&
            typeof p.src === "string" &&
            p.src.startsWith("/photos/profe/") &&
            typeof p.thumbnail === "string" &&
            p.thumbnail.startsWith("/photos/profe/") &&
            typeof p.alt === "string" &&
            p.width > 0 &&
            p.height > 0,
        );
        setPhotos(valid);
        // Preload critical imagery without waiting for it to advance the narrative.
        valid.forEach((p) => {
          const img = new Image();
          img.src = p.src;
          img.decode?.().catch(() => {});
        });
      })
      .catch(() => {});
    return () => controller.abort();
  }, [enabled]);
  return photos;
}

export function PhotoFrame({
  photo,
  className = "",
  small = false,
  style,
}: {
  photo?: Photo;
  className?: string;
  small?: boolean;
  style?: CSSProperties;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div
      className={`photo-frame ${className}`}
      style={style}
      data-photo-id={photo?.id}
    >
      {photo && !failed ? (
        <img
          src={small ? photo.thumbnail : photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          loading={small ? "lazy" : "eager"}
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          className="photo-placeholder"
          role="img"
          aria-label="Fotografía no disponible"
        >
          <span aria-hidden="true">▧</span>
          <p>Foto no disponible</p>
          <small>PROMO 2026</small>
        </div>
      )}
    </div>
  );
}
