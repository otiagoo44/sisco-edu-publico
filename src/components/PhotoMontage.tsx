import { PhotoFrame, type Photo } from "../photos";
import { KineticText } from "./KineticText";
// Nine originals, ordered deliberately: formal, spontaneous, then playful.
export const montageGroups = [
  { title: "Candidato encontrado.", indices: [7, 5, 10], className: "formal" },
  { title: "Hay pruebas.", indices: [2, 3, 4], className: "playful" },
  { title: "No hay dudas.", indices: [1, 9, 0], className: "confirmed" },
];
export function PhotoMontage({ photos }: { photos: Photo[] }) {
  return (
    <div className="montage-scene">
      {montageGroups.map((group, i) => (
        <section
          className={
            "sequence-beat photo-composition composition-" + group.className
          }
          data-beat
          data-kind="photo"
          data-composition={group.className}
          aria-hidden="true"
          key={group.className}
        >
          <div className="composition-copy">
            <span className="composition-counter" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h1>
              <KineticText text={group.title} />
            </h1>
          </div>
          <div className="composition-photos">
            {group.indices.map((index, slot) => (
              <PhotoFrame
                key={index}
                photo={photos[index]}
                className={"montage-photo photo-slot-" + slot}
              />
            ))}
          </div>
        </section>
      ))}
      <section
        className="sequence-beat prequestion-beat"
        data-beat
        data-kind="question"
        aria-hidden="true"
      >
        <p>Antes de seguir...</p>
        <h1>
          <KineticText text="¿Se acuerda de esto, profe?" />
        </h1>
        <span className="prequestion-arrow" aria-hidden="true">
          ↘
        </span>
      </section>
    </div>
  );
}
