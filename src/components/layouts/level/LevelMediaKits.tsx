import React from 'react';
import { BarChart2, CheckCircle, Target, Image as ImageIcon } from 'lucide-react';

export const LevelMediaKits: React.FC<{ data?: any }> = ({ data }) => {
  return (
    <div className="animate-slide-up p-4 md:p-10 max-w-7xl mx-auto pb-20 text-slate-200">
        <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full bg-cyan-900/30 text-cyan-400 text-xs font-bold border border-cyan-500/30 uppercase tracking-wider">
                <BarChart2 className="w-4 h-4" /> Data Driven Selection
            </div>
            <h2 className="text-3xl font-extrabold mb-2 uppercase text-white">Insights: Talento Seleccionado</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
                Demografía, alcance, engagement e intereses detallados extraídos directamente de las plataformas de los perfiles recomendados.
                <br/><span className="text-xs italic opacity-70">(Respaldado por las capturas de pantalla originales adjuntas en el dossier)</span>
            </p>
        </div>

        <div className="space-y-16">
            
            {/* JULIAN VALENCIA MEDIA KIT */}
            <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-xl overflow-hidden p-6 md:p-10">
                <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-indigo-500 shadow-lg flex-shrink-0">
                        <img src="https://i.postimg.cc/XJbbFKK1/julian_valencia.jpg" className="w-full h-full object-cover" alt="Julian Valencia" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-3xl font-black text-white">Julián Valencia</h3>
                            <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1"><CheckCircle className="w-3 h-3" /> VERIFICADO</span>
                        </div>
                        <p className="text-slate-400 font-medium">Categoría: Motos, Entretenimiento y Estilo de Vida</p>
                        <div className="flex gap-4 mt-4 text-sm font-bold">
                            <div className="bg-slate-950 px-4 py-2 rounded-lg border border-slate-800"><span className="text-indigo-400 block text-[10px] uppercase">Seguidores IG</span>120K+</div>
                            <div className="bg-slate-950 px-4 py-2 rounded-lg border border-slate-800"><span className="text-indigo-400 block text-[10px] uppercase">Alcance Prom. Mensual</span>1.4M+</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Col 1: Audiencia */}
                    <div className="col-span-1 space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 border-b border-slate-800 pb-2 mb-4">Perfil de Audiencia</h4>
                        
                        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Género</span>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-indigo-400">Hombres</span>
                                <span className="text-xs font-bold text-white">85.6%</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-2 mb-4"><div className="bg-indigo-500 h-2 rounded-full" style={{width: '85.6%'}}></div></div>
                            
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-pink-400">Mujeres</span>
                                <span className="text-xs font-bold text-white">14.3%</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-2"><div className="bg-pink-500 h-2 rounded-full" style={{width: '14.3%'}}></div></div>
                        </div>

                        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Edades Principales</span>
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-xs font-bold text-slate-300 mb-1"><span>25 - 34 años</span><span>49.3%</span></div>
                                    <div className="w-full bg-slate-800 rounded-full h-1.5"><div className="bg-cyan-400 h-1.5 rounded-full" style={{width: '49.3%'}}></div></div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs font-medium text-slate-400 mb-1"><span>18 - 24 años</span><span>24.7%</span></div>
                                    <div className="w-full bg-slate-800 rounded-full h-1.5"><div className="bg-slate-600 h-1.5 rounded-full" style={{width: '24.7%'}}></div></div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs font-medium text-slate-400 mb-1"><span>35 - 44 años</span><span>19.1%</span></div>
                                    <div className="w-full bg-slate-800 rounded-full h-1.5"><div className="bg-slate-600 h-1.5 rounded-full" style={{width: '19.1%'}}></div></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Col 2: Ubicación */}
                    <div className="col-span-1 space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 border-b border-slate-800 pb-2 mb-4">Geografía</h4>
                        
                        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Países Top</span>
                            <div className="space-y-2 mb-4 border-b border-slate-800 pb-4">
                                <div className="flex justify-between text-xs font-bold text-slate-200"><span>Colombia</span><span className="text-indigo-400">92.1%</span></div>
                                <div className="flex justify-between text-xs font-medium text-slate-500"><span>México</span><span>2.1%</span></div>
                                <div className="flex justify-between text-xs font-medium text-slate-500"><span>España</span><span>1.5%</span></div>
                            </div>
                            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Ciudades Top</span>
                            <div className="space-y-2">
                                <div className="flex justify-between text-[11px] font-bold text-slate-300"><span>Bogotá</span><span>40.9%</span></div>
                                <div className="flex justify-between text-[11px] font-medium text-slate-400"><span>Medellín</span><span>12.5%</span></div>
                                <div className="flex justify-between text-[11px] font-medium text-slate-400"><span>Cali</span><span>6.8%</span></div>
                                <div className="flex justify-between text-[11px] font-medium text-slate-400"><span>Villavicencio</span><span>3.9%</span></div>
                            </div>
                        </div>
                    </div>

                    {/* Col 3: Insights & Evidence */}
                    <div className="col-span-1 space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 border-b border-slate-800 pb-2 mb-4">Insights & Estrategia</h4>
                        
                        <div className="flex items-center justify-between bg-emerald-900/30 border border-emerald-500/30 rounded-2xl p-4">
                            <div>
                                <span className="block text-emerald-400 text-[10px] font-bold uppercase tracking-wider mb-1">Cuentas Alcanzadas (30d)</span>
                                <span className="block text-2xl font-black text-emerald-300">1.4 Millones</span>
                            </div>
                        </div>

                        <div className="bg-indigo-600 text-white p-6 rounded-2xl mt-4 shadow-lg shadow-indigo-600/20">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-white/20 rounded-full"><Target className="w-5 h-5" /></div>
                                <span className="font-bold">Match de Marca</span>
                            </div>
                            <p className="text-xs text-indigo-100 leading-relaxed mb-4">
                                Julián tiene una audiencia dominada por <strong>hombres jóvenes-adultos (25-34 años, 85% hombres)</strong>, apasionados por motores y estilo de vida urbano. Este segmento cruza directamente con el perfil del apostador activo de BetPlay.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* VALENTINA TAGUADO MEDIA KIT */}
            <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-xl overflow-hidden p-6 md:p-10">
                <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-cyan-500 shadow-lg flex-shrink-0">
                        <img src="https://i.postimg.cc/Y0tTDV5w/valentina.avif" className="w-full h-full object-cover" alt="Valentina Taguado" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-3xl font-black text-white">Valentina Taguado</h3>
                            <span className="bg-cyan-500 text-slate-900 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1"><CheckCircle className="w-3 h-3" /> VERIFICADA</span>
                        </div>
                        <p className="text-slate-400 font-medium">Categoría: Comedia, Lifestyle y Radio (Los 40)</p>
                        <div className="flex gap-4 mt-4 text-sm font-bold">
                            <div className="bg-slate-950 px-4 py-2 rounded-lg border border-slate-800"><span className="text-cyan-400 block text-[10px] uppercase">Seguidores IG</span>900K+</div>
                            <div className="bg-slate-950 px-4 py-2 rounded-lg border border-slate-800"><span className="text-cyan-400 block text-[10px] uppercase">Interacciones</span>Altas</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Col 1: Audiencia */}
                    <div className="col-span-1 space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 border-b border-slate-800 pb-2 mb-4">Perfil de Audiencia</h4>
                        
                        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Género</span>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-indigo-400">Hombres</span>
                                <span className="text-xs font-bold text-white">53.4%</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-2 mb-4"><div className="bg-indigo-500 h-2 rounded-full" style={{width: '53.4%'}}></div></div>
                            
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-pink-400">Mujeres</span>
                                <span className="text-xs font-bold text-white">46.6%</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-2"><div className="bg-pink-500 h-2 rounded-full" style={{width: '46.6%'}}></div></div>
                        </div>

                        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Edades Principales</span>
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-xs font-bold text-slate-300 mb-1"><span>25 - 34 años</span><span>49.5%</span></div>
                                    <div className="w-full bg-slate-800 rounded-full h-1.5"><div className="bg-cyan-400 h-1.5 rounded-full" style={{width: '49.5%'}}></div></div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs font-medium text-slate-400 mb-1"><span>35 - 44 años</span><span>23.8%</span></div>
                                    <div className="w-full bg-slate-800 rounded-full h-1.5"><div className="bg-cyan-400 h-1.5 rounded-full" style={{width: '23.8%'}}></div></div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs font-medium text-slate-400 mb-1"><span>18 - 24 años</span><span>17.1%</span></div>
                                    <div className="w-full bg-slate-800 rounded-full h-1.5"><div className="bg-slate-600 h-1.5 rounded-full" style={{width: '17.1%'}}></div></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Col 2: Ubicación */}
                    <div className="col-span-1 space-y-4">
                        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 mt-10">
                            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Ubicación Geográfica</span>
                            <div className="space-y-2 mb-4 border-b border-slate-800 pb-4">
                                <div className="flex justify-between text-xs font-bold text-slate-200"><span>Colombia</span><span className="text-cyan-400">80.2%</span></div>
                                <div className="flex justify-between text-xs font-medium text-slate-500"><span>Estados Unidos</span><span>5.3%</span></div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-[11px] font-bold text-slate-300"><span>Bogotá</span><span>26.5%</span></div>
                                <div className="flex justify-between text-[11px] font-medium text-slate-400"><span>Medellín</span><span>6.2%</span></div>
                                <div className="flex justify-between text-[11px] font-medium text-slate-400"><span>Cali</span><span>3.8%</span></div>
                            </div>
                        </div>
                    </div>

                    {/* Col 3: Insights & Evidence */}
                    <div className="col-span-1 space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 border-b border-slate-800 pb-2 mb-4">Engagement & Adquisición</h4>
                        
                        <div className="flex items-center justify-between bg-cyan-900/30 border border-cyan-500/30 rounded-2xl p-4">
                            <div>
                                <span className="block text-cyan-400 text-[10px] font-bold uppercase tracking-wider mb-1">Tasa de Engagement</span>
                                <span className="block text-2xl font-black text-cyan-300">2.84%</span>
                            </div>
                            <div className="px-3 py-1 bg-cyan-900/50 text-cyan-400 rounded-full text-xs font-bold border border-cyan-500/50">Buen Nivel</div>
                        </div>

                        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Fuente de Tráfico (Viralidad)</span>
                            <div className="mb-2">
                                <div className="flex justify-between text-xs font-bold mb-1 text-slate-200"><span>Para ti (Nuevas audiencias)</span><span className="text-indigo-400">84.0%</span></div>
                                <div className="w-full bg-slate-800 rounded-full h-2"><div className="bg-indigo-500 h-2 rounded-full" style={{width: '84.0%'}}></div></div>
                            </div>
                        </div>

                        <div className="bg-indigo-600 text-white p-6 rounded-2xl mt-6 shadow-lg shadow-indigo-600/20">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-white/20 rounded-full"><Target className="w-5 h-5" /></div>
                                <span className="font-bold">Match de Marca</span>
                            </div>
                            <p className="text-xs text-indigo-100 leading-relaxed mb-4">
                                Su público mixto y maduro (73% tiene entre 25 y 44 años) es el <strong>comprador ideal</strong> para casino online. Además, su tráfico viral (84% "Para ti") garantiza exposición masiva.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
