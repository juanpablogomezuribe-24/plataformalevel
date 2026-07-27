'use client'

import { useState } from 'react'
import { CheckCircle2, ArrowLeft, Palette } from 'lucide-react'
import { useRouter } from 'next/navigation'

import CotizacionBalones from '@/components/templates/CotizacionBalones'
import PropuestaEvolution from '@/components/templates/PropuestaEvolution'
import InformeLotbet from '@/components/templates/InformeLotbet'
import InformeMundial from '@/components/templates/InformeMundial'

export default function TemplateEditorWrapper({ document, updateDocument, session }: { document: any, updateDocument: (data: any) => void, session?: any }) {
  const router = useRouter()
  const [showSettings, setShowSettings] = useState(false)
  const [copied, setCopied] = useState(false)
  const isReadOnly = document.status === 'en_revision' || document.status === 'publicado' || document.status === 'aprobado' || document.status === 'enviado';

  const template = document.content?.template;
  const data = document.content?.data || {};
  const brand = document.content?.brand || {};

  return (
    <div className="flex flex-col min-h-screen bg-slate-100">
      
      {/* Editor Topbar */}
      <div className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/dashboard')} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <input 
              type="text" 
              value={document.title} 
              onChange={(e) => updateDocument({ title: e.target.value })}
              className="text-xl font-black text-slate-900 bg-transparent border-none outline-none hover:bg-slate-50 px-2 py-1 rounded transition-colors w-[300px]"
              disabled={isReadOnly}
            />
            <div className="flex items-center gap-2 mt-1 px-2 text-xs font-bold text-slate-400">
              <span className="uppercase tracking-widest">{document.type}</span>
              <span>•</span>
              <span>{document.client_name}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {!isReadOnly && (
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200"
            >
              <Palette className="w-4 h-4" /> Marca
            </button>
          )}
          
          <div className="h-4 w-px bg-slate-300"></div>

          {(!document.status || document.status === 'borrador') && (
            <button 
              onClick={() => updateDocument({ status: 'en_revision' })}
              className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold py-1.5 px-4 rounded-lg shadow-md transition-all"
            >
              Solicitar Revisión
            </button>
          )}

          {document.status === 'en_revision' && (
            <>
              <div className="bg-amber-100 text-amber-700 text-sm font-bold py-1.5 px-3 rounded-lg border border-amber-200">
                En Revisión (Bloqueado)
              </div>
              <button 
                onClick={() => updateDocument({ status: 'publicado' })}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-1.5 px-4 rounded-lg shadow-md transition-all"
              >
                Aprobar y Publicar
              </button>
            </>
          )}

          {(document.status === 'publicado' || document.status === 'aprobado' || document.status === 'enviado') && (
            <>
              <div className="bg-blue-100 text-blue-700 text-sm font-bold py-1.5 px-3 rounded-lg border border-blue-200">
                {document.status.toUpperCase()}
              </div>
              <button 
                onClick={() => {
                  const url = `${window.location.origin}/view/${document.id}`
                  navigator.clipboard.writeText(url)
                  setCopied(true)
                  setTimeout(() => setCopied(false), 2000)
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-1.5 px-4 rounded-lg shadow-md transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> {copied ? "Enlace Copiado" : "Copiar Link Público"}
              </button>
              <button 
                onClick={() => updateDocument({ status: 'borrador' })}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-bold py-1.5 px-4 rounded-lg shadow-md transition-all"
              >
                Volver a Borrador
              </button>
            </>
          )}
        </div>
      </div>

      {showSettings && (
        <div className="absolute top-20 right-6 z-50 bg-white border border-slate-200 rounded-2xl p-6 w-80 shadow-2xl">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Ajustes de Marca</h3>
          <div className="mb-4">
            <label className="text-xs font-medium text-slate-500 block mb-2">Color Principal</label>
            <div className="flex items-center gap-3">
              <input 
                type="color" 
                value={brand.primaryColor || '#10b981'} 
                onChange={(e) => updateDocument({ content: { ...document.content, brand: { ...brand, primaryColor: e.target.value } } })}
                className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent p-0"
              />
              <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                {brand.primaryColor || '#10b981'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Template View */}
      <div className="flex-1 w-full relative">
         {/* Etiqueta de Modo Edición */}
         <div className="absolute top-4 left-4 z-50 bg-indigo-600 text-white px-3 py-1 text-xs font-black uppercase tracking-widest rounded-full shadow-xl shadow-indigo-600/30 flex items-center gap-2 border border-indigo-500">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
            Modo Template Estricto: {template}
         </div>

         {/* Renderizado de Templates */}
         {template === 'balones' && <CotizacionBalones data={data} brand={brand} />}
         {template === 'evolution' && <PropuestaEvolution data={data} brand={brand} />}
         {template === 'lotbet' && <InformeLotbet data={data} brand={brand} />}
         {template === 'mundial' && <InformeMundial data={data} brand={brand} />}
      </div>
    </div>
  )
}
