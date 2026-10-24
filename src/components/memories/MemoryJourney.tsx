import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { memories } from "../../content/memories";
import { chapterComponents } from "./MemoryChapters";

const ordered = [...memories].sort((a, b) => a.order - b.order);
export function MemoryJourney({
  paused,
  reduced,
  onComplete,
}: {
  paused: boolean;
  reduced: boolean;
  onComplete: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [manual, setManual] = useState(false);
  const [replay, setReplay] = useState(0);
  const stage = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const memory = ordered[index];
  const changeChapter = (next: number, automatic = false) => {
    setIndex(next);
    setPhotoIndex(0);
    setManual(!automatic);
  };
  useEffect(() => {
    if (!ordered.length) onComplete();
  }, [onComplete]);
  useLayoutEffect(() => {
    if (!memory || !stage.current) return;
    const context = gsap.context(() => {
      const tl = gsap.timeline();
      timeline.current = tl;
      if (!reduced) {
        tl.from(
          ".memory-copy",
          { y: 24, duration: 0.55, ease: "power3.out" },
          0,
        );
        if (stage.current!.querySelector(".memory-main-image"))
          tl.from(
            ".memory-main-image",
            {
              clipPath: "inset(0 100% 0 0)",
              scale: 1.03,
              duration: 0.65,
              ease: "power3.out",
            },
            0.05,
          );
        if (stage.current!.querySelector(".memory-secondary-image"))
          tl.from(
            ".memory-secondary-image",
            { y: 40, duration: 0.5, ease: "power3.out" },
            0.25,
          );
      }
      const words = (memory.title + " " + memory.description).split(
        /\s+/,
      ).length;
      const read = Math.max(4.2, words * 0.22 + 1.2);
      tl.addLabel("fully-readable", 0.85);
      tl.to({}, { duration: 0.85 + read + 0.25 }, 0);
      if (!manual)
        tl.call(() => {
          if (index < ordered.length - 1) changeChapter(index + 1, true);
          else onComplete();
        });
    }, stage);
    return () => {
      context.revert();
      timeline.current = null;
    };
  }, [index, photoIndex, manual, reduced, replay, memory, onComplete]);
  useEffect(() => {
    const tl = timeline.current;
    if (paused && tl && tl.time() < 0.85) tl.time(0.85);
    tl?.paused(paused);
  }, [paused, index, photoIndex, manual, replay, reduced]);
  if (!memory) return null;
  const Chapter = chapterComponents[memory.composition];
  function changePhoto(direction: number) {
    setManual(true);
    setPhotoIndex(
      (photoIndex + direction + memory.photos.length) % memory.photos.length,
    );
  }
  return (
    <div
      className="memory-journey"
      data-memory={memory.id}
      onFocusCapture={(event) => {
        if (event.target instanceof HTMLButtonElement) setManual(true);
      }}
    >
      <nav className="memory-chapter-nav" aria-label="Capítulos de recuerdos">
        {ordered.map((item, i) => (
          <button
            key={item.id}
            aria-current={i === index ? "step" : undefined}
            onClick={() => changeChapter(i)}
          >
            {item.navLabel ?? item.title}
          </button>
        ))}
      </nav>
      <div ref={stage} className="memory-stage">
        <Chapter memory={memory} photoIndex={photoIndex} />
      </div>
      <div className="memory-controls">
        {memory.photos.length > 1 && (
          <div
            className="photo-navigation"
            aria-label="Fotografías del recuerdo"
          >
            <button
              className="chapter-control"
              onClick={() => changePhoto(-1)}
              aria-label="Foto anterior"
            >
              ←
            </button>
            <span aria-live="polite">
              {photoIndex + 1} / {memory.photos.length}
            </span>
            <button
              className="chapter-control"
              onClick={() => changePhoto(1)}
              aria-label="Foto siguiente"
            >
              →
            </button>
          </div>
        )}
        <div className="chapter-navigation">
          <button
            className="chapter-control"
            disabled={index === 0}
            onClick={() => changeChapter(index - 1)}
          >
            Anterior capítulo
          </button>
          <button
            className="chapter-control"
            onClick={() => {
              setPhotoIndex(0);
              setManual(false);
              setReplay(replay + 1);
            }}
          >
            Repetir capítulo
          </button>
          <button
            className="chapter-control next-chapter"
            onClick={() =>
              index < ordered.length - 1
                ? changeChapter(index + 1)
                : onComplete()
            }
          >
            {index < ordered.length - 1 ? "Siguiente capítulo" : "Ver mensajes"}{" "}
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
