'use client'

import { useState } from 'react'
import { CheckCircle2, Circle } from 'lucide-react'
import CoverBlock from '@/components/blocks/CoverBlock'
import MockupBlock from '@/components/blocks/MockupBlock'
import PricingBlock from '@/components/blocks/PricingBlock'

export default function ViewerInforme({ document }: { document: any }) {
  // Mock data for sections
  const [sections] = useState([
    { id: 1, title: 'Portada', completed: true },
    { id: 2, title: 'Resumen Ejecutivo', completed: true },
    { id: 3, title: 'Análisis de Datos', completed: true },
    { id: 4, title: 'Conclusiones', completed: true },
  ])
  const [activeSection, setActiveSection] = useState(1)

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar (Lotbet Style) - Clean for Client */}
      <aside className="w-80 bg-white border-r border-slate-200 flex flex-col h-full shadow-lg z-10">
        {/* Top Header */}
        <div className="p-8 border-b border-slate-200 bg-slate-900 text-white">
          <div className="text-[10px] font-black uppercase tracking-widest bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-md inline-block mb-4 border border-cyan-500/30">
            PROPUESTA COMERCIAL
          </div>
          <h1 className="text-2xl font-black leading-tight">
            {document.title}
          </h1>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1 mt-4">
          <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Contenido</p>
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeSection === section.id 
                  ? 'bg-slate-50 shadow-sm border border-slate-200 text-slate-900' 
                  : 'hover:bg-slate-50 text-slate-500 border border-transparent'
              }`}
            >
              <Circle className={`w-4 h-4 flex-shrink-0 ${activeSection === section.id ? 'text-cyan-500 fill-cyan-500' : 'text-slate-300'}`} />
              <span className={`text-sm font-bold text-left line-clamp-1 ${activeSection === section.id ? 'text-slate-900' : ''}`}>
                {section.title}
              </span>
            </button>
          ))}
        </div>
        
        {/* Footer actions */}
        <div className="p-6 border-t border-slate-200 bg-slate-50 text-center">
          <p className="text-xs font-bold text-slate-400">Powered by <span className="text-cyan-600">LEVEL</span></p>
        </div>
      </aside>

      {/* Main Content Area (Viewer) */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="max-w-4xl mx-auto py-12 px-8">
          <div className="min-h-[800px] flex flex-col gap-8">
            
            {(!document.content?.blocks || document.content.blocks.length === 0) && (
              <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-12 text-center">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Documento Vacío</h2>
                <p className="text-slate-500 mt-2">Este documento aún no tiene contenido.</p>
              </div>
            )}

            {/* Renderizador de Bloques en MODO SOLO LECTURA */}
            {document.content?.blocks?.map((block: any) => {
              if (block.type === 'cover') return <CoverBlock key={block.id} data={block.data} readOnly={true} />
              if (block.type === 'mockup') return <MockupBlock key={block.id} data={block.data} readOnly={true} />
              if (block.type === 'pricing') return <PricingBlock key={block.id} data={block.data} readOnly={true} />
              return null
            })}

          </div>
        </div>
      </main>
    </div>
  )
}
