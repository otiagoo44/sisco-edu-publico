import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { PhotoFrame, type Photo } from "../photos";
export function Invitation({
  photos,
  reduced,
  onAccept,
}: {
  photos: Photo[];
  reduced: boolean;
  onAccept: () => void;
}) {
  const arena = useRef<HTMLDivElement>(null);
  const no = useRef<HTMLButtonElement>(null);
  const yes = useRef<HTMLButtonElement>(null);
  const count = useRef(0);
  const reducedRef = useRef(reduced);
  reducedRef.current = reduced;
  function move(pointer?: { x: number; y: number }) {
    if (!arena.current || !no.current || !yes.current) return;
    const bounds = arena.current.getBoundingClientRect();
    const yesBounds = yes.current.getBoundingClientRect();
    const noBounds = no.current.getBoundingClientRect();
    const minimumX = yesBounds.right - bounds.left + 24;
    const maximumX = Math.max(minimumX, bounds.width - noBounds.width - 4);
    const maximumY = Math.max(8, bounds.height - noBounds.height - 8);
    const slots = [
      [0, 0],
      [1, 1],
      [0.1, 0.9],
      [1, 0.05],
      [0.55, 0.55],
    ];
    const current = {
      x: noBounds.x + noBounds.width / 2,
      y: noBounds.y + noBounds.height / 2,
    };
    const origin = pointer ?? current;
    const choices = slots.map(([x, y], index) => ({
      x: minimumX + x * (maximumX - minimumX),
      y: 8 + y * (maximumY - 8),
      index,
    }));
    const ordered = choices
      .map((c) => ({
        ...c,
        distance: Math.hypot(
          bounds.left + c.x + noBounds.width / 2 - origin.x,
          bounds.top + c.y + noBounds.height / 2 - origin.y,
        ),
      }))
      .sort((a, b) => b.distance - a.distance);
    const target = ordered[count.current % Math.min(2, ordered.length)];
    count.current++;
    no.current.dataset.escapes = String(count.current);
    gsap.to(no.current, {
      x: target.x,
      y: target.y,
      rotation: count.current % 2 ? -4 : 4,
      duration: reducedRef.current ? 0 : 0.16,
      ease: "power2.out",
      overwrite: true,
    });
  }
  useLayoutEffect(() => {
    const button = no.current!;
    const layout = () => {
      if (!arena.current || !yes.current) return;
      gsap.set(button, {
        x: Math.min(
          arena.current.clientWidth - button.offsetWidth - 4,
          yes.current.offsetWidth + 40,
        ),
        y: 8,
        rotation: 0,
      });
    };
    layout();
    const resize = new ResizeObserver(layout);
    resize.observe(arena.current!);
    return () => {
      resize.disconnect();
      gsap.killTweensOf(button);
    };
  }, []);
  return (
    <div className="invitation-layout">
      <div className="invitation-copy">
        <p className="invitation-address">PROFE DANILO,</p>
        <h1
          className="invitation-title"
          tabIndex={-1}
          aria-label="PROFE DANILO, ¿QUIERE SER NUESTRO PADRINO?"
        >
          <span>¿QUIERE SER</span>
          <span>NUESTRO</span>
          <span className="question-last">
            PADRINO<span>?</span>
          </span>
        </h1>
        <p className="invitation-promo">Promoción 2026</p>
        <div
          className="response-arena"
          ref={arena}
          onPointerMove={(e) => {
            if (e.pointerType !== "mouse" || !no.current) return;
            const r = no.current.getBoundingClientRect();
            if (
              e.clientX >= r.left - 24 &&
              e.clientX <= r.right + 24 &&
              e.clientY >= r.top - 22 &&
              e.clientY <= r.bottom + 22
            )
              move({ x: e.clientX, y: e.clientY });
          }}
        >
          <button ref={yes} className="yes-button" onClick={onAccept}>
            SÍ <span aria-hidden="true">↗</span>
          </button>
          <button
            ref={no}
            className="no-button"
            data-escapes="0"
            onPointerEnter={(e) => {
              if (e.pointerType === "mouse")
                move({ x: e.clientX, y: e.clientY });
            }}
            onPointerDown={(e) => {
              e.preventDefault();
              move({ x: e.clientX, y: e.clientY });
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                move();
              }
            }}
            onClick={(e) => {
              e.preventDefault();
              move();
            }}
          >
            NO
          </button>
        </div>
      </div>
      <div className="invitation-portrait">
        <span className="portrait-year" aria-hidden="true">
          26
        </span>
        <PhotoFrame photo={photos[6]} className="question-photo" />
        <span className="portrait-caption">El profe. Nuestro candidato.</span>
        <span className="portrait-corner" aria-hidden="true">
          ↖
        </span>
      </div>
    </div>
  );
}
