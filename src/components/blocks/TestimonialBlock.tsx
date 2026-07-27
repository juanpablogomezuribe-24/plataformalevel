'use client'

import { Quote } from 'lucide-react'

export default function TestimonialBlock({ data, onChange, readOnly = false }: { data: any, onChange?: (data: any) => void, readOnly?: boolean }) {
  return (
    <div className="w-full bg-gradient-to-br from-cyan-50 to-blue-50 rounded-3xl overflow-hidden border border-cyan-100 p-12 my-8 relative">
      <Quote className="absolute top-8 left-8 w-24 h-24 text-cyan-500 opacity-10" />
      
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <textarea
          readOnly={readOnly}
          value={data.quote || ''}
          onChange={(e) => onChange && onChange({ ...data, quote: e.target.value })}
          placeholder='"Escribe aquí una frase o testimonio impactante de tu cliente..."'
          className={`w-full text-2xl md:text-3xl font-medium text-slate-800 leading-tight bg-transparent outline-none resize-none min-h-[120px] text-center mb-6 transition-all rounded-xl placeholder:text-slate-400 ${readOnly ? '' : 'focus:bg-white/50 p-4'}`}
        />
        
        <div className="flex flex-col items-center justify-center">
          <input
            type="text"
            readOnly={readOnly}
            value={data.author || ''}
            onChange={(e) => onChange && onChange({ ...data, author: e.target.value })}
            placeholder="Nombre del Cliente"
            className={`w-full max-w-xs text-lg font-bold text-slate-900 bg-transparent outline-none text-center transition-all rounded-lg placeholder:text-slate-400 ${readOnly ? '' : 'focus:bg-white/50 p-1'}`}
          />
          <input
            type="text"
            readOnly={readOnly}
            value={data.role || ''}
            onChange={(e) => onChange && onChange({ ...data, role: e.target.value })}
            placeholder="Cargo / Empresa"
            className={`w-full max-w-xs text-sm font-medium text-slate-500 bg-transparent outline-none text-center transition-all rounded-lg placeholder:text-slate-300 mt-1 ${readOnly ? '' : 'focus:bg-white/50 p-1'}`}
          />
        </div>
      </div>
    </div>
  )
}
