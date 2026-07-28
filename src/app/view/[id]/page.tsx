import { supabase } from '@/lib/supabaseClient'
import type { Metadata } from 'next'
import DocumentViewer from '@/components/DocumentViewer'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const { data: document } = await supabase
    .from('documents')
    .select('title, content')
    .eq('id', resolvedParams.id)
    .single()
    
  if (!document) {
    return { title: 'Documento no encontrado - Level' }
  }

  const logoUrl = document.content?.brand?.logoUrl || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=630&fit=crop'

  return {
    title: `${document.title} | Presentación Level`,
    description: 'Haz clic para ver la presentación interactiva.',
    openGraph: {
      title: `${document.title} | Presentación Level`,
      description: 'Haz clic para ver la presentación interactiva.',
      images: [{ url: logoUrl }],
    },
  }
}

export default async function ViewDocument({ params }: Props) {
  const resolvedParams = await params;
  const { data: document } = await supabase
    .from('documents')
    .select('*')
    .eq('id', resolvedParams.id)
    .single()

  if (!document) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 font-bold text-red-500">Documento no encontrado</div>
  }

  const isPublic = document.status === 'publicado' || document.status === 'aprobado' || document.status === 'enviado';
  
  if (!isPublic) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <h1 className="text-3xl font-black text-slate-900 mb-2">Acceso Denegado</h1>
        <p className="text-slate-500 max-w-md">Este documento se encuentra en borrador o en revisión. Aún no ha sido aprobado para visualización pública.</p>
      </div>
    )
  }

  return <DocumentViewer document={document} />
}
