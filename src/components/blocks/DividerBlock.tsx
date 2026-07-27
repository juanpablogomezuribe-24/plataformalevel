'use client'

export default function DividerBlock({ data, onChange, readOnly = false }: { data: any, onChange?: (data: any) => void, readOnly?: boolean }) {
  return (
    <div className="w-full py-12 flex items-center justify-center relative group">
      <div className="w-1/3 h-px bg-slate-200"></div>
      <div className="w-2 h-2 rounded-full bg-slate-300 mx-4"></div>
      <div className="w-1/3 h-px bg-slate-200"></div>
      
      {!readOnly && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-1 rounded border border-slate-100 shadow-sm">Divisor</span>
        </div>
      )}
    </div>
  )
}
