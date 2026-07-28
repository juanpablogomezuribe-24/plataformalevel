import React from 'react';
import { XCircle } from 'lucide-react';

interface MetricBox {
  label: React.ReactNode;
  value: string;
  currency: string;
  bgClass: string;
  textColorClass: string;
  labelColorClass: string;
  badge?: string;
}

export interface LevelComparisonData {
  title: string;
  leftBox: MetricBox;
  rightBox: MetricBox;
  summaryItems: { label: string; value: string }[];
  decisionText: React.ReactNode;
}

export const LevelComparison: React.FC<{ data: LevelComparisonData }> = ({ data }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 mt-12 text-center">
      <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-12">{data.title}</h2>
      
      <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
        <div className={`${data.leftBox.bgClass} w-64 h-64 rounded-full flex flex-col items-center justify-center border-8 border-white shadow-xl`}>
          <span className={`text-sm font-bold uppercase tracking-widest mb-2 ${data.leftBox.labelColorClass}`}>{data.leftBox.label}</span>
          <span className={`text-5xl font-black ${data.leftBox.textColorClass}`}>{data.leftBox.value}</span>
          <span className="text-sm text-slate-500 font-bold mt-1">{data.leftBox.currency}</span>
        </div>
        
        <div className="text-slate-400 font-black text-4xl italic">VS</div>
        
        <div className={`${data.rightBox.bgClass} w-64 h-64 rounded-full flex flex-col items-center justify-center border-8 border-white shadow-xl relative`}>
          {data.rightBox.badge && (
            <div className="absolute -top-4 bg-red-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full animate-bounce">
              {data.rightBox.badge}
            </div>
          )}
          <span className={`text-sm font-bold uppercase tracking-widest mb-2 text-center ${data.rightBox.labelColorClass}`}>{data.rightBox.label}</span>
          <span className={`text-4xl font-black ${data.rightBox.textColorClass}`}>{data.rightBox.value}</span>
          <span className="text-sm text-slate-500 font-bold mt-1">{data.rightBox.currency}</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mt-12 inline-block text-left">
        <ul className="text-sm text-slate-600 space-y-2">
          {data.summaryItems.map((item, idx) => (
            <li key={idx}><strong className="text-slate-800">{item.label}:</strong> {item.value}</li>
          ))}
        </ul>
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="font-black text-red-600"><XCircle className="inline w-4 h-4 mr-1 mb-1" /> {data.decisionText}</p>
        </div>
      </div>
    </div>
  );
};
