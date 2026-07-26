'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    // Si la cuenta no existe, supabase.auth.signInWithPassword fallará, pero podemos usar signUp para el MVP.
    // Para simplificar, intentamos login primero.
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      // Intento de registro si el login falla (comportamiento ágil para MVP)
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })
      if (signUpError) {
        setError(signUpError.message)
        setLoading(false)
        return
      }
    }

    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-8 text-center bg-slate-900 text-white">
          <div className="w-12 h-12 bg-cyan-500 rounded-xl mx-auto flex items-center justify-center text-xl font-black mb-4">L</div>
          <h1 className="text-2xl font-black tracking-tight">LEVEL PLATFORM</h1>
          <p className="text-sm text-slate-400 mt-2">Inicia sesión o regístrate para crear documentos.</p>
        </div>
        
        <form onSubmit={handleLogin} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 font-medium">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Correo Electrónico</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all text-black"
              placeholder="tu@agencia.com"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Contraseña</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all text-black"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-slate-900 text-white font-bold py-3 px-4 rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            {loading ? 'Cargando...' : 'Entrar / Registrarse'}
          </button>
        </form>
      </div>
    </div>
  )
}
