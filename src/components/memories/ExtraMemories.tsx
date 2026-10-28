import { useEffect, useRef, useState } from "react";
import { extraMemories } from "../../content/memories";
import { ChapterImage, ChapterVideo } from "./ChapterMedia";

export function ExtraMemories({ onClose }: { onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const media = extraMemories[index];
  useEffect(() => {
    const trigger = document.activeElement as HTMLElement | null;
    const node = dialog.current!;
    node.showModal();
    return () => { node.close(); trigger?.focus(); };
  }, []);
  useEffect(() => { dialog.current?.scrollTo({ top: 0, behavior: "instant" }); }, [index]);
  return (
    <dialog ref={dialog} className="extra-memories" aria-labelledby="extra-title" onCancel={onClose}>
      <div className="overview-header">
        <h2 id="extra-title">Más recuerdos</h2>
        <button autoFocus className="chapter-control" onClick={onClose}>Cerrar ×</button>
      </div>
      <div className="extra-feature">
        {media.type === "image" ? <ChapterImage key={media.image.src} image={media.image} />
          : <ChapterVideo key={media.src} media={media} onPlayingChange={setPlaying} />}
      </div>
      <p className="extra-caption">{media.caption}</p>
      <nav className="extra-controls" aria-label="Galería complementaria">
        <button className="chapter-control" disabled={playing} onClick={() => setIndex((index - 1 + extraMemories.length) % extraMemories.length)}>← Anterior recuerdo</button>
        <span aria-live="polite">{index + 1} / {extraMemories.length}</span>
        <button className="chapter-control" disabled={playing} onClick={() => setIndex((index + 1) % extraMemories.length)}>Siguiente recuerdo →</button>
      </nav>
      <div className="extra-thumbnails">
        {extraMemories.map((item, i) => <button key={item.order} disabled={playing} aria-current={i === index ? "true" : undefined}
          aria-label={item.caption + (item.type === "video" ? " Video" : "")} onClick={() => setIndex(i)}>
          <img loading="lazy" src={item.type === "image" ? item.image.src : item.poster} alt="" />
        </button>)}
      </div>
    </dialog>
  );
}
