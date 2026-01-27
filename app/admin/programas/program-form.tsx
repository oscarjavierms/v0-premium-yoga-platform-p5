// ... (mismos imports de antes)

export function ProgramForm({ program, instructors }: any) {
  // ... (misma lógica de handleSubmit)

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 border border-zinc-100 shadow-sm">
      {/* ... (campos de Título, Slug y Descripción) ... */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Nivel</label>
          <select name="practice_level" defaultValue={program?.practice_level} className="w-full p-3 border-b border-zinc-100 bg-white outline-none">
            <option value="beginner">Principiante</option>
            <option value="intermediate">Intermedio</option>
            <option value="advanced">Avanzado</option>
            <option value="all">Todos los niveles</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Área de Enfoque</label>
          <input name="area_of_focus" defaultValue={program?.area_of_focus} placeholder="Ej: piernas, flexibilidad" className="w-full p-3 border-b border-zinc-100 outline-none focus:border-zinc-900" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Sesiones Actuales</label>
          <input 
            type="text" 
            readOnly 
            value={`${program?.classes?.length || 0} Clases vinculadas`} 
            className="w-full p-3 border-b border-zinc-100 bg-zinc-50 text-zinc-500 outline-none cursor-not-allowed" 
          />
        </div>
      </div>

      {/* ... (resto del formulario) ... */}
    </form>
  )
}
