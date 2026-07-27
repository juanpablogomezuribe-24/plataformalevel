'use client'

import { useState, useEffect } from 'react'
import { Plus, Building2, Pencil, Trash2, Loader2, ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Form state
  const [name, setName] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [brandColor, setBrandColor] = useState('#2563eb')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchClients()
  }, [])

  async function fetchClients() {
    setLoading(true)
    const { data, error } = await supabase
      .from('clients')
      .select('*, campaigns(count)')
      .order('created_at', { ascending: false })
    
    if (data) setClients(data)
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    
    const { data: userData } = await supabase.auth.getUser()
    
    const { error } = await supabase.from('clients').insert({
      name,
      logo_url: logoUrl,
      brand_color: brandColor,
      user_id: userData?.user?.id
    })

    if (!error) {
      setIsModalOpen(false)
      setName('')
      setLogoUrl('')
      setBrandColor('#2563eb')
      fetchClients()
    } else {
      console.error(error)
      alert("Asegúrate de haber creado las tablas de Clientes en Supabase (ver instrucciones)")
    }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Estás seguro de eliminar este cliente? Se eliminarán todas sus campañas.')) return
    
    await supabase.from('clients').delete().eq('id', id)
    fetchClients()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Directorio de Clientes</h1>
          <p className="text-slate-500 mt-2">Gestiona las marcas y empresas con las que trabajas.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nuevo Cliente
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : clients.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center shadow-sm">
          <Building2 className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">No tienes clientes aún</h3>
          <p className="text-slate-500 mb-6">Comienza creando tu primer cliente para organizar tus campañas.</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="text-indigo-600 font-bold hover:text-indigo-700"
          >
            + Crear mi primer cliente
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {clients.map(client => (
            <div key={client.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: client.brand_color || '#2563eb' }}></div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden">
                  {client.logo_url ? (
                    <img src={client.logo_url} alt={client.name} className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="w-6 h-6 text-slate-400" />
                  )}
                </div>
                <button onClick={() => handleDelete(client.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1 truncate">{client.name}</h3>
              <p className="text-slate-500 text-sm mb-6">{client.campaigns?.[0]?.count || 0} Campañas activas</p>
              
              <Link href={`/dashboard/campaigns?client=${client.id}`} className="flex items-center justify-between text-sm font-bold text-indigo-600 group-hover:text-indigo-700">
                Ver campañas
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Modal Crear Cliente */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-black text-slate-900 mb-6">Nuevo Cliente</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nombre de la Empresa</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium text-slate-700"
                  placeholder="Ej. Acme Corp"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">URL del Logo (Opcional)</label>
                <input 
                  type="url" 
                  value={logoUrl}
                  onChange={e => setLogoUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium text-slate-700"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Color de Marca Principal</label>
                <div className="flex gap-4">
                  <input 
                    type="color" 
                    value={brandColor}
                    onChange={e => setBrandColor(e.target.value)}
                    className="w-12 h-12 rounded-xl cursor-pointer bg-slate-50"
                  />
                  <input 
                    type="text" 
                    value={brandColor}
                    onChange={e => setBrandColor(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-mono text-slate-700 uppercase"
                  />
                </div>
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
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Crear Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
