import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, GripVertical } from "lucide-react";

interface Level {
  number: string;
  label: string;
  text: string;
}

export default function PorQueExistimosEditor({
  metadata,
  onChange,
}: {
  metadata: Record<string, unknown>;
  onChange: (m: Record<string, unknown>) => void;
}) {
  const levels = Array.isArray(metadata.levels)
    ? (metadata.levels as Level[])
    : [];

  const updateField = (key: string, value: string) => {
    onChange({ ...metadata, [key]: value || undefined });
  };

  const updateLevel = (index: number, field: keyof Level, value: string) => {
    const updated = levels.map((l, i) =>
      i === index ? { ...l, [field]: value } : l
    );
    onChange({ ...metadata, levels: updated });
  };

  const addLevel = () => {
    const next = levels.length + 1;
    onChange({
      ...metadata,
      levels: [
        ...levels,
        { number: String(next).padStart(2, "0"), label: "Nuevo nivel", text: "" },
      ],
    });
  };

  const removeLevel = (index: number) => {
    onChange({ ...metadata, levels: levels.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4 p-3 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
      <Label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
        Contenido — Por qué existimos
      </Label>

      {/* Paragraphs */}
      <div className="space-y-3">
        <div>
          <Label className="text-zinc-500 text-[10px] uppercase">Párrafo 1</Label>
          <Textarea
            value={(metadata.p1 as string) ?? ""}
            onChange={(e) => updateField("p1", e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white text-sm mt-0.5 min-h-[60px]"
            placeholder="Primer párrafo introductorio"
          />
        </div>
        <div>
          <Label className="text-zinc-500 text-[10px] uppercase">Frase destacada (P2)</Label>
          <Input
            value={(metadata.p2 as string) ?? ""}
            onChange={(e) => updateField("p2", e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white text-sm mt-0.5"
            placeholder="Frase grande en bold"
          />
        </div>
        <div>
          <Label className="text-zinc-500 text-[10px] uppercase">Párrafo 3</Label>
          <Textarea
            value={(metadata.p3 as string) ?? ""}
            onChange={(e) => updateField("p3", e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white text-sm mt-0.5 min-h-[60px]"
            placeholder="Tercer párrafo"
          />
        </div>
      </div>

      {/* Levels */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
            Niveles ({levels.length})
          </Label>
          <button
            onClick={addLevel}
            className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <Plus className="h-3 w-3" /> Agregar nivel
          </button>
        </div>

        <div className="space-y-2">
          {levels.map((level, i) => (
            <div
              key={i}
              className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 space-y-2"
            >
              <div className="flex items-center gap-2">
                <GripVertical className="h-3.5 w-3.5 text-zinc-600 flex-shrink-0" />
                <div className="grid grid-cols-[60px_1fr] gap-2 flex-1">
                  <div>
                    <Label className="text-zinc-500 text-[10px] uppercase">Nro</Label>
                    <Input
                      value={level.number}
                      onChange={(e) => updateLevel(i, "number", e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-white text-xs h-7 px-2 mt-0.5"
                      placeholder="01"
                    />
                  </div>
                  <div>
                    <Label className="text-zinc-500 text-[10px] uppercase">Etiqueta</Label>
                    <Input
                      value={level.label}
                      onChange={(e) => updateLevel(i, "label", e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-white text-xs h-7 px-2 mt-0.5"
                      placeholder="Nivel práctico"
                    />
                  </div>
                </div>
                <button
                  onClick={() => removeLevel(i)}
                  className="text-zinc-600 hover:text-red-400 transition-colors p-1 self-start mt-3"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div>
                <Label className="text-zinc-500 text-[10px] uppercase">Texto</Label>
                <Textarea
                  value={level.text}
                  onChange={(e) => updateLevel(i, "text", e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white text-xs mt-0.5 min-h-[50px]"
                  placeholder="Descripción del nivel"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Final paragraph & closing quote */}
      <div className="space-y-3">
        <div>
          <Label className="text-zinc-500 text-[10px] uppercase">Párrafo final</Label>
          <Textarea
            value={(metadata.p_final as string) ?? ""}
            onChange={(e) => updateField("p_final", e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white text-sm mt-0.5 min-h-[60px]"
            placeholder="Párrafo de cierre"
          />
        </div>
        <div>
          <Label className="text-zinc-500 text-[10px] uppercase">Frase de cierre (gradiente)</Label>
          <Input
            value={(metadata.closing_quote as string) ?? ""}
            onChange={(e) => updateField("closing_quote", e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white text-sm mt-0.5"
            placeholder="Somos arquitectos del revenue..."
          />
        </div>
      </div>
    </div>
  );
}
