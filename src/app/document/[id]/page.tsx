'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import LayoutInforme from '@/components/layouts/LayoutInforme'

export default function DocumentEditorPage() {
  const params = useParams()
  const [document, setDocument] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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
    // Optimistic update locally
    setDocument({ ...document, ...updates })

    // Update in DB
    await supabase
      .from('documents')
      .update(updates)
      .eq('id', document.id)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 font-bold text-slate-500">Cargando Editor...</div>
  if (!document) return <div className="min-h-screen flex items-center justify-center bg-slate-50 font-bold text-red-500">Documento no encontrado</div>

  // Seleccionar Layout según el tipo (Por ahora solo hay informe en el MVP)
  if (document.type === 'informe') {
    return <LayoutInforme document={document} updateDocument={updateDocument} />
  }

  return (
    <div className="p-8">
      <h1>Editor genérico (Falta Layout para {document.type})</h1>
    </div>
  )
}
