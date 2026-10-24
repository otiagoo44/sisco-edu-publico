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
      <div className="accepted-photo">
        <PhotoFrame photo={photos[0]} />
        <span className="accepted-stamp">
          PADRINO
          <br />
          <strong>2026</strong>
        </span>
      </div>
      <div className="accepted-copy">
        <p className="eyebrow warm">MISIÓN CUMPLIDA. HISTORIA POR ESCRIBIR.</p>
        <h1 className="accepted-title" tabIndex={-1}>
          ¡Felicidades!
        </h1>
        <p className="accepted-message">
          Sos el padrino de la mejor promo de{" "}
          <span className="cyan">Bachillerato Técnico en Informática</span>
        </p>
        <p className="scene-description">
          El mejor proyecto siempre fue este equipo.
          <br />
          Gracias por ser parte, profe.
        </p>
        <p className="signature">
          Con cariño, su promo 2026 <span aria-hidden="true">♡</span>
        </p>
        <div className="accepted-actions">
          <button className="button primary" onClick={onMemories}>
            Ver nuestros recuerdos <span aria-hidden="true">↗</span>
          </button>
          <button className="text-button" onClick={onReplay}>
            Volver a vivirlo ↺
          </button>
        </div>
        <p className="local-note">
          Este sí se celebra acá. ¡Cuéntenoslo también en persona!
        </p>
      </div>
    </div>
  );
}
