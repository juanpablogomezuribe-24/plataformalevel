'use client'

import { Plus, Trash2 } from 'lucide-react'

export default function StatsBlock({ data, onChange, readOnly = false }: { data: any, onChange?: (data: any) => void, readOnly?: boolean }) {
  const stats = data.stats || [{ id: '1', value: '100%', label: 'Crecimiento' }]

  const addStat = () => {
    if (readOnly || !onChange) return
    if (stats.length >= 4) return // Max 4 stats
    onChange({ ...data, stats: [...stats, { id: crypto.randomUUID(), value: '', label: '' }] })
  }

  const updateStat = (index: number, updates: any) => {
    if (readOnly || !onChange) return
    const newStats = [...stats]
    newStats[index] = { ...newStats[index], ...updates }
    onChange({ ...data, stats: newStats })
  }

  const removeStat = (index: number) => {
    if (readOnly || !onChange) return
    const newStats = stats.filter((_: any, i: number) => i !== index)
    onChange({ ...data, stats: newStats })
  }

  return (
    <div className="w-full bg-slate-900 rounded-3xl overflow-hidden shadow-xl p-12 my-8 relative group">
      
      <input
        type="text"
        readOnly={readOnly}
        value={data.title || ''}
        onChange={(e) => onChange && onChange({ ...data, title: e.target.value })}
        placeholder="Título de Métricas (ej. Resultados de Campaña)"
        className={`w-full text-2xl font-bold text-slate-400 bg-transparent outline-none text-center mb-10 transition-all rounded-xl placeholder:text-slate-600 ${readOnly ? '' : 'focus:bg-slate-800 p-2'}`}
      />

      <div className="flex flex-wrap justify-center gap-6">
        {stats.map((stat: any, index: number) => (
          <div key={stat.id} className="flex-1 min-w-[200px] max-w-[280px] bg-slate-800 rounded-2xl p-8 text-center relative group/stat border border-slate-700">
            {!readOnly && stats.length > 1 && (
              <button onClick={() => removeStat(index)} className="absolute top-2 right-2 text-slate-500 hover:text-red-400 opacity-0 group-hover/stat:opacity-100 transition-opacity">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <input
              type="text"
              readOnly={readOnly}
              value={stat.value}
              onChange={(e) => updateStat(index, { value: e.target.value })}
              placeholder="+000"
              className={`w-full text-5xl md:text-6xl font-black text-white bg-transparent outline-none text-center mb-2 transition-all rounded-xl ${readOnly ? '' : 'focus:bg-slate-700 p-1'}`}
            />
            <input
              type="text"
              readOnly={readOnly}
              value={stat.label}
              onChange={(e) => updateStat(index, { label: e.target.value })}
              placeholder="Descripción de la métrica"
              className={`w-full text-sm font-bold text-indigo-400 uppercase tracking-widest bg-transparent outline-none text-center transition-all rounded-xl ${readOnly ? '' : 'focus:bg-slate-700 p-1'}`}
            />
          </div>
        ))}
      </div>

      {!readOnly && stats.length < 4 && (
        <div className="flex justify-center mt-8">
          <button onClick={addStat} className="flex items-center text-sm font-bold text-slate-400 hover:text-white transition-colors bg-slate-800 px-4 py-2 rounded-full">
            <Plus className="w-4 h-4 mr-1" /> Añadir Métrica
          </button>
        </div>
      )}
    </div>
  )
}
