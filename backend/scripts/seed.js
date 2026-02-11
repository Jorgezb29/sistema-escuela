import { PrismaClient } from "@prisma/client";

import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {

  // Crear roles base
  const rolesBase = ["ADMIN", "DOCENTE", "ESTUDIANTE", "APODERADO"];

  for (const r of rolesBase) {
    await prisma.role.upsert({
      where: { nombre: r },
      update: {},
      create: { nombre: r },
    });
  }

  // Crear usuario admin
  const hashedPass = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@school.com" },
    update: {},
    create: {
      nombre: "Admin",
      apellido: "Principal",
      email: "admin@school.com",
      password: hashedPass,
    },
  });

  // Asignar rol ADMIN
  const rolAdmin = await prisma.role.findUnique({ where: { nombre: "ADMIN" }});

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: admin.id, roleId: rolAdmin.id }},
    update: {},
    create: {
      userId: admin.id,
      roleId: rolAdmin.id,
    },
  });

  console.log("✔ Seed ejecutado, admin creado con rol ADMIN");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
  });
