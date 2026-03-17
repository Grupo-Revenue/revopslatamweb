import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, X, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

type Tag = { label: string; to: string; color?: string; external?: boolean };
type MethodCard = {
  num: string; icon: string; iconColor?: string;
  badge?: string; badgeBg?: string; badgeColor?: string;
  title: string; subtitle: string; desc: string;
  tags: Tag[]; link: string;
};

const ICONS = ["Search", "Wrench", "Settings", "Brain", "Building2", "BarChart3", "Megaphone", "Heart", "Cog", "Rocket", "Target", "RefreshCw"];

type Props = {
  metadata: Record<string, unknown>;
  onChange: (m: Record<string, unknown>) => void;
};

export default function MethodCardsEditor({ metadata, onChange }: Props) {
  const cards = ((metadata.method_cards as MethodCard[]) ?? []);
  const [expanded, setExpanded] = useState<number | null>(null);

  const update = (newCards: MethodCard[]) => {
    onChange({ ...metadata, method_cards: newCards });
  };

  const addCard = () => {
    update([...cards, { num: `0${cards.length + 1}`, icon: "Settings", title: "", subtitle: "", desc: "", tags: [], link: "/" }]);
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

  const addTag = (i: number) => {
    const copy = [...cards];
    copy[i] = { ...copy[i], tags: [...copy[i].tags, { label: "", to: "/" }] };
    update(copy);
  };

  const updateTag = (ci: number, ti: number, field: string, val: unknown) => {
    const copy = [...cards];
    const tags = [...copy[ci].tags];
    tags[ti] = { ...tags[ti], [field]: val };
    copy[ci] = { ...copy[ci], tags };
    update(copy);
  };

  const removeTag = (ci: number, ti: number) => {
    const copy = [...cards];
    copy[ci] = { ...copy[ci], tags: copy[ci].tags.filter((_, idx) => idx !== ti) };
    update(copy);
  };

  return (
    <div className="space-y-3 p-3 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
      <div className="flex items-center justify-between">
        <Label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
          Tarjetas de Metodología ({cards.length})
        </Label>
        <button onClick={addCard} className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
          <Plus className="h-3 w-3" /> Agregar
        </button>
      </div>

      {cards.length === 0 && <p className="text-zinc-600 text-xs text-center py-4">No hay tarjetas.</p>}

      <div className="space-y-2">
        {cards.map((card, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-700 rounded-lg overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2 cursor-pointer" onClick={() => setExpanded(expanded === i ? null : i)}>
              <span className="text-white/30 text-xs font-mono">{card.num}</span>
              <span className="text-white text-xs font-medium flex-1 truncate">{card.title || `Tarjeta ${i + 1}`}</span>
              {expanded === i ? <ChevronUp className="h-3.5 w-3.5 text-zinc-500" /> : <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />}
              <button onClick={(e) => { e.stopPropagation(); removeCard(i); }} className="text-zinc-600 hover:text-red-400 p-0.5">
                <X className="h-3 w-3" />
              </button>
            </div>

            {expanded === i && (
              <div className="px-3 pb-3 space-y-2 border-t border-zinc-800 pt-2">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label className="text-zinc-500 text-[10px] uppercase">Número</Label>
                    <Input value={card.num} onChange={(e) => updateCard(i, "num", e.target.value)} className="bg-zinc-800 border-zinc-700 text-white text-xs mt-0.5" />
                  </div>
                  <div>
                    <Label className="text-zinc-500 text-[10px] uppercase">Ícono</Label>
                    <select value={card.icon || "Settings"} onChange={(e) => updateCard(i, "icon", e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 text-white rounded px-2 py-1.5 text-xs mt-0.5">
                      {ICONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label className="text-zinc-500 text-[10px] uppercase">Color Ícono</Label>
                    <Input value={card.iconColor || ""} onChange={(e) => updateCard(i, "iconColor", e.target.value || undefined)} className="bg-zinc-800 border-zinc-700 text-white text-xs mt-0.5" placeholder="#BE1869" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-zinc-500 text-[10px] uppercase">Título</Label>
                    <Input value={card.title} onChange={(e) => updateCard(i, "title", e.target.value)} className="bg-zinc-800 border-zinc-700 text-white text-xs mt-0.5" />
                  </div>
                  <div>
                    <Label className="text-zinc-500 text-[10px] uppercase">Subtítulo</Label>
                    <Input value={card.subtitle} onChange={(e) => updateCard(i, "subtitle", e.target.value)} className="bg-zinc-800 border-zinc-700 text-white text-xs mt-0.5" />
                  </div>
                </div>

                <div>
                  <Label className="text-zinc-500 text-[10px] uppercase">Descripción</Label>
                  <Textarea value={card.desc} onChange={(e) => updateCard(i, "desc", e.target.value)} className="bg-zinc-800 border-zinc-700 text-white text-xs mt-0.5 min-h-[60px]" />
                </div>

                <div>
                  <Label className="text-zinc-500 text-[10px] uppercase">Link de la card</Label>
                  <Input value={card.link} onChange={(e) => updateCard(i, "link", e.target.value)} className="bg-zinc-800 border-zinc-700 text-white text-xs mt-0.5" placeholder="/conoce-tu-pista" />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-zinc-500 text-[10px] uppercase">Badge</Label>
                    <Input value={card.badge || ""} onChange={(e) => updateCard(i, "badge", e.target.value || undefined)} className="bg-zinc-800 border-zinc-700 text-white text-xs mt-0.5" placeholder="EL PRIMER PASO" />
                  </div>
                  <div>
                    <Label className="text-zinc-500 text-[10px] uppercase">Color Badge</Label>
                    <Input value={card.badgeColor || ""} onChange={(e) => updateCard(i, "badgeColor", e.target.value || undefined)} className="bg-zinc-800 border-zinc-700 text-white text-xs mt-0.5" placeholder="#BE1869" />
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-zinc-500 text-[10px] uppercase">Tags / Links</Label>
                    <button onClick={() => addTag(i)} className="text-[10px] text-emerald-400 hover:text-emerald-300"><Plus className="h-3 w-3 inline" /> Tag</button>
                  </div>
                  {card.tags.map((tag, ti) => (
                    <div key={ti} className="grid grid-cols-[1fr_1fr_auto_auto] gap-1 items-center">
                      <Input value={tag.label} onChange={(e) => updateTag(i, ti, "label", e.target.value)} className="bg-zinc-800 border-zinc-700 text-white text-[10px] h-7" placeholder="Etiqueta" />
                      <Input value={tag.to} onChange={(e) => updateTag(i, ti, "to", e.target.value)} className="bg-zinc-800 border-zinc-700 text-white text-[10px] h-7" placeholder="/ruta" />
                      <label className="flex items-center gap-1">
                        <Switch checked={tag.external ?? false} onCheckedChange={(v) => updateTag(i, ti, "external", v)} className="scale-[0.6]" />
                        <span className="text-[9px] text-zinc-500">Ext</span>
                      </label>
                      <button onClick={() => removeTag(i, ti)} className="text-zinc-600 hover:text-red-400"><X className="h-3 w-3" /></button>
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
