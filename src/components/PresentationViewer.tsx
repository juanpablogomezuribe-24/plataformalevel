import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, PieChart, Edit3, X, Save, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageRenderer from './PageRenderer';

export default function PresentationViewer({ 
  document, 
  updateDocument, 
  session 
}: { 
  document: any, 
  updateDocument: (d: any) => void, 
  session: any 
}) {
  const [pages, setPages] = useState<any[]>([]);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (document?.content?.pages) {
      setPages(document.content.pages);
    }
  }, [document?.id]);

  const activePage = pages[activePageIndex];
  const progress = pages.length > 0 ? ((activePageIndex + 1) / pages.length) * 100 : 0;

  const nextSlide = () => {
    if (activePageIndex < pages.length - 1) setActivePageIndex(activePageIndex + 1);
  };

  const prevSlide = () => {
    if (activePageIndex > 0) setActivePageIndex(activePageIndex - 1);
  };

  const handleSaveData = (key: string, value: any) => {
    const newPages = JSON.parse(JSON.stringify(pages));
    newPages[activePageIndex].variations[newPages[activePageIndex].activeVariationIndex || 0].data[key] = value;
    setPages(newPages);
    updateDocument({ content: { ...document.content, pages: newPages } });
  };

  if (!activePage) return null;

  return (
    <div className="h-screen w-full flex bg-slate-50 text-slate-900 selection:bg-cyan-200 selection:text-cyan-900 overflow-hidden font-sans">
      
      {/* Sidebar Navegación */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shadow-lg z-20 shrink-0">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-cyan-500/30 shrink-0">
            <PieChart className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-black uppercase tracking-tight text-slate-800 leading-tight truncate w-48">{document.title || 'Presentación'}</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mt-1">LotBet x Level</p>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {pages.map((page, idx) => (
            <button
              key={page.id}
              onClick={() => setActivePageIndex(idx)}
              className={`w-full text-left flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activePageIndex === idx 
                  ? 'bg-sky-100 text-sky-700 border-r-4 border-sky-600 font-bold shadow-inner' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className={`w-6 text-xs font-black ${activePageIndex === idx ? 'text-sky-500' : 'text-slate-400'}`}>
                {idx + 1}
              </span>
              <span className="truncate flex-1">
                {page.variations[page.activeVariationIndex || 0]?.data?.title || `Diapositiva ${idx + 1}`}
              </span>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs font-bold text-slate-500">{activePageIndex + 1} / {pages.length}</p>
            <p className="text-[9px] uppercase font-bold text-slate-400">Progreso</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-slate-100/50">
        
        {/* Editor Toggle */}
        <div className="absolute top-6 right-8 flex items-center gap-3 z-30">
          <button 
            onClick={() => setIsEditMode(!isEditMode)}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-full border shadow-sm transition-colors ${
              isEditMode 
                ? 'bg-indigo-600 text-white border-indigo-500 hover:bg-indigo-700 shadow-indigo-500/30' 
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {isEditMode ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
            {isEditMode ? 'Terminar Edición' : 'Editar Datos'}
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Slide Viewer */}
          <div className={`flex-1 transition-all duration-500 ${isEditMode ? 'pr-96' : ''}`}>
             <PageRenderer page={activePage} isDark={true} />
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className={`h-20 bg-white border-t border-slate-200 flex items-center justify-between px-8 z-20 shrink-0 transition-all duration-500 ${isEditMode ? 'pr-96' : ''}`}>
          <button 
            onClick={prevSlide}
            disabled={activePageIndex === 0}
            className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-wider text-sm hover:text-cyan-500 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" /> Anterior
          </button>
          <span className="text-xs font-black tracking-widest uppercase text-slate-300">
            {document.title}
          </span>
          <button 
            onClick={nextSlide}
            disabled={activePageIndex === pages.length - 1}
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2.5 rounded-full font-bold shadow-md shadow-cyan-500/20 disabled:opacity-50 transition-all"
          >
            Siguiente <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Floating Edit Panel Overlay */}
        <AnimatePresence>
          {isEditMode && (
            <motion.div 
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className="absolute right-0 top-0 bottom-0 w-96 bg-white border-l border-slate-200 shadow-2xl z-40 flex flex-col"
            >
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-black text-slate-800 uppercase tracking-tight text-sm">Editar Diapositiva</h3>
                <button onClick={() => setIsEditMode(false)} className="text-slate-400 hover:text-red-500"><X className="w-5 h-5"/></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {Object.keys(activePage.variations[activePage.activeVariationIndex || 0].data).map(key => {
                  const val = activePage.variations[activePage.activeVariationIndex || 0].data[key];
                  if (Array.isArray(val)) {
                    return (
                      <div key={key} className="space-y-4">
                        <label className="text-[10px] font-black uppercase text-indigo-500 tracking-widest">{key}</label>
                        {val.map((item, i) => (
                          <div key={i} className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-2 relative">
                            {Object.keys(item).map(k => (
                              <div key={k}>
                                <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">{k}</label>
                                <input
                                  type="text"
                                  value={item[k] || ''}
                                  onChange={(e) => {
                                    const newArr = [...val];
                                    newArr[i] = { ...newArr[i], [k]: e.target.value };
                                    handleSaveData(key, newArr);
                                  }}
                                  className="w-full bg-white border border-slate-200 rounded-md p-2 text-sm text-slate-700"
                                />
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )
                  }
                  return (
                    <div key={key}>
                      <label className="text-[10px] font-black uppercase text-indigo-500 tracking-widest block mb-2">{key}</label>
                      <textarea
                        value={val || ''}
                        onChange={(e) => handleSaveData(key, e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-700 min-h-[80px]"
                      />
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
