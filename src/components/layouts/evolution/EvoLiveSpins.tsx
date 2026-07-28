import React, { useState } from 'react';
import { Calendar, Clock, User, BarChart } from 'lucide-react';

export interface LiveInfluencer {
  name: string;
  cost: number;
  image: string;
}

interface EvoLiveSpinsProps {
  data?: {
    liveInfluencers: Record<string, LiveInfluencer>;
    logoGlobal?: string;
  };
}

export const EvoLiveSpins: React.FC<EvoLiveSpinsProps> = ({ data }) => {
  const [selectedInfluencer, setSelectedInfluencer] = useState('conragen');
  
  const liveInfluencers = data?.liveInfluencers || {
    conragen: { name: "Conragen", cost: 470, image: "" }
  };
  
  const influencer = liveInfluencers[selectedInfluencer];
  if (!influencer) return null;

  const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(amount);
  };

  const weeklyCost = (influencer.cost * 4) * 1.3;
  const intensiveCost = (influencer.cost * 12) * 1.3;

  return (
    <div className="animate-slide-right p-4 md:p-10 max-w-7xl mx-auto pb-20 text-slate-200">
        <div className="text-center mb-8">
            <div className="inline-block px-4 py-1.5 mb-4 rounded-full bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider animate-pulse shadow-lg shadow-indigo-500/20">
                NUEVO PILOTO
            </div>
            <h2 className="text-3xl font-extrabold mb-4 uppercase text-white">Propuesta Live Spins</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Selecciona un talento para calcular la inversión del piloto.</p>
        </div>

        <div className="flex justify-center gap-4 mb-12 flex-wrap">
            {Object.keys(liveInfluencers).map(key => (
                <button key={key} onClick={() => setSelectedInfluencer(key)} 
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all w-28 md:w-32 group hover:scale-105
                    ${selectedInfluencer === key ? 'border-indigo-500 bg-slate-800 shadow-lg shadow-indigo-500/20' : 'border-transparent hover:border-slate-700'}`}>
                    <img src={liveInfluencers[key].image} className={`w-16 h-16 rounded-full object-cover shadow-sm ${selectedInfluencer === key ? 'ring-2 ring-indigo-400' : 'opacity-70 group-hover:opacity-100'}`} alt={liveInfluencers[key].name} />
                    <span className={`text-xs font-bold text-center leading-tight ${selectedInfluencer === key ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>{liveInfluencers[key].name}</span>
                </button>
            ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Package 1: Semanal */}
            <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 shadow-xl relative overflow-hidden group hover:border-indigo-500/50 transition-all">
                 <div className="absolute top-0 right-0 p-6 opacity-10">
                    <img src={data?.logoGlobal} className="h-8 invert" alt="Evolution" />
                 </div>
                 <div className="mb-6 border-b border-slate-800 pb-4">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Opción 1</span>
                    <h3 className="text-2xl font-black mt-1 text-white">Piloto Semanal</h3>
                    <p className="text-sm text-slate-400 mt-2">Prueba de concepto y medición de tracción inicial.</p>
                 </div>
                 
                 <ul className="space-y-4 mb-8">
                    <li className="flex items-center gap-3">
                        <div className="bg-slate-800 p-1.5 rounded-full text-indigo-400"><Calendar className="w-4 h-4" /></div>
                        <span className="text-sm font-medium text-slate-300"><strong className="text-white">1 Transmisión</strong> semanal</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <div className="bg-slate-800 p-1.5 rounded-full text-indigo-400"><Clock className="w-4 h-4" /></div>
                        <span className="text-sm font-medium text-slate-300">Duración: <strong className="text-white">2 Horas</strong> por sesión</span>
                    </li>
                     <li className="flex items-center gap-3">
                        <div className="bg-slate-800 p-1.5 rounded-full text-indigo-400"><User className="w-4 h-4" /></div>
                        <span className="text-sm font-medium text-slate-300">Talento: <strong className="text-white">{influencer.name}</strong></span>
                    </li>
                     <li className="flex items-center gap-3">
                        <div className="bg-slate-800 p-1.5 rounded-full text-indigo-400"><BarChart className="w-4 h-4" /></div>
                        <span className="text-sm font-medium text-slate-300">Total: <strong className="text-white">4 Transmisiones</strong> al mes</span>
                    </li>
                 </ul>

                 <div className="bg-slate-950/50 p-4 rounded-xl mb-6 border border-slate-800">
                    <h4 className="text-xs font-bold uppercase tracking-wide mb-2 text-indigo-400">Gestión Level Incluida:</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        Coordinación completa, educación sobre producto, informes de rendimiento y pago al talento.
                    </p>
                 </div>

                 <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800">
                    <span className="text-xs font-bold text-slate-500 uppercase">Inversión Total</span>
                    <span className="text-xl font-black text-white">{formatCurrency(weeklyCost)}</span>
                 </div>
            </div>

            {/* Package 2: Intensivo */}
            <div className="bg-indigo-900/20 border border-indigo-500/30 text-white p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group transform md:-translate-y-4">
                 <div className="absolute top-0 right-0 p-6 opacity-20">
                    <img src={data?.logoGlobal} className="h-8 invert" alt="Evolution" />
                 </div>
                 <div className="mb-6 border-b border-indigo-500/20 pb-4">
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Opción 2</span>
                    <h3 className="text-2xl font-black mt-1 text-white">Piloto Intensivo</h3>
                    <p className="text-sm text-indigo-200/70 mt-2">Generación de hábito y comunidad recurrente.</p>
                 </div>
                 
                 <ul className="space-y-4 mb-8">
                    <li className="flex items-center gap-3">
                        <div className="bg-indigo-600/30 p-1.5 rounded-full text-cyan-400"><Calendar className="w-4 h-4" /></div>
                        <span className="text-sm font-medium"><strong className="text-white">3 Transmisiones</strong> semanales</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <div className="bg-indigo-600/30 p-1.5 rounded-full text-cyan-400"><Clock className="w-4 h-4" /></div>
                        <span className="text-sm font-medium">Duración: <strong className="text-white">2 Horas</strong> por sesión</span>
                    </li>
                     <li className="flex items-center gap-3">
                        <div className="bg-indigo-600/30 p-1.5 rounded-full text-cyan-400"><User className="w-4 h-4" /></div>
                        <span className="text-sm font-medium">Talento: <strong className="text-white">{influencer.name}</strong></span>
                    </li>
                     <li className="flex items-center gap-3">
                        <div className="bg-indigo-600/30 p-1.5 rounded-full text-cyan-400"><BarChart className="w-4 h-4" /></div>
                        <span className="text-sm font-medium">Total: <strong className="text-white">12 Transmisiones</strong> al mes</span>
                    </li>
                 </ul>

                 <div className="bg-indigo-950/40 p-4 rounded-xl mb-6 border border-indigo-500/20">
                    <h4 className="text-xs font-bold uppercase tracking-wide mb-2 text-cyan-400">Gestión Level Incluida:</h4>
                    <p className="text-xs text-indigo-200/80 leading-relaxed">
                        Coordinación completa, educación sobre producto, informes de rendimiento y pago al talento.
                    </p>
                 </div>

                 <div className="flex items-center justify-between mt-auto pt-4 border-t border-indigo-500/20">
                    <span className="text-xs font-bold text-indigo-300 uppercase">Inversión Total</span>
                    <span className="text-xl font-black text-cyan-400">{formatCurrency(intensiveCost)}</span>
                 </div>
            </div>
        </div>
    </div>
  );
};
