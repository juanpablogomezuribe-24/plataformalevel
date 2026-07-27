'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Save, Building2, Palette, Image as ImageIcon } from 'lucide-react'

export default function SettingsPage() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  
  const [profile, setProfile] = useState({
    company_name: '',
    primary_color: '#06b6d4',
    logo_url: ''
  })

  useEffect(() => {
    checkUserAndFetchProfile()
  }, [])

  async function checkUserAndFetchProfile() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/login')
      return
    }
    setSession(session)

    // Fetch profile
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()
    
    if (data) {
      setProfile({
        company_name: data.company_name || '',
        primary_color: data.primary_color || '#06b6d4',
        logo_url: data.logo_url || ''
      })
    }
    setLoading(false)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    
    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', session.user.id)
      .single()
      
    if (existingProfile) {
      // Update
      await supabase
        .from('profiles')
        .update({
          company_name: profile.company_name,
          primary_color: profile.primary_color,
          logo_url: profile.logo_url
        })
        .eq('id', session.user.id)
    } else {
      // Insert
      await supabase
        .from('profiles')
        .insert({
          id: session.user.id,
          company_name: profile.company_name,
          primary_color: profile.primary_color,
          logo_url: profile.logo_url
        })
    }
    
    setSaving(false)
    alert("¡Ajustes guardados correctamente! Los nuevos documentos heredarán esta marca.")
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><p className="text-slate-500 font-bold">Cargando ajustes...</p></div>

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center sticky top-0 z-10">
        <button onClick={() => router.push('/')} className="flex items-center text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" /> Volver al Dashboard
        </button>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Ajustes de Empresa</h1>
          <p className="text-slate-500 text-sm">Configura la identidad visual base. Todos los documentos nuevos que crees usarán estos colores y logo por defecto.</p>
        </div>

        <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-8">
          
          {/* Company Name */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
              <Building2 className="w-4 h-4 text-slate-400" /> Nombre de tu Agencia/Empresa
            </label>
            <input 
              type="text" 
              value={profile.company_name}
              onChange={(e) => setProfile({...profile, company_name: e.target.value})}
              placeholder="Ej. Level Colombia"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Color Picker */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
              <Palette className="w-4 h-4 text-slate-400" /> Color Corporativo Principal
            </label>
            <div className="flex items-center gap-4">
              <input 
                type="color" 
                value={profile.primary_color}
                onChange={(e) => setProfile({...profile, primary_color: e.target.value})}
                className="w-16 h-16 rounded-xl cursor-pointer border-0 bg-transparent p-0"
              />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-900">Color Base</span>
                <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded inline-block mt-1">{profile.primary_color}</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-2">Este color se usará en botones, decoraciones y barras de progreso de tus documentos.</p>
          </div>

          {/* Logo URL */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
              <ImageIcon className="w-4 h-4 text-slate-400" /> URL del Logotipo
            </label>
            <input 
              type="url" 
              value={profile.logo_url}
              onChange={(e) => setProfile({...profile, logo_url: e.target.value})}
              placeholder="https://tudominio.com/logo.png"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-cyan-500 transition-colors"
            />
            {profile.logo_url && (
              <div className="mt-4 p-4 border border-slate-200 rounded-xl bg-slate-50 flex justify-center">
                <img src={profile.logo_url} alt="Logo preview" className="h-12 object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-slate-100">
            <button 
              type="submit" 
              disabled={saving}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving ? 'Guardando...' : <><Save className="w-5 h-5" /> Guardar Ajustes</>}
            </button>
          </div>

        </form>
      </main>
    </div>
  )
}
