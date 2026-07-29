import React from 'react';
import { motion } from 'framer-motion';

export interface Milestone {
  name?: string;
  date?: string;
  description?: string;
}

export interface LevelTimelineData {
  title?: string;
  milestones?: Milestone[];
}

export const LevelTimeline: React.FC<{ data: LevelTimelineData }> = ({ data }) => {
  const milestones = data.milestones && data.milestones.length > 0 ? data.milestones : [];

  return (
    <div className="w-full min-h-full flex flex-col p-12 lg:p-24 bg-white relative overflow-hidden">
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-white -z-10"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-20 text-center max-w-4xl mx-auto z-10"
      >
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
          {data.title || 'Línea de Tiempo'}
        </h2>
        <div className="w-24 h-1.5 bg-indigo-500 mx-auto mt-8 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.3)]"></div>
      </motion.div>

      <div className="relative max-w-5xl mx-auto w-full z-10">
        {/* Central Vertical Line (Desktop) */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500/20 via-indigo-500/50 to-transparent -translate-x-1/2 rounded-full"></div>
        {/* Left Vertical Line (Mobile) */}
        <div className="md:hidden absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500/20 via-indigo-500/50 to-transparent rounded-full"></div>

        <div className="space-y-12 md:space-y-24 relative">
          {milestones.map((milestone, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`flex flex-col md:flex-row items-center w-full relative ${
                  isEven ? 'md:justify-start' : 'md:justify-end'
                }`}
              >
                {/* Node Point */}
                <div className={`absolute left-6 md:left-1/2 w-8 h-8 -translate-x-1/2 rounded-full bg-white border-4 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.5)] z-20 flex items-center justify-center`}>
                   <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                </div>

                {/* Content Card */}
                <div className={`w-full md:w-[45%] pl-20 md:pl-0 ${
                  isEven ? 'md:pr-16 text-left md:text-right' : 'md:pl-16 text-left'
                }`}>
                  <div className="group bg-white p-8 rounded-[2rem] border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(99,102,241,0.1)] transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                    {/* Hover Decoration */}
                    <div className={`absolute top-0 w-2 h-full bg-indigo-500 transition-all duration-500 ${isEven ? 'right-0 group-hover:w-full group-hover:opacity-5' : 'left-0 group-hover:w-full group-hover:opacity-5'}`}></div>

                    <span className="inline-block px-4 py-1 rounded-full bg-indigo-50 text-indigo-600 font-bold text-xs uppercase tracking-widest mb-4">
                      {milestone.date || `Hito ${idx + 1}`}
                    </span>
                    <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                      {milestone.name || 'Nombre del evento'}
                    </h3>
                    <p className="text-slate-500 leading-relaxed font-light">
                      {milestone.description || 'Describe los entregables, acciones clave o eventos que sucederán en este punto del cronograma.'}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
