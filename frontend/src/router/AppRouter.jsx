import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import LoginPage from "../pages/LoginPage";

// Layouts
import AdminLayout from "../layouts/AdminLayout";
import StudentLayout from "../layouts/StudentLayout";
import TeacherLayout from "../layouts/TeacherLayout";

// Páginas Admin
import DashboardPage from "../pages/DashboardPage";
import EstudiantesPage from "../pages/EstudiantesPage";
import DocentesPage from "../pages/DocentesPage";
import CursosPage from "../pages/CursosPage";
import MateriasPage from "../pages/MateriasPage";
import AsistenciasPage from "../pages/AsistenciasPage";
import IncidenciasPage from "../pages/IncidenciasPage";
import NotasPage from "../pages/NotasPage";

// Páginas Student
import StudentDashboard from "../pages/student/StudentDashboard";
import MisMateriasPage from "../pages/student/MisMateriasPage";
import MisNotasPage from "../pages/student/MisNotasPage";
import MisAsistenciasPage from "../pages/student/MisAsistenciasPage";
import MisIncidenciasPage from "../pages/student/MisIncidenciasPage";

// Páginas Teacher
import TeacherDashboard from "../pages/teacher/TeacherDashboard";
import TeacherMateriasPage from "../pages/teacher/TeacherMateriasPage";

export default function AppRouter() {
  const { user, loading } = useAuth();

  if (loading) return <h1>Cargando...</h1>;

  // Roles reales según tu BD:
  const isAdmin = user?.roles?.includes("ADMIN");
  const isStudent = user?.roles?.includes("ESTUDIANTE");
  const isTeacher = user?.roles?.includes("DOCENTE");

  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route path="/login" element={<LoginPage />} />

        {/* ADMIN */}
        {isAdmin && (
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="estudiantes" element={<EstudiantesPage />} />
            <Route path="docentes" element={<DocentesPage />} />
            <Route path="cursos" element={<CursosPage />} />
            <Route path="materias" element={<MateriasPage />} />
            <Route path="asistencias" element={<AsistenciasPage />} />
            <Route path="incidencias" element={<IncidenciasPage />} />
            <Route path="notas" element={<NotasPage />} />
          </Route>
        )}

        {/* STUDENT */}
        {isStudent && (
          <Route path="/student" element={<StudentLayout />}>
            <Route index element={<StudentDashboard />} />
            <Route path="mis-materias" element={<MisMateriasPage />} />
            <Route path="mis-notas" element={<MisNotasPage />} />
            <Route path="mis-asistencias" element={<MisAsistenciasPage />} />
            <Route path="mis-incidencias" element={<MisIncidenciasPage />} />
          </Route>
        )}

        {/* TEACHER */}
        {isTeacher && (
          <Route path="/teacher" element={<TeacherLayout />}>
            <Route index element={<TeacherDashboard />} />
            <Route path="materias" element={<TeacherMateriasPage />} />
          </Route>
        )}

        {/* Fallback inteligente */}
        <Route
          path="*"
          element={
            <Navigate
              to={
                isAdmin
                  ? "/"
                  : isStudent
                  ? "/student"
                  : isTeacher
                  ? "/teacher"
                  : "/login"
              }
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}
