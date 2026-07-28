import React from 'react';

interface Stat {
  label: string;
  value: string;
  colorClass?: string;
}

interface SummaryStat {
  label: string;
  value: string;
  align: 'left' | 'right';
  valueColorClass?: string;
}

export interface LotbetDashboardData {
  title: string;
  stats: Stat[];
  summaries: SummaryStat[];
}

export const LotbetDashboard: React.FC<{ data: LotbetDashboardData }> = ({ data }) => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 mt-12">
      <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">{data.title}</h2>
      
      <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {data.stats.map((stat, idx) => (
            <div key={idx}>
              <p className="text-xs font-bold text-slate-400 uppercase">{stat.label}</p>
              <p className={`text-2xl font-black ${stat.colorClass || 'text-slate-800'}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-100 pt-6 flex justify-between items-center bg-slate-50 p-6 rounded-2xl">
          {data.summaries.map((summary, idx) => (
            <div key={idx} className={summary.align === 'right' ? 'text-right' : ''}>
              <p className="text-sm font-bold text-slate-500 uppercase">{summary.label}</p>
              <p className={`text-3xl font-black ${summary.valueColorClass || 'text-slate-800'}`}>{summary.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
