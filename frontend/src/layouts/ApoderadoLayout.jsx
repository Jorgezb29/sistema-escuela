import { Container, Row, Col, Nav, Navbar, Button } from "react-bootstrap";
import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ApoderadoLayout() {
  const { logout, user } = useAuth();

  return (
    <div className="d-flex flex-column vh-100">
      
      <Navbar bg="danger" variant="red" className="px-4 shadow-sm">
        <Navbar.Brand>Apoderado: {user.nombre}</Navbar.Brand>
        <div className="ms-auto">
          <Button variant="dark" size="sm" onClick={logout}>
            Salir
          </Button>
        </div>
      </Navbar>

      <Container fluid className="flex-grow-1">
        <Row className="h-100">

          {/* SIDEBAR */}
          <Col md={2} className="bg-light border-end p-0">
            <Nav className="flex-column">

              <NavLink to="" end className="menu-item nav-link">
                Inicio
              </NavLink>

              {/* ✅ SIEMPRE IR PRIMERO A HIJOS */}
              <NavLink to="hijos" className="menu-item nav-link">
                 Mis hijos
              </NavLink>

            </Nav>
          </Col>

          {/* CONTENIDO */}
          <Col md={10} className="p-4 bg-white">
            <Outlet />
          </Col>

        </Row>
      </Container>
    </div>
  );
}
