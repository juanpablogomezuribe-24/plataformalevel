'use client'

import { Image as ImageIcon } from 'lucide-react'

export default function ImageBlock({ data, onChange, readOnly = false }: { data: any, onChange?: (data: any) => void, readOnly?: boolean }) {
  return (
    <div className="w-full bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm p-4 my-8 group relative transition-all hover:shadow-md">
      
      <div className="w-full h-[400px] bg-slate-100 rounded-2xl relative overflow-hidden flex items-center justify-center border-2 border-dashed border-slate-200">
        {data.imageUrl ? (
          <img src={data.imageUrl} alt="Contenido visual" className="w-full h-full object-cover" />
        ) : (
          <div className="text-slate-400 flex flex-col items-center">
            <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
            <span className="font-bold text-sm">Espacio para Imagen</span>
          </div>
        )}

        {!readOnly && (
          <button className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-slate-700 border border-slate-200 px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-white">
            <ImageIcon className="w-4 h-4" /> Cambiar Imagen
          </button>
        )}
      </div>

      <div className="px-8 py-6 text-center">
        <input
          type="text"
          readOnly={readOnly}
          value={data.caption || ''}
          onChange={(e) => onChange && onChange({ ...data, caption: e.target.value })}
          placeholder="Escribe un pie de foto o descripción corta de la imagen..."
          className={`w-full max-w-xl text-sm font-medium text-slate-500 bg-transparent outline-none text-center transition-all rounded-xl placeholder:text-slate-300 ${readOnly ? '' : 'focus:bg-slate-50 p-2'}`}
        />
      </div>

    </div>
  )
}
