export function SkipControl({
  onSkip,
  running,
  paused,
  onPause,
}: {
  onSkip: () => void;
  running: boolean;
  paused: boolean;
  onPause: () => void;
}) {
  return (
    <div className="skip-controls">
      {running && (
        <button
          className="utility-button pause-control"
          onClick={onPause}
          aria-label={paused ? "Continuar presentación" : "Pausar presentación"}
        >
          <span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span>
          <span>{paused ? "Continuar" : "Pausar"}</span>
        </button>
      )}
      <button className="utility-button skip-control" onClick={onSkip}>
        Saltar intro <span aria-hidden="true">↗</span>
        <kbd>Esc</kbd>
      </button>
    </div>
  );
}
