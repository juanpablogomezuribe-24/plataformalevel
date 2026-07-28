import React, { useState } from 'react';
import { 
  Trophy, Star, MonitorPlay, TrendingUp, Lightbulb, Zap, 
  Layers, Users, Handshake, ChevronLeft, ChevronRight, 
  Camera, Scissors, ArrowDown, Share2, MessageCircle 
} from 'lucide-react';

export interface StrategyStep {
  id: number;
  label: string;
  icon: string; // We map string icons to Lucide components below
  title: string;
  content: string;
  highlight?: string;
  type: string;
}

interface EvoStrategyProps {
  data?: {
    strategySteps: StrategyStep[];
    logoGlobal?: string;
  };
}

const iconMap: Record<string, React.ReactNode> = {
  briefcase: <Trophy className="w-24 h-24 text-indigo-400 stroke-1" />,
  star: <Star className="w-24 h-24 text-indigo-400 stroke-1" />,
  target: <MonitorPlay className="w-24 h-24 text-indigo-400 stroke-1" />,
  rocket: <TrendingUp className="w-24 h-24 text-indigo-400 stroke-1" />
};

export const EvoStrategy: React.FC<EvoStrategyProps> = ({ data }) => {
  const [strategyStep, setStrategyStep] = useState(1);
  const steps = data?.strategySteps || [];
  const step = steps[strategyStep - 1];

  if (!step) return null;

  const nextStep = () => {
    if (strategyStep < steps.length) setStrategyStep(strategyStep + 1);
  };

  const prevStep = () => {
    if (strategyStep > 1) setStrategyStep(strategyStep - 1);
  };

  const renderContentRight = () => {
    if (step.type === 'visuals_1') {
      return (
        <div className="flex flex-wrap gap-4 mt-8">
           <div className="flex items-center gap-2 bg-slate-900 px-4 py-3 rounded-xl border border-indigo-500/30 shadow-lg shadow-indigo-500/10">
              <div className="bg-indigo-600 p-1.5 rounded-full text-white"><Trophy className="w-4 h-4" /></div>
              <span className="text-xs font-bold uppercase tracking-wide text-indigo-100">Visibilidad #1</span>
           </div>
           <div className="flex items-center gap-2 bg-slate-900 px-4 py-3 rounded-xl border border-indigo-500/30 shadow-lg shadow-indigo-500/10">
              <div className="bg-indigo-600 p-1.5 rounded-full text-white"><Star className="w-4 h-4" /></div>
              <span className="text-xs font-bold uppercase tracking-wide text-indigo-100">Diferenciación</span>
           </div>
           <div className="flex items-center gap-2 bg-slate-900 px-4 py-3 rounded-xl border border-indigo-500/30 shadow-lg shadow-indigo-500/10">
              <div className="bg-indigo-600 p-1.5 rounded-full text-white"><MonitorPlay className="w-4 h-4" /></div>
              <span className="text-xs font-bold uppercase tracking-wide text-indigo-100">Estrategia</span>
           </div>
        </div>
      );
    }
    if (step.type === 'visuals_3') {
      return (
        <div className="flex flex-wrap gap-3 mt-8">
           <div className="flex items-center gap-2 bg-slate-900 px-3 py-2 rounded-lg border border-indigo-500/30 shadow-lg">
              <div className="bg-cyan-500 p-1 rounded-full text-slate-900"><TrendingUp className="w-3 h-3" /></div>
              <span className="text-[10px] font-bold uppercase tracking-wide text-cyan-400">Tendencias</span>
           </div>
           <div className="flex items-center gap-2 bg-slate-900 px-3 py-2 rounded-lg border border-indigo-500/30 shadow-lg">
              <div className="bg-cyan-500 p-1 rounded-full text-slate-900"><Lightbulb className="w-3 h-3" /></div>
              <span className="text-[10px] font-bold uppercase tracking-wide text-cyan-400">Innovación</span>
           </div>
           <div className="flex items-center gap-2 bg-slate-900 px-3 py-2 rounded-lg border border-indigo-500/30 shadow-lg">
              <div className="bg-cyan-500 p-1 rounded-full text-slate-900"><Zap className="w-3 h-3" /></div>
              <span className="text-[10px] font-bold uppercase tracking-wide text-cyan-400">Velocidad</span>
           </div>
        </div>
      );
    }
    if (step.type === 'visuals_4') {
      return (
        <div className="flex flex-wrap gap-3 mt-8">
           <div className="flex items-center gap-2 bg-slate-900 px-3 py-2 rounded-lg border border-emerald-500/30 shadow-lg">
              <div className="bg-emerald-500 p-1 rounded-full text-slate-900"><Layers className="w-3 h-3" /></div>
              <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-400">Fábrica de Contenido</span>
           </div>
           <div className="flex items-center gap-2 bg-slate-900 px-3 py-2 rounded-lg border border-emerald-500/30 shadow-lg">
              <div className="bg-emerald-500 p-1 rounded-full text-slate-900"><Users className="w-3 h-3" /></div>
              <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-400">Influence Marketing</span>
           </div>
           <div className="flex items-center gap-2 bg-slate-900 px-3 py-2 rounded-lg border border-emerald-500/30 shadow-lg">
              <div className="bg-emerald-500 p-1 rounded-full text-slate-900"><Handshake className="w-3 h-3" /></div>
              <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-400">Soluciones B2B</span>
           </div>
        </div>
      );
    }
    if (step.type === 'cycle') {
      return (
        <div className="mt-6">
            <div className="bg-indigo-900/30 border-l-4 border-indigo-500 p-4 rounded-r-xl mb-6">
                <p className="text-sm font-bold text-indigo-200 italic">"{step.highlight}"</p>
            </div>
            
            <div className="bg-slate-900/50 border border-indigo-500/20 p-6 rounded-2xl shadow-xl backdrop-blur-sm">
                <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400/70 mb-4">El Flujo Level</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 relative">
                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 hover:border-indigo-400 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="bg-indigo-600 p-1.5 rounded-lg text-white"><Lightbulb className="w-4 h-4" /></div>
                            <span className="font-bold text-sm text-indigo-100">Creatividad</span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed">
                            Revisamos tendencias de contenido. Pensamos en ideas innovadoras. Construimos guiones y ganchos visuales.
                        </p>
                    </div>
                    
                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 hover:border-indigo-400 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="bg-indigo-600 p-1.5 rounded-lg text-white"><Camera className="w-4 h-4" /></div>
                            <span className="font-bold text-sm text-indigo-100">Producción</span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed">
                            Coordinamos fechas, tiempos y lugares para la grabación con equipos profesionales.
                        </p>
                    </div>
                    
                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 hover:border-indigo-400 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="bg-indigo-600 p-1.5 rounded-lg text-white"><Scissors className="w-4 h-4" /></div>
                            <span className="font-bold text-sm text-indigo-100">Edición</span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed">
                            Revisamos el material y montamos la linea grafica y narrativa del contenido.
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center justify-center mb-6">
                    <div className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                        Entrega al Cliente <ArrowDown className="w-3 h-3" />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-emerald-900/20 p-4 rounded-xl border border-emerald-500/30">
                     <div className="flex flex-col items-center text-center gap-1">
                        <div className="w-8 h-8 bg-emerald-900/50 text-emerald-400 rounded-full flex items-center justify-center"><Share2 className="w-4 h-4" /></div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 mt-1">Publicación</span>
                     </div>
                     <ChevronRight className="w-3 h-3 text-emerald-600 hidden md:block" />
                     <div className="flex flex-col items-center text-center gap-1">
                        <div className="w-8 h-8 bg-emerald-900/50 text-emerald-400 rounded-full flex items-center justify-center"><MessageCircle className="w-4 h-4" /></div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 mt-1">Conversación</span>
                     </div>
                     <ChevronRight className="w-3 h-3 text-emerald-600 hidden md:block" />
                     <div className="flex flex-col items-center text-center gap-1">
                        <div className="w-8 h-8 bg-emerald-500 text-slate-900 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20"><TrendingUp className="w-4 h-4" /></div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-300 mt-1">Resultados</span>
                     </div>
                </div>
            </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="animate-slide-up p-4 md:p-10 max-w-5xl mx-auto h-full flex flex-col justify-center text-slate-200">
        <div className="flex justify-center items-center gap-2 mb-8">
            {steps.map(s => (
                <div key={s.id} className={`h-1.5 rounded-full transition-all duration-500 ${s.id === strategyStep ? 'w-12 bg-indigo-500' : s.id < strategyStep ? 'w-4 bg-indigo-900' : 'w-4 bg-slate-800'}`}></div>
            ))}
        </div>
        
        <div className="bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-indigo-500/10 border border-slate-800 overflow-hidden relative min-h-[450px] flex flex-col md:flex-row">
            <div className="md:w-1/3 bg-slate-950 p-8 flex flex-col justify-between relative overflow-hidden border-r border-slate-800">
                 <div className="absolute top-0 right-0 p-6 opacity-10">
                     <img src={data?.logoGlobal} className="h-32 opacity-20 invert rotate-12" alt="Evolution" />
                 </div>
                 <div className="relative z-10">
                   <span className="text-xs font-bold tracking-[0.2em] text-cyan-500 uppercase mb-2 block">Paso 0{step.id}</span>
                   <h3 className="text-2xl font-black uppercase tracking-tight text-white">{step.label}</h3>
                 </div>
                 <div className="relative z-10 mt-8 md:mt-0 flex justify-center">
                   {iconMap[step.icon] || <Star className="w-24 h-24 text-indigo-400 stroke-1" />}
                 </div>
                 <div className="hidden md:block"></div>
            </div>
            
            <div className="md:w-2/3 p-8 md:p-12 flex flex-col justify-center overflow-y-auto max-h-[80vh] md:max-h-none">
                <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight animate-fade-in">{step.title}</h2>
                <p className="text-slate-400 text-base md:text-lg leading-relaxed whitespace-pre-line animate-fade-in">{step.content}</p>
                {renderContentRight()}
            </div>
        </div>

        <div className="flex justify-between items-center mt-8 px-4">
            <button onClick={prevStep} className={`flex items-center gap-2 text-slate-500 font-bold hover:text-indigo-400 transition-colors ${strategyStep === 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <ChevronLeft className="w-5 h-5" /> Anterior
            </button>
            <button onClick={nextStep} className="group bg-indigo-600 text-white px-8 py-3 rounded-full font-bold uppercase tracking-wider text-sm hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2">
                {strategyStep === steps.length ? 'Ver Metodología' : 'Siguiente'} 
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
    </div>
  );
};
