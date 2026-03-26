import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiHome, FiBookOpen, FiLogOut } from "react-icons/fi";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');

  .tl-root {
    display: flex;
    height: 100vh;
    overflow: hidden;
    font-family: 'Nunito', sans-serif;
  }

  /* ── SIDEBAR ── */
  .tl-sidebar {
    width: 230px;
    min-width: 230px;
    background: linear-gradient(175deg, #6b0f0f 0%, #4e0b0b 100%);
    display: flex;
    flex-direction: column;
    box-shadow: 4px 0 24px rgba(0,0,0,0.22);
    z-index: 100;
  }

  .tl-logo {
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 18px 16px 14px;
    border-bottom: 1px solid rgba(255,255,255,0.09);
    margin-bottom: 6px;
  }

  .tl-logo img {
    width: 40px; height: 40px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid rgba(255,255,255,0.3);
    background: #fff;
    flex-shrink: 0;
  }

  .tl-logo-main { font-size: 0.88rem; font-weight: 900; color: #fff; line-height: 1.15; }
  .tl-logo-sub  { font-size: 0.68rem; font-weight: 600; color: rgba(255,255,255,0.42); }

  .tl-nav { flex: 1; padding: 4px 10px; overflow-y: auto; }

  .tl-nav a {
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

  .tl-nav a:hover {
    background: rgba(255,255,255,0.09);
    color: rgba(255,255,255,0.88) !important;
  }

  .tl-nav a.active {
    background: #a01e1e !important;
    color: #fff !important;
    box-shadow: 0 3px 12px rgba(0,0,0,0.28);
  }

  .tl-footer {
    padding: 12px 10px 16px;
    border-top: 1px solid rgba(255,255,255,0.09);
  }

  .tl-user-info {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 8px 10px 12px;
  }

  .tl-user-avatar {
    width: 32px; height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, #c0392b, #8b1a1a);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.75rem; font-weight: 800; color: #fff;
    flex-shrink: 0;
  }

  .tl-user-name { font-size: 0.82rem; font-weight: 700; color: rgba(255,255,255,0.85); line-height: 1.2; }
  .tl-user-role { font-size: 0.65rem; font-weight: 600; color: rgba(255,255,255,0.4); }

  .tl-logout-btn {
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

  .tl-logout-btn:hover {
    background: rgba(255,255,255,0.09);
    color: #fff;
    border-color: rgba(255,255,255,0.28);
  }

  /* ── MAIN ── */
  .tl-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: #f4f0ef;
  }

  .tl-topbar {
    background: #fff;
    border-bottom: 1px solid #ece4e4;
    padding: 13px 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    box-shadow: 0 1px 6px rgba(139,26,26,0.05);
  }

  .tl-topbar-title { font-size: 1.35rem; font-weight: 800; color: #1a0a0a; }
  .tl-topbar-sub   { font-size: 0.73rem; color: #a08080; font-weight: 500; margin-top: 1px; }

  .tl-topbar-user {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #fdf5f5;
    border: 1.5px solid #f0dede;
    border-radius: 11px;
    padding: 7px 14px;
  }

  .tl-topbar-avatar {
    width: 32px; height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, #8b1a1a, #c0392b);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.75rem; font-weight: 800; color: #fff; flex-shrink: 0;
  }

  .tl-topbar-name { font-size: 0.83rem; font-weight: 700; color: #2d1f1f; }
  .tl-topbar-role { font-size: 0.68rem; color: #a08080; }

  .tl-content {
    flex: 1;
    overflow-y: auto;
    padding: 26px 28px;
  }
`;

export default function TeacherLayout() {
  const { logout, user } = useAuth();

  const inicial = user?.nombre?.[0]?.toUpperCase() || "D";

  return (
    <>
      <style>{styles}</style>

      <div className="tl-root">

        {/* ──────────── SIDEBAR ──────────── */}
        <aside className="tl-sidebar">

          {/* Logo */}
          <div className="tl-logo">
            <img src="/image.jpg" alt="Logo Colegio" />
            <div>
              <div className="tl-logo-main">Sistema</div>
              <div className="tl-logo-sub">Escolar</div>
            </div>
          </div>

          {/* Navegación */}
          <nav className="tl-nav">
            <NavLink to="/teacher" end>
              <FiHome size={16} />
              Inicio
            </NavLink>

            <NavLink to="/teacher/materias">
              <FiBookOpen size={16} />
              Mis Materias
            </NavLink>

            <NavLink to="/teacher/estudiantes">
              <FiBookOpen size={16} />
              Estudiantes
            </NavLink>

            <NavLink to="/teacher/notas">
              <FiBookOpen size={16} />
              Notas
            </NavLink>

            <NavLink to="/teacher/asistencias">
              <FiBookOpen size={16} />
              Asistencias
            </NavLink>

            <NavLink to="/teacher/incidencias">
              <FiBookOpen size={16} />
              Incidencias
            </NavLink>
          </nav>

          {/* Footer: usuario + logout */}
          <div className="tl-footer">
            <div className="tl-user-info">
              <div className="tl-user-avatar">{inicial}</div>
              <div>
                <div className="tl-user-name">{user?.nombre}</div>
                <div className="tl-user-role">Docente</div>
              </div>
            </div>
            <button className="tl-logout-btn" onClick={logout}>
              <FiLogOut size={15} />
              Cerrar sesión
            </button>
          </div>

        </aside>

        {/* ──────────── MAIN ──────────── */}
        <div className="tl-main">

          {/* Topbar */}
          <div className="tl-topbar">
            <div>
              <div className="tl-topbar-title">Panel del Docente</div>
              <div className="tl-topbar-sub">Bienvenido al sistema escolar</div>
            </div>
            <div className="tl-topbar-user">
              <div className="tl-topbar-avatar">{inicial}</div>
              <div>
                <div className="tl-topbar-name">{user?.nombre}</div>
                <div className="tl-topbar-role">Docente</div>

              </div>
            </div>
          </div>

          {/* Outlet */}
          <div className="tl-content">
            <Outlet />
          </div>

        </div>
      </div>
    </>
  );
}