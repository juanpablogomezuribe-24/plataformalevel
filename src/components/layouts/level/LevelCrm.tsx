import React from 'react';
import { ArrowRight } from 'lucide-react';

interface Metric {
  value: string;
  label: string;
}

interface Step {
  title: string;
  subtitle: string;
}

export interface LevelCrmData {
  title: string;
  metrics: Metric[];
  steps: Step[];
}

export const LevelCrm: React.FC<{ data: LevelCrmData }> = ({ data }) => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 mt-12">
      <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight text-center">{data.title}</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        {data.metrics.map((metric, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md text-center">
            <span className="block text-3xl font-black text-cyan-600 mb-1">{metric.value}</span>
            <span className="text-xs font-bold text-slate-500 uppercase">{metric.label}</span>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 p-8 rounded-[2rem] text-white flex justify-between items-center relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
        <div className="relative z-10 w-full flex flex-col md:flex-row justify-between items-center gap-6">
          {data.steps.map((step, idx) => (
            <React.Fragment key={idx}>
              <div className={`text-center ${idx === 0 ? 'md:text-left' : idx === data.steps.length - 1 ? 'md:text-right' : ''}`}>
                <h4 className="font-black text-lg mb-1">{step.title}</h4>
                <p className="text-xs text-slate-400">{step.subtitle}</p>
              </div>
              {idx < data.steps.length - 1 && (
                <ArrowRight className="text-slate-600 hidden md:block" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
