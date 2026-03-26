import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import client from "../api/client";
import { Form, Table } from "react-bootstrap";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');

  .inc-wrap { font-family: 'Nunito', sans-serif; }

  /* ── Encabezado ── */
  .inc-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
  }
  .inc-header-icon {
    width: 44px; height: 44px;
    border-radius: 12px;
    background: linear-gradient(135deg,#8b1a1a,#c0392b);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 4px 14px rgba(139,26,26,0.28);
  }
  .inc-header h2 {
    font-size: 1.45rem;
    font-weight: 800;
    color: #1a0a0a;
    margin: 0;
    line-height: 1.2;
  }
  .inc-header p {
    font-size: 0.75rem;
    color: #a08080;
    font-weight: 500;
    margin: 0;
  }

  /* ── Layout ── */
  .inc-layout {
    display: grid;
    grid-template-columns: 340px 1fr;
    gap: 22px;
    align-items: start;
  }
  @media (max-width: 860px) {
    .inc-layout { grid-template-columns: 1fr; }
  }

  /* ── Card base ── */
  .inc-card {
    background: #fff;
    border-radius: 15px;
    box-shadow: 0 2px 16px rgba(139,26,26,0.07);
    overflow: hidden;
  }

  .inc-card-header {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 18px 22px 14px;
    border-bottom: 1px solid #f5edec;
  }
  .inc-card-header-bar {
    width: 4px; height: 16px;
    border-radius: 3px;
    background: #8b1a1a;
    flex-shrink: 0;
  }
  .inc-card-header span {
    font-size: 0.72rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.09em;
    color: #8b1a1a;
  }

  .inc-card-body { padding: 20px 22px; }

  /* ── Formulario ── */
  .inc-field { margin-bottom: 16px; }
  .inc-field label {
    display: block;
    font-size: 0.68rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: #a08080;
    margin-bottom: 6px;
  }
  .inc-field select,
  .inc-field input[type="text"],
  .inc-field input[type="date"],
  .inc-field textarea {
    width: 100%;
    padding: 10px 13px;
    border: 1.5px solid #ede5e5;
    border-radius: 8px;
    font-size: 0.91rem;
    font-weight: 600;
    color: #2d1f1f;
    background: #fdf9f9;
    outline: none;
    font-family: 'Nunito', sans-serif;
    transition: border-color .2s, box-shadow .2s;
    appearance: none;
  }
  .inc-field select:focus,
  .inc-field input[type="text"]:focus,
  .inc-field input[type="date"]:focus,
  .inc-field textarea:focus {
    border-color: #8b1a1a;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(139,26,26,0.08);
  }
  .inc-field textarea { resize: vertical; min-height: 80px; }

  /* ── Botón submit ── */
  .inc-submit {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 11px;
    border: none;
    border-radius: 9px;
    background: linear-gradient(135deg,#8b1a1a,#c0392b);
    color: #fff;
    font-size: 0.88rem;
    font-weight: 700;
    cursor: pointer;
    font-family: 'Nunito', sans-serif;
    transition: opacity .2s, transform .15s;
    box-shadow: 0 4px 14px rgba(139,26,26,0.3);
    margin-top: 4px;
  }
  .inc-submit:hover  { opacity: .9; transform: translateY(-1px); }
  .inc-submit:active { transform: translateY(0); }

  /* ── Tabla ── */
  .inc-table-wrap { overflow-x: auto; }

  .inc-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.88rem;
  }
  .inc-table thead tr {
    border-bottom: 2px solid #f5edec;
  }
  .inc-table thead th {
    padding: 10px 14px;
    font-size: 0.65rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #a08080;
    white-space: nowrap;
  }
  .inc-table tbody tr {
    border-bottom: 1px solid #faf5f5;
    transition: background .15s;
  }
  .inc-table tbody tr:hover { background: #fdf8f8; }
  .inc-table tbody td {
    padding: 13px 14px;
    color: #2d1f1f;
    font-weight: 600;
    vertical-align: middle;
  }

  /* ── Chips / badges ── */
  .inc-chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: #fff3f3;
    border: 1.5px solid #f5c6c6;
    color: #8b1a1a;
    font-size: 0.78rem;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 20px;
    max-width: 260px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .inc-date-chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: #f5f0ff;
    border: 1.5px solid #ddd0f5;
    color: #5a3d9a;
    font-size: 0.78rem;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 20px;
  }

  .inc-student {
    display: flex;
    align-items: center;
    gap: 9px;
  }
  .inc-student-avatar {
    width: 30px; height: 30px;
    border-radius: 50%;
    background: linear-gradient(135deg,#8b1a1a,#c0392b);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.7rem; font-weight: 800; color: #fff;
    flex-shrink: 0;
  }

  /* ── Empty state ── */
  .inc-empty {
    text-align: center;
    padding: 48px 20px;
    color: #c8a8a8;
  }
  .inc-empty-icon {
    font-size: 2.5rem;
    margin-bottom: 10px;
  }
  .inc-empty p {
    font-size: 0.88rem;
    font-weight: 600;
    margin: 0;
  }

  /* ── Contador ── */
  .inc-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: #8b1a1a;
    color: #fff;
    font-size: 0.65rem;
    font-weight: 800;
    border-radius: 20px;
    padding: 1px 8px;
    margin-left: 8px;
  }
`;

export default function IncidenciasPage() {
  const { user, loading } = useAuth();
  const [incidencias, setIncidencias] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [form, setForm] = useState({ estudianteId: "", descripcion: "", fecha: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) return;
    cargarIncidencias();
    cargarEstudiantes();
  }, [loading, user]);

  const cargarIncidencias = async () => {
    try {
      const res = await client.get("/incidencias");
      setIncidencias(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.warn("No se pudieron cargar incidencias", error.response?.status);
      setIncidencias([]);
    }
  };

  const cargarEstudiantes = async () => {
    try {
      const res = await client.get("/estudiantes");
      setEstudiantes(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.warn("No se pudieron cargar estudiantes", error.response?.status);
      setEstudiantes([]);
    }
  };

  const crearIncidencia = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await client.post("/incidencias", form);
      setForm({ estudianteId: "", descripcion: "", fecha: "" });
      cargarIncidencias();
    } finally {
      setSubmitting(false);
    }
  };

  const getInicial = (nombre) => nombre?.[0]?.toUpperCase() || "?";

  return (
    <>
      <style>{styles}</style>

      <div className="inc-wrap">

        {/* ── Encabezado ── */}
        <div className="inc-header">
          <div className="inc-header-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div>
            <h2>Gestión de Incidencias</h2>
            <p>Registro y seguimiento de incidencias estudiantiles</p>
          </div>
        </div>

        <div className="inc-layout">

          {/* ── Formulario ── */}
          <div className="inc-card">
            <div className="inc-card-header">
              <span className="inc-card-header-bar" />
              <span>Registrar Incidencia</span>
            </div>
            <div className="inc-card-body">
              <form onSubmit={crearIncidencia}>

                <div className="inc-field">
                  <label>Estudiante</label>
                  <select
                    value={form.estudianteId}
                    onChange={(e) => setForm({ ...form, estudianteId: e.target.value })}
                    required
                  >
                    <option value="">Seleccione un estudiante</option>
                    {estudiantes.map((e) => {
                      const nombre  = e.user?.nombre  || "Sin nombre";
                      const apellido = e.user?.apellido || "";
                      const dni     = e.dni || e.user?.email || "";
                      return (
                        <option key={e.id} value={e.id}>
                          {nombre} {apellido} — {dni}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="inc-field">
                  <label>Descripción</label>
                  <textarea
                    placeholder="Ej: Falta de respeto en clase..."
                    value={form.descripcion}
                    onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                    required
                  />
                </div>

                <div className="inc-field">
                  <label>Fecha</label>
                  <input
                    type="date"
                    value={form.fecha}
                    onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                    required
                  />
                </div>

                <button className="inc-submit" type="submit" disabled={submitting}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                    <polyline points="17,21 17,13 7,13 7,21"/>
                    <polyline points="7,3 7,8 15,8"/>
                  </svg>
                  {submitting ? "Registrando..." : "Registrar Incidencia"}
                </button>

              </form>
            </div>
          </div>

          {/* ── Tabla ── */}
          <div className="inc-card">
            <div className="inc-card-header">
              <span className="inc-card-header-bar" />
              <span>
                Incidencias registradas
                {incidencias.length > 0 && (
                  <span className="inc-count">{incidencias.length}</span>
                )}
              </span>
            </div>
            <div className="inc-table-wrap">
              <table className="inc-table">
                <thead>
                  <tr>
                    <th>Estudiante</th>
                    <th>Descripción</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {incidencias.length > 0 ? (
                    incidencias.map((i) => (
                      <tr key={i.id}>
                        <td>
                          <div className="inc-student">
                            <div className="inc-student-avatar">
                              {getInicial(i.estudiante?.user?.nombre)}
                            </div>
                            <span>
                              {i.estudiante?.user?.nombre}{" "}
                              {i.estudiante?.user?.apellido}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="inc-chip">
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                              <circle cx="12" cy="12" r="10"/>
                              <line x1="12" y1="8" x2="12" y2="12"/>
                              <line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                            {i.descripcion}
                          </span>
                        </td>
                        <td>
                          <span className="inc-date-chip">
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                              stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              <rect x="3" y="4" width="18" height="18" rx="2"/>
                              <line x1="16" y1="2" x2="16" y2="6"/>
                              <line x1="8" y1="2" x2="8" y2="6"/>
                              <line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                            {i.fecha.slice(0, 10)}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3">
                        <div className="inc-empty">
                          <div className="inc-empty-icon">📋</div>
                          <p>No hay incidencias registradas</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}