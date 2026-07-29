import React from 'react';
import { Quote, Target, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export interface Goal {
  title?: string;
  description?: string;
}

export interface LevelObjectiveData {
  title?: string;
  mainObjective?: string;
  goals?: Goal[];
}

export const LevelObjective: React.FC<{ data: LevelObjectiveData }> = ({ data }) => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-12 lg:p-24 bg-white relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-indigo-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      
      {/* Title */}
      {data.title && (
        <h2 className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-12 flex items-center gap-3">
          <Target className="w-5 h-5" />
          {data.title}
        </h2>
      )}

      {/* Main Objective */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="w-full max-w-5xl bg-white p-12 md:p-16 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 relative mb-16 group hover:shadow-[0_20px_60px_rgba(99,102,241,0.1)] transition-shadow duration-500"
      >
        <Quote className="absolute top-10 left-10 w-16 h-16 text-indigo-100 -z-10 group-hover:text-indigo-200 transition-colors duration-500" />
        <p className="text-3xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight relative z-10 text-center">
          "{data.mainObjective || 'Declara tu objetivo principal de forma concisa y persuasiva'}"
        </p>
      </motion.div>
      
      {/* Goals Array */}
      {data.goals && data.goals.length > 0 && (
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.goals.map((goal, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-slate-50 border border-slate-100 p-8 rounded-3xl group hover:bg-indigo-600 hover:-translate-y-2 transition-all duration-300 shadow-sm hover:shadow-xl"
            >
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-indigo-600 font-black text-xl mb-6 shadow-sm group-hover:bg-white/20 group-hover:text-white transition-colors">
                {idx + 1}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-white transition-colors">
                {goal.title || `Sub-objetivo ${idx + 1}`}
              </h3>
              <p className="text-slate-500 font-medium leading-relaxed group-hover:text-indigo-100 transition-colors">
                {goal.description || 'Detalle breve de cómo lograrás impactar este aspecto específico.'}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
