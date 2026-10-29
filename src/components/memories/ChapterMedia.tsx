import { useEffect, useRef, useState } from "react";
import type { ContentImage, MemoryVideo } from "../../content/types";

export function ChapterImage({
  image,
  className = "",
}: {
  image: ContentImage;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div
      className={
        "chapter-image " +
        className +
        (image.kind === "screenshot" ? " is-screenshot" : "")
      }
    >
      {failed ? (
        <div
          className="media-error"
          role="img"
          aria-label={image.alt + ". Imagen no disponible."}
        >
          Imagen no disponible
        </div>
      ) : (
        <img
          src={image.src}
          alt={image.alt}
          decoding="async"
          onError={() => setFailed(true)}
          style={{
            objectPosition: image.position ?? "center",
            objectFit: image.kind === "screenshot" ? "contain" : image.fit,
          }}
        />
      )}
    </div>
  );
}
export function PendingMedia({ label }: { label: string }) {
  return import.meta.env.DEV ? (
    <div className="pending-media" data-development-only>
      <span aria-hidden="true">▧</span>
      <strong>Fotografías pendientes</strong>
      <p>{label}</p>
      <small>Sólo visible en desarrollo</small>
    </div>
  ) : null;
}

export function ChapterVideo({ media, paused = false, onPlayingChange, automatic = false, onComplete }: {
  media: MemoryVideo;
  automatic?: boolean;
  onComplete?: () => void;
  paused?: boolean;
  onPlayingChange?: (playing: boolean) => void;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const resume = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(!automatic);
  const [ended, setEnded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const attempted = useRef(false);
  const previousTime = useRef(0);
  const repetitions = useRef(0);
  const completed = useRef(false);
  function complete() {
    if (completed.current) return;
    completed.current = true;
    setEnded(true); status(false); onComplete?.();
  }
  useEffect(() => {
    if (!failed || !automatic || paused) return;
    const timer=window.setTimeout(complete,2500);
    return()=>window.clearTimeout(timer);
  },[failed,automatic,paused,onComplete]);
  useEffect(() => {
    if (!automatic || paused || attempted.current) return;
    attempted.current = true;
    const node = video.current;
    if (!node) return;
    node.muted = false;
    node.play().catch(() => { setBlocked(true); node.muted = true; setMuted(true); node.play().catch(() => setBlocked(true)); });
  }, [automatic, paused]);
  const start = media.start ?? 0;
  const end = media.end ?? media.duration;
  async function play() {
    const node = video.current;
    if (!node) return;
    if (node.currentTime >= end - 0.05 || node.currentTime < start) node.currentTime = start;
    setEnded(false);
    try { await node.play(); setBlocked(false); }
    catch { setBlocked(true); }
  }
  useEffect(() => {
    if (paused) {
      resume.current = !!video.current && !video.current.paused;
      video.current?.pause();
    } else if (resume.current) {
      resume.current = false;
      video.current?.play().catch(() => setBlocked(true));
    }
  }, [paused]);
  const status = (value: boolean) => {
    setPlaying(value);
    onPlayingChange?.(value);
  };
  return (
    <div className="chapter-video" data-video-state={failed ? "error" : ended ? "ended" : playing ? "playing" : "paused"}>
      {failed ? (
        <div className="video-fallback">
          <ChapterImage image={{ src: media.poster, alt: media.alt, fit: "contain" }} />
          <p role="status">No se pudo reproducir el video. Podés seguir con los recuerdos.</p>
        </div>
      ) : (
        <video ref={video} src={media.src} poster={media.poster} aria-label={media.alt}
          width={media.width} height={media.height} playsInline controls preload="metadata" muted={muted} loop={(media.repeatCount ?? 1) > 1}
          onLoadedMetadata={() => { if (video.current && start) video.current.currentTime = start; }}
          onPlay={() => { setEnded(false); status(true); }} onPause={() => status(false)}
          onEnded={complete}
          onVolumeChange={() => setMuted(video.current?.muted ?? true)}
          onTimeUpdate={() => {
            const node = video.current;
            if (node?.loop) {
              if (node.currentTime + .2 < previousTime.current) repetitions.current++;
              previousTime.current = node.currentTime;
              if (repetitions.current >= (media.repeatCount ?? 1)) { node.pause(); complete(); }
            }
            if (node && media.end !== undefined && node.currentTime >= end) {
              node.pause(); setEnded(true); status(false); onComplete?.();
            }
          }}
          onError={() => { setFailed(true); status(false); }}
        />
      )}
      {!failed && <div className="video-controls">
        <button className="chapter-control" onClick={() => playing ? video.current?.pause() : void play()}>
          {playing ? "Pausar video" : ended ? "Volver a ver el video" : "Reproducir video"}
        </button>
        {media.sound === "available" ? <button className="chapter-control" aria-pressed={!muted}
          onClick={() => { if (video.current) { video.current.muted = !muted; setMuted(!muted); setBlocked(false); } }}>
          {muted ? "Activar sonido del video" : "Silenciar video"}
        </button> : <span>Video sin audio</span>}
      </div>}
      <p className="video-status" aria-live="polite">
        {failed ? "Los demás recuerdos siguen disponibles." : blocked ? (playing ? "El navegador bloqueó el sonido. Podés activarlo con el botón de sonido." : "Pulsá reproducir para iniciar el video.") : ended ? "Podés volver a verlo o continuar cuando quieras." : playing ? (automatic ? "" : "La secuencia espera a que termines de verlo.") : automatic ? "Preparando el video…" : "El video empieza cuando vos quieras."}
      </p>
    </div>
  );
}
