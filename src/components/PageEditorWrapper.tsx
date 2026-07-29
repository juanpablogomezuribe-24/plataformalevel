'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, ArrowLeft, Share, Globe, Settings2, LayoutTemplate, Sparkles, LayoutGrid, Bot, Loader2 } from 'lucide-react'
import PageRenderer from './PageRenderer'
import Link from 'next/link'

const AVAILABLE_LAYOUTS = [
  { id: 'level-cover', name: 'Portada Premium' },
  { id: 'level-objective', name: 'Objetivos Estratégicos' },
  { id: 'level-methodology', name: 'Metodología y Fases' },
  { id: 'level-catalog', name: 'Catálogo / Perfiles' },
  { id: 'level-timeline', name: 'Línea de Tiempo' }
];

const getDefaultDataForLayout = (layoutId: string, currentData: any = {}) => {
  const base = { title: currentData.title || '' };
  
  if (layoutId === 'level-cover') return { ...base, subtitle: currentData.subtitle || '', description: currentData.description || '' };
  if (layoutId === 'level-objective') return { ...base, mainObjective: currentData.mainObjective || 'Nuestro objetivo principal', goals: [{ title: 'Sub-objetivo 1', description: 'Descripción' }] };
  if (layoutId === 'level-methodology') return { ...base, phases: [{ title: 'Fase 1', description: 'Descripción de la fase' }] };
  if (layoutId === 'level-catalog') return { ...base, items: [{ name: 'Elemento 1', role: 'Rol o Categoría', description: 'Descripción detallada' }] };
  if (layoutId === 'level-timeline') return { ...base, milestones: [{ name: 'Hito 1', date: 'Fecha', description: 'Detalle del hito' }] };
  
  return { ...base, content: currentData.content || '' };
};

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
  const [isGeneratingSlide, setIsGeneratingSlide] = useState(false)
  const [brandColor, setBrandColor] = useState('#4f46e5') // Default
  const [saving, setSaving] = useState(false)

  // Initialize from document content ONLY ONCE when document is loaded
  useEffect(() => {
    if (pages.length === 0 && document?.content?.pages) {
      const validPages = Array.isArray(document.content.pages) ? document.content.pages.filter(Boolean) : [];
      setPages(validPages)
      if (validPages.length > 0 && !activePageId) {
        setActivePageId(validPages[0]?.id)
      }
    }
  }, [document?.id])

  // Removed useEffect on [pages] because it caused an infinite loop and focus loss on keystrokes.
  // Saving is now handled manually via onBlur on text inputs and explicit actions (IA button, variation change, etc).

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

  const activePage = pages.find(p => p?.id === activePageId)
  
  const handleVariationChange = (pageId: string, variationIndex: number) => {
    const updatedPages = pages.map(p => {
      if (p?.id === pageId) {
        return { ...p, activeVariationIndex: variationIndex }
      }
      return p
    })
    setPages(updatedPages)
  }

  const generateSlideContent = async () => {
    if (!activePage) return;
    const currentVariation = activePage.variations[activePage.activeVariationIndex || 0];
    
    setIsGeneratingSlide(true);
    try {
      const response = await fetch('/api/generate-slide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: document.content?.prompt || '',
          clientName: document.client_name,
          template: document.content?.template || 'genérica',
          layoutType: currentVariation.layoutType,
          slideName: activePage.name,
          intent: currentVariation.data?.content || ''
        })
      });

      if (!response.ok) throw new Error("Error en el servidor al generar");
      
      const { data } = await response.json();
      
      if (data) {
        const newPages = JSON.parse(JSON.stringify(pages));
        const pageIndex = newPages.findIndex((p: any) => p?.id === activePage.id);
        if (pageIndex > -1) {
           newPages[pageIndex].variations[activePage.activeVariationIndex || 0].data = data;
           setPages(newPages);
           updateDocument({ content: { ...document.content, pages: newPages } });
        }
      }
    } catch (error: any) {
      alert("Error generando diapositiva: " + error.message);
    } finally {
      setIsGeneratingSlide(false);
    }
  }

  const addPage = () => {
    const newPage = {
      id: `page-${Date.now()}`,
      name: `Nueva Página`,
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
          {(Array.isArray(pages) ? pages : []).filter(Boolean).map((page, index) => (
            <div 
              key={page?.id || index}
              onClick={() => setActivePageId(page?.id)}
              className={`group relative p-3 rounded-xl cursor-pointer border-2 transition-all ${
                activePageId === page?.id 
                  ? 'border-indigo-600 bg-indigo-50/50' 
                  : 'border-transparent hover:border-slate-200 hover:bg-slate-50'
              }`}
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
               <PageRenderer page={activePage} brandColor={brandColor} template={document.content?.template} />
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
                    className={`w-8 h-8 rounded-full ${brandColor === color ? 'ring-2 ring-offset-2 ring-slate-400' : ''}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
             </div>
           </div>

           {/* Selector de Diseño (Layout Picker) */}
           {activePage && activePage.variations && activePage.variations[activePage.activeVariationIndex || 0] && (
             <div className="mb-8">
               <div className="flex items-center gap-2 mb-3">
                 <LayoutGrid className="w-4 h-4 text-indigo-500" />
                 <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Diseño de la Diapositiva</label>
               </div>
               <select
                 value={activePage.variations[activePage.activeVariationIndex || 0].layoutType}
                 onChange={(e) => {
                   const newLayoutType = e.target.value;
                   const newPages = JSON.parse(JSON.stringify(pages));
                   const pageIndex = newPages.findIndex((p: any) => p?.id === activePage?.id);
                   if (pageIndex === -1) return;
                   const currentVariation = newPages[pageIndex].variations[activePage.activeVariationIndex || 0];
                   
                   currentVariation.layoutType = newLayoutType;
                   // Reset data so the fields update based on the new layout
                   currentVariation.data = getDefaultDataForLayout(newLayoutType, currentVariation.data);
                   
                   setPages(newPages);
                   updateDocument({ content: { ...document.content, pages: newPages } });
                 }}
                 className="w-full bg-white border-2 border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer shadow-sm hover:border-indigo-300 transition-colors"
               >
                 {AVAILABLE_LAYOUTS.map(layout => (
                   <option key={layout.id} value={layout.id}>{layout.name}</option>
                 ))}
               </select>
             </div>
           )}

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
                     className={`w-full text-left p-3 rounded-xl border-2 transition-all flex items-center gap-3 ${
                       (activePage.activeVariationIndex || 0) === idx 
                        ? 'border-indigo-600 bg-indigo-50/30' 
                        : 'border-slate-100 hover:border-slate-300'
                     }`}
                   >
                     <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                       (activePage.activeVariationIndex || 0) === idx ? 'border-indigo-600' : 'border-slate-300'
                     }`}>
                        {(activePage.activeVariationIndex || 0) === idx && <div className="w-2 h-2 rounded-full bg-indigo-600" />}
                     </div>
                     <div>
                       <div className={`text-sm font-bold ${(activePage.activeVariationIndex || 0) === idx ? 'text-indigo-900' : 'text-slate-700'}`}>
                         Opción {idx + 1}
                       </div>
                       <div className="text-xs text-slate-400 capitalize">Layout: {variation.layoutType}</div>
                     </div>
                   </button>
                 ))}
               </div>
             </div>
           )}

           {/* Editor de Datos */}
           {activePage && activePage.variations && activePage.variations[activePage.activeVariationIndex || 0] && (
             <div>
               <div className="flex items-center justify-between mb-3">
                 <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contenido de la Página</label>
                 <button 
                   onClick={generateSlideContent}
                   disabled={isGeneratingSlide}
                   className="text-xs flex items-center gap-1.5 bg-gradient-to-r from-indigo-500 to-cyan-400 text-white font-bold px-3 py-1.5 rounded-full hover:shadow-lg hover:shadow-indigo-500/25 transition-all disabled:opacity-50"
                 >
                   {isGeneratingSlide ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Bot className="w-3.5 h-3.5" />}
                   {isGeneratingSlide ? "Generando..." : "✨ IA"}
                 </button>
               </div>
               <p className="text-xs text-slate-500 mb-4 bg-indigo-50 text-indigo-700 p-3 rounded-lg border border-indigo-100 font-medium">
                 Escribe en los siguientes campos para actualizar la diapositiva en tiempo real. (La edición directa sobre el lienzo estará disponible en futuras versiones).
               </p>
               <div className="space-y-4">
                 {Object.keys(activePage.variations[activePage.activeVariationIndex || 0].data || {}).map((key) => {
                    const arrayData = activePage.variations[activePage.activeVariationIndex || 0].data[key];
                    if (Array.isArray(arrayData)) {
                      return (
                        <div key={key} className="mt-6 border-t border-slate-200 pt-4">
                          <label className="text-xs font-bold text-slate-500 block mb-3 uppercase tracking-wider">{key} (Lista)</label>
                          <div className="space-y-4">
                            {arrayData.map((item: any, i: number) => (
                              <div key={i} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm space-y-3 relative group">
                                <button 
                                  onClick={() => {
                                    const newPages = JSON.parse(JSON.stringify(pages));
                                    const pageIndex = newPages.findIndex((p: any) => p?.id === activePage?.id);
                                    if (pageIndex === -1) return;
                                    newPages[pageIndex].variations[activePage.activeVariationIndex || 0].data[key].splice(i, 1);
                                    setPages(newPages);
                                    updateDocument({ content: { ...document.content, pages: newPages } });
                                  }}
                                  className="absolute -top-2 -right-2 bg-red-100 text-red-500 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-500 hover:text-white z-10"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                                
                                {item && typeof item === 'object' ? (
                                  Object.keys(item).map(itemKey => (
                                   <div key={itemKey}>
                                      <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">{itemKey}</label>
                                      <input
                                        type="text"
                                        value={item[itemKey] || ''}
                                        onChange={(e) => {
                                          const newPages = JSON.parse(JSON.stringify(pages));
                                          const pageIndex = newPages.findIndex((p: any) => p?.id === activePage?.id);
                                          if (pageIndex === -1) return;
                                          newPages[pageIndex].variations[activePage.activeVariationIndex || 0].data[key][i][itemKey] = e.target.value;
                                          setPages(newPages);
                                        }}
                                        onBlur={() => {
                                          updateDocument({ content: { ...document.content, pages } });
                                        }}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-md p-1.5 text-xs text-slate-700 focus:outline-none focus:border-indigo-500"
                                      />
                                   </div>
                                 ))
                                ) : (
                                  <div>
                                    <input
                                      type="text"
                                      value={item || ''}
                                      onChange={(e) => {
                                        const newPages = JSON.parse(JSON.stringify(pages));
                                        const pageIndex = newPages.findIndex((p: any) => p?.id === activePage?.id);
                                        if (pageIndex === -1) return;
                                        newPages[pageIndex].variations[activePage.activeVariationIndex || 0].data[key][i] = e.target.value;
                                        setPages(newPages);
                                      }}
                                      onBlur={() => {
                                        updateDocument({ content: { ...document.content, pages } });
                                      }}
                                      className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-sm text-slate-700 focus:outline-none focus:border-indigo-500"
                                    />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                          <button
                            onClick={() => {
                              const newPages = JSON.parse(JSON.stringify(pages));
                              const pageIndex = newPages.findIndex((p: any) => p?.id === activePage?.id);
                              if (pageIndex === -1) return;
                              const arr = newPages[pageIndex].variations[activePage.activeVariationIndex || 0].data[key];
                              if (arr.length > 0 && typeof arr[0] === 'object' && arr[0] !== null) {
                                const templateItem = { ...arr[0] };
                                Object.keys(templateItem).forEach(k => templateItem[k] = '');
                                arr.push(templateItem);
                              } else if (arr.length > 0) {
                                arr.push('Nuevo elemento');
                              } else {
                                arr.push('');
                              }
                              setPages(newPages);
                              updateDocument({ content: { ...document.content, pages: newPages } });
                            }}
                            className="mt-4 w-full py-2 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 font-bold text-xs flex items-center justify-center gap-2 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                          >
                            <Plus className="w-3 h-3" /> Agregar a {key}
                          </button>
                        </div>
                      )
                    }
                   return (
                     <div key={key}>
                       <label className="text-xs font-bold text-slate-400 block mb-2 uppercase tracking-wider">{key}</label>
                       {typeof activePage.variations[activePage.activeVariationIndex || 0].data[key] === 'string' && activePage.variations[activePage.activeVariationIndex || 0].data[key].length > 50 ? (
                         <textarea
                           value={activePage.variations[activePage.activeVariationIndex || 0].data[key] || ''}
                           onChange={(e) => {
                             const newPages = JSON.parse(JSON.stringify(pages));
                             const pageIndex = newPages.findIndex((p: any) => p?.id === activePage?.id);
                             if (pageIndex === -1) return;
                             newPages[pageIndex].variations[activePage.activeVariationIndex || 0].data[key] = e.target.value;
                             setPages(newPages);
                           }}
                           onBlur={() => {
                             updateDocument({ content: { ...document.content, pages } });
                           }}
                           className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-700 min-h-[120px] focus:outline-none focus:border-indigo-500 transition-colors"
                         />
                       ) : (
                         <input
                           type="text"
                           value={activePage.variations[activePage.activeVariationIndex || 0].data[key] || ''}
                           onChange={(e) => {
                             const newPages = JSON.parse(JSON.stringify(pages));
                             const pageIndex = newPages.findIndex((p: any) => p?.id === activePage?.id);
                             if (pageIndex === -1) return;
                             newPages[pageIndex].variations[activePage.activeVariationIndex || 0].data[key] = e.target.value;
                             setPages(newPages);
                           }}
                           onBlur={() => {
                             updateDocument({ content: { ...document.content, pages } });
                           }}
                           className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
                         />
                       )}
                     </div>
                   )
                 })}
               </div>
             </div>
           )}

        </div>
      </div>
      
    </div>
  )
}
