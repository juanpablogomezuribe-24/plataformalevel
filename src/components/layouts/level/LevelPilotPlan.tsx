import React from 'react';
import { Swords, Link, MonitorPlay, Gift, Clapperboard, ListChecks, Calendar, Wallet, BarChart2, CheckSquare } from 'lucide-react';

export const LevelPilotPlan: React.FC<{ data?: any }> = ({ data }) => {
  return (
    <div className="animate-slide-up p-4 md:p-10 max-w-7xl mx-auto pb-20 text-slate-200">
        <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full bg-red-900/30 text-red-400 text-xs font-bold border border-red-500/30 uppercase tracking-wider">
                <Swords className="w-4 h-4" /> Proyecto Piloto
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 uppercase tracking-tight text-white">El Reto de las Cartas</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                Torneo de Mesas Evolution en BetPlay<br/>
                <span className="font-bold text-white">16 al 30 de Junio de 2026</span>
            </p>
        </div>

        {/* HERO IMAGES */}
        <div className="flex justify-center items-center mb-16 relative">
            <div className="w-40 h-40 md:w-56 md:h-56 rounded-full border-4 border-slate-900 shadow-2xl shadow-indigo-500/20 overflow-hidden relative z-10 transform translate-x-4 md:translate-x-8">
                <img src="https://i.postimg.cc/XJbbFKK1/julian_valencia.jpg" className="w-full h-full object-cover" alt="Julian Valencia" />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 to-transparent p-2 text-center text-white font-bold text-xs">Julián Valencia</div>
            </div>
            <div className="w-12 h-12 md:w-16 md:h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center font-black italic text-xl md:text-2xl z-20 border-4 border-slate-900 shadow-xl shadow-indigo-600/30">
                VS
            </div>
            <div className="w-40 h-40 md:w-56 md:h-56 rounded-full border-4 border-slate-900 shadow-2xl shadow-cyan-500/20 overflow-hidden relative z-10 transform -translate-x-4 md:-translate-x-8">
                <img src="https://i.postimg.cc/NGWrvK3h/Whats-App-Image-2026-02-10-at-8-03-14-PM.jpg" className="w-full h-full object-cover" alt="Cristian González" />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 to-transparent p-2 text-center text-white font-bold text-xs">Cristian González</div>
            </div>
        </div>

        {/* TIMELINE */}
        <div className="max-w-4xl mx-auto">
            <div className="relative border-l-4 border-indigo-500/30 pl-8 md:pl-12 py-6 space-y-12">
                
                {/* PREVIA */}
                <div className="relative">
                    <div className="absolute -left-[45px] md:-left-[61px] top-0 w-12 h-12 md:w-14 md:h-14 bg-slate-900 border-2 border-indigo-500 text-indigo-400 rounded-full flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-500/20">1</div>
                    <h3 className="text-2xl font-black uppercase mb-2 text-white">La Previa (El Beef)</h3>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Storytelling cronológico en Redes</p>
                    
                    <div className="space-y-4">
                        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex gap-4 items-start hover:border-indigo-500 transition-colors shadow-lg">
                            <img src="https://i.postimg.cc/XJbbFKK1/julian_valencia.jpg" className="w-10 h-10 rounded-full object-cover shadow-sm mt-1" alt="Julian" />
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-bold text-sm text-white">Julián Valencia</h4>
                                    <span className="bg-pink-900/30 text-pink-400 border border-pink-500/30 px-2 py-0.5 rounded text-[9px] font-bold uppercase">Reel</span>
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed"><strong className="text-slate-200">Paso 1. Reto 21 en el Semáforo:</strong> Julián en su moto para en un semáforo y le dice a un conductor: "Saque cartas, si suma 21 le doy 100 lucas". El usuario saca cartas. Julián saca cartas y saca 20. El usuario pierde. <span className="bg-cyan-900/50 text-cyan-300 font-bold px-1 rounded">Lo repite con 3 personas distintas</span> y todas pierden. Cierra el video diciendo: <i>"Estaré por Bogotá a ver quién me gana al 21"</i>.</p>
                            </div>
                        </div>
                        
                        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex gap-4 items-start hover:border-cyan-500 transition-colors shadow-lg">
                            <img src="https://i.postimg.cc/NGWrvK3h/Whats-App-Image-2026-02-10-at-8-03-14-PM.jpg" className="w-10 h-10 rounded-full object-cover shadow-sm mt-1" alt="Cristian" />
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-bold text-sm text-white">Cristian González</h4>
                                    <span className="bg-indigo-900/30 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded text-[9px] font-bold uppercase">Historia</span>
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed"><strong className="text-slate-200">Paso 2. La Reacción:</strong> A los pocos días, Cristian se graba viendo el Reel de Julián y le dice a su audiencia: "Oigan, estaba viendo este video... obviamente tiene el juego arreglado. Qué venga, soy capaz de ganarle y apostarle duro".</p>
                            </div>
                        </div>

                        <div className="bg-slate-950 text-white p-5 rounded-2xl border border-indigo-500/50 flex gap-4 items-start hover:border-indigo-400 transition-colors shadow-xl shadow-indigo-500/10">
                            <div className="flex -space-x-3 mt-1">
                                <img src="https://i.postimg.cc/XJbbFKK1/julian_valencia.jpg" className="w-10 h-10 rounded-full object-cover shadow-sm border-2 border-slate-950" alt="Julian" />
                                <img src="https://i.postimg.cc/NGWrvK3h/Whats-App-Image-2026-02-10-at-8-03-14-PM.jpg" className="w-10 h-10 rounded-full object-cover shadow-sm border-2 border-slate-950" alt="Cristian" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-bold text-sm text-cyan-400">Julián & Cristian</h4>
                                    <span className="bg-red-900/30 text-red-400 px-2 py-0.5 rounded text-[9px] font-bold uppercase border border-red-500/30">Clímax (Historias)</span>
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed"><strong className="text-white">Paso 5. El Encuentro:</strong> Julián llega al lugar. "Listo, 10 millones en la mesa". Ambos sacan las cartas... Julián voltea su carta hacia la cámara y... ¡Corte a negro!</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 bg-red-900/20 text-red-400 p-4 rounded-xl text-sm font-bold flex items-center gap-3 shadow-sm border border-red-500/30 animate-pulse">
                        <Link className="w-5 h-5 flex-shrink-0" />
                        El Hook Final: Se sube una historia a ambas cuentas: "¿Quieren saber quién ganó los 10 palos al 21? Entren al Stream YA". (Link directo al en vivo de Evolution).
                    </div>
                </div>

                {/* DURANTE */}
                <div className="relative">
                    <div className="absolute -left-[45px] md:-left-[61px] top-0 w-12 h-12 md:w-14 md:h-14 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg shadow-red-600/30 animate-pulse">2</div>
                    <h3 className="text-2xl font-black uppercase mb-2 text-white">El Durante (El Evento)</h3>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Transmisión en Vivo (2 Horas)</p>
                    
                    <div className="bg-slate-900 p-8 rounded-2xl border-2 border-red-500/30 shadow-xl">
                        <div className="space-y-8">
                            <div>
                                <h4 className="font-black text-sm uppercase mb-2 flex items-center gap-2 text-white"><MonitorPlay className="w-4 h-4 text-red-500" /> Resolución y Gameplay</h4>
                                <p className="text-sm text-slate-400 leading-relaxed">Se abre el Stream revelando quién ganó la carta en la calle. Como la temática es Blackjack/21, anuncian que jugarán en las mesas de <strong className="text-slate-200">Evolution en BetPlay</strong> para multiplicar o recuperar la plata.</p>
                            </div>
                            <div className="bg-slate-950 p-4 rounded-xl border border-red-500/20">
                                <h4 className="font-black text-sm uppercase mb-2 flex items-center gap-2 text-white"><Gift className="w-4 h-4 text-red-500" /> Incentivo de Registro y Juego</h4>
                                <p className="text-sm text-slate-300 leading-relaxed">Para involucrar a la audiencia activa, se sortean premios físicos o Bonos. <br/><br/><strong className="text-red-400">La condición:</strong> Para participar, los espectadores deben haber jugado un mínimo de $5.000 COP en las mesas de Evolution durante el stream.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* POST */}
                <div className="relative">
                    <div className="absolute -left-[45px] md:-left-[61px] top-0 w-12 h-12 md:w-14 md:h-14 bg-emerald-500 text-slate-900 rounded-full flex items-center justify-center font-bold text-xl shadow-lg shadow-emerald-500/30">3</div>
                    <h3 className="text-2xl font-black uppercase mb-2 text-white">El Post (Amplificación)</h3>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Días posteriores al evento</p>
                    
                    <div className="bg-indigo-900/30 text-white p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6 shadow-2xl border border-indigo-500/30 hover:scale-[1.02] transition-transform">
                        <div className="w-16 h-16 bg-indigo-600/30 rounded-full flex items-center justify-center flex-shrink-0 border border-indigo-500/50">
                            <Clapperboard className="w-8 h-8 text-cyan-400" />
                        </div>
                        <div>
                            <h4 className="font-bold text-sm mb-2 text-cyan-400 uppercase tracking-widest">Reel "Mejores Momentos"</h4>
                            <p className="text-sm text-indigo-100/80 leading-relaxed">
                                Edición premium resumiendo la historia completa.
                                <br/><br/>
                                Publicado en <strong className="text-white">Colaboración Oficial (Collab)</strong> entre Julián Valencia x Cristian González x BetPlay.
                            </p>
                        </div>
                    </div>
                </div>

                {/* CHECKLIST */}
                <div className="mt-16 bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-5">
                        <ListChecks className="w-24 h-24 text-white" />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-2xl font-black uppercase mb-2 text-white">Checklist de Ejecución</h3>
                        <p className="text-sm text-slate-400 mb-6">Requerimientos operativos por parte de Evolution y el Operador para arrancar el piloto.</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                                <div className="bg-indigo-600 text-white p-1.5 rounded-md mt-0.5"><Calendar className="w-4 h-4" /></div>
                                <div>
                                    <h4 className="font-bold text-sm text-white">1. Fecha y Hora</h4>
                                    <p className="text-xs text-slate-500">Definir el día exacto y la hora del stream.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                                <div className="bg-indigo-600 text-white p-1.5 rounded-md mt-0.5"><Wallet className="w-4 h-4" /></div>
                                <div>
                                    <h4 className="font-bold text-sm text-white">2. Fondeo de Cuenta</h4>
                                    <p className="text-xs text-slate-500">Cargar los $10.000.000 COP a la cuenta de Julián Valencia.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800 md:col-span-2">
                                <div className="bg-indigo-600 text-white p-1.5 rounded-md mt-0.5"><CheckSquare className="w-4 h-4" /></div>
                                <div>
                                    <h4 className="font-bold text-sm text-white">3. Aprobación de Retos</h4>
                                    <p className="text-xs text-slate-500">Revisión y OK por parte de la marca a la lista de castigos.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    </div>
  );
};
