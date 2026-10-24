import { useState } from "react";
import { KineticText } from "./KineticText";
const modules = [
  ["Profesores", "Gestionar profesores", "Docentes y asignaciones académicas."],
  [
    "Estudiantes",
    "Gestionar estudiantes",
    "Matrícula y organización de estudiantes.",
  ],
  [
    "Horarios",
    "Gestionar horarios",
    "Distribución de materias y horas cátedra.",
  ],
  [
    "Asist. Estudiantes",
    "Ver asistencias de estudiantes",
    "Consulta de registros de asistencia de estudiantes.",
  ],
  [
    "Asist. Profesores",
    "Ver asistencias de profesores",
    "Consulta de registros de asistencia docente.",
  ],
  [
    "Administración",
    "Gestionar usuarios, aulas, grados, materias y asignaciones.",
    "Configuración de los módulos del sistema.",
  ],
];
export function BootIntro({
  running,
  onStart,
}: {
  running: boolean;
  onStart: () => void;
}) {
  const [active, setActive] = useState("Dashboard");
  const [menu, setMenu] = useState(false);
  if (running)
    return (
      <div className="verification-scene">
        <div
          className="sequence-beat verification-beat"
          data-beat
          data-kind="boot"
          aria-hidden="true"
        >
          <span className="system-wordmark">SISCO-EDU</span>
          <div className="verification-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <h1>
            <KineticText text="Verificando sistema..." />
          </h1>
          <p>Comprobando módulos y configuración.</p>
        </div>
      </div>
    );
  const selected = modules.find((item) => item[0] === active);
  return (
    <div className="sisco-shell">
      <button
        className="sisco-menu"
        aria-expanded={menu}
        aria-controls="sisco-navigation"
        onClick={() => setMenu(!menu)}
      >
        {menu ? "Cerrar menú" : "Menú"} <span aria-hidden="true">☰</span>
      </button>
      <aside
        className={"sisco-sidebar " + (menu ? "menu-open" : "")}
        id="sisco-navigation"
      >
        <a
          className="sisco-logo"
          href="#experience"
          onClick={() => setActive("Dashboard")}
        >
          SISCO-EDU
        </a>
        <nav aria-label="Módulos del sistema">
          {["Dashboard", ...modules.map((m) => m[0])].map((name) => (
            <button
              key={name}
              className={
                "sisco-nav-link " + (active === name ? "is-active" : "")
              }
              aria-current={active === name ? "page" : undefined}
              onClick={() => {
                setActive(name);
                setMenu(false);
              }}
            >
              {name}
            </button>
          ))}
        </nav>
        <div className="sisco-sidebar-footer">
          Sistema de control
          <br />
          de asistencia
        </div>
      </aside>
      <div className="sisco-main">
        <div className="sisco-topbar">
          <span>Gestión académica</span>
          <span className="sisco-access">Acceso local</span>
        </div>
        <div className="sisco-page-header">
          <div>
            <p className="sisco-breadcrumb">SISCO-EDU / {active}</p>
            <h1>
              {active === "Dashboard" ? "Bienvenido a SISCO-EDU" : active}
            </h1>
            <p>
              {active === "Dashboard"
                ? "Sistema Integral de Gestión Pedagógica e IoT"
                : selected?.[2]}
            </p>
          </div>
          <button className="sisco-start" onClick={onStart}>
            Iniciar sistema <span aria-hidden="true">→</span>
          </button>
        </div>
        <div className="sisco-section-heading">
          <h2>
            {active === "Dashboard"
              ? "Módulos del sistema"
              : "Información del módulo"}
          </h2>
          <p>
            {active === "Dashboard"
              ? "Seleccioná un módulo para continuar."
              : "Vista local de la interfaz."}
          </p>
        </div>
        {active === "Dashboard" ? (
          <div className="sisco-modules">
            {modules.map(([title, description], i) => (
              <button
                className={
                  "sisco-module " + (i === 5 ? "sisco-module-accent" : "")
                }
                key={title}
                onClick={() => setActive(title)}
              >
                <div className="module-symbol" aria-hidden="true">
                  {["◷", "▤", "▦", "✓", "✓", "⚙"][i]}
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
                <span className="module-arrow" aria-hidden="true">
                  ↗
                </span>
              </button>
            ))}
          </div>
        ) : (
          <section className="sisco-module-detail">
            <h3>{selected?.[1]}</h3>
            <p>{selected?.[2]}</p>
            <p>
              La consulta de registros requiere una conexión al servidor
              académico.
            </p>
            <button
              className="sisco-back"
              onClick={() => setActive("Dashboard")}
            >
              ← Volver al Dashboard
            </button>
          </section>
        )}
        <footer className="sisco-footer">
          <span>SISCO-EDU</span>
          <span>Gestión pedagógica · Control de asistencia</span>
        </footer>
      </div>
    </div>
  );
}
