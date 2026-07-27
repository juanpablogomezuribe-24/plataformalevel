'use client'

import React from 'react';

export default function PropuestaEvolution({ data, brand }: { data: any, brand?: any }) {
  const cover = data?.cover || { title: 'Propuesta Confidencial', subtitle: 'Evolution' };
  const sections = data?.sections || [];

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white selection:bg-pink-500 selection:text-white font-sans">
      {/* Header */}
      <header className="px-6 md:px-10 py-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-[#0a0a0a]/90 backdrop-blur-xl z-50">
        <div className="flex items-center gap-4">
          <div className="font-black text-2xl tracking-tighter text-white">LEVEL<span className="text-pink-500">.</span></div>
          <span className="w-px h-6 bg-white/20"></span>
          <span className="text-sm font-bold tracking-widest uppercase text-white/50">{cover.subtitle}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-[10px] font-black tracking-widest text-white/50">ACTIVE</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 md:py-20 space-y-24">
        
        {/* Cover */}
        <section className="text-center space-y-6">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight bg-gradient-to-r from-white via-white/80 to-white/40 bg-clip-text text-transparent">
            {cover.title}
          </h1>
          <p className="text-xl text-white/50 max-w-2xl mx-auto">
            {cover.description || 'Estrategia, arquitectura y desarrollo de la nueva fase digital.'}
          </p>
          <div className="pt-8 flex justify-center">
             <div className="w-16 h-16 rounded-full border border-pink-500/30 flex items-center justify-center text-pink-500 animate-bounce">
                ↓
             </div>
          </div>
        </section>

        {/* Dynamic Sections */}
        {sections.map((section: any, idx: number) => (
          <section key={idx} className="relative">
            <div className="absolute -left-4 md:-left-12 top-0 h-full w-px bg-gradient-to-b from-pink-500/50 to-transparent"></div>
            <div className="absolute -left-[21px] md:-left-[53px] top-0 w-3 h-3 rounded-full bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.5)]"></div>
            
            <div className="pl-6 md:pl-0">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">{section.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {section.blocks && section.blocks.map((block: any, bIdx: number) => (
                  <div key={bIdx} className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors group">
                    {block.icon && <div className="text-3xl mb-6">{block.icon}</div>}
                    <h3 className="text-xl font-bold mb-4 text-white group-hover:text-pink-400 transition-colors">{block.title}</h3>
                    <p className="text-white/60 leading-relaxed">{block.content}</p>
                    {block.price && (
                      <div className="mt-8 pt-6 border-t border-white/10">
                        <span className="text-2xl font-black text-white">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(block.price)}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* Summary Footer */}
        <section className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-3xl p-10 md:p-16 text-center">
          <h2 className="text-3xl font-black mb-6">Inversión Estimada</h2>
          <div className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter">
            {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(data?.totalPrice || 0)}
          </div>
          <button className="bg-pink-600 hover:bg-pink-500 text-white font-bold py-4 px-10 rounded-full transition-colors shadow-[0_0_30px_rgba(236,72,153,0.3)]">
            Aprobar Propuesta
          </button>
        </section>

      </main>
    </div>
  );
}
