'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import ViewerInforme from '@/components/layouts/ViewerInforme'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { data: document } = await supabase
    .from('documents')
    .select('title, content')
    .eq('id', params.id)
    .single()
    
  if (!document) {
    return { title: 'Documento no encontrado - Level' }
  }

  const logoUrl = document.content?.brand?.logoUrl || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=630&fit=crop'

  return {
    title: `${document.title} | Propuesta`,
    description: 'Haz clic para ver la propuesta comercial completa interactiva.',
    openGraph: {
      title: `${document.title} | Propuesta`,
      description: 'Haz clic para ver la propuesta comercial completa interactiva.',
      images: [{ url: logoUrl }],
    },
  }
}

export default function DocumentViewerPage() {
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

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 font-bold text-slate-500">Cargando Documento...</div>
  if (!document) return <div className="min-h-screen flex items-center justify-center bg-slate-50 font-bold text-red-500">Documento no encontrado o Privado</div>

  // Seleccionar Layout según el tipo (Por ahora solo hay informe en el MVP)
  if (document.type === 'informe') {
    return <ViewerInforme document={document} />
  }

  return (
    <div className="p-8">
      <h1>Visor genérico (Falta Layout para {document.type})</h1>
    </div>
  )
}
