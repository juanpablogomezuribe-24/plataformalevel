import React from 'react';
import { ArrowRight } from 'lucide-react';

interface FlowNode {
  label: string;
  styleClass?: string;
}

export interface LevelLinearFlowData {
  title: string;
  quote: string;
  nodes: FlowNode[];
}

export const LevelLinearFlow: React.FC<{ data: LevelLinearFlowData }> = ({ data }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 mt-12 text-center">
      <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-8">{data.title}</h2>
      
      <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-xl mb-12">
        <p className="text-xl text-slate-700 leading-relaxed font-medium">
          "{data.quote}"
        </p>
      </div>

      <div className="flex flex-wrap justify-center items-center gap-3 text-sm font-bold text-slate-700">
        {data.nodes.map((node, idx) => (
          <React.Fragment key={idx}>
            <span className={`px-4 py-3 rounded-xl shadow-sm ${node.styleClass || 'bg-white border border-slate-200 mt-2 md:mt-0'}`}>
              {node.label}
            </span>
            {idx < data.nodes.length - 1 && (
              <ArrowRight className={`text-slate-300 ${idx > 1 ? 'hidden md:block' : ''}`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
