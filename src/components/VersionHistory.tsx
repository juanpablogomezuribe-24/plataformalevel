import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { History, X, Clock, RotateCcw } from 'lucide-react'

export default function VersionHistory({ document, onRestore }: { document: any, onRestore: (title: string, content: any) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [versions, setVersions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false)
  const [versionName, setVersionName] = useState('Respaldo manual')

  const fetchVersions = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('document_versions')
      .select('*')
      .eq('document_id', document.id)
      .order('created_at', { ascending: false })
    
    if (data) setVersions(data)
    setLoading(false)
  }

  useEffect(() => {
    if (isOpen) {
      fetchVersions()
    }
  }, [isOpen, document.id])

  const handleRestore = (version: any) => {
    if (confirm(`¿Estás seguro de restaurar la versión "${version.version_name}" del ${new Date(version.created_at).toLocaleString()}? Los cambios actuales no guardados se perderán.`)) {
      onRestore(version.title, version.content)
      setIsOpen(false)
    }
  }

  const saveManualSnapshot = async () => {
    if (!versionName.trim()) {
      setShowPrompt(false)
      return
    }
    setLoading(true)

    const { error } = await supabase.from('document_versions').insert({
      document_id: document.id,
      version_name: versionName,
      title: document.title,
      content: document.content
    })

    if (error) {
      alert("Error al guardar versión: " + error.message)
    } else {
      fetchVersions()
    }
    setLoading(false)
    setShowPrompt(false)
    setVersionName('Respaldo manual')
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-lg"
        title="Historial de Versiones"
      >
        <History className="w-4 h-4" /> Historial
      </button>

      {isOpen && (
        <div className="fixed inset-y-0 right-0 w-96 bg-slate-900 border-l border-slate-800 shadow-2xl z-50 flex flex-col font-sans">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-400" />
              Historial
            </h2>
            <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-4 border-b border-slate-800 bg-slate-900/50">
            {showPrompt ? (
              <div className="flex flex-col gap-2">
                <input 
                  type="text" 
                  value={versionName}
                  onChange={(e) => setVersionName(e.target.value)}
                  className="w-full bg-slate-950 text-white text-sm px-3 py-2 rounded-lg border border-slate-700 outline-none focus:border-indigo-500"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowPrompt(false)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={saveManualSnapshot}
                    disabled={loading}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 rounded-lg transition-colors"
                  >
                    {loading ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setShowPrompt(true)}
                disabled={loading}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold py-3 px-4 rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2"
              >
                Guardar Versión Actual
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {loading && versions.length === 0 ? (
              <div className="text-center text-slate-500 py-10 font-bold">Cargando historial...</div>
            ) : versions.length === 0 ? (
              <div className="text-center text-slate-500 py-10">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="font-bold text-sm">No hay versiones guardadas</p>
                <p className="text-xs mt-1">Se crearán automáticamente al cambiar de estado.</p>
              </div>
            ) : (
              versions.map((version) => (
                <div key={version.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-slate-600 transition-colors group">
                  <h3 className="font-bold text-white text-sm mb-1">{version.version_name}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                    <Clock className="w-3 h-3" />
                    {new Date(version.created_at).toLocaleString()}
                  </div>
                  <button 
                    onClick={() => handleRestore(version)}
                    className="w-full bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white text-xs font-bold py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Restaurar esta versión
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  )
}
