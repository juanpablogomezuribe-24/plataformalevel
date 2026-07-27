import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
  try {
    const { prompt, clientName, template } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "No prompt provided" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      console.warn("No OPENAI_API_KEY found, using mock fallback AI generation");
      return generateMockResponse(prompt, clientName, template);
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Nuevo System Prompt enfocado en el Editor de Diapositivas con Variaciones
    const systemPrompt = `
Eres la IA central de "Level", una plataforma de presentaciones y propuestas corporativas premium.
Tu tarea es leer el brief del usuario y generar la estructura completa de un documento basado en páginas (diapositivas).
El usuario ha seleccionado el template base: "${template}". Utiliza la esencia visual y narrativa de ese template para inspirar el contenido.

ESTRUCTURA ESTRICTA REQUERIDA (JSON):
{
  "data": {
    "pages": [
      {
        "id": "GeneraUnUUIDCorto",
        "name": "Nombre de la sección (ej. Portada, Resumen, etc.)",
        "activeVariationIndex": 0,
        "variations": [
          {
            "layoutType": "cover" | "content" | "two-column" | "metrics" | "chart" | "pricing" | "gallery",
            "data": { 
               // Los campos exactos dependen del layoutType.
               // Para cover: title, subtitle, description
               // Para content: title, content (texto largo), image_url
               // Para two-column: title, left_content, right_content
               // Para metrics: title, items: [{label, value}]
               // Para chart: title, chartType (pie|bar|line), items: [{name, value}]
               // Para pricing: title, items: [{name, price, features}]
            }
          }
        ]
      }
    ]
  }
}

REGLAS CRÍTICAS:
1. MÁGIA EN LAS VARIACIONES: Para CADA página, debes proponer al menos 2 variaciones (objetos dentro del array 'variations') con diferentes 'layoutType' o enfoques de redacción. Por ejemplo, para el resumen, ofrece una variación 'content' y otra 'two-column'.
2. ADAPTACIÓN AL TEMPLATE:
   - Si el template es 'lotbet' o 'mundial' (Informes): Prioriza páginas con layouts 'metrics' y 'chart'. Extrae datos numéricos.
   - Si el template es 'cotizacion-generica': Asegúrate de incluir una página con layout 'pricing' y otra con 'gallery' o 'two-column' para mostrar productos/servicios.
   - Si el template es 'evolution': Estilo vanguardista, textos directos, layouts 'cover' potentes y 'two-column' para beneficios.
3. DATOS Y TEXTOS: No dejes campos vacíos. Inventa datos persuasivos, nombres de features, y números lógicos si no vienen en el brief, para que el diseño se vea lleno y profesional.
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

    if (!parsedData.data || !parsedData.data.pages) {
        // Envolver por seguridad si la IA falla
        return NextResponse.json({ data: { pages: parsedData.pages || [] } });
    }

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function generateMockResponse(prompt: string, clientName: string, template: string) {
  // Simulación mock de la nueva estructura basada en páginas
  const mockPages = [
    {
      id: 'page-1',
      name: 'Portada',
      activeVariationIndex: 0,
      variations: [
        {
          layoutType: 'cover',
          data: { title: `Propuesta para ${clientName}`, subtitle: 'Estrategia Digital', description: prompt.substring(0, 100) }
        },
        {
          layoutType: 'two-column',
          data: { title: `Proyecto ${clientName}`, left_content: 'Un enfoque disruptivo para el mercado.', right_content: prompt.substring(0, 50) }
        }
      ]
    },
    {
      id: 'page-2',
      name: 'Análisis y Métricas',
      activeVariationIndex: 0,
      variations: [
        {
          layoutType: 'metrics',
          data: { title: 'KPIs Proyectados', items: [{ label: 'Conversión', value: '15%' }, { label: 'Alcance', value: '2.5M' }] }
        },
        {
          layoutType: 'chart',
          data: { title: 'Distribución de Inversión', chartType: 'pie', items: [{ name: 'Social', value: 60 }, { name: 'Search', value: 40 }] }
        }
      ]
    }
  ];

  if (template === 'cotizacion-generica' || template === 'balones') {
    mockPages.push({
      id: 'page-3',
      name: 'Inversión',
      activeVariationIndex: 0,
      variations: [
        {
          layoutType: 'pricing',
          data: { 
            title: 'Cotización', 
            items: [
              { name: 'Licencia Core', price: 5000, features: 'Acceso total, soporte 24/7' },
              { name: 'Módulo Analítico', price: 2000, features: 'Dashboards en tiempo real' }
            ]
          }
        }
      ]
    });
  }

  return NextResponse.json({ data: { pages: mockPages } });
}
