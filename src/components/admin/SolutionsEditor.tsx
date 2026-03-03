import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, X, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

type SolutionCard = {
  icon?: string;
  title: string;
  text: string;
  accent?: string;
  highlighted?: boolean;
  badge?: string;
};

const ICONS = ["Search", "Settings", "Rocket", "RefreshCw", "BarChart3", "Wrench", "Target", "Building2", "Megaphone"];
const ACCENTS = [
  { label: "Pink", value: "337 74% 44%" },
  { label: "Purple", value: "263 70% 44%" },
  { label: "Blue", value: "208 95% 44%" },
  { label: "Teal", value: "175 73% 37%" },
  { label: "Yellow", value: "45 93% 47%" },
];

type Props = {
  metadata: Record<string, unknown>;
  onChange: (m: Record<string, unknown>) => void;
  fieldKey?: string; // defaults to "solutions"
  label?: string;
};

export default function SolutionsEditor({ metadata, onChange, fieldKey = "solutions", label = "Tarjetas de solución" }: Props) {
  const solutions = ((metadata[fieldKey] as SolutionCard[]) ?? []);
  const [expanded, setExpanded] = useState<number | null>(null);

  const update = (newSolutions: SolutionCard[]) => {
    onChange({ ...metadata, [fieldKey]: newSolutions });
  };

  const addCard = () => {
    update([...solutions, { icon: "Settings", title: "", text: "", accent: "337 74% 44%", highlighted: false }]);
    setExpanded(solutions.length);
  };

  const removeCard = (i: number) => {
    update(solutions.filter((_, idx) => idx !== i));
    if (expanded === i) setExpanded(null);
  };

  const updateCard = (i: number, field: keyof SolutionCard, val: unknown) => {
    const copy = [...solutions];
    copy[i] = { ...copy[i], [field]: val };
    update(copy);
  };

  return (
    <div className="space-y-3 p-3 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
      <div className="flex items-center justify-between">
        <Label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
          {label} ({solutions.length})
        </Label>
        <button
          onClick={addCard}
          className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <Plus className="h-3 w-3" /> Agregar
        </button>
      </div>

      {solutions.length === 0 && (
        <p className="text-zinc-600 text-xs text-center py-4">No hay tarjetas.</p>
      )}

      <div className="space-y-2">
        {solutions.map((card, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-700 rounded-lg overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2 cursor-pointer" onClick={() => setExpanded(expanded === i ? null : i)}>
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: `hsl(${card.accent || "337 74% 44%"})` }} />
              <span className="text-white text-xs font-medium flex-1 truncate">{card.title || `Tarjeta ${i + 1}`}</span>
              {card.highlighted && <span className="text-[9px] bg-purple/20 text-purple px-1.5 py-0.5 rounded">Destacada</span>}
              {expanded === i ? <ChevronUp className="h-3.5 w-3.5 text-zinc-500" /> : <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />}
              <button onClick={(e) => { e.stopPropagation(); removeCard(i); }} className="text-zinc-600 hover:text-red-400 p-0.5">
                <X className="h-3 w-3" />
              </button>
            </div>

            {expanded === i && (
              <div className="px-3 pb-3 space-y-2 border-t border-zinc-800 pt-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-zinc-500 text-[10px] uppercase">Ícono</Label>
                    <select
                      value={card.icon || "Settings"}
                      onChange={(e) => updateCard(i, "icon", e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 text-white rounded px-2 py-1.5 text-xs mt-0.5"
                    >
                      {ICONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label className="text-zinc-500 text-[10px] uppercase">Color acento</Label>
                    <select
                      value={card.accent || "337 74% 44%"}
                      onChange={(e) => updateCard(i, "accent", e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 text-white rounded px-2 py-1.5 text-xs mt-0.5"
                    >
                      {ACCENTS.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <Label className="text-zinc-500 text-[10px] uppercase">Título</Label>
                  <Input
                    value={card.title}
                    onChange={(e) => updateCard(i, "title", e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white text-xs mt-0.5"
                  />
                </div>

                <div>
                  <Label className="text-zinc-500 text-[10px] uppercase">Texto</Label>
                  <Textarea
                    value={card.text}
                    onChange={(e) => updateCard(i, "text", e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white text-xs mt-0.5 min-h-[60px]"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={card.highlighted ?? false}
                      onCheckedChange={(v) => updateCard(i, "highlighted", v)}
                    />
                    <span className="text-zinc-400 text-xs">Destacada</span>
                  </div>
                  {card.highlighted && (
                    <div className="flex-1">
                      <Input
                        value={card.badge || ""}
                        onChange={(e) => updateCard(i, "badge", e.target.value)}
                        className="bg-zinc-800 border-zinc-700 text-white text-xs"
                        placeholder="Badge (ej: Más popular)"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
