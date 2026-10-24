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
import { MemoryJourney } from "./components/memories/MemoryJourney";
import { StudentsChapter } from "./components/StudentsChapter";
const announcements: Record<Stage, string> = {
  boot: "SISCO-EDU. Sistema de gestión académica.",
  diagnostic: "Se encontró un pendiente. Analizando candidatos.",
  glitch: "Cambio de escena.",
  montage: "Candidato encontrado.",
  memories: "Los proyectos y el viaje con el profe Danilo.",
  students: "¿Qué piensa la promo del profe Danilo?",
  invitation: "Profe Danilo, ¿quiere ser nuestro padrino?",
  accepted: "¡Felicidades, profe! Ahora sos nuestro padrino.",
};
export default function App() {
  const reduced = useReducedMotion();
  const [stage, dispatch] = useReducer(stageReducer, "boot");
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [memories, setMemories] = useState(false);
  const photos = usePhotos(running);
  const advance = useCallback(() => dispatch({ type: "ADVANCE" }), []);
  const root = useScene(stage, running, paused, reduced, advance);
  const cinematic = running && cinematicStages.includes(stage);
  const idle = stage === "boot" && !running;
  const skip = useCallback(() => dispatch({ type: "SKIP" }), []);
  const replay = () => {
    setRunning(false);
    setPaused(false);
    dispatch({ type: "REPLAY" });
  };
  useEffect(() => {
    const escape = (event: KeyboardEvent) => {
      if (
        event.key === "Escape" &&
        cinematic &&
        !document.querySelector("dialog[open]")
      )
        skip();
    };
    const visibility = () => {
      if (document.hidden && running) setPaused(true);
    };
    document.addEventListener("keydown", escape);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      document.removeEventListener("keydown", escape);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [cinematic, running, skip]);
  useEffect(() => {
    document.title = ["invitation", "accepted"].includes(stage)
      ? "Promo 2026 · OPERACIÓN PADRINO"
      : "SISCO-EDU | Gestión académica";
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute(
        "content",
        idle ? "#f8fafc" : stage === "accepted" ? "#f5f2ea" : "#182de0",
      );
    if (["invitation", "accepted"].includes(stage)) {
      window.scrollTo({ top: 0, behavior: "instant" });
      root.current
        ?.querySelector<HTMLElement>("h1")
        ?.focus({ preventScroll: true });
    }
  }, [stage, idle, root]);
  return (
    <div
      className={
        "app stage-" +
        stage +
        (idle ? " is-idle" : " has-started") +
        (paused && cinematic ? " is-paused" : "")
      }
    >
      <a className="skip-link" href="#experience">
        Ir al contenido
      </a>
      {!idle && (
        <header className="film-header">
          <a href="#experience" className="film-brand">
            {["invitation", "accepted"].includes(stage) ? (
              <>
                Promo <strong>2026</strong>
              </>
            ) : (
              "SISCO-EDU"
            )}
          </a>
          <AudioControl />
        </header>
      )}
      <main
        ref={root}
        id="experience"
        className="experience"
        data-state={stage}
        data-running={running}
      >
        {stage === "boot" && (
          <BootIntro running={running} onStart={() => setRunning(true)} />
        )}
        {stage === "diagnostic" && <Diagnostic />}
        {stage === "glitch" && <GlitchTransition />}
        {stage === "montage" && <PhotoMontage photos={photos} />}
        {stage === "memories" && (
          <MemoryJourney
            paused={paused}
            reduced={reduced}
            onComplete={advance}
          />
        )}
        {stage === "students" && (
          <StudentsChapter
            reduced={reduced}
            paused={paused}
            onContinue={advance}
          />
        )}
        {stage === "invitation" && (
          <Invitation
            photos={photos}
            reduced={reduced}
            onAccept={() => dispatch({ type: "ACCEPT" })}
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
      </main>
      {!idle && (
        <footer className="film-footer">
          <span>
            {["invitation", "accepted", "students", "memories"].includes(stage)
              ? "Bachillerato Técnico en Informática"
              : "SISCO-EDU"}
          </span>
          {cinematic && (
            <div className="film-playback">
              <button className="utility-button" onClick={replay}>
                Repetir
              </button>
              <SkipControl
                onSkip={skip}
                running={running}
                paused={paused}
                onPause={() => setPaused(!paused)}
              />
            </div>
          )}
        </footer>
      )}
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
