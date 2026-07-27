import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartBlockProps {
  data: {
    title: string;
    description?: string;
    chartType: 'pie' | 'bar' | 'line';
    items: Array<{ name: string; value: number }>;
  };
  brand?: { primaryColor?: string };
}

export default function ChartBlock({ data, brand }: ChartBlockProps) {
  const brandColor = brand?.primaryColor || '#6366f1'; // Default indigo
  
  const COLORS = [brandColor, '#38bdf8', '#fbbf24', '#f472b6', '#34d399', '#818cf8', '#f87171'];

  const renderChart = () => {
    if (!data.items || data.items.length === 0) return null;

    switch (data.chartType) {
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.items}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
              >
                {data.items.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => new Intl.NumberFormat('es-CO').format(value as number)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.items} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
              <Tooltip 
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{ borderRadius: '0.75rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value) => new Intl.NumberFormat('es-CO').format(value as number)} 
              />
              <Bar dataKey="value" fill={brandColor} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.items} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '0.75rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value) => new Intl.NumberFormat('es-CO').format(value as number)} 
              />
              <Line type="monotone" dataKey="value" stroke={brandColor} strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-xl mb-8 group hover:border-indigo-200 transition-all">
      <div className="mb-8 text-center md:text-left">
        <h3 className="text-2xl font-black text-slate-800 tracking-tight">{data.title}</h3>
        {data.description && (
          <p className="text-slate-500 mt-2 text-sm leading-relaxed max-w-2xl">{data.description}</p>
        )}
      </div>
      <div className="w-full">
        {renderChart()}
      </div>
    </div>
  );
}
