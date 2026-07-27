'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import LayoutInforme from '@/components/layouts/LayoutInforme'
import LayoutPresentacion from '@/components/layouts/LayoutPresentacion'
import LayoutCotizacion from '@/components/layouts/LayoutCotizacion'
import TemplateEditorWrapper from '@/components/TemplateEditorWrapper'

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
      .select('*')
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

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 font-bold text-slate-500">Cargando Editor...</div>
  if (!document) return <div className="min-h-screen flex items-center justify-center bg-slate-50 font-bold text-red-500">Documento no encontrado</div>

  // Si tiene un template especializado, usar el nuevo Wrapper
  if (document.content?.template) {
    return <TemplateEditorWrapper document={document} updateDocument={updateDocument} session={session} />
  }

  // Fallback a layouts legacy (Bloques genericos)
  if (document.type === 'presentacion') return <LayoutPresentacion document={document} updateDocument={updateDocument} session={session} />
  if (document.type === 'informe') return <LayoutInforme document={document} updateDocument={updateDocument} session={session} />
  if (document.type === 'cotizacion') return <LayoutCotizacion document={document} updateDocument={updateDocument} session={session} />

  return (
    <div className="p-8">
      <h1>Editor genérico (Falta Layout para {document.type})</h1>
    </div>
  )
}
