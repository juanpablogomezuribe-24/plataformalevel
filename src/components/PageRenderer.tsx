'use client'

import React from 'react'

interface Variation {
  layoutType: string
  data: any
}

interface Page {
  id: string
  name: string
  activeVariationIndex: number
  variations: Variation[]
}

interface PageRendererProps {
  page: Page
  brandColor?: string
}

export default function PageRenderer({ page, brandColor = '#4f46e5' }: PageRendererProps) {
  if (!page || !page.variations || page.variations.length === 0) {
    return <div className="p-8 text-center text-slate-400">Página sin contenido.</div>
  }

  const activeVariation = page.variations[page.activeVariationIndex] || page.variations[0]
  if (!activeVariation) return null

  const { layoutType, data } = activeVariation

  switch (layoutType) {
    case 'cover':
      return (
        <div className="w-full h-full flex flex-col items-center justify-center text-center p-12 bg-white">
          <div className="w-20 h-1 mb-8" style={{ backgroundColor: brandColor }}></div>
          <h1 className="text-5xl font-black text-slate-900 mb-6 leading-tight">{data.title || 'Título de Presentación'}</h1>
          <p className="text-2xl text-slate-500 max-w-2xl font-light">{data.subtitle || 'Subtítulo o descripción breve'}</p>
          {data.description && <p className="mt-8 text-slate-400 max-w-lg mx-auto">{data.description}</p>}
        </div>
      )
    
    case 'content':
      return (
        <div className="w-full h-full p-12 bg-white flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-8" style={{ color: brandColor }}>{data.title || 'Sección'}</h2>
          <div className="prose prose-lg max-w-none text-slate-600">
            {data.content || 'Contenido principal...'}
          </div>
        </div>
      )

    case 'two-column':
      return (
        <div className="w-full h-full p-12 bg-white flex flex-col">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 border-b-2 inline-block pb-2" style={{ borderBottomColor: brandColor }}>
            {data.title || 'Título de Sección'}
          </h2>
          <div className="flex-1 grid grid-cols-2 gap-12 items-center">
            <div className="text-lg text-slate-600 leading-relaxed">
              {data.left_content || 'Contenido columna izquierda...'}
            </div>
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 text-slate-700 shadow-sm text-lg">
              {data.right_content || 'Contenido destacado derecha...'}
            </div>
          </div>
        </div>
      )

    case 'metrics':
      return (
        <div className="w-full h-full p-12 bg-slate-900 text-white flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-12 text-center">{data.title || 'KPIs Principales'}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {(data.items || []).map((item: any, i: number) => (
              <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm text-center">
                <p className="text-sm text-slate-400 font-bold tracking-wider uppercase mb-2">{item.label}</p>
                <p className="text-4xl font-black" style={{ color: brandColor }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      )

    case 'chart':
      return (
        <div className="w-full h-full p-12 bg-white flex flex-col items-center justify-center text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-12">{data.title || 'Gráfico de Datos'}</h2>
          {/* Mock chart visual */}
          <div className="w-full max-w-lg h-64 border-b-2 border-l-2 border-slate-200 flex items-end justify-between px-8 pt-8">
            {(data.items || [{name:'A', value:30}, {name:'B', value:80}, {name:'C', value:50}]).map((item:any, i:number) => (
              <div key={i} className="flex flex-col items-center gap-2 w-16">
                <div 
                  className="w-full rounded-t-lg transition-all" 
                  style={{ height: `${Math.min(item.value, 100)}%`, backgroundColor: brandColor, opacity: 0.8 }}
                ></div>
                <span className="text-xs font-bold text-slate-500 truncate w-full">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      )

    case 'pricing':
      return (
        <div className="w-full h-full p-12 bg-slate-50 flex flex-col items-center justify-center">
           <h2 className="text-3xl font-bold text-slate-900 mb-12">{data.title || 'Inversión'}</h2>
           <div className="flex gap-6 w-full max-w-4xl justify-center">
             {(data.items || [{name:'Opción A', price:1000, features:'Feature 1'}, {name:'Opción B', price:2000, features:'Feature 1, 2'}]).map((item:any, i:number) => (
               <div key={i} className="flex-1 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-shadow text-center">
                 <h3 className="text-xl font-bold text-slate-900 mb-2">{item.name}</h3>
                 <p className="text-4xl font-black mb-6" style={{ color: brandColor }}>
                   ${Number(item.price).toLocaleString()}
                 </p>
                 <div className="h-px bg-slate-100 w-full mb-6"></div>
                 <p className="text-sm text-slate-500 whitespace-pre-wrap">{item.features}</p>
                 <button className="mt-8 w-full py-3 rounded-xl font-bold text-white transition-opacity hover:opacity-90" style={{ backgroundColor: brandColor }}>
                   Seleccionar
                 </button>
               </div>
             ))}
           </div>
        </div>
      )

    default:
      return (
        <div className="w-full h-full p-12 bg-white flex flex-col items-center justify-center text-center">
           <p className="text-slate-400">Layout "{layoutType}" no soportado aún.</p>
           <pre className="mt-4 text-left text-xs bg-slate-100 p-4 rounded">{JSON.stringify(data, null, 2)}</pre>
        </div>
      )
  }
}
