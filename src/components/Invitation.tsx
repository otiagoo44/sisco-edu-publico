import { useState } from "react";
import { PhotoFrame, type Photo } from "../photos";

export function Invitation({
  photos,
  reduced,
  onAccept,
  onDecline,
  onMemories,
}: {
  photos: Photo[];
  reduced: boolean;
  onAccept: () => void;
  onDecline: (thinking: boolean) => void;
  onMemories: () => void;
}) {
  const [escaped, setEscaped] = useState(false);
  return (
    <div className="invitation-layout">
      <div className="invitation-copy">
        <p className="eyebrow">
          <span className="warm-line" /> MISIÓN: SEGUIR JUNTOS
        </p>
        <h1 className="invitation-title" tabIndex={-1}>
          Profe,
          <br />
          ¿quiere ser
          <br /> nuestro{" "}
          <span className="padrino-word">
            padrino<span className="cyan">?</span>
            <svg viewBox="0 0 330 14" aria-hidden="true">
              <path d="M3 10Q120 0 327 5" />
            </svg>
          </span>
        </h1>
        <p className="invitation-description">
          Nos enseñó a resolver problemas.
          <br />
          Ahora tenemos uno: no imaginamos
          <br className="desktop-break" /> este último capítulo sin usted.
        </p>
        <div className="response-actions">
          <button className="button primary accept-button" onClick={onAccept}>
            Sí, ¡acepto la misión! <span aria-hidden="true">↗</span>
          </button>
          <button
            className={`button secondary no-button ${escaped ? "escaped" : ""}`}
            onPointerEnter={(e) => {
              if (e.pointerType === "mouse" && !escaped && !reduced)
                setEscaped(true);
            }}
            onClick={() => onDecline(false)}
          >
            No, gracias
          </button>
        </div>
        <div className="decision-note" aria-live="polite">
          {escaped
            ? "Un pequeño bug de nervios. Ahora sí, puede decir que no."
            : "Una invitación de toda la promo. Con mucho cariño."}
        </div>
        <button
          className="text-button think-button"
          onClick={() => onDecline(true)}
        >
          Quiero pensarlo un poquito <span aria-hidden="true">→</span>
        </button>
      </div>
      <div className="invitation-visual">
        <div className="orbit-ring" aria-hidden="true" />
        <span className="visual-year" aria-hidden="true">
          2026
        </span>
        <PhotoFrame photo={photos[6]} className="invite-photo invite-back" />
        <PhotoFrame photo={photos[0]} className="invite-photo invite-main" />
        <div className="photo-note">
          <span className="note-star" aria-hidden="true">
            ✳
          </span>
          <span>
            Hay profes que dejan huella.
            <br />
            <strong>Usted dejó historia.</strong>
          </span>
        </div>
        <button className="memories-button" onClick={onMemories}>
          <span aria-hidden="true">▧</span> Nuestros recuerdos{" "}
          <span aria-hidden="true">↗</span>
        </button>
      </div>
    </div>
  );
}
