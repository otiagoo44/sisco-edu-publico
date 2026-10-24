import { useEffect, useRef, useState } from "react";

export function AudioControl() {
  const context = useRef<AudioContext | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const voices = useRef<OscillatorNode[]>([]);
  useEffect(() => {
    const visibility = () => {
      if (document.hidden) {
        void context.current?.suspend();
        setEnabled(false);
      }
    };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      document.removeEventListener("visibilitychange", visibility);
      voices.current.forEach((v) => v.stop());
      void context.current?.close();
    };
  }, []);
  async function toggle() {
    try {
      if (!context.current || context.current.state === "closed") {
        context.current = new AudioContext();
        const volume = context.current.createGain();
        volume.gain.value = 0.018;
        volume.connect(context.current.destination);
        voices.current = [130.81, 196, 261.63].map((f) => {
          const voice = context.current!.createOscillator();
          voice.type = "sine";
          voice.frequency.value = f;
          voice.connect(volume);
          voice.start();
          return voice;
        });
      }
      if (enabled) await context.current.suspend();
      else await context.current.resume();
      setEnabled(!enabled);
    } catch {
      setUnavailable(true);
      setEnabled(false);
    }
  }
  return (
    <button
      className="audio-control utility-button"
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={
        unavailable
          ? "Audio no disponible"
          : enabled
            ? "Audio activado. Desactivar audio"
            : "Audio desactivado. Activar audio ambiental"
      }
      disabled={unavailable}
    >
      <span
        className={`sound-bars ${enabled ? "sound-on" : ""}`}
        aria-hidden="true"
      >
        <i />
        <i />
        <i />
        <i />
      </span>
      <span>
        {unavailable
          ? "Audio no disponible"
          : enabled
            ? "Audio activado"
            : "Audio desactivado"}
      </span>
    </button>
  );
}
