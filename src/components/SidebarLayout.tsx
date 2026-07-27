'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { 
  Home, 
  FileText, 
  MonitorPlay, 
  BarChart2, 
  Users, 
  LayoutTemplate, 
  FolderOpen, 
  Users2, 
  Settings, 
  LogOut,
  Bell
} from 'lucide-react'

export default function SidebarLayout({ children, session }: { children: React.ReactNode, session: any }) {
  const router = useRouter()
  const pathname = usePathname()
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const navItems = [
    { label: 'Panel principal', icon: Home, href: '/' },
    { label: 'Cotizaciones', icon: FileText, href: '/cotizaciones' },
    { label: 'Presentaciones', icon: MonitorPlay, href: '/presentaciones' },
    { label: 'Informes', icon: BarChart2, href: '/informes' },
    { label: 'Clientes y campañas', icon: Users, href: '/clientes' },
    { label: 'Plantillas', icon: LayoutTemplate, href: '/plantillas' },
    { label: 'Archivos', icon: FolderOpen, href: '/archivos' },
    { label: 'Equipo', icon: Users2, href: '/equipo' },
    { label: 'Configuración', icon: Settings, href: '/settings' },
  ]

  const userEmail = session?.user?.email || 'Usuario'
  const userName = userEmail.split('@')[0]

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      
      {/* Sidebar Fijo */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between fixed h-full z-20">
        
        <div>
          {/* Logo */}
          <div className="h-20 flex items-center px-8 border-b border-transparent">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border-[2.5px] border-indigo-600 rounded-md flex items-center justify-center transform rotate-45">
                <div className="w-3 h-3 bg-indigo-600 rounded-sm -rotate-45" />
              </div>
              <h1 className="font-black text-xl tracking-tight">Level</h1>
            </div>
          </div>

          {/* Navegación */}
          <nav className="px-4 py-6 space-y-1 overflow-y-auto max-h-[calc(100vh-160px)]">
            {navItems.map((item, index) => {
              // Add a small divider after the 4th item (Informes) and 7th item
              const showDivider = index === 4 || index === 7;
              const isActive = pathname === item.href;
              
              return (
                <React.Fragment key={item.label}>
                  {showDivider && <div className="h-px bg-slate-100 my-4 mx-4" />}
                  <Link 
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors ${
                      isActive 
                        ? 'bg-indigo-50 text-indigo-700' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                    {item.label}
                  </Link>
                </React.Fragment>
              )
            })}
          </nav>
        </div>

        {/* Perfil Usuario (Abajo) */}
        <div className="p-4 border-t border-slate-100 relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors text-left"
          >
            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden">
              <img src={`https://ui-avatars.com/api/?name=${userName}&background=E0E7FF&color=4338CA`} alt="User" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-slate-900 truncate capitalize">{userName}</p>
              <p className="text-xs text-slate-500 truncate">Administradora</p>
            </div>
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showProfileMenu && (
            <div className="absolute bottom-full left-4 mb-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-30">
              <div className="px-4 py-2 border-b border-slate-100 mb-2">
                <p className="text-sm font-bold text-slate-900 truncate">{userEmail}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 ml-64">
        {children}
      </main>

    </div>
  )
}
