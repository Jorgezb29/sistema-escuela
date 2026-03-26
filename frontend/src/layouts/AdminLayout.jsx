import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiHome,
  FiUsers,
  FiUser,
  FiBook,
  FiLayers,
  FiClipboard,
  FiAlertTriangle,
  FiLogOut
} from "react-icons/fi";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');

  .adm-root {
    display: flex;
    height: 100vh;
    overflow: hidden;
    font-family: 'Nunito', sans-serif;
  }

  /* ── SIDEBAR ── */
  .adm-sidebar {
    width: 230px;
    min-width: 230px;
    background: linear-gradient(175deg, #6b0f0f 0%, #4e0b0b 100%);
    display: flex;
    flex-direction: column;
    box-shadow: 4px 0 24px rgba(0,0,0,0.22);
    z-index: 100;
  }

  .adm-logo {
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 18px 16px 14px;
    border-bottom: 1px solid rgba(255,255,255,0.09);
    margin-bottom: 6px;
  }

  .adm-logo img {
    width: 40px; height: 40px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid rgba(255,255,255,0.3);
    background: #fff;
    flex-shrink: 0;
  }

  .adm-logo-main { font-size: 0.88rem; font-weight: 900; color: #fff; line-height: 1.15; }
  .adm-logo-sub  { font-size: 0.68rem; font-weight: 600; color: rgba(255,255,255,0.42); }

  .adm-nav { flex: 1; padding: 4px 10px; overflow-y: auto; }

  .adm-nav a {
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

  .adm-nav a:hover {
    background: rgba(255,255,255,0.09);
    color: rgba(255,255,255,0.88) !important;
  }

  .adm-nav a.active {
    background: #a01e1e !important;
    color: #fff !important;
    box-shadow: 0 3px 12px rgba(0,0,0,0.28);
  }

  .adm-footer {
    padding: 12px 10px 16px;
    border-top: 1px solid rgba(255,255,255,0.09);
  }

  .adm-logout-btn {
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

  .adm-logout-btn:hover {
    background: rgba(255,255,255,0.09);
    color: #fff;
    border-color: rgba(255,255,255,0.28);
  }

  /* ── MAIN ── */
  .adm-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: #f4f0ef;
  }

  .adm-topbar {
    background: #fff;
    border-bottom: 1px solid #ece4e4;
    padding: 13px 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    box-shadow: 0 1px 6px rgba(139,26,26,0.05);
  }

  .adm-topbar-title { font-size: 1.35rem; font-weight: 800; color: #1a0a0a; }
  .adm-topbar-sub   { font-size: 0.73rem; color: #a08080; font-weight: 500; margin-top: 1px; }

  .adm-topbar-badge {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #fdf5f5;
    border: 1.5px solid #f0dede;
    border-radius: 11px;
    padding: 7px 14px;
  }

  .adm-topbar-avatar {
    width: 32px; height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, #8b1a1a, #c0392b);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.75rem; font-weight: 800; color: #fff; flex-shrink: 0;
  }

  .adm-topbar-name { font-size: 0.83rem; font-weight: 700; color: #2d1f1f; }
  .adm-topbar-role { font-size: 0.68rem; color: #a08080; }

  .adm-content {
    flex: 1;
    overflow-y: auto;
    padding: 26px 28px;
  }
`;

export default function AdminLayout() {
  const { logout, user } = useAuth();

  const inicial = user?.nombre?.[0]?.toUpperCase() || "A";

  return (
    <>
      <style>{styles}</style>

      <div className="adm-root">
        {/* ──────────── SIDEBAR ──────────── */}
        <aside className="adm-sidebar">
          {/* Logo */}
          <div className="adm-logo">
            <img src="/image.jpg" alt="Logo Colegio" />
            <div>
              <div className="adm-logo-main">Sistema</div>
              <div className="adm-logo-sub">Escolar</div>
            </div>
          </div>

          {/* Navegación */}
          <nav className="adm-nav">
            <NavLink to="" end>
              <FiHome size={16} /> Menu Principal
            </NavLink>

            <NavLink to="estudiantes">
              <FiUsers size={16} /> Estudiantes
            </NavLink>

            <NavLink to="docentes">
              <FiUser size={16} /> Docentes
            </NavLink>

            <NavLink to="cursos">
              <FiLayers size={16} /> Cursos y Materias
            </NavLink>

            <NavLink to="notas">
              <FiClipboard size={16} /> Notas
            </NavLink>

            <NavLink to="asistencias">
              <FiClipboard size={16} /> Asistencias
            </NavLink>

            <NavLink to="incidencias">
              <FiAlertTriangle size={16} /> Incidencias
            </NavLink>

            <NavLink to="/usuarios">
              <FiUser size={16} /> Usuarios
            </NavLink>
          </nav>

          {/* Footer: logout */}
          <div className="adm-footer">
            <button className="adm-logout-btn" onClick={logout}>
              <FiLogOut size={15} />
              Cerrar sesión
            </button>
          </div>
        </aside>

        {/* ──────────── MAIN ──────────── */}
        <div className="adm-main">
          {/* Topbar */}
          <div className="adm-topbar">
            <div>
              <div className="adm-topbar-title">Sistema Escolar</div>
              <div className="adm-topbar-sub">Panel de Administración</div>
            </div>
            <div className="adm-topbar-badge">
              <div className="adm-topbar-avatar">{inicial}</div>
              <div>
                <div className="adm-topbar-name">
                  {user?.nombre || "Administrador"}
                </div>
                <div className="adm-topbar-role">Administrador</div>
              </div>
            </div>
          </div>

          {/* Outlet */}
          <div className="adm-content">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
