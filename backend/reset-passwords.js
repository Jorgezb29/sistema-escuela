import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function resetStudentPasswords() {
  const estudiantes = await prisma.estudiante.findMany({
    include: { user: true },
  });

  const newHash = await bcrypt.hash("123456", 10);

  for (const e of estudiantes) {
    await prisma.user.update({
      where: { id: e.userId },
      data: { password: newHash },
    });

    console.log(`✔ Password reseteado para: ${e.user.email}`);
  }

  console.log("🎉 LISTO: Todas las contraseñas se cambiaron a 123456");
  process.exit();
}

resetStudentPasswords();
