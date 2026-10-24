export function KineticText({ text }: { text: string }) {
  return (
    <span aria-label={text}>
      {text.split(" ").map((word, i) => (
        <span className="word-mask" aria-hidden="true" key={i}>
          <span className="kinetic-word">{word}&nbsp;</span>
        </span>
      ))}
    </span>
  );
}
