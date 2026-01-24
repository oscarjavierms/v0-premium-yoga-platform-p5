// 1. Asegúrate de que la interfaz reciba initialData
interface ProgramFormProps {
  initialData?: any; // Aquí vendrá la info del programa si es edición
}

export function ProgramForm({ initialData }: ProgramFormProps) {
  // 2. Usamos initialData para rellenar los valores por defecto
  // Si usas react-hook-form, se vería algo así:
  const form = useForm({
    defaultValues: initialData ? {
      title: initialData.title,
      description: initialData.description,
      pillar: initialData.pillar,
      // ... todos tus otros campos
    } : {
      title: "",
      description: "",
      pillar: "movement",
    }
  });

  // Si usas estados simples (useState), se vería así:
  const [title, setTitle] = useState(initialData?.title || "");

  return (
    <form>
      <input 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        placeholder="Título del programa"
      />
      {/* Resto de tus campos */}
    </form>
  );
}
