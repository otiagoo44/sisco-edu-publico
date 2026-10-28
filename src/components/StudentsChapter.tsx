import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { students } from "../content/students";
import { publishedStudents } from "../content/validation";
import { ChapterImage } from "./memories/ChapterMedia";

export function StudentsChapter({
  reduced,
  paused,
  onContinue,
}: {
  reduced: boolean;
  paused: boolean;
  onContinue: () => void;
}) {
  const items = publishedStudents(students);
  const [index, setIndex] = useState(0);
  const [overview, setOverview] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const current = items[index];
  const motion = useRef<gsap.core.Timeline | null>(null);
  useLayoutEffect(() => {
    if (!root.current || reduced || !current) return;
    const context = gsap.context(() => {
      motion.current = gsap
        .timeline()
        .from(
          ".student-portrait",
          {
            clipPath: "inset(100% 0 0 0)",
            y: 20,
            duration: 0.65,
            ease: "power3.out",
          },
          0,
        )
        .from(
          ".student-statement",
          { y: 24, duration: 0.55, ease: "power3.out" },
          0.12,
        );
    }, root);
    return () => {
      context.revert();
      motion.current = null;
    };
  }, [index, reduced]);
  useEffect(() => {
    if (paused) motion.current?.progress(1);
    motion.current?.paused(paused);
  }, [paused, index, reduced]);
  useEffect(() => {
    if (!overview || !dialog.current) return;
    const trigger = document.activeElement as HTMLElement | null;
    const node = dialog.current;
    node.showModal();
    return () => {
      node.close();
      trigger?.focus();
    };
  }, [overview]);
  function select(next: number) {
    setIndex(next);
    title.current?.focus({ preventScroll: true });
    root.current?.scrollIntoView({ behavior: "instant", block: "start" });
  }
  return (
    <div className="students-chapter" ref={root}>
      <header className="students-heading">
        <h1 ref={title} tabIndex={-1}>
          ¿Qué piensa la promo
          <br />
          del profe Danilo?
        </h1>
        <button className="button primary" onClick={onContinue}>
          Ir a la pregunta <span aria-hidden="true">↗</span>
        </button>
      </header>
      {current ? (
        <>
          <div className={"student-feature" + (current.id === "arturo" ? " is-course-message" : "")}>
            <ChapterImage
              key={current.id}
              image={current.photo!}
              className="student-portrait"
            />
            <div className={"student-statement" + (current.message.length > 400 ? " is-long" : "")}>
              <p className="student-name">{current.name}</p>
              <blockquote>{current.message}</blockquote>
              <p className="student-counter" aria-live="polite">
                {index + 1} de {items.length}
              </p>
            </div>
          </div>
          <nav
            className="student-controls"
            aria-label="Mensajes de la promoción"
          >
            <button
              className="chapter-control"
              onClick={() => select((index - 1 + items.length) % items.length)}
            >
              ← Anterior compañero
            </button>
            <button
              className="chapter-control"
              onClick={() => setOverview(true)}
            >
              Ver todos ({items.length})
            </button>
            <button
              className="chapter-control"
              onClick={() => current.id === "arturo" ? onContinue() : select((index + 1) % items.length)}
            >
              {current.id === "arturo" ? "Seguir viendo →" : "Siguiente compañero →"}
            </button>
          </nav>
        </>
      ) : import.meta.env.DEV ? (
        <div className="student-pending" data-development-only>
          <span className="student-pending-frame" aria-hidden="true">
            Foto del alumno
          </span>
          <div>
            <h2>Mensajes pendientes</h2>
            <p>No se recibieron todavía nombres, retratos ni declaraciones.</p>
            <p>
              Completá <code>src/content/students.ts</code>. Este panel no se
              publica.
            </p>
          </div>
        </div>
      ) : (
        <div className="students-empty-art" aria-hidden="true">
          PROMO
          <br />
          <strong>2026</strong>
        </div>
      )}
      {overview && (
        <dialog
          ref={dialog}
          className="students-overview"
          aria-labelledby="all-students-title"
          onCancel={() => setOverview(false)}
          onClick={(e) => {
            if (e.target === e.currentTarget) setOverview(false);
          }}
        >
          <div className="overview-header">
            <h2 id="all-students-title">Todos los mensajes</h2>
            <button
              className="chapter-control"
              autoFocus
              onClick={() => setOverview(false)}
            >
              Cerrar ×
            </button>
          </div>
          <ol>
            {items.map((student, i) => (
              <li key={student.id}>
                <button
                  onClick={() => {
                    select(i);
                    setOverview(false);
                  }}
                >
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <strong>{student.name}</strong>
                  <span aria-hidden="true">↗</span>
                </button>
              </li>
            ))}
          </ol>
        </dialog>
      )}
    </div>
  );
}
