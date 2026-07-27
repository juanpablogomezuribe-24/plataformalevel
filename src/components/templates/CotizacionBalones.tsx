'use client'

import React, { useState } from 'react';

export default function CotizacionBalones({ data, brand }: { data: any, brand?: any }) {
  const brandColor = brand?.primaryColor || '#2563eb'; // blue-600 default for balones
  const [selectedSize, setSelectedSize] = useState(data?.options?.[2]?.id || data?.options?.[0]?.id || '5');
  const [deliveryMode, setDeliveryMode] = useState<'partial' | 'full'>('partial');

  const client = data?.client || { name: 'Cliente Ejemplo', nit: '123456789' };
  const product = data?.product || { name: 'Producción Técnica', description: 'Descripción del producto.' };
  const options = data?.options || [];
  const logistics = data?.logistics || { delivery: 'Local', freight: 'Incluido', time: '15 Días' };
  const masterBox = data?.masterBox || { dimensions: 'N/A', weight: 'N/A' };
  const baseUnits = data?.units || 500;

  const currentOption = options.find((o: any) => o.id === selectedSize) || options[0];
  const price = currentOption?.price || 0;
  const subtotal = price * baseUnits;
  const iva = subtotal * 0.19;
  const total = subtotal + iva;

  const format = (val: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(val);

  return (
    <div className="bg-slate-50 text-slate-900 pb-10 min-h-screen font-sans">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 md:py-4 flex justify-between items-center">
            <div className="flex items-center gap-2 md:gap-3">
                <div style={{ backgroundColor: brandColor }} className="p-1.5 md:p-2 rounded-lg text-white font-bold text-lg md:text-xl shadow-sm">L</div>
                <h1 className="text-xl md:text-2xl font-black tracking-tight" style={{ color: brandColor }}>LEVEL</h1>
            </div>
            <div className="text-right">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Propuesta</span>
                <span className="text-xs md:text-sm font-semibold" style={{ color: brandColor }}>{new Date().getFullYear()}</span>
            </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 md:py-8">
        {/* Client Info Section */}
        <section className="bg-white border border-slate-200 rounded-2xl p-5 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
            <div className="flex items-center gap-3">
                <div className="bg-slate-100 p-2.5 rounded-full text-slate-600 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/></svg>
                </div>
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cliente</p>
                    <h2 className="text-lg font-black text-slate-800 leading-tight">{client.name}</h2>
                    <p className="text-xs font-medium text-slate-500">NIT: {client.nit}</p>
                </div>
            </div>
            <div className="w-full sm:w-auto bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 text-center sm:text-right">
                <div className="text-[10px] font-bold uppercase" style={{ color: brandColor }}>Emisión</div>
                <div className="text-xs font-bold text-slate-800">{new Date().toLocaleDateString('es-CO')}</div>
            </div>
        </section>

        {/* Selection Section */}
        <section className="mb-8">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <svg style={{ color: brandColor }} className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.1 6.34a2 2 0 0 0 0 3.66l9.07 4.16a2 2 0 0 0 1.66 0l9.07-4.16a2 2 0 0 0 0-3.66z"/><path d="m2.1 12.34 9.07 4.16a2 2 0 0 0 1.66 0l9.07-4.16"/><path d="m2.1 16.34 9.07 4.16a2 2 0 0 0 1.66 0l9.07-4.16"/></svg>
                Variantes / Opciones
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {options.map((opt: any) => {
                  const isActive = selectedSize === opt.id;
                  return (
                    <button 
                      key={opt.id}
                      onClick={() => setSelectedSize(opt.id)} 
                      className={`p-4 rounded-xl border-2 transition-all text-left flex flex-row sm:flex-col justify-between items-center sm:items-start ${isActive ? 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-100' : 'bg-white border-transparent'}`}
                      style={isActive ? { borderColor: brandColor, backgroundColor: brandColor + '10' } : {}}
                    >
                        <div>
                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded mb-1 inline-block ${isActive ? 'text-white' : 'bg-slate-100 text-slate-500'}`} style={isActive ? { backgroundColor: brandColor } : {}}>
                              {opt.tag}
                            </span>
                            <h3 className="text-base font-black text-slate-900">{opt.title}</h3>
                        </div>
                        <p className={`text-sm font-bold sm:mt-2 ${isActive ? '' : 'text-slate-700'}`} style={isActive ? { color: brandColor } : {}}>
                          {format(opt.price)}
                        </p>
                    </button>
                  );
                })}
            </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                {/* Hero Section */}
                <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-slate-100">
                    <div className="flex flex-col md:flex-row">
                        <div className="p-6 md:p-10 flex flex-col justify-center md:w-1/2">
                            <div className="inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold mb-3 uppercase w-fit tracking-tighter">Destacado</div>
                            <h2 className="text-2xl font-black text-slate-900 leading-tight mb-3">{product.name}</h2>
                            <p className="text-slate-600 text-sm leading-relaxed mb-4">{product.description}</p>
                        </div>
                        <div className="bg-slate-100 h-48 md:h-auto md:w-1/2 relative">
                            {product.image && <img src={product.image} className="w-full h-full object-cover" alt={product.name} />}
                        </div>
                    </div>
                </div>

                {/* Logistics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="text-white p-5 rounded-2xl shadow-lg" style={{ backgroundColor: brandColor }}>
                        <h3 className="text-base font-bold mb-3 flex items-center gap-2">
                            <svg className="w-5 h-5 opacity-70" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>
                            Logística
                        </h3>
                        <div className="space-y-2 text-[11px] text-white/80">
                            <div className="flex justify-between border-b border-white/20 pb-1"><span>Entrega</span><span className="font-bold text-white uppercase tracking-tighter">{logistics.delivery}</span></div>
                            <div className="flex justify-between border-b border-white/20 pb-1"><span>Flete Nacional</span><span className="font-bold text-white italic">{logistics.freight}</span></div>
                            <div className="flex justify-between border-b border-white/20 pb-1"><span>Plazo Total</span><span className="font-bold text-white uppercase">{logistics.time}</span></div>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                        <h3 className="text-base font-bold mb-3 flex items-center gap-2 text-slate-800">
                            <svg style={{ color: brandColor }} className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
                            Caja Master
                        </h3>
                        <div className="space-y-1 text-[11px] text-slate-600">
                            <div className="flex justify-between"><span>Medidas:</span><span className="font-semibold text-slate-900">{masterBox.dimensions}</span></div>
                            <div className="flex justify-between"><span>Peso Caja:</span><span className="font-semibold text-slate-900">{masterBox.weight}</span></div>
                        </div>
                    </div>
                </div>

                {/* Schedule */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-bold mb-4 text-center">Plan de Despacho</h3>
                    <div className="flex p-1 bg-slate-100 rounded-xl mb-6 max-w-[240px] mx-auto text-[11px]">
                        <button 
                          onClick={() => setDeliveryMode('partial')} 
                          className={`flex-1 py-1.5 font-bold rounded-lg transition-all ${deliveryMode === 'partial' ? 'bg-white shadow-sm' : 'text-slate-500'}`}
                          style={deliveryMode === 'partial' ? { color: brandColor } : {}}
                        >
                          Semanales
                        </button>
                        <button 
                          onClick={() => setDeliveryMode('full')} 
                          className={`flex-1 py-1.5 font-bold rounded-lg transition-all ${deliveryMode === 'full' ? 'bg-white shadow-sm' : 'text-slate-500'}`}
                          style={deliveryMode === 'full' ? { color: brandColor } : {}}
                        >
                          Final
                        </button>
                    </div>
                    {deliveryMode === 'partial' ? (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {[baseUnits*0.3, baseUnits*0.3, baseUnits*0.3, baseUnits*0.1].map((q, i) => (
                            <div key={i} className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center">
                                <div className="text-[9px] text-slate-400 font-bold uppercase">Semana {i+1}</div>
                                <div className="text-lg font-black" style={{ color: brandColor }}>{Math.round(q)}</div>
                                <div className="text-[8px] text-slate-400 uppercase font-bold">Unid.</div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                        <span className="italic text-[11px] text-slate-500">Despacho único ({logistics.time})</span>
                        <span className="text-xl font-black" style={{ color: brandColor }}>{baseUnits} Unid.</span>
                      </div>
                    )}
                </div>
            </div>

            {/* Pricing Sidebar */}
            <div className="relative">
                <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xl lg:sticky lg:top-24">
                    <h3 className="text-lg font-black mb-5 flex items-center gap-2">
                        <svg style={{ color: brandColor }} className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                        Resumen Económico
                    </h3>
                    
                    <div className="space-y-3 mb-6 text-[13px]">
                        <div className="flex justify-between"><span>Talla/Opción:</span><span className="font-bold">{currentOption?.title}</span></div>
                        <div className="flex justify-between"><span>Unidades:</span><span className="font-bold">{baseUnits}</span></div>
                        <div className="flex justify-between"><span>Precio Unit:</span><span className="font-bold">{format(price)}</span></div>
                        <div className="pt-3 border-t border-dashed flex justify-between"><span>Subtotal:</span><span className="font-bold">{format(subtotal)}</span></div>
                        <div className="flex justify-between text-slate-500"><span>IVA (19%):</span><span className="font-bold">{format(iva)}</span></div>
                        <div className="pt-4 border-t-2 border-slate-100 flex justify-between items-center">
                          <span className="font-black text-sm uppercase">Total Neto:</span>
                          <span className="font-black text-xl" style={{ color: brandColor }}>{format(total)}</span>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl space-y-3 border border-slate-100">
                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest text-center mb-1">Esquema de Pago 50/50</p>
                        <div className="flex justify-between items-center"><span className="text-[11px] font-medium">Anticipo (50%):</span><span className="font-bold text-slate-900 text-sm">{format(total * 0.5)}</span></div>
                        <div className="flex justify-between items-center"><span className="text-[11px] font-medium">Final (50%):</span><span className="font-bold text-slate-900 text-sm">{format(total * 0.5)}</span></div>
                    </div>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
