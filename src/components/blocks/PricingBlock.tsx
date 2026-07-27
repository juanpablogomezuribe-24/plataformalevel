'use client'

import { Plus, Trash2 } from 'lucide-react'

export default function PricingBlock({ data, onChange, readOnly = false }: { data: any, onChange?: (data: any) => void, readOnly?: boolean }) {
  const items = data.items || []

  const addItem = () => {
    if (readOnly || !onChange) return
    const newItem = { id: crypto.randomUUID(), name: '', quantity: 1, unitPrice: 0 }
    onChange({ ...data, items: [...items, newItem] })
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

  const subtotal = items.reduce((acc: number, item: any) => acc + (item.quantity * item.unitPrice), 0)
  const total = subtotal // Puedes agregar IVA aquí

  return (
    <div className="w-full bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm p-12 my-8 group relative transition-all hover:shadow-md">
      
      <div className="text-center mb-10">
        <input
          type="text"
          readOnly={readOnly}
          value={data.title || 'Cotización de Servicios'}
          onChange={(e) => onChange && onChange({ ...data, title: e.target.value })}
          className={`w-full text-3xl font-black text-slate-900 bg-transparent outline-none text-center transition-all rounded-xl ${readOnly ? '' : 'focus:bg-slate-50 p-2'}`}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-900 text-sm uppercase tracking-wider text-slate-900">
              <th className="py-4 font-black w-1/2">Concepto</th>
              <th className="py-4 font-black w-24 text-center">Cant.</th>
              <th className="py-4 font-black w-40 text-right">Valor Unitario</th>
              <th className="py-4 font-black w-40 text-right">Total</th>
              <th className="py-4 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item: any, index: number) => (
              <tr key={item.id} className="group/row hover:bg-slate-50 transition-colors">
                <td className="py-3">
                  <input 
                    type="text" 
                    readOnly={readOnly}
                    value={item.name} 
                    onChange={(e) => updateItem(index, { name: e.target.value })}
                    placeholder="Descripción del servicio..."
                    className={`w-full bg-transparent outline-none text-slate-700 font-medium p-1 ${readOnly ? '' : 'focus:border-b border-indigo-500'}`}
                  />
                </td>
                <td className="py-3">
                  <input 
                    type="number" 
                    readOnly={readOnly}
                    min="1"
                    value={item.quantity || ''} 
                    onChange={(e) => updateItem(index, { quantity: parseInt(e.target.value) || 0 })}
                    className={`w-full bg-transparent outline-none text-slate-700 text-center font-medium p-1 ${readOnly ? '' : 'focus:border-b border-indigo-500'}`}
                  />
                </td>
                <td className="py-3">
                  <div className="flex items-center justify-end">
                    <span className="text-slate-400 mr-1">$</span>
                    <input 
                      type="number" 
                      readOnly={readOnly}
                      value={item.unitPrice || ''} 
                      onChange={(e) => updateItem(index, { unitPrice: parseFloat(e.target.value) || 0 })}
                      className={`w-full max-w-[100px] bg-transparent outline-none text-slate-700 text-right font-medium p-1 ${readOnly ? '' : 'focus:border-b border-indigo-500'}`}
                    />
                  </div>
                </td>
                <td className="py-3 text-right font-bold text-slate-900">
                  ${(item.quantity * item.unitPrice).toLocaleString()}
                </td>
                <td className="py-3 text-right">
                  {!readOnly && (
                    <button onClick={() => removeItem(index)} className="text-red-400 hover:text-red-600 opacity-0 group-hover/row:opacity-100 transition-opacity p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!readOnly && (
        <button onClick={addItem} className="mt-4 flex items-center text-sm font-bold text-indigo-600 hover:text-indigo-700">
          <Plus className="w-4 h-4 mr-1" /> Añadir Concepto
        </button>
      )}

      <div className="mt-10 flex justify-end">
        <div className="w-64 bg-slate-900 text-white rounded-2xl p-6">
          <div className="flex justify-between items-center text-sm mb-2 text-slate-300">
            <span>Subtotal</span>
            <span>${subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-xl font-black pt-4 border-t border-slate-700">
            <span>Total</span>
            <span className="text-indigo-400">${total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
