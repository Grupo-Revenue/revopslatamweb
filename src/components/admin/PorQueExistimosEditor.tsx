import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, GripVertical } from "lucide-react";

interface Level {
  number: string;
  label: string;
  text: string;
}

function ColorInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <Label className="text-zinc-500 text-[10px] uppercase">{label}</Label>
      <div className="flex items-center gap-1 mt-0.5">
        <input
          type="color"
          value={value || "#ffffff"}
          onChange={(e) => onChange(e.target.value)}
          className="w-6 h-6 rounded border border-zinc-700 cursor-pointer bg-transparent flex-shrink-0"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "#fff"}
          className="bg-zinc-800 border-zinc-700 text-white text-xs h-7 px-2"
        />
      </div>
    </div>
  );
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

  const updateField = (key: string, value: unknown) => {
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
    <div className="space-y-5 p-3 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
      <Label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
        Contenido — Por qué existimos
      </Label>

      {/* Paragraph 1 */}
      <div>
        <Label className="text-zinc-500 text-[10px] uppercase">Párrafo 1</Label>
        <Textarea
          value={(metadata.p1 as string) ?? ""}
          onChange={(e) => updateField("p1", e.target.value)}
          className="bg-zinc-800 border-zinc-700 text-white text-sm mt-0.5 min-h-[60px]"
          placeholder="Primer párrafo introductorio"
        />
        <div className="grid grid-cols-2 gap-2 mt-1.5">
          <ColorInput
            label="Color P1"
            value={(metadata.p1_color as string) ?? ""}
            onChange={(v) => updateField("p1_color", v)}
            placeholder="rgba(255,255,255,0.6)"
          />
          <div>
            <Label className="text-zinc-500 text-[10px] uppercase">Tamaño P1</Label>
            <Input
              value={(metadata.p1_font_size as string) ?? ""}
              onChange={(e) => updateField("p1_font_size", e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white text-xs h-7 px-2 mt-0.5"
              placeholder="18px"
            />
          </div>
        </div>
      </div>

      {/* P2 – Bold statement */}
      <div>
        <Label className="text-zinc-500 text-[10px] uppercase">Frase destacada (P2)</Label>
        <Input
          value={(metadata.p2 as string) ?? ""}
          onChange={(e) => updateField("p2", e.target.value)}
          className="bg-zinc-800 border-zinc-700 text-white text-sm mt-0.5"
          placeholder="Frase grande en bold"
        />
        <div className="grid grid-cols-3 gap-2 mt-1.5">
          <ColorInput
            label="Color P2"
            value={(metadata.p2_color as string) ?? ""}
            onChange={(v) => updateField("p2_color", v)}
            placeholder="white"
          />
          <div>
            <Label className="text-zinc-500 text-[10px] uppercase">Tamaño P2</Label>
            <Input
              value={(metadata.p2_font_size as string) ?? ""}
              onChange={(e) => updateField("p2_font_size", e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white text-xs h-7 px-2 mt-0.5"
              placeholder="32px"
            />
          </div>
          <div>
            <Label className="text-zinc-500 text-[10px] uppercase">Gradiente P2</Label>
            <Input
              value={(metadata.p2_gradient as string) ?? ""}
              onChange={(e) => updateField("p2_gradient", e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white text-xs h-7 px-2 mt-0.5"
              placeholder="linear-gradient(...)"
            />
          </div>
        </div>
      </div>

      {/* P3 */}
      <div>
        <Label className="text-zinc-500 text-[10px] uppercase">Párrafo 3</Label>
        <Textarea
          value={(metadata.p3 as string) ?? ""}
          onChange={(e) => updateField("p3", e.target.value)}
          className="bg-zinc-800 border-zinc-700 text-white text-sm mt-0.5 min-h-[60px]"
          placeholder="Tercer párrafo"
        />
        <div className="grid grid-cols-2 gap-2 mt-1.5">
          <ColorInput
            label="Color P3"
            value={(metadata.p3_color as string) ?? ""}
            onChange={(v) => updateField("p3_color", v)}
            placeholder="rgba(255,255,255,0.6)"
          />
          <div>
            <Label className="text-zinc-500 text-[10px] uppercase">Tamaño P3</Label>
            <Input
              value={(metadata.p3_font_size as string) ?? ""}
              onChange={(e) => updateField("p3_font_size", e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white text-xs h-7 px-2 mt-0.5"
              placeholder="18px"
            />
          </div>
        </div>
      </div>

      {/* ─── Levels ─── */}
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

        {/* Levels global style */}
        <div className="grid grid-cols-3 gap-2 mb-3 p-2 bg-zinc-900/60 rounded-lg border border-zinc-700/40">
          <ColorInput
            label="Fondo card"
            value={(metadata.level_card_bg as string) ?? ""}
            onChange={(v) => updateField("level_card_bg", v)}
            placeholder="rgba(255,255,255,0.04)"
          />
          <ColorInput
            label="Color número"
            value={(metadata.level_number_color as string) ?? ""}
            onChange={(v) => updateField("level_number_color", v)}
            placeholder="hsl(var(--pink))"
          />
          <ColorInput
            label="Color etiqueta"
            value={(metadata.level_label_color as string) ?? ""}
            onChange={(v) => updateField("level_label_color", v)}
            placeholder="hsl(var(--pink))"
          />
          <ColorInput
            label="Color texto nivel"
            value={(metadata.level_text_color as string) ?? ""}
            onChange={(v) => updateField("level_text_color", v)}
            placeholder="rgba(255,255,255,0.7)"
          />
          <ColorInput
            label="Borde card"
            value={(metadata.level_card_border as string) ?? ""}
            onChange={(v) => updateField("level_card_border", v)}
            placeholder="rgba(255,255,255,0.06)"
          />
          <div>
            <Label className="text-zinc-500 text-[10px] uppercase">Tamaño número</Label>
            <Input
              value={(metadata.level_number_size as string) ?? ""}
              onChange={(e) => updateField("level_number_size", e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white text-xs h-7 px-2 mt-0.5"
              placeholder="42px"
            />
          </div>
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

      {/* ─── Final paragraph ─── */}
      <div>
        <Label className="text-zinc-500 text-[10px] uppercase">Párrafo final</Label>
        <Textarea
          value={(metadata.p_final as string) ?? ""}
          onChange={(e) => updateField("p_final", e.target.value)}
          className="bg-zinc-800 border-zinc-700 text-white text-sm mt-0.5 min-h-[60px]"
          placeholder="Párrafo de cierre"
        />
        <div className="grid grid-cols-2 gap-2 mt-1.5">
          <ColorInput
            label="Color P final"
            value={(metadata.p_final_color as string) ?? ""}
            onChange={(v) => updateField("p_final_color", v)}
            placeholder="rgba(255,255,255,0.6)"
          />
          <div>
            <Label className="text-zinc-500 text-[10px] uppercase">Tamaño P final</Label>
            <Input
              value={(metadata.p_final_font_size as string) ?? ""}
              onChange={(e) => updateField("p_final_font_size", e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white text-xs h-7 px-2 mt-0.5"
              placeholder="18px"
            />
          </div>
        </div>
      </div>

      {/* ─── Closing quote ─── */}
      <div>
        <Label className="text-zinc-500 text-[10px] uppercase">Frase de cierre</Label>
        <Input
          value={(metadata.closing_quote as string) ?? ""}
          onChange={(e) => updateField("closing_quote", e.target.value)}
          className="bg-zinc-800 border-zinc-700 text-white text-sm mt-0.5"
          placeholder="Somos arquitectos del revenue..."
        />
        <div className="grid grid-cols-3 gap-2 mt-1.5">
          <div>
            <Label className="text-zinc-500 text-[10px] uppercase">Gradiente frase</Label>
            <Input
              value={(metadata.closing_gradient as string) ?? ""}
              onChange={(e) => updateField("closing_gradient", e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white text-xs h-7 px-2 mt-0.5"
              placeholder="var(--gradient-brand)"
            />
            {(metadata.closing_gradient as string) && (
              <div
                className="mt-1 h-4 rounded border border-zinc-700"
                style={{ background: metadata.closing_gradient as string }}
              />
            )}
          </div>
          <ColorInput
            label="Color frase (si no gradiente)"
            value={(metadata.closing_color as string) ?? ""}
            onChange={(v) => updateField("closing_color", v)}
            placeholder="white"
          />
          <div>
            <Label className="text-zinc-500 text-[10px] uppercase">Tamaño frase</Label>
            <Input
              value={(metadata.closing_font_size as string) ?? ""}
              onChange={(e) => updateField("closing_font_size", e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white text-xs h-7 px-2 mt-0.5"
              placeholder="38px"
            />
          </div>
        </div>
      </div>

      {/* ─── Label / Manifiesto ─── */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-zinc-500 text-[10px] uppercase">Etiqueta superior</Label>
          <Input
            value={(metadata.section_label as string) ?? ""}
            onChange={(e) => updateField("section_label", e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white text-xs h-7 px-2 mt-0.5"
            placeholder="Manifiesto"
          />
        </div>
        <ColorInput
          label="Color etiqueta"
          value={(metadata.section_label_color as string) ?? ""}
          onChange={(v) => updateField("section_label_color", v)}
          placeholder="hsl(var(--pink))"
        />
      </div>
    </div>
  );
}
