import React from 'react';

interface Phase {
  title: string;
  subtitle: string;
  description: React.ReactNode;
}

export interface LevelStrategyPillarsData {
  title: string;
  phases: Phase[];
  summary: React.ReactNode;
}

export const LevelStrategyPillars: React.FC<{ data: LevelStrategyPillarsData }> = ({ data }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 mt-12">
      <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">{data.title}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl relative overflow-hidden group hover:border-cyan-200 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-50 rounded-bl-full -z-0"></div>
          <h3 className="text-2xl font-black text-slate-800 mb-2 relative z-10">{data.phases[0].title}</h3>
          <p className="text-sm font-bold text-cyan-600 mb-6 uppercase tracking-widest relative z-10">{data.phases[0].subtitle}</p>
          <p className="text-lg text-slate-600 relative z-10 leading-relaxed">
            {data.phases[0].description}
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl relative overflow-hidden group hover:border-indigo-200 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -z-0"></div>
          <h3 className="text-2xl font-black text-slate-800 mb-2 relative z-10">{data.phases[1].title}</h3>
          <p className="text-sm font-bold text-indigo-600 mb-6 uppercase tracking-widest relative z-10">{data.phases[1].subtitle}</p>
          <p className="text-lg text-slate-600 relative z-10 leading-relaxed">
            {data.phases[1].description}
          </p>
        </div>
      </div>

      <div className="bg-slate-900 p-6 rounded-2xl text-center shadow-lg mt-8 border border-slate-800">
        <p className="text-xl md:text-2xl font-black text-white">
          {data.summary}
        </p>
      </div>
    </div>
  );
};
