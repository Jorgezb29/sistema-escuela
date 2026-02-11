import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/* =========================
   PÁGINAS COMUNES
========================= */
import LoginPage from "../pages/LoginPage";

/* =========================
   LAYOUTS
========================= */
import AdminLayout from "../layouts/AdminLayout";
import StudentLayout from "../layouts/StudentLayout";
import TeacherLayout from "../layouts/TeacherLayout";
import ApoderadoLayout from "../layouts/ApoderadoLayout";

/* =========================
   ADMIN
========================= */
import DashboardPage from "../pages/DashboardPage";
import EstudiantesPage from "../pages/EstudiantesPage";
import DocentesPage from "../pages/DocentesPage";
import CursosPage from "../pages/CursosPage";
import MateriasPage from "../pages/MateriasPage";
import AsistenciasPage from "../pages/AsistenciasPage";
import IncidenciasPage from "../pages/IncidenciasPage";
import NotasPage from "../pages/NotasPage";
import UsuariosPage from "../pages/UsuariosPage";

/* =========================
   STUDENT
========================= */
import StudentDashboard from "../pages/student/StudentDashboard";
import MisMateriasPage from "../pages/student/MisMateriasPage";
import MisNotasPage from "../pages/student/MisNotasPage";
import MisAsistenciasPage from "../pages/student/MisAsistenciasPage";
import MisIncidenciasPage from "../pages/student/MisIncidenciasPage";
import AsistenteVocacionalPage from "../pages/student/AsistenteVocacionalPage";
import AsistenteChatPage from "../pages/student/AsistenteChatPage";

/* =========================
   APODERADO
========================= */
import ApoderadoDashboard from "../pages/apoderado/ApoderadoDashboard";
import HijosPage from "../pages/apoderado/HijosPage";
import NotasHijoPage from "../pages/apoderado/NotasHijoPage";
import AsistenciasHijoPage from "../pages/apoderado/AsistenciasHijoPage";
import IncidenciasHijoPage from "../pages/apoderado/IncidenciasHijoPage";

/* =========================
   TEACHER
========================= */
// TEACHER

import TeacherDashboard from "../pages/teacher/TeacherDashboard";
import TeacherMateriasPage from "../pages/teacher/TeacherMateriasPage";
import TeacherEstudiantesPage from "../pages/teacher/TeacherEstudiantesPage";
import TeacherNotasPage from "../pages/teacher/TeacherNotasPage";
import TeacherAsistenciasPage from "../pages/teacher/TeacherAsistenciasPage";
import TeacherIncidenciasPage from "../pages/teacher/TeacherIncidenciasPage";


/* ======================================================
   🔐 GUARD DE ROL (OBLIGATORIO)
====================================================== */
const RequireRole = ({ role, children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <h2>Cargando...</h2>;
  }

  if (!user || !user.roles?.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

/* ======================================================
   ROUTER PRINCIPAL
====================================================== */
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN */}
        <Route path="/login" element={<LoginPage />} />

        {/* ================= ADMIN ================= */}
        <Route
          path="/"
          element={
            <RequireRole role="ADMIN">
              <AdminLayout />
            </RequireRole>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="estudiantes" element={<EstudiantesPage />} />
          <Route path="docentes" element={<DocentesPage />} />
          <Route path="cursos" element={<CursosPage />} />
          <Route path="materias" element={<MateriasPage />} />
          <Route path="asistencias" element={<AsistenciasPage />} />
          <Route path="incidencias" element={<IncidenciasPage />} />
          <Route path="notas" element={<NotasPage />} />
          <Route path="usuarios" element={<UsuariosPage />} />
        </Route>

        {/* ================= STUDENT ================= */}
        <Route
          path="/student"
          element={
            <RequireRole role="ESTUDIANTE">
              <StudentLayout />
            </RequireRole>
          }
        >
          <Route index element={<StudentDashboard />} />
          <Route path="mis-materias" element={<MisMateriasPage />} />
          <Route path="mis-notas" element={<MisNotasPage />} />
          <Route path="mis-asistencias" element={<MisAsistenciasPage />} />
          <Route path="mis-incidencias" element={<MisIncidenciasPage />} />
          <Route
            path="asistente-vocacional"
            element={<AsistenteVocacionalPage />}
          />
          <Route path="asistente-chat" element={<AsistenteChatPage />} />
        </Route>

        {/* ================= DOCENTE ================= */}
        <Route
          path="/teacher"
          element={
            <RequireRole role="DOCENTE">
              <TeacherLayout />
            </RequireRole>
          }
        >
          <Route index element={<TeacherDashboard />} />

          {/* 📘 MATERIAS DEL DOCENTE */}
          <Route path="materias" element={<TeacherMateriasPage />} />

          {/* 👨‍🎓 ESTUDIANTES POR MATERIA */}
          <Route
            path="estudiantes/:materiaId"
            element={<TeacherEstudiantesPage />}
          />

          {/* 📝 NOTAS */}
          <Route path="notas/:materiaId" element={<TeacherNotasPage />} />

          {/* 📅 ASISTENCIAS */}
          <Route
            path="asistencias/:materiaId"
            element={<TeacherAsistenciasPage />}
          />

          {/* ⚠ INCIDENCIAS */}
          <Route
            path="incidencias/:materiaId"
            element={<TeacherIncidenciasPage />}
          />
        </Route>

        {/* ================= APODERADO ================= */}
        <Route
          path="/apoderado"
          element={
            <RequireRole role="APODERADO">
              <ApoderadoLayout />
            </RequireRole>
          }
        >
          <Route index element={<ApoderadoDashboard />} />
          <Route path="hijos" element={<HijosPage />} />
          <Route path="notas/:id" element={<NotasHijoPage />} />
          <Route path="asistencias/:id" element={<AsistenciasHijoPage />} />
          <Route path="incidencias/:id" element={<IncidenciasHijoPage />} />
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
