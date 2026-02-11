import { transporter } from "./mailer.js";
import { prisma } from "../server.js";

export const notificarApoderado = async (
  estudianteId,
  asunto,
  mensaje
) => {
  const estudiante = await prisma.estudiante.findUnique({
    where: { id: estudianteId },
    include: {
      tutor: true,
      user: true,
    },
  });

  if (!estudiante || !estudiante.tutor?.email) return;

  await transporter.sendMail({
    from: `"Sistema Escolar" <${process.env.MAIL_USER}>`,
    to: estudiante.tutor.email,
    subject: asunto,
    html: `
      <h3>Estimado apoderado</h3>
      <p><b>Estudiante:</b> ${estudiante.user.nombre} ${estudiante.user.apellido}</p>
      <p>${mensaje}</p>
      <hr />
      <small>Este es un correo automático</small>
    `,
  });
};
