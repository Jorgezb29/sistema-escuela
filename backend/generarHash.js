import bcrypt from "bcrypt";

const password = "123456"; // contraseña que usarás para iniciar sesión
const generar = async () => {
  const hash = await bcrypt.hash(password, 10);
  console.log("Hash generado:", hash);
};

generar();


