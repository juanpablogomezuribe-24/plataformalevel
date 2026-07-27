'use client'

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function InformeMundial({ data, brand }: { data: any, brand?: any }) {
  const cover = data?.cover || { title: 'Lanzamiento Digital Campaña', subtitle: 'Wplay 2026' };
  const stats = data?.stats || [];
  const milestones = data?.milestones || [];
  const chartData = data?.chart || { title: 'Métricas de Alcance', items: [] };

  const COLORS = ['#1e3a8a', '#facc15', '#3b82f6', '#eab308'];

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 font-sans relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[600px] h-[600px] bg-blue-100 rounded-full blur-[100px] opacity-50 -top-40 -left-40 animate-pulse"></div>
        <div className="absolute w-[500px] h-[500px] bg-yellow-100/60 rounded-full blur-[100px] opacity-50 bottom-0 right-0 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col min-h-screen">
        
        {/* Header */}
        <header className="p-6 md:p-10 flex justify-between items-center">
          <div className="font-black text-2xl tracking-tighter text-blue-950 uppercase italic drop-shadow-sm">
            {cover.subtitle.split(' ')[0]} <span className="text-yellow-500">{cover.subtitle.split(' ')[1] || ''}</span>
          </div>
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
            INFORME EJECUTIVO
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col md:flex-row gap-8 p-6 md:p-10">
          
          {/* Left Column (Title & Text) */}
          <div className="flex-1 flex flex-col justify-center max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-black text-blue-950 tracking-tighter leading-[1.1] mb-6">
              {cover.title}
            </h1>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-10">
              {data?.description || 'Resumen general de resultados, métricas clave y ejecución de pauta digital para la campaña actual.'}
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat: any, idx: number) => (
                <div key={idx} className="bg-white/80 backdrop-blur-xl border border-slate-200/50 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-3xl font-black text-blue-900 mb-1">{stat.value}</div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column (Charts & Timelines) */}
          <div className="flex-1 flex flex-col gap-6">
            
            {/* Chart Panel */}
            {chartData.items.length > 0 && (
              <div className="bg-white/90 backdrop-blur-xl border border-slate-200 p-8 rounded-3xl shadow-xl flex-1 min-h-[300px] flex flex-col">
                <h3 className="text-xl font-black text-blue-950 mb-6">{chartData.title}</h3>
                <div className="flex-1 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.items} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="value" fill="#1e3a8a" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Timeline Panel */}
            {milestones.length > 0 && (
              <div className="bg-blue-950 text-white p-8 rounded-3xl shadow-xl">
                <h3 className="text-xl font-black mb-6 text-yellow-400">Hitos de Ejecución</h3>
                <div className="space-y-6">
                  {milestones.map((m: any, idx: number) => (
                    <div key={idx} className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-yellow-400 shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">{m.title}</h4>
                        <p className="text-sm text-white/60">{m.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
