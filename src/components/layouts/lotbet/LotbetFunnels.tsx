import React from 'react';
import { AlertTriangle, ArrowDown } from 'lucide-react';

interface FunnelStep {
  label: string;
  styleClass: string;
}

interface Funnel {
  title: string;
  titleColorClass: string;
  steps: FunnelStep[];
  wrapperClass: string;
}

export interface LotbetFunnelsData {
  title: string;
  alertTitle: string;
  alertText: React.ReactNode;
  funnels: Funnel[];
}

export const LotbetFunnels: React.FC<{ data: LotbetFunnelsData }> = ({ data }) => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 mt-12">
      <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">{data.title}</h2>
      
      <div className="bg-red-50 border border-red-200 p-6 rounded-2xl flex items-start gap-4 mb-8">
        <AlertTriangle className="text-red-500 w-8 h-8 shrink-0 mt-1" />
        <div>
          <h4 className="font-black text-red-900 text-lg">{data.alertTitle}</h4>
          <p className="text-red-800 mt-2">{data.alertText}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {data.funnels.map((funnel, fIdx) => (
          <div key={fIdx} className={`bg-white p-6 rounded-2xl border ${funnel.wrapperClass} shadow-md`}>
            <h4 className={`font-black text-sm uppercase tracking-widest mb-4 ${funnel.titleColorClass}`}>{funnel.title}</h4>
            <div className="space-y-3">
              {funnel.steps.map((step, sIdx) => (
                <React.Fragment key={sIdx}>
                  <div className={`p-3 rounded-lg text-sm text-center font-bold ${step.styleClass}`}>
                    {step.label}
                  </div>
                  {sIdx < funnel.steps.length - 1 && (
                    <div className="text-center text-slate-300">
                      <ArrowDown className="inline w-4 h-4" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
