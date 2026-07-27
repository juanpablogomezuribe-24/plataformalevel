'use client'

import { Plus, Trash2, User } from 'lucide-react'

export default function TeamBlock({ data, onChange, readOnly = false }: { data: any, onChange?: (data: any) => void, readOnly?: boolean }) {
  const profiles = data.profiles || [
    { id: '1', name: 'Nombre Apellido', role: 'Cargo o Especialidad', avatarUrl: '' }
  ]

  const addProfile = () => {
    if (readOnly || !onChange) return
    if (profiles.length >= 8) return
    onChange({ ...data, profiles: [...profiles, { id: crypto.randomUUID(), name: '', role: '', avatarUrl: '' }] })
  }

  const updateProfile = (index: number, updates: any) => {
    if (readOnly || !onChange) return
    const newProfiles = [...profiles]
    newProfiles[index] = { ...newProfiles[index], ...updates }
    onChange({ ...data, profiles: newProfiles })
  }

  const removeProfile = (index: number) => {
    if (readOnly || !onChange) return
    const newProfiles = profiles.filter((_: any, i: number) => i !== index)
    onChange({ ...data, profiles: newProfiles })
  }

  return (
    <div className="w-full bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm p-8 md:p-12 my-8 transition-all hover:shadow-md">
      <input
        type="text"
        readOnly={readOnly}
        value={data.title || ''}
        onChange={(e) => onChange && onChange({ ...data, title: e.target.value })}
        placeholder="Título (ej. Nuestro Equipo)"
        className={`w-full text-2xl font-black text-slate-900 bg-transparent outline-none mb-10 text-center transition-all rounded-xl placeholder:text-slate-300 ${readOnly ? '' : 'focus:bg-slate-50 p-2'}`}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {profiles.map((profile: any, index: number) => (
          <div key={profile.id} className="flex flex-col items-center text-center relative group/profile">
            {!readOnly && profiles.length > 1 && (
              <button onClick={() => removeProfile(index)} className="absolute -top-2 -right-2 bg-white text-slate-400 hover:text-red-500 rounded-full p-1 shadow-sm border border-slate-100 opacity-0 group-hover/profile:opacity-100 transition-opacity z-10">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            
            <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-md overflow-hidden flex items-center justify-center mb-4 relative group/avatar">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-slate-300" />
              )}
              {!readOnly && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-opacity">
                  <input
                    type="text"
                    value={profile.avatarUrl}
                    onChange={(e) => updateProfile(index, { avatarUrl: e.target.value })}
                    placeholder="URL foto"
                    className="w-[90%] text-[10px] p-1 rounded bg-white text-slate-900 outline-none"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}
            </div>
            
            <input
              type="text"
              readOnly={readOnly}
              value={profile.name}
              onChange={(e) => updateProfile(index, { name: e.target.value })}
              placeholder="Nombre"
              className={`w-full font-bold text-slate-800 bg-transparent outline-none text-center transition-all rounded ${readOnly ? '' : 'focus:bg-slate-50 p-1'}`}
            />
            <input
              type="text"
              readOnly={readOnly}
              value={profile.role}
              onChange={(e) => updateProfile(index, { role: e.target.value })}
              placeholder="Cargo"
              className={`w-full text-xs font-medium text-slate-500 bg-transparent outline-none text-center mt-1 transition-all rounded ${readOnly ? '' : 'focus:bg-slate-50 p-1'}`}
            />
          </div>
        ))}
      </div>

      {!readOnly && profiles.length < 12 && (
        <div className="flex justify-center mt-10">
          <button onClick={addProfile} className="flex items-center text-sm font-bold text-slate-500 hover:text-cyan-600 transition-colors bg-slate-50 hover:bg-cyan-50 px-4 py-2 rounded-xl">
            <Plus className="w-4 h-4 mr-1" /> Añadir Perfil
          </button>
        </div>
      )}
    </div>
  )
}
