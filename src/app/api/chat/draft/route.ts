import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
  try {
    const { messages, template, docType, clientName } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages array" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      console.warn("No OPENAI_API_KEY found, using mock fallback AI draft");
      return NextResponse.json({
        reply: "No tengo API Key de OpenAI configurada. Te devolveré una estructura de prueba para que puedas continuar.",
        outline: [
          { name: "Portada", templateId: template === 'evolution' ? 'evo-strategy' : 'lotbet-cover', intent: "Título principal y logo" },
          { name: "Metodología", templateId: template === 'evolution' ? 'evo-methodology' : 'lotbet-strategy', intent: "Explicación del plan" }
        ]
      });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const systemPrompt = `
Eres un Arquitecto de Presentaciones experto (Co-Piloto de LEVEL).
Tu objetivo es ayudar al usuario a definir el ESQUELETO o ÍNDICE de su documento antes de generarlo.
El usuario está creando un documento de tipo: "${docType || 'presentación'}", basado en la plantilla "${template || 'genérica'}". Cliente: "${clientName || 'General'}".

INSTRUCCIONES PARA TU RESPUESTA:
1. Responde de forma amable, corta y directa al usuario (campo "reply").
2. Si tienes suficiente contexto, propón una estructura de diapositivas en el campo "outline".
3. Usa estrictamente estos IDs para los layouts propuestos en el outline:
   - FAMILIA LOTBET: lotbet-cover, lotbet-menu, lotbet-context, lotbet-objective, lotbet-strategy, lotbet-scope, lotbet-timeline, lotbet-infrastructure, lotbet-preparation, lotbet-crm, lotbet-dashboard, lotbet-funnels, lotbet-comparison, lotbet-linear-flow
   - FAMILIA EVOLUTION: evo-strategy, evo-methodology, evo-influencers, evo-packages, evo-livespins, evo-mediakits, evo-pilotplan, evo-informe
   - GENÉRICOS: cover, content, two-column, metrics, chart, pricing, profiles, data-table, timeline

FORMATO DE SALIDA ESTRICTO JSON:
{
  "reply": "Tu mensaje conversacional para el usuario. Ej: ¡Me parece genial! He propuesto 5 diapositivas, dime si quieres cambiar alguna.",
  "outline": [
    {
      "name": "Nombre de la Diapositiva",
      "templateId": "el-id-del-layout-elegido",
      "intent": "Breve descripción de lo que pondremos ahí."
    }
  ]
}

REGLAS DE ORO:
- Si el usuario dice "agrega X", actualiza el arreglo "outline" e infórmale en el "reply".
- Mantén el "reply" conversacional.
- SOLO debes devolver el JSON, sin envolturas markdown como \`\`\`json.
`;

    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
      temperature: 0.5,
      response_format: { type: "json_object" }
    });

    const content = chatResponse.choices[0].message.content || '{}';
    const parsed = JSON.parse(content);

    return NextResponse.json(parsed);

  } catch (error: any) {
    console.error("Error in draft chat:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
