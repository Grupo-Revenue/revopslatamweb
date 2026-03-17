import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

type Option = { text: string; chip: string; to: string; chipColor?: string };
type RoleCard = {
  icon: string; iconColor?: string; title: string; pain: string;
  symptoms: string[];
  options: Option[];
};

const ICONS = ["Building2", "BarChart3", "Megaphone", "Heart", "Cog", "Search", "Settings", "Brain", "Wrench", "Target"];

type Props = {
  metadata: Record<string, unknown>;
  onChange: (m: Record<string, unknown>) => void;
};

export default function RoleCardsEditor({ metadata, onChange }: Props) {
  const cards = ((metadata.role_cards as RoleCard[]) ?? []);
  const [expanded, setExpanded] = useState<number | null>(null);

  const update = (newCards: RoleCard[]) => {
    onChange({ ...metadata, role_cards: newCards });
  };

  const addCard = () => {
    update([...cards, { icon: "Building2", title: "", pain: "", symptoms: [""], options: [{ text: "", chip: "", to: "/" }] }]);
    setExpanded(cards.length);
  };

  const removeCard = (i: number) => {
    update(cards.filter((_, idx) => idx !== i));
    if (expanded === i) setExpanded(null);
  };

  const updateCard = (i: number, field: string, val: unknown) => {
    const copy = [...cards];
    copy[i] = { ...copy[i], [field]: val };
    update(copy);
  };

  const updateSymptom = (ci: number, si: number, val: string) => {
    const copy = [...cards];
    const symptoms = [...copy[ci].symptoms];
    symptoms[si] = val;
    copy[ci] = { ...copy[ci], symptoms };
    update(copy);
  };

  const addSymptom = (ci: number) => {
    const copy = [...cards];
    copy[ci] = { ...copy[ci], symptoms: [...copy[ci].symptoms, ""] };
    update(copy);
  };

  const removeSymptom = (ci: number, si: number) => {
    const copy = [...cards];
    copy[ci] = { ...copy[ci], symptoms: copy[ci].symptoms.filter((_, idx) => idx !== si) };
    update(copy);
  };

  const updateOption = (ci: number, oi: number, field: string, val: string) => {
    const copy = [...cards];
    const options = [...copy[ci].options];
    options[oi] = { ...options[oi], [field]: val };
    copy[ci] = { ...copy[ci], options };
    update(copy);
  };

  const addOption = (ci: number) => {
    const copy = [...cards];
    copy[ci] = { ...copy[ci], options: [...copy[ci].options, { text: "", chip: "", to: "/" }] };
    update(copy);
  };

  const removeOption = (ci: number, oi: number) => {
    const copy = [...cards];
    copy[ci] = { ...copy[ci], options: copy[ci].options.filter((_, idx) => idx !== oi) };
    update(copy);
  };

  return (
    <div className="space-y-3 p-3 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
      <div className="flex items-center justify-between">
        <Label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
          Tarjetas por Rol ({cards.length})
        </Label>
        <button onClick={addCard} className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
          <Plus className="h-3 w-3" /> Agregar
        </button>
      </div>

      {cards.length === 0 && <p className="text-zinc-600 text-xs text-center py-4">No hay tarjetas de rol.</p>}

      <div className="space-y-2">
        {cards.map((card, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-700 rounded-lg overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2 cursor-pointer" onClick={() => setExpanded(expanded === i ? null : i)}>
              <span className="text-white text-xs font-medium flex-1 truncate">{card.title || `Rol ${i + 1}`}</span>
              {expanded === i ? <ChevronUp className="h-3.5 w-3.5 text-zinc-500" /> : <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />}
              <button onClick={(e) => { e.stopPropagation(); removeCard(i); }} className="text-zinc-600 hover:text-red-400 p-0.5">
                <X className="h-3 w-3" />
              </button>
            </div>

            {expanded === i && (
              <div className="px-3 pb-3 space-y-2 border-t border-zinc-800 pt-2">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label className="text-zinc-500 text-[10px] uppercase">Ícono</Label>
                    <select value={card.icon} onChange={(e) => updateCard(i, "icon", e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 text-white rounded px-2 py-1.5 text-xs mt-0.5">
                      {ICONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label className="text-zinc-500 text-[10px] uppercase">Color Ícono</Label>
                    <Input value={card.iconColor || ""} onChange={(e) => updateCard(i, "iconColor", e.target.value || undefined)} className="bg-zinc-800 border-zinc-700 text-white text-xs mt-0.5" placeholder="#BE1869" />
                  </div>
                  <div>
                    <Label className="text-zinc-500 text-[10px] uppercase">Título</Label>
                    <Input value={card.title} onChange={(e) => updateCard(i, "title", e.target.value)} className="bg-zinc-800 border-zinc-700 text-white text-xs mt-0.5" />
                  </div>
                </div>

                <div>
                  <Label className="text-zinc-500 text-[10px] uppercase">Dolor principal (italic)</Label>
                  <Textarea value={card.pain} onChange={(e) => updateCard(i, "pain", e.target.value)} className="bg-zinc-800 border-zinc-700 text-white text-xs mt-0.5 min-h-[50px]" />
                </div>

                {/* Symptoms */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label className="text-zinc-500 text-[10px] uppercase">Frases síntoma</Label>
                    <button onClick={() => addSymptom(i)} className="text-[10px] text-emerald-400 hover:text-emerald-300"><Plus className="h-3 w-3 inline" /></button>
                  </div>
                  {card.symptoms.map((s, si) => (
                    <div key={si} className="flex items-center gap-1">
                      <Input value={s} onChange={(e) => updateSymptom(i, si, e.target.value)} className="bg-zinc-800 border-zinc-700 text-white text-[10px] h-7 flex-1" placeholder="Frase síntoma" />
                      <button onClick={() => removeSymptom(i, si)} className="text-zinc-600 hover:text-red-400"><X className="h-3 w-3" /></button>
                    </div>
                  ))}
                </div>

                {/* Options */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-zinc-500 text-[10px] uppercase">Opciones (Por dónde entrar)</Label>
                    <button onClick={() => addOption(i)} className="text-[10px] text-emerald-400 hover:text-emerald-300"><Plus className="h-3 w-3 inline" /> Opción</button>
                  </div>
                  {card.options.map((o, oi) => (
                    <div key={oi} className="grid grid-cols-[1fr_auto_auto_auto] gap-1 items-center">
                      <div className="grid grid-cols-2 gap-1">
                        <Input value={o.text} onChange={(e) => updateOption(i, oi, "text", e.target.value)} className="bg-zinc-800 border-zinc-700 text-white text-[10px] h-7" placeholder="Texto situación" />
                        <Input value={o.chip} onChange={(e) => updateOption(i, oi, "chip", e.target.value)} className="bg-zinc-800 border-zinc-700 text-white text-[10px] h-7" placeholder="Chip servicio" />
                      </div>
                      <Input value={o.to} onChange={(e) => updateOption(i, oi, "to", e.target.value)} className="bg-zinc-800 border-zinc-700 text-white text-[10px] h-7 w-28" placeholder="/ruta" />
                      <Input value={o.chipColor || ""} onChange={(e) => updateOption(i, oi, "chipColor", e.target.value)} className="bg-zinc-800 border-zinc-700 text-white text-[10px] h-7 w-20" placeholder="Color" />
                      <button onClick={() => removeOption(i, oi)} className="text-zinc-600 hover:text-red-400"><X className="h-3 w-3" /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
