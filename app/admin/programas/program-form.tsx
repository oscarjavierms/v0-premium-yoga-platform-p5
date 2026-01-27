{/* SECCIÓN 2: GESTIÓN DE CLASES */}
<section className="space-y-6">
  <div className="flex justify-between items-end border-b border-zinc-100 pb-4">
    <div>
      <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-900">Sesiones del Programa</h2>
      <p className="text-zinc-400 text-[11px] italic mt-1 font-light tracking-wide">Gestiona el contenido específico de cada clase</p>
    </div>
    <button 
      type="button" 
      onClick={addClassRow}
      className="flex items-center gap-2 bg-zinc-900 text-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all"
    >
      <Plus size={14} /> Agregar Clase
    </button>
  </div>

  <div className="space-y-4">
    {classes.map((clase, index) => (
      <div key={index} className="bg-white border border-zinc-100 p-6 shadow-sm group relative">
        <button 
          type="button" 
          onClick={() => removeClass(index)}
          className="absolute top-4 right-4 text-zinc-300 hover:text-red-500 transition-colors"
        >
          <Trash2 size={16} />
        </button>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Datos de la Sesión: Título, Video y Área de Enfoque */}
          <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[9px] uppercase text-zinc-400 font-bold tracking-widest">Título de la Sesión</label>
              <input 
                placeholder="Ej: Día 1 - Flow de Mañana" 
                value={clase.title}
                onChange={(e) => updateClass(index, "title", e.target.value)}
                className="w-full border-b border-zinc-100 py-2 text-sm outline-none focus:border-zinc-900 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] uppercase text-zinc-400 font-bold tracking-widest">URL Video (Vimeo/YT)</label>
              <input 
                placeholder="vimeo.com/..." 
                value={clase.vimeo_url}
                onChange={(e) => updateClass(index, "vimeo_url", e.target.value)}
                className="w-full border-b border-zinc-100 py-2 text-sm outline-none focus:border-zinc-900 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] uppercase text-zinc-400 font-bold tracking-widest">Área de Enfoque de la Clase</label>
              <input 
                placeholder="Ej: Caderas, Core, Relax" 
                value={clase.focus_area} // Este campo se guardará en la tabla 'classes'
                onChange={(e) => updateClass(index, "focus_area", e.target.value)}
                className="w-full border-b border-zinc-100 py-2 text-sm outline-none focus:border-zinc-900 transition-colors"
              />
            </div>
          </div>

          {/* Descripción de la clase */}
          <div className="md:col-span-12 space-y-2">
            <label className="text-[9px] uppercase text-zinc-400 font-bold tracking-widest">Descripción de la Sesión</label>
             <textarea 
              placeholder="¿Qué aprenderá el alumno en esta clase específica?" 
              value={clase.description}
              onChange={(e) => updateClass(index, "description", e.target.value)}
              rows={2}
              className="w-full border border-zinc-100 p-3 text-sm outline-none focus:border-zinc-900 transition-colors"
            />
          </div>
        </div>
      </div>
    ))}
  </div>
</section>
