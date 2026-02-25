import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, RotateCcw, Palette, Type, Layers } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import { toast } from "@/hooks/use-toast";

type SiteStyle = Tables<"site_styles">;

const CATEGORIES = [
  { key: "colores", label: "Colores", icon: Palette },
  { key: "fondos", label: "Fondos", icon: Layers },
  { key: "gradientes", label: "Gradientes", icon: Palette },
  { key: "tipografia", label: "Tipografía", icon: Type },
];

const FONT_OPTIONS = [
  "Lexend", "Inter", "Poppins", "Montserrat", "Roboto", "Open Sans",
  "Lato", "Raleway", "Nunito", "DM Sans", "Space Grotesk", "Manrope",
];

const WEIGHT_OPTIONS = [
  { value: "300", label: "Light (300)" },
  { value: "400", label: "Regular (400)" },
  { value: "500", label: "Medium (500)" },
  { value: "600", label: "Semibold (600)" },
  { value: "700", label: "Bold (700)" },
  { value: "800", label: "Extra Bold (800)" },
];

function GradientEditor({ style, onChange }: { style: SiteStyle; onChange: (value: string) => void }) {
  const parts = style.value.split(",");
  const angle = parts[parts.length - 1] || "135";
  const colors = parts.slice(0, -1);
  const color1 = colors[0] || "#BE1869";
  const color2 = colors[1] || "#6224BE";
  const color3 = colors[2]; // optional mid color

  const update = (c1: string, c2: string, c3: string | undefined, a: string) => {
    const val = c3 ? `${c1},${c2},${c3},${a}` : `${c1},${c2},${a}`;
    onChange(val);
  };

  const gradientCSS = color3
    ? `linear-gradient(${angle}deg, ${color1} 0%, ${color3} 50%, ${color2} 100%)`
    : `linear-gradient(${angle}deg, ${color1} 0%, ${color2} 100%)`;

  return (
    <div className="space-y-3">
      <div
        className="h-16 rounded-lg border border-zinc-700"
        style={{ background: gradientCSS }}
      />
      <div className="grid grid-cols-3 gap-2">
        <div>
          <Label className="text-zinc-500 text-xs">Color 1</Label>
          <div className="flex items-center gap-2 mt-1">
            <input
              type="color"
              value={color1}
              onChange={(e) => update(e.target.value, color2, color3, angle)}
              className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
            />
            <Input
              value={color1}
              onChange={(e) => update(e.target.value, color2, color3, angle)}
              className="bg-zinc-800 border-zinc-700 text-white text-xs h-8"
            />
          </div>
        </div>
        <div>
          <Label className="text-zinc-500 text-xs">Color 2</Label>
          <div className="flex items-center gap-2 mt-1">
            <input
              type="color"
              value={color2}
              onChange={(e) => update(color1, e.target.value, color3, angle)}
              className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
            />
            <Input
              value={color2}
              onChange={(e) => update(color1, e.target.value, color3, angle)}
              className="bg-zinc-800 border-zinc-700 text-white text-xs h-8"
            />
          </div>
        </div>
        <div>
          <Label className="text-zinc-500 text-xs">Ángulo</Label>
          <div className="flex items-center gap-2 mt-1">
            <Input
              type="number"
              min={0}
              max={360}
              value={angle}
              onChange={(e) => update(color1, color2, color3, e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white text-xs h-8"
            />
            <span className="text-zinc-500 text-xs">°</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ColorEditor({ style, onChange }: { style: SiteStyle; onChange: (value: string) => void }) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="color"
        value={style.value}
        onChange={(e) => onChange(e.target.value)}
        className="w-10 h-10 rounded-lg cursor-pointer border border-zinc-700 bg-transparent"
      />
      <Input
        value={style.value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-zinc-800 border-zinc-700 text-white font-mono text-sm max-w-[140px]"
        placeholder="#RRGGBB"
      />
      <div
        className="w-20 h-10 rounded-lg border border-zinc-700"
        style={{ backgroundColor: style.value }}
      />
    </div>
  );
}

function FontEditor({ style, onChange }: { style: SiteStyle; onChange: (value: string) => void }) {
  return (
    <select
      value={style.value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm w-full"
    >
      {FONT_OPTIONS.map((f) => (
        <option key={f} value={f}>{f}</option>
      ))}
    </select>
  );
}

function SizeEditor({ style, onChange }: { style: SiteStyle; onChange: (value: string) => void }) {
  const num = parseInt(style.value) || 16;
  return (
    <div className="flex items-center gap-3">
      <input
        type="range"
        min={10}
        max={80}
        value={num}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 accent-emerald-500"
      />
      <div className="flex items-center gap-1">
        <Input
          type="number"
          min={10}
          max={80}
          value={num}
          onChange={(e) => onChange(e.target.value)}
          className="bg-zinc-800 border-zinc-700 text-white w-20 text-sm"
        />
        <span className="text-zinc-500 text-sm">px</span>
      </div>
      <span
        className="text-white truncate max-w-[100px]"
        style={{ fontSize: `${Math.min(num, 40)}px` }}
      >
        Aa
      </span>
    </div>
  );
}

function WeightEditor({ style, onChange }: { style: SiteStyle; onChange: (value: string) => void }) {
  return (
    <select
      value={style.value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm w-full"
    >
      {WEIGHT_OPTIONS.map((w) => (
        <option key={w.value} value={w.value}>{w.label}</option>
      ))}
    </select>
  );
}

export default function AdminStyles() {
  const [styles, setStyles] = useState<SiteStyle[]>([]);
  const [original, setOriginal] = useState<SiteStyle[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeCategory, setActiveCategory] = useState("colores");

  const fetchStyles = useCallback(async () => {
    const { data } = await supabase
      .from("site_styles")
      .select("*")
      .order("category")
      .order("style_key");
    if (data) {
      setStyles(data);
      setOriginal(JSON.parse(JSON.stringify(data)));
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchStyles(); }, [fetchStyles]);

  const updateLocal = (id: string, value: string) => {
    setStyles((prev) => prev.map((s) => (s.id === id ? { ...s, value } : s)));
  };

  const hasChanges = JSON.stringify(styles) !== JSON.stringify(original);

  const saveAll = async () => {
    setSaving(true);
    const changed = styles.filter((s) => {
      const orig = original.find((o) => o.id === s.id);
      return orig && orig.value !== s.value;
    });

    for (const s of changed) {
      const { error } = await supabase
        .from("site_styles")
        .update({ value: s.value })
        .eq("id", s.id);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        setSaving(false);
        return;
      }
    }

    setOriginal(JSON.parse(JSON.stringify(styles)));
    setSaving(false);
    toast({ title: `${changed.length} estilos guardados`, description: "Recarga el sitio público para ver los cambios." });
  };

  const resetAll = () => {
    setStyles(JSON.parse(JSON.stringify(original)));
  };

  const filtered = styles.filter((s) => s.category === activeCategory);

  if (loading) return <div className="text-zinc-400">Cargando estilos...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Estilos del Sitio</h1>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <Button
              onClick={resetAll}
              variant="ghost"
              size="sm"
              className="text-zinc-400 hover:text-white"
            >
              <RotateCcw className="h-4 w-4 mr-1" /> Revertir
            </Button>
          )}
          <Button
            onClick={saveAll}
            disabled={!hasChanges || saving}
            className="bg-emerald-600 hover:bg-emerald-700"
            size="sm"
          >
            <Save className="h-4 w-4 mr-1.5" />
            {saving ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-1 mb-6 bg-zinc-900 rounded-xl p-1 border border-zinc-800">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors flex-1 justify-center ${
              activeCategory === cat.key
                ? "bg-zinc-800 text-white"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <cat.icon className="h-4 w-4" />
            {cat.label}
          </button>
        ))}
      </div>

      {/* Style Items */}
      <div className="space-y-4">
        {filtered.map((style) => (
          <div
            key={style.id}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"
          >
            <Label className="text-white font-medium text-sm mb-3 block">{style.label}</Label>
            {style.style_type === "color" && (
              <ColorEditor style={style} onChange={(v) => updateLocal(style.id, v)} />
            )}
            {style.style_type === "gradient" && (
              <GradientEditor style={style} onChange={(v) => updateLocal(style.id, v)} />
            )}
            {style.style_type === "font" && (
              <FontEditor style={style} onChange={(v) => updateLocal(style.id, v)} />
            )}
            {style.style_type === "size" && (
              <SizeEditor style={style} onChange={(v) => updateLocal(style.id, v)} />
            )}
            {style.style_type === "weight" && (
              <WeightEditor style={style} onChange={(v) => updateLocal(style.id, v)} />
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-zinc-500">
          No hay estilos en esta categoría.
        </div>
      )}
    </div>
  );
}
