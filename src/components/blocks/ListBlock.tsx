'use client'

import { Plus, Trash2, CheckCircle2, AlertCircle, Info, Star } from 'lucide-react'

export default function ListBlock({ data, onChange, readOnly = false }: { data: any, onChange?: (data: any) => void, readOnly?: boolean }) {
  const items = data.items || [
    { id: '1', text: 'Primer punto importante', icon: 'check' },
    { id: '2', text: 'Segundo punto a destacar', icon: 'check' }
  ]

  const addItem = () => {
    if (readOnly || !onChange) return
    onChange({ ...data, items: [...items, { id: crypto.randomUUID(), text: '', icon: 'check' }] })
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

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'check': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />
      case 'alert': return <AlertCircle className="w-5 h-5 text-amber-500" />
      case 'info': return <Info className="w-5 h-5 text-blue-500" />
      case 'star': return <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
      default: return <CheckCircle2 className="w-5 h-5 text-emerald-500" />
    }
  }

  return (
    <div className="w-full bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm p-8 md:p-12 my-8 transition-all hover:shadow-md">
      <input
        type="text"
        readOnly={readOnly}
        value={data.title || ''}
        onChange={(e) => onChange && onChange({ ...data, title: e.target.value })}
        placeholder="Título de la Lista (Opcional)"
        className={`w-full text-xl font-bold text-slate-900 bg-transparent outline-none mb-6 transition-all rounded-xl placeholder:text-slate-300 ${readOnly ? '' : 'focus:bg-slate-50 p-2'}`}
      />

      <div className="space-y-3">
        {items.map((item: any, index: number) => (
          <div key={item.id} className="flex items-start gap-3 group/item relative">
            
            {!readOnly ? (
              <select
                value={item.icon}
                onChange={(e) => updateItem(index, { icon: e.target.value })}
                className="mt-1 outline-none bg-slate-50 rounded cursor-pointer text-slate-500 border border-transparent hover:border-slate-200 p-1"
              >
                <option value="check">✅</option>
                <option value="alert">⚠️</option>
                <option value="info">ℹ️</option>
                <option value="star">⭐</option>
              </select>
            ) : (
              <div className="mt-1 flex-shrink-0">
                {renderIcon(item.icon)}
              </div>
            )}

            <textarea
              readOnly={readOnly}
              value={item.text}
              onChange={(e) => updateItem(index, { text: e.target.value })}
              placeholder="Escribe un punto importante aquí..."
              className={`w-full text-base text-slate-700 bg-transparent outline-none resize-none min-h-[40px] transition-all rounded pt-1 ${readOnly ? '' : 'focus:bg-slate-50 p-2 -ml-2'}`}
            />

            {!readOnly && items.length > 1 && (
              <button onClick={() => removeItem(index)} className="absolute right-0 top-1 text-slate-300 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {!readOnly && (
        <button onClick={addItem} className="mt-6 flex items-center text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors bg-slate-50 hover:bg-indigo-50 px-4 py-2 rounded-xl">
          <Plus className="w-4 h-4 mr-1" /> Añadir Ítem
        </button>
      )}
    </div>
  )
}
