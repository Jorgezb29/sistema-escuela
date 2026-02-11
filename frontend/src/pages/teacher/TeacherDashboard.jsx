import { Link } from "react-router-dom";

export default function TeacherDashboard() {
  return (
    <div className="container mt-3">
      <h3 className="fw-bold mb-2">Bienvenido profesor</h3>
      <p className="text-muted">
        Seleccione una opción para comenzar.
      </p>

      <div className="row mt-4">

        {/* MATERIAS */}
        <div className="col-md-4 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title"> Mis cursos y materias</h5>
              <p className="card-text flex-grow-1">
                Ver los cursos y materias que dictas.
              </p>
              <Link
                to="/teacher/materias"
                state={{ action: "materias" }}
                className="btn btn-primary w-100"
              >
                Entrar
              </Link>
            </div>
          </div>
        </div>

        {/* ESTUDIANTES */}
        <div className="col-md-4 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title"> Estudiantes</h5>
              <p className="card-text flex-grow-1">
                Accede a la lista de estudiantes por curso.
              </p>
              <Link
                to="/teacher/materias"
                state={{ action: "estudiantes" }}
                className="btn btn-secondary w-100"
              >
                Seleccionar curso
              </Link>
            </div>
          </div>
        </div>

        {/* NOTAS */}
        <div className="col-md-4 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title"> Notas</h5>
              <p className="card-text flex-grow-1">
                Registrar y revisar notas por materia.
              </p>
              <Link
                to="/teacher/materias"
                state={{ action: "notas" }}
                className="btn btn-success w-100"
              >
                Seleccionar materia
              </Link>
            </div>
          </div>
        </div>

        {/* ASISTENCIAS */}
        <div className="col-md-4 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title"> Asistencias</h5>
              <p className="card-text flex-grow-1">
                Control de asistencia por curso y materia.
              </p>
              <Link
                to="/teacher/materias"
                state={{ action: "asistencias" }}
                className="btn btn-warning w-100"
              >
                Seleccionar curso
              </Link>
            </div>
          </div>
        </div>

        {/* INCIDENCIAS */}
        <div className="col-md-4 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title"> Incidencias</h5>
              <p className="card-text flex-grow-1">
                Registrar incidencias de estudiantes.
              </p>
              <Link
                to="/teacher/materias"
                state={{ action: "incidencias" }}
                className="btn btn-danger w-100"
              >
                Seleccionar curso
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
