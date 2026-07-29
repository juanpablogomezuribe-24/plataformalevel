import React from 'react';
import { Quote, Database, ArrowRight, MessageCircle, Gamepad2, Users2, ClipboardCheck, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';

export interface FlowStep {
  icon?: string;
  label?: string;
  highlight?: boolean;
}

export interface LotbetObjectiveData {
  title?: string;
  quote?: string;
  flowTitle?: string;
  flowSteps?: FlowStep[];
}

export const LotbetObjective: React.FC<{ data: LotbetObjectiveData }> = ({ data }) => {
  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'database': return <Database className="w-4 h-4 text-cyan-500" />;
      case 'whatsapp': return <MessageCircle className="w-4 h-4 text-emerald-500" />;
      case 'game': return <Gamepad2 className="w-4 h-4 text-indigo-500" />;
      case 'users': return <Users2 className="w-4 h-4 text-amber-500" />;
      case 'clipboard': return <ClipboardCheck className="w-4 h-4 text-sky-500" />;
      case 'rocket': return <Rocket className="w-4 h-4 text-yellow-400" />;
      default: return <Database className="w-4 h-4 text-slate-500" />;
    }
  };

  const steps = data.flowSteps && data.flowSteps.length > 0 ? data.flowSteps : [
    { icon: 'database', label: 'Base Histórica' },
    { icon: 'whatsapp', label: 'WhatsApp' },
    { icon: 'game', label: 'Juegos y Trivias' },
    { icon: 'users', label: 'Segmentación' },
    { icon: 'clipboard', label: 'Registro' },
    { icon: 'rocket', label: 'Reactivación', highlight: true }
  ];

  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-12 lg:p-24 bg-slate-50 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-8 text-center w-full">
        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-8">
          {data.title || 'Objetivo Estratégico'}
        </h2>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-2xl relative"
        >
          <Quote className="absolute top-8 left-8 w-12 h-12 text-slate-100" />
          <p className="text-2xl font-bold text-slate-700 leading-relaxed relative z-10">
            "{data.quote || 'Reactivar progresivamente a los usuarios históricos por medio de WhatsApp, para llevarlos nuevamente hacia LotBet y convertirlos en usuarios activos.'}"
          </p>
        </motion.div>
        
        <div className="pt-8">
          <p className="text-slate-500 font-bold mb-6 uppercase tracking-widest text-sm">
            {data.flowTitle || 'Flujo de Reactivación Esperado'}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-2 text-sm font-bold text-slate-700">
            {steps.map((step, idx) => (
              <React.Fragment key={idx}>
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`px-4 py-3 rounded-xl flex items-center gap-2 mt-2 md:mt-0 ${
                    step.highlight 
                      ? 'bg-slate-900 text-white shadow-md' 
                      : 'bg-white shadow-sm border border-slate-200'
                  }`}
                >
                  {getIcon(step.icon)} {step.label}
                </motion.span>
                
                {idx < steps.length - 1 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.1 + 0.1 }}
                  >
                    <ArrowRight className={`text-slate-300 ${idx >= 3 ? 'hidden md:block' : ''}`} />
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
