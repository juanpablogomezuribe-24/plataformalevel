import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
  try {
    const { prompt, clientName } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "No prompt provided" }, { status: 400 });
    }

    // Check if we have an API key. If not, use fallback logic.
    if (!process.env.OPENAI_API_KEY) {
      console.warn("No OPENAI_API_KEY found, using mock fallback AI generation");
      return generateMockResponse(prompt, clientName);
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const systemPrompt = `
Eres una IA experta en ventas y presentaciones ejecutivas.
Tu tarea es convertir el brief del usuario en un documento estructurado JSON listo para nuestra plataforma.
El documento debe tener el siguiente formato (responde SOLO con el JSON válido):
{
  "title": "Nombre comercial de la propuesta",
  "type": "cotizacion" | "informe" | "presentacion",
  "blocks": [
    // Array de bloques
  ]
}

Tipos de bloques disponibles y sus estructuras requeridas:
1. { "id": "uuid", "type": "cover", "data": { "title": "Título", "subtitle": "Subtítulo", "date": "fecha actual" } }
2. { "id": "uuid", "type": "text", "data": { "title": "Título sección", "content": "Texto descriptivo (puedes usar <b> y <p>)" } }
3. { "id": "uuid", "type": "pricing", "data": { "currency": "USD", "items": [{ "name": "Servicio", "price": 1000, "description": "Detalle" }] } }
4. { "id": "uuid", "type": "timeline", "data": { "items": [{ "title": "Fase 1", "description": "Detalle", "date": "Semana 1" }] } }
5. { "id": "uuid", "type": "stats", "data": { "items": [{ "label": "Métrica", "value": "100%" }] } }
6. { "id": "uuid", "type": "alert", "data": { "type": "info", "title": "Título", "description": "Texto" } }

Instrucciones:
1. Si el usuario menciona precios o presupuestos, usa type "cotizacion" e incluye un bloque "pricing".
2. Siempre empieza con un bloque "cover".
3. Inventa UUIDs simples (ej. "b-1", "b-2") para los ids.
4. Si el brief es muy corto, expande la información para que la propuesta se vea profesional y completa, inventando las fases lógicas ("timeline") y textos persuasivos.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Cliente: ${clientName || 'Sin definir'}\nBrief: ${prompt}` }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const aiResponse = response.choices[0].message.content;
    const parsedData = JSON.parse(aiResponse || "{}");

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function generateMockResponse(prompt: string, clientName: string) {
  const isQuote = prompt.toLowerCase().includes('precio') || prompt.toLowerCase().includes('cotiza') || prompt.toLowerCase().includes('$');
  
  const mockData = {
    title: `Propuesta Inteligente para ${clientName || 'Cliente'}`,
    type: isQuote ? 'cotizacion' : 'presentacion',
    blocks: [
      {
        id: 'block-1',
        type: 'cover',
        data: {
          title: `Proyecto: ${clientName || 'Estratégico'}`,
          subtitle: "Generado vía Modo Simulación IA",
          date: new Date().toLocaleDateString()
        }
      },
      {
        id: 'block-2',
        type: 'text',
        data: {
          title: "Análisis de Requerimientos",
          content: `<p>Hemos procesado tu brief: <em>"${prompt.substring(0, 100)}..."</em>.</p><p>Dado que no se ha configurado la clave de OpenAI (OPENAI_API_KEY) en las variables de entorno, este es un <strong>documento simulado</strong> para demostrar cómo el sistema convierte texto en bloques. Cuando agregues la llave, GPT redactará todo esto perfectamente.</p>`
        }
      },
      {
        id: 'block-3',
        type: 'stats',
        data: {
          items: [
            { label: "Tiempo de Respuesta IA", value: "1.2s" },
            { label: "Eficiencia", value: "+80%" },
            { label: "Nivel de Personalización", value: "Alto" }
          ]
        }
      },
      {
        id: 'block-4',
        type: 'timeline',
        data: {
          items: [
            { title: "Fase 1: Auditoría", description: "Revisión inicial del estado actual", date: "Semana 1" },
            { title: "Fase 2: Estrategia", description: "Diseño del nuevo enfoque", date: "Semana 2-3" },
            { title: "Fase 3: Ejecución", description: "Implementación técnica y visual", date: "Semana 4-6" }
          ]
        }
      }
    ]
  };

  if (isQuote) {
    mockData.blocks.push({
      id: 'block-5',
      type: 'pricing',
      data: {
        currency: "USD",
        items: [
          { name: "Licencia Base", description: "Acceso a la plataforma central", price: 1000 },
          { name: "Módulo Personalizado", description: "Desarrollo a la medida según brief", price: 2500 },
          { name: "Soporte Anual", description: "Mantenimiento y actualizaciones", price: 800 }
        ]
      }
    });
  }

  return NextResponse.json(mockData);
}
