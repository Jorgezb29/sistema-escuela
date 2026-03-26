import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');

  .td-wrap { font-family: 'Nunito', sans-serif; }

  /* ── Bienvenida ── */
  .td-welcome {
    background: linear-gradient(135deg, #6b0f0f 0%, #9b1c1c 60%, #c0392b 100%);
    border-radius: 18px; padding: 32px 36px; margin-bottom: 28px;
    display: flex; align-items: center; justify-content: space-between; gap: 20px;
    box-shadow: 0 6px 28px rgba(139,26,26,0.3);
    position: relative; overflow: hidden;
  }
  .td-welcome::before {
    content: ''; position: absolute; top: -40px; right: -40px;
    width: 200px; height: 200px; border-radius: 50%; background: rgba(255,255,255,0.05);
  }
  .td-welcome::after {
    content: ''; position: absolute; bottom: -60px; right: 80px;
    width: 160px; height: 160px; border-radius: 50%; background: rgba(255,255,255,0.04);
  }
  .td-welcome-text h1 { font-size: 1.65rem; font-weight: 900; color: #fff; margin: 0 0 6px; line-height: 1.2; }
  .td-welcome-text p  { font-size: 0.85rem; color: rgba(255,255,255,0.65); font-weight: 500; margin: 0; }
  .td-welcome-badge {
    display: flex; align-items: center; gap: 10px;
    background: rgba(255,255,255,0.12); border: 1.5px solid rgba(255,255,255,0.2);
    border-radius: 14px; padding: 10px 18px; flex-shrink: 0; z-index: 1;
  }
  .td-welcome-avatar {
    width: 40px; height: 40px; border-radius: 50%;
    background: rgba(255,255,255,0.25);
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem; font-weight: 800; color: #fff; flex-shrink: 0;
  }
  .td-welcome-name { font-size: 0.92rem; color: #fff; font-weight: 800; }
  .td-welcome-role { font-size: 0.78rem; color: rgba(255,255,255,0.55); font-weight: 600; }

  /* ── Sección título ── */
  .td-section-label { display: flex; align-items: center; gap: 9px; margin-bottom: 16px; }
  .td-section-bar   { width: 4px; height: 16px; border-radius: 3px; background: #8b1a1a; flex-shrink: 0; }
  .td-section-title { font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #8b1a1a; }

  /* ── Grid ── */
  .td-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
  @media (max-width: 860px) { .td-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 560px) { .td-grid { grid-template-columns: 1fr; } }

  /* ── Tarjeta ── */
  .td-card {
    background: #fff; border-radius: 15px;
    box-shadow: 0 2px 14px rgba(139,26,26,0.07);
    overflow: hidden; text-decoration: none !important;
    display: flex; flex-direction: column;
    transition: transform .2s, box-shadow .2s;
    border: 1.5px solid transparent;
  }
  .td-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 28px rgba(139,26,26,0.15);
    border-color: #f0dede;
  }
  .td-card-top    { padding: 24px 22px 16px; flex: 1; }
  .td-card-accent { width: 40px; height: 4px; border-radius: 4px; margin-bottom: 16px; }
  .td-card-title  { font-size: 1rem; font-weight: 800; color: #1a0a0a; margin-bottom: 6px; }
  .td-card-desc   { font-size: 0.8rem; color: #a08080; font-weight: 500; line-height: 1.5; }
  .td-card-footer { padding: 12px 22px 18px; }

  .td-card-link {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 9px 18px; border-radius: 9px;
    font-size: 0.82rem; font-weight: 700;
    text-decoration: none !important;
    transition: opacity .2s, transform .15s;
  }
  .td-card-link:hover { opacity: .88; transform: translateX(2px); }

  /* Colores accent y link */
  .td-a-blue   { background: #1a56db; } .td-l-blue   { background: #1a56db; color: #fff; }
  .td-a-purple { background: #7c3aed; } .td-l-purple { background: #7c3aed; color: #fff; }
  .td-a-green  { background: #1a7a45; } .td-l-green  { background: #1a7a45; color: #fff; }
  .td-a-amber  { background: #b58a00; } .td-l-amber  { background: #b58a00; color: #fff; }
  .td-a-red    { background: #8b1a1a; } .td-l-red    { background: #8b1a1a; color: #fff; }
`;

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12,5 19,12 12,19"/>
  </svg>
);

const CARDS = [
  { accentCls: "td-a-blue",   linkCls: "td-l-blue",   title: "Mis Cursos y Materias", desc: "Visualiza los cursos y materias que tienes asignados este período.",           to: "/teacher/materias",     label: "Ver materias"    },
  { accentCls: "td-a-purple", linkCls: "td-l-purple", title: "Estudiantes",            desc: "Accede al listado completo de estudiantes organizados por curso.",             to: "/teacher/estudiantes",  label: "Ver estudiantes" },
  { accentCls: "td-a-green",  linkCls: "td-l-green",  title: "Notas",                 desc: "Registra y revisa las calificaciones de tus estudiantes por materia.",         to: "/teacher/notas",        label: "Ver notas"       },
  { accentCls: "td-a-amber",  linkCls: "td-l-amber",  title: "Asistencias",           desc: "Controla la asistencia diaria de estudiantes por curso y materia.",            to: "/teacher/asistencias",  label: "Ver asistencias" },
  { accentCls: "td-a-red",    linkCls: "td-l-red",    title: "Incidencias",           desc: "Registra y gestiona incidencias disciplinarias de los estudiantes.",           to: "/teacher/incidencias",  label: "Ver incidencias" },
];

export default function TeacherDashboard() {
  const { user } = useAuth();
  const nombre  = user?.nombre || "Profesor";
  const inicial = nombre[0]?.toUpperCase() || "P";

  return (
    <>
      <style>{styles}</style>
      <div className="td-wrap">

        <div className="td-welcome">
          <div className="td-welcome-text">
            <h1>Bienvenido, {nombre}</h1>
            <p>Selecciona una sección para comenzar tu jornada académica.</p>
          </div>
          <div className="td-welcome-badge">
            <div className="td-welcome-avatar">{inicial}</div>
            <div>
              <div className="td-welcome-name">{nombre}</div>
              <div className="td-welcome-role">Docente</div>
            </div>
          </div>
        </div>

        <div className="td-section-label">
          <span className="td-section-bar" />
          <span className="td-section-title">Panel de acceso rápido</span>
        </div>

        <div className="td-grid">
          {CARDS.map((card) => (
            <Link key={card.to} to={card.to} className="td-card">
              <div className="td-card-top">
                <div className={`td-card-accent ${card.accentCls}`} />
                <div className="td-card-title">{card.title}</div>
                <div className="td-card-desc">{card.desc}</div>
              </div>
              <div className="td-card-footer">
                <span className={`td-card-link ${card.linkCls}`}>
                  {card.label} <ArrowIcon />
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </>
  );
}