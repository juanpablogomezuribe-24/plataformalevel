'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { FileText, Plus, Trash2, Copy, MoreVertical, Bell } from 'lucide-react'
import CreateDocumentModal from '@/components/CreateDocumentModal'
import SidebarLayout from '@/components/SidebarLayout'

export default function Dashboard() {
  const [session, setSession] = useState<any>(null)
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
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

  async function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation() 
    if (!confirm('¿Estás seguro de eliminar este documento?')) return
    
    const { error } = await supabase.from('documents').delete().eq('id', id)
    if (error) {
      alert("Error al eliminar: " + error.message)
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
  if (!session) return null 

  const userName = session?.user?.email?.split('@')[0] || 'Usuario'
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

  return (
    <SidebarLayout session={session}>
      {/* Top Header */}
      <header className="h-20 px-10 flex justify-between items-center bg-white/50 backdrop-blur-md sticky top-0 z-10 border-b border-slate-100">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Panel principal</h1>
          <p className="text-slate-500 text-sm">Hola, {capitalize(userName)}. Este es el resumen de tu actividad.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white font-bold py-2 px-5 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20 flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" /> Crear nuevo
          </button>
          <button className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="p-10 max-w-7xl mx-auto">
        
        {/* KPIs (Sparkline Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* KPI 1: Cotizaciones */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-slate-500 font-bold text-sm mb-3">
                <div className="w-2 h-2 rounded-full bg-indigo-500" /> Cotizaciones
              </div>
              <div className="text-4xl font-black text-slate-900 mb-1">
                {documents.filter(d => d.type === 'cotizacion').length}
              </div>
              <p className="text-xs text-slate-400">
                {documents.filter(d => d.type === 'cotizacion' && d.status === 'borrador').length} abiertas
              </p>
            </div>
            {/* Fake Sparkline */}
            <div className="w-24 h-12 flex items-end justify-between gap-1">
              {[40, 70, 45, 90, 65, 100].map((h, i) => (
                <div key={i} className="w-2 bg-indigo-100 rounded-t-sm" style={{ height: `${h}%` }}>
                  {h === 100 && <div className="w-full h-full bg-indigo-500 rounded-t-sm shadow-[0_0_8px_rgba(99,102,241,0.5)]" />}
                </div>
              ))}
            </div>
          </div>

          {/* KPI 2: Presentaciones */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-slate-500 font-bold text-sm mb-3">
                <div className="w-2 h-2 rounded-full bg-pink-500" /> Presentaciones
              </div>
              <div className="text-4xl font-black text-slate-900 mb-1">
                {documents.filter(d => d.type === 'presentacion').length}
              </div>
              <p className="text-xs text-slate-400">
                {documents.filter(d => d.type === 'presentacion' && d.status === 'en_revision').length} en revisión
              </p>
            </div>
            {/* Fake Sparkline Line */}
            <div className="w-24 h-12 relative flex items-center">
               <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
                 <path d="M0,40 C20,40 30,10 50,20 C70,30 80,5 100,0" fill="none" stroke="#ec4899" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
               </svg>
            </div>
          </div>

          {/* KPI 3: Informes */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-slate-500 font-bold text-sm mb-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500" /> Informes
              </div>
              <div className="text-4xl font-black text-slate-900 mb-1">
                {documents.filter(d => d.type === 'informe').length}
              </div>
              <p className="text-xs text-slate-400">
                {documents.filter(d => d.type === 'informe' && d.status === 'publicado').length} finalizados
              </p>
            </div>
            <div className="w-24 h-12 relative flex items-center">
               <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
                 <path d="M0,50 C30,40 40,30 60,35 C80,40 90,10 100,5" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
               </svg>
            </div>
          </div>
        </div>

        {/* Lista de Recientes */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Recientes</h2>
            <button className="text-indigo-600 text-sm font-bold hover:text-indigo-700">Ver todo</button>
          </div>
          
          <div className="divide-y divide-slate-50">
            {documents.slice(0, 5).map(doc => (
              <div 
                key={doc.id} 
                onClick={() => router.push(`/document/${doc.id}`)}
                className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    doc.type === 'cotizacion' ? 'bg-indigo-50 text-indigo-600' :
                    doc.type === 'presentacion' ? 'bg-pink-50 text-pink-600' :
                    'bg-emerald-50 text-emerald-600'
                  }`}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm mb-0.5">{doc.title}</h3>
                    <p className="text-xs text-slate-500">Cliente: {doc.client_name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${
                     doc.type === 'cotizacion' ? 'bg-indigo-50 text-indigo-600' :
                     doc.type === 'presentacion' ? 'bg-pink-50 text-pink-600' :
                     'bg-emerald-50 text-emerald-600'
                  }`}>
                    {doc.type}
                  </div>
                  
                  <div className="text-xs font-bold text-slate-400 w-24 text-right">
                    {new Date(doc.created_at).toLocaleDateString()}
                  </div>

                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => handleDuplicate(e, doc)} className="text-slate-400 hover:text-indigo-600"><Copy className="w-4 h-4" /></button>
                    <button onClick={(e) => handleDelete(e, doc.id)} className="text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            ))}

            {documents.length === 0 && (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full mx-auto flex items-center justify-center text-slate-300 mb-4">
                  <FileText className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Aún no hay documentos</h3>
                <p className="text-xs text-slate-500">Haz clic en Crear nuevo para comenzar.</p>
              </div>
            )}
          </div>
        </div>

      </div>

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
    </SidebarLayout>
  )
}
