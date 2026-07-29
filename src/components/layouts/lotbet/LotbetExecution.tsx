import React from 'react';
import { motion } from 'framer-motion';

export interface LotbetMilestone {
  date?: string;
  description?: string;
  type?: 'cyan' | 'amber' | 'red' | 'indigo';
}

export interface LotbetExecutionData {
  title?: string;
  milestones?: LotbetMilestone[];
}

export const LotbetExecution: React.FC<{ data: LotbetExecutionData }> = ({ data }) => {
  const getColors = (type?: string) => {
    switch(type) {
      case 'amber': return { dot: 'bg-amber-500', box: 'bg-amber-50 border-amber-100 text-amber-900' };
      case 'red': return { dot: 'bg-red-500', box: 'bg-red-50 border-red-100 text-red-900' };
      case 'indigo': return { dot: 'bg-indigo-500', box: 'bg-indigo-50 border-indigo-100 text-indigo-900' };
      case 'cyan':
      default: return { dot: 'bg-cyan-500', box: 'bg-slate-50 border-slate-100 text-slate-900' };
    }
  };

  const milestones = data.milestones && data.milestones.length > 0 ? data.milestones : [
    { date: '15 de mayo', description: 'Inicio del proyecto', type: 'cyan' },
    { date: '', description: 'Construcción y configuración de activos', type: 'cyan' },
    { date: '', description: 'Calentamiento orgánico de cuentas', type: 'cyan' },
    { date: '', description: 'Conexión CRM, carga y segmentación', type: 'cyan' },
    { date: '', description: 'Cambio de estrategia por costo', type: 'amber' },
    { date: '', description: 'Primer bloqueo y recuperación', type: 'red' },
  ];

  return (
    <div className="w-full h-full flex flex-col p-12 lg:p-24 bg-slate-50 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-8 mt-12 w-full">
        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
          {data.title || 'Ejecución paso a paso'}
        </h2>
        
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden relative">
          <div className="absolute left-8 md:left-1/2 top-8 bottom-8 w-1 bg-slate-100 -translate-x-1/2 rounded-full"></div>
          
          <div className="space-y-4 relative">
            {milestones.map((milestone, idx) => {
              const isEven = idx % 2 === 0;
              const colors = getColors(milestone.type);
              
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`flex items-center relative left-12 md:left-0 mb-4 ${
                    isEven 
                      ? 'md:justify-end md:w-1/2 md:pr-8' 
                      : 'md:w-1/2 md:pl-8 md:ml-auto'
                  }`}
                >
                  <div className={`absolute w-4 h-4 rounded-full border-4 border-white shadow-sm z-10 ${colors.dot} ${
                    isEven 
                      ? '-left-[45px] md:-right-[37px] md:left-auto' 
                      : '-left-[45px] md:-left-[21px]'
                  }`}></div>
                  
                  <div className={`border p-3 rounded-xl shadow-sm text-sm w-full ${colors.box}`}>
                    {milestone.date ? <strong>{milestone.date}: </strong> : null}
                    {milestone.description}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
