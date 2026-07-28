import React from 'react';
import { Flame, CheckCircle } from 'lucide-react';

export interface LotbetPreparationData {
  title: string;
  durationLabel: string;
  description: string;
  checklist: string[];
}

export const LotbetPreparation: React.FC<{ data: LotbetPreparationData }> = ({ data }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 mt-12">
      <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">{data.title}</h2>
      <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-xl flex flex-col md:flex-row gap-10 items-center">
        <div className="w-full md:w-1/3 flex justify-center">
          <div className="w-48 h-48 bg-orange-50 rounded-full flex items-center justify-center relative shadow-inner">
            <Flame className="w-20 h-20 text-orange-500" />
            <div className="absolute -bottom-2 bg-white px-4 py-1 rounded-full shadow-md text-xs font-bold text-orange-600 border border-orange-100">
              {data.durationLabel}
            </div>
          </div>
        </div>
        <div className="w-full md:w-2/3 space-y-4">
          <p className="text-lg text-slate-600 mb-6">{data.description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.checklist.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <CheckCircle className="text-emerald-500 w-5 h-5" /> 
                <span className="font-medium text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
