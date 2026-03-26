import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../../api/client";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');

  .te-wrap { font-family: 'Nunito', sans-serif; }

  /* ── Back + header ── */
  .te-back {
    display: inline-flex; align-items: center; gap: 6px;
    background: none; border: none; cursor: pointer;
    font-size: 0.82rem; font-weight: 700; color: #a08080;
    font-family: 'Nunito', sans-serif;
    margin-bottom: 14px; padding: 0;
    transition: color .15s;
  }
  .te-back:hover { color: #8b1a1a; }

  .te-header { display: flex; align-items: center; gap: 12px; margin-bottom: 22px; }
  .te-header-icon {
    width: 44px; height: 44px; border-radius: 12px;
    background: linear-gradient(135deg,#8b1a1a,#c0392b);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; box-shadow: 0 4px 14px rgba(139,26,26,0.28);
  }
  .te-header h2 { font-size: 1.45rem; font-weight: 800; color: #1a0a0a; margin: 0; line-height: 1.2; }
  .te-header p  { font-size: 0.75rem; color: #a08080; font-weight: 500; margin: 0; }

  /* ── Selector de materia ── */
  .te-selector {
    display: flex; align-items: center; gap: 14px;
    background: #fff; border-radius: 13px;
    box-shadow: 0 2px 14px rgba(139,26,26,0.07);
    padding: 16px 20px; margin-bottom: 20px; flex-wrap: wrap;
  }
  .te-selector label {
    font-size: 0.68rem; font-weight: 800; text-transform: uppercase;
    letter-spacing: 0.08em; color: #8b1a1a; white-space: nowrap;
  }
  .te-selector select {
    flex: 1; min-width: 200px; padding: 9px 13px;
    border: 1.5px solid #ede5e5; border-radius: 8px;
    font-size: 0.9rem; font-weight: 600; color: #2d1f1f;
    background: #fdf9f9; outline: none;
    font-family: 'Nunito', sans-serif;
    transition: border-color .2s, box-shadow .2s; appearance: none;
  }
  .te-selector select:focus { border-color: #8b1a1a; background: #fff; box-shadow: 0 0 0 3px rgba(139,26,26,0.08); }

  /* ── Card ── */
  .te-card { background: #fff; border-radius: 15px; box-shadow: 0 2px 16px rgba(139,26,26,0.07); overflow: hidden; }
  .te-card-header { display: flex; align-items: center; gap: 9px; padding: 16px 20px 13px; border-bottom: 1px solid #f5edec; }
  .te-card-bar    { width: 4px; height: 15px; border-radius: 3px; background: #8b1a1a; flex-shrink: 0; }
  .te-card-title  { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.09em; color: #8b1a1a; }
  .te-count {
    display: inline-flex; align-items: center; justify-content: center;
    background: #8b1a1a; color: #fff; font-size: 0.63rem; font-weight: 800;
    border-radius: 20px; padding: 1px 7px; margin-left: 7px;
  }

  /* ── Tabla ── */
  .te-table-wrap { overflow-x: auto; }
  .te-table { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
  .te-table thead tr { border-bottom: 2px solid #f5edec; }
  .te-table thead th { padding: 10px 14px; font-size: 0.63rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #a08080; white-space: nowrap; }
  .te-table tbody tr { border-bottom: 1px solid #faf5f5; transition: background .15s; }
  .te-table tbody tr:hover { background: #fdf8f8; }
  .te-table tbody td { padding: 12px 14px; color: #2d1f1f; font-weight: 600; vertical-align: middle; }

  /* ── Num cell ── */
  .te-num { color: #c8a8a8; font-size: 0.8rem; font-weight: 700; }

  /* ── Estudiante cell ── */
  .te-student { display: flex; align-items: center; gap: 9px; }
  .te-avatar {
    width: 32px; height: 32px; border-radius: 50%;
    background: linear-gradient(135deg,#8b1a1a,#c0392b);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.72rem; font-weight: 800; color: #fff; flex-shrink: 0;
  }
  .te-student-name  { font-size: 0.88rem; font-weight: 700; color: #2d1f1f; }
  .te-student-email { font-size: 0.71rem; color: #a08080; font-weight: 500; }

  /* ── Acciones ── */
  .te-actions { display: flex; align-items: center; gap: 6px; }
  .te-btn {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 5px 12px; border-radius: 7px; border: none;
    font-size: 0.75rem; font-weight: 700; cursor: pointer;
    font-family: 'Nunito', sans-serif; transition: opacity .15s, transform .15s;
    white-space: nowrap;
  }
  .te-btn:hover { opacity: .85; transform: translateY(-1px); }
  .te-btn-green  { background: #edfaf3; border: 1.5px solid #a8e6c4; color: #1a7a45; }
  .te-btn-amber  { background: #fff8e0; border: 1.5px solid #f5d87a; color: #b58a00; }
  .te-btn-red    { background: #fff3f3; border: 1.5px solid #f5c6c6; color: #8b1a1a; }

  /* ── Empty / Info ── */
  .te-empty { text-align: center; padding: 48px 20px; color: #c8a8a8; }
  .te-empty-icon { font-size: 2.2rem; margin-bottom: 8px; }
  .te-empty p { font-size: 0.88rem; font-weight: 600; margin: 0; }

  .te-info {
    background: #fdf5f5; border: 1.5px solid #f0dede;
    border-radius: 11px; padding: 14px 18px;
    font-size: 0.85rem; font-weight: 600; color: #8b1a1a; margin-bottom: 16px;
  }

  /* ── Loading ── */
  .te-loading {
    display: flex; align-items: center; gap: 10px;
    color: #8b1a1a; font-weight: 700; padding: 40px 0;
    font-family: 'Nunito', sans-serif;
  }
  .te-spinner {
    width: 18px; height: 18px;
    border: 3px solid #f0dede; border-top-color: #8b1a1a;
    border-radius: 50%; animation: teSpin .8s linear infinite; flex-shrink: 0;
  }
  @keyframes teSpin { to { transform: rotate(360deg); } }
`;

const IconStudents = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const IconBack = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12,19 5,12 12,5"/>
  </svg>
);

export default function TeacherEstudiantesPage() {
  const navigate = useNavigate();
  const [cursoMaterias, setCursoMaterias]     = useState([]);
  const [estudiantes, setEstudiantes]         = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);

  useEffect(() => {
    client
      .get("/teacher/materias")
      .then((res) => {
        const materias = Array.isArray(res.data) ? res.data : [];
        setCursoMaterias(materias);
        if (materias.length > 0) {
          setCursoSeleccionado(materias[0].id);
          cargarEstudiantes(materias[0].id);
        } else {
          setLoading(false);
        }
      })
      .catch(() => { alert("Error cargando materias"); setLoading(false); });
  }, []);

  const cargarEstudiantes = (cursoMateriaId) => {
    setLoading(true);
    client
      .get(`/teacher/estudiantes/${cursoMateriaId}`)
      .then((res) => setEstudiantes(res.data.estudiantes || []))
      .catch(() => alert("Error cargando estudiantes"))
      .finally(() => setLoading(false));
  };

  const handleCambioMateria = (e) => {
    const id = Number(e.target.value);
    setCursoSeleccionado(id);
    cargarEstudiantes(id);
  };

  const getInicial = (nombre, apellido) =>
    `${nombre?.[0] || ""}${apellido?.[0] || ""}`.toUpperCase() || "E";

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="te-loading">
          <div className="te-spinner" /> Cargando estudiantes...
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="te-wrap">

        {/* ── Volver ── */}
        <button className="te-back" onClick={() => navigate("/teacher")}>
          <IconBack /> Volver al panel
        </button>

        {/* ── Encabezado ── */}
        <div className="te-header">
          <div className="te-header-icon"><IconStudents /></div>
          <div>
            <h2>Estudiantes</h2>
            <p>Listado de estudiantes por materia asignada</p>
          </div>
        </div>

        {cursoMaterias.length === 0 ? (
          <div className="te-info">No tienes materias asignadas actualmente.</div>
        ) : (
          <>
            {/* ── Selector de materia ── */}
            <div className="te-selector">
              <label>Materia</label>
              <select value={cursoSeleccionado || ""} onChange={handleCambioMateria}>
                {cursoMaterias.map((cm) => (
                  <option key={cm.id} value={cm.id}>
                    {cm.curso.nombre} — {cm.materia.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* ── Tabla ── */}
            <div className="te-card">
              <div className="te-card-header">
                <span className="te-card-bar" />
                <span className="te-card-title">
                  Estudiantes inscritos
                  {estudiantes.length > 0 && (
                    <span className="te-count">{estudiantes.length}</span>
                  )}
                </span>
              </div>

              {estudiantes.length === 0 ? (
                <div className="te-empty">
                  <div className="te-empty-icon">👨‍🎓</div>
                  <p>No hay estudiantes en este curso</p>
                </div>
              ) : (
                <div className="te-table-wrap">
                  <table className="te-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Estudiante</th>
                        <th>Apellido</th>
                        <th style={{ textAlign: "center" }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {estudiantes.map((est, i) => (
                        <tr key={est.id}>
                          <td><span className="te-num">{i + 1}</span></td>
                          <td>
                            <div className="te-student">
                              <div className="te-avatar">
                                {getInicial(est.user.nombre, est.user.apellido)}
                              </div>
                              <div>
                                <div className="te-student-name">{est.user.nombre}</div>
                                <div className="te-student-email">{est.user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td>{est.user.apellido}</td>
                          <td>
                            <div className="te-actions" style={{ justifyContent: "center" }}>
                              <button className="te-btn te-btn-green"
                                onClick={() => navigate("/teacher/notas")}>
                                Notas
                              </button>
                              <button className="te-btn te-btn-amber"
                                onClick={() => navigate("/teacher/asistencias")}>
                                Asistencia
                              </button>
                              <button className="te-btn te-btn-red"
                                onClick={() => navigate("/teacher/incidencias")}>
                                Incidencias
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}