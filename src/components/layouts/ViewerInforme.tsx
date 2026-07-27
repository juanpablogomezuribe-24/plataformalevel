'use client'

import { useState } from 'react'
import { CheckCircle2, Circle, Printer, Menu, X } from 'lucide-react'
import CoverBlock from '@/components/blocks/CoverBlock'
import MockupBlock from '@/components/blocks/MockupBlock'
import PricingBlock from '@/components/blocks/PricingBlock'
import TextBlock from '@/components/blocks/TextBlock'
import StatsBlock from '@/components/blocks/StatsBlock'
import ImageBlock from '@/components/blocks/ImageBlock'
import VideoBlock from '@/components/blocks/VideoBlock'
import DividerBlock from '@/components/blocks/DividerBlock'
import TestimonialBlock from '@/components/blocks/TestimonialBlock'
import TimelineBlock from '@/components/blocks/TimelineBlock'
import TeamBlock from '@/components/blocks/TeamBlock'
import ListBlock from '@/components/blocks/ListBlock'
import AlertBlock from '@/components/blocks/AlertBlock'

export default function ViewerInforme({ document }: { document: any }) {
  // Mock data for sections
  const [sections] = useState([
    { id: 1, title: 'Portada', completed: true },
    { id: 2, title: 'Resumen Ejecutivo', completed: true },
    { id: 3, title: 'Análisis de Datos', completed: true },
    { id: 4, title: 'Conclusiones', completed: true },
  ])
  const [activeSection, setActiveSection] = useState(1)
  const [showSidebar, setShowSidebar] = useState(false)

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-100 print:bg-white overflow-hidden">
      
      {/* Botón menú móvil y barra superior cliente */}
      <div className="md:hidden p-4 bg-white border-b border-slate-200 flex justify-between items-center shrink-0 print:hidden z-50 shadow-sm relative">
        <div className="flex items-center gap-3">
          {document.content?.brand?.logoUrl && (
            <img src={document.content.brand.logoUrl} alt="Logo" className="h-6 w-auto object-contain" />
          )}
          <span className="font-bold text-sm text-slate-900 truncate">{document.title || 'Propuesta'}</span>
        </div>
        <button onClick={() => setShowSidebar(!showSidebar)} className="text-slate-900 p-1">
          {showSidebar ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar (Lotbet Style) - Clean for Client */}
      <aside className={`${showSidebar ? 'block' : 'hidden'} md:flex w-full md:w-80 bg-white border-r border-slate-200 flex-col absolute md:relative z-40 h-[calc(100vh-60px)] md:h-screen sticky top-0 shadow-lg print:hidden`}>
        {/* Top Header */}
        <div className="p-8 border-b border-slate-200 bg-slate-900 text-white">
          {document.content?.brand?.logoUrl && (
            <img src={document.content.brand.logoUrl} alt="Logo" className="h-10 w-auto mb-6 object-contain" />
          )}
          <div 
            className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md inline-block mb-4 border"
            style={{ 
              backgroundColor: document.content?.brand?.primaryColor ? `${document.content.brand.primaryColor}33` : '#06b6d433',
              color: document.content?.brand?.primaryColor || '#06b6d4',
              borderColor: document.content?.brand?.primaryColor ? `${document.content.brand.primaryColor}4D` : '#06b6d44D'
            }}
          >
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
              <Circle 
                className={`w-4 h-4 flex-shrink-0 ${activeSection === section.id ? '' : 'text-slate-300'}`}
                style={activeSection === section.id ? { color: document.content?.brand?.primaryColor || '#06b6d4', fill: document.content?.brand?.primaryColor || '#06b6d4' } : {}}
              />
              <span className={`text-sm font-bold text-left line-clamp-1 ${activeSection === section.id ? 'text-slate-900' : ''}`}>
                {section.title}
              </span>
            </button>
          ))}
        </div>
        
        {/* Footer actions */}
        <div className="p-6 border-t border-slate-200 bg-slate-50 flex flex-col gap-4">
          <button 
            onClick={() => window.print()}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-bold py-3 px-4 rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
          >
            <Printer className="w-4 h-4" />
            Descargar PDF
          </button>
          <p className="text-xs font-bold text-slate-400 text-center">Powered by <span className="text-cyan-600">LEVEL</span></p>
        </div>
      </aside>

      {/* Main Content Area (Viewer) */}
      <main className="flex-1 overflow-y-auto relative print:overflow-visible w-full">
        <div className="w-full max-w-4xl mx-auto py-6 md:py-12 px-4 md:px-8 print:p-0 print:max-w-none">
          <div className="min-h-[800px] flex flex-col gap-8 print:gap-4 print:min-h-0">
            
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
              if (block.type === 'text') return <TextBlock key={block.id} data={block.data} readOnly={true} />
              if (block.type === 'stats') return <StatsBlock key={block.id} data={block.data} readOnly={true} />
              if (block.type === 'image') return <ImageBlock key={block.id} data={block.data} readOnly={true} />
              if (block.type === 'video') return <VideoBlock key={block.id} data={block.data} readOnly={true} />
              if (block.type === 'divider') return <DividerBlock key={block.id} data={block.data} readOnly={true} />
              if (block.type === 'testimonial') return <TestimonialBlock key={block.id} data={block.data} readOnly={true} />
              if (block.type === 'timeline') return <TimelineBlock key={block.id} data={block.data} readOnly={true} />
              if (block.type === 'team') return <TeamBlock key={block.id} data={block.data} readOnly={true} />
              if (block.type === 'list') return <ListBlock key={block.id} data={block.data} readOnly={true} />
              if (block.type === 'alert') return <AlertBlock key={block.id} data={block.data} readOnly={true} />
              return null
            })}

          </div>
        </div>
      </main>
    </div>
  )
}
