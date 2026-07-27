'use client'

import { useState } from 'react'
import { CheckCircle2, Circle, ChevronLeft, Trash2, ArrowUp, ArrowDown, Palette } from 'lucide-react'
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

export default function LayoutInforme({ document, updateDocument }: { document: any, updateDocument: (data: any) => void }) {
  const router = useRouter()
  // Mock data for sections until we have actual blocks
  const [sections] = useState([
    { id: 1, title: 'Portada', completed: true },
    { id: 2, title: 'Resumen Ejecutivo', completed: true },
    { id: 3, title: 'Análisis de Datos', completed: false },
    { id: 4, title: 'Conclusiones', completed: false },
  ])
  const [activeSection, setActiveSection] = useState(3)

  // Calculate progress
  const progress = Math.round((sections.filter(s => s.completed).length / sections.length) * 100)

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
    <div className="flex h-screen bg-white">
      {/* Sidebar (Lotbet Style) */}
      <aside className="w-80 bg-slate-50 border-r border-slate-200 flex flex-col h-full">
        {/* Top Header */}
        <div className="p-8 border-b border-slate-200 bg-slate-900 text-white">
          <button onClick={() => router.push('/')} className="flex items-center text-sm font-bold text-slate-400 hover:text-white mb-6 transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" /> Volver
          </button>
          
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
          <input 
            type="text" 
            value={document.title || ''}
            onChange={(e) => updateDocument({ title: e.target.value })}
            className="w-full text-2xl font-black leading-tight bg-transparent outline-none border-b border-transparent focus:border-cyan-500 transition-colors py-1"
            placeholder="Título del Documento"
          />
        </div>

        {/* Progress Bar */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-8 p-4 bg-slate-800 rounded-2xl border border-slate-700 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Palette className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Personalizar Marca</h3>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-2">Color Principal</label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  value={document.content?.brand?.primaryColor || '#06b6d4'} 
                  onChange={(e) => updateDocument({ content: { ...document.content, brand: { ...document.content?.brand, primaryColor: e.target.value } } })}
                  className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent p-0"
                />
                <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-700">{document.content?.brand?.primaryColor || '#06b6d4'}</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-2">URL del Logo (Opcional)</label>
              <input 
                type="text" 
                placeholder="https://...logo.png"
                value={document.content?.brand?.logoUrl || ''} 
                onChange={(e) => updateDocument({ content: { ...document.content, brand: { ...document.content?.brand, logoUrl: e.target.value } } })}
                className="w-full bg-slate-900 text-sm text-slate-300 border border-slate-700 rounded-lg p-2 outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Progreso</h3>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Progreso</span>
            <span className="text-xs font-black text-cyan-600">{progress}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-cyan-500 h-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeSection === section.id 
                  ? 'bg-white shadow-sm border border-slate-200 text-slate-900' 
                  : 'hover:bg-slate-100 text-slate-500 border border-transparent'
              }`}
            >
              {section.completed ? (
                <CheckCircle2 className="w-5 h-5 text-cyan-500 flex-shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-slate-300 flex-shrink-0" />
              )}
              <span className={`text-sm font-bold text-left line-clamp-1 ${activeSection === section.id ? 'text-slate-900' : ''}`}>
                {section.title}
              </span>
            </button>
          ))}
        </div>
        
        {/* Footer actions */}
        <div className="p-6 border-t border-slate-200 bg-slate-50 flex flex-col gap-3">
          <button 
            onClick={() => {
              const url = `${window.location.origin}/view/${document.id}`
              navigator.clipboard.writeText(url)
              alert("¡Enlace copiado al portapapeles! Ya puedes enviarlo a tu cliente.")
            }}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" /> 
            Copiar Enlace Cliente
          </button>
          <p className="text-[10px] font-bold text-slate-400 text-center uppercase tracking-widest">
            Autoguardado Activado
          </p>
        </div>
      </aside>

      {/* Main Content Area (Editor) */}
      <main className="flex-1 overflow-y-auto bg-slate-100 relative">
        <div className="max-w-4xl mx-auto py-12 px-8">
          <div className="min-h-[800px] flex flex-col gap-8">
            
            {/* Header Mínimo si está vacío */}
            {(!document.content?.blocks || document.content.blocks.length === 0) && (
              <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-12 text-center">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Comienza tu Informe</h2>
                <p className="text-slate-500 mt-2">Añade tu primer bloque estructural para construir el documento.</p>
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
                  <div className="absolute -right-6 top-6 opacity-0 group-hover/blockwrapper:opacity-100 z-10 transition-opacity flex flex-col gap-2">
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
              )
            })}

            {/* Menú Flotante para Añadir Bloques */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-center justify-center gap-4 mt-8 sticky bottom-8">
              <span className="text-sm font-bold text-slate-400">Insertar:</span>
              <button onClick={() => handleAddBlock('cover')} className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-xl text-sm transition-colors">
                Portada
              </button>
              <button onClick={() => handleAddBlock('text')} className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-xl text-sm transition-colors">
                Texto
              </button>
              <button onClick={() => handleAddBlock('image')} className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-xl text-sm transition-colors">
                Imagen
              </button>
              <button onClick={() => handleAddBlock('video')} className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-xl text-sm transition-colors">
                Video
              </button>
              <button onClick={() => handleAddBlock('testimonial')} className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-xl text-sm transition-colors">
                Testimonio
              </button>
              <button onClick={() => handleAddBlock('timeline')} className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-xl text-sm transition-colors">
                Cronograma
              </button>
              <button onClick={() => handleAddBlock('team')} className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-xl text-sm transition-colors">
                Equipo
              </button>
              <button onClick={() => handleAddBlock('list')} className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-xl text-sm transition-colors">
                Lista
              </button>
              <button onClick={() => handleAddBlock('alert')} className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-xl text-sm transition-colors">
                Alerta
              </button>
              <button onClick={() => handleAddBlock('stats')} className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-xl text-sm transition-colors">
                Métricas
              </button>
              <button onClick={() => handleAddBlock('divider')} className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-xl text-sm transition-colors">
                Divisor
              </button>
              <button onClick={() => handleAddBlock('mockup')} className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-xl text-sm transition-colors">
                Mockups
              </button>
              <button onClick={() => handleAddBlock('pricing')} className="bg-cyan-50 hover:bg-cyan-100 text-cyan-700 font-bold px-4 py-2 rounded-xl text-sm transition-colors">
                Tabla de Cotización
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
