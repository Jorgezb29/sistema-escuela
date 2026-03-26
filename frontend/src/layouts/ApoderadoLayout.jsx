import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');

  .al-root {
    display: flex;
    height: 100vh;
    overflow: hidden;
    font-family: 'Nunito', sans-serif;
  }

  /* ── SIDEBAR ── */
  .al-sidebar {
    width: 230px;
    min-width: 230px;
    background: linear-gradient(175deg, #6b0f0f 0%, #4e0b0b 100%);
    display: flex;
    flex-direction: column;
    box-shadow: 4px 0 24px rgba(0,0,0,0.22);
    z-index: 100;
  }

  .al-logo {
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 18px 16px 14px;
    border-bottom: 1px solid rgba(255,255,255,0.09);
    margin-bottom: 6px;
  }

  .al-logo img {
    width: 40px; height: 40px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid rgba(255,255,255,0.3);
    background: #fff;
    flex-shrink: 0;
  }

  .al-logo-main { font-size: 0.88rem; font-weight: 900; color: #fff; line-height: 1.15; }
  .al-logo-sub  { font-size: 0.68rem; font-weight: 600; color: rgba(255,255,255,0.42); }

  .al-nav { flex: 1; padding: 4px 10px; overflow-y: auto; }

  .al-nav a {
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

  .al-nav a:hover {
    background: rgba(255,255,255,0.09);
    color: rgba(255,255,255,0.88) !important;
  }

  .al-nav a.active {
    background: #a01e1e !important;
    color: #fff !important;
    box-shadow: 0 3px 12px rgba(0,0,0,0.28);
  }

  .al-footer {
    padding: 12px 10px 16px;
    border-top: 1px solid rgba(255,255,255,0.09);
  }

  .al-user-info {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 8px 10px 12px;
  }

  .al-user-avatar {
    width: 32px; height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, #c0392b, #8b1a1a);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.75rem; font-weight: 800; color: #fff;
    flex-shrink: 0;
  }

  .al-user-name { font-size: 0.82rem; font-weight: 700; color: rgba(255,255,255,0.85); line-height: 1.2; }
  .al-user-role { font-size: 0.65rem; font-weight: 600; color: rgba(255,255,255,0.4); }

  .al-logout-btn {
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

  .al-logout-btn:hover {
    background: rgba(255,255,255,0.09);
    color: #fff;
    border-color: rgba(255,255,255,0.28);
  }

  /* ── MAIN ── */
  .al-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: #f4f0ef;
  }

  .al-topbar {
    background: #fff;
    border-bottom: 1px solid #ece4e4;
    padding: 13px 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    box-shadow: 0 1px 6px rgba(139,26,26,0.05);
  }

  .al-topbar-title { font-size: 1.35rem; font-weight: 800; color: #1a0a0a; }
  .al-topbar-sub   { font-size: 0.73rem; color: #a08080; font-weight: 500; margin-top: 1px; }

  .al-topbar-user {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #fdf5f5;
    border: 1.5px solid #f0dede;
    border-radius: 11px;
    padding: 7px 14px;
  }

  .al-topbar-avatar {
    width: 32px; height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, #8b1a1a, #c0392b);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.75rem; font-weight: 800; color: #fff; flex-shrink: 0;
  }

  .al-topbar-name { font-size: 0.83rem; font-weight: 700; color: #2d1f1f; }
  .al-topbar-role { font-size: 0.68rem; color: #a08080; }

  .al-content {
    flex: 1;
    overflow-y: auto;
    padding: 26px 28px;
  }
`;

const IconHome = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" />
    <path d="M9 21V12h6v9" />
  </svg>
);

const IconLogout = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16,17 21,12 16,7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export default function ApoderadoLayout() {
  const { logout, user } = useAuth();
  const inicial = user?.nombre?.[0]?.toUpperCase() || "A";

  return (
    <>
      <style>{styles}</style>

      <div className="al-root">

        {/* ──────────── SIDEBAR ──────────── */}
        <aside className="al-sidebar">

          {/* Logo */}
          <div className="al-logo">
            <img src="/image.jpg" alt="Logo Colegio" />
            <div>
              <div className="al-logo-main">Sistema</div>
              <div className="al-logo-sub">Escolar</div>
            </div>
          </div>

          {/* Navegación — solo Inicio, todo está en el dashboard */}
          <nav className="al-nav">
            <NavLink to="" end>
              <IconHome />
              Inicio
            </NavLink>
          </nav>

          {/* Footer: usuario + logout */}
          <div className="al-footer">
            <div className="al-user-info">
              <div className="al-user-avatar">{inicial}</div>
              <div>
                <div className="al-user-name">{user?.nombre}</div>
                <div className="al-user-role">Apoderado</div>
              </div>
            </div>
            <button className="al-logout-btn" onClick={logout}>
              <IconLogout />
              Cerrar sesión
            </button>
          </div>

        </aside>

        {/* ──────────── MAIN ──────────── */}
        <div className="al-main">

          {/* Topbar */}
          <div className="al-topbar">
            <div>
              <div className="al-topbar-title">Panel del Apoderado</div>
              <div className="al-topbar-sub">Bienvenido al sistema escolar</div>
            </div>
            <div className="al-topbar-user">
              <div className="al-topbar-avatar">{inicial}</div>
              <div>
                <div className="al-topbar-name">{user?.nombre}</div>
                <div className="al-topbar-role">Apoderado</div>
              </div>
            </div>
          </div>

          {/* Outlet */}
          <div className="al-content">
            <Outlet />
          </div>

        </div>
      </div>
    </>
  );
}