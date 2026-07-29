import React from 'react';
import { Users, Target, AlertCircle, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export interface LotbetContextData {
  title?: string;
  statNumber?: string;
  statLabel?: string;
  statList?: string[];
  objectiveTitle?: string;
  objectiveText?: string;
  alertTitle?: string;
  alertHighlight?: string;
  alertSubtitle?: string;
  alertList?: string[];
}

export const LotbetContext: React.FC<{ data: LotbetContextData }> = ({ data }) => {
  const statList = data.statList || [
    'Provenientes de plataforma anterior.',
    'Afinidad comprobada con apuestas.',
    'Mayor probabilidad de reactivación.'
  ];

  const alertList = data.alertList || [
    'Reportes de spam masivos.',
    'Bloqueo inmediato de los números.',
    'Pérdida irreparable de reputación.',
    'Suspensión de cuentas de WhatsApp.',
    'Riesgo para todo el ecosistema digital.'
  ];

  return (
    <div className="w-full h-full flex flex-col p-12 lg:p-24 bg-slate-50 relative overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-8 mt-12 w-full">
        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">{data.title || 'El punto de partida'}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-4xl font-black text-slate-800">{data.statNumber || '~3.800'}</h3>
              </div>
              <p className="font-bold text-slate-700 mb-4">{data.statLabel || 'Base histórica de usuarios'}</p>
              <ul className="space-y-3 text-sm text-slate-600">
                {statList.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-amber-50 p-6 rounded-[2rem] border border-amber-200"
            >
              <h4 className="font-black text-amber-900 mb-2 flex items-center gap-2">
                <Target className="w-5 h-5" /> {data.objectiveTitle || 'Objetivo Inicial'}
              </h4>
              <p className="text-amber-800 text-sm">{data.objectiveText || 'Reactivar a estos usuarios a través de WhatsApp Business.'}</p>
            </motion.div>
          </div>

          {/* Right Column: Alert */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-8 rounded-[2rem] border border-red-200 shadow-xl shadow-red-500/5 relative overflow-hidden h-fit"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-red-500"></div>
            <h3 className="text-xl font-black text-slate-800 mb-4">{data.alertTitle || 'Restricción Principal'}</h3>
            <p className="text-lg font-bold text-red-600 mb-6 bg-red-50 p-4 rounded-xl border border-red-100">
              {data.alertHighlight || 'No se podía contactar a toda la base de una sola vez.'}
            </p>
            <p className="text-sm font-bold text-slate-700 mb-3">{data.alertSubtitle || 'Riesgos de un envío masivo:'}</p>
            <ul className="space-y-3">
              {alertList.map((item, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-slate-600">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
