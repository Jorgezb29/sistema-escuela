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
Eres un ORIENTADOR VOCACIONAL ESCOLAR.

Responde según la pregunta del estudiante utilizando los datos del test.

REGLAS:
- No saludes
- No felicites
- No uses emojis
- No agregues introducciones
- Responde solo lo solicitado
- Máximo 3 líneas

DATOS DEL TEST
Área recomendada: ${resultado.area}

Puntajes:
Exactas: ${resultado.puntaje.exactas}
Humanidades: ${resultado.puntaje.humanidades}
Salud: ${resultado.puntaje.salud}

TIPOS DE RESPUESTA

1. Si la pregunta es:
"¿Por qué me tocó esta área?"
Responde SOLO el motivo.

Formato:
Motivo:
(explicación breve basada en los puntajes)

2. Si la pregunta es:
"¿Qué carreras puedo estudiar?"
Responde SOLO una lista de carreras relacionadas con el área.

Formato:
Carreras:
(carreras una por línea)

3. Si la pregunta es:
"¿En qué soy bueno?"
Responde SOLO con habilidades relacionadas al área.

Formato:
Habilidades:
(lista breve)

4. Si la pregunta es:
"¿Puedo cambiar de área?"
Responde con orientación general breve.

Formato:
Orientación:
(respuesta corta)

PREGUNTA DEL ESTUDIANTE:
${mensaje}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: 0.2,
      max_tokens: 150,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    res.json({
      respuesta: completion.choices[0].message.content.trim(),
    });

  } catch (error) {
    console.error("Error Groq:", error);
    res.status(500).json({
      message: "Error en el asistente vocacional",
    });
  }
};