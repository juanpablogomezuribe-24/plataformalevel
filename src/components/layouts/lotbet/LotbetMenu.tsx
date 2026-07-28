import React from 'react';
import { Target, Route, Clock4, AlertTriangle, BarChart3, Calculator } from 'lucide-react';

interface MenuItem {
  id: string;
  title: string;
  description: string;
  onClick?: () => void;
}

export interface LotbetMenuData {
  title: string;
  subtitle: string;
  items: MenuItem[];
}

export const LotbetMenu: React.FC<{ data: LotbetMenuData }> = ({ data }) => {
  const getIconAndColors = (id: string) => {
    switch (id) {
      case 'context': return { icon: <Target className="w-8 h-8" />, colors: "bg-cyan-50 text-cyan-600 group-hover:bg-cyan-500 group-hover:text-white" };
      case 'strategy': return { icon: <Route className="w-8 h-8" />, colors: "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-500 group-hover:text-white" };
      case 'timeline': return { icon: <Clock4 className="w-8 h-8" />, colors: "bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white" };
      case 'issues': return { icon: <AlertTriangle className="w-8 h-8" />, colors: "bg-red-50 text-red-600 group-hover:bg-red-500 group-hover:text-white" };
      case 'results': return { icon: <BarChart3 className="w-8 h-8" />, colors: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white" };
      case 'reconciliation': return { icon: <Calculator className="w-8 h-8" />, colors: "bg-slate-100 text-slate-700 group-hover:bg-slate-800 group-hover:text-white" };
      default: return { icon: <Target className="w-8 h-8" />, colors: "bg-cyan-50 text-cyan-600 group-hover:bg-cyan-500 group-hover:text-white" };
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 mt-12">
      <div className="text-center">
        <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight mb-4">{data.title}</h2>
        <p className="text-lg text-slate-500">{data.subtitle}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.items.map((item, idx) => {
          const { icon, colors } = getIconAndColors(item.id);
          return (
            <button 
              key={idx} 
              onClick={item.onClick}
              className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-6 group text-left w-full"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors shrink-0 ${colors}`}>
                {icon}
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800">{item.title}</h3>
                <p className="text-sm text-slate-500 mt-1">{item.description}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  );
};
