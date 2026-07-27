import { supabase } from '@/lib/supabaseClient'
import ViewerInforme from '@/components/layouts/ViewerInforme'
import ViewerPresentacion from '@/components/layouts/ViewerPresentacion'
import ViewerCotizacion from '@/components/layouts/ViewerCotizacion'
import type { Metadata } from 'next'

// Nuevos templates especializados
import CotizacionBalones from '@/components/templates/CotizacionBalones'
import PropuestaEvolution from '@/components/templates/PropuestaEvolution'
import InformeLotbet from '@/components/templates/InformeLotbet'
import InformeMundial from '@/components/templates/InformeMundial'

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

  const template = document.content?.template;
  const data = document.content?.data || {};
  const brand = document.content?.brand || {};

  // Renderizar templates especializados si existen
  if (template === 'balones') return <CotizacionBalones data={data} brand={brand} />
  if (template === 'evolution') return <PropuestaEvolution data={data} brand={brand} />
  if (template === 'lotbet') return <InformeLotbet data={data} brand={brand} />
  if (template === 'mundial') return <InformeMundial data={data} brand={brand} />

  // Fallback a los renders legacy genéricos
  if (document.type === 'presentacion') return <ViewerPresentacion document={document} />
  if (document.type === 'cotizacion') return <ViewerCotizacion document={document} />
  
  return <ViewerInforme document={document} />
}
