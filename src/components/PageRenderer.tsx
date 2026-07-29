'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LevelCover, LevelObjective, LevelMethodology, LevelCatalog, LevelTimeline
} from './layouts/level';
import {
  LotbetCover, LotbetContext, LotbetObjective, LotbetStrategy, LotbetExecution, LotbetFinancial
} from './layouts/lotbet';

interface Variation {
  layoutType: string
  data: any
}

interface Page {
  id: string
  name: string
  activeVariationIndex: number
  variations: Variation[]
}

interface PageRendererProps {
  page: Page
  brandColor?: string
  template?: string
}

export default function PageRenderer({ page, brandColor = '#4f46e5', template = 'genérica' }: PageRendererProps) {
  if (!page || !page.variations || page.variations.length === 0) {
    return <div className="p-8 text-center text-slate-400">Página sin contenido.</div>
  }

  const activeVariation = page.variations[page.activeVariationIndex] || page.variations[0]
  if (!activeVariation) return null

  const { layoutType, data = {} } = activeVariation

  // SANITIZACIÓN ROBUSTA: Prevenir crashes si la IA alucina objetos en vez de arrays o si faltan.
  const safeData = { ...data };
  const knownArrayKeys = ['goals', 'phases', 'items', 'milestones'];
  
  // 1. Si un campo conocido falta, inicializarlo como array vacío
  knownArrayKeys.forEach(key => {
    if (safeData[key] === undefined || safeData[key] === null) {
      safeData[key] = [];
    }
  });

  // 2. Si un objeto se devolvió en vez de un array (ej: { "0": {...} }), lo convertimos.
  for (const key of Object.keys(safeData)) {
    if (typeof safeData[key] === 'object' && safeData[key] !== null && !Array.isArray(safeData[key])) {
       safeData[key] = Object.values(safeData[key]);
    }
  }

  // THEMES CONFIGURATION
  const isLotbet = template === 'lotbet'
  const isMundial = template === 'mundial'
  const isEvolution = template === 'evolution'
  const isDark = isLotbet || isMundial || isEvolution

  // ESTILOS BASE SEGÚN TEMPLATE
  const bgClass = isLotbet ? 'bg-[#0B1120] text-white' : 
                  isMundial ? 'bg-gradient-to-br from-emerald-950 to-slate-900 text-white' : 
                  isEvolution ? 'bg-slate-950 text-white' : 
                  'bg-white text-slate-900'

  const titleClass = isLotbet ? 'bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent' :
                     isMundial ? 'text-emerald-400' :
                     isEvolution ? 'bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent' :
                     'text-slate-900'

  const cardClass = isLotbet ? 'bg-slate-800/50 backdrop-blur-md border border-slate-700/50 text-white' :
                    isMundial ? 'bg-white/5 backdrop-blur-xl border border-emerald-500/20 text-white' :
                    isEvolution ? 'bg-white/5 backdrop-blur-2xl border border-pink-500/20 text-white' :
                    'bg-slate-50 border border-slate-100 text-slate-700 shadow-sm'

  const textMutedClass = isDark ? 'text-slate-400' : 'text-slate-500'
  const textNormalClass = isDark ? 'text-slate-300' : 'text-slate-600'

  const renderLayout = () => {
    switch (layoutType) {
    // --- 5 PREMIUM LAYOUTS ---
    case 'level-cover': return <LevelCover data={safeData} />
    case 'level-objective': return <LevelObjective data={safeData} />
    case 'level-methodology': return <LevelMethodology data={safeData} />
    case 'level-catalog': return <LevelCatalog data={safeData} />
    case 'level-timeline': return <LevelTimeline data={safeData} />
    
    // --- LOTBET LAYOUTS ---
    case 'lotbet-cover': return <LotbetCover data={safeData} />
    case 'lotbet-context': return <LotbetContext data={safeData} />
    case 'lotbet-objective': return <LotbetObjective data={safeData} />
    case 'lotbet-strategy': return <LotbetStrategy data={safeData} />
    case 'lotbet-execution': return <LotbetExecution data={safeData} />
    case 'lotbet-financial': return <LotbetFinancial data={safeData} />
    
    // --- FALLBACK GENÉRICO (Por si la IA o el caché devuelven uno viejo) ---
    default:
      return (
        <div className={`w-full h-full p-16 flex flex-col justify-center ${bgClass} relative overflow-hidden`}>
          <h2 className={`text-5xl font-black mb-10 tracking-tight ${titleClass}`}>{safeData.title || 'Sección Desconocida'}</h2>
          <div className={`text-2xl leading-relaxed max-w-5xl relative z-10 font-light ${textNormalClass}`}>
            Este layout antiguo ({layoutType}) ya no está disponible en la versión Premium.
            Por favor, selecciona uno de los 5 diseños principales desde el panel izquierdo.
          </div>
        </div>
      )
    }
  }
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${page.id}-${layoutType}-${page.activeVariationIndex}`}
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: -10 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="w-full h-full origin-center"
      >
        {renderLayout()}
      </motion.div>
    </AnimatePresence>
  )
}
