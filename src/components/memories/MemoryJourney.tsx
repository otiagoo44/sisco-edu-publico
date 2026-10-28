import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { memories } from "../../content/memories";
import { chapterComponents } from "./MemoryChapters";
import { ExtraMemories } from "./ExtraMemories";

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
  const [playing, setPlaying] = useState(false);
  const [extras, setExtras] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const navigationRequested = useRef(false);
  const memory = ordered[index];
  const media = memory?.media[photoIndex];
  const changeChapter = (next: number, automatic = false) => {
    navigationRequested.current = !automatic;
    setIndex(next);
    setPhotoIndex(0);
    setPlaying(false);
    setManual(!automatic);
  };
  useEffect(() => {
    if (!ordered.length) onComplete();
  }, [onComplete]);
  useEffect(() => {
    if (!navigationRequested.current) return;
    navigationRequested.current = false;
    stage.current?.querySelector('h1')?.focus({ preventScroll: true });
    stage.current?.parentElement?.scrollIntoView({ behavior: "instant", block: "start" });
  }, [index, photoIndex, replay]);
  useLayoutEffect(() => {
    if (!memory || !stage.current) return;
    const context = gsap.context(() => {
      const tl = gsap.timeline();
      timeline.current = tl;
      if (!reduced) {
        tl.from('.memory-word', {yPercent: 110, rotation: 3, duration: .45, stagger: .035, ease: 'power4.out'}, 0);
        tl.from(
          ".memory-copy",
          { y: 24, duration: 0.55, ease: "power3.out" },
          0,
        );
        if (stage.current!.querySelector(".memory-main-image")) {
          const transition = memory.composition === "travel"
            ? { y: photoIndex % 2 ? -22 : 22, opacity: 0, duration: 0.65, ease: "power3.out" }
            : memory.composition === "blueprint"
              ? { y: 24, opacity: 0, duration: 0.7, ease: "power3.out" }
              : { clipPath: "inset(0 100% 0 0)", scale: 1.03, duration: 0.65, ease: "power3.out" };
          tl.from(
            ".memory-main-image",
            transition,
            0.05,
          );
        }
        if (media?.type === "video") tl.from(".chapter-video", {scale: 0.96, opacity: 0, duration: 0.7, ease: "power3.out"}, 0.3);
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
      const read = media?.type === "image" ? 1.8 : Math.max(2, words * 0.1);
      tl.addLabel("fully-readable", 0.85);
      tl.to({}, { duration: 0.85 + read + 0.25 }, 0);
      if (!manual && !reduced && media?.type === "image") tl.to(".memory-main-image", {opacity: 0, x: memory.composition === "travel" ? -45 : 0, scale: 0.96, duration: 0.25}, 0.85 + read);
      if (!manual && media?.type !== "video")
        tl.call(() => {
          if (photoIndex < memory.media.length - 1) setPhotoIndex(photoIndex + 1);
          else if (index < ordered.length - 1) changeChapter(index + 1, true);
          else onComplete();
        });
    }, stage);
    return () => {
      context.revert();
      timeline.current = null;
    };
  }, [index, photoIndex, manual, reduced, replay, memory, media, onComplete]);
  useEffect(() => {
    const tl = timeline.current;
    if (paused && tl && tl.time() < 0.85) tl.time(0.85);
    tl?.paused(paused || extras);
  }, [paused, extras, index, photoIndex, manual, replay, reduced]);
  if (!memory) return null;
  const Chapter = chapterComponents[memory.composition];
  function changePhoto(direction: number) {
    navigationRequested.current = true;
    setManual(true);
    setPhotoIndex(
      (photoIndex + direction + memory.media.length) % memory.media.length,
    );
  }
  return (
    <div
      className="memory-journey"
      data-memory={memory.id}

    >
      <nav className="memory-chapter-nav" aria-label="Capítulos de recuerdos">
        {ordered.map((item, i) => (
          <button
            key={item.id}
            disabled={playing}
            aria-current={i === index ? "step" : undefined}
            onClick={() => changeChapter(i)}
          >
            {item.navLabel ?? item.title}
          </button>
        ))}
      </nav>
      <div ref={stage} className="memory-stage">
        <Chapter memory={memory} photoIndex={photoIndex} paused={paused || extras} onPlayingChange={setPlaying} automatic={!manual} onVideoComplete={() => { if (manual) return; if (photoIndex < memory.media.length - 1) setPhotoIndex(photoIndex + 1); else if (index < ordered.length - 1) changeChapter(index + 1, true); else onComplete(); }} />
      </div>
      <div className="memory-controls">
        {memory.media.length > 1 && (
          <div
            className="photo-navigation"
            aria-label="Fotos y videos del recuerdo"
          >
            <button
              className="chapter-control"
              disabled={playing}
              onClick={() => changePhoto(-1)}
              aria-label="Recuerdo anterior"
            >
              ←
            </button>
            <span aria-live="polite">
              {photoIndex + 1} / {memory.media.length}
            </span>
            <button
              className="chapter-control"
              disabled={playing}
              onClick={() => changePhoto(1)}
              aria-label="Recuerdo siguiente"
            >
              →
            </button>
          </div>
        )}
        <div className="chapter-navigation">
          <button
            className="chapter-control"
            disabled={index === 0 || playing}
            onClick={() => changeChapter(index - 1)}
          >
            Anterior capítulo
          </button>
          <button
            className="chapter-control"
            disabled={playing}
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
            disabled={playing}
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
      <div className="memory-extras-link"><button className="chapter-control" onClick={() => { setManual(true); setExtras(true); }}>Más recuerdos · fotos y videos</button></div>
      {extras && <ExtraMemories onClose={() => setExtras(false)} />}
    </div>
  );
}
