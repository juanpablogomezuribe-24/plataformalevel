'use client'

import { useState, useEffect, Suspense } from 'react'
import { Plus, FolderKanban, Trash2, Loader2, Calendar, Target, Briefcase } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function CampaignsContent() {
  const searchParams = useSearchParams()
  const clientIdFilter = searchParams.get('client')

  const [campaigns, setCampaigns] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Form state
  const [name, setName] = useState('')
  const [clientId, setClientId] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchData()
  }, [clientIdFilter])

  async function fetchData() {
    setLoading(true)
    
    // Fetch Clients for dropdown
    const { data: clientsData } = await supabase.from('clients').select('*').order('name')
    if (clientsData) {
      setClients(clientsData)
      if (clientIdFilter) setClientId(clientIdFilter)
      else if (clientsData.length > 0) setClientId(clientsData[0].id)
    }

    // Fetch Campaigns
    let query = supabase
      .from('campaigns')
      .select('*, clients(name, brand_color, logo_url), documents(count)')
      .order('created_at', { ascending: false })
    
    if (clientIdFilter) {
      query = query.eq('client_id', clientIdFilter)
    }

    const { data: campaignsData } = await query
    
    if (campaignsData) setCampaigns(campaignsData)
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    
    const { data: userData } = await supabase.auth.getUser()
    
    const { error } = await supabase.from('campaigns').insert({
      name,
      client_id: clientId,
      user_id: userData?.user?.id
    })

    if (!error) {
      setIsModalOpen(false)
      setName('')
      fetchData()
    } else {
      console.error(error)
      alert("Asegúrate de haber creado la tabla Campaigns en Supabase")
    }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Estás seguro de eliminar esta campaña?')) return
    await supabase.from('campaigns').delete().eq('id', id)
    fetchData()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Campañas</h1>
          <p className="text-slate-500 mt-2">Agrupa tus propuestas e informes por iniciativas específicas.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nueva Campaña
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : campaigns.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center shadow-sm">
          <FolderKanban className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">No hay campañas {clientIdFilter ? 'para este cliente' : 'aún'}</h3>
          <p className="text-slate-500 mb-6">Crea una campaña para empezar a generar documentos dentro de ella.</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="text-indigo-600 font-bold hover:text-indigo-700"
          >
            + Crear campaña
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map(campaign => (
            <div key={campaign.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 overflow-hidden">
                    {campaign.clients?.logo_url ? (
                       <img src={campaign.clients.logo_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                       <Briefcase className="w-5 h-5" style={{ color: campaign.clients?.brand_color || '#94a3b8' }} />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider" style={{ color: campaign.clients?.brand_color || '#64748b' }}>
                      {campaign.clients?.name || 'Cliente Desconocido'}
                    </p>
                    <h3 className="text-lg font-black text-slate-900 leading-tight">{campaign.name}</h3>
                  </div>
                </div>
                <button onClick={() => handleDelete(campaign.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-6 mt-6 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                    <Target className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Documentos</p>
                    <p className="text-sm font-bold text-slate-700">{campaign.documents?.[0]?.count || 0}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Creada</p>
                    <p className="text-sm font-bold text-slate-700">{new Date(campaign.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Crear Campaña */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-black text-slate-900 mb-6">Nueva Campaña</h2>
            
            {clients.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-slate-600 font-medium mb-4">Primero debes crear un cliente para asignarle una campaña.</p>
                <Link href="/dashboard/clients" className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold inline-block">
                  Ir a Crear Cliente
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Cliente</label>
                  <select 
                    value={clientId}
                    onChange={e => setClientId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:border-indigo-500 outline-none font-medium text-slate-700"
                    required
                  >
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Nombre de la Campaña</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:border-indigo-500 outline-none font-medium text-slate-700"
                    placeholder="Ej. Q3 Marketing Digital"
                    required
                  />
                </div>
                <div className="flex justify-end gap-3 pt-6">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    disabled={saving}
                    className="px-6 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center min-w-[120px]"
                  >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Crear Campaña'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function CampaignsPage() {
  return (
    <Suspense fallback={<div className="p-8">Cargando...</div>}>
      <CampaignsContent />
    </Suspense>
  )
}
