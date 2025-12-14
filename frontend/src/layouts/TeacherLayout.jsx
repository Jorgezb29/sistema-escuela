import { Outlet, NavLink } from "react-router-dom";
import { Button, Navbar, Container, Nav } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import {
  FiHome,
  FiBookOpen,
  FiLogOut,
  FiUserCheck
} from "react-icons/fi";

export default function TeacherLayout() {
  const { logout, user } = useAuth();

  return (
    <div className="d-flex flex-column vh-100">

      {/* NAVBAR SUPERIOR */}
      <Navbar
        bg="dark"
        variant="dark"
        className="px-4 shadow-sm d-flex align-items-center"
      >
        {/* LOGO */}
        <img
          src="/image.jpg"
          alt="Logo Colegio"
          height="42"
          className="me-3 rounded-circle border border-light bg-white p-1"
        />

        <Navbar.Brand className="fw-bold fs-5 d-flex align-items-center gap-2">
          <FiUserCheck />
          Panel del Docente — {user?.nombre}
        </Navbar.Brand>

        <div className="ms-auto">
          <Button
            variant="outline-light"
            size="sm"
            className="d-flex align-items-center"
            onClick={logout}
          >
            <FiLogOut className="me-2" />
            Cerrar sesión
          </Button>
        </div>
      </Navbar>

      {/* MENÚ */}
      <Nav className="bg-light border-bottom px-3 py-2 shadow-sm">

        <NavLink to="/teacher" end className="nav-link menu-teacher">
          <FiHome className="me-2" />
          Inicio
        </NavLink>

        <NavLink to="/teacher/materias" className="nav-link menu-teacher">
          <FiBookOpen className="me-2" />
          Mis Materias
        </NavLink>

      </Nav>

      {/* CONTENIDO */}
      <Container
        fluid
        className="p-4 bg-white"
        style={{ overflowY: "auto", flexGrow: 1 }}
      >
        <Outlet />
      </Container>
    </div>
  );
}
