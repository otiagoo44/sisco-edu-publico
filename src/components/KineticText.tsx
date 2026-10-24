export function KineticText({ text }: { text: string }) {
  return (
    <span>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split(" ").map((word, i) => (
          <span className="word-mask" key={i}>
            <span className="kinetic-word">{word}&nbsp;</span>
          </span>
        ))}
      </span>
    </span>
  );
}
