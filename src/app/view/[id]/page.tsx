import { supabase } from '@/lib/supabaseClient'
import ViewerInforme from '@/components/layouts/ViewerInforme'
import ViewerPresentacion from '@/components/layouts/ViewerPresentacion'
import ViewerCotizacion from '@/components/layouts/ViewerCotizacion'
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

export default async function ViewDocument({ params }: { params: { id: string } }) {
  const { data: document } = await supabase
    .from('documents')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!document) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 font-bold text-red-500">Documento no encontrado o Privado</div>
  }

  if (document.type === 'presentacion') {
    return <ViewerPresentacion document={document} />
  }

  if (document.type === 'cotizacion') {
    return <ViewerCotizacion document={document} />
  }

  return <ViewerInforme document={document} />
}
