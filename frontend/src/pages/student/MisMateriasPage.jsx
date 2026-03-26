import { useEffect, useState } from "react";
import client from "../../api/client";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');

  .mm-wrap { font-family: 'Nunito', sans-serif; }

  /* ── Header ── */
  .mm-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
  .mm-header-icon {
    width: 44px; height: 44px; border-radius: 12px;
    background: linear-gradient(135deg,#8b1a1a,#c0392b);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; box-shadow: 0 4px 14px rgba(139,26,26,0.28);
  }
  .mm-header h2 { font-size: 1.45rem; font-weight: 800; color: #1a0a0a; margin: 0; line-height: 1.2; }
  .mm-header p  { font-size: 0.75rem; color: #a08080; font-weight: 500; margin: 0; }

  /* ── Layout ── */
  .mm-layout { display: grid; grid-template-columns: 280px 1fr; gap: 20px; align-items: start; }
  @media (max-width: 800px) { .mm-layout { grid-template-columns: 1fr; } }

  /* ── Promedio banner ── */
  .mm-promedio {
    background: linear-gradient(135deg,#6b0f0f,#9b1c1c);
    border-radius: 13px; padding: 18px 22px; margin-bottom: 20px;
    display: flex; align-items: center; justify-content: space-between;
    box-shadow: 0 4px 16px rgba(139,26,26,0.22);
  }
  .mm-promedio-label { font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.09em; color: rgba(255,255,255,0.6); margin-bottom: 4px; }
  .mm-promedio-val   { font-size: 2rem; font-weight: 900; color: #fff; line-height: 1; }
  .mm-promedio-sub   { font-size: 0.75rem; color: rgba(255,255,255,0.5); font-weight: 600; margin-top: 2px; }
  .mm-promedio-badge {
    padding: 6px 16px; border-radius: 20px; font-size: 0.8rem; font-weight: 800;
    border: 2px solid rgba(255,255,255,0.3); color: #fff;
    background: rgba(255,255,255,0.12);
  }

  /* ── Card ── */
  .mm-card { background: #fff; border-radius: 15px; box-shadow: 0 2px 16px rgba(139,26,26,0.07); overflow: hidden; }
  .mm-card-header { display: flex; align-items: center; gap: 9px; padding: 16px 20px 13px; border-bottom: 1px solid #f5edec; }
  .mm-card-bar   { width: 4px; height: 15px; border-radius: 3px; background: #8b1a1a; flex-shrink: 0; }
  .mm-card-title { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.09em; color: #8b1a1a; }
  .mm-count { display: inline-flex; align-items: center; justify-content: center; background: #8b1a1a; color: #fff; font-size: 0.63rem; font-weight: 800; border-radius: 20px; padding: 1px 7px; margin-left: 7px; }

  /* ── Lista de materias ── */
  .mm-materia-list { padding: 12px 16px; }
  .mm-materia-item {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 12px; border-radius: 10px; margin-bottom: 4px;
    transition: background .15s;
  }
  .mm-materia-item:hover { background: #fdf5f5; }
  .mm-materia-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: linear-gradient(135deg,#8b1a1a,#c0392b); flex-shrink: 0;
  }
  .mm-materia-num  { font-size: 0.72rem; font-weight: 800; color: #c8a8a8; width: 18px; flex-shrink: 0; }
  .mm-materia-name { font-size: 0.9rem; font-weight: 700; color: #2d1f1f; }

  /* ── Tabla notas ── */
  .mm-table-wrap { overflow-x: auto; }
  .mm-table { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
  .mm-table thead tr { border-bottom: 2px solid #f5edec; }
  .mm-table thead th { padding: 10px 14px; font-size: 0.63rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #a08080; white-space: nowrap; }
  .mm-table tbody tr { border-bottom: 1px solid #faf5f5; transition: background .15s; }
  .mm-table tbody tr:hover { background: #fdf8f8; }
  .mm-table tbody td { padding: 12px 14px; color: #2d1f1f; font-weight: 600; vertical-align: middle; }

  /* ── Nota badge ── */
  .mm-nota {
    display: inline-flex; align-items: center; justify-content: center;
    min-width: 48px; padding: 4px 10px; border-radius: 20px;
    font-size: 0.9rem; font-weight: 900; border: 1.5px solid;
  }
  .mm-nota-ok  { background: #edfaf3; border-color: #a8e6c4; color: #1a7a45; }
  .mm-nota-bad { background: #fff3f3; border-color: #f5c6c6; color: #8b1a1a; }

  .mm-estado-ok  { display: inline-flex; align-items: center; gap: 4px; background: #edfaf3; border: 1.5px solid #a8e6c4; color: #1a7a45; font-size: 0.75rem; font-weight: 800; padding: 3px 10px; border-radius: 20px; }
  .mm-estado-bad { display: inline-flex; align-items: center; gap: 4px; background: #fff3f3; border: 1.5px solid #f5c6c6; color: #8b1a1a; font-size: 0.75rem; font-weight: 800; padding: 3px 10px; border-radius: 20px; }

  .mm-chip-materia { display: inline-flex; align-items: center; background: #f0f4ff; border: 1.5px solid #ccd6f5; color: #2d4db3; font-size: 0.78rem; font-weight: 700; padding: 3px 10px; border-radius: 20px; }
  .mm-chip-date    { display: inline-flex; align-items: center; background: #f5f0ff; border: 1.5px solid #ddd0f5; color: #5a3d9a; font-size: 0.78rem; font-weight: 700; padding: 3px 10px; border-radius: 20px; }

  /* ── Empty ── */
  .mm-empty { text-align: center; padding: 40px 20px; color: #c8a8a8; }
  .mm-empty-icon { font-size: 2rem; margin-bottom: 8px; }
  .mm-empty p { font-size: 0.85rem; font-weight: 600; margin: 0; }

  /* ── Error ── */
  .mm-error { background: #fff3f3; border: 1.5px solid #f5c6c6; color: #8b1a1a; border-radius: 11px; padding: 14px 18px; font-size: 0.85rem; font-weight: 600; }

  /* ── Loading ── */
  .mm-loading { display: flex; align-items: center; gap: 10px; color: #8b1a1a; font-weight: 700; padding: 40px 0; font-family: 'Nunito', sans-serif; }
  .mm-spinner { width: 18px; height: 18px; border: 3px solid #f0dede; border-top-color: #8b1a1a; border-radius: 50%; animation: mmSpin .8s linear infinite; flex-shrink: 0; }
  @keyframes mmSpin { to { transform: rotate(360deg); } }
`;

const IconBook = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    <line x1="9" y1="7" x2="15" y2="7"/>
    <line x1="9" y1="11" x2="13" y2="11"/>
  </svg>
);

export default function MisMateriasPage() {
  const [materias, setMaterias] = useState([]);
  const [notas, setNotas]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [resMaterias, resNotas] = await Promise.all([
          client.get("/student/materias"),
          client.get("/student/notas"),
        ]);
        setMaterias(Array.isArray(resMaterias.data) ? resMaterias.data : []);
        setNotas(Array.isArray(resNotas.data) ? resNotas.data : []);
      } catch (err) {
        setError(
          err.response?.status === 401
            ? "No estás autorizado para ver esta información"
            : "Error al cargar la información"
        );
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);

  const promedio =
    notas.length > 0
      ? (notas.reduce((sum, n) => sum + n.nota, 0) / notas.length).toFixed(2)
      : null;

  const promedioNum = promedio ? parseFloat(promedio) : null;
  const aprobado = promedioNum !== null && promedioNum >= 4;

  if (loading) return (
    <>
      <style>{styles}</style>
      <div className="mm-loading"><div className="mm-spinner" /> Cargando información...</div>
    </>
  );

  if (error) return (
    <>
      <style>{styles}</style>
      <div className="mm-error">{error}</div>
    </>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="mm-wrap">

        {/* ── Header ── */}
        <div className="mm-header">
          <div className="mm-header-icon"><IconBook /></div>
          <div>
            <h2>Mis Materias y Notas</h2>
            <p>Resumen académico del período actual</p>
          </div>
        </div>

        {/* ── Banner promedio ── */}
        {promedio && (
          <div className="mm-promedio">
            <div>
              <div className="mm-promedio-label">Promedio General</div>
              <div className="mm-promedio-val">{promedio}</div>
              <div className="mm-promedio-sub">sobre {notas.length} nota{notas.length !== 1 ? "s" : ""} registrada{notas.length !== 1 ? "s" : ""}</div>
            </div>
            <div className="mm-promedio-badge">
              {aprobado ? "✓ Aprobado" : "✕ En riesgo"}
            </div>
          </div>
        )}

        <div className="mm-layout">

          {/* ── Materias ── */}
          <div className="mm-card">
            <div className="mm-card-header">
              <span className="mm-card-bar" />
              <span className="mm-card-title">
                Mis Materias
                {materias.length > 0 && <span className="mm-count">{materias.length}</span>}
              </span>
            </div>

            {materias.length === 0 ? (
              <div className="mm-empty">
                <div className="mm-empty-icon">📚</div>
                <p>No tienes materias asignadas</p>
              </div>
            ) : (
              <div className="mm-materia-list">
                {materias.map((m, i) => (
                  <div className="mm-materia-item" key={m.id}>
                    <span className="mm-materia-num">{i + 1}</span>
                    <span className="mm-materia-dot" />
                    <span className="mm-materia-name">{m.nombre}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Notas ── */}
          <div className="mm-card">
            <div className="mm-card-header">
              <span className="mm-card-bar" />
              <span className="mm-card-title">
                Historial de Notas
                {notas.length > 0 && <span className="mm-count">{notas.length}</span>}
              </span>
            </div>

            {notas.length === 0 ? (
              <div className="mm-empty">
                <div className="mm-empty-icon">📝</div>
                <p>No existen notas registradas</p>
              </div>
            ) : (
              <div className="mm-table-wrap">
                <table className="mm-table">
                  <thead>
                    <tr>
                      <th>Materia</th>
                      <th style={{ textAlign: "center" }}>Nota</th>
                      <th style={{ textAlign: "center" }}>Estado</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notas.map((n) => {
                      const ok = n.nota >= 4;
                      return (
                        <tr key={n.id}>
                          <td>
                            <span className="mm-chip-materia">{n.materia?.nombre}</span>
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <span className={`mm-nota ${ok ? "mm-nota-ok" : "mm-nota-bad"}`}>
                              {n.nota.toFixed(1)}
                            </span>
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {ok
                              ? <span className="mm-estado-ok">✓ Aprobado</span>
                              : <span className="mm-estado-bad">✕ Reprobado</span>
                            }
                          </td>
                          <td>
                            <span className="mm-chip-date">{n.fecha.slice(0, 10)}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}