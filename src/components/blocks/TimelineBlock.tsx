'use client'

import { Plus, Trash2 } from 'lucide-react'

export default function TimelineBlock({ data, onChange, readOnly = false }: { data: any, onChange?: (data: any) => void, readOnly?: boolean }) {
  const items = data.items || [
    { id: '1', date: 'Fase 1', title: 'Descubrimiento', description: 'Investigación y análisis inicial del proyecto.' },
    { id: '2', date: 'Fase 2', title: 'Desarrollo', description: 'Ejecución y construcción de la solución.' }
  ]

  const addItem = () => {
    if (readOnly || !onChange) return
    onChange({ ...data, items: [...items, { id: crypto.randomUUID(), date: 'Nueva Fase', title: 'Título', description: 'Descripción' }] })
  }

  const updateItem = (index: number, updates: any) => {
    if (readOnly || !onChange) return
    const newItems = [...items]
    newItems[index] = { ...newItems[index], ...updates }
    onChange({ ...data, items: newItems })
  }

  const removeItem = (index: number) => {
    if (readOnly || !onChange) return
    const newItems = items.filter((_: any, i: number) => i !== index)
    onChange({ ...data, items: newItems })
  }

  return (
    <div className="w-full bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm p-8 md:p-12 my-8 transition-all hover:shadow-md">
      <input
        type="text"
        readOnly={readOnly}
        value={data.title || ''}
        onChange={(e) => onChange && onChange({ ...data, title: e.target.value })}
        placeholder="Título del Cronograma"
        className={`w-full text-2xl font-black text-slate-900 bg-transparent outline-none mb-10 transition-all rounded-xl placeholder:text-slate-300 ${readOnly ? '' : 'focus:bg-slate-50 p-2'}`}
      />

      <div className="relative border-l-2 border-slate-200 ml-4 md:ml-6 space-y-12 pb-4">
        {items.map((item: any, index: number) => (
          <div key={item.id} className="relative pl-8 group/item">
            {/* Dot */}
            <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-cyan-500 ring-4 ring-white"></div>
            
            {!readOnly && items.length > 1 && (
              <button onClick={() => removeItem(index)} className="absolute right-0 top-0 text-slate-400 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity">
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <div className="flex flex-col gap-1">
              <input
                type="text"
                readOnly={readOnly}
                value={item.date}
                onChange={(e) => updateItem(index, { date: e.target.value })}
                placeholder="Tiempo (ej. Semana 1)"
                className={`text-xs font-bold text-cyan-600 uppercase tracking-widest bg-transparent outline-none w-fit transition-all rounded ${readOnly ? '' : 'focus:bg-slate-50 p-1 -ml-1'}`}
              />
              <input
                type="text"
                readOnly={readOnly}
                value={item.title}
                onChange={(e) => updateItem(index, { title: e.target.value })}
                placeholder="Nombre del hito"
                className={`text-xl font-bold text-slate-800 bg-transparent outline-none w-full transition-all rounded ${readOnly ? '' : 'focus:bg-slate-50 p-1 -ml-1'}`}
              />
              <textarea
                readOnly={readOnly}
                value={item.description}
                onChange={(e) => updateItem(index, { description: e.target.value })}
                placeholder="Describe qué sucederá en esta etapa..."
                className={`text-slate-500 text-sm mt-2 bg-transparent outline-none w-full resize-none min-h-[60px] transition-all rounded ${readOnly ? '' : 'focus:bg-slate-50 p-2 -ml-2'}`}
              />
            </div>
          </div>
        ))}
      </div>

      {!readOnly && (
        <button onClick={addItem} className="mt-8 ml-6 flex items-center text-sm font-bold text-slate-500 hover:text-cyan-600 transition-colors bg-slate-50 hover:bg-cyan-50 px-4 py-2 rounded-xl">
          <Plus className="w-4 h-4 mr-1" /> Añadir Hito
        </button>
      )}
    </div>
  )
}
