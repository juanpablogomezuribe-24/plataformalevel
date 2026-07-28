import React from 'react';

interface InfraStat {
  value: string | number;
  label: React.ReactNode;
  colorClass: string;
}

interface InfraBox {
  title: string;
  subtitle: string;
  colorClass: string;
}

export interface LevelInfrastructureData {
  title: string;
  subtitle: string;
  stats: InfraStat[];
  boxes: InfraBox[];
}

export const LevelInfrastructure: React.FC<{ data: LevelInfrastructureData }> = ({ data }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 mt-12">
      <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight text-center">{data.title}</h2>
      <p className="text-center text-slate-500 mb-8">{data.subtitle}</p>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {data.stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-lg text-center flex flex-col justify-center items-center h-40">
            <span className={`text-4xl font-black mb-2 ${stat.colorClass}`}>{stat.value}</span>
            <span className="text-xs font-bold text-slate-500 uppercase">{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-6 mt-8">
        {data.boxes.map((box, idx) => (
          <div key={idx} className={`flex-1 p-6 rounded-[2rem] flex items-center justify-center text-center border ${box.colorClass}`}>
            <h3 className="text-2xl font-black">{box.title} <span className="block text-sm font-medium mt-1">{box.subtitle}</span></h3>
          </div>
        ))}
      </div>
    </div>
  );
};
