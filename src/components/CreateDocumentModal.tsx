import { useState } from 'react'
import { FileText } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

export default function CreateDocumentModal({ 
  session, 
  onClose, 
  onSuccess 
}: { 
  session: any, 
  onClose: () => void, 
  onSuccess: (id: string) => void 
}) {
  const [clientName, setClientName] = useState('')
  const [aiPrompt, setAiPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isReadingFile, setIsReadingFile] = useState(false)

  async function createDocument(type: 'informe' | 'presentacion' | 'cotizacion') {
    if (!session?.user?.id) return;
    
    // Fetch profile to inject brand
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    const brand = profile ? {
      primaryColor: profile.primary_color || '#06b6d4',
      logoUrl: profile.logo_url || ''
    } : {
      primaryColor: '#06b6d4',
      logoUrl: ''
    }

    const { data, error } = await supabase.from('documents').insert([
      { 
        user_id: session.user.id,
        title: 'Nueva ' + (type === 'informe' ? 'Propuesta' : type === 'presentacion' ? 'Presentación' : 'Cotización'), 
        type: type, 
        status: 'borrador', 
        client_name: clientName || 'Sin Cliente',
        content: { brand: brand } 
      }
    ]).select()

    if (error) {
      console.error(error)
      alert("Hubo un error al crear el documento: " + error.message)
      return
    }

    if (data && data[0]) {
      onSuccess(data[0].id)
    }
  }

  async function generateWithAI() {
    if (!aiPrompt.trim()) {
      alert("Por favor ingresa un contexto o brief para la IA.")
      return
    }
    if (!session?.user?.id) return;
    
    setIsGenerating(true)

    try {
      // Fetch profile to inject brand
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      const brand = profile ? {
        primaryColor: profile.primary_color || '#06b6d4',
        logoUrl: profile.logo_url || ''
      } : {
        primaryColor: '#06b6d4',
        logoUrl: ''
      }

      // Call AI endpoint
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt, clientName })
      })

      if (!response.ok) {
        throw new Error("Error en la respuesta de la IA")
      }

      const generatedData = await response.json()

      // Save to Supabase
      const { data, error } = await supabase.from('documents').insert([
        { 
          user_id: session.user.id,
          title: generatedData.title || ('Propuesta para ' + (clientName || 'Cliente')), 
          type: generatedData.type || 'informe', 
          status: 'borrador', 
          client_name: clientName || 'Sin Cliente',
          content: { 
            brand: brand,
            blocks: generatedData.blocks || [] 
          } 
        }
      ]).select()

      if (error) throw error

      if (data && data[0]) {
        onSuccess(data[0].id)
      }
    } catch (error: any) {
      console.error(error)
      alert("Hubo un error al generar con IA: " + error.message)
    } finally {
      setIsGenerating(false)
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsReadingFile(true);
    try {
      const text = await file.text();
      setAiPrompt((prev) => prev ? prev + '\n\n' + text : text);
    } catch (error) {
      alert("Error al leer el archivo. Asegúrate de que sea un archivo de texto válido (.txt, .md, .csv)");
    } finally {
      setIsReadingFile(false);
      // Reset input
      if (e.target) e.target.value = '';
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative overflow-hidden max-h-[95vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"
        >
          ✕
        </button>
        <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-2">¿Qué vamos a crear hoy?</h2>
        <p className="text-slate-500 mb-6">Elige el formato estructural (Layout) ideal para tu propuesta.</p>
        
        <div className="mb-6">
          <label className="text-sm font-bold text-slate-700 block mb-2">Cliente (Opcional)</label>
          <input 
            type="text" 
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Ej. Coca-Cola, Apple..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>
        
        <div className="mb-6">
          <label className="text-sm font-bold text-slate-700 block mb-2 flex justify-between items-center">
            <span>Contexto / Brief (Opcional pero recomendado para IA)</span>
            <label className="text-xs text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-lg cursor-pointer transition-colors flex items-center gap-1">
              {isReadingFile ? 'Leyendo...' : '📄 Subir Archivo (.txt, .md)'}
              <input type="file" accept=".txt,.md,.csv" className="hidden" onChange={handleFileUpload} disabled={isReadingFile} />
            </label>
          </label>
          <textarea 
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="Ej. Necesito una cotización para rediseñar la marca de Coca-Cola. Incluye una fase de auditoría ($500), diseño ($2000) y manual de marca ($1000). El objetivo es modernizar..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors min-h-[100px] resize-y"
          />
        </div>
        
        <div className="mb-6">
          <button 
            onClick={generateWithAI}
            disabled={isGenerating || !aiPrompt.trim()}
            className={`w-full font-bold py-3 px-5 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2 ${
              isGenerating 
                ? 'bg-slate-200 text-slate-500 cursor-not-allowed' 
                : aiPrompt.trim() 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/20' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generando Propuesta con Inteligencia Artificial...
              </>
            ) : (
              <>✨ Generar Propuesta Automáticamente con IA</>
            )}
          </button>
        </div>

        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-bold uppercase tracking-widest">O CREAR MANUALMENTE</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Opción Informe */}
          <button 
            onClick={() => createDocument('informe')}
            className="text-left group border-2 border-slate-100 hover:border-cyan-500 rounded-2xl p-6 transition-all hover:shadow-xl hover:shadow-cyan-500/10"
          >
            <div className="w-12 h-12 bg-cyan-100 text-cyan-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Propuesta Guiada</h3>
            <p className="text-sm text-slate-500 mb-4">Incluye barra de navegación lateral. Ideal para reportes, justificaciones y procesos detallados.</p>
            <span className="text-cyan-600 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">Usar este formato →</span>
          </button>

          {/* Opción Presentación */}
          <button 
            onClick={() => createDocument('presentacion')}
            className="text-left group border-2 border-slate-100 hover:border-indigo-500 rounded-2xl p-6 transition-all hover:shadow-xl hover:shadow-indigo-500/10"
          >
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <div className="w-6 h-4 border-2 border-current rounded-sm flex items-center justify-center">
                <div className="w-2 h-2 bg-current rounded-full" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Presentación Creativa</h3>
            <p className="text-sm text-slate-500 mb-4">Formato inmersivo a pantalla completa sin barra lateral. Ideal para diseño de marca o reuniones.</p>
            <span className="text-indigo-600 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">Usar este formato →</span>
          </button>

          {/* Opción Cotización */}
          <button 
            onClick={() => createDocument('cotizacion')}
            className="text-left group border-2 border-slate-100 hover:border-emerald-500 rounded-2xl p-6 transition-all hover:shadow-xl hover:shadow-emerald-500/10"
          >
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="font-bold text-xl">$</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Cotización Comercial</h3>
            <p className="text-sm text-slate-500 mb-4">Panel derecho anclado (sticky) con el total siempre visible para asegurar el cierre de ventas.</p>
            <span className="text-emerald-600 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">Usar este formato →</span>
          </button>
        </div>
      </div>
    </div>
  )
}
