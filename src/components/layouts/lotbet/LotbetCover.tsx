import React from 'react';
import { FileCheck2, Calendar, CalendarCheck, CircleDollarSign, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

export interface LotbetMetric {
  id?: string;
  label?: string;
  value?: string;
}

export interface LotbetCoverData {
  title?: string;
  subtitle?: string;
  metrics?: LotbetMetric[];
}

export const LotbetCover: React.FC<{ data: LotbetCoverData }> = ({ data }) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'start': return <Calendar className="w-6 h-6 text-slate-400 mb-3" />;
      case 'end': return <CalendarCheck className="w-6 h-6 text-slate-400 mb-3" />;
      case 'contract': return <CircleDollarSign className="w-6 h-6 text-emerald-400 mb-3" />;
      case 'advance': return <Wallet className="w-6 h-6 text-cyan-400 mb-3" />;
      default: return <Calendar className="w-6 h-6 text-slate-400 mb-3" />;
    }
  };

  const getColorClass = (id: string) => {
    switch(id) {
        case 'contract': return "text-emerald-400";
        case 'advance': return "text-cyan-400";
        default: return "text-white";
    }
  };

  const metrics = data.metrics && data.metrics.length > 0 ? data.metrics : [
    { id: 'start', label: 'Inicio', value: '15 May 2026' },
    { id: 'end', label: 'Corte', value: '09 Jul 2026' },
    { id: 'contract', label: 'Contratado', value: 'USD 6.760' },
    { id: 'advance', label: 'Anticipo', value: 'USD 3.000' }
  ];

  return (
    <div className="w-full h-full flex flex-col justify-center items-center text-center p-12 bg-[#0f172a] rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center text-cyan-400 shadow-xl mb-8 border border-white/20 z-10"
      >
        <FileCheck2 className="w-12 h-12" />
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-4xl md:text-6xl font-black tracking-tighter leading-tight mb-4 z-10 whitespace-pre-wrap"
      >
        {data.title || 'Informe parcial de ejecución\ny conciliación económica'}
      </motion.h1>
      
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-2xl text-cyan-400 font-medium tracking-wide mb-12 z-10"
      >
        {data.subtitle || 'Proyecto LotBet – Level Producciones'}
      </motion.h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl z-10 mt-8">
        {metrics.map((metric, idx) => (
          <motion.div 
            key={idx} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + (idx * 0.1), duration: 0.5 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl text-left"
          >
            {getIcon(metric.id || 'start')}
            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">{metric.label}</p>
            <p className={`text-lg font-black ${getColorClass(metric.id || 'start')}`}>{metric.value}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
