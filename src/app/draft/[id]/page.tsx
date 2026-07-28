'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Bot, Send, ArrowRight, Loader2, PlayCircle, ArrowLeft, RefreshCw, Presentation, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function DraftRoom() {
  const params = useParams()
  const router = useRouter()
  
  const [session, setSession] = useState<any>(null)
  const [document, setDocument] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [outline, setOutline] = useState<any[]>([])

  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/login')
      else setSession(session)
    })
    
    if (params?.id) {
      fetchDocument()
    }
  }, [params])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function fetchDocument() {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', params?.id)
      .single()
      
    if (data) {
      setDocument(data)
      
      // If it has an initial prompt and no messages, trigger the first AI message
      if (data.content?.initialPrompt && messages.length === 0) {
        setMessages([{ role: 'user', content: data.content.initialPrompt }])
        sendMessageToAI([{ role: 'user', content: data.content.initialPrompt }], data)
      }
    }
    setLoading(false)
  }

  async function sendMessageToAI(chatHistory: Message[], docData: any) {
    setIsTyping(true)
    try {
      const response = await fetch('/api/chat/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: chatHistory, 
          template: docData?.content?.template,
          docType: docData?.type,
          clientName: docData?.client_name
        })
      })

      if (response.ok) {
        const data = await response.json()
        
        // Add AI response to chat
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
        
        // Update the visual outline if the AI returned a JSON structure
        if (data.outline && Array.isArray(data.outline)) {
          setOutline(data.outline)
        }
      } else {
        throw new Error('Error al contactar a la IA')
      }
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Hubo un error de conexión con mi sistema estructurador. ¿Podrías intentar de nuevo?' }])
    } finally {
      setIsTyping(false)
    }
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isTyping) return
    
    const newMsg: Message = { role: 'user', content: input }
    const newHistory = [...messages, newMsg]
    
    setMessages(newHistory)
    setInput('')
    sendMessageToAI(newHistory, document)
  }

  const handleGenerateFinal = async () => {
    if (outline.length === 0) {
      alert("La IA aún no ha definido una estructura de diapositivas.")
      return
    }
    
    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          outline, // Pasamos el esqueleto exacto
          template: document.content.template,
          clientName: document.client_name,
          prompt: messages.map(m => m.content).join('\n')
        })
      })

      let finalPages: any = [];
      if (response.ok) {
        const generatedData = await response.json()
        finalPages = generatedData.data?.pages;
      } else {
        console.warn("La IA falló o tardó demasiado (Timeout). Usando el esqueleto como fallback.");
      }

      // Validar que la respuesta sea un array de páginas válido. Si falla (o hubo error 504), construir fallback robusto.
      if (!Array.isArray(finalPages) || finalPages.length === 0 || !finalPages[0]?.variations) {
         console.warn("Estructura inválida o fallback activo. Construyendo desde el esqueleto.");
         finalPages = outline.map((slide: any, i: number) => ({
           id: `page-${Date.now()}-${i}`,
           name: slide.name || `Diapositiva ${i + 1}`,
           activeVariationIndex: 0,
           variations: [
             {
               layoutType: slide.templateId || 'content',
               data: { 
                 title: slide.name, 
                 content: slide.intent || 'Estructura base (la IA no pudo completar el texto).' 
               }
             }
           ]
         }))
      }

      // Update document with the final JSON and change status to borrador
      const { error } = await supabase.from('documents').update({
        status: 'borrador',
        content: { ...document.content, pages: finalPages }
      }).eq('id', document.id)

      if (error) throw error
      
      router.push(`/document/${document.id}`)
    } catch (err: any) {
      alert("Error crítico al actualizar el documento: " + err.message)
      setIsGenerating(false)
    }
  }

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-950 text-slate-400"><Loader2 className="w-8 h-8 animate-spin" /></div>

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
      
      {/* Left Panel: Chat Co-Pilot */}
      <div className="w-1/2 flex flex-col border-r border-slate-800 bg-slate-900/50">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-bold text-white text-lg flex items-center gap-2">
                <Bot className="w-5 h-5 text-indigo-400" />
                Co-Piloto Estructural
              </h1>
              <p className="text-xs text-slate-400">Definiendo estructura para: {document?.title}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-4 ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none' 
                  : 'bg-slate-800 text-slate-300 rounded-bl-none border border-slate-700/50 shadow-lg'
              }`}>
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                    <Bot className="w-3.5 h-3.5" /> IA Arquitecta
                  </div>
                )}
                <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-slate-800 rounded-2xl p-4 rounded-bl-none border border-slate-700 flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleSend} className="p-4 border-t border-slate-800 bg-slate-900">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ej: Agrega una diapositiva de influenciadores al final..."
              disabled={isTyping || isGenerating}
              className="w-full bg-slate-800 border border-slate-700 rounded-full py-3 pl-5 pr-14 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isTyping || isGenerating}
              className="absolute right-2 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full transition-colors disabled:opacity-50 disabled:hover:bg-indigo-600"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Right Panel: Outline Preview */}
      <div className="w-1/2 flex flex-col bg-slate-950 relative">
        {/* Background gradient effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="p-8 pb-4">
          <h2 className="text-2xl font-black text-white mb-2 flex items-center gap-2">
            <Presentation className="w-6 h-6 text-cyan-400" />
            Esqueleto Propuesto
          </h2>
          <p className="text-sm text-slate-400">
            Revisa el índice de diapositivas que la IA planea generar. Cuando estés de acuerdo, haz clic en Convertir para llenar el contenido real.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-8 pb-8">
          {outline.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-slate-800 rounded-2xl p-10 text-center relative z-10 bg-slate-900/20 backdrop-blur-sm">
              <RefreshCw className="w-12 h-12 mb-4 opacity-50 animate-spin-slow" />
              <h3 className="text-lg font-bold text-slate-400 mb-2">Esperando estructura...</h3>
              <p className="text-sm max-w-xs">La IA está procesando tu solicitud para armar el mejor flujo de diapositivas.</p>
            </div>
          ) : (
            <div className="space-y-4 relative z-10">
              {outline.map((slide, idx) => (
                <div key={idx} className="group relative flex items-start gap-4 p-4 rounded-xl bg-slate-900/80 backdrop-blur-sm border border-slate-800 hover:border-indigo-500/50 transition-all shadow-lg hover:shadow-indigo-500/10">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-sm text-indigo-400 border border-indigo-500/20">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-slate-200 truncate pr-4">{slide.name || `Diapositiva ${idx + 1}`}</h4>
                      <span className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-950 text-indigo-300 text-xs font-mono border border-indigo-900/50">
                        {slide.templateId}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {slide.intent || 'Contenido planeado no especificado.'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="p-6 border-t border-slate-900 bg-slate-950/80 backdrop-blur-xl relative z-20">
          <button
            onClick={handleGenerateFinal}
            disabled={outline.length === 0 || isGenerating || isTyping}
            className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold py-4 px-6 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-xl shadow-indigo-500/20"
          >
            <div className="relative flex items-center justify-center gap-2">
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> 
                  Convirtiendo y Generando Contenido...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Estoy de acuerdo, ¡Generar Propuesta Final!
                </>
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
