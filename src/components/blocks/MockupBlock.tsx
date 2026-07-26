'use client'

import { Smartphone } from 'lucide-react'

export default function MockupBlock({ data, onChange, readOnly = false }: { data: any, onChange?: (data: any) => void, readOnly?: boolean }) {
  return (
    <div className="w-full bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm p-12 my-8 group relative transition-all hover:shadow-md">
      
      {/* Controles del Bloque (visibles en hover) */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
         <div className="bg-slate-100 text-slate-500 text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-widest">
           Mockup Móvil
         </div>
      </div>

      <div className="text-center mb-12">
        <input
          type="text"
          readOnly={readOnly}
          value={data.title || ''}
          onChange={(e) => onChange && onChange({ ...data, title: e.target.value })}
          placeholder="Título de la Sección (ej. App Móvil)"
          className={`w-full text-3xl font-black text-slate-900 bg-transparent outline-none text-center placeholder:text-slate-300 transition-all rounded-xl ${readOnly ? '' : 'focus:bg-slate-50 p-2'}`}
        />
        <input
          type="text"
          readOnly={readOnly}
          value={data.description || ''}
          onChange={(e) => onChange && onChange({ ...data, description: e.target.value })}
          placeholder="Describe la funcionalidad mostrada en los mockups..."
          className={`w-full text-base text-slate-500 bg-transparent outline-none text-center mt-2 placeholder:text-slate-300 transition-all rounded-xl ${readOnly ? '' : 'focus:bg-slate-50 p-2'}`}
        />
      </div>

      <div className="flex flex-col md:flex-row justify-center items-center gap-12">
        {/* Mockup 1 */}
        <div className={`relative w-[280px] h-[580px] bg-slate-900 rounded-[3rem] border-[8px] border-slate-900 shadow-2xl overflow-hidden group/mockup ${readOnly ? '' : 'cursor-pointer'}`}>
          <div className={`absolute inset-0 flex flex-col items-center justify-center text-slate-400 transition-colors ${readOnly ? 'bg-slate-50' : 'bg-slate-100 hover:bg-slate-200'}`}>
            {!readOnly && (
              <>
                <Smartphone className="w-12 h-12 mb-2 opacity-50" />
                <span className="font-bold text-sm">Añadir Pantalla 1</span>
              </>
            )}
          </div>
        </div>

        {/* Mockup 2 */}
        <div className={`relative w-[280px] h-[580px] bg-slate-900 rounded-[3rem] border-[8px] border-slate-900 shadow-2xl overflow-hidden group/mockup mt-12 md:mt-0 ${readOnly ? '' : 'cursor-pointer'}`}>
          <div className={`absolute inset-0 flex flex-col items-center justify-center text-slate-400 transition-colors ${readOnly ? 'bg-slate-50' : 'bg-slate-100 hover:bg-slate-200'}`}>
            {!readOnly && (
              <>
                <Smartphone className="w-12 h-12 mb-2 opacity-50" />
                <span className="font-bold text-sm">Añadir Pantalla 2</span>
              </>
            )}
          </div>
        </div>
      </div>

    </div>
  )
}
