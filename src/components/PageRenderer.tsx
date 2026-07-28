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
  template?: string
}

export default function PageRenderer({ page, brandColor = '#4f46e5', template = 'genérica' }: PageRendererProps) {
  if (!page || !page.variations || page.variations.length === 0) {
    return <div className="p-8 text-center text-slate-400">Página sin contenido.</div>
  }

  const activeVariation = page.variations[page.activeVariationIndex] || page.variations[0]
  if (!activeVariation) return null

  const { layoutType, data } = activeVariation

  // THEMES CONFIGURATION
  const isLotbet = template === 'lotbet'
  const isMundial = template === 'mundial'
  const isEvolution = template === 'evolution'
  const isDark = isLotbet || isMundial || isEvolution

  // ESTILOS BASE SEGÚN TEMPLATE
  const bgClass = isLotbet ? 'bg-[#0B1120] text-white' : 
                  isMundial ? 'bg-gradient-to-br from-emerald-950 to-slate-900 text-white' : 
                  isEvolution ? 'bg-slate-950 text-white' : 
                  'bg-white text-slate-900'

  const titleClass = isLotbet ? 'bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent' :
                     isMundial ? 'text-emerald-400' :
                     isEvolution ? 'bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent' :
                     'text-slate-900'

  const cardClass = isLotbet ? 'bg-slate-800/50 backdrop-blur-md border border-slate-700/50 text-white' :
                    isMundial ? 'bg-white/5 backdrop-blur-xl border border-emerald-500/20 text-white' :
                    isEvolution ? 'bg-white/5 backdrop-blur-2xl border border-pink-500/20 text-white' :
                    'bg-slate-50 border border-slate-100 text-slate-700 shadow-sm'

  const textMutedClass = isDark ? 'text-slate-400' : 'text-slate-500'
  const textNormalClass = isDark ? 'text-slate-300' : 'text-slate-600'

  switch (layoutType) {
    case 'cover':
      return (
        <div className={`w-full h-full flex flex-col items-center justify-center text-center p-12 ${bgClass}`}>
          {isLotbet && <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>}
          {isEvolution && <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/10 to-purple-500/10"></div>}
          <div className="relative z-10 flex flex-col items-center">
            <div className={`w-32 h-2 mb-10 ${isEvolution ? 'bg-gradient-to-r from-pink-500 to-purple-500 rounded-full' : ''}`} style={!isEvolution ? { backgroundColor: brandColor } : {}}></div>
            <h1 className={`text-6xl font-black mb-8 leading-tight max-w-4xl tracking-tight ${titleClass}`}>{data.title || 'Título de Presentación'}</h1>
            <p className={`text-2xl max-w-3xl font-light leading-relaxed ${textMutedClass}`}>{data.subtitle || 'Subtítulo o descripción breve'}</p>
            {data.description && <p className={`mt-8 max-w-2xl mx-auto text-lg ${textNormalClass}`}>{data.description}</p>}
          </div>
        </div>
      )
    
    case 'content':
      return (
        <div className={`w-full h-full p-16 flex flex-col justify-center ${bgClass} relative overflow-hidden`}>
          {isEvolution && <div className="absolute -top-32 -right-32 w-96 h-96 bg-pink-500/20 blur-3xl rounded-full"></div>}
          {isMundial && <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-emerald-500/10 to-transparent"></div>}
          
          <h2 className={`text-5xl font-black mb-10 tracking-tight ${titleClass}`}>{data.title || 'Sección'}</h2>
          <div className={`text-2xl leading-relaxed max-w-5xl relative z-10 font-light ${textNormalClass}`}>
            {data.content || 'Contenido principal...'}
          </div>
        </div>
      )

    case 'two-column':
      return (
        <div className={`w-full h-full p-16 flex flex-col ${bgClass}`}>
          <h2 className={`text-4xl font-black mb-16 border-b-4 inline-block pb-4 tracking-tight ${titleClass}`} style={!isDark ? { borderBottomColor: brandColor } : { borderColor: 'currentColor' }}>
            {data.title || 'Título de Sección'}
          </h2>
          <div className="flex-1 grid grid-cols-2 gap-16 items-center">
            <div className={`text-xl leading-relaxed font-light ${textNormalClass}`}>
              {data.left_content || 'Contenido columna izquierda...'}
            </div>
            <div className={`p-12 rounded-[2rem] text-xl font-medium shadow-2xl ${cardClass}`}>
              {data.right_content || 'Contenido destacado derecha...'}
            </div>
          </div>
        </div>
      )

    case 'metrics':
      return (
        <div className={`w-full h-full p-16 flex flex-col justify-center ${bgClass}`}>
          <h2 className={`text-4xl font-black mb-16 text-center tracking-tight ${titleClass}`}>{data.title || 'KPIs Principales'}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {(data.items || []).map((item: any, i: number) => (
              <div key={i} className={`p-8 rounded-[2rem] text-center shadow-2xl transition-transform hover:-translate-y-2 ${cardClass}`}>
                <p className={`text-sm font-bold tracking-widest uppercase mb-6 ${textMutedClass}`}>{item.label}</p>
                <p className={`text-6xl font-black ${isEvolution ? 'text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500' : isMundial ? 'text-emerald-400' : isLotbet ? 'text-white' : ''}`} style={!isDark ? { color: brandColor } : {}}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      )

    case 'chart':
      return (
        <div className={`w-full h-full p-16 flex flex-col items-center justify-center text-center ${bgClass}`}>
          <h2 className={`text-4xl font-black mb-16 tracking-tight ${titleClass}`}>{data.title || 'Gráfico de Datos'}</h2>
          <div className={`w-full max-w-3xl h-80 border-b-2 border-l-2 flex items-end justify-between px-12 pt-8 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
            {(data.items || [{name:'A', value:30}, {name:'B', value:80}, {name:'C', value:50}]).map((item:any, i:number) => (
              <div key={i} className="flex flex-col items-center gap-6 w-24 group">
                <div 
                  className={`w-full rounded-t-xl transition-all duration-700 shadow-lg group-hover:opacity-100 ${isDark ? 'opacity-90' : 'opacity-80'}`} 
                  style={{ height: `${Math.min(item.value, 100)}%`, backgroundColor: brandColor, backgroundImage: isLotbet ? 'linear-gradient(to top, #3b82f6, #6366f1)' : isMundial ? 'linear-gradient(to top, #10b981, #34d399)' : isEvolution ? 'linear-gradient(to top, #ec4899, #a855f7)' : 'none' }}
                ></div>
                <span className={`text-base font-bold truncate w-full uppercase tracking-wider ${textMutedClass}`}>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      )

    case 'pricing':
      return (
        <div className={`w-full h-full p-16 flex flex-col items-center justify-center ${bgClass}`}>
           <h2 className={`text-5xl font-black mb-16 tracking-tight ${titleClass}`}>{data.title || 'Inversión'}</h2>
           <div className="flex gap-8 w-full max-w-6xl justify-center items-stretch">
             {(data.items || [{name:'Opción A', price:1000, features:'Feature 1'}, {name:'Opción B', price:2000, features:'Feature 1, 2'}]).map((item:any, i:number) => (
               <div key={i} className={`flex-1 rounded-[2rem] p-12 hover:shadow-2xl transition-all hover:-translate-y-4 relative overflow-hidden flex flex-col ${cardClass} ${i === 1 ? 'scale-105 z-10 ring-4 ring-indigo-500/30' : ''}`}>
                 {i === 1 && <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-amber-400 to-orange-500"></div>}
                 {i === 1 && <div className="absolute top-4 right-4 bg-amber-500 text-white text-[10px] font-black uppercase px-2 py-1 rounded-full">Recomendado</div>}
                 
                 <h3 className={`text-3xl font-black mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.name}</h3>
                 <p className={`text-6xl font-black mb-10 tracking-tighter ${isMundial ? 'text-emerald-400' : isLotbet ? 'text-indigo-400' : isEvolution ? 'text-pink-400' : ''}`} style={(!isDark) ? { color: brandColor } : {}}>
                   ${Number(item.price).toLocaleString()}
                 </p>
                 <div className={`h-px w-full mb-10 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                 <div className="flex-1">
                    <p className={`text-xl whitespace-pre-wrap leading-relaxed font-light ${textNormalClass}`}>{item.features}</p>
                 </div>
                 <button className={`mt-10 w-full py-5 rounded-2xl font-black text-white text-lg transition-all hover:scale-105 shadow-xl ${isLotbet ? 'bg-indigo-600 shadow-indigo-600/30' : isMundial ? 'bg-emerald-600 shadow-emerald-600/30' : isEvolution ? 'bg-pink-600 shadow-pink-600/30' : ''}`} style={(!isDark) ? { backgroundColor: brandColor } : {}}>
                   Seleccionar Plan
                 </button>
               </div>
             ))}
           </div>
        </div>
      )

    default:
      return (
        <div className={`w-full h-full p-12 flex flex-col items-center justify-center text-center ${bgClass}`}>
           <p className={textMutedClass}>Layout "{layoutType}" no soportado aún.</p>
        </div>
      )
  }
}
