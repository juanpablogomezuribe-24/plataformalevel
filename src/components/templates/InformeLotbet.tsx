'use client'

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function InformeLotbet({ data, brand }: { data: any, brand?: any }) {
  const cover = data?.cover || { title: 'Informe de Proyecto', subtitle: 'LotBet', date: '2026' };
  const kpis = data?.kpis || [];
  const metrics = data?.metrics || [];
  const chartData = data?.chart || { items: [] };

  const COLORS = ['#06b6d4', '#10b981', '#f59e0b', '#8b5cf6'];

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-900 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 shadow-lg hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-cyan-500/30">
            📊
          </div>
          <div>
            <h1 className="text-sm font-black uppercase tracking-tight text-slate-800 leading-tight">Dashboard</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mt-1">{cover.subtitle}</p>
          </div>
        </div>
        <div className="flex-1 p-4 space-y-2">
          <button className="w-full text-left p-3 rounded-lg bg-cyan-50 text-cyan-700 font-bold border-r-4 border-cyan-500">Resumen General</button>
          <button className="w-full text-left p-3 rounded-lg text-slate-500 hover:bg-slate-50 font-medium">Métricas Clave</button>
          <button className="w-full text-left p-3 rounded-lg text-slate-500 hover:bg-slate-50 font-medium">Finanzas</button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        
        {/* Header Cover */}
        <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden mb-8 shadow-2xl">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2">{cover.title}</h1>
            <h2 className="text-xl text-cyan-400 font-medium tracking-wide mb-8">{cover.subtitle} | {cover.date}</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {kpis.map((kpi: any, idx: number) => (
                <div key={idx} className="bg-white/5 backdrop-blur-sm border border-white/10 p-5 rounded-2xl">
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">{kpi.label}</p>
                  <p className={`text-xl font-black ${idx % 2 === 0 ? 'text-white' : 'text-cyan-400'}`}>{kpi.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="md:col-span-2 space-y-8">
            {metrics.map((section: any, index: number) => (
              <div key={index} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-4">{section.title}</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">{section.description}</p>
                
                {section.items && (
                  <div className="space-y-3">
                    {section.items.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="font-bold text-slate-700">{item.label}</span>
                        <span className="font-black text-cyan-600">{item.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="md:col-span-1 space-y-8">
            {chartData.items.length > 0 && (
              <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-xl">
                <h3 className="text-lg font-black text-slate-800 mb-4">{chartData.title || 'Distribución'}</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={chartData.items} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" nameKey="name">
                        {chartData.items.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {chartData.items.map((entry: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-xs">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                        {entry.name}
                      </span>
                      <span className="font-bold">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
