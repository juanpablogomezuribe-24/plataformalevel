import React from 'react';
import { Users, Check, Target, AlertCircle } from 'lucide-react';

export interface LevelContextData {
  title: string;
  statsTitle: string;
  statsSubtitle: string;
  benefits: string[];
  objectiveTitle: string;
  objectiveText: string;
  restrictionTitle: string;
  restrictionText: string;
  restrictionSubtext: string;
  risks: string[];
}

export const LevelContext: React.FC<{ data: LevelContextData }> = ({ data }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 mt-12">
      <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">{data.title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center">
                <Users />
              </div>
              <h3 className="text-3xl font-black text-slate-800">{data.statsTitle}</h3>
            </div>
            <p className="font-bold text-slate-700 mb-2">{data.statsSubtitle}</p>
            <ul className="space-y-2 text-sm text-slate-600">
              {data.benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" /> {benefit}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-amber-50 p-6 rounded-[2rem] border border-amber-200">
            <h4 className="font-black text-amber-900 mb-2 flex items-center gap-2">
              <Target className="w-5 h-5" /> {data.objectiveTitle}
            </h4>
            <p className="text-amber-800 text-sm">{data.objectiveText}</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-red-200 shadow-xl shadow-red-500/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-red-500"></div>
          <h3 className="text-xl font-black text-slate-800 mb-4">{data.restrictionTitle}</h3>
          <p className="text-lg font-bold text-red-600 mb-6 bg-red-50 p-4 rounded-xl border border-red-100">
            {data.restrictionText}
          </p>
          <p className="text-sm font-bold text-slate-700 mb-3">{data.restrictionSubtext}</p>
          <ul className="space-y-3">
            {data.risks.map((risk, idx) => (
              <li key={idx} className="flex gap-3 text-sm text-slate-600">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" /> {risk}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
