'use client'

import { useState } from 'react'
import { CheckCircle2, Circle, ChevronLeft, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import CoverBlock from '@/components/blocks/CoverBlock'
import MockupBlock from '@/components/blocks/MockupBlock'
import PricingBlock from '@/components/blocks/PricingBlock'

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
        <div className="p-6 border-b border-slate-200">
          <button onClick={() => router.push('/')} className="flex items-center text-sm font-bold text-slate-500 hover:text-slate-900 mb-6 transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" /> Volver
          </button>
          <div className="text-[10px] font-black uppercase tracking-widest bg-cyan-100 text-cyan-700 px-2 py-1 rounded-md inline-block mb-3">
            INFORME LEVEL
          </div>
          <input 
            type="text" 
            value={document.title}
            onChange={(e) => updateDocument({ title: e.target.value })}
            className="w-full text-2xl font-black text-slate-900 bg-transparent outline-none focus:border-b-2 focus:border-cyan-500 transition-colors"
            placeholder="Título del Informe"
          />
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 border-b border-slate-200 bg-white">
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

              return (
                <div key={block.id} className="relative group/blockwrapper">
                  <div className="absolute -right-6 top-6 opacity-0 group-hover/blockwrapper:opacity-100 z-10 transition-opacity">
                    <button 
                      onClick={deleteBlock}
                      title="Eliminar Bloque"
                      className="bg-white text-red-500 border border-red-100 hover:bg-red-50 p-2.5 rounded-xl shadow-lg shadow-red-500/10"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  {block.type === 'cover' && <CoverBlock data={block.data} onChange={updateBlockData} />}
                  {block.type === 'mockup' && <MockupBlock data={block.data} onChange={updateBlockData} />}
                  {block.type === 'pricing' && <PricingBlock data={block.data} onChange={updateBlockData} />}
                </div>
              )
            })}

            {/* Menú Flotante para Añadir Bloques */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center justify-center gap-4 mt-8">
              <span className="text-sm font-bold text-slate-400">Insertar:</span>
              <button 
                onClick={() => handleAddBlock('cover')}
                className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-xl text-sm transition-colors"
              >
                Portada
              </button>
              <button 
                onClick={() => handleAddBlock('mockup')}
                className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-xl text-sm transition-colors"
              >
                Mockups
              </button>
              <button 
                onClick={() => handleAddBlock('pricing')}
                className="bg-cyan-50 hover:bg-cyan-100 text-cyan-700 font-bold px-4 py-2 rounded-xl text-sm transition-colors"
              >
                Tabla de Cotización
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
