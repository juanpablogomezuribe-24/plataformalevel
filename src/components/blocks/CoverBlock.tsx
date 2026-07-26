'use client'

import { useState } from 'react'
import { Image as ImageIcon } from 'lucide-react'

export default function CoverBlock({ data, onChange, readOnly = false }: { data: any, onChange?: (data: any) => void, readOnly?: boolean }) {
  return (
    <div className="relative w-full h-[600px] bg-slate-900 rounded-3xl overflow-hidden group">
      {/* Imagen de fondo (placeholder o la real) */}
      {data.backgroundImage ? (
        <img 
          src={data.backgroundImage} 
          alt="Cover Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950 opacity-80" />
      )}
      
      {/* Contenido Editable / Lectura */}
      <div className="absolute inset-0 flex flex-col justify-end p-12">
        <div className="max-w-2xl">
          <input
            type="text"
            readOnly={readOnly}
            value={data.title || ''}
            onChange={(e) => onChange && onChange({ ...data, title: e.target.value })}
            placeholder="Escribe el Título Principal"
            className={`w-full text-5xl md:text-7xl font-black text-white bg-transparent outline-none placeholder:text-white/30 mb-4 transition-all rounded-xl ${readOnly ? '' : 'focus:bg-white/10 p-2'}`}
          />
          <textarea
            readOnly={readOnly}
            value={data.subtitle || ''}
            onChange={(e) => onChange && onChange({ ...data, subtitle: e.target.value })}
            placeholder="Escribe el subtítulo o descripción corta aquí..."
            className={`w-full text-xl text-cyan-400 bg-transparent outline-none placeholder:text-cyan-400/50 resize-none h-24 transition-all font-medium rounded-xl ${readOnly ? '' : 'focus:bg-white/10 p-2'}`}
          />
        </div>
      </div>

      {/* Botón Flotante para cambiar imagen */}
      {!readOnly && (
        <button className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
          <ImageIcon className="w-4 h-4" /> Cambiar Fondo
        </button>
      )}
    </div>
  )
}
