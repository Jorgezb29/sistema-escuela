import { Outlet, NavLink } from "react-router-dom";
import { Button, Navbar, Container, Nav } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import {
  FiHome,
  FiBookOpen,
  FiClipboard,
  FiCalendar,
  FiAlertTriangle,
  FiLogOut,
  FiUser
} from "react-icons/fi";

export default function StudentLayout() {
  const { logout, user } = useAuth();

  return (
    <div className="d-flex flex-column vh-100">

      {/* NAV SUPERIOR */}
      <Navbar
        bg="success"
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
          <FiUser />
          Panel del Estudiante — {user?.nombre}
        </Navbar.Brand>

        <div className="ms-auto">
          <Button
            variant="light"
            size="sm"
            className="d-flex align-items-center"
            onClick={logout}
          >
            <FiLogOut className="me-2" />
            Cerrar sesión
          </Button>
        </div>
      </Navbar>

      {/* MENÚ HORIZONTAL */}
      <Nav className="bg-light border-bottom px-3 py-2 shadow-sm">

        <NavLink to="/student" end className="nav-link menu-student">
          <FiHome className="me-2" />
          Inicio
        </NavLink>

        <NavLink to="/student/mis-materias" className="nav-link menu-student">
          <FiBookOpen className="me-2" />
          Mis Materias
        </NavLink>

        <NavLink to="/student/mis-notas" className="nav-link menu-student">
          <FiClipboard className="me-2" />
          Mis Notas
        </NavLink>

        <NavLink to="/student/mis-asistencias" className="nav-link menu-student">
          <FiCalendar className="me-2" />
          Mis Asistencias
        </NavLink>

        <NavLink to="/student/mis-incidencias" className="nav-link menu-student">
          <FiAlertTriangle className="me-2" />
          Mis Incidencias
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
