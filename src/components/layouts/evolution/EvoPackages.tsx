import React, { useState } from 'react';
import { CheckCircle, BarChart3, Sparkles, Check, Layout, Star, Tag } from 'lucide-react';

export interface PackageScope {
  previa: string;
  durante: string;
  post: string;
}

export interface PackageData {
  id: number;
  title: string;
  subtitle: string;
  desc: string;
  price: string;
  scope: PackageScope;
  kpis?: string[];
  features: string[];
  benefits?: string[];
}

interface EvoPackagesProps {
  data?: {
    packages: Record<number, PackageData>;
    logoGlobal?: string;
  };
}

export const EvoPackages: React.FC<EvoPackagesProps> = ({ data }) => {
  const [selectedPackage, setSelectedPackage] = useState<number>(1);
  const packages = data?.packages || {};
  const pkg = packages[selectedPackage];

  if (!pkg) return null;

  const packageIds = [1, 2, 3, 4];

  return (
    <div className="animate-slide-right p-4 md:p-10 max-w-7xl mx-auto pb-20 text-slate-200">
        <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold mb-2 uppercase text-white">Paquetes para Evolution</h2>
            <p className="text-slate-400">Selecciona una opción para ver el alcance detallado.</p>
        </div>
        <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="w-full lg:w-1/3 space-y-4">
                {packageIds.map(id => (
                    <button key={id} onClick={() => setSelectedPackage(id)} className={`w-full text-left p-6 rounded-2xl border-2 transition-all group relative overflow-hidden ${selectedPackage === id ? 'border-indigo-500 bg-indigo-900/20 text-white shadow-xl shadow-indigo-500/10 scale-[1.02]' : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'}`}>
                        <div className="relative z-10 flex justify-between items-center">
                            <div>
                                <h3 className={`font-bold text-lg ${selectedPackage === id ? 'text-white' : 'text-slate-300'}`}>{packages[id]?.title}</h3>
                                <p className={`text-xs uppercase tracking-widest font-bold mt-1 ${selectedPackage === id ? 'text-indigo-300' : 'text-slate-500'}`}>{packages[id]?.subtitle}</p>
                            </div>
                            {selectedPackage === id && <CheckCircle className="w-6 h-6 text-indigo-400" />}
                        </div>
                    </button>
                ))}
            </div>
            
            <div className="w-full lg:w-2/3">
                <div className="bg-slate-900 p-8 rounded-[2rem] border border-slate-800 shadow-2xl shadow-indigo-500/5 relative overflow-hidden min-h-[500px]">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <img src={data?.logoGlobal} className="h-12 invert" alt="Evolution" />
                    </div>
                    <div className="relative z-10">
                        <div className="mb-8 border-b border-slate-800 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h3 className="text-3xl font-black mb-2 text-white">{pkg.title}</h3>
                                <p className="text-lg text-slate-400 font-medium leading-relaxed" dangerouslySetInnerHTML={{__html: pkg.desc}}></p>
                            </div>
                            <div className="bg-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg shadow-indigo-500/20">
                                <span className="block text-xs font-bold uppercase tracking-wider opacity-70">Inversión</span>
                                <span className="text-2xl font-black" dangerouslySetInnerHTML={{__html: pkg.price}}></span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div>
                                <h4 className="font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2 text-slate-300"><Layout className="w-4 h-4 text-indigo-400" /> Alcance por Fase</h4>
                                <ul className="space-y-4">
                                    <li className="bg-slate-950/50 p-3 rounded-lg border-l-4 border-slate-700"><span className="block text-xs font-bold text-slate-500 uppercase">Previa</span><span className="text-sm font-medium text-slate-300" dangerouslySetInnerHTML={{__html: pkg.scope.previa}}></span></li>
                                    <li className="bg-slate-950/50 p-3 rounded-lg border-l-4 border-indigo-500"><span className="block text-xs font-bold text-slate-500 uppercase">Durante</span><span className="text-sm font-medium text-slate-300" dangerouslySetInnerHTML={{__html: pkg.scope.durante}}></span></li>
                                    <li className="bg-slate-950/50 p-3 rounded-lg border-l-4 border-slate-700"><span className="block text-xs font-bold text-slate-500 uppercase">Post</span><span className="text-sm font-medium text-slate-300" dangerouslySetInnerHTML={{__html: pkg.scope.post}}></span></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2 text-slate-300"><Star className="w-4 h-4 text-cyan-400" /> Incluye</h4>
                                <div className="flex flex-wrap gap-2 mb-8">
                                    {pkg.features.map((f, i) => <span key={i} className="px-3 py-1.5 bg-slate-800 text-cyan-400 border border-slate-700 rounded-md text-xs font-bold">{f}</span>)}
                                </div>
                                
                                {pkg.kpis && (
                                    <div className="mt-6 p-4 bg-emerald-950/30 border border-emerald-900/50 rounded-xl">
                                        <h5 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-3 flex items-center gap-2"><BarChart3 className="w-4 h-4" /> KPIs Esperados</h5>
                                        <ul className="grid grid-cols-1 gap-2">
                                            {pkg.kpis.map((kpi, i) => <li key={i} className="flex items-center gap-2 text-xs text-emerald-200/80"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> <span dangerouslySetInnerHTML={{__html: kpi}}></span></li>)}
                                        </ul>
                                    </div>
                                )}
                                
                                {pkg.benefits && (
                                    <div className="mt-4 p-4 bg-indigo-950/30 border border-indigo-900/50 rounded-xl">
                                        <h5 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4" /> Beneficios Influencer</h5>
                                        <ul className="grid grid-cols-1 gap-2">
                                            {pkg.benefits.map((b, i) => <li key={i} className="flex items-start gap-2 text-xs text-indigo-200/80"><Check className="w-3 h-3 mt-0.5 text-indigo-500" /> <span dangerouslySetInnerHTML={{__html: b}}></span></li>)}
                                        </ul>
                                    </div>
                                )}
                                
                                <div className="mt-4 p-4 bg-cyan-950/30 border border-cyan-900/50 rounded-xl flex items-start gap-3">
                                    <Tag className="w-5 h-5 text-cyan-500 mt-0.5 flex-shrink-0" />
                                    <p className="text-xs text-cyan-200/80 font-medium italic leading-relaxed">
                                        "Este paquete está diseñado para {selectedPackage === 1 ? 'maximizar el valor de producción y cobertura' : selectedPackage === 2 ? 'lanzamientos rápidos y efectivos' : selectedPackage === 4 ? 'estrategias de alcance masivo y posicionamiento premium' : 'campañas de alto impacto con tracción de audiencia externa'}."
                                    </p>
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
