import React from 'react';
import { Lock, Unlock, Users, BarChart2, Camera, Play, Gamepad2, Video } from 'lucide-react';

export interface Influencer {
  name: string;
  category: string;
  status: 'available' | 'busy';
  partner: string | null;
  image: string;
  link: string;
  icon: string;
  mainPlatform: string;
  gender?: string;
  audience?: string;
}

interface LevelInfluencersProps {
  data?: {
    influencersData: Influencer[];
  };
}

const getPlatformIcon = (icon: string) => {
  switch (icon) {
    case 'instagram': return <Camera className="w-3 h-3" />;
    case 'youtube': return <Play className="w-3 h-3" />;
    case 'twitch': return <Gamepad2 className="w-3 h-3" />;
    case 'video': return <Video className="w-3 h-3" />;
    default: return <Camera className="w-3 h-3" />;
  }
};

const getPlatformColor = (platform: string) => {
  if (platform.includes('TikTok')) return 'bg-slate-800';
  if (platform === 'YouTube') return 'bg-red-600';
  if (platform === 'Twitch') return 'bg-purple-600';
  return 'bg-pink-600';
};

export const LevelInfluencers: React.FC<LevelInfluencersProps> = ({ data }) => {
  const influencers = data?.influencersData || [];

  return (
    <div className="animate-slide-right p-4 md:p-10 max-w-7xl mx-auto text-slate-200">
        <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold mb-2 uppercase text-white">Nuestro Squad</h2>
            <p className="text-slate-400">Talento seleccionado para amplificar el mensaje de Evolution.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {influencers.map((inf, i) => (
                <div key={i} className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer bg-slate-900 shadow-lg shadow-indigo-500/5 border border-slate-800 hover:border-indigo-500/50 hover:shadow-indigo-500/20 transition-all">
                    <img src={inf.image} alt={inf.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0 opacity-80 group-hover:opacity-100" />
                    <div className="absolute top-3 right-3 z-10">
                        {inf.status === 'available' 
                            ? <span className="bg-emerald-500 text-slate-900 text-[10px] font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1"><Unlock className="w-3 h-3" /> DISPONIBLE</span>
                            : <span className="bg-slate-900/90 backdrop-blur-sm text-slate-300 text-[10px] font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1 border border-slate-700"><Lock className="w-3 h-3" /> {inf.partner}</span>
                        }
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent opacity-90 group-hover:via-slate-900/40"></div>
                    <div className="absolute bottom-0 p-4 w-full text-white">
                        <h3 className="font-bold text-lg leading-tight mb-1 text-white">{inf.name}</h3>
                        <p className="text-xs text-indigo-300 mb-2">{inf.category}</p>
                        {inf.audience && (
                            <div className="mb-3 flex items-start gap-1">
                                <Users className="w-3 h-3 mt-0.5 text-cyan-400" /> 
                                <span className="text-[10px] text-slate-300 leading-tight">{inf.audience}</span>
                            </div>
                        )}
                        
                        <div className="flex items-center gap-2">
                             <a href={inf.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-indigo-600 hover:border-indigo-500 transition-colors">
                                {getPlatformIcon(inf.icon)} Ver Perfil
                            </a>
                            <div className="flex items-center gap-1">
                                {inf.gender && <span className="bg-white/10 backdrop-blur-md border border-white/10 px-2 py-1.5 rounded-lg text-[10px] font-bold text-white">{inf.gender.split(' ')[0]}</span>}
                                {inf.mainPlatform && <span className={`${getPlatformColor(inf.mainPlatform)} text-white px-2 py-1.5 rounded-lg text-[10px] font-bold`}>{inf.mainPlatform.split(' ')[0]}</span>}
                            </div>
                        </div>

                         {inf.audience && (
                            <button className="mt-3 w-full bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold py-2 rounded-lg hover:bg-indigo-600 hover:text-white hover:border-indigo-500 transition-colors flex items-center justify-center gap-2">
                                <BarChart2 className="w-3 h-3" /> Ver Audiencia
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
        <div className="mt-12 text-center">
            <button className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold uppercase tracking-wider text-sm hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20">
                Ver Paquetes Comerciales
            </button>
        </div>
    </div>
  );
};
