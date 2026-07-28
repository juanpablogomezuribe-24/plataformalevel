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
  const isLotbet = template === 'lotbet' || template === 'mundial'
  
  const mockPages = [
    {
      id: 'page-1',
      name: 'Portada',
      activeVariationIndex: 0,
      variations: [
        {
          layoutType: 'cover',
          data: { title: isLotbet ? `Dashboard ${clientName}` : `Propuesta para ${clientName}`, subtitle: 'Resumen Ejecutivo y Estrategia', description: prompt.substring(0, 100) + '...' }
        },
        {
          layoutType: 'two-column',
          data: { title: `Proyecto ${clientName}`, left_content: 'Un enfoque disruptivo para el mercado. Nuestro objetivo es dominar el segmento y acelerar el crecimiento.', right_content: prompt.substring(0, 80) + '...' }
        }
      ]
    },
    {
      id: 'page-2',
      name: 'Métricas Clave',
      activeVariationIndex: 0,
      variations: [
        {
          layoutType: 'metrics',
          data: { 
            title: 'KPIs Proyectados', 
            items: [
              { label: 'Conversión', value: '18%' }, 
              { label: 'Alcance Mensual', value: '3.2M' },
              { label: 'Costo por Adquisición', value: '$1.4' },
              { label: 'Retorno (ROI)', value: '250%' }
            ] 
          }
        },
        {
          layoutType: 'chart',
          data: { 
            title: 'Distribución de Audiencia', 
            chartType: 'bar', 
            items: [
              { name: 'Instagram', value: 65 }, 
              { name: 'TikTok', value: 85 }, 
              { name: 'YouTube', value: 45 },
              { name: 'Google', value: 90 }
            ] 
          }
        }
      ]
    }
  ];

  if (template === 'cotizacion-generica' || template === 'balones' || template === 'evolution') {
    mockPages.push({
      id: 'page-3',
      name: 'Inversión',
      activeVariationIndex: 0,
      variations: [
        {
          layoutType: 'pricing',
          data: { 
            title: 'Propuesta Económica', 
            items: [
              { name: 'Fase Inicial', price: 15000, features: 'Análisis de mercado\nDiseño de estrategia\nSetup de campañas' },
              { name: 'Fase de Escalamiento', price: 35000, features: 'Optimización de conversiones\nImplementación IA\nSoporte 24/7' }
            ]
          }
        },
        {
          layoutType: 'content',
          data: { title: 'Condiciones Comerciales', content: 'El pago se divide en dos fases. 50% al iniciar y 50% al finalizar la integración del sistema.' }
        }
      ]
    });
  }

  return NextResponse.json({ data: { pages: mockPages } });
}
