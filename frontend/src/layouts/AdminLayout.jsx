import { Container, Row, Col, Nav, Navbar, Button } from "react-bootstrap";
import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiHome,
  FiUsers,
  FiUser,
  FiBook,
  FiLayers,
  FiClipboard,
  FiAlertTriangle,
  FiLogOut,
} from "react-icons/fi";
import "../styles/sidebar.css";

export default function AdminLayout() {
  const { logout } = useAuth();

  return (
    <div className="d-flex flex-column vh-100">

      {/* NAVBAR SUPERIOR */}
      <Navbar bg="primary" variant="dark" className="px-4 shadow-sm d-flex align-items-center">
        
        <img
          src="/image.jpg" // << agrega la imagen en /public
          alt="Logo Colegio"
          height="40"
          className="me-3 rounded-circle border border-light"
        />

        <Navbar.Brand className="fw-bold fs-5">
          Sistema Escolar
        </Navbar.Brand>

        <div className="ms-auto">
          <Button variant="light" size="sm" onClick={logout}>
            <FiLogOut className="me-2" />
            Cerrar sesión
          </Button>
        </div>
      </Navbar>

      {/* CONTENIDO CENTRAL */}
      <Container fluid className="flex-grow-1">
        <Row className="h-100">

          {/* SIDEBAR */}
          <Col md={2} className="sidebar bg-light border-end shadow-sm p-0">
            <Nav className="flex-column">

              <NavLink to="" end className="menu-item nav-link">
                <FiHome className="me-2" /> Dashboard
              </NavLink>

              <NavLink to="estudiantes" className="menu-item nav-link">
                <FiUsers className="me-2" /> Estudiantes
              </NavLink>

              <NavLink to="docentes" className="menu-item nav-link">
                <FiUser className="me-2" /> Docentes
              </NavLink>

              <NavLink to="cursos" className="menu-item nav-link">
                <FiLayers className="me-2" /> Cursos
              </NavLink>

              <NavLink to="materias" className="menu-item nav-link">
                <FiBook className="me-2" /> Materias
              </NavLink>

              <NavLink to="notas" className="menu-item nav-link">
                <FiClipboard className="me-2" /> Notas
              </NavLink>

              <NavLink to="asistencias" className="menu-item nav-link">
                <FiClipboard className="me-2" /> Asistencias
              </NavLink>

              <NavLink to="incidencias" className="menu-item nav-link">
                <FiAlertTriangle className="me-2" /> Incidencias
              </NavLink>

            </Nav>
          </Col>

          {/* CONTENIDO PRINCIPAL */}
          <Col
            md={10}
            className="content-area p-4 bg-white"
            style={{ height: "100vh", overflowY: "auto" }}
          >
            <Outlet />
          </Col>

        </Row>
      </Container>
    </div>
  );
}
