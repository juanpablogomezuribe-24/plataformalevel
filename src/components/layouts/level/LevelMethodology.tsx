import React from 'react';
import { motion } from 'framer-motion';

export interface Phase {
  title?: string;
  description?: string;
}

export interface LevelMethodologyData {
  title?: string;
  phases?: Phase[];
}

export const LevelMethodology: React.FC<{ data: LevelMethodologyData }> = ({ data }) => {
  const phases = data.phases && data.phases.length > 0 ? data.phases : [];

  return (
    <div className="w-full min-h-full flex flex-col p-12 lg:p-24 bg-slate-50 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-indigo-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-fuchsia-500/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16 text-center max-w-4xl mx-auto z-10"
      >
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
          {data.title || 'Metodología de Trabajo'}
        </h2>
        <div className="w-24 h-1.5 bg-gradient-to-r from-indigo-500 to-fuchsia-500 mx-auto mt-8 rounded-full"></div>
      </motion.div>

      <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-6 md:gap-8 justify-center items-stretch z-10">
        {phases.map((phase, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.4 }}
            className={`flex-1 flex flex-col relative group ${
              idx % 2 !== 0 ? 'md:mt-16' : ''
            }`}
          >
            {/* Connection Line (Hidden on Mobile) */}
            {idx < phases.length - 1 && (
              <div className="hidden md:block absolute top-12 left-1/2 w-full h-[2px] bg-slate-200 -z-10">
                <div className="h-full bg-indigo-500 w-0 group-hover:w-full transition-all duration-700 ease-out"></div>
              </div>
            )}

            <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100 flex-1 hover:-translate-y-4 transition-transform duration-500 group-hover:shadow-[0_20px_50px_rgba(99,102,241,0.1)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-50 to-transparent rounded-bl-full -mr-10 -mt-10 transition-all duration-500 group-hover:scale-150 group-hover:bg-indigo-500/5"></div>
              
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-8 relative z-10 group-hover:bg-indigo-600 transition-colors duration-500 shadow-inner">
                <span className="text-2xl font-black text-indigo-600 group-hover:text-white transition-colors duration-500">
                  {idx + 1}
                </span>
              </div>
              
              <h3 className="text-2xl font-black text-slate-900 mb-4 relative z-10">
                {phase.title || `Fase ${idx + 1}`}
              </h3>
              
              <p className="text-slate-500 font-light leading-relaxed relative z-10">
                {phase.description || 'Detalla las acciones, hitos o procesos que ocurren durante esta fase de la metodología.'}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
