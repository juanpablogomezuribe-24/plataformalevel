import { useState, useEffect } from 'react'
import { FileText, ArrowLeft, UploadCloud, MonitorPlay, BarChart2, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

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
  
  // Data for Selectors
  const [clients, setClients] = useState<any[]>([])
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [loadingData, setLoadingData] = useState(true)

  // Step 1: Client & Campaign
  const [selectedClient, setSelectedClient] = useState<string>('')
  const [selectedCampaign, setSelectedCampaign] = useState<string>('')
  const [projectName, setProjectName] = useState('')

  // Step 2: Type
  const [docType, setDocType] = useState<'cotizacion' | 'presentacion' | 'informe' | null>(null)
  
  // Step 3: Template
  const [template, setTemplate] = useState<string | null>(null)
  
  // Step 4: Content
  const [aiPrompt, setAiPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isReadingFile, setIsReadingFile] = useState(false)
  const [fileName, setFileName] = useState('')

  useEffect(() => {
    fetchClients()
  }, [])

  async function fetchClients() {
    setLoadingData(true)
    const { data: cData } = await supabase.from('clients').select('*').order('name')
    if (cData) setClients(cData)
    setLoadingData(false)
  }

  async function fetchCampaigns(clientId: string) {
    const { data: campData } = await supabase.from('campaigns').select('*').eq('client_id', clientId).order('name')
    if (campData) setCampaigns(campData)
    else setCampaigns([])
  }

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cid = e.target.value
    setSelectedClient(cid)
    setSelectedCampaign('')
    if (cid) fetchCampaigns(cid)
    else setCampaigns([])
  }

  const handleNextStep1 = () => {
    if (!selectedClient || !selectedCampaign || !projectName) {
      alert("Por favor selecciona un cliente, campaña y dale nombre al proyecto")
      return
    }
    setStep(2)
  }

  const handleNextStep2 = (type: 'cotizacion' | 'presentacion' | 'informe') => {
    setDocType(type)
    setStep(3)
  }

  const handleNextStep3 = (tmpl: string) => {
    setTemplate(tmpl)
    setStep(4)
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
    if (!session?.user?.id || !docType || !selectedClient || !selectedCampaign) return;
    setIsGenerating(true)

    // Enviar nombre del cliente a la IA para contexto
    const client = clients.find(c => c.id === selectedClient)
    const clientNameStr = client ? client.name : 'Sin Cliente'

    try {
      let pages: any[] = []
      
      if (aiPrompt.trim()) {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: aiPrompt, clientName: clientNameStr, template })
        })

        if (response.ok) {
          const generatedData = await response.json()
          // Asumimos que la nueva API devuelve { data: { pages: [...] } }
          pages = generatedData.data?.pages || [] 
        } else {
          const errorData = await response.json()
          throw new Error("Error de IA: " + (errorData.error || "Fallo desconocido al conectar con OpenAI"))
        }
      } else {
        // Generar al menos 1 página vacía basada en el template
        pages = [{ id: 'page-1', templateId: template, name: 'Página 1', elements: {} }]
      }

      const { data, error } = await supabase.from('documents').insert([
        { 
          user_id: session.user.id,
          title: projectName, 
          type: docType, 
          status: 'borrador',
          client_id: selectedClient,
          campaign_id: selectedCampaign,
          client_name: clientNameStr, // Mantenemos para fallback
          content: { template, pages } 
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
    <div className="fixed inset-0 bg-slate-900/80 z-50 flex items-center justify-center p-4 lg:p-10 font-sans">
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
              {step === 1 && "Asignar Proyecto"}
              {step === 2 && "¿Qué vas a crear?"}
              {step === 3 && "Elige un Template Base"}
              {step === 4 && "Cargar Información"}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <div className={`w-2 h-2 rounded-full ${step >= 1 ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
              <div className={`w-2 h-2 rounded-full ${step >= 2 ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
              <div className={`w-2 h-2 rounded-full ${step >= 3 ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
              <div className={`w-2 h-2 rounded-full ${step >= 4 ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors ml-4">
              ✕
            </button>
          </div>
        </div>
        
        {/* Cuerpo (Scrollable) */}
        <div className="p-8 overflow-y-auto flex-1 bg-slate-50/50">
          
          {/* PASO 1: CLIENTE Y CAMPAÑA */}
          {step === 1 && (
            <div className="max-w-xl mx-auto pt-10 space-y-6">
              {loadingData ? (
                <div className="flex justify-center p-12 text-slate-400"><Loader2 className="w-8 h-8 animate-spin" /></div>
              ) : clients.length === 0 ? (
                <div className="text-center p-8 bg-white border border-slate-200 rounded-2xl">
                  <h3 className="font-bold text-slate-800 mb-4">No tienes clientes creados</h3>
                  <p className="text-slate-500 text-sm mb-6">Para mantener todo organizado, primero debes crear al menos un cliente en el directorio.</p>
                  <Link href="/dashboard/clients" onClick={onClose} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold">Ir a Clientes</Link>
                </div>
              ) : (
                <div className="space-y-6 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">Selecciona un Cliente</label>
                    <select 
                      value={selectedClient} 
                      onChange={handleClientChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-indigo-600 transition-colors"
                    >
                      <option value="">-- Seleccionar --</option>
                      {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">Selecciona una Campaña</label>
                    <select 
                      value={selectedCampaign} 
                      onChange={(e) => setSelectedCampaign(e.target.value)}
                      disabled={!selectedClient}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-indigo-600 transition-colors disabled:opacity-50"
                    >
                      <option value="">-- Seleccionar --</option>
                      {campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    {selectedClient && campaigns.length === 0 && (
                      <p className="text-xs text-amber-600 mt-2">Este cliente no tiene campañas. Crea una desde la vista de Campañas.</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">Nombre de la Propuesta / Documento</label>
                    <input 
                      type="text" 
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="Ej. Propuesta Q3 WPlay"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-indigo-600 transition-colors"
                    />
                  </div>

                  <button 
                    onClick={handleNextStep1}
                    disabled={!selectedClient || !selectedCampaign || !projectName}
                    className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 mt-4"
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </div>
          )}

          {/* PASO 2: TIPO */}
          {step === 2 && (
            <div className="max-w-2xl mx-auto space-y-4 pt-10">
              <p className="text-slate-500 text-center mb-8">¿Qué formato necesitas crear?</p>
              
              <button onClick={() => handleNextStep2('cotizacion')} className="w-full text-left bg-white border border-slate-200 hover:border-indigo-500 rounded-2xl p-6 flex items-center justify-between group transition-all hover:shadow-lg hover:shadow-indigo-500/10">
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

              <button onClick={() => handleNextStep2('presentacion')} className="w-full text-left bg-white border border-slate-200 hover:border-pink-500 rounded-2xl p-6 flex items-center justify-between group transition-all hover:shadow-lg hover:shadow-pink-500/10">
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

              <button onClick={() => handleNextStep2('informe')} className="w-full text-left bg-white border border-slate-200 hover:border-emerald-500 rounded-2xl p-6 flex items-center justify-between group transition-all hover:shadow-lg hover:shadow-emerald-500/10">
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

          {/* PASO 3: TEMPLATE */}
          {step === 3 && (
            <div className="max-w-4xl mx-auto pt-6">
              <p className="text-slate-500 mb-8 text-center">Selecciona el template base (La IA usará su estructura para generar opciones de diapositivas).</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {docType === 'cotizacion' && (
                  <>
                    <div className="bg-white border-2 border-indigo-500 rounded-2xl p-4 shadow-lg shadow-indigo-500/10 relative overflow-hidden group">
                      <div className="absolute top-4 left-4 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded">Recomendado</div>
                      <div className="h-48 bg-slate-50 rounded-xl mb-4 flex items-center justify-center border border-slate-100 group-hover:border-indigo-200 transition-colors">
                         <h4 className="text-lg font-bold text-slate-800 text-center">Cotización<br/>Genérica (Premium)</h4>
                      </div>
                      <p className="text-xs text-slate-500 mb-4 line-clamp-2">Estructura limpia para cualquier producto/servicio.</p>
                      <button onClick={() => handleNextStep3('cotizacion-generica')} className="w-full py-2.5 bg-indigo-50 text-indigo-600 font-bold text-sm rounded-xl hover:bg-indigo-100 transition-colors">
                        Seleccionar Template
                      </button>
                    </div>

                    <div className="bg-white border-2 border-transparent hover:border-slate-300 rounded-2xl p-4 transition-colors">
                      <div className="h-48 bg-slate-100 rounded-xl mb-4 flex items-center justify-center text-center p-4">
                         <span className="text-3xl mb-2">⚽️</span>
                         <h4 className="text-sm font-bold text-slate-800">Balones (Legacy)</h4>
                      </div>
                      <p className="text-xs text-slate-500 mb-4 line-clamp-2">Template rígido original.</p>
                      <button onClick={() => handleNextStep3('balones')} className="w-full py-2.5 border border-slate-200 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-50 transition-colors">
                        Seleccionar
                      </button>
                    </div>
                  </>
                )}

                {docType === 'presentacion' && (
                  <>
                    <div className="bg-white border-2 border-indigo-500 rounded-2xl p-4 shadow-lg shadow-indigo-500/10 relative overflow-hidden group">
                      <div className="absolute top-4 left-4 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded">Activo</div>
                      <div className="h-48 bg-slate-900 rounded-xl mb-4 flex items-center justify-center">
                         <h4 className="text-xl font-bold text-white">Lotbet</h4>
                      </div>
                      <p className="text-xs text-slate-500 mb-4">Diseño oscuro premium con menú lateral.</p>
                      <button onClick={() => handleNextStep3('lotbet')} className="w-full py-2.5 bg-indigo-50 text-indigo-600 font-bold text-sm rounded-xl hover:bg-indigo-100 transition-colors">
                        Seleccionar Template
                      </button>
                    </div>

                    <div className="bg-white border-2 border-pink-500 rounded-2xl p-4 shadow-lg shadow-pink-500/10 relative overflow-hidden group">
                      <div className="absolute top-4 left-4 bg-pink-600 text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded">Activo</div>
                      <div className="h-48 bg-gradient-to-br from-pink-50 to-white rounded-xl mb-4 flex items-center justify-center border border-pink-100">
                         <h4 className="text-xl font-black text-slate-900">Evolution</h4>
                      </div>
                      <p className="text-xs text-slate-500 mb-4">Arquitectura avanzada, colores vibrantes.</p>
                      <button onClick={() => handleNextStep3('evolution')} className="w-full py-2.5 bg-pink-50 text-pink-600 font-bold text-sm rounded-xl hover:bg-pink-100 transition-colors">
                        Seleccionar Template
                      </button>
                    </div>
                  </>
                )}

                {docType === 'informe' && (
                  <>
                    <div className="bg-white border-2 border-indigo-500 rounded-2xl p-4 shadow-lg shadow-indigo-500/10 relative overflow-hidden group">
                      <div className="absolute top-4 left-4 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded">Activo</div>
                      <div className="h-48 bg-slate-900 rounded-xl mb-4 flex items-center justify-center">
                         <h4 className="text-xl font-bold text-white text-center">Lotbet Informe<br/><span className="text-sm font-normal text-slate-400">Dashboard</span></h4>
                      </div>
                      <p className="text-xs text-slate-500 mb-4">Plantilla con métricas de alto contraste.</p>
                      <button onClick={() => handleNextStep3('lotbet')} className="w-full py-2.5 bg-indigo-50 text-indigo-600 font-bold text-sm rounded-xl hover:bg-indigo-100 transition-colors">
                        Seleccionar Template
                      </button>
                    </div>

                    <div className="bg-white border-2 border-emerald-500 rounded-2xl p-4 shadow-lg shadow-emerald-500/10 relative overflow-hidden group">
                      <div className="absolute top-4 left-4 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded">Activo</div>
                      <div className="h-48 bg-emerald-900 rounded-xl mb-4 flex items-center justify-center">
                         <h4 className="text-xl font-black text-emerald-50 text-center">Informe WPlay<br/><span className="text-sm font-normal opacity-80">(Mundial)</span></h4>
                      </div>
                      <p className="text-xs text-slate-500 mb-4">Plantilla limpia con gráficos estelares.</p>
                      <button onClick={() => handleNextStep3('mundial')} className="w-full py-2.5 bg-emerald-50 text-emerald-600 font-bold text-sm rounded-xl hover:bg-emerald-100 transition-colors">
                        Seleccionar Template
                      </button>
                    </div>
                  </>
                )}

              </div>
            </div>
          )}

          {/* PASO 4: CONTENT */}
          {step === 4 && (
            <div className="max-w-2xl mx-auto pt-10">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-black text-slate-900 mb-2">Dale contexto a la IA</h3>
                <p className="text-slate-500">Sube tus archivos de información y generaremos las diapositivas con opciones de diseño para cada una.</p>
              </div>

              {/* Dropzone */}
              <div className="border-2 border-dashed border-indigo-200 bg-indigo-50/50 rounded-3xl p-12 flex flex-col items-center justify-center text-center relative hover:bg-indigo-50 transition-colors mb-6">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-indigo-600 mb-4">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <p className="text-lg font-bold text-indigo-900 mb-2">Arrastra tu brief, cotización en texto o documento aquí</p>
                <p className="text-sm text-indigo-400 font-medium">Soporta .txt, .md, .csv</p>
                
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
                <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-sm mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{fileName}</p>
                      <p className="text-xs text-slate-400">Contexto listo para analizar</p>
                    </div>
                  </div>
                  <button onClick={() => { setFileName(''); setAiPrompt(''); }} className="text-slate-400 hover:text-red-500 font-medium text-sm px-3 py-1 bg-slate-50 rounded-lg hover:bg-red-50">Quitar</button>
                </div>
              )}

              <button 
                onClick={handleCreateProject}
                disabled={isGenerating || !fileName}
                className="w-full bg-indigo-600 text-white font-bold py-4 px-6 rounded-2xl hover:bg-indigo-700 transition-colors shadow-xl shadow-indigo-600/20 disabled:opacity-50 disabled:shadow-none flex justify-center items-center gap-3 text-lg"
              >
                {isGenerating ? <><Loader2 className="w-6 h-6 animate-spin"/> Generando Diapositivas...</> : 'Construir Presentación Mágica ✨'}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
