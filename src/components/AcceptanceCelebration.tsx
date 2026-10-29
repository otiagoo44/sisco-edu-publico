import { useEffect, useRef } from "react";
import { PhotoFrame, type Photo } from "../photos";
export function AcceptanceCelebration({
  photos,
  reduced,
}: {
  photos: Photo[];
  reduced: boolean;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (reduced || !canvas.current) return;
    let dispose: (() => void) | undefined;
    let cancelled = false;
    import("../confetti")
      .then(({ celebrate }) => {
        if (!cancelled && canvas.current) dispose = celebrate(canvas.current);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      dispose?.();
    };
  }, [reduced]);
  return (
    <div className="accepted-layout">
      {!reduced && (
        <canvas ref={canvas} className="confetti-canvas" aria-hidden="true" />
      )}
      <div className="accepted-copy">
        <p className="accepted-intro">¡Tenemos padrino!</p>
        <h1 tabIndex={-1}>
          ¡FELICIDADES,
          <br />
          <span>PROFE!</span>
        </h1>
        <p className="accepted-message">
          AHORA SOS EL PADRINO DE LA MEJOR PROMO DE BACHILLERATO TÉCNICO EN
          INFORMÁTICA.
        </p>
      </div>
      <div className="celebration-collage celebration-single">
        {[5].map((index, slot) => (
          <PhotoFrame
            key={index}
            photo={photos[index]}
            className={"party-photo party-photo-" + slot}
          />
        ))}
        <div className="party-seal" aria-hidden="true">
          PADRINO
          <br />
          <strong>2026</strong>
        </div>
      </div>
    </div>
  );
}
