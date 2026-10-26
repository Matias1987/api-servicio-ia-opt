import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const analizarReceta = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No se recibió ninguna imagen.' });
    }

    // Convertimos el buffer binario de la imagen a un string Base64
    const imagenBase64 = req.file.buffer.toString('base64');
    
    // Armamos el Data URL combinando el tipo de archivo (jpg, png, etc) con el string Base64
    const dataUrl = `data:${req.file.mimetype};base64,${imagenBase64}`;
    // ==========================================

    // 3. Llamar a la API de OpenAI usando GPT-4o
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `Eres un asistente experto en optometría y oftalmología. Extrae datos clínicos y de identificación de recetas de anteojos de forma ultra-precisa.
          REGLAS:
          1. Signos obligatorios (+/-) en ESFERA y CILINDRO.
          2. Formato con dos decimales siempre (ej. "+2.00").
          3. Campos vacíos o "Neutro" deben ser null.
          4. Extrae el nombre del paciente y del médico/oftalmólogo si figuran.`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analiza la imagen y devuelve estrictamente este JSON:
              {
                "paciente_nombre": "string o null",
                "medico_nombre": "string o null",
                "ojo_derecho": { "esfera": "string o null", "cilindro": "string o null", "eje": "string o null", "adicion": "string o null" },
                "ojo_izquierdo": { "esfera": "string o null", "cilindro": "string o null", "eje": "string o null", "adicion": "string o null" },
                "tipo_lente": "string o null",
                "observaciones": "string o null"
              }`
            },
            { type: "image_url", image_url: { url: dataUrl } }
          ]
        }
      ],
      temperature: 0.1,
    });

    // --- NUEVA VALIDACIÓN DE SEGURIDAD ---
    // Imprime la respuesta completa en la consola para auditarla si falla
    console.log("Respuesta cruda de OpenAI:", JSON.stringify(response, null, 2));

    if (!response.choices || !response.choices[0] || !response.choices[0].message) {
      throw new Error("La estructura de respuesta de OpenAI no es la esperada.");
    }

    // Forma segura y moderna de acceder al contenido
    const contenidoTexto = response.choices[0].message.content;
    
    if (!contenidoTexto) {
      throw new Error("El contenido del mensaje devuelto por OpenAI está vacío.");
    }

    const datosReceta = JSON.parse(contenidoTexto);
    return res.status(200).json({ success: true, data: datosReceta });

  } catch (error) {
    console.error("Error en Microservicio de IA:", error);
    return res.status(500).json({ success: false, error: 'Error al procesar la imagen con IA.' });
  }
};
