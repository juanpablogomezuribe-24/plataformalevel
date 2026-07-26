'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { FileText, LogOut, Plus, Trash2 } from 'lucide-react'

export default function Dashboard() {
  const [session, setSession] = useState<any>(null)
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
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

  async function handleCreateNew() {
    if (!session?.user?.id) return;
    
    // Para el MVP, creamos un documento vacío tipo 'informe' de inmediato
    const { data, error } = await supabase.from('documents').insert([
      { 
        user_id: session.user.id,
        title: 'Nuevo Informe ' + new Date().toLocaleDateString(), 
        type: 'informe', 
        status: 'borrador', 
        content: {} 
      }
    ]).select()

    if (error) {
      console.error(error)
      alert("Hubo un error al crear el documento: " + error.message)
      return
    }

    if (data && data[0]) {
      fetchDocuments()
      // Opcional: router.push(`/document/${data[0].id}`) // Ir directamente al editor
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
          <span className="text-slate-500 hidden md:block">{session.user.email}</span>
          <button onClick={handleLogout} className="text-red-500 hover:text-red-600 flex items-center gap-2">
            <LogOut className="w-4 h-4" /> Salir
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-1">Mis Documentos</h2>
            <p className="text-slate-500 text-sm">Gestiona tus cotizaciones, propuestas e informes.</p>
          </div>
          <button 
            onClick={handleCreateNew}
            className="bg-slate-900 text-white font-bold py-2.5 px-5 rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Nuevo Documento
          </button>
        </div>

        {documents.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl mx-auto flex items-center justify-center text-slate-300 mb-4">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">No tienes documentos</h3>
            <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">Comienza creando tu primer informe o cotización basada en la arquitectura Level.</p>
            <button onClick={handleCreateNew} className="text-cyan-600 font-bold hover:text-cyan-700">Crear ahora →</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {documents.map(doc => (
              <div key={doc.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <div className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
                    doc.type === 'informe' ? 'bg-cyan-50 text-cyan-600' : 'bg-indigo-50 text-indigo-600'
                  }`}>
                    {doc.type}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-[10px] font-bold text-slate-400">
                      {new Date(doc.created_at).toLocaleDateString()}
                    </div>
                    <button 
                      onClick={(e) => handleDelete(e, doc.id)} 
                      className="text-slate-300 hover:text-red-500 transition-colors"
                      title="Eliminar documento"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h3 className="font-bold text-lg text-slate-800 mb-1 line-clamp-1">{doc.title}</h3>
                <p className="text-xs text-slate-500 mb-4">Estado: <span className="font-semibold capitalize text-slate-700">{doc.status}</span></p>
                <button 
                  onClick={() => router.push(`/document/${doc.id}`)}
                  className="w-full py-2 bg-slate-50 text-slate-700 text-xs font-bold rounded-xl group-hover:bg-slate-900 group-hover:text-white transition-colors"
                >
                  Abrir Editor
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
