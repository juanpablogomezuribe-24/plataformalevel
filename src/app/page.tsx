'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { FileText, LogOut, Plus, Trash2, Copy, Settings } from 'lucide-react'
import CreateDocumentModal from '@/components/CreateDocumentModal'

export default function Dashboard() {
  const [session, setSession] = useState<any>(null)
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [filter, setFilter] = useState('todos')
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
        <CreateDocumentModal 
          session={session} 
          onClose={() => setShowModal(false)}
          onSuccess={(id) => {
            setShowModal(false)
            fetchDocuments()
            router.push(`/document/${id}`)
          }}
        />
      )}
    </div>
  )
}
