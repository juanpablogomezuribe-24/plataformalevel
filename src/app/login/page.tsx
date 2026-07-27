'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import Image from 'next/image'
import Link from 'next/link'

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
    
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
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
    <div className="min-h-screen flex bg-white font-sans">
      {/* Columna Izquierda: Formulario */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-24">
        <div className="max-w-sm w-full mx-auto">
          {/* Logo y Encabezado */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 border-[3px] border-indigo-600 rounded-lg flex items-center justify-center transform rotate-45">
              <div className="w-4 h-4 bg-indigo-600 rounded-sm -rotate-45" />
            </div>
            <h1 className="font-black text-3xl tracking-tight text-slate-900">Level</h1>
          </div>

          <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Bienvenido de nuevo</h2>
          <p className="text-slate-500 text-sm mb-8">Ingresa para continuar con tu cuenta.</p>
          
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100 font-medium">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Correo electrónico</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 outline-none transition-all text-slate-900 bg-slate-50/50"
                placeholder="hola@agencialevel.com"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Contraseña</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 outline-none transition-all text-slate-900 bg-slate-50/50"
                placeholder="••••••••"
              />
            </div>

            <div className="text-left">
              <a href="#" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">¿Olvidaste tu contraseña?</a>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-lg shadow-indigo-600/20"
            >
              {loading ? 'Cargando...' : 'Ingresar'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm font-medium text-slate-500">
            ¿No tienes cuenta? <a href="#" className="text-indigo-600 font-bold hover:text-indigo-700">Crear cuenta</a>
          </div>
        </div>
      </div>

      {/* Columna Derecha: Gráfico 3D */}
      <div className="hidden lg:flex w-1/2 bg-[#F3E8FF] relative items-center justify-center overflow-hidden">
        {/* Usaremos la imagen generada por IA. El color de fondo es un violeta muy suave. */}
        <div className="relative w-4/5 h-4/5 max-w-2xl max-h-2xl flex items-center justify-center">
          <img 
            src="/login-3d.jpg" 
            alt="Level Dashboard 3D" 
            className="w-full h-auto object-contain drop-shadow-2xl rounded-[3rem] opacity-95 mix-blend-multiply"
          />
        </div>
      </div>
    </div>
  )
}
