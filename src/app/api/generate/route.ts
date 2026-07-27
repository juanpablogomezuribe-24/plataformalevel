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

    let systemPrompt = '';
    
    if (template === 'balones') {
      systemPrompt = `
Eres un asistente comercial experto en ventas de balones y material deportivo.
Tu tarea es leer el brief del usuario y devolver UNICAMENTE un JSON válido que llene la estructura del template "Cotización Balones".
Inventa datos coherentes si faltan (ej. precios coherentes, logística, medidas de caja maestra) para que la cotización quede profesional.

ESTRUCTURA REQUERIDA (JSON EXACTO):
{
  "data": {
    "client": { "name": "Nombre Cliente", "nit": "NIT o RUT inventado/real" },
    "product": { "name": "Nombre del balón/producto", "image": "", "description": "Descripción persuasiva" },
    "options": [
      { "id": "3", "tag": "Infantil", "title": "Número #3", "price": 40500, "specs": "Medidas/Peso" },
      { "id": "4", "tag": "Juvenil", "title": "Número #4", "price": 44500, "specs": "Medidas/Peso" },
      { "id": "5", "tag": "Profesional", "title": "Número #5", "price": 46000, "specs": "Medidas/Peso" }
    ],
    "logistics": { "delivery": "Destino", "freight": "Condición flete", "time": "Días de entrega" },
    "masterBox": { "dimensions": "Ej: 74 x 30 x 50 cm", "weight": "Ej: 15 Kg" },
    "units": 500
  }
}
      `;
    } else if (template === 'evolution') {
      systemPrompt = `
Eres un consultor de alta dirección y estrategia (estilo McKinsey).
Tu tarea es leer el brief y devolver UNICAMENTE un JSON válido para el template "Propuesta Evolution".
El estilo debe ser vanguardista, directo y altamente persuasivo. Invéntate precios y secciones si faltan.

ESTRUCTURA REQUERIDA (JSON EXACTO):
{
  "data": {
    "cover": { "title": "Título Impactante", "subtitle": "Evolution", "description": "Resumen ejecutivo en 1 párrafo" },
    "sections": [
      {
        "title": "Categoría (ej. Fase 1 / Estrategia)",
        "blocks": [
          { "icon": "🚀", "title": "Nombre del bloque", "content": "Detalle estratégico", "price": 5000000 }
        ]
      }
    ],
    "totalPrice": 15000000
  }
}
      `;
    } else if (template === 'lotbet' || template === 'mundial') {
      systemPrompt = `
Eres un analista de datos avanzado experto en dashboards.
Tu tarea es leer el brief y devolver UNICAMENTE un JSON válido para el template de "Informe".
Extrae KPIs, métricas, y datos para gráficos. Invéntate datos de impacto si el texto es muy pobre, para demostrar el poder visual del informe.

ESTRUCTURA REQUERIDA (JSON EXACTO):
{
  "data": {
    "cover": { "title": "Título del Informe", "subtitle": "Dashboard", "date": "Mes Año" },
    "kpis": [
      { "label": "Métrica clave", "value": "100%" } // Mínimo 4 KPIs
    ],
    "metrics": [
      {
        "title": "Sección Principal",
        "description": "Análisis narrativo",
        "items": [ { "label": "Detalle", "value": "Número" } ]
      }
    ],
    "chart": {
      "title": "Distribución / Alcance",
      "items": [ { "name": "Categoría 1", "value": 40 }, { "name": "Categoría 2", "value": 60 } ]
    }
  }
}
      `;
    } else {
       // Fallback for missing template (Should not happen but just in case)
       systemPrompt = `
Eres un asistente. El usuario no eligió template. Devuelve un JSON vacío: {"data": {}}.
       `;
    }

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

    // Envolvemos en data si la IA no lo hizo
    if (!parsedData.data) {
        return NextResponse.json({ data: parsedData });
    }

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function generateMockResponse(prompt: string, clientName: string, template: string) {
  // Simulación de respuesta rápida cuando no hay API KEY
  let data = {};
  
  if (template === 'balones') {
    data = {
      client: { name: clientName || "Mock Cliente", nit: "000-000-000" },
      product: { name: "Balón Mock", description: "Descripción simulada de balón basado en: " + prompt.substring(0, 50) },
      options: [
        { id: "5", tag: "Profesional", title: "Número #5", price: 46000, specs: "Medidas estándar" }
      ],
      logistics: { delivery: "Bogotá", freight: "Incluido", time: "15 Días" },
      masterBox: { dimensions: "70x30x50", weight: "15kg" },
      units: 100
    };
  } else if (template === 'evolution') {
    data = {
      cover: { title: "Propuesta Mock", subtitle: "Evolution", description: prompt.substring(0, 50) },
      sections: [{ title: "Fase Única", blocks: [{ icon: "⚙️", title: "Desarrollo", content: "Contenido mock", price: 1000000 }] }],
      totalPrice: 1000000
    };
  } else {
    data = {
      cover: { title: "Informe Mock", subtitle: "Lotbet", date: "2026" },
      kpis: [{ label: "Usuarios", value: "10K" }, { label: "Conversión", value: "5%" }],
      metrics: [{ title: "Rendimiento", description: "Texto simulado", items: [{ label: "Clics", value: "5000" }] }],
      chart: { items: [{ name: "A", value: 50 }, { name: "B", value: 50 }] }
    };
  }

  return NextResponse.json({ data });
}
