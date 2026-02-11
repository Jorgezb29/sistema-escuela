import { useEffect, useState } from "react";
import client from "../api/client";
import { Table, Button, Badge } from "react-bootstrap";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);

  const cargar = async () => {
    const res = await client.get("/admin/users");
    setUsuarios(res.data);
  };

  useEffect(() => {
    cargar();
  }, []);

  const eliminar = async (id) => {
    if (!confirm("¿Eliminar usuario?")) return;
    await client.delete(`/admin/users/${id}`);
    cargar();
  };

  return (
    <div>
      <h2 className="fw-bold mb-4">Gestión de Usuarios</h2>

      <Table hover responsive>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Roles</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {usuarios.map(u => (
            <tr key={u.id}>
              <td>{u.nombre} {u.apellido}</td>
              <td>{u.email}</td>
              <td>
                {u.roles.map(r => (
                  <Badge key={r.id} bg="secondary" className="me-1">
                    {r.role.nombre}
                  </Badge>
                ))}
              </td>
              <td>
                {u.activo ? "Activo" : "Inactivo"}
              </td>
              <td>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => eliminar(u.id)}
                >
                  🗑️
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
