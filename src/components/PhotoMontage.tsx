import { PhotoFrame, type Photo } from "../photos";
import { KineticText } from "./KineticText";

export function PhotoMontage({ photos }: { photos: Photo[] }) {
  return (
    <div className="montage-layout">
      <div className="montage-copy">
        <p className="eyebrow warm">DETRÁS DE CADA LÍNEA DE CÓDIGO</p>
        <h1 className="scene-title">
          <KineticText text="Hay alguien que creyó en nosotros." />
        </h1>
        <div className="montage-second">
          <p>
            Entre errores, clases y risas,
            <br />
            nos llevamos mucho más que informática.
          </p>
          <span className="handwritten">Y usted es parte de eso.</span>
        </div>
      </div>
      <div className="montage-photos">
        <PhotoFrame photo={photos[5]} className="montage-photo montage-back" />
        <PhotoFrame photo={photos[6]} className="montage-photo montage-side" />
        <PhotoFrame photo={photos[0]} className="montage-photo montage-front" />
        <span className="photo-sticker">nuestro mejor commit.</span>
        <span className="photo-coordinate mono">RECUERDOS / PROMO 2026</span>
      </div>
    </div>
  );
}
