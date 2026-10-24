import { useEffect, useRef } from "react";
import { PhotoFrame, type Photo } from "../photos";
export function AcceptanceCelebration({
  photos,
  reduced,
  onReplay,
  onMemories,
}: {
  photos: Photo[];
  reduced: boolean;
  onReplay: () => void;
  onMemories: () => void;
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
        <div className="accepted-actions">
          <button className="button primary" onClick={onMemories}>
            Ver las fotos <span aria-hidden="true">↗</span>
          </button>
          <button className="text-button" onClick={onReplay}>
            Ver de nuevo
          </button>
        </div>
      </div>
      <div className="celebration-collage">
        {[0, 3, 6, 9, 1, 4].map((index, slot) => (
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
