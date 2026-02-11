import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const chatAsistente = async (req, res) => {
  try {
    const { mensaje, resultado } = req.body;

    if (!mensaje || !resultado || !resultado.puntaje) {
      return res.status(400).json({
        message: "Mensaje y resultado son obligatorios",
      });
    }

    const prompt = `
Actúa como un ORIENTADOR VOCACIONAL ESCOLAR.

Tu tarea es RESPONDER según la INTENCIÓN de la pregunta del estudiante.

TIPOS DE PREGUNTA POSIBLES:
- Explicación del resultado
- Recomendación de carreras
- Habilidades personales
- Comparación entre áreas
- Orientación general

REGLAS ESTRICTAS:
- No saludes
- No felicites
- No motives
- No uses emojis
- No hagas introducciones
- No escribas más de lo necesario
- Lenguaje claro, neutral y educativo
- Responde SOLO lo que el estudiante pregunta

DATOS DEL TEST:
Área recomendada: ${resultado.area}

Puntajes:
- Exactas: ${resultado.puntaje.exactas}
- Humanidades: ${resultado.puntaje.humanidades}
- Salud: ${resultado.puntaje.salud}

PREGUNTA DEL ESTUDIANTE:
"${mensaje}"

FORMATO DE RESPUESTA:

Si la pregunta es sobre el RESULTADO:
Motivo:
(explicación breve)

Si la pregunta es sobre CARRERAS:
Carreras recomendadas:
(lista corta)

Si la pregunta es sobre HABILIDADES:
Habilidades predominantes:
(lista breve)

Si la pregunta es GENERAL:
Orientación:
(respuesta breve y clara)
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: 0.2,
      messages: [{ role: "user", content: prompt }],
    });

    res.json({
      respuesta: completion.choices[0].message.content,
    });

  } catch (error) {
    console.error("❌ Error Groq:", error);
    res.status(500).json({
      message: "Error en el asistente vocacional",
    });
  }
};
