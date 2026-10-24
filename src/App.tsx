import { useCallback, useEffect, useReducer, useState } from "react";
import { stageReducer, cinematicStages, type Stage } from "./state";
import { useReducedMotion, useScene } from "./hooks";
import { usePhotos } from "./photos";
import { BootIntro } from "./components/BootIntro";
import { Diagnostic } from "./components/Diagnostic";
import { GlitchTransition } from "./components/GlitchTransition";
import { PhotoMontage } from "./components/PhotoMontage";
import { Invitation } from "./components/Invitation";
import { AcceptanceCelebration } from "./components/AcceptanceCelebration";
import { AudioControl } from "./components/AudioControl";
import { SkipControl } from "./components/SkipControl";
import { MemoriesDialog } from "./components/MemoriesDialog";

const chapters = ["Conexión", "Diagnóstico", "Recuerdos", "La pregunta"];
const chapterFor: Record<Stage, number> = {
  boot: 0,
  diagnostic: 1,
  glitch: 1,
  montage: 2,
  invitation: 3,
  accepted: 3,
  declined: 3,
};
const announcements: Record<Stage, string> = {
  boot: "Presentación SISCO-EDU lista para iniciar.",
  diagnostic: "Diagnóstico narrativo en curso.",
  glitch: "Tenemos algo especial que decirle.",
  montage: "Recuerdos de la promoción.",
  invitation: "Profe, ¿quiere ser nuestro padrino?",
  accepted: "¡Felicidades! Sos nuestro padrino.",
  declined: "Gracias por ser parte de nuestra historia, profe.",
};

export default function App() {
  const reduced = useReducedMotion();
  const [stage, dispatch] = useReducer(
    stageReducer,
    reduced ? "invitation" : "boot",
  );
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [memories, setMemories] = useState(false);
  const photos = usePhotos();
  const advance = useCallback(() => dispatch({ type: "ADVANCE" }), []);
  const root = useScene(stage, running, paused, reduced, advance);
  const cinematic = cinematicStages.includes(stage);
  const revealed = ["montage", "invitation", "accepted", "declined"].includes(
    stage,
  );
  const skip = useCallback(() => dispatch({ type: "SKIP" }), []);
  const replay = () => {
    setRunning(false);
    setPaused(false);
    dispatch({ type: "REPLAY" });
    if (reduced) dispatch({ type: "SKIP" });
  };

  useEffect(() => {
    if (reduced) dispatch({ type: "SKIP" });
  }, [reduced]);
  useEffect(() => {
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && cinematic) skip();
    };
    const visibility = () => {
      if (document.hidden) setPaused(true);
    };
    document.addEventListener("keydown", escape);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      document.removeEventListener("keydown", escape);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [cinematic, skip]);
  useEffect(() => {
    document.title = revealed
      ? "OPERACIÓN PADRINO · Promo 2026"
      : "SISCO-EDU · Presentación del proyecto";
    if (["invitation", "accepted", "declined"].includes(stage))
      root.current
        ?.querySelector<HTMLElement>("h1")
        ?.focus({ preventScroll: true });
  }, [stage, revealed, root]);

  return (
    <div
      className={`app stage-${stage} ${paused && cinematic ? "is-paused" : ""}`}
    >
      <a className="skip-link" href="#experience">
        Ir al contenido
      </a>
      <div className="ambient" aria-hidden="true">
        <div className="blue-light" />
        <div className="grid-floor" />
        <span className="ambient-plus plus-a">+</span>
        <span className="ambient-plus plus-b">+</span>
        <span className="ambient-plus plus-c">+</span>
      </div>
      <header className="masthead">
        <a className="brand" href="#experience">
          <span className="brand-mark" aria-hidden="true">
            {"</>"}
          </span>
          <span>
            {revealed ? "OPERACIÓN PADRINO" : "SISCO-EDU"}
            <small>
              {revealed ? "UNA MISIÓN DE LA PROMO" : "PROYECTO · PRESENTACIÓN"}
            </small>
          </span>
        </a>
        <div className="masthead-right">
          <span className="edition">
            BTI <span>/</span> PROMO 2026
          </span>
          <AudioControl />
        </div>
      </header>
      <main
        ref={root}
        id="experience"
        className="experience"
        data-state={stage}
      >
        {stage === "boot" && (
          <BootIntro running={running} onStart={() => setRunning(true)} />
        )}
        {stage === "diagnostic" && <Diagnostic />}
        {stage === "glitch" && <GlitchTransition />}
        {stage === "montage" && <PhotoMontage photos={photos} />}
        {stage === "invitation" && (
          <Invitation
            photos={photos}
            reduced={reduced}
            onAccept={() => dispatch({ type: "ACCEPT" })}
            onDecline={(value) => {
              setThinking(value);
              dispatch({ type: "DECLINE" });
            }}
            onMemories={() => setMemories(true)}
          />
        )}
        {stage === "accepted" && (
          <AcceptanceCelebration
            photos={photos}
            reduced={reduced}
            onReplay={replay}
            onMemories={() => setMemories(true)}
          />
        )}
        {stage === "declined" && (
          <div className="declined-layout">
            <p className="eyebrow warm">CADA HISTORIA TIENE SU TIEMPO</p>
            <span className="declined-symbol" aria-hidden="true">
              {"{ ♡ }"}
            </span>
            <h1 className="scene-title" tabIndex={-1}>
              {thinking
                ? "Los mejores commits\nse piensan con calma."
                : "El cariño no depende\nde una respuesta."}
            </h1>
            <p className="scene-description">
              {thinking
                ? "Tómese su tiempo, profe. Esta invitación sigue abierta."
                : "Gracias por todo lo que nos enseñó, profe.\nYa es parte de nuestra historia."}
            </p>
            <div className="declined-actions">
              <button
                className="button primary"
                onClick={() => dispatch({ type: "RECONSIDER" })}
              >
                Volver a la invitación <span aria-hidden="true">↗</span>
              </button>
              <button className="text-button" onClick={() => setMemories(true)}>
                Ver nuestros recuerdos
              </button>
            </div>
            <p className="local-note">
              Su respuesta queda sólo en esta pantalla.
            </p>
          </div>
        )}
      </main>
      <footer className="experience-footer">
        <ol className="chapters" aria-label="Capítulos de la presentación">
          {chapters.map((name, i) => (
            <li
              key={name}
              className={`${i === chapterFor[stage] ? "current" : ""} ${i < chapterFor[stage] ? "complete" : ""}`}
              aria-current={i === chapterFor[stage] ? "step" : undefined}
            >
              <span className="chapter-number">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{name}</span>
              <span className="chapter-line" />
            </li>
          ))}
        </ol>
        <div className="footer-controls">
          {cinematic ? (
            <SkipControl
              onSkip={skip}
              running={running}
              paused={paused}
              onPause={() => setPaused(!paused)}
            />
          ) : (
            <span className="footer-signature">
              HECHO CON CÓDIGO. Y CON CARIÑO.
              <span className="cyan" aria-hidden="true">
                {" "}
                ✳
              </span>
            </span>
          )}
        </div>
      </footer>
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcements[stage]}
      </div>
      {memories && (
        <MemoriesDialog photos={photos} onClose={() => setMemories(false)} />
      )}
    </div>
  );
}
