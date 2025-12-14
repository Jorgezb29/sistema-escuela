import { useState } from "react";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";
import { FiLogIn } from "react-icons/fi";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await client.post("/auth/login", form);

      // Validación segura
      if (!res.data?.user || !res.data?.token) {
        setError("Credenciales incorrectas");
        return;
      }

      const user = {
        ...res.data.user,
        roles: Array.isArray(res.data.user.roles)
          ? res.data.user.roles
          : [],
      };

      const token = res.data.token;

      // Guardar sesión
      login(user, token);

      // 🔀 REDIRECCIONES POR ROL
      if (user.roles.includes("ADMIN")) {
        navigate("/", { replace: true });
        return;
      }

      if (user.roles.includes("ESTUDIANTE")) {
        navigate("/student", { replace: true });
        return;
      }

      if (user.roles.includes("DOCENTE")) {
        navigate("/teacher", { replace: true });
        return;
      }

      if (user.roles.includes("TUTOR")) {
        navigate("/tutor", { replace: true });
        return;
      }

      setError("El usuario no tiene permisos asignados");
    } catch (err) {
      console.error("Error login:", err);
      setError("Correo o contraseña incorrectos");
    }
  };

  return (
    <Container
      fluid
      className="vh-100 d-flex justify-content-center align-items-center bg-light"
    >
      <Row>
        <Col>
          <Card
            className="p-4 shadow-lg border-0"
            style={{ width: "360px", borderRadius: "14px" }}
          >
            {/* LOGO */}
            <div className="text-center mb-3">
              <img
                src="/image.jpg"
                alt="Logo Colegio"
                height="90"
                className="mb-2"
              />
              <h4 className="fw-bold">Sistema Escolar</h4>
              <p className="text-muted small mb-0">
                Acceso al sistema académico
              </p>
            </div>

            {error && (
              <div className="alert alert-danger py-2 text-center">
                {error}
              </div>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Correo electrónico</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="usuario@sdblasvillas.edu.bo"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="********"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                />
              </Form.Group>

              <Button
                type="submit"
                variant="primary"
                className="w-100 d-flex align-items-center justify-content-center"
              >
                <FiLogIn className="me-2" />
                Ingresar
              </Button>
            </Form>

            <div className="text-center mt-3">
              <small className="text-muted">
                © {new Date().getFullYear()} Unidad Educativa
              </small>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
