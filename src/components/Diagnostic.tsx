import { KineticText } from "./KineticText";
export function Diagnostic() {
  return (
    <div className="diagnostic-scene">
      <div
        className="sequence-beat pending-beat"
        data-beat
        data-kind="diagnostic"
        aria-hidden="true"
      >
        <span className="pending-symbol" aria-hidden="true">
          !
        </span>
        <h1>
          <KineticText text="Se encontró un pendiente." />
        </h1>
        <p>Esto no estaba en la entrega.</p>
      </div>
      <div
        className="sequence-beat candidate-beat"
        data-beat
        data-kind="diagnostic"
        aria-hidden="true"
      >
        <span className="candidate-lines" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <h1>
          <KineticText text="Analizando candidatos..." />
        </h1>
      </div>
    </div>
  );
}
