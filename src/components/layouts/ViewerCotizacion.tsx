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
import ChartBlock from '@/components/blocks/ChartBlock'

export default function ViewerCotizacion({ document }: { document: any }) {
  
  const allBlocks = document.content?.blocks || []
  const mainBlocks = allBlocks.filter((b: any) => b.type !== 'pricing')
  const financeBlocks = allBlocks.filter((b: any) => b.type === 'pricing')

  const renderBlock = (block: any) => {
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
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-100 print:bg-white font-sans">
      
      {/* Client Header (Print Hidden) */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm print:hidden">
        <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
          {document.content?.brand?.logoUrl ? (
            <img src={document.content.brand.logoUrl} alt="Logo" className="h-6 md:h-8 w-auto object-contain shrink-0" />
          ) : (
            <div className="font-black text-lg md:text-xl text-slate-900 shrink-0">LEVEL</div>
          )}
          <div className="h-4 w-px bg-slate-300 shrink-0"></div>
          <h1 className="text-xs md:text-sm font-bold text-slate-600 truncate">
            {document.title}
          </h1>
        </div>

        <button 
          onClick={() => window.print()}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs md:text-sm font-bold py-2 px-3 md:px-4 rounded-xl shadow-md transition-all flex items-center gap-1 md:gap-2 shrink-0 ml-4"
        >
          <Printer className="w-4 h-4" />
          <span className="hidden md:inline">Descargar PDF</span>
          <span className="md:hidden">PDF</span>
        </button>
      </div>

      {/* Main Content Area (Viewer a Dos Columnas) */}
      <main className="flex-1 overflow-y-auto relative print:overflow-visible flex justify-center w-full">
        <div className="w-full max-w-[1400px] py-6 md:py-12 px-4 md:px-8 flex flex-col xl:flex-row items-start gap-8 print:p-0 print:block">
          
          {/* Columna Izquierda: Contenido Principal */}
          <div className="flex-1 flex flex-col gap-8 md:gap-12 print:gap-4 w-full">
            {(!allBlocks || allBlocks.length === 0) && (
              <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-12 md:p-20 text-center">
                <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">Cotización Vacía</h2>
                <p className="text-slate-500 mt-4 text-sm md:text-lg">Este documento aún no tiene contenido.</p>
              </div>
            )}
            {mainBlocks.map(renderBlock)}
          </div>

          {/* Columna Derecha: Panel Financiero Sticky */}
          {financeBlocks.length > 0 && (
            <div className="w-full xl:w-[450px] sticky bottom-0 xl:top-24 flex flex-col gap-6 shrink-0 bg-slate-100/90 backdrop-blur-md p-4 xl:p-0 rounded-t-2xl xl:rounded-none shadow-[0_-10px_30px_rgba(0,0,0,0.05)] xl:shadow-none border-t border-slate-200 xl:border-none z-30 print:w-full print:static print:mt-12 print:shadow-none print:border-none">
              {financeBlocks.map(renderBlock)}
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
