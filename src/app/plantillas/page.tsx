'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import SidebarLayout from '@/components/SidebarLayout'
import CreateDocumentModal from '@/components/CreateDocumentModal'
import { LayoutTemplate, ArrowRight, MonitorPlay, FileText, CheckCircle2 } from 'lucide-react'

export default function PlantillasPage() {
  const router = useRouter()
  const [session, setSession] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)
  const [defaultTemplate, setDefaultTemplate] = useState<string | undefined>(undefined)
  const [defaultDocType, setDefaultDocType] = useState<'cotizacion' | 'presentacion' | 'informe' | undefined>(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/login')
      } else {
        setSession(session)
      }
    })
  }, [router])

  if (!session) return <div className="min-h-screen bg-slate-50" />

  const handleUseTemplate = (templateId: string, docType: 'cotizacion' | 'presentacion' | 'informe') => {
    setDefaultTemplate(templateId)
    setDefaultDocType(docType)
    setShowModal(true)
  }

  const templates = [
    {
      id: 'lotbet',
      name: 'Template 1',
      description: 'Diseño oscuro premium, ideal para presentaciones de alto impacto y reportes.',
      type: 'presentacion' as const,
      color: 'bg-slate-900',
      accent: 'text-indigo-500',
      features: ['Fondos Oscuros', 'Textura de Carbono', 'Fuentes Brillantes'],
      preview: (
        <div className="w-full h-full bg-[#0B1120] relative overflow-hidden flex flex-col p-6">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
          <div className="w-16 h-1.5 bg-indigo-500 mb-4 rounded-full"></div>
          <div className="h-4 w-3/4 bg-slate-800 rounded mb-3"></div>
          <div className="h-3 w-1/2 bg-slate-800 rounded"></div>
          <div className="mt-auto grid grid-cols-2 gap-2">
            <div className="h-16 bg-slate-800/50 backdrop-blur rounded border border-slate-700/50"></div>
            <div className="h-16 bg-slate-800/50 backdrop-blur rounded border border-slate-700/50"></div>
          </div>
        </div>
      )
    },
    {
      id: 'lotbet-informe',
      name: 'Template 1 (Dashboard)',
      description: 'Variación enfocada puramente en métricas y visualización de datos de la variante oscura.',
      type: 'informe' as const,
      color: 'bg-slate-900',
      accent: 'text-indigo-500',
      features: ['KPIs de Alto Contraste', 'Gráficos de Barras', 'Layouts Divididos'],
      preview: (
        <div className="w-full h-full bg-[#0B1120] relative overflow-hidden flex flex-col p-6">
          <div className="flex justify-between items-end mb-6">
             <div className="h-5 w-1/2 bg-slate-800 rounded"></div>
             <div className="h-8 w-8 bg-indigo-500 rounded-full"></div>
          </div>
          <div className="grid grid-cols-3 gap-2 h-full items-end">
            <div className="w-full h-1/2 bg-gradient-to-t from-indigo-500 to-blue-400 rounded-t-sm"></div>
            <div className="w-full h-full bg-gradient-to-t from-indigo-500 to-blue-400 rounded-t-sm"></div>
            <div className="w-full h-3/4 bg-gradient-to-t from-indigo-500 to-blue-400 rounded-t-sm"></div>
          </div>
        </div>
      )
    },
    {
      id: 'mundial',
      name: 'Template 2 (Clean)',
      description: 'Estética esmeralda, limpia y corporativa. Perfecta para reportes financieros o deportivos.',
      type: 'informe' as const,
      color: 'bg-emerald-950',
      accent: 'text-emerald-500',
      features: ['Minimalista', 'Estilo Financiero', 'Tonos Verdes/Blancos'],
      preview: (
        <div className="w-full h-full bg-gradient-to-br from-emerald-950 to-slate-900 relative overflow-hidden flex flex-col p-6">
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-emerald-500/20 to-transparent"></div>
          <div className="h-6 w-1/3 bg-emerald-800/50 rounded mb-auto mx-auto mt-4"></div>
          <div className="grid grid-cols-2 gap-3 z-10">
            <div className="h-20 bg-white/5 backdrop-blur-md rounded-xl border border-emerald-500/20"></div>
            <div className="h-20 bg-white/5 backdrop-blur-md rounded-xl border border-emerald-500/20"></div>
          </div>
        </div>
      )
    },
    {
      id: 'evolution',
      name: 'Template 4 (Vibrante)',
      description: 'Arquitectura visual vanguardista, colores neón púrpuras y rosados para propuestas audaces.',
      type: 'presentacion' as const,
      color: 'bg-pink-950',
      accent: 'text-pink-500',
      features: ['Estilo Neón', 'Gradientes Dinámicos', 'Moderno'],
      preview: (
        <div className="w-full h-full bg-slate-950 relative overflow-hidden flex items-center justify-center p-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/30 blur-2xl rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/30 blur-2xl rounded-full"></div>
          <div className="w-full space-y-4 relative z-10">
             <div className="h-8 w-3/4 bg-gradient-to-r from-pink-400 to-purple-500 rounded mx-auto"></div>
             <div className="h-3 w-1/2 bg-slate-800 rounded mx-auto"></div>
             <div className="h-10 w-1/3 bg-white/10 rounded-full mx-auto mt-6"></div>
          </div>
        </div>
      )
    }
  ]

  return (
    <SidebarLayout session={session}>
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50/50">
        
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-10 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Librería de Plantillas</h2>
            <p className="text-sm text-slate-500 font-medium">Selecciona el diseño base para tu próximo documento</p>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-10">
          <div className="max-w-7xl mx-auto">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-8">
              {templates.map(tpl => (
                <div key={tpl.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300">
                  
                  {/* Visual Preview Area */}
                  <div className="h-64 bg-slate-100 relative overflow-hidden group-hover:scale-105 transition-transform duration-700 origin-bottom">
                    {tpl.preview}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Info Area */}
                  <div className="p-8 flex-1 flex flex-col relative bg-white">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {tpl.type === 'presentacion' ? <MonitorPlay className="w-5 h-5 text-slate-400" /> : <FileText className="w-5 h-5 text-slate-400" />}
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{tpl.type}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-black text-slate-900 mb-3">{tpl.name}</h3>
                    <p className="text-slate-600 mb-6 font-medium leading-relaxed">{tpl.description}</p>
                    
                    <div className="space-y-3 mb-8 flex-1">
                      {tpl.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-slate-500">
                          <CheckCircle2 className={`w-4 h-4 ${tpl.accent}`} />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={() => handleUseTemplate(tpl.id === 'lotbet-informe' ? 'lotbet' : tpl.id, tpl.type)}
                      className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${tpl.color} text-white hover:opacity-90 shadow-lg`}
                    >
                      Usar esta plantilla
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

      {showModal && (
        <CreateDocumentModal 
          session={session} 
          onClose={() => {
            setShowModal(false)
            setDefaultTemplate(undefined)
            setDefaultDocType(undefined)
          }}
          onSuccess={(id) => {
            setShowModal(false)
            router.push(\`/document/\${id}\`)
          }}
          defaultTemplate={defaultTemplate}
          defaultDocType={defaultDocType}
        />
      )}
    </SidebarLayout>
  )
}
