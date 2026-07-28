import React, { useState } from 'react';
import { ToggleRight, ToggleLeft, Star, ExternalLink, Camera } from 'lucide-react';

export const LevelMethodology: React.FC<{ data?: any }> = ({ data }) => {
  const [im, setIm] = useState(false);

  const toggleInfluencerMode = () => setIm(!im);

  return (
    <div className="animate-slide-right p-4 md:p-10 max-w-7xl mx-auto h-full flex flex-col justify-center text-slate-200">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold mb-4 uppercase text-white">Los 3 Momentos</h2>
        <p className="text-slate-400 max-w-2xl mx-auto mb-6">Nuestra estrategia de contenido cubre todo el ciclo de vida del evento.</p>
        
        <div className="flex flex-col items-center gap-3">
            <div onClick={toggleInfluencerMode} className={`inline-flex items-center gap-3 px-6 py-2 rounded-full cursor-pointer transition-all duration-300 border-2 ${im ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-900 border-slate-700 text-slate-400'}`}>
              <div className="font-bold text-sm uppercase tracking-wider">Modo Influencer</div>
              {im ? <ToggleRight className="w-8 h-8 text-cyan-400" /> : <ToggleLeft className="w-8 h-8 text-slate-600" />}
            </div>
            {im && <div className="flex items-center gap-2 text-xs text-cyan-400 animate-fade-in"><Star className="w-3 h-3 fill-cyan-400" /> Indica formato potenciado con Influencer</div>}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -z-10 transform -translate-y-1/2"></div>

        {/* PREVIA */}
        <div className={`p-8 rounded-xl border-2 transition-all group relative bg-slate-900 ${im ? 'border-indigo-500 shadow-lg shadow-indigo-500/10' : 'border-slate-800'}`}>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl mb-6 mx-auto transition-all ${im ? 'bg-indigo-600 text-white scale-110' : 'bg-slate-800 text-slate-500'}`}>1</div>
          <h3 className="text-xl font-black text-center mb-2 uppercase text-white">La Previa</h3>
          <p className="text-xs text-center text-slate-400 uppercase tracking-widest mb-6">Expectativa & Educación</p>
          
          <div className="space-y-3">
            <button className={`w-full text-left p-3 rounded-lg transition-all flex items-center justify-between group/item border ${im ? 'bg-indigo-900/40 text-white border-indigo-500/50' : 'bg-slate-800/50 text-slate-300 border-slate-700 hover:border-slate-600'}`}>
              <div>
                <strong className="block text-sm flex items-center gap-2">Street Content {im && <Star className="w-3 h-3 text-cyan-400 fill-cyan-400" />}</strong>
                <span className={`text-[10px] ${im ? 'text-indigo-200' : 'text-slate-500'}`}>Retos en la calle, vox pop e interacción (Tablets)</span>
              </div>
              <ExternalLink className="w-4 h-4 opacity-0 group-hover/item:opacity-100 text-indigo-400" />
            </button>

            <button className={`w-full text-left p-3 rounded-lg transition-all flex items-center justify-between group/item border ${im ? 'bg-indigo-900/40 text-white border-indigo-500/50' : 'bg-slate-800/50 text-slate-300 border-slate-700 hover:border-slate-600'}`}>
              <div>
                <strong className="block text-sm flex items-center gap-2">Interacción con el juego {im && <Star className="w-3 h-3 text-emerald-400 fill-emerald-400" />}</strong>
                <span className={`text-[10px] ${im ? 'text-indigo-200' : 'text-slate-500'}`}>Usuarios ganando (Efecto Pantalla)</span>
              </div>
              <ExternalLink className="w-4 h-4 opacity-0 group-hover/item:opacity-100 text-indigo-400" />
            </button>

            <button className={`w-full text-left p-3 rounded-lg transition-all flex items-center justify-between group/item border ${im ? 'bg-indigo-900/40 text-white border-indigo-500/50' : 'bg-slate-800/50 text-slate-300 border-slate-700 hover:border-slate-600'}`}>
              <div>
                <strong className="block text-sm flex items-center gap-2">Cápsulas Educativas {im && <Star className="w-3 h-3 text-cyan-400 fill-cyan-400" />}</strong>
                <span className={`text-[10px] ${im ? 'text-indigo-200' : 'text-slate-500'}`}>Explicar de forma entretenida</span>
              </div>
              <ExternalLink className="w-4 h-4 opacity-0 group-hover/item:opacity-100 text-indigo-400" />
            </button>
          </div>
        </div>

        {/* DURANTE */}
        <div className={`p-8 rounded-xl shadow-2xl transform md:-translate-y-4 transition-all ${im ? 'bg-slate-950 border border-cyan-500/50 scale-105 shadow-cyan-500/20' : 'bg-slate-950 border border-slate-800'}`}>
          <div className="w-12 h-12 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-xl mb-6 mx-auto animate-pulse shadow-lg shadow-indigo-500/30">2</div>
          <h3 className="text-xl font-black text-center mb-2 uppercase text-white">El Durante</h3>
          <p className="text-xs text-center text-indigo-300 uppercase tracking-widest mb-6">Cobertura en Vivo</p>
          
          <ul className="space-y-4 text-sm">
            <li className="flex gap-3 items-start">
              <div className="bg-slate-800 p-1.5 rounded-full"><Camera className="w-4 h-4 text-indigo-400" /></div>
              <div>
                <strong className="block font-bold text-slate-200">Historias Proveedor</strong>
                <span className="text-xs text-slate-500">Cobertura básica en tiempo real.</span>
              </div>
            </li>
            {im && (
            <div className="animate-fade-in pt-4 border-t border-slate-800 space-y-4">
                <li className="flex gap-3 items-start">
                  <div className="bg-cyan-500/20 p-1.5 rounded-full text-cyan-400"><Star className="w-4 h-4 fill-cyan-400" /></div>
                  <div>
                    <strong className="block font-bold text-cyan-400">Talento en Vivo</strong>
                    <span className="text-xs text-cyan-100/70">Influencer como animador.</span>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="bg-cyan-500/20 p-1.5 rounded-full text-cyan-400"><ExternalLink className="w-4 h-4" /></div>
                  <div>
                    <strong className="block font-bold text-cyan-400">Tráfico Web</strong>
                    <span className="text-xs text-cyan-100/70">Stories con Link directo al juego.</span>
                  </div>
                </li>
            </div>
            )}
          </ul>
        </div>

        {/* POST */}
        <div className={`p-8 rounded-xl border-2 transition-all group relative bg-slate-900 ${im ? 'border-indigo-500 shadow-lg shadow-indigo-500/10' : 'border-slate-800'}`}>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl mb-6 mx-auto transition-all ${im ? 'bg-indigo-600 text-white scale-110' : 'bg-slate-800 text-slate-500'}`}>3</div>
          <h3 className="text-xl font-black text-center mb-2 uppercase text-white">El Post</h3>
          <p className="text-xs text-center text-slate-400 uppercase tracking-widest mb-6">Amplificación</p>
          
          <div className="space-y-3">
            <button className={`w-full text-left p-3 rounded-lg transition-all flex items-center justify-between group/item border ${im ? 'bg-indigo-900/40 text-white border-indigo-500/50' : 'bg-slate-800/50 text-slate-300 border-slate-700 hover:border-slate-600'}`}>
              <div>
                <strong className="block text-sm flex items-center gap-2">Mejores Momentos {im && <Star className="w-3 h-3 text-cyan-400 fill-cyan-400" />}</strong>
                <span className={`text-[10px] ${im ? 'text-indigo-200' : 'text-slate-500'}`}>Clips / Reacciones</span>
              </div>
              <ExternalLink className="w-4 h-4 opacity-0 group-hover/item:opacity-100 text-indigo-400" />
            </button>

            <button className={`w-full text-left p-3 rounded-lg transition-all flex items-center justify-between group/item border ${im ? 'bg-indigo-900/40 text-white border-indigo-500/50' : 'bg-slate-800/50 text-slate-300 border-slate-700 hover:border-slate-600'}`}>
              <div>
                <strong className="block text-sm flex items-center gap-2">{im ? 'Behind The Scenes' : 'Teaser Resumen'} {im && <Star className="w-3 h-3 text-cyan-400 fill-cyan-400" />}</strong>
                <span className={`text-[10px] ${im ? 'text-indigo-200' : 'text-slate-500'}`}>{im ? 'Haciendo el recap con el influencer' : 'Recap cinematográfico'}</span>
              </div>
              <ExternalLink className="w-4 h-4 opacity-0 group-hover/item:opacity-100 text-indigo-400" />
            </button>

            <div className={`w-full text-left p-3 rounded-lg border ${im ? 'bg-indigo-900/40 text-white border-indigo-500/50' : 'bg-slate-800/50 text-slate-300 border-slate-700'}`}>
              <strong className="block text-sm flex items-center gap-2">Backstage Exclusivo {im && <Star className="w-3 h-3 text-cyan-400 fill-cyan-400" />}</strong>
              <span className={`text-[10px] ${im ? 'text-indigo-200' : 'text-slate-500'}`}>Jugadores + Talento</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 text-center">
        <button className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold uppercase tracking-wider text-sm hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20">
          Ver Roster de Influenciadores
        </button>
      </div>
    </div>
  );
};
