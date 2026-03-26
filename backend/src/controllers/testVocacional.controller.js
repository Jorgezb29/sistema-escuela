import Groq from "groq-sdk";
import { PrismaClient } from "@prisma/client";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const prisma = new PrismaClient();

export const resolverTestVocacional = async (req, res) => {
  try {
    const { respuestas } = req.body;

    if (!respuestas || typeof respuestas !== "object") {
      return res.status(400).json({ message: "Respuestas inválidas" });
    }

    let exactas = 0;
    let humanidades = 0;
    let salud = 0;

    for (let i = 1; i <= 45; i++) {
      const valor = Number(respuestas[i] || 0);
      if (i >= 1 && i <= 15) exactas += valor;
      if (i >= 16 && i <= 30) humanidades += valor;
      if (i >= 31 && i <= 45) salud += valor;
    }

    const MAX_PUNTAJE = 75;

    const porcentajes = {
      exactas: Math.round((exactas / MAX_PUNTAJE) * 100),
      humanidades: Math.round((humanidades / MAX_PUNTAJE) * 100),
      salud: Math.round((salud / MAX_PUNTAJE) * 100),
    };

    const ordenadas = Object.entries({ exactas, humanidades, salud }).sort(
      (a, b) => b[1] - a[1]
    );

    const areaPrincipal = ordenadas[0][0];
    const areaSegunda = ordenadas[1][0];

    const prompt = `
Un estudiante realizó un test vocacional basado en los modelos de Kuder, CHASIDE y los códigos de Holland.

Resultados obtenidos:
- Área Exactas: ${exactas} pts (${porcentajes.exactas}%)
- Área Humanidades: ${humanidades} pts (${porcentajes.humanidades}%)
- Área Salud: ${salud} pts (${porcentajes.salud}%)

Área principal: ${areaPrincipal}
Segunda opción vocacional: ${areaSegunda}

Tareas:
1. Indica el área vocacional dominante y explica brevemente por qué
2. Explica el resultado de forma clara y sencilla para un estudiante de secundaria
3. Recomienda 4 carreras universitarias acordes al área principal
4. Menciona 2 carreras relacionadas con la segunda opción (${areaSegunda}), explicando que también tiene afinidad con esa área
5. Da un mensaje motivacional breve

Responde en español, de forma amigable y clara.
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
    });

    const texto = completion.choices[0]?.message?.content || "";

    // ── Guardar en base de datos ──────────────────────────────
    const estudiante = await prisma.estudiante.findUnique({
      where: { userId: req.user.id },
    });

    if (estudiante) {
      await prisma.resultadoVocacional.create({
        data: {
          estudianteId:          estudiante.id,
          puntajeExactas:        exactas,
          puntajeHumanidades:    humanidades,
          puntajeSalud:          salud,
          porcentajeExactas:     porcentajes.exactas,
          porcentajeHumanidades: porcentajes.humanidades,
          porcentajeSalud:       porcentajes.salud,
          areaPrincipal,
          areaSegunda,
          interpretacion:        texto,
        },
      });
    }
    // ─────────────────────────────────────────────────────────

    res.json({
      puntajes: { exactas, humanidades, salud },
      porcentajes,
      areaPrincipal,
      areaSegunda,
      interpretacion: texto,
    });

  } catch (error) {
    console.error("❌ Error test vocacional:", error);
    res.status(500).json({ message: "Error resolviendo test vocacional" });
  }
};

// ── Historial del estudiante autenticado ───────────────────
export const obtenerHistorialVocacional = async (req, res) => {
  try {
    const estudiante = await prisma.estudiante.findUnique({
      where: { userId: req.user.id },
    });

    if (!estudiante) {
      return res.status(404).json({ message: "Estudiante no encontrado" });
    }

    const historial = await prisma.resultadoVocacional.findMany({
      where: { estudianteId: estudiante.id },
      orderBy: { fechaRealizado: "desc" },
    });

    res.json(historial);
  } catch (error) {
    console.error("❌ Error obteniendo historial:", error);
    res.status(500).json({ message: "Error obteniendo historial vocacional" });
  }
};

// ── Todos los resultados (admin/docente) ───────────────────
export const obtenerTodosLosResultados = async (req, res) => {
  try {
    const resultados = await prisma.resultadoVocacional.findMany({
      orderBy: { fechaRealizado: "desc" },
      include: {
        estudiante: {
          include: {
            user: { select: { nombre: true, apellido: true, email: true } },
            curso: { select: { nombre: true } },
          },
        },
      },
    });

    res.json(resultados);
  } catch (error) {
    console.error("❌ Error obteniendo resultados:", error);
    res.status(500).json({ message: "Error obteniendo resultados" });
  }
};