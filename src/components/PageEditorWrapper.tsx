'use client'

import { useState, useEffect } from 'react'
import { LayoutTemplate, Plus, Trash2, ArrowLeft, Share, Globe, Settings2, Sparkles } from 'lucide-react'
import PageRenderer from './PageRenderer'
import Link from 'next/link'

export default function PageEditorWrapper({ 
  document, 
  updateDocument, 
  session 
}: { 
  document: any, 
  updateDocument: (d: any) => void, 
  session: any 
}) {
  const [pages, setPages] = useState<any[]>([])
  const [activePageId, setActivePageId] = useState<string | null>(null)
  const [brandColor, setBrandColor] = useState('#4f46e5') // Default
  const [saving, setSaving] = useState(false)

  // Initialize from document content
  useEffect(() => {
    if (document.content?.pages) {
      setPages(document.content.pages)
      if (document.content.pages.length > 0 && !activePageId) {
        setActivePageId(document.content.pages[0].id)
      }
    }
  }, [document.content])

  // Save changes to DB
  useEffect(() => {
    // Basic debounce could be added here
    if (pages.length > 0 && document.content?.pages !== pages) {
      handleSave(pages)
    }
  }, [pages])

  const handleSave = async (newPages: any[]) => {
    setSaving(true)
    await updateDocument({ 
      content: { 
        ...document.content, 
        pages: newPages 
      } 
    })
    setSaving(false)
  }

  const activePage = pages.find(p => p.id === activePageId)
  
  const handleVariationChange = (pageId: string, variationIndex: number) => {
    const updatedPages = pages.map(p => {
      if (p.id === pageId) {
        return { ...p, activeVariationIndex: variationIndex }
      }
      return p
    })
    setPages(updatedPages)
  }

  const addPage = () => {
    const newPage = {
      id: \`page-\${Date.now()}\`,
      name: \`Nueva Página\`,
      activeVariationIndex: 0,
      variations: [
        {
          layoutType: 'content',
          data: { title: 'Nuevo Tema', content: 'Escribe aquí tu contenido...' }
        }
      ]
    }
    setPages([...pages, newPage])
    setActivePageId(newPage.id)
  }

  const deletePage = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if(pages.length <= 1) return alert("No puedes borrar la última página")
    if(!confirm("¿Borrar esta página?")) return

    const updated = pages.filter(p => p.id !== id)
    setPages(updated)
    if (activePageId === id) setActivePageId(updated[0].id)
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      
      {/* LEFT SIDEBAR: PÁGINAS */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col z-10 shadow-sm">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
           <Link href="/dashboard" className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
              <ArrowLeft className="w-4 h-4" />
           </Link>
           <span className="font-bold text-sm text-slate-700">Páginas</span>
           <div className="w-8"></div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {pages.map((page, index) => (
            <div 
              key={page.id}
              onClick={() => setActivePageId(page.id)}
              className={\`group relative p-3 rounded-xl cursor-pointer border-2 transition-all \${
                activePageId === page.id 
                  ? 'border-indigo-600 bg-indigo-50/50' 
                  : 'border-transparent hover:border-slate-200 hover:bg-slate-50'
              }\`}
            >
              <div className="text-xs font-bold text-slate-400 mb-2">{index + 1}. {page.name || 'Página'}</div>
              <div className="aspect-[16/9] bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden flex items-center justify-center relative">
                 <LayoutTemplate className="w-6 h-6 text-slate-200" />
                 {/* Delete button (hover) */}
                 <button 
                   onClick={(e) => deletePage(page.id, e)}
                   className="absolute top-1 right-1 p-1 bg-red-50 text-red-500 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                 >
                   <Trash2 className="w-3 h-3" />
                 </button>
              </div>
            </div>
          ))}
          
          <button onClick={addPage} className="w-full py-3 mt-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-bold text-sm flex items-center justify-center gap-2 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
            <Plus className="w-4 h-4" /> Agregar página
          </button>
        </div>
      </div>

      {/* MAIN CANVAS */}
      <div className="flex-1 flex flex-col h-screen relative">
        {/* HEADER */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-4">
             <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-xl leading-none">
               L
             </div>
             <div>
               <h1 className="font-black text-slate-900 text-lg leading-tight">{document.title}</h1>
               <p className="text-xs text-slate-400">{saving ? 'Guardando...' : 'Guardado'}</p>
             </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="flex -space-x-2 mr-4">
               {/* Avatars */}
               <div className="w-8 h-8 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-indigo-700 text-xs font-bold">Yo</div>
             </div>
             <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50">
               <Share className="w-4 h-4" /> Compartir
             </button>
             <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-indigo-700">
               <Globe className="w-4 h-4" /> Publicar
             </button>
          </div>
        </div>

        {/* WORKSPACE */}
        <div className="flex-1 bg-slate-100 p-8 flex items-center justify-center overflow-auto relative">
          
          {/* Slide Container (16:9 Aspect Ratio) */}
          <div className="w-full max-w-5xl aspect-[16/9] bg-white rounded-xl shadow-xl overflow-hidden relative ring-1 ring-slate-200">
             {activePage ? (
               <PageRenderer page={activePage} brandColor={brandColor} />
             ) : (
               <div className="w-full h-full flex items-center justify-center text-slate-400">Selecciona o crea una página</div>
             )}
          </div>

        </div>
      </div>

      {/* RIGHT SIDEBAR: PROPIEDADES & VARIACIONES */}
      <div className="w-80 bg-white border-l border-slate-200 flex flex-col z-10 shadow-[-4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="p-4 border-b border-slate-100 flex items-center gap-2">
           <Settings2 className="w-5 h-5 text-slate-400" />
           <span className="font-bold text-slate-700">Propiedades</span>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
           
           {/* Color Picker Temático */}
           <div>
             <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Color de Énfasis</label>
             <div className="flex flex-wrap gap-2">
                {['#4f46e5', '#ec4899', '#10b981', '#f59e0b', '#0f172a'].map(color => (
                  <button 
                    key={color}
                    onClick={() => setBrandColor(color)}
                    className={\`w-8 h-8 rounded-full \${brandColor === color ? 'ring-2 ring-offset-2 ring-slate-400' : ''}\`}
                    style={{ backgroundColor: color }}
                  />
                ))}
             </div>
           </div>

           {/* Variaciones de la IA */}
           {activePage && activePage.variations && activePage.variations.length > 1 && (
             <div>
               <div className="flex items-center gap-2 mb-3">
                 <Sparkles className="w-4 h-4 text-amber-500" />
                 <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Variaciones de Diseño (IA)</label>
               </div>
               
               <div className="space-y-3">
                 {activePage.variations.map((variation: any, idx: number) => (
                   <button
                     key={idx}
                     onClick={() => handleVariationChange(activePage.id, idx)}
                     className={\`w-full text-left p-3 rounded-xl border-2 transition-all flex items-center gap-3 \${
                       activePage.activeVariationIndex === idx 
                        ? 'border-indigo-600 bg-indigo-50/30' 
                        : 'border-slate-100 hover:border-slate-300'
                     }\`}
                   >
                     <div className={\`w-4 h-4 rounded-full border-2 flex items-center justify-center \${
                       activePage.activeVariationIndex === idx ? 'border-indigo-600' : 'border-slate-300'
                     }\`}>
                        {activePage.activeVariationIndex === idx && <div className="w-2 h-2 rounded-full bg-indigo-600" />}
                     </div>
                     <div>
                       <div className={\`text-sm font-bold \${activePage.activeVariationIndex === idx ? 'text-indigo-900' : 'text-slate-700'}\`}>
                         Opción {idx + 1}
                       </div>
                       <div className="text-xs text-slate-400 capitalize">Layout: {variation.layoutType}</div>
                     </div>
                   </button>
                 ))}
               </div>
             </div>
           )}

           {/* Editor de Datos (Básico para MVP) */}
           {activePage && (
             <div>
               <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Contenido del Layout</label>
               <p className="text-sm text-slate-500 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                 Aquí podrás editar los textos, métricas y gráficas específicas del layout seleccionado directamente sobre el lienzo.
               </p>
             </div>
           )}

        </div>
      </div>
      
    </div>
  )
}
