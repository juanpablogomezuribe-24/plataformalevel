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
import VersionHistory from '@/components/VersionHistory'

export default function LayoutCotizacion({ document, updateDocument }: { document: any, updateDocument: (data: any) => void }) {
  const router = useRouter()
  const [showSettings, setShowSettings] = useState(false)
  const isReadOnly = document.status === 'en_revision' || document.status === 'publicado' || document.status === 'aprobado' || document.status === 'enviado';

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

  const renderBlockWrapper = (block: any, index: number) => {
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
        {!isReadOnly && (
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
        )}
        
        <div className="w-full">
          {block.type === 'cover' && <CoverBlock data={block.data} onChange={updateBlockData} readOnly={isReadOnly} />}
          {block.type === 'mockup' && <MockupBlock data={block.data} onChange={updateBlockData} readOnly={isReadOnly} />}
          {block.type === 'pricing' && <PricingBlock data={block.data} onChange={updateBlockData} readOnly={isReadOnly} />}
          {block.type === 'text' && <TextBlock data={block.data} onChange={updateBlockData} readOnly={isReadOnly} />}
          {block.type === 'stats' && <StatsBlock data={block.data} onChange={updateBlockData} readOnly={isReadOnly} />}
          {block.type === 'image' && <ImageBlock data={block.data} onChange={updateBlockData} readOnly={isReadOnly} />}
          {block.type === 'video' && <VideoBlock data={block.data} onChange={updateBlockData} readOnly={isReadOnly} />}
          {block.type === 'divider' && <DividerBlock data={block.data} onChange={updateBlockData} readOnly={isReadOnly} />}
          {block.type === 'testimonial' && <TestimonialBlock data={block.data} onChange={updateBlockData} readOnly={isReadOnly} />}
          {block.type === 'timeline' && <TimelineBlock data={block.data} onChange={updateBlockData} readOnly={isReadOnly} />}
          {block.type === 'team' && <TeamBlock data={block.data} onChange={updateBlockData} readOnly={isReadOnly} />}
          {block.type === 'list' && <ListBlock data={block.data} onChange={updateBlockData} readOnly={isReadOnly} />}
          {block.type === 'alert' && <AlertBlock data={block.data} onChange={updateBlockData} readOnly={isReadOnly} />}
        </div>
      </div>
    )
  }

  // Filtrar bloques
  const allBlocks = document.content?.blocks || []
  const mainBlocks = allBlocks.map((b: any, i: number) => ({ block: b, index: i })).filter((b: any) => b.block.type !== 'pricing')
  const financeBlocks = allBlocks.map((b: any, i: number) => ({ block: b, index: i })).filter((b: any) => b.block.type === 'pricing')

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans relative">
      
      {/* Floating Toolbar for Editor */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/')} className="flex items-center text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" /> Volver
          </button>
          
          {document.content?.brand?.logoUrl && (
            <img src={document.content.brand.logoUrl} alt="Logo" className="h-8 w-auto object-contain ml-4" />
          )}

          <div className="h-4 w-px bg-slate-300 ml-4"></div>
          {isReadOnly ? (
            <span className="w-64 text-sm font-bold text-slate-800 ml-2">{document.title || 'Sin Título'}</span>
          ) : (
            <input 
              type="text" 
              value={document.title || ''}
              onChange={(e) => updateDocument({ title: e.target.value })}
              className="w-64 text-sm font-bold bg-transparent outline-none border-b border-transparent focus:border-emerald-500 text-slate-800 transition-colors ml-2"
              placeholder="Título de la Cotización"
            />
          )}
        </div>

        <div className="flex items-center gap-4">
          <VersionHistory 
            document={document} 
            onRestore={(title, content) => updateDocument({ title, content })} 
          />
          {!isReadOnly && (
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200"
            >
              <Palette className="w-4 h-4" /> Marca
            </button>
          )}
          
          <div className="h-4 w-px bg-slate-300"></div>

          {/* Botones de Estado */}
          {(!document.status || document.status === 'borrador') && (
            <button 
              onClick={() => updateDocument({ status: 'en_revision' })}
              className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold py-1.5 px-4 rounded-lg shadow-md transition-all"
            >
              Solicitar Revisión
            </button>
          )}

          {document.status === 'en_revision' && (
            <>
              <div className="bg-amber-100 text-amber-700 text-sm font-bold py-1.5 px-3 rounded-lg border border-amber-200">
                En Revisión (Bloqueado)
              </div>
              <button 
                onClick={() => updateDocument({ status: 'publicado' })}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-1.5 px-4 rounded-lg shadow-md transition-all"
              >
                Aprobar y Publicar
              </button>
              <button 
                onClick={() => updateDocument({ status: 'rechazado' })}
                className="bg-red-500 hover:bg-red-600 text-white text-sm font-bold py-1.5 px-4 rounded-lg shadow-md transition-all"
              >
                Rechazar
              </button>
            </>
          )}

          {document.status === 'rechazado' && (
            <>
              <div className="bg-red-100 text-red-700 text-sm font-bold py-1.5 px-3 rounded-lg border border-red-200">
                Rechazado
              </div>
              <button 
                onClick={() => updateDocument({ status: 'borrador' })}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-bold py-1.5 px-4 rounded-lg shadow-md transition-all"
              >
                Volver a Borrador
              </button>
            </>
          )}

          {(document.status === 'publicado' || document.status === 'aprobado' || document.status === 'enviado') && (
            <>
              <div className="bg-blue-100 text-blue-700 text-sm font-bold py-1.5 px-3 rounded-lg border border-blue-200">
                {document.status.toUpperCase()}
              </div>
              <button 
                onClick={() => {
                  const url = `${window.location.origin}/view/${document.id}`
                  navigator.clipboard.writeText(url)
                  alert("¡Enlace copiado al portapapeles! Ya puedes enviarlo a tu cliente.")
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-1.5 px-4 rounded-lg shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Copiar Link
              </button>
              <button 
                onClick={() => updateDocument({ status: 'borrador' })}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-bold py-1.5 px-4 rounded-lg shadow-md transition-all"
              >
                Editar (Borrador)
              </button>
            </>
          )}
        </div>
      </div>

      {/* Settings Dropdown */}
      {showSettings && (
        <div className="absolute top-16 right-6 z-50 bg-white border border-slate-200 rounded-2xl p-6 w-80 shadow-2xl">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Ajustes de Marca</h3>
          <div className="mb-4">
            <label className="text-xs font-medium text-slate-500 block mb-2">Color Principal</label>
            <div className="flex items-center gap-3">
              <input 
                type="color" 
                value={document.content?.brand?.primaryColor || '#10b981'} 
                onChange={(e) => updateDocument({ content: { ...document.content, brand: { ...document.content?.brand, primaryColor: e.target.value } } })}
                className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent p-0"
              />
              <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                {document.content?.brand?.primaryColor || '#10b981'}
              </span>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-2">URL del Logo (Opcional)</label>
            <input 
              type="text" 
              placeholder="https://...logo.png"
              value={document.content?.brand?.logoUrl || ''} 
              onChange={(e) => updateDocument({ content: { ...document.content, brand: { ...document.content?.brand, logoUrl: e.target.value } } })}
              className="w-full bg-slate-50 text-sm text-slate-700 border border-slate-200 rounded-lg p-2 outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>
      )}

      {/* Main Content Area (Editor a Dos Columnas) */}
      <main className="flex-1 overflow-y-auto bg-slate-100 flex justify-center w-full">
        <div className="w-full max-w-[1400px] py-6 md:py-12 px-4 md:px-8 flex flex-col xl:flex-row items-start gap-8">
          
          {/* Columna Izquierda: Contenido Principal */}
          <div className="flex-1 flex flex-col gap-8 md:gap-12 min-h-0 xl:min-h-[800px] w-full">
            
            {(!allBlocks || allBlocks.length === 0) && (
              <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-20 text-center">
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Comienza tu Cotización</h2>
                <p className="text-slate-500 mt-4 text-lg">Añade textos o imágenes en esta columna, y la tabla de cotización irá a la derecha automáticamente.</p>
              </div>
            )}

            {/* Renderizador de Bloques Principales */}
            {mainBlocks.map((b: any) => renderBlockWrapper(b.block, b.index))}

            {/* Menú para Añadir Bloques */}
            {!isReadOnly && (
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xl flex flex-wrap items-center justify-center gap-4 mt-8">
                <span className="text-sm font-bold text-slate-400">Insertar:</span>
                <button onClick={() => handleAddBlock('cover')} className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-xl text-sm transition-colors">Portada</button>
                <button onClick={() => handleAddBlock('text')} className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-xl text-sm transition-colors">Texto</button>
                <button onClick={() => handleAddBlock('image')} className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-xl text-sm transition-colors">Imagen</button>
                <button onClick={() => handleAddBlock('mockup')} className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-xl text-sm transition-colors">Mockups</button>
                <button onClick={() => handleAddBlock('pricing')} className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-4 py-2 rounded-xl text-sm transition-colors shadow-sm border border-emerald-200">Cotización</button>
                <button onClick={() => handleAddBlock('testimonial')} className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-xl text-sm transition-colors">Testimonio</button>
                <button onClick={() => handleAddBlock('team')} className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-xl text-sm transition-colors">Equipo</button>
                <button onClick={() => handleAddBlock('timeline')} className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-xl text-sm transition-colors">Cronograma</button>
              </div>
            )}
          </div>

          {/* Columna Derecha: Panel Financiero Sticky */}
          <div className="w-full xl:w-[450px] sticky bottom-0 xl:top-24 flex flex-col gap-6 shrink-0 bg-slate-100/90 backdrop-blur-md p-4 xl:p-0 rounded-t-2xl xl:rounded-none shadow-[0_-10px_30px_rgba(0,0,0,0.05)] xl:shadow-none border-t border-slate-200 xl:border-none z-30">
            {financeBlocks.length > 0 ? (
              financeBlocks.map((b: any) => renderBlockWrapper(b.block, b.index))
            ) : (
              <div className="bg-slate-200 border border-slate-300 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center opacity-60">
                <p className="text-slate-500 font-bold text-sm mb-2">Panel Financiero</p>
                <p className="text-slate-400 text-xs">Agrega un bloque de "Cotización" y aparecerá automáticamente aquí.</p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  )
}
