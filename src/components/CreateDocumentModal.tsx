import { useState } from 'react'
import { FileText, ArrowLeft, UploadCloud, MonitorPlay, BarChart2 } from 'lucide-react'
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
  const [step, setStep] = useState(1)
  const [docType, setDocType] = useState<'cotizacion' | 'presentacion' | 'informe' | null>(null)
  const [template, setTemplate] = useState<'comercial' | 'ejecutiva' | 'creativa' | null>(null)
  
  const [clientName, setClientName] = useState('')
  const [projectName, setProjectName] = useState('')
  const [brandColor, setBrandColor] = useState('#6366f1') // default indigo
  const [aiPrompt, setAiPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isReadingFile, setIsReadingFile] = useState(false)
  const [fileName, setFileName] = useState('')

  const handleNextStep1 = (type: 'cotizacion' | 'presentacion' | 'informe') => {
    setDocType(type)
    setStep(2)
  }

  const handleNextStep2 = (tmpl: 'comercial' | 'ejecutiva' | 'creativa') => {
    setTemplate(tmpl)
    setStep(3)
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name)
    setIsReadingFile(true);
    try {
      const text = await file.text();
      setAiPrompt((prev) => prev ? prev + '\n\n' + text : text);
    } catch (error) {
      alert("Error al leer el archivo. Asegúrate de que sea un archivo de texto válido (.txt, .md, .csv)");
    } finally {
      setIsReadingFile(false);
      if (e.target) e.target.value = '';
    }
  }

  async function handleCreateProject() {
    if (!session?.user?.id || !docType) return;
    setIsGenerating(true)

    const brand = {
      primaryColor: brandColor,
      logoUrl: ''
    }

    try {
      let blocks: any[] = []
      
      // Si el usuario subió un archivo, usamos IA
      if (aiPrompt.trim()) {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: aiPrompt, clientName })
        })

        if (response.ok) {
          const generatedData = await response.json()
          blocks = generatedData.blocks || []
        }
      }

      const { data, error } = await supabase.from('documents').insert([
        { 
          user_id: session.user.id,
          title: projectName || ('Propuesta para ' + (clientName || 'Cliente')), 
          type: docType, 
          status: 'borrador', 
          client_name: clientName || 'Sin Cliente',
          content: { brand, blocks } 
        }
      ]).select()

      if (error) throw error

      if (data && data[0]) {
        onSuccess(data[0].id)
      }
    } catch (error: any) {
      console.error(error)
      alert("Hubo un error al crear el documento: " + error.message)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 lg:p-10 font-sans">
      <div className="bg-white rounded-3xl w-full max-w-5xl h-full max-h-[85vh] shadow-2xl relative flex flex-col overflow-hidden">
        
        {/* Header del Modal */}
        <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            {step > 1 && (
              <button onClick={() => setStep(step - 1)} className="text-slate-400 hover:text-indigo-600 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {step === 1 && "¿Qué vas a crear?"}
              {step === 2 && "Elige una estructura"}
              {step === 3 && "Nuevo proyecto"}
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            ✕
          </button>
        </div>
        
        {/* Cuerpo (Scrollable) */}
        <div className="p-8 overflow-y-auto flex-1 bg-slate-50/50">
          
          {/* PASO 1 */}
          {step === 1 && (
            <div className="max-w-2xl mx-auto space-y-4 pt-10">
              <p className="text-slate-500 text-center mb-8">Elige el tipo de documento que necesitas.</p>
              
              <button onClick={() => handleNextStep1('cotizacion')} className="w-full text-left bg-white border border-slate-200 hover:border-indigo-500 rounded-2xl p-6 flex items-center justify-between group transition-all hover:shadow-lg hover:shadow-indigo-500/10">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileText className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Cotización</h3>
                    <p className="text-sm text-slate-500">Crea propuestas comerciales profesionales y personalizadas.</p>
                  </div>
                </div>
                <div className="text-slate-300 group-hover:text-indigo-600 transition-colors">→</div>
              </button>

              <button onClick={() => handleNextStep1('presentacion')} className="w-full text-left bg-white border border-slate-200 hover:border-pink-500 rounded-2xl p-6 flex items-center justify-between group transition-all hover:shadow-lg hover:shadow-pink-500/10">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MonitorPlay className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Presentación</h3>
                    <p className="text-sm text-slate-500">Diseña presentaciones impactantes para tus clientes.</p>
                  </div>
                </div>
                <div className="text-slate-300 group-hover:text-pink-600 transition-colors">→</div>
              </button>

              <button onClick={() => handleNextStep1('informe')} className="w-full text-left bg-white border border-slate-200 hover:border-emerald-500 rounded-2xl p-6 flex items-center justify-between group transition-all hover:shadow-lg hover:shadow-emerald-500/10">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BarChart2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Informe</h3>
                    <p className="text-sm text-slate-500">Genera informes claros con datos y resultados clave.</p>
                  </div>
                </div>
                <div className="text-slate-300 group-hover:text-emerald-600 transition-colors">→</div>
              </button>
            </div>
          )}

          {/* PASO 2 */}
          {step === 2 && (
            <div className="max-w-4xl mx-auto pt-6">
              <p className="text-slate-500 mb-8">Selecciona el estilo que mejor se adapte a tu propuesta.</p>
              
              <div className="flex gap-4 mb-8">
                <button className="px-5 py-2 bg-indigo-600 text-white font-bold text-sm rounded-full">Comercial</button>
                <button className="px-5 py-2 bg-white border border-slate-200 text-slate-600 font-bold text-sm rounded-full hover:bg-slate-50">Ejecutiva</button>
                <button className="px-5 py-2 bg-white border border-slate-200 text-slate-600 font-bold text-sm rounded-full hover:bg-slate-50">Creativa</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Estructura 1 */}
                <div className="bg-white border-2 border-indigo-500 rounded-2xl p-4 shadow-lg shadow-indigo-500/10 relative overflow-hidden">
                  <div className="absolute top-4 left-4 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded">Recomendado</div>
                  <div className="h-64 bg-slate-900 rounded-xl mb-4 p-6 flex flex-col justify-end text-white overflow-hidden relative">
                     <div className="absolute inset-0 bg-indigo-500/20" />
                     <div className="relative z-10">
                        <div className="w-8 h-1 bg-indigo-500 mb-2" />
                        <h4 className="text-xl font-bold">Propuesta Comercial</h4>
                     </div>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1">Clásica</h3>
                  <p className="text-xs text-slate-500 mb-4 line-clamp-2">Estructura tradicional y clara, ideal para la mayoría de propuestas.</p>
                  <button onClick={() => handleNextStep2('comercial')} className="w-full py-2.5 border-2 border-indigo-100 text-indigo-600 font-bold text-sm rounded-xl hover:bg-indigo-50 transition-colors">
                    Seleccionar
                  </button>
                </div>

                {/* Estructura 2 */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 hover:border-slate-300 transition-colors">
                  <div className="h-64 bg-slate-100 rounded-xl mb-4 p-6 flex flex-col justify-center items-center text-slate-800">
                     <h4 className="text-xl font-black text-center">Propuesta<br/>Ejecutiva</h4>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1">Ejecutiva</h3>
                  <p className="text-xs text-slate-500 mb-4 line-clamp-2">Diseño profesional y directo, enfocado en resultados rápidos.</p>
                  <button onClick={() => handleNextStep2('ejecutiva')} className="w-full py-2.5 border border-slate-200 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-50 transition-colors">
                    Seleccionar
                  </button>
                </div>

                {/* Estructura 3 */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 hover:border-slate-300 transition-colors">
                  <div className="h-64 bg-slate-900 rounded-xl mb-4 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-indigo-500 opacity-20" />
                    <div className="absolute bottom-6 left-6 text-white">
                      <h4 className="text-xl font-black leading-tight">Propuesta<br/>Creativa</h4>
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1">Moderna</h3>
                  <p className="text-xs text-slate-500 mb-4 line-clamp-2">Diseño visual y dinámico para propuestas creativas y modernas.</p>
                  <button onClick={() => handleNextStep2('creativa')} className="w-full py-2.5 border border-slate-200 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-50 transition-colors">
                    Seleccionar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* PASO 3 */}
          {step === 3 && (
            <div className="max-w-5xl mx-auto pt-4">
              <div className="flex justify-between items-end mb-8">
                <p className="text-slate-500">Completa la información básica para comenzar.</p>
                <button 
                  onClick={handleCreateProject}
                  disabled={isGenerating}
                  className="bg-indigo-600 text-white font-bold py-2.5 px-6 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                >
                  {isGenerating ? 'Creando...' : 'Crear proyecto'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                
                {/* Info Izquierda */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">Cliente</label>
                    <input 
                      type="text" 
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Ej. Solar Bebidas"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-indigo-600 transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">Campaña / Proyecto</label>
                    <input 
                      type="text" 
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="Ej. Lanzamiento Verano 2024"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-indigo-600 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">Logo del cliente</label>
                    <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-indigo-100 text-indigo-600 font-black rounded-lg flex items-center justify-center text-xl">
                          {clientName ? clientName.substring(0, 2).toUpperCase() : 'SB'}
                        </div>
                        <div className="text-sm font-bold text-slate-900 max-w-[120px] leading-tight">
                          {clientName || 'solar bebidas'}
                        </div>
                      </div>
                      <button className="text-indigo-600 text-sm font-bold hover:text-indigo-700">Cambiar logo</button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">Colores de marca</label>
                    <div className="flex gap-2">
                      <button onClick={() => setBrandColor('#6366f1')} className={`w-10 h-10 rounded-full bg-indigo-500 ${brandColor === '#6366f1' ? 'ring-2 ring-offset-2 ring-indigo-500' : ''}`} />
                      <button onClick={() => setBrandColor('#ec4899')} className={`w-10 h-10 rounded-full bg-pink-500 ${brandColor === '#ec4899' ? 'ring-2 ring-offset-2 ring-pink-500' : ''}`} />
                      <button onClick={() => setBrandColor('#10b981')} className={`w-10 h-10 rounded-full bg-emerald-500 ${brandColor === '#10b981' ? 'ring-2 ring-offset-2 ring-emerald-500' : ''}`} />
                      <button onClick={() => setBrandColor('#0f172a')} className={`w-10 h-10 rounded-full bg-slate-900 ${brandColor === '#0f172a' ? 'ring-2 ring-offset-2 ring-slate-900' : ''}`} />
                      <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 hover:bg-slate-200">
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Info Derecha (Archivos) */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-4">Archivos cargados</h3>
                  
                  {/* Dropzone */}
                  <div className="border-2 border-dashed border-indigo-200 bg-indigo-50/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center relative hover:bg-indigo-50 transition-colors">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600 mb-3">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-indigo-900 mb-1">Arrastra archivos aquí o haz clic para subir</p>
                    <p className="text-xs text-indigo-400">Archivos .txt, .md, .csv para alimentar a la IA</p>
                    
                    <input 
                      type="file" 
                      accept=".txt,.md,.csv" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                      onChange={handleFileUpload}
                      disabled={isReadingFile || isGenerating}
                    />
                  </div>

                  {/* Lista de archivos subidos */}
                  {fileName && (
                    <div className="mt-4 bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{fileName}</p>
                          <p className="text-xs text-slate-400">Cargado exitosamente</p>
                        </div>
                      </div>
                      <button onClick={() => { setFileName(''); setAiPrompt(''); }} className="text-slate-400 hover:text-red-500">✕</button>
                    </div>
                  )}

                  <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                    <div className="text-amber-500">✨</div>
                    <p className="text-xs text-amber-700 font-medium leading-relaxed">
                      Estos archivos se usarán para autocompletar datos y acelerar la creación de tu documento utilizando Inteligencia Artificial.
                    </p>
                  </div>

                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
