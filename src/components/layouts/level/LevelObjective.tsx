import React from 'react';
import { Quote, Database, ArrowRight, MessageCircle, Gamepad2, Users2, ClipboardCheck, Rocket } from 'lucide-react';

interface FlowStep {
  id: string;
  label: string;
}

export interface LevelObjectiveData {
  title: string;
  quote: string;
  flowTitle: string;
  flowSteps: FlowStep[];
}

export const LevelObjective: React.FC<{ data: LevelObjectiveData }> = ({ data }) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'database': return <Database className="w-4 h-4 text-cyan-500" />;
      case 'message': return <MessageCircle className="w-4 h-4 text-emerald-500" />;
      case 'gamepad': return <Gamepad2 className="w-4 h-4 text-indigo-500" />;
      case 'segmentation': return <Users2 className="w-4 h-4 text-amber-500" />;
      case 'register': return <ClipboardCheck className="w-4 h-4 text-sky-500" />;
      case 'activation': return <Rocket className="w-4 h-4 text-yellow-400" />;
      default: return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 mt-12 text-center">
      <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-8">{data.title}</h2>
      <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-2xl relative">
        <Quote className="absolute top-8 left-8 w-12 h-12 text-slate-100" />
        <p className="text-2xl font-bold text-slate-700 leading-relaxed relative z-10">
          "{data.quote}"
        </p>
      </div>
      
      <div className="pt-8">
        <p className="text-slate-500 font-bold mb-6 uppercase tracking-widest text-sm">{data.flowTitle}</p>
        <div className="flex flex-wrap justify-center items-center gap-2 text-sm font-bold text-slate-700">
          {data.flowSteps.map((step, idx) => (
            <React.Fragment key={idx}>
              <span className={`${idx === data.flowSteps.length - 1 ? 'bg-slate-900 text-white shadow-md' : 'bg-white shadow-sm border border-slate-200'} px-4 py-3 rounded-xl flex items-center gap-2 mt-2 md:mt-0`}>
                {getIcon(step.id)} {step.label}
              </span>
              {idx < data.flowSteps.length - 1 && (
                <ArrowRight className={`text-slate-300 ${idx >= 3 ? 'hidden md:block' : ''}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
