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
Eres la IA central de "Level", una plataforma de presentaciones corporativas premium.
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
Eres la IA central de "Level", una plataforma de presentaciones corporativas premium.
Tu tarea es leer el brief del usuario y generar la estructura completa de un documento interactivo basado en diapositivas o páginas.
El usuario ha seleccionado el template base: "${template}". Utiliza su esencia visual y narrativa.

ESTRUCTURA ESTRICTA REQUERIDA (JSON):
{
  "data": {
    "pages": [
      {
        "id": "GeneraUnUUIDCorto",
        "name": "Nombre de la sección (ej. Portada, Metodología, etc.)",
        "activeVariationIndex": 0,
        "variations": [
          {
            "layoutType": "level-cover" | "level-objective" | "level-methodology" | "level-catalog" | "level-timeline",
            "data": { 
               // Los campos EXACTOS que debes devolver según el layoutType seleccionado:
               // Para level-cover: title (texto principal), subtitle (texto secundario), description (párrafo extra)
               // Para level-objective: title (opcional), mainObjective (objetivo central gran tamaño), goals (array): [{title, description}]
               // Para level-methodology: title (opcional), phases (array cronológico): [{title, description}]
               // Para level-catalog: title (opcional), items (array tipo equipo/catálogo): [{name, role, description}]
               // Para level-timeline: title (opcional), milestones (array de tiempo): [{name, date, description}]
            }
          }
        ]
      }
    ]
  }
}

REGLAS CRÍTICAS:
1. MÁGIA EN LAS VARIACIONES: Para CADA página, propón al menos 2 variaciones (objetos dentro del array 'variations') con diferentes enfoques de redacción.
2. EXCLUSIVIDAD DE LAYOUTS: SOLO puedes utilizar los 5 'layoutType' listados arriba. NO inventes nombres de layouts.
3. ADAPTACIÓN AL TEMPLATE:
   - Usa 'level-cover' para portadas y grandes cierres.
   - Usa 'level-objective' para presentar los KPIs o la gran meta estratégica y sus submetas.
   - Usa 'level-methodology' para explicar procesos, cómo trabajamos, fases de un servicio.
   - Usa 'level-catalog' para presentar el roster de influencers, el equipo clave, o los productos.
   - Usa 'level-timeline' para cronogramas, proyecciones de fechas o entregables.
4. ARREGLOS DINÁMICOS: No omitas los arreglos internos (goals, phases, items, milestones). Debes generar siempre 3-5 elementos lógicos e inventados que hagan sentido con el brief para demostrar todo el poder de la herramienta.
5. DATOS Y TEXTOS: No dejes campos vacíos.
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
