import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const { logout } = useAuth();

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand>Sistema Escolar</Navbar.Brand>

        <Nav className="me-auto">

          <NavLink to="/" className="nav-link">
            🏠 Dashboard
          </NavLink>

          <NavLink to="/estudiantes" className="nav-link">
            🎓 Estudiantes
          </NavLink>

          <NavLink to="/docentes" className="nav-link">
            👨‍🏫 Docentes
          </NavLink>

          <NavLink to="/notas" className="nav-link">
            📝 Notas
          </NavLink>

          <NavLink to="/materias" className="nav-link">
            📘 Materias
          </NavLink>

        </Nav>

        <Button variant="outline-light" onClick={logout}>
          Cerrar sesión
        </Button>
      </Container>
    </Navbar>
  );
}
