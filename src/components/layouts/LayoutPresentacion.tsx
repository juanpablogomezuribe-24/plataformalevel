'use client'

import { useState } from 'react'
import { CheckCircle2, ChevronLeft, Trash2, ArrowUp, ArrowDown, Palette } from 'lucide-react'
import { useRouter } from 'next/navigation'
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

export default function LayoutPresentacion({ document, updateDocument }: { document: any, updateDocument: (data: any) => void }) {
  const router = useRouter()
  const [showSettings, setShowSettings] = useState(false)

  const handleAddBlock = (type: string) => {
    const newBlock = {
      id: crypto.randomUUID(),
      type: type,
      data: {}
    }
    const currentBlocks = document.content?.blocks || []
    updateDocument({ 
      content: { ...document.content, blocks: [...currentBlocks, newBlock] } 
    })
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col font-sans relative">
      
      {/* Floating Toolbar for Editor */}
      <div className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/')} className="flex items-center text-sm font-bold text-slate-400 hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" /> Volver
          </button>
          <div className="h-4 w-px bg-white/20"></div>
          <input 
            type="text" 
            value={document.title || ''}
            onChange={(e) => updateDocument({ title: e.target.value })}
            className="w-64 text-sm font-bold bg-transparent outline-none border-b border-transparent focus:border-indigo-500 transition-colors"
            placeholder="Título de la Presentación"
          />
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-lg"
          >
            <Palette className="w-4 h-4" /> Marca
          </button>
          
          <button 
            onClick={() => {
              const url = `${window.location.origin}/view/${document.id}`
              navigator.clipboard.writeText(url)
              alert("¡Enlace copiado al portapapeles! Ya puedes enviarlo a tu cliente.")
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold py-1.5 px-4 rounded-lg shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" /> Compartir
          </button>
        </div>
      </div>

      {/* Settings Dropdown */}
      {showSettings && (
        <div className="absolute top-16 right-6 z-50 bg-slate-800 border border-slate-700 rounded-2xl p-6 w-80 shadow-2xl">
          <h3 className="text-sm font-bold text-white mb-4">Ajustes de Marca</h3>
          <div className="mb-4">
            <label className="text-xs font-medium text-slate-400 block mb-2">Color Principal</label>
            <div className="flex items-center gap-3">
              <input 
                type="color" 
                value={document.content?.brand?.primaryColor || '#4f46e5'} 
                onChange={(e) => updateDocument({ content: { ...document.content, brand: { ...document.content?.brand, primaryColor: e.target.value } } })}
                className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent p-0"
              />
              <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-700">
                {document.content?.brand?.primaryColor || '#4f46e5'}
              </span>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-400 block mb-2">URL del Logo (Opcional)</label>
            <input 
              type="text" 
              placeholder="https://...logo.png"
              value={document.content?.brand?.logoUrl || ''} 
              onChange={(e) => updateDocument({ content: { ...document.content, brand: { ...document.content?.brand, logoUrl: e.target.value } } })}
              className="w-full bg-slate-900 text-sm text-slate-300 border border-slate-700 rounded-lg p-2 outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>
      )}

      {/* Main Content Area (Editor) */}
      <main className="flex-1 overflow-y-auto bg-slate-100 flex flex-col items-center">
        {/* En Presentación, el max-w es más amplio para impacto visual */}
        <div className="w-full max-w-6xl mx-auto py-12 px-6 md:px-12">
          
          {/* Logo preview */}
          {document.content?.brand?.logoUrl && (
            <div className="flex justify-center mb-12">
              <img src={document.content.brand.logoUrl} alt="Logo" className="h-12 w-auto object-contain" />
            </div>
          )}

          <div className="min-h-[800px] flex flex-col gap-12">
            
            {/* Header Mínimo si está vacío */}
            {(!document.content?.blocks || document.content.blocks.length === 0) && (
              <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-20 text-center">
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Lienzo en Blanco</h2>
                <p className="text-slate-500 mt-4 text-lg">Añade una Portada para iniciar tu presentación inmersiva.</p>
              </div>
            )}

            {/* Renderizador de Bloques */}
            {document.content?.blocks?.map((block: any, index: number) => {
              const updateBlockData = (newData: any) => {
                const newBlocks = [...document.content.blocks]
                newBlocks[index].data = newData
                updateDocument({ content: { ...document.content, blocks: newBlocks } })
              }

              const deleteBlock = () => {
                const newBlocks = document.content.blocks.filter((_: any, i: number) => i !== index)
                updateDocument({ content: { ...document.content, blocks: newBlocks } })
              }

              const moveBlockUp = () => {
                if (index === 0) return
                const newBlocks = [...document.content.blocks]
                const temp = newBlocks[index - 1]
                newBlocks[index - 1] = newBlocks[index]
                newBlocks[index] = temp
                updateDocument({ content: { ...document.content, blocks: newBlocks } })
              }

              const moveBlockDown = () => {
                if (index === document.content.blocks.length - 1) return
                const newBlocks = [...document.content.blocks]
                const temp = newBlocks[index + 1]
                newBlocks[index + 1] = newBlocks[index]
                newBlocks[index] = temp
                updateDocument({ content: { ...document.content, blocks: newBlocks } })
              }

              return (
                <div key={block.id} className="relative group/blockwrapper">
                  {/* Floating Controls for the Block */}
                  <div className="absolute -right-16 top-6 opacity-0 group-hover/blockwrapper:opacity-100 z-10 transition-opacity flex flex-col gap-2">
                    {index > 0 && (
                      <button onClick={moveBlockUp} title="Mover Arriba" className="bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 p-2 rounded-xl shadow-md">
                        <ArrowUp className="w-4 h-4" />
                      </button>
                    )}
                    {index < document.content.blocks.length - 1 && (
                      <button onClick={moveBlockDown} title="Mover Abajo" className="bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 p-2 rounded-xl shadow-md">
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    )}
                    <button 
                      onClick={deleteBlock}
                      title="Eliminar Bloque"
                      className="bg-white text-red-500 border border-red-100 hover:bg-red-50 p-2 rounded-xl shadow-lg shadow-red-500/10 mt-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* El Bloque en Sí */}
                  <div className="w-full">
                    {block.type === 'cover' && <CoverBlock data={block.data} onChange={updateBlockData} />}
                    {block.type === 'mockup' && <MockupBlock data={block.data} onChange={updateBlockData} />}
                    {block.type === 'pricing' && <PricingBlock data={block.data} onChange={updateBlockData} />}
                    {block.type === 'text' && <TextBlock data={block.data} onChange={updateBlockData} />}
                    {block.type === 'stats' && <StatsBlock data={block.data} onChange={updateBlockData} />}
                    {block.type === 'image' && <ImageBlock data={block.data} onChange={updateBlockData} />}
                    {block.type === 'video' && <VideoBlock data={block.data} onChange={updateBlockData} />}
                    {block.type === 'divider' && <DividerBlock data={block.data} onChange={updateBlockData} />}
                    {block.type === 'testimonial' && <TestimonialBlock data={block.data} onChange={updateBlockData} />}
                    {block.type === 'timeline' && <TimelineBlock data={block.data} onChange={updateBlockData} />}
                    {block.type === 'team' && <TeamBlock data={block.data} onChange={updateBlockData} />}
                    {block.type === 'list' && <ListBlock data={block.data} onChange={updateBlockData} />}
                    {block.type === 'alert' && <AlertBlock data={block.data} onChange={updateBlockData} />}
                  </div>
                </div>
              )
            })}

            {/* Menú Flotante para Añadir Bloques */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xl flex flex-wrap items-center justify-center gap-4 mt-8 sticky bottom-8 max-w-4xl mx-auto">
              <span className="text-sm font-bold text-slate-400">Insertar:</span>
              <button onClick={() => handleAddBlock('cover')} className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-xl text-sm transition-colors">Portada</button>
              <button onClick={() => handleAddBlock('text')} className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-xl text-sm transition-colors">Texto</button>
              <button onClick={() => handleAddBlock('image')} className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-xl text-sm transition-colors">Imagen</button>
              <button onClick={() => handleAddBlock('video')} className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-xl text-sm transition-colors">Video</button>
              <button onClick={() => handleAddBlock('mockup')} className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-xl text-sm transition-colors">Mockups</button>
              <button onClick={() => handleAddBlock('testimonial')} className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-xl text-sm transition-colors">Testimonio</button>
              <button onClick={() => handleAddBlock('team')} className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-xl text-sm transition-colors">Equipo</button>
              <button onClick={() => handleAddBlock('timeline')} className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-xl text-sm transition-colors">Cronograma</button>
              <button onClick={() => handleAddBlock('list')} className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-xl text-sm transition-colors">Lista</button>
              <button onClick={() => handleAddBlock('alert')} className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-xl text-sm transition-colors">Alerta</button>
              <button onClick={() => handleAddBlock('stats')} className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-xl text-sm transition-colors">Métricas</button>
              <button onClick={() => handleAddBlock('divider')} className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-xl text-sm transition-colors">Divisor</button>
              <button onClick={() => handleAddBlock('pricing')} className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-4 py-2 rounded-xl text-sm transition-colors">Cotización</button>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
