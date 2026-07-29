import React from 'react';
import { motion } from 'framer-motion';

export interface LevelCoverData {
  title?: string;
  subtitle?: string;
  description?: string;
}

export const LevelCover: React.FC<{ data: LevelCoverData }> = ({ data }) => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center text-center p-12 bg-[#0B1120] text-white relative overflow-hidden group">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-indigo-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 transition-all duration-1000 group-hover:bg-indigo-500/20"></div>
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-fuchsia-500/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 transition-all duration-1000 group-hover:bg-fuchsia-500/20"></div>
      
      {/* Content Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center max-w-5xl"
      >
        {/* Top Accent */}
        <div className="w-24 h-1.5 mb-12 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 shadow-[0_0_20px_rgba(99,102,241,0.5)]"></div>
        
        {/* Title */}
        <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight tracking-tighter bg-gradient-to-br from-white via-indigo-50 to-slate-400 bg-clip-text text-transparent drop-shadow-sm">
          {data.title || 'Título Principal'}
        </h1>
        
        {/* Subtitle */}
        <h2 className="text-2xl md:text-4xl font-light tracking-wide text-indigo-300 mb-10 max-w-4xl">
          {data.subtitle || 'Subtítulo o línea de impacto para cautivar a tu cliente'}
        </h2>
        
        {/* Description */}
        {data.description && (
          <p className="text-xl md:text-2xl font-light leading-relaxed text-slate-400 max-w-3xl backdrop-blur-sm bg-white/5 p-8 rounded-3xl border border-white/10 shadow-2xl">
            {data.description}
          </p>
        )}
      </motion.div>
    </div>
  );
};
