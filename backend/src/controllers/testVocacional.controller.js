import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const resolverTestVocacional = async (req, res) => {
  try {
    const { respuestas } = req.body;

    if (!respuestas || typeof respuestas !== "object") {
      return res.status(400).json({ message: "Respuestas inválidas" });
    }

    let exactas = 0;
    let humanidades = 0;
    let salud = 0;

    // 45 preguntas
    for (let i = 1; i <= 45; i++) {
      const valor = Number(respuestas[i] || 0);

      if (i >= 1 && i <= 15) exactas += valor;
      if (i >= 16 && i <= 30) humanidades += valor;
      if (i >= 31 && i <= 45) salud += valor;
    }

    const prompt = `
Un estudiante realizó un test vocacional basado en los modelos de Kuder, CHASIDE y los códigos de Holland.

Resultados obtenidos:
- Área Exactas: ${exactas}
- Área Humanidades: ${humanidades}
- Área Salud: ${salud}

Tareas:
1. Indica el área vocacional dominante
2. Explica el resultado de forma clara y sencilla para un estudiante
3. Recomienda carreras universitarias acordes
4. Da un mensaje motivacional breve

Responde en español.
`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const texto = response.text();

    res.json({
      puntajes: { exactas, humanidades, salud },
      interpretacion: texto
    });

  } catch (error) {
    console.error("❌ Error test vocacional:", error);
    res.status(500).json({ message: "Error resolviendo test vocacional" });
  }
};
