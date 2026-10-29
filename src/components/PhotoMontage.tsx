import { PhotoFrame, type Photo } from "../photos";
import { KineticText } from "./KineticText";
import { montageGroups, montageDescriptions } from "../content/montage";
export { montageGroups } from "../content/montage";
// Four blocks with unique originals; the reserved portraits appear only later.
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
          key={group.title}
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
            {group.items.map((item, slot) => typeof item === "number" ? (
              <PhotoFrame key={item} photo={photos[item]} className={"montage-photo photo-slot-" + slot} />
            ) : (
              <div key={item} className={"photo-frame montage-photo photo-slot-" + slot} data-photo-id={item}>
                <img src={item} alt={montageDescriptions[item]} style={{objectFit:"contain"}} />
              </div>
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
          <KineticText text="¿Te acordás de esto?" />
        </h1>
        <span className="prequestion-arrow" aria-hidden="true">
          ↘
        </span>
      </section>
    </div>
  );
}
