import React from 'react';
import { FileCheck2, Calendar, CalendarCheck, CircleDollarSign, Wallet } from 'lucide-react';

interface Metric {
  id: string;
  label: string;
  value: string;
}

export interface LevelCoverData {
  title: React.ReactNode;
  subtitle: string;
  metrics: Metric[];
}

export const LevelCover: React.FC<{ data: LevelCoverData }> = ({ data }) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'start': return <Calendar className="w-6 h-6 text-slate-400 mb-3" />;
      case 'end': return <CalendarCheck className="w-6 h-6 text-slate-400 mb-3" />;
      case 'contract': return <CircleDollarSign className="w-6 h-6 text-emerald-400 mb-3" />;
      case 'advance': return <Wallet className="w-6 h-6 text-cyan-400 mb-3" />;
      default: return null;
    }
  };

  const getColorClass = (id: string) => {
    switch(id) {
        case 'contract': return "text-emerald-400";
        case 'advance': return "text-cyan-400";
        default: return "text-white";
    }
  }

  return (
    <div className="h-[80vh] flex flex-col justify-center items-center text-center p-12 bg-slate-900 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"></div>
      
      <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center text-cyan-400 shadow-xl mb-8 border border-white/20 z-10">
        <FileCheck2 className="w-12 h-12" />
      </div>
      <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight mb-4 z-10">
        {data.title}
      </h1>
      <h2 className="text-2xl text-cyan-400 font-medium tracking-wide mb-12 z-10">
        {data.subtitle}
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl z-10 mt-8">
        {data.metrics.map((metric, idx) => (
          <div key={idx} className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl text-left">
            {getIcon(metric.id)}
            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">{metric.label}</p>
            <p className={`text-lg font-black ${getColorClass(metric.id)}`}>{metric.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
