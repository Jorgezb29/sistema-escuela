import bcrypt from "bcrypt";

const password = "123456"; // la contraseña que quieres usar
const hash = await bcrypt.hash(password, 10);

console.log("Hash generado:", hash);
