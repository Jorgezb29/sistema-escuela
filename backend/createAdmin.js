import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const plainPassword = "123456";
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  // Crear rol ADMIN si no existe
  let adminRole = await prisma.role.findUnique({
    where: { nombre: "ADMIN" },
  });

  if (!adminRole) {
    adminRole = await prisma.role.create({ data: { nombre: "ADMIN" } });
  }

  // Crear o actualizar usuario admin
  const admin = await prisma.user.upsert({
    where: { email: "admin@school.com" },
    update: {
      nombre: "Admin",
      apellido: "School",
      password: hashedPassword,
      activo: true,
    },
    create: {
      nombre: "Admin",
      apellido: "School",
      email: "admin@school.com",
      password: hashedPassword,
      activo: true,
    },
  });

  // Conectar el rol ADMIN si no está conectado
  const existingRole = await prisma.userRole.findFirst({
    where: { userId: admin.id, roleId: adminRole.id },
  });

  if (!existingRole) {
    await prisma.userRole.create({
      data: {
        userId: admin.id,
        roleId: adminRole.id,
      },
    });
  }

  console.log("✅ Usuario admin listo para login:", admin);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
