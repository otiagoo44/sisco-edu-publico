import { KineticText } from "./KineticText";

export function Diagnostic() {
  return (
    <div className="diagnostic-layout">
      <p className="eyebrow cyan">SISCO-EDU / DIAGNÓSTICO</p>
      <h1 className="scene-title">
        <KineticText text="Hay algo en el código." />
      </h1>
      <p className="scene-description">
        Parece que este proyecto tiene otros planes.
      </p>
      <div className="terminal diagnostic-terminal">
        <div className="terminal-top">
          <span>&gt;_ diagnóstico de la promo</span>
          <span>SECUENCIA NARRATIVA</span>
        </div>
        <div className="terminal-body">
          <p className="terminal-line">
            <span className="check">✓</span> Recuerdos compartidos{" "}
            <span className="log-result">ENCONTRADOS</span>
          </p>
          <p className="terminal-line">
            <span className="check">✓</span> Gratitud de la promoción{" "}
            <span className="log-result">INFINITA</span>
          </p>
          <p className="terminal-line warm">
            ! Se detectó una misión pendiente.
          </p>
          <p className="terminal-line">
            &gt; El sistema necesita un… padrino
            <span className="cursor">_</span>
          </p>
          <div className="scene-progress">
            <span className="progress-fill" />
          </div>
        </div>
      </div>
    </div>
  );
}
