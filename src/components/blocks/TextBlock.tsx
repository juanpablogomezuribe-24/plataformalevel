'use client'

export default function TextBlock({ data, onChange, readOnly = false }: { data: any, onChange?: (data: any) => void, readOnly?: boolean }) {
  return (
    <div className="w-full bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm p-12 my-8 transition-all hover:shadow-md">
      <input
        type="text"
        readOnly={readOnly}
        value={data.title || ''}
        onChange={(e) => onChange && onChange({ ...data, title: e.target.value })}
        placeholder="Título de la Sección"
        className={`w-full text-3xl font-black text-slate-900 bg-transparent outline-none mb-6 transition-all rounded-xl placeholder:text-slate-300 ${readOnly ? '' : 'focus:bg-slate-50 p-2'}`}
      />
      <textarea
        readOnly={readOnly}
        value={data.content || ''}
        onChange={(e) => onChange && onChange({ ...data, content: e.target.value })}
        placeholder="Escribe el contenido de esta sección. Puedes usar varios párrafos..."
        className={`w-full text-lg text-slate-600 leading-relaxed bg-transparent outline-none resize-none min-h-[200px] transition-all rounded-xl placeholder:text-slate-300 ${readOnly ? '' : 'focus:bg-slate-50 p-2'}`}
      />
    </div>
  )
}
