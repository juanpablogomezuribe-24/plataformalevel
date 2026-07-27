'use client'

import { Video } from 'lucide-react'

export default function VideoBlock({ data, onChange, readOnly = false }: { data: any, onChange?: (data: any) => void, readOnly?: boolean }) {
  // Helper to extract youtube ID
  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  const videoId = data.videoUrl ? getYoutubeId(data.videoUrl) : null

  return (
    <div className="w-full bg-slate-900 rounded-3xl overflow-hidden shadow-xl p-4 my-8 transition-all relative">
      {!readOnly && (
        <div className="mb-4 bg-slate-800 p-4 rounded-2xl flex items-center gap-4">
          <Video className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={data.videoUrl || ''}
            onChange={(e) => onChange && onChange({ ...data, videoUrl: e.target.value })}
            placeholder="Pega un enlace de YouTube aquí..."
            className="w-full bg-transparent outline-none text-slate-300 placeholder:text-slate-500 font-medium"
          />
        </div>
      )}

      <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center relative">
        {videoId ? (
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <div className="text-slate-600 flex flex-col items-center">
            <Video className="w-16 h-16 mb-4 opacity-20" />
            <span className="font-bold text-sm">El video aparecerá aquí</span>
          </div>
        )}
      </div>
    </div>
  )
}
