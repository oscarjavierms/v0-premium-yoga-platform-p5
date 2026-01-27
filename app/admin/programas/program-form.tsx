"use client"
// ... otros imports

export function ProgramForm({ program, instructors }: any) {
  return (
    <form action={saveProgramAction} className="space-y-8">
      <input type="hidden" name="id" value={program?.id || "new"} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* NIVEL DE PRÁCTICA */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest font-bold">Nivel de Práctica</label>
          <select 
            name="practice_level" 
            defaultValue={program?.practice_level || "Todos los niveles"}
            className="w-full p-3 border border-zinc-100 rounded-sm text-sm bg-white"
          >
            <option value="Principiante">Principiante</option>
            <option value="Intermedio">Intermedio</option>
            <option value="Avanzado">Avanzado</option>
            <option value="Todos los niveles">Todos los niveles</option>
          </select>
        </div>

        {/* ÁREA DE ENFOQUE */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest font-bold">Área de Enfoque</label>
          <input 
            name="focus_area" 
            defaultValue={program?.focus_area}
            placeholder="Ej: Bienestar Integral, Flexibilidad"
            className="w-full p-3 border border-zinc-100 rounded-sm text-sm focus:border-zinc-900 outline-none"
          />
        </div>
      </div>

      {/* Aquí van los demás campos: título, descripción, instructor... */}
      <button type="submit" className="bg-zinc-900 text-white px-8 py-3 text-xs uppercase tracking-widest hover:bg-zinc-800 transition-colors">
        Guardar Programa
      </button>
    </form>
  )
}
