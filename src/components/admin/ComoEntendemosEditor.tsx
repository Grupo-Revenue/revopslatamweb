import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";

type Card = { icon: string; title: string; text: string };

const ICON_OPTIONS = [
  { value: "search", label: "Search" },
  { value: "compass", label: "Compass" },
  { value: "wrench", label: "Wrench" },
  { value: "trending", label: "Trending" },
];

export default function ComoEntendemosEditor({
  metadata,
  onChange,
}: {
  metadata: Record<string, unknown>;
  onChange: (m: Record<string, unknown>) => void;
}) {
  const cards = (metadata.cards as Card[]) ?? [];

  const update = (field: string, value: string) => onChange({ ...metadata, [field]: value || undefined });

  const updateCard = (index: number, field: keyof Card, value: string) => {
    const updated = [...cards];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...metadata, cards: updated });
  };

  const addCard = () => {
    onChange({ ...metadata, cards: [...cards, { icon: "search", title: "Nuevo título", text: "Descripción" }] });
  };

  const removeCard = (index: number) => {
    onChange({ ...metadata, cards: cards.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4 p-3 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
      <Label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
        Cómo Entendemos — Estilos
      </Label>

      {/* Section-level styles */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-zinc-500 text-[10px] uppercase">Color título sección</Label>
          <div className="flex items-center gap-1.5 mt-0.5">
            <input
              type="color"
              value={(metadata.title_color as string) || "#1A1A2E"}
              onChange={(e) => update("title_color", e.target.value)}
              className="w-6 h-6 rounded border border-zinc-700 cursor-pointer bg-transparent flex-shrink-0"
            />
            <Input
              value={(metadata.title_color as string) ?? ""}
              onChange={(e) => update("title_color", e.target.value)}
              placeholder="#1A1A2E"
              className="bg-zinc-800 border-zinc-700 text-white text-xs h-7 px-2"
            />
          </div>
        </div>
        <div>
          <Label className="text-zinc-500 text-[10px] uppercase">Tamaño título sección</Label>
          <Input
            value={(metadata.title_font_size as string) ?? ""}
            onChange={(e) => update("title_font_size", e.target.value)}
            placeholder="48px"
            className="bg-zinc-800 border-zinc-700 text-white text-xs h-7 px-2 mt-0.5"
          />
        </div>
      </div>

      {/* Card global styles */}
      <div className="space-y-2">
        <Label className="text-zinc-500 text-[10px] uppercase tracking-wider">Estilos de cards</Label>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <Label className="text-zinc-500 text-[10px] uppercase">Fondo card</Label>
            <div className="flex items-center gap-1.5 mt-0.5">
              <input
                type="color"
                value={(metadata.card_bg as string) || "#F9FAFB"}
                onChange={(e) => update("card_bg", e.target.value)}
                className="w-6 h-6 rounded border border-zinc-700 cursor-pointer bg-transparent flex-shrink-0"
              />
              <Input
                value={(metadata.card_bg as string) ?? ""}
                onChange={(e) => update("card_bg", e.target.value)}
                placeholder="#F9FAFB"
                className="bg-zinc-800 border-zinc-700 text-white text-xs h-7 px-2"
              />
            </div>
          </div>
          <div>
            <Label className="text-zinc-500 text-[10px] uppercase">Borde card</Label>
            <div className="flex items-center gap-1.5 mt-0.5">
              <input
                type="color"
                value={(metadata.card_border as string) || "#E5E7EB"}
                onChange={(e) => update("card_border", e.target.value)}
                className="w-6 h-6 rounded border border-zinc-700 cursor-pointer bg-transparent flex-shrink-0"
              />
              <Input
                value={(metadata.card_border as string) ?? ""}
                onChange={(e) => update("card_border", e.target.value)}
                placeholder="#E5E7EB"
                className="bg-zinc-800 border-zinc-700 text-white text-xs h-7 px-2"
              />
            </div>
          </div>
          <div>
            <Label className="text-zinc-500 text-[10px] uppercase">Gradiente fondo card</Label>
            <Input
              value={(metadata.card_gradient as string) ?? ""}
              onChange={(e) => update("card_gradient", e.target.value)}
              placeholder="linear-gradient(...)"
              className="bg-zinc-800 border-zinc-700 text-white text-xs h-7 px-2 mt-0.5"
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <Label className="text-zinc-500 text-[10px] uppercase">Color icono</Label>
            <div className="flex items-center gap-1.5 mt-0.5">
              <input
                type="color"
                value={(metadata.icon_color as string) || "#BE1869"}
                onChange={(e) => update("icon_color", e.target.value)}
                className="w-6 h-6 rounded border border-zinc-700 cursor-pointer bg-transparent flex-shrink-0"
              />
              <Input
                value={(metadata.icon_color as string) ?? ""}
                onChange={(e) => update("icon_color", e.target.value)}
                placeholder="#BE1869"
                className="bg-zinc-800 border-zinc-700 text-white text-xs h-7 px-2"
              />
            </div>
          </div>
          <div>
            <Label className="text-zinc-500 text-[10px] uppercase">Fondo icono</Label>
            <div className="flex items-center gap-1.5 mt-0.5">
              <input
                type="color"
                value={(metadata.icon_bg as string) || "#FDE8F0"}
                onChange={(e) => update("icon_bg", e.target.value)}
                className="w-6 h-6 rounded border border-zinc-700 cursor-pointer bg-transparent flex-shrink-0"
              />
              <Input
                value={(metadata.icon_bg as string) ?? ""}
                onChange={(e) => update("icon_bg", e.target.value)}
                placeholder="rgba(190,24,105,0.08)"
                className="bg-zinc-800 border-zinc-700 text-white text-xs h-7 px-2"
              />
            </div>
          </div>
          <div>
            <Label className="text-zinc-500 text-[10px] uppercase">Tamaño icono</Label>
            <Input
              value={(metadata.icon_size as string) ?? ""}
              onChange={(e) => update("icon_size", e.target.value)}
              placeholder="24"
              className="bg-zinc-800 border-zinc-700 text-white text-xs h-7 px-2 mt-0.5"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-zinc-500 text-[10px] uppercase">Color título card</Label>
            <div className="flex items-center gap-1.5 mt-0.5">
              <input
                type="color"
                value={(metadata.card_title_color as string) || "#1A1A2E"}
                onChange={(e) => update("card_title_color", e.target.value)}
                className="w-6 h-6 rounded border border-zinc-700 cursor-pointer bg-transparent flex-shrink-0"
              />
              <Input
                value={(metadata.card_title_color as string) ?? ""}
                onChange={(e) => update("card_title_color", e.target.value)}
                placeholder="#1A1A2E"
                className="bg-zinc-800 border-zinc-700 text-white text-xs h-7 px-2"
              />
            </div>
          </div>
          <div>
            <Label className="text-zinc-500 text-[10px] uppercase">Color texto card</Label>
            <div className="flex items-center gap-1.5 mt-0.5">
              <input
                type="color"
                value={(metadata.card_text_color as string) || "#6B7280"}
                onChange={(e) => update("card_text_color", e.target.value)}
                className="w-6 h-6 rounded border border-zinc-700 cursor-pointer bg-transparent flex-shrink-0"
              />
              <Input
                value={(metadata.card_text_color as string) ?? ""}
                onChange={(e) => update("card_text_color", e.target.value)}
                placeholder="#6B7280"
                className="bg-zinc-800 border-zinc-700 text-white text-xs h-7 px-2"
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-zinc-500 text-[10px] uppercase">Tamaño título card</Label>
            <Input
              value={(metadata.card_title_size as string) ?? ""}
              onChange={(e) => update("card_title_size", e.target.value)}
              placeholder="22px"
              className="bg-zinc-800 border-zinc-700 text-white text-xs h-7 px-2 mt-0.5"
            />
          </div>
          <div>
            <Label className="text-zinc-500 text-[10px] uppercase">Tamaño texto card</Label>
            <Input
              value={(metadata.card_text_size as string) ?? ""}
              onChange={(e) => update("card_text_size", e.target.value)}
              placeholder="16px"
              className="bg-zinc-800 border-zinc-700 text-white text-xs h-7 px-2 mt-0.5"
            />
          </div>
        </div>
      </div>

      {/* Individual cards editor */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-zinc-500 text-[10px] uppercase tracking-wider">Cards ({cards.length})</Label>
          <button onClick={addCard} className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300">
            <Plus className="h-3 w-3" /> Agregar card
          </button>
        </div>
        {cards.map((card, i) => (
          <div key={i} className="relative p-3 bg-zinc-900 border border-zinc-700 rounded-lg space-y-2">
            <button
              onClick={() => removeCard(i)}
              className="absolute top-2 right-2 text-zinc-600 hover:text-red-400"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
            <div className="grid grid-cols-4 gap-2">
              <div>
                <Label className="text-zinc-500 text-[10px] uppercase">Icono</Label>
                <select
                  value={card.icon}
                  onChange={(e) => updateCard(i, "icon", e.target.value)}
                  className="w-full mt-0.5 bg-zinc-800 border border-zinc-700 text-white rounded px-2 py-1 text-xs"
                >
                  {ICON_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-3">
                <Label className="text-zinc-500 text-[10px] uppercase">Título</Label>
                <Input
                  value={card.title}
                  onChange={(e) => updateCard(i, "title", e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white text-xs h-7 px-2 mt-0.5"
                />
              </div>
            </div>
            <div>
              <Label className="text-zinc-500 text-[10px] uppercase">Texto</Label>
              <Textarea
                value={card.text}
                onChange={(e) => updateCard(i, "text", e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white text-xs mt-0.5 min-h-[60px]"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
