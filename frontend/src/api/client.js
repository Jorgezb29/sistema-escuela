import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:4000/api"
});

// Interceptor para agregar token
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    // Enviar token en ambas variantes por compatibilidad
    config.headers.Authorization = `Bearer ${token}`;
    config.headers.authorization = `Bearer ${token}`;
  }

  return config;
});

// Interceptor para detectar errores
client.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("❌ ERROR AXIOS:", error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default client;
