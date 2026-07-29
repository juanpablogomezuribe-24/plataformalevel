import React from 'react';
import { motion } from 'framer-motion';

export interface CatalogItem {
  name?: string;
  role?: string;
  description?: string;
}

export interface LevelCatalogData {
  title?: string;
  items?: CatalogItem[];
}

export const LevelCatalog: React.FC<{ data: LevelCatalogData }> = ({ data }) => {
  const items = data.items && data.items.length > 0 ? data.items : [];

  return (
    <div className="w-full min-h-full flex flex-col p-12 lg:p-24 bg-[#0B1120] text-white relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
      <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-indigo-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16 text-center max-w-4xl mx-auto z-10"
      >
        <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent tracking-tight">
          {data.title || 'Catálogo y Perfiles'}
        </h2>
        <div className="w-24 h-1.5 bg-indigo-500 mx-auto mt-8 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
      </motion.div>

      <div className="flex-1 w-full max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              className="group bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 hover:border-indigo-500/50 hover:bg-white/10 transition-all duration-500 shadow-xl"
            >
              {/* Image Placeholder */}
              <div className="w-full h-48 bg-slate-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10"></div>
                <img 
                  src={`https://api.dicebear.com/7.x/shapes/svg?seed=${(item.name || 'User').replace(' ', '')}&backgroundColor=0f172a,4f46e5`} 
                  alt={item.name} 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                />
                <div className="absolute bottom-4 left-6 z-20">
                  <h3 className="text-2xl font-black text-white drop-shadow-md">
                    {item.name || 'Nombre / Título'}
                  </h3>
                  <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mt-1">
                    {item.role || 'Categoría o Rol'}
                  </p>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-slate-400 font-light leading-relaxed text-sm line-clamp-4 group-hover:text-slate-300 transition-colors">
                  {item.description || 'Descripción detallada del perfil, producto o elemento del catálogo. Puedes escribir aquí todas las especificaciones necesarias.'}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
