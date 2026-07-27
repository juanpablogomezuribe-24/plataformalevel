'use client'

import { AlertTriangle, Info, ShieldAlert } from 'lucide-react'

export default function AlertBlock({ data, onChange, readOnly = false }: { data: any, onChange?: (data: any) => void, readOnly?: boolean }) {
  
  const styles = {
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-900',
      icon: <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0" />
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-900',
      icon: <Info className="w-6 h-6 text-blue-500 flex-shrink-0" />
    },
    critical: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-900',
      icon: <ShieldAlert className="w-6 h-6 text-red-500 flex-shrink-0" />
    }
  }

  const currentStyle = (styles as any)[data.style || 'warning']

  return (
    <div className={`w-full rounded-2xl border p-6 my-8 flex items-start gap-4 transition-all ${currentStyle.bg} ${currentStyle.border}`}>
      
      {currentStyle.icon}

      <div className="flex-1 w-full">
        {!readOnly && (
          <div className="mb-3">
            <select
              value={data.style || 'warning'}
              onChange={(e) => onChange && onChange({ ...data, style: e.target.value })}
              className="text-xs font-bold bg-white/50 border border-white/50 rounded p-1 outline-none cursor-pointer"
            >
              <option value="warning">Advertencia (Amarillo)</option>
              <option value="info">Información (Azul)</option>
              <option value="critical">Crítico (Rojo)</option>
            </select>
          </div>
        )}

        <input
          type="text"
          readOnly={readOnly}
          value={data.title || ''}
          onChange={(e) => onChange && onChange({ ...data, title: e.target.value })}
          placeholder="Título de la Alerta"
          className={`w-full text-lg font-bold bg-transparent outline-none mb-1 transition-all rounded placeholder:opacity-50 ${currentStyle.text} ${readOnly ? '' : 'focus:bg-white/50 p-1 -ml-1'}`}
        />
        
        <textarea
          readOnly={readOnly}
          value={data.content || ''}
          onChange={(e) => onChange && onChange({ ...data, content: e.target.value })}
          placeholder="Escribe el contenido detallado de esta nota o advertencia importante para el cliente..."
          className={`w-full text-sm bg-transparent outline-none resize-none min-h-[60px] transition-all rounded placeholder:opacity-50 ${currentStyle.text} opacity-90 ${readOnly ? '' : 'focus:bg-white/50 p-1 -ml-1 mt-1'}`}
        />
      </div>
    </div>
  )
}
