import { KineticText } from "./KineticText";

export function BootIntro({
  running,
  onStart,
}: {
  running: boolean;
  onStart: () => void;
}) {
  return (
    <div className="boot-layout">
      <div className="boot-copy">
        <p className="eyebrow">
          <span className="status-dot" /> ENTORNO DE PRESENTACIÓN
        </p>
        <h1 className="boot-title">
          <span>
            SISCO<span className="cyan">_</span>
          </span>
          <span className="outline-type">
            EDU<span className="title-dot">.</span>
          </span>
        </h1>
        <p className="boot-description">
          Todo gran proyecto
          <br /> empieza con una conexión.
        </p>
        <div className="project-label">
          <span className="label-line" /> BACHILLERATO TÉCNICO EN INFORMÁTICA
        </div>
      </div>
      <div className="terminal-wrap">
        <div className="terminal-orbit" aria-hidden="true">
          <span>26</span>
        </div>
        <div className="terminal">
          <div className="terminal-top">
            <span>
              <span className="terminal-symbol">&gt;_</span> sisco-edu / console
            </span>
            <span className="terminal-live">LOCAL</span>
          </div>
          <div className="terminal-body">
            <p className="terminal-comment">
              // Un proyecto de la promoción 2026
            </p>
            <p className="terminal-command">
              <span>~</span> ./iniciar-presentacion
            </p>
            <div className="terminal-log">
              <p className="terminal-line">
                <span className="check">✓</span> Interfaz inicializada
              </p>
              <p className="terminal-line">
                <span className="check">✓</span> Módulo de recuerdos disponible
              </p>
              <p className="terminal-line">
                <span className="check">✓</span> Conexión más importante:{" "}
                <span className="cyan">usted</span>
              </p>
            </div>
            <div className="terminal-prompt">
              <span aria-hidden="true">›</span>{" "}
              {running ? (
                <KineticText text="Ejecutando algo especial..." />
              ) : (
                <>
                  Esperando al profe
                  <span className="cursor" aria-hidden="true">
                    _
                  </span>
                </>
              )}
            </div>
            {running ? (
              <div className="scene-progress">
                <span className="progress-fill" />
              </div>
            ) : (
              <button className="button primary start-button" onClick={onStart}>
                Iniciar sistema <span aria-hidden="true">↗</span>
              </button>
            )}
            <p className="terminal-footnote">
              {running
                ? "Secuencia de presentación · podés saltarla"
                : "Una presentación breve. Un proyecto muy nuestro."}
            </p>
          </div>
          <div className="terminal-bottom">
            <span>BTI / PROMO_2026</span>
            <span className="cyan">
              {running ? "EJECUTANDO" : "LISTO PARA INICIAR"}
            </span>
          </div>
        </div>
        <p className="terminal-caption">
          <span>01 / PRESENTACIÓN</span>
          <span>HECHO POR SUS ALUMNOS</span>
        </p>
      </div>
    </div>
  );
}
