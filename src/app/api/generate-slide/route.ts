import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'edge'; // Use Edge runtime for better performance
export const maxDuration = 30; // Allow up to 30s for the edge function

export async function POST(req: Request) {
  try {
    const { prompt, clientName, template, layoutType, intent, slideName } = await req.json();

    if (!layoutType) {
      return NextResponse.json({ error: "No layoutType provided" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const systemPrompt = `
Eres un experto creador de presentaciones corporativas premium para la plataforma "Level".
Tu tarea es generar EXCLUSIVAMENTE el objeto JSON "data" para UNA (1) diapositiva específica.

CONTEXTO GENERAL DEL PROYECTO:
- Cliente: ${clientName || 'Desconocido'}
- Brief / Contexto del Usuario: ${prompt || 'Sin contexto específico'}
- Estilo / Template: ${template || 'genérico'}

DIAPOSITIVA A REDACTAR:
- Nombre: ${slideName}
- Propósito (Intent): ${intent || 'No especificado'}
- Tipo de Diseño (LayoutType): ${layoutType}

REGLAS ESTRICTAS:
1. Devuelve ÚNICAMENTE un objeto JSON válido que represente el contenido (data) de esta diapositiva.
2. NO incluyas bloques \`\`\`json. Solo devuelve el JSON puro.
3. El JSON debe tener propiedades relevantes para el diseño (ej: "title", "content", "items", "metrics").
4. Inventa datos persuasivos, lógicos y profesionales si el usuario no proporcionó el texto exacto.
5. Para campos que esperan arrays (como listas de items o hitos), asegúrate de que sean ARRAYS estrictamente.

Ejemplo de estructura esperada (adapta los nombres de las propiedades según el layout):
{
  "title": "Título impactante",
  "content": "Párrafo persuasivo sobre la estrategia...",
  "items": [
    { "name": "Elemento 1", "value": "Detalle 1" },
    { "name": "Elemento 2", "value": "Detalle 2" }
  ]
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // GPT-4o-mini es rápido e ideal para una sola diapositiva
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Genera el JSON "data" para la diapositiva "${slideName}" (Layout: ${layoutType}).`
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const aiContent = response.choices[0].message.content || '{}';
    let parsedData = {};
    
    try {
      parsedData = JSON.parse(aiContent);
    } catch (e) {
      console.error("Failed to parse single slide JSON:", aiContent);
      return NextResponse.json({ error: "Invalid JSON from AI" }, { status: 500 });
    }

    return NextResponse.json({ data: parsedData });

  } catch (error: any) {
    console.error("Error in /api/generate-slide:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
