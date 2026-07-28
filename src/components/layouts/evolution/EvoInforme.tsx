import React from 'react';
import { BarChart2, Target, ClipboardCheck, CheckCircle, Users, MousePointerClick, Eye, Smartphone, Gamepad2 } from 'lucide-react';

export const EvoInforme: React.FC<{ data?: any }> = ({ data }) => {
  return (
    <div className="animate-slide-up p-4 md:p-10 max-w-7xl mx-auto pb-20 text-slate-200">
        <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full bg-slate-800 text-indigo-400 text-xs font-bold uppercase tracking-wider border border-indigo-500/30 shadow-lg shadow-indigo-500/10">
                <BarChart2 className="w-4 h-4" /> Reporte Oficial
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 uppercase tracking-tight text-white">Resultados del Stream</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                Métricas consolidadas de la ejecución del piloto y amplificación en redes.<br/>
                <span className="font-bold text-white">Campaña Evolution Stream 2026</span>
            </p>
        </div>

        {/* RESUMEN EJECUTIVO (CLIENTE) */}
        <div className="bg-slate-900 border border-indigo-500/20 text-white rounded-2xl p-6 md:p-8 mb-12 shadow-2xl relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-5 pointer-events-none">
                <Target className="w-48 h-48 -mt-10 -mr-10 text-indigo-400" />
            </div>
            <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-2 text-cyan-400">
                <ClipboardCheck className="w-5 h-5" /> Resumen Ejecutivo (Métricas Clave)
            </h3>
            <ul className="space-y-4 relative z-10 text-sm md:text-base">
                <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <div>
                        <strong className="text-white">Audiencia en vivo:</strong> Promedio de <span className="text-cyan-400 font-bold">405 espectadores concurrentes</span>, con un pico máximo de <span className="text-cyan-400 font-bold">634 espectadores</span> durante la transmisión.
                    </div>
                </li>
                <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <div>
                        <strong className="text-white">Alcance total:</strong> Más de <span className="text-cyan-400 font-bold">1.2 Millones</span> sumando visualizaciones en historias de IG, Reel y el stream de Twitch (6,998 vistas en vivo).
                    </div>
                </li>
                <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <div>
                        <strong className="text-white">Impresiones / Reach de las publicaciones (Pre y Post):</strong> 
                        <br/><span className="text-slate-400 text-sm mt-1 inline-block">- <strong className="text-indigo-300">Julián Valencia:</strong> 627,000 visualizaciones (Historias) + 231,976 visualizaciones (Reel).</span>
                        <br/><span className="text-slate-400 text-sm">- <strong className="text-indigo-300">Cristian González:</strong> 349,000 visualizaciones (Historias).</span>
                    </div>
                </li>
                <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <div>
                        <strong className="text-white">Tráfico total en la landing de inscripción:</strong> Se lograron captar <span className="text-cyan-400 font-bold">454 leads</span> verificados en la base de datos.
                    </div>
                </li>
            </ul>
        </div>

        {/* KPIs GENERALES */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center shadow-lg">
                <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center justify-center gap-1"><Users className="w-3 h-3 text-indigo-400" /> Leads Registrados</div>
                <div className="text-4xl font-black text-white">454</div>
                <div className="text-[10px] text-emerald-400 font-bold mt-1">Usuarios verificados</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center shadow-lg">
                <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center justify-center gap-1"><MousePointerClick className="w-3 h-3 text-indigo-400" /> Clics en Link</div>
                <div className="text-4xl font-black text-white">4.8K</div>
                <div className="text-[10px] text-slate-500 font-bold mt-1">De Historias de Julián</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center shadow-lg">
                <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center justify-center gap-1"><Eye className="w-3 h-3 text-indigo-400" /> Espectadores Únicos</div>
                <div className="text-4xl font-black text-white">5.0K</div>
                <div className="text-[10px] text-purple-400 font-bold mt-1">Twitch Live</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center shadow-lg">
                <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center justify-center gap-1"><Smartphone className="w-3 h-3 text-indigo-400" /> Visualizaciones (IG)</div>
                <div className="text-4xl font-black text-white">1.2M</div>
                <div className="text-[10px] text-slate-500 font-bold mt-1">Alcance Total Redes</div>
            </div>
        </div>

        {/* TWITCH LIVE STATS */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden mb-12">
            <div className="bg-indigo-900/40 text-white p-8 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-indigo-500/20">
                <div>
                    <h3 className="text-2xl font-black uppercase flex items-center gap-2"><Gamepad2 className="w-6 h-6 text-indigo-400" /> Rendimiento del En Vivo</h3>
                    <p className="text-sm text-indigo-200/80 mt-2">Transmisión oficial del Reto 21 en el canal de Twitch</p>
                </div>
                <div className="bg-indigo-950/60 px-4 py-2 rounded-lg text-center border border-indigo-500/30">
                    <span className="block text-[10px] uppercase font-bold text-indigo-300">Duración</span>
                    <span className="block text-xl font-black text-white">2h 6m</span>
                </div>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                            <span className="block text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-1">Vistas en Vivo</span>
                            <span className="block text-2xl font-black text-white">6,998</span>
                        </div>
                        <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                            <span className="block text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-1">Pico Máximo</span>
                            <span className="block text-2xl font-black text-white">634</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                            <span className="block text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-1">Promedio Espectadores</span>
                            <span className="block text-2xl font-black text-white">405</span>
                        </div>
                        <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                            <span className="block text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-1">Retención Promedio</span>
                            <span className="block text-2xl font-black text-white">~10 min</span>
                            <span className="text-[10px] text-slate-500 leading-tight">Por usuario</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
