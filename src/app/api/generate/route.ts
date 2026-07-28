import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
  try {
    const { prompt, clientName, template, outline } = await req.json();

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
    const systemPrompt = outline ? `
Eres la IA central de "Level", una plataforma de presentaciones y propuestas corporativas premium.
El usuario ya ha aprobado un esqueleto estructural estricto para su presentación. Tu ÚNICA tarea es rellenar los datos ('data') para CADA layout especificado en el esqueleto.

ESQUELETO APROBADO:
${JSON.stringify(outline, null, 2)}

ESTRUCTURA ESTRICTA REQUERIDA (JSON):
Debes devolver un JSON con un array 'pages'. Cada página corresponderá a un elemento del esqueleto aprobado.
{
  "data": {
    "pages": [
      {
        "id": "GeneraUnUUIDCorto",
        "name": "Nombre exacto del esqueleto",
        "activeVariationIndex": 0,
        "variations": [
          {
            "layoutType": "ID-del-layout-del-esqueleto",
            "data": {
               // INVENTA Y COMPLETA LOS DATOS AQUÍ BASADO EN EL BRIEF Y EL INTENT
            }
          }
        ]
      }
    ]
  }
}

REGLAS CRÍTICAS:
1. DEBES respetar exactamente el orden y los 'layoutType' del esqueleto aprobado. No inventes nuevas páginas ni omitas ninguna.
2. DATOS Y TEXTOS: No dejes campos vacíos. Inventa datos persuasivos, nombres de features, y números lógicos basados en el brief.
3. INSPIRACIÓN DEL BRIEF: ${prompt}
` : `
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
            "layoutType": "cover" | "content" | "two-column" | "metrics" | "chart" | "pricing" | "profiles" | "data-table" | "timeline" | "level-cover" | "level-menu" | "level-context" | "level-objective" | "level-strategy-pillars" | "level-scope" | "level-timeline" | "level-infrastructure" | "level-preparation" | "level-crm" | "level-dashboard" | "level-funnels" | "level-comparison" | "level-linear-flow" | "level-strategy" | "level-methodology" | "level-influencers" | "level-packages" | "level-livespins" | "level-mediakits" | "level-pilotplan" | "level-informe",
            "data": { 
               // Los campos exactos dependen del layoutType.
               // Para cover: title, subtitle, description
               // Para content: title, content (texto largo), image_url
               // Para two-column: title, left_content, right_content
               // Para metrics: title, items: [{label, value}]
               // Para chart: title, chartType (pie|bar|line), items: [{name, value}]
               // Para pricing: title, items: [{name, price, features}]
               // Para profiles (influencers/equipo): title, items: [{name, role, metric}]
               // Para data-table (cronogramas/acciones): title, items: [{action, person, status}]
               // Para timeline (flujo/historia): title, items: [{phase, name, date}]
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
   - Usa 'level-cover' para la portada con fechas y cifras contratadas vs anticipo.
   - Usa 'level-menu' para crear un menú interactivo.
   - Usa 'level-context' para describir el punto de partida (base histórica) y restricciones (alertas rojas).
   - Usa 'level-objective' para presentar el objetivo en un gran quote.
   - Usa 'level-strategy-pillars' para fases de estrategia en cards lado a lado.
   - Usa 'level-infrastructure' para contar activos digitales (Instagram, FB, WABA).
   - Usa 'level-funnels' para mostrar embudos previstos vs reales.
   - Usa 'level-timeline' para cronogramas detallados de ejecución.
   - Usa 'level-strategy' para mostrar el approach (ej. Awarenes -> Adquisición).
   - Usa 'level-methodology' para los pasos de trabajo de la agencia.
   - Usa 'level-influencers' para mostrar el roster de creadores de contenido (data.items: [{name, role, metric}]).
   - Usa 'level-packages' para los tiers de precios o paquetes.
   - Usa 'level-livespins' para dinámicas de streaming o sorteos.
   - Usa 'level-mediakits' para mostrar métricas individuales de un influencer.
   - Usa 'level-pilotplan' para el resumen de lo que incluye un piloto.
3. DATOS Y TEXTOS: No dejes campos vacíos. Inventa datos persuasivos, nombres de features, y números lógicos si no vienen en el brief, para que el diseño se vea lleno y profesional. Guíate por el nombre del layout para inferir la estructura esperada en 'data'.
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
  
  const mockPages: any[] = [
    {
      id: 'page-1',
      name: 'Portada',
      activeVariationIndex: 0,
      variations: [
        {
          layoutType: 'cover',
          data: { title: isLotbet ? `Dashboard ${clientName}` : `Propuesta para ${clientName}`, subtitle: 'Resumen Ejecutivo y Estrategia', description: prompt ? prompt.substring(0, 100) + '...' : 'Descripción breve' }
        },
        {
          layoutType: 'two-column',
          data: { title: `Proyecto ${clientName}`, left_content: 'Un enfoque disruptivo para el mercado. Nuestro objetivo es dominar el segmento y acelerar el crecimiento.', right_content: prompt ? prompt.substring(0, 80) + '...' : 'Contexto' }
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
    },
    {
      id: 'page-interactive',
      name: 'Flujo Interactivo',
      activeVariationIndex: 0,
      variations: [
        {
          layoutType: 'profiles',
          data: {
            title: 'Roster de Influenciadores',
            items: [
              { name: 'Sofia T.', role: 'Lifestyle', metric: '2.5M' },
              { name: 'Carlos V.', role: 'Tech & Gaming', metric: '900K' },
              { name: 'Ana M.', role: 'Fitness', metric: '1.1M' },
              { name: 'David C.', role: 'Comedia', metric: '3.2M' }
            ]
          }
        },
        {
          layoutType: 'data-table',
          data: {
            title: 'Entregables de Campaña',
            items: [
              { action: '3x Stories (Unboxing)', person: 'Sofia T.', status: 'En Proceso' },
              { action: '1x Reel (Review)', person: 'Carlos V.', status: 'Completado' },
              { action: 'Live Workout', person: 'Ana M.', status: 'Pendiente' },
              { action: 'Mención en Podcast', person: 'David C.', status: 'Aprobado' }
            ]
          }
        },
        {
          layoutType: 'timeline',
          data: {
            title: 'Fases de Lanzamiento',
            items: [
              { phase: 'Fase 1', name: 'Teaser & Expectativa', date: 'Oct 1 - Oct 15' },
              { phase: 'Fase 2', name: 'Drop Oficial', date: 'Oct 16' },
              { phase: 'Fase 3', name: 'Sostenimiento', date: 'Oct 17 - Nov 30' }
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
