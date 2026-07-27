import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { MessageSquare, X, Check, Send } from 'lucide-react'

export default function CommentSidebar({ document, session }: { document: any, session: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchComments = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('document_comments')
      .select('*')
      .eq('document_id', document.id)
      .order('created_at', { ascending: true })
    
    if (data) setComments(data)
    setLoading(false)
  }

  useEffect(() => {
    if (isOpen) {
      fetchComments()
    }
  }, [isOpen, document.id])

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const { error } = await supabase.from('document_comments').insert({
      document_id: document.id,
      user_id: session?.user?.id,
      user_email: session?.user?.email,
      content: newComment,
      resolved: false
    })

    if (error) {
      alert("Asegúrate de haber ejecutado el SQL para crear la tabla document_comments. Error: " + error.message)
    } else {
      setNewComment('')
      fetchComments()
    }
  }

  const toggleResolve = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('document_comments')
      .update({ resolved: !currentStatus })
      .eq('id', id)

    if (!error) {
      fetchComments()
    }
  }

  const unresolvedCount = comments.filter(c => !c.resolved).length

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm relative"
        title="Comentarios"
      >
        <MessageSquare className="w-4 h-4" /> Comentarios
        {unresolvedCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
            {unresolvedCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-y-0 right-0 w-96 bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col font-sans">
          <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-500" />
              Comentarios
            </h2>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {loading && comments.length === 0 ? (
              <div className="text-center text-slate-500 py-10 font-bold text-sm">Cargando...</div>
            ) : comments.length === 0 ? (
              <div className="text-center text-slate-400 py-10">
                <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-20" />
                <p className="font-bold text-sm">No hay comentarios aún</p>
                <p className="text-xs mt-1">Deja notas para que el equipo las revise.</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className={`bg-white border rounded-xl p-4 shadow-sm transition-all ${comment.resolved ? 'border-emerald-200 bg-emerald-50/50' : 'border-slate-200'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-xs font-bold text-slate-700 truncate pr-2">
                      {comment.user_email?.split('@')[0] || 'Usuario'}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 flex-shrink-0">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <p className={`text-sm mb-3 ${comment.resolved ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                    {comment.content}
                  </p>
                  <button 
                    onClick={() => toggleResolve(comment.id, comment.resolved)}
                    className={`text-xs font-bold py-1 px-3 rounded-lg flex items-center gap-1 transition-colors ${
                      comment.resolved 
                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Check className="w-3 h-3" />
                    {comment.resolved ? 'Resuelto' : 'Marcar como resuelto'}
                  </button>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleAddComment} className="p-4 border-t border-slate-200 bg-white flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escribe un comentario..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button 
              type="submit"
              disabled={!newComment.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white p-2 rounded-xl transition-colors flex items-center justify-center w-10 h-10"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
