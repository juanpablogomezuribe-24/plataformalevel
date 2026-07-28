'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Maximize, Minimize } from 'lucide-react'
import PageRenderer from './PageRenderer'

interface DocumentViewerProps {
  doc: any
}

export default function DocumentViewer({ doc }: DocumentViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const pages = doc.content?.pages || []
  const template = doc.content?.template || 'genérica'
  const brandColor = doc.content?.brand?.color || '#4f46e5'

  const handleNext = useCallback(() => {
    if (currentIndex < pages.length - 1) {
      setCurrentIndex(prev => prev + 1)
    }
  }, [currentIndex, pages.length])

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
    }
  }, [currentIndex])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'Space') {
      handleNext()
    } else if (e.key === 'ArrowLeft') {
      handlePrev()
    }
  }, [handleNext, handlePrev])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err: any) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  if (pages.length === 0) {
    return <div className="h-screen flex items-center justify-center bg-slate-900 text-white">Documento vacío.</div>
  }

  const activePage = pages[currentIndex]

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black text-white flex flex-col">
      {/* HEADER / BRAND (Optional overlay) */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50 pointer-events-none">
        {doc.content?.brand?.logoUrl && (
          <img src={doc.content.brand.logoUrl} alt="Logo" className="h-8 object-contain drop-shadow-md opacity-80" />
        )}
        <div className="pointer-events-auto flex gap-4 items-center">
          <button 
            onClick={toggleFullscreen}
            className="p-2 rounded-full bg-black/20 hover:bg-black/50 backdrop-blur-md transition text-white border border-white/10"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* RENDERER */}
      <div className="flex-1 relative w-full h-full">
         {/* Wrap PageRenderer inside its own AnimatePresence wrapper handled inside it, or handled here? 
             PageRenderer already has AnimatePresence and motion.div, so we just pass the page.
             It keys off page.id + layoutType, so it will automatically animate!
         */}
         <PageRenderer page={activePage} template={template} brandColor={brandColor} />
      </div>

      {/* NAVIGATION CONTROLS */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto flex items-center gap-4 bg-black/30 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10 shadow-2xl">
        <button 
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="p-2 rounded-full hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>

        <div className="flex gap-1.5 items-center px-4">
          {pages.map((_: any, idx: number) => (
            <button 
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-6 bg-white' : 'bg-white/30 hover:bg-white/60'}`}
            />
          ))}
        </div>

        <button 
          onClick={handleNext}
          disabled={currentIndex === pages.length - 1}
          className="p-2 rounded-full hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  )
}
