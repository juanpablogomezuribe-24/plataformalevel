import React from 'react';
import { motion } from 'framer-motion';

export interface LotbetFinancialBox {
  label?: string;
  value?: string;
  type?: 'base' | 'cyan' | 'emerald' | 'dark';
}

export interface LotbetFinancialData {
  title?: string;
  boxes?: LotbetFinancialBox[];
  equation?: {
    term1?: string;
    operator1?: string;
    term2?: string;
    operator2?: string;
    result?: string;
  };
}

export const LotbetFinancial: React.FC<{ data: LotbetFinancialData }> = ({ data }) => {
  const getBoxStyle = (type?: string) => {
    switch (type) {
      case 'cyan': return { container: 'border-cyan-200 shadow-cyan-500/10', label: 'text-cyan-600', value: 'text-cyan-700' };
      case 'emerald': return { container: 'border-emerald-200 shadow-emerald-500/10', label: 'text-emerald-600', value: 'text-emerald-700' };
      case 'dark': return { container: 'bg-slate-900 border-slate-800 transform scale-105', label: 'text-slate-400', value: 'text-white' };
      case 'base':
      default: return { container: 'border-slate-200', label: 'text-slate-400', value: 'text-slate-800' };
    }
  };

  const boxes = data.boxes && data.boxes.length > 0 ? data.boxes : [
    { label: 'Contrato Base', value: 'USD 6.760', type: 'base' },
    { label: 'Ejecutado Real', value: 'USD 4.704,60', type: 'cyan' },
    { label: 'Anticipo Cliente', value: 'USD 3.000', type: 'emerald' },
    { label: 'Saldo a favor Level', value: 'USD 1.704,60', type: 'dark' }
  ];

  const eq = data.equation || {
    term1: 'USD 4.704,60',
    operator1: '-',
    term2: 'USD 3.000',
    operator2: '=',
    result: 'USD 1.704,60'
  };

  return (
    <div className="w-full h-full flex flex-col p-12 lg:p-24 bg-slate-50 overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-8 mt-12 text-center w-full">
        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-12">
          {data.title || 'Conciliación económica'}
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {boxes.map((box, idx) => {
            const style = getBoxStyle(box.type);
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: box.type === 'dark' ? 1.05 : 1 }}
                transition={{ delay: idx * 0.1 }}
                className={`p-6 rounded-3xl border shadow-md ${style.container} ${box.type !== 'dark' ? 'bg-white' : ''}`}
              >
                <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${style.label}`}>{box.label}</p>
                <p className={`text-3xl font-black ${style.value}`}>{box.value}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-8 rounded-full shadow-lg border border-slate-200 inline-block"
        >
          <div className="flex items-center justify-center gap-4 md:gap-6 text-xl md:text-3xl font-black text-slate-800 flex-wrap">
            <span className="text-cyan-600">{eq.term1}</span>
            <span className="text-slate-300">{eq.operator1}</span>
            <span className="text-emerald-500">{eq.term2}</span>
            <span className="text-slate-300">{eq.operator2}</span>
            <span className="bg-slate-900 text-white px-6 py-2 rounded-full">{eq.result}</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
