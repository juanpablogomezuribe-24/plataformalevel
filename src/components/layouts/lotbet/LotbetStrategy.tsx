import React from 'react';
import { motion } from 'framer-motion';

export interface LotbetPhase {
  title?: string;
  subtitle?: string;
  description?: string;
  theme?: 'cyan' | 'indigo' | 'emerald' | 'amber' | 'red';
}

export interface LotbetStrategyData {
  title?: string;
  phases?: LotbetPhase[];
}

export const LotbetStrategy: React.FC<{ data: LotbetStrategyData }> = ({ data }) => {
  const getThemeClasses = (theme?: string) => {
    switch (theme) {
      case 'indigo': return { hover: 'hover:border-indigo-200', bg: 'bg-indigo-50', text: 'text-indigo-600' };
      case 'emerald': return { hover: 'hover:border-emerald-200', bg: 'bg-emerald-50', text: 'text-emerald-600' };
      case 'amber': return { hover: 'hover:border-amber-200', bg: 'bg-amber-50', text: 'text-amber-600' };
      case 'red': return { hover: 'hover:border-red-200', bg: 'bg-red-50', text: 'text-red-600' };
      case 'cyan':
      default:
        return { hover: 'hover:border-cyan-200', bg: 'bg-cyan-50', text: 'text-cyan-600' };
    }
  };

  const phases = data.phases && data.phases.length > 0 ? data.phases : [
    {
      title: 'Fase 1',
      subtitle: 'Adquisición',
      description: 'Captar aproximadamente <strong class="text-slate-900">3.000 usuarios nuevos</strong> desde Meta Ads hacia WhatsApp usando trivias y juegos deportivos.',
      theme: 'cyan'
    },
    {
      title: 'Fase 2',
      subtitle: 'Incorporación',
      description: 'Combinar progresivamente esos usuarios nuevos calientes con la <strong class="text-slate-900">base histórica</strong>, engañando al algoritmo de spam.',
      theme: 'indigo'
    }
  ];

  return (
    <div className="w-full h-full flex flex-col p-12 lg:p-24 bg-slate-50 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-8 mt-12 w-full">
        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-8">
          {data.title || 'La estrategia se diseñó en dos fases'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {phases.map((phase, idx) => {
            const theme = getThemeClasses(phase.theme);
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl relative overflow-hidden group ${theme.hover} transition-colors`}
              >
                <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full -z-0 ${theme.bg}`}></div>
                <h3 className="text-2xl font-black text-slate-800 mb-2 relative z-10">{phase.title}</h3>
                <p className={`text-sm font-bold mb-6 uppercase tracking-widest relative z-10 ${theme.text}`}>
                  {phase.subtitle}
                </p>
                <p 
                  className="text-lg text-slate-600 relative z-10 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: phase.description || '' }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
