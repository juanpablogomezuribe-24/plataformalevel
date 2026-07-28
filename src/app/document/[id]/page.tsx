'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import PageEditorWrapper from '@/components/PageEditorWrapper'
import { Loader2 } from 'lucide-react'

export default function DocumentEditorPage() {
  const params = useParams()
  const router = useRouter()
  const [document, setDocument] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    if (params?.id) {
      fetchDocument(params.id as string)
    }
  }, [params])

  async function fetchDocument(id: string) {
    const { data, error } = await supabase
      .from('documents')
      .select('*, clients(name, brand_color)')
      .eq('id', id)
      .single()
    
    if (data) setDocument(data)
    setLoading(false)
  }

  async function updateDocument(updates: any) {
    const isStatusChange = updates.status && updates.status !== document.status;
    const oldStatus = document.status;

    // Optimistic update locally
    setDocument({ ...document, ...updates })

    // Update in DB
    const { error: updateError } = await supabase
      .from('documents')
      .update(updates)
      .eq('id', document.id)

    if (isStatusChange && !updateError) {
      // Create automatic snapshot
      await supabase.from('document_versions').insert({
        document_id: document.id,
        version_name: `Estado: ${updates.status.toUpperCase()} (antes ${oldStatus || 'nuevo'})`,
        title: document.title,
        content: document.content
      })
    }
  }

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-500">
      <Loader2 className="w-8 h-8 animate-spin mb-4 text-indigo-600" />
      <p className="font-bold">Cargando Editor...</p>
    </div>
  )
  
  if (!document) return <div className="min-h-screen flex items-center justify-center bg-slate-50 font-bold text-red-500">Documento no encontrado</div>

  // Usar el nuevo Editor Basado en Páginas si el documento tiene la estructura correcta
  if (document.content?.pages) {
    return <PageEditorWrapper document={document} updateDocument={updateDocument} session={session} />
  }

  // Fallback para documentos viejos (si existen)
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-600">
      <h1 className="text-xl font-bold mb-2">Formato de Documento Legacy</h1>
      <p>Este documento no tiene la estructura de páginas (Slide Builder). Crea un nuevo documento.</p>
    </div>
  )
}
