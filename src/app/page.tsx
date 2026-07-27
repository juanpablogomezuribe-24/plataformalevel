'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { FileText, LogOut, Plus, Trash2, Copy, Settings } from 'lucide-react'

export default function Dashboard() {
  const [session, setSession] = useState<any>(null)
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [filter, setFilter] = useState('todos')
  const [clientName, setClientName] = useState('')
  const [aiPrompt, setAiPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isReadingFile, setIsReadingFile] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkUser()
    fetchDocuments()
  }, [])

  async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/login')
    } else {
      setSession(session)
    }
  }

  async function fetchDocuments() {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setDocuments(data)
    setLoading(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  async function createDocument(type: 'informe' | 'presentacion' | 'cotizacion') {
    if (!session?.user?.id) return;
    
    // Fetch profile to inject brand
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    const brand = profile ? {
      primaryColor: profile.primary_color || '#06b6d4',
      logoUrl: profile.logo_url || ''
    } : {
      primaryColor: '#06b6d4',
      logoUrl: ''
    }

    const { data, error } = await supabase.from('documents').insert([
      { 
        user_id: session.user.id,
        title: 'Nueva ' + (type === 'informe' ? 'Propuesta' : type === 'presentacion' ? 'Presentación' : 'Cotización'), 
        type: type, 
        status: 'borrador', 
        client_name: clientName || 'Sin Cliente',
        content: { brand: brand } 
      }
    ]).select()

    if (error) {
      console.error(error)
      alert("Hubo un error al crear el documento: " + error.message)
      return
    }

    if (data && data[0]) {
      setShowModal(false)
      fetchDocuments()
      router.push(`/document/${data[0].id}`)
    }
  }

  async function generateWithAI() {
    if (!aiPrompt.trim()) {
      alert("Por favor ingresa un contexto o brief para la IA.")
      return
    }
    if (!session?.user?.id) return;
    
    setIsGenerating(true)

    try {
      // Fetch profile to inject brand
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      const brand = profile ? {
        primaryColor: profile.primary_color || '#06b6d4',
        logoUrl: profile.logo_url || ''
      } : {
        primaryColor: '#06b6d4',
        logoUrl: ''
      }

      // Call AI endpoint
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt, clientName })
      })

      if (!response.ok) {
        throw new Error("Error en la respuesta de la IA")
      }

      const generatedData = await response.json()

      // Save to Supabase
      const { data, error } = await supabase.from('documents').insert([
        { 
          user_id: session.user.id,
          title: generatedData.title || ('Propuesta para ' + (clientName || 'Cliente')), 
          type: generatedData.type || 'informe', 
          status: 'borrador', 
          client_name: clientName || 'Sin Cliente',
          content: { 
            brand: brand,
            blocks: generatedData.blocks || [] 
          } 
        }
      ]).select()

      if (error) throw error

      if (data && data[0]) {
        setShowModal(false)
        fetchDocuments()
        router.push(`/document/${data[0].id}`)
      }
    } catch (error: any) {
      console.error(error)
      alert("Hubo un error al generar con IA: " + error.message)
    } finally {
      setIsGenerating(false)
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsReadingFile(true);
    try {
      const text = await file.text();
      setAiPrompt((prev) => prev ? prev + '\n\n' + text : text);
    } catch (error) {
      alert("Error al leer el archivo. Asegúrate de que sea un archivo de texto válido (.txt, .md, .csv)");
    } finally {
      setIsReadingFile(false);
      // Reset input
      if (e.target) e.target.value = '';
    }
  }

  async function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation() // Evitar que el click abra el editor
    if (!confirm('¿Estás seguro de eliminar este documento de forma permanente?')) return
    
    const { error } = await supabase.from('documents').delete().eq('id', id)
    if (error) {
      alert("Error al eliminar: " + error.message + " (Asegúrate de tener la política RLS de DELETE habilitada en Supabase)")
    } else {
      fetchDocuments()
    }
  }



  async function handleDuplicate(e: React.MouseEvent, doc: any) {
    e.stopPropagation()
    if (!session?.user?.id) return;
    
    const { data, error } = await supabase.from('documents').insert([
      { 
        user_id: session.user.id,
        title: doc.title + ' (Copia)', 
        type: doc.type, 
        status: 'borrador', 
        content: doc.content 
      }
    ]).select()

    if (error) {
      alert("Error al duplicar el documento: " + error.message)
    } else {
      fetchDocuments()
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><p className="text-slate-500 font-bold">Cargando...</p></div>
  if (!session) return null // Prevents flashing before redirect



  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-cyan-500 rounded-lg text-white font-black flex items-center justify-center">L</div>
          <h1 className="font-black text-xl tracking-tight">LEVEL</h1>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium">
          <button onClick={() => router.push('/settings')} className="text-slate-500 hover:text-slate-900 flex items-center gap-2 transition-colors">
            <Settings className="w-4 h-4" /> Ajustes
          </button>
          <div className="w-px h-4 bg-slate-200"></div>
          <button onClick={handleLogout} className="text-red-500 hover:text-red-600 flex items-center gap-2">
            <LogOut className="w-4 h-4" /> Salir
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-1">Visión General</h2>
            <p className="text-slate-500 text-sm">Dashboard analítico y gestión de propuestas.</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-slate-900 text-white font-bold py-2.5 px-5 rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Nuevo Documento
          </button>
        </div>

        {/* --- DASHBOARD ANALÍTICO --- */}
        {documents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
            {/* KPI: Total */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Creados</p>
              <div className="text-3xl font-black text-slate-800">{documents.length}</div>
            </div>
            
            {/* KPI: Tasa de Éxito */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Tasa de Éxito</p>
              <div className="flex items-end gap-2">
                <div className="text-3xl font-black text-emerald-600">
                  {Math.round((documents.filter(d => ['publicado', 'aprobado', 'enviado'].includes(d.status)).length / documents.length) * 100) || 0}%
                </div>
                <div className="text-xs font-bold text-slate-400 mb-1.5">aprobados</div>
              </div>
            </div>

            {/* KPI: Desglose por Tipo */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm col-span-1 md:col-span-2 flex flex-col justify-center">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Distribución por Formato</p>
              <div className="flex items-center gap-4">
                <div className="flex-1 flex flex-col items-center p-2 bg-cyan-50 rounded-xl">
                  <span className="text-xl font-black text-cyan-600">{documents.filter(d => d.type === 'informe').length}</span>
                  <span className="text-[10px] font-bold text-cyan-700 uppercase">Informes</span>
                </div>
                <div className="flex-1 flex flex-col items-center p-2 bg-indigo-50 rounded-xl">
                  <span className="text-xl font-black text-indigo-600">{documents.filter(d => d.type === 'presentacion').length}</span>
                  <span className="text-[10px] font-bold text-indigo-700 uppercase">Presentaciones</span>
                </div>
                <div className="flex-1 flex flex-col items-center p-2 bg-emerald-50 rounded-xl">
                  <span className="text-xl font-black text-emerald-600">{documents.filter(d => d.type === 'cotizacion').length}</span>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase">Cotizaciones</span>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* --- FIN DASHBOARD --- */}

        {/* Pestañas de Filtro */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-200 pb-4">
          <button onClick={() => setFilter('todos')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filter === 'todos' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>Todos</button>
          <button onClick={() => setFilter('borrador')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filter === 'borrador' ? 'bg-slate-200 text-slate-800' : 'text-slate-500 hover:bg-slate-100'}`}>Borradores</button>
          <button onClick={() => setFilter('en_revision')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filter === 'en_revision' ? 'bg-amber-100 text-amber-700' : 'text-slate-500 hover:bg-slate-100'}`}>En Revisión</button>
          <button onClick={() => setFilter('publicado')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filter === 'publicado' ? 'bg-emerald-100 text-emerald-700' : 'text-slate-500 hover:bg-slate-100'}`}>Publicados</button>
          <button onClick={() => setFilter('rechazado')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filter === 'rechazado' ? 'bg-red-100 text-red-700' : 'text-slate-500 hover:bg-slate-100'}`}>Rechazados</button>
        </div>

        {documents.filter(doc => filter === 'todos' || doc.status === filter).length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl mx-auto flex items-center justify-center text-slate-300 mb-4">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">No tienes documentos</h3>
            <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">Comienza creando tu primer informe o cotización basada en la arquitectura Level.</p>
            <button onClick={() => setShowModal(true)} className="text-cyan-600 font-bold hover:text-cyan-700">Crear ahora →</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {documents.filter(doc => filter === 'todos' || doc.status === filter).map(doc => (
              <div key={doc.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group cursor-pointer" onClick={() => router.push(`/document/${doc.id}`)}>
                <div className="flex justify-between items-start mb-4">
                  <div className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
                    doc.type === 'informe' ? 'bg-cyan-50 text-cyan-600' : 
                    doc.type === 'presentacion' ? 'bg-indigo-50 text-indigo-600' : 
                    'bg-emerald-50 text-emerald-600'
                  }`}>
                    {doc.type}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-[10px] font-bold text-slate-400">
                      {new Date(doc.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={(e) => handleDuplicate(e, doc)} 
                        className="text-slate-300 hover:text-cyan-500 transition-colors"
                        title="Duplicar documento"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => handleDelete(e, doc.id)} 
                        className="text-slate-300 hover:text-red-500 transition-colors"
                        title="Eliminar documento"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {doc.client_name && doc.client_name !== 'Sin Cliente' && (
                  <div className="text-xs font-bold text-slate-500 mb-1 flex items-center gap-1">
                    Para: <span className="text-slate-700">{doc.client_name}</span>
                  </div>
                )}
                
                <h3 className="font-bold text-lg text-slate-800 mb-2 line-clamp-1">{doc.title}</h3>
                
                <div className={`inline-block mb-4 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${
                  doc.status === 'en_revision' ? 'bg-amber-100 text-amber-600' :
                  doc.status === 'publicado' ? 'bg-emerald-100 text-emerald-600' :
                  doc.status === 'rechazado' ? 'bg-red-100 text-red-600' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {doc.status === 'en_revision' ? 'En Revisión' : 
                   doc.status === 'publicado' ? 'Publicado' : 
                   doc.status === 'rechazado' ? 'Rechazado' : 
                   'Borrador'}
                </div>

                <button 
                  onClick={(e) => { e.stopPropagation(); router.push(`/document/${doc.id}`) }}
                  className="w-full py-2 bg-slate-50 text-slate-700 text-xs font-bold rounded-xl group-hover:bg-slate-900 group-hover:text-white transition-colors"
                >
                  Abrir Editor
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal de Creación */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative overflow-hidden">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-2">¿Qué vamos a crear hoy?</h2>
            <p className="text-slate-500 mb-6">Elige el formato estructural (Layout) ideal para tu propuesta.</p>
            
            <div className="mb-6">
              <label className="text-sm font-bold text-slate-700 block mb-2">Cliente (Opcional)</label>
              <input 
                type="text" 
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Ej. Coca-Cola, Apple..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
            
            <div className="mb-6">
              <label className="text-sm font-bold text-slate-700 block mb-2 flex justify-between items-center">
                <span>Contexto / Brief (Opcional pero recomendado para IA)</span>
                <label className="text-xs text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-lg cursor-pointer transition-colors flex items-center gap-1">
                  {isReadingFile ? 'Leyendo...' : '📄 Subir Archivo (.txt, .md)'}
                  <input type="file" accept=".txt,.md,.csv" className="hidden" onChange={handleFileUpload} disabled={isReadingFile} />
                </label>
              </label>
              <textarea 
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Ej. Necesito una cotización para rediseñar la marca de Coca-Cola. Incluye una fase de auditoría ($500), diseño ($2000) y manual de marca ($1000). El objetivo es modernizar..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors min-h-[100px] resize-y"
              />
            </div>
            
            <div className="mb-6">
              <button 
                onClick={generateWithAI}
                disabled={isGenerating || !aiPrompt.trim()}
                className={`w-full font-bold py-3 px-5 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2 ${
                  isGenerating 
                    ? 'bg-slate-200 text-slate-500 cursor-not-allowed' 
                    : aiPrompt.trim() 
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/20' 
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generando Propuesta con Inteligencia Artificial...
                  </>
                ) : (
                  <>✨ Generar Propuesta Automáticamente con IA</>
                )}
              </button>
            </div>

            <div className="relative flex py-5 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-bold uppercase tracking-widest">O CREAR MANUALMENTE</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Opción Informe */}
              <button 
                onClick={() => createDocument('informe')}
                className="text-left group border-2 border-slate-100 hover:border-cyan-500 rounded-2xl p-6 transition-all hover:shadow-xl hover:shadow-cyan-500/10"
              >
                <div className="w-12 h-12 bg-cyan-100 text-cyan-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Propuesta Guiada</h3>
                <p className="text-sm text-slate-500 mb-4">Incluye barra de navegación lateral. Ideal para reportes, justificaciones y procesos detallados.</p>
                <span className="text-cyan-600 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">Usar este formato →</span>
              </button>

              {/* Opción Presentación */}
              <button 
                onClick={() => createDocument('presentacion')}
                className="text-left group border-2 border-slate-100 hover:border-indigo-500 rounded-2xl p-6 transition-all hover:shadow-xl hover:shadow-indigo-500/10"
              >
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <div className="w-6 h-4 border-2 border-current rounded-sm flex items-center justify-center">
                    <div className="w-2 h-2 bg-current rounded-full" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Presentación Creativa</h3>
                <p className="text-sm text-slate-500 mb-4">Formato inmersivo a pantalla completa sin barra lateral. Ideal para diseño de marca o reuniones.</p>
                <span className="text-indigo-600 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">Usar este formato →</span>
              </button>

              {/* Opción Cotización */}
              <button 
                onClick={() => createDocument('cotizacion')}
                className="text-left group border-2 border-slate-100 hover:border-emerald-500 rounded-2xl p-6 transition-all hover:shadow-xl hover:shadow-emerald-500/10"
              >
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="font-bold text-xl">$</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Cotización Comercial</h3>
                <p className="text-sm text-slate-500 mb-4">Panel derecho anclado (sticky) con el total siempre visible para asegurar el cierre de ventas.</p>
                <span className="text-emerald-600 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">Usar este formato →</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
