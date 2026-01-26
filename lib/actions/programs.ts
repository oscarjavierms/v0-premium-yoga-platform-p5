// Dentro del return de ProgramForm, organiza los campos así:

<div className="grid grid-cols-2 gap-4">
  {/* EXPERIENCIA */}
  <div>
    <label className="text-sm font-medium">Experiencia</label>
    <select {...register("experience_type")} className="w-full border p-2 rounded">
      <option value="Yoga">Yoga</option>
      <option value="Meditacion">Meditación</option>
      <option value="Fitness">Fitness</option>
    </select>
  </div>

  {/* DIFICULTAD */}
  <div>
    <label className="text-sm font-medium">Dificultad</label>
    <select {...register("difficulty")} className="w-full border p-2 rounded">
      <option value="beginner">Principiante</option>
      <option value="intermediate">Intermedio</option>
      <option value="advanced">Avanzado</option>
    </select>
  </div>
</div>

{/* ÁREA DE ENFOQUE */}
<div className="mt-4">
  <label className="text-sm font-medium">Área de Enfoque</label>
  <input 
    {...register("focus_area")} 
    placeholder="Ej: Flexibilidad de cadera" 
    className="w-full border p-2 rounded"
  />
</div>

{/* TOTAL DE CLASES */}
<div className="mt-4">
  <label className="text-sm font-medium">Total de Clases</label>
  <input 
    type="number" 
    {...register("total_classes")} 
    className="w-full border p-2 rounded"
  />
</div>
