import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const nombre = "Juan";
  const apellido = "Pérez";
  const email = "juan@school.com";
  const titulo = "Licenciado en Matemáticas";
  const telefono = "123456789";
  const plainPassword = "123456"; // contraseña inicial

  // 1️⃣ Hashear contraseña
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  // 2️⃣ Crear rol DOCENTE si no existe
  let docenteRole = await prisma.role.findUnique({
    where: { nombre: "DOCENTE" },
  });

  if (!docenteRole) {
    docenteRole = await prisma.role.create({ data: { nombre: "DOCENTE" } });
    console.log("✅ Rol DOCENTE creado");
  }

  // 3️⃣ Crear usuario base
  const user = await prisma.user.create({
    data: {
      nombre,
      apellido,
      email,
      password: hashedPassword,
      activo: true,
      roles: {
        create: { roleId: docenteRole.id },
      },
    },
  });

  console.log("✅ Usuario creado:", user);

  // 4️⃣ Crear docente vinculado al usuario
  const docente = await prisma.docente.create({
    data: {
      userId: user.id,
      titulo,
      telefono,
    },
    include: { user: true }, // para ver toda la info directamente
  });

  console.log("✅ Docente creado correctamente:", docente);
}

main()
  .catch((e) => console.error("❌ Error:", e))
  .finally(async () => {
    await prisma.$disconnect();
  });
