import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import client from "../../api/client";

export default function TeacherEstudiantesPage() {
  const { cursoId } = useParams();
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cursoId) return;

    client
      .get(`/estudiantes/curso/${cursoId}`)
      .then((res) => {
        setEstudiantes(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Error cargando estudiantes", err);
      })
      .finally(() => setLoading(false));
  }, [cursoId]);

  if (loading) {
    return <p>Cargando estudiantes...</p>;
  }

  return (
    <div>
      <h3 className="fw-bold mb-3"> Estudiantes del curso</h3>

      {estudiantes.length === 0 ? (
        <p className="text-muted">No hay estudiantes en este curso</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>DNI</th>
              <th>Nombre</th>
              <th>Apellido</th>
            </tr>
          </thead>
          <tbody>
            {estudiantes.map((e) => (
              <tr key={e.id}>
                <td>{e.dni}</td>
                <td>{e.user?.nombre}</td>
                <td>{e.user?.apellido}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
