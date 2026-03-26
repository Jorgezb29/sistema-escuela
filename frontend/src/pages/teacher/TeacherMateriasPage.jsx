import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import client from "../../api/client";

export default function TeacherMateriasPage() {
  const [cursoMaterias, setCursoMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // action viene del dashboard via ?action=estudiantes
  const action = searchParams.get("action") || "materias";

  const actionConfig = {
    materias:     { label: "Ver detalle",        ruta: null,               btnClass: "btn-primary" },
    estudiantes:  { label: "Ver estudiantes",    ruta: "estudiantes",      btnClass: "btn-secondary" },
    notas:        { label: "Gestionar notas",    ruta: "notas",            btnClass: "btn-success" },
    asistencias:  { label: "Tomar asistencia",   ruta: "asistencias",      btnClass: "btn-warning" },
    incidencias:  { label: "Ver incidencias",    ruta: "incidencias",      btnClass: "btn-danger" },
  };

  const cfg = actionConfig[action] || actionConfig.materias;

  useEffect(() => {
    client
      .get("/teacher/materias")
      .then((res) => setCursoMaterias(Array.isArray(res.data) ? res.data : []))
      .catch(() => alert("Error cargando materias"))
      .finally(() => setLoading(false));
  }, []);

  const handleSeleccionar = (cm) => {
    if (!cfg.ruta) return; // modo "materias" solo muestra info
    navigate(`/teacher/${cfg.ruta}/${cm.id}`);
  };

  if (loading) return <div className="container mt-4"><p>Cargando...</p></div>;

  return (
    <div className="container mt-3">
      <h3 className="fw-bold mb-1">Mis cursos y materias</h3>
      <p className="text-muted mb-4">
        {action === "materias"
          ? "Listado de cursos y materias que dictas."
          : `Selecciona una materia para: ${action}`}
      </p>

      {cursoMaterias.length === 0 ? (
        <div className="alert alert-info">No tienes materias asignadas.</div>
      ) : (
        <div className="row">
          {cursoMaterias.map((cm) => (
            <div key={cm.id} className="col-md-4 mb-3">
              <div className="card shadow-sm h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title mb-1">{cm.materia.nombre}</h5>
                  <span className="badge bg-secondary mb-2" style={{ width: "fit-content" }}>
                    {cm.curso.nombre}
                  </span>
                  <p className="card-text text-muted flex-grow-1" style={{ fontSize: "0.9rem" }}>
                    Curso: <strong>{cm.curso.nombre}</strong>
                  </p>
                  {cfg.ruta && (
                    <button
                      className={`btn ${cfg.btnClass} w-100 mt-2`}
                      onClick={() => handleSeleccionar(cm)}
                    >
                      {cfg.label}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}