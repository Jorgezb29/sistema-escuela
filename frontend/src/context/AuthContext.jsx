import { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Restaurar sesión al cargar la app
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  // 🔹 LOGIN CORREGIDO — recibe user y token por separado
  const login = (userData, token) => {
    if (!userData || !token) return;

    const finalUser = {
      ...userData,
      roles: userData.roles || [], // evita "undefined.includes"
    };

    // guardar en localStorage
    localStorage.setItem("user", JSON.stringify(finalUser));
    localStorage.setItem("token", token);

    setUser(finalUser);
  };

  // 🔹 LOGOUT
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
