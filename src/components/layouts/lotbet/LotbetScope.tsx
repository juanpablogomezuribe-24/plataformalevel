import React from 'react';
import { Settings, Server, Users, MessageSquare, PenTool, Megaphone, Percent, Info } from 'lucide-react';

interface ScopeItem {
  id: string;
  title: string;
  subtitle: string;
}

export interface LotbetScopeData {
  title: string;
  items: ScopeItem[];
  clarification: React.ReactNode;
}

export const LotbetScope: React.FC<{ data: LotbetScopeData }> = ({ data }) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'setup': return <Settings className="w-8 h-8 text-slate-400 mb-3" />;
      case 'platform': return <Server className="w-8 h-8 text-cyan-500 mb-3" />;
      case 'crm': return <Users className="w-8 h-8 text-indigo-500 mb-3" />;
      case 'messages': return <MessageSquare className="w-8 h-8 text-emerald-500 mb-3" />;
      case 'creative': return <PenTool className="w-8 h-8 text-amber-500 mb-3" />;
      case 'ads': return <Megaphone className="w-8 h-8 text-red-500 mb-3" />;
      case 'fee': return <Percent className="w-8 h-8 text-slate-500 mb-3" />;
      default: return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 mt-12">
      <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">{data.title}</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.items.map((item, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
            {getIcon(item.id)}
            <h4 className="font-black text-slate-800">{item.title}</h4>
            <p className="text-xs text-slate-500 mt-1">{item.subtitle}</p>
          </div>
        ))}
      </div>

      {data.clarification && (
        <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl flex items-center gap-4 mt-6">
          <Info className="text-amber-500 w-6 h-6 shrink-0" />
          <p className="text-sm text-amber-800">
            {data.clarification}
          </p>
        </div>
      )}
    </div>
  );
};
