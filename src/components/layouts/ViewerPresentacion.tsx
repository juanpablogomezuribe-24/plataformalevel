'use client'

import { Printer } from 'lucide-react'
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

export default function ViewerPresentacion({ document }: { document: any }) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-100 print:bg-white font-sans">
      
      {/* Client Header (Print Hidden) */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm print:hidden">
        <div className="flex items-center gap-4">
          {document.content?.brand?.logoUrl ? (
            <img src={document.content.brand.logoUrl} alt="Logo" className="h-8 w-auto object-contain" />
          ) : (
            <div className="font-black text-xl text-slate-900">LEVEL</div>
          )}
          <div className="h-4 w-px bg-slate-300"></div>
          <h1 className="text-sm font-bold text-slate-600">
            {document.title}
          </h1>
        </div>

        <button 
          onClick={() => window.print()}
          className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold py-2 px-4 rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <Printer className="w-4 h-4" />
          Descargar PDF
        </button>
      </div>

      {/* Main Content Area (Viewer) */}
      <main className="flex-1 overflow-y-auto relative print:overflow-visible flex flex-col items-center">
        <div className="w-full max-w-6xl mx-auto py-12 px-6 md:px-12 print:p-0 print:max-w-none">
          <div className="min-h-[800px] flex flex-col gap-12 print:gap-4 print:min-h-0">
            
            {(!document.content?.blocks || document.content.blocks.length === 0) && (
              <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-20 text-center">
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Documento Vacío</h2>
                <p className="text-slate-500 mt-4 text-lg">Este documento aún no tiene contenido.</p>
              </div>
            )}

            {/* Renderizador de Bloques en MODO SOLO LECTURA */}
            {document.content?.blocks?.map((block: any) => {
              const bProps = { key: block.id, data: block.data, readOnly: true }
              
              if (block.type === 'cover') return <CoverBlock {...bProps} />
              if (block.type === 'mockup') return <MockupBlock {...bProps} />
              if (block.type === 'pricing') return <PricingBlock {...bProps} />
              if (block.type === 'text') return <TextBlock {...bProps} />
              if (block.type === 'stats') return <StatsBlock {...bProps} />
              if (block.type === 'image') return <ImageBlock {...bProps} />
              if (block.type === 'video') return <VideoBlock {...bProps} />
              if (block.type === 'divider') return <DividerBlock {...bProps} />
              if (block.type === 'testimonial') return <TestimonialBlock {...bProps} />
              if (block.type === 'timeline') return <TimelineBlock {...bProps} />
              if (block.type === 'team') return <TeamBlock {...bProps} />
              if (block.type === 'list') return <ListBlock {...bProps} />
              if (block.type === 'alert') return <AlertBlock {...bProps} />
              return null
            })}

          </div>
        </div>
      </main>
    </div>
  )
}
