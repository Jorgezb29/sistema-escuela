import { Outlet, NavLink } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import {
  FiHome,
  FiBookOpen,
  FiClipboard,
  FiCalendar,
  FiAlertTriangle,
  FiLogOut,
  FiUser,
} from "react-icons/fi";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');

  .sl-root {
    display: flex;
    height: 100vh;
    overflow: hidden;
    font-family: 'Nunito', sans-serif;
  }

  /* ── SIDEBAR ── */
  .sl-sidebar {
    width: 230px;
    min-width: 230px;
    background: linear-gradient(175deg, #6b0f0f 0%, #4e0b0b 100%);
    display: flex;
    flex-direction: column;
    box-shadow: 4px 0 24px rgba(0,0,0,0.22);
    z-index: 100;
  }

  /* Logo / Header */
  .sl-logo {
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 18px 16px 14px;
    border-bottom: 1px solid rgba(255,255,255,0.09);
    margin-bottom: 6px;
  }

  .sl-logo img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid rgba(255,255,255,0.3);
    background: #fff;
    flex-shrink: 0;
  }

  .sl-logo-main { font-size: 0.88rem; font-weight: 900; color: #fff; line-height: 1.15; }
  .sl-logo-sub  { font-size: 0.68rem; font-weight: 600; color: rgba(255,255,255,0.42); }

  /* Nav links */
  .sl-nav { flex: 1; padding: 4px 10px; overflow-y: auto; }

  .sl-nav a {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    border-radius: 9px;
    font-size: 0.87rem;
    font-weight: 600;
    color: rgba(255,255,255,0.5) !important;
    text-decoration: none !important;
    transition: background .15s, color .15s;
    margin-bottom: 2px;
    white-space: nowrap;
  }

  .sl-nav a:hover {
    background: rgba(255,255,255,0.09);
    color: rgba(255,255,255,0.88) !important;
  }

  .sl-nav a.active {
    background: #a01e1e !important;
    color: #fff !important;
    box-shadow: 0 3px 12px rgba(0,0,0,0.28);
  }

  .sl-nav a svg { flex-shrink: 0; }

  /* Sección de usuario + logout */
  .sl-footer {
    padding: 12px 10px 16px;
    border-top: 1px solid rgba(255,255,255,0.09);
  }

  .sl-user-info {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 8px 10px 12px;
  }

  .sl-user-avatar {
    width: 32px; height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, #c0392b, #8b1a1a);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.75rem; font-weight: 800; color: #fff;
    flex-shrink: 0;
  }

  .sl-user-name  { font-size: 0.82rem; font-weight: 700; color: rgba(255,255,255,0.85); line-height: 1.2; }
  .sl-user-role  { font-size: 0.65rem; font-weight: 600; color: rgba(255,255,255,0.4); }

  .sl-logout-btn {
    display: flex;
    align-items: center;
    gap: 9px;
    width: 100%;
    padding: 9px 14px;
    border: 1.5px solid rgba(255,255,255,0.13);
    border-radius: 9px;
    background: transparent;
    color: rgba(255,255,255,0.45);
    font-size: 0.83rem;
    font-weight: 700;
    cursor: pointer;
    transition: background .15s, color .15s, border-color .15s;
    font-family: 'Nunito', sans-serif;
  }

  .sl-logout-btn:hover {
    background: rgba(255,255,255,0.09);
    color: #fff;
    border-color: rgba(255,255,255,0.28);
  }

  /* ── MAIN ── */
  .sl-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: #f4f0ef;
  }

  /* Topbar */
  .sl-topbar {
    background: #fff;
    border-bottom: 1px solid #ece4e4;
    padding: 13px 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    box-shadow: 0 1px 6px rgba(139,26,26,0.05);
  }

  .sl-topbar-title { font-size: 1.35rem; font-weight: 800; color: #1a0a0a; }
  .sl-topbar-sub   { font-size: 0.73rem; color: #a08080; font-weight: 500; margin-top: 1px; }

  .sl-topbar-user {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #fdf5f5;
    border: 1.5px solid #f0dede;
    border-radius: 11px;
    padding: 7px 14px;
  }

  .sl-topbar-avatar {
    width: 32px; height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, #8b1a1a, #c0392b);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.75rem; font-weight: 800; color: #fff; flex-shrink: 0;
  }

  .sl-topbar-name { font-size: 0.83rem; font-weight: 700; color: #2d1f1f; }
  .sl-topbar-role { font-size: 0.68rem; color: #a08080; }

  /* Contenido */
  .sl-content {
    flex: 1;
    overflow-y: auto;
    padding: 26px 28px;
  }
`;

export default function StudentLayout() {
  const { logout, user } = useAuth();

  const inicial = user?.nombre?.[0]?.toUpperCase() || "E";

  return (
    <>
      <style>{styles}</style>

      <div className="sl-root">

        {/* ──────────── SIDEBAR ──────────── */}
        <aside className="sl-sidebar">

          {/* Logo */}
          <div className="sl-logo">
            <img src="/image.jpg" alt="Logo Colegio" />
            <div>
              <div className="sl-logo-main">Sistema</div>
              <div className="sl-logo-sub">Escolar</div>
            </div>
          </div>

          {/* Navegación */}
          <nav className="sl-nav">
            <NavLink to="/student" end>
              <FiHome size={16} />
              Inicio
            </NavLink>

            <NavLink to="/student/mis-materias">
              <FiBookOpen size={16} />
              Mi Registro Académico
            </NavLink>

            

            <NavLink to="/student/mis-asistencias">
              <FiCalendar size={16} />
              Mis Asistencias
            </NavLink>

            <NavLink to="/student/mis-incidencias">
              <FiAlertTriangle size={16} />
              Mis Incidencias
            </NavLink>

            <NavLink to="asistente-vocacional">
               Asistente Vocacional
            </NavLink>
          </nav>

          {/* Footer: usuario + logout */}
          <div className="sl-footer">
            <div className="sl-user-info">
              <div className="sl-user-avatar">{inicial}</div>
              <div>
                <div className="sl-user-name">{user?.nombre}</div>
                <div className="sl-user-role">Estudiante</div>
              </div>
            </div>
            <button className="sl-logout-btn" onClick={logout}>
              <FiLogOut size={15} />
              Cerrar sesión
            </button>
          </div>
        </aside>

        {/* ──────────── MAIN ──────────── */}
        <div className="sl-main">

          {/* Topbar */}
          <div className="sl-topbar">
            <div>
              <div className="sl-topbar-title">Panel del Estudiante</div>
              <div className="sl-topbar-sub">Bienvenido al sistema escolar</div>
            </div>
            <div className="sl-topbar-user">
              <div className="sl-topbar-avatar">{inicial}</div>
              <div>
                <div className="sl-topbar-name">{user?.nombre}</div>
                <div className="sl-topbar-role">Estudiante</div>
              </div>
            </div>
          </div>

          {/* Outlet */}
          <div className="sl-content">
            <Outlet />
          </div>

        </div>
      </div>
    </>
  );
}