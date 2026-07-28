'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { FileText, Plus, Trash2, Copy, MoreVertical, Bell, Search, Filter } from 'lucide-react'
import CreateDocumentModal from '@/components/CreateDocumentModal'
import SidebarLayout from '@/components/SidebarLayout'

export default function Dashboard() {
  const [session, setSession] = useState<any>(null)
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [activeTab, setActiveTab] = useState('pendientes')
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
      .select('*, clients(name)')
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
        client_id: doc.client_id,
        campaign_id: doc.campaign_id,
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

  // Filtrado de documentos basado en status (Mapeo a las pestañas de Figma)
  const filteredDocs = documents.filter(doc => {
    if (activeTab === 'pendientes') return doc.status === 'borrador' || doc.status === 'en_revision'
    if (activeTab === 'publicadas') return doc.status === 'publicado'
    if (activeTab === 'compartidas') return doc.status === 'compartido' || doc.status === 'publicado'
    if (activeTab === 'cambios') return doc.status === 'cambios_solicitados'
    return true
  })

  return (
    <SidebarLayout session={session}>
      <div className="p-8 max-w-7xl mx-auto h-screen flex flex-col">
        
        {/* Header Publicaciones */}
        <div className="flex justify-between items-center mb-8 shrink-0">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Publicaciones</h1>
            <p className="text-slate-500 mt-1">Gestiona todos los documentos publicados y compartidos.</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Nuevo documento
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-8 border-b border-slate-200 mb-6 shrink-0">
          {[
            { id: 'pendientes', label: 'Pendientes' },
            { id: 'publicadas', label: 'Publicadas' },
            { id: 'compartidas', label: 'Compartidas' },
            { id: 'cambios', label: 'Con cambios solicitados' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-sm font-bold border-b-2 transition-colors ${
                activeTab === tab.id 
                  ? 'border-indigo-600 text-indigo-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filters Bar */}
        <div className="flex items-center gap-4 mb-6 shrink-0">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Buscar documentos..." 
              className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
          <select className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-600 focus:outline-none focus:border-indigo-500">
            <option>Todos los tipos</option>
            <option>Cotización</option>
            <option>Presentación</option>
            <option>Informe</option>
          </select>
          <select className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-600 focus:outline-none focus:border-indigo-500">
            <option>Todos los clientes</option>
          </select>
          <button className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
            <Filter className="w-4 h-4" /> Más filtros
          </button>
        </div>

        {/* Table/List */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex-1 overflow-hidden flex flex-col">
          {/* Header Row */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-100 bg-slate-50/50 text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">
            <div className="col-span-4">Documento</div>
            <div className="col-span-3">Cliente</div>
            <div className="col-span-1">Versión</div>
            <div className="col-span-2">Estado</div>
            <div className="col-span-2">Actualizado</div>
          </div>
          
          {/* List Body */}
          <div className="overflow-y-auto flex-1">
            {filteredDocs.length === 0 ? (
              <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center h-full">
                <FileText className="w-12 h-12 text-slate-200 mb-4" />
                <p>No hay documentos en esta sección.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredDocs.map(doc => (
                  <div 
                    key={doc.id}
                    onClick={() => router.push(`/document/${doc.id}`)}
                    className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 cursor-pointer group transition-colors"
                  >
                    <div className="col-span-4 flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        doc.type === 'cotizacion' ? 'bg-indigo-50 text-indigo-600' :
                        doc.type === 'presentacion' ? 'bg-pink-50 text-pink-600' :
                        'bg-emerald-50 text-emerald-600'
                      }`}>
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-sm text-slate-900 truncate">{doc.title}</span>
                    </div>
                    <div className="col-span-3 text-sm text-slate-600 truncate">
                      {doc.clients?.name || doc.client_name || 'Sin cliente'}
                    </div>
                    <div className="col-span-1 text-sm text-slate-500">
                      v1
                    </div>
                    <div className="col-span-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        doc.status === 'borrador' ? 'bg-amber-50 text-amber-600' :
                        doc.status === 'publicado' ? 'bg-emerald-50 text-emerald-600' :
                        doc.status === 'en_revision' ? 'bg-blue-50 text-blue-600' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {doc.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>
                    <div className="col-span-2 flex items-center justify-between text-sm text-slate-500">
                      <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                        <button onClick={(e) => handleDuplicate(e, doc)} className="p-1 hover:text-indigo-600"><Copy className="w-4 h-4" /></button>
                        <button onClick={(e) => handleDelete(e, doc.id)} className="p-1 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Pagination Footer */}
          <div className="border-t border-slate-100 px-6 py-4 flex items-center justify-between text-sm text-slate-500 shrink-0 bg-white">
            <span>Mostrando {filteredDocs.length} documentos</span>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-50">&lt;</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 font-bold">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-50">2</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-50">&gt;</button>
            </div>
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
