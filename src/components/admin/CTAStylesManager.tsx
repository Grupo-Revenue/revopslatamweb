import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Save, RotateCcw, Plus, Trash2, ArrowRight, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { CTAStyleProperties } from "@/hooks/useCTAStyles";
import { ctaStyleToCSS } from "@/hooks/useCTAStyles";

type CTARow = {
  id: string;
  style_key: string;
  label: string;
  styles: CTAStyleProperties;
  sort_order: number;
  _isNew?: boolean;
};

const FONT_WEIGHTS = [
  { label: "Regular", value: "400" },
  { label: "Medium", value: "500" },
  { label: "Semibold", value: "600" },
  { label: "Bold", value: "700" },
  { label: "Extra Bold", value: "800" },
];

const ANGLE_PRESETS = [
  { label: "→", value: 90 },
  { label: "↘", value: 135 },
  { label: "↓", value: 180 },
  { label: "↙", value: 225 },
  { label: "←", value: 270 },
  { label: "↖", value: 315 },
  { label: "↑", value: 0 },
  { label: "↗", value: 45 },
];

type ColorStop = { color: string; position: number };

function parseGradient(value: string): { angle: number; stops: ColorStop[] } {
  if (!value) return { angle: 135, stops: [{ color: "#BE1869", position: 0 }, { color: "#6224BE", position: 100 }] };
  const match = value.match(/linear-gradient\(\s*(\d+)deg\s*,\s*(.+)\)/);
  if (!match) return { angle: 135, stops: [{ color: "#BE1869", position: 0 }, { color: "#6224BE", position: 100 }] };
  const angle = parseInt(match[1]);
  const stopsStr = match[2];
  const stops: ColorStop[] = [];
  const regex = /(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))\s*(\d+)?%?/g;
  let m;
  while ((m = regex.exec(stopsStr)) !== null) {
    stops.push({ color: m[1], position: m[2] ? parseInt(m[2]) : (stops.length === 0 ? 0 : 100) });
  }
  if (stops.length < 2) return { angle, stops: [{ color: "#BE1869", position: 0 }, { color: "#6224BE", position: 100 }] };
  return { angle, stops };
}

function buildGradient(angle: number, stops: ColorStop[]): string {
  const s = stops.map((st) => `${st.color} ${st.position}%`).join(", ");
  return `linear-gradient(${angle}deg, ${s})`;
}

function GradientVisualEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [enabled, setEnabled] = useState(!!value);
  const parsed = parseGradient(value);
  const barRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<number | null>(null);

  const update = (newAngle: number, newStops: ColorStop[]) => {
    onChange(buildGradient(newAngle, newStops));
  };

  const updateStop = (index: number, field: keyof ColorStop, val: string | number) => {
    const current = parseGradient(value);
    const newStops = current.stops.map((s, i) => (i === index ? { ...s, [field]: val } : s));
    update(current.angle, newStops);
  };

  const addStop = () => {
    const current = parseGradient(value);
    const mid = Math.round((current.stops[0].position + current.stops[current.stops.length - 1].position) / 2);
    const newStops = [...current.stops, { color: "#FFFFFF", position: mid }].sort((a, b) => a.position - b.position);
    update(current.angle, newStops);
  };

  const removeStop = (index: number) => {
    const current = parseGradient(value);
    if (current.stops.length <= 2) return;
    update(current.angle, current.stops.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (dragging === null) return;
    const handleMove = (e: MouseEvent) => {
      if (!barRef.current) return;
      const rect = barRef.current.getBoundingClientRect();
      const pos = Math.max(0, Math.min(100, Math.round(((e.clientX - rect.left) / rect.width) * 100)));
      updateStop(dragging, "position", pos);
    };
    const handleUp = () => setDragging(null);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [dragging, value]);

  if (!enabled) {
    return (
      <div>
        <button
          onClick={() => { setEnabled(true); onChange(buildGradient(135, [{ color: "#BE1869", position: 0 }, { color: "#6224BE", position: 100 }])); }}
          className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          + Agregar gradiente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-zinc-500 text-[10px] uppercase">Gradiente (reemplaza color fondo)</Label>
        <button
          onClick={() => { setEnabled(false); onChange(""); }}
          className="text-xs text-zinc-500 hover:text-red-400 transition-colors flex items-center gap-1"
        >
          <X className="h-3 w-3" /> Quitar
        </button>
      </div>

      {/* Preview bar with draggable stops */}
      <div className="relative">
        <div
          ref={barRef}
          className="h-12 rounded-lg border border-zinc-700 cursor-crosshair"
          style={{ background: value }}
          onDoubleClick={addStop}
        />
        {parsed.stops.map((stop, i) => (
          <div
            key={i}
            className="absolute top-0 h-12 flex items-end justify-center"
            style={{ left: `${stop.position}%`, transform: "translateX(-50%)" }}
          >
            <div
              onMouseDown={(e) => { e.preventDefault(); setDragging(i); }}
              className="w-4 h-4 rounded-full border-2 border-white shadow-md cursor-grab active:cursor-grabbing -mb-2 z-10"
              style={{ backgroundColor: stop.color }}
            />
          </div>
        ))}
      </div>

      {/* Angle selector */}
      <div className="flex items-center gap-3">
        <Label className="text-zinc-500 text-[10px] uppercase shrink-0">Ángulo</Label>
        <div className="flex gap-1">
          {ANGLE_PRESETS.map((p) => (
            <button
              key={p.value}
              onClick={() => update(p.value, parsed.stops)}
              className={`w-7 h-7 rounded text-xs flex items-center justify-center transition-colors ${
                parsed.angle === p.value
                  ? "bg-emerald-600/30 text-emerald-400 border border-emerald-600/50"
                  : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:text-white"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <Slider
          value={[parsed.angle]}
          min={0}
          max={360}
          step={1}
          onValueChange={([v]) => update(v, parsed.stops)}
          className="flex-1"
        />
        <span className="text-white text-xs font-mono w-8 text-right">{parsed.angle}°</span>
      </div>

      {/* Color stops */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-zinc-500 text-[10px] uppercase">Colores</Label>
          <button onClick={addStop} className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
            + Color
          </button>
        </div>
        {parsed.stops.map((stop, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="color"
              value={stop.color}
              onChange={(e) => updateStop(i, "color", e.target.value)}
              className="w-7 h-7 rounded border border-zinc-700 cursor-pointer bg-transparent flex-shrink-0"
            />
            <Input
              value={stop.color}
              onChange={(e) => updateStop(i, "color", e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white text-xs h-7 flex-1"
            />
            <div className="flex items-center gap-1 shrink-0">
              <Input
                type="number"
                min={0}
                max={100}
                value={stop.position}
                onChange={(e) => updateStop(i, "position", parseInt(e.target.value) || 0)}
                className="bg-zinc-800 border-zinc-700 text-white text-xs h-7 w-14"
              />
              <span className="text-zinc-500 text-xs">%</span>
            </div>
            {parsed.stops.length > 2 && (
              <button onClick={() => removeStop(i)} className="text-zinc-600 hover:text-red-400 transition-colors p-0.5">
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CTAStylesManager() {
  const [rows, setRows] = useState<CTARow[]>([]);
  const [original, setOriginal] = useState<CTARow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    const { data } = await supabase
      .from("cta_styles")
      .select("*")
      .order("sort_order");
    const mapped: CTARow[] = (data ?? []).map((d: any) => ({
      id: d.id,
      style_key: d.style_key,
      label: d.label,
      styles: d.styles as CTAStyleProperties,
      sort_order: d.sort_order,
    }));
    setRows(mapped);
    setOriginal(JSON.parse(JSON.stringify(mapped)));
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const hasChanges = JSON.stringify(rows) !== JSON.stringify(original);

  const updateRow = (id: string, field: keyof CTARow, value: unknown) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const updateStyle = (id: string, field: keyof CTAStyleProperties, value: string | boolean) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, styles: { ...r.styles, [field]: value || undefined } }
          : r
      )
    );
  };

  const addNew = () => {
    const newRow: CTARow = {
      id: `new-${Date.now()}`,
      style_key: "",
      label: "",
      styles: {
        bgColor: "#BE1869",
        textColor: "#FFFFFF",
        borderRadius: "9999px",
        fontSize: "16px",
        fontWeight: "600",
        paddingX: "32px",
        paddingY: "14px",
        hasIcon: false,
      },
      sort_order: rows.length,
      _isNew: true,
    };
    setRows((prev) => [...prev, newRow]);
  };

  const deleteRow = async (row: CTARow) => {
    if (!confirm(`¿Eliminar el CTA "${row.label}"?`)) return;
    if (!row._isNew) {
      const { error } = await supabase.from("cta_styles").delete().eq("id", row.id);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return;
      }
    }
    setRows((prev) => prev.filter((r) => r.id !== row.id));
    setOriginal((prev) => prev.filter((r) => r.id !== row.id));
    toast({ title: "CTA eliminado" });
  };

  const saveAll = async () => {
    setSaving(true);
    for (const row of rows) {
      if (!row.style_key || !row.label) {
        toast({ title: "Error", description: "Cada CTA necesita clave y nombre.", variant: "destructive" });
        setSaving(false);
        return;
      }
      const payload = {
        style_key: row.style_key,
        label: row.label,
        styles: row.styles as any,
        sort_order: row.sort_order,
      };

      if (row._isNew) {
        const { data, error } = await supabase
          .from("cta_styles")
          .insert(payload)
          .select()
          .single();
        if (error) {
          toast({ title: "Error", description: error.message, variant: "destructive" });
          setSaving(false);
          return;
        }
        row.id = data.id;
        delete row._isNew;
      } else {
        const orig = original.find((o) => o.id === row.id);
        if (JSON.stringify(orig) !== JSON.stringify(row)) {
          const { error } = await supabase
            .from("cta_styles")
            .update(payload)
            .eq("id", row.id);
          if (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
            setSaving(false);
            return;
          }
        }
      }
    }
    setOriginal(JSON.parse(JSON.stringify(rows)));
    setSaving(false);
    toast({ title: "CTAs guardados" });
  };

  if (loading) return <div className="text-zinc-400">Cargando CTAs...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Estilos de CTA</h1>
        <div className="flex items-center gap-2">
          <Button onClick={addNew} variant="outline" size="sm" className="border-zinc-700 text-zinc-300">
            <Plus className="h-4 w-4 mr-1" /> Nuevo CTA
          </Button>
          {hasChanges && (
            <Button
              onClick={() => setRows(JSON.parse(JSON.stringify(original)))}
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
            {saving ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {rows.map((row) => (
          <div key={row.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
            {/* Preview */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  className="inline-flex items-center gap-2 transition-all duration-300"
                  style={ctaStyleToCSS(row.styles)}
                >
                  {row.label || "Preview"} {row.styles.hasIcon && <ArrowRight size={18} />}
                </button>
              </div>
              <button
                onClick={() => deleteRow(row)}
                className="text-zinc-600 hover:text-red-400 transition-colors p-1"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {/* Identity */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-zinc-500 text-[10px] uppercase">Clave (style_key)</Label>
                <Input
                  value={row.style_key}
                  onChange={(e) => updateRow(row.id, "style_key", e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                  className="bg-zinc-800 border-zinc-700 text-white text-sm mt-1"
                  placeholder="primary"
                />
              </div>
              <div>
                <Label className="text-zinc-500 text-[10px] uppercase">Nombre</Label>
                <Input
                  value={row.label}
                  onChange={(e) => updateRow(row.id, "label", e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white text-sm mt-1"
                  placeholder="Primario (Gradiente)"
                />
              </div>
            </div>

            {/* Colors */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-zinc-500 text-[10px] uppercase">Color fondo</Label>
                <div className="flex items-center gap-1.5 mt-1">
                  <input
                    type="color"
                    value={row.styles.bgColor || "#000000"}
                    onChange={(e) => updateStyle(row.id, "bgColor", e.target.value)}
                    className="w-7 h-7 rounded border border-zinc-700 cursor-pointer bg-transparent flex-shrink-0"
                  />
                  <Input
                    value={row.styles.bgColor || ""}
                    onChange={(e) => updateStyle(row.id, "bgColor", e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white text-xs h-7"
                    placeholder="transparent"
                  />
                </div>
              </div>
              <div>
                <Label className="text-zinc-500 text-[10px] uppercase">Color texto</Label>
                <div className="flex items-center gap-1.5 mt-1">
                  <input
                    type="color"
                    value={row.styles.textColor || "#FFFFFF"}
                    onChange={(e) => updateStyle(row.id, "textColor", e.target.value)}
                    className="w-7 h-7 rounded border border-zinc-700 cursor-pointer bg-transparent flex-shrink-0"
                  />
                  <Input
                    value={row.styles.textColor || ""}
                    onChange={(e) => updateStyle(row.id, "textColor", e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white text-xs h-7"
                    placeholder="#FFFFFF"
                  />
                </div>
              </div>
              <div>
                <Label className="text-zinc-500 text-[10px] uppercase">Color borde</Label>
                <div className="flex items-center gap-1.5 mt-1">
                  <input
                    type="color"
                    value={row.styles.borderColor || "#000000"}
                    onChange={(e) => updateStyle(row.id, "borderColor", e.target.value)}
                    className="w-7 h-7 rounded border border-zinc-700 cursor-pointer bg-transparent flex-shrink-0"
                  />
                  <Input
                    value={row.styles.borderColor || ""}
                    onChange={(e) => updateStyle(row.id, "borderColor", e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white text-xs h-7"
                    placeholder="ninguno"
                  />
                </div>
              </div>
            </div>

            {/* Gradient Visual Editor */}
            <GradientVisualEditor
              value={row.styles.gradient || ""}
              onChange={(v) => updateStyle(row.id, "gradient", v)}
            />

            {/* Sizing */}
            <div className="grid grid-cols-4 gap-3">
              <div>
                <Label className="text-zinc-500 text-[10px] uppercase">Tamaño fuente</Label>
                <Input
                  value={row.styles.fontSize || ""}
                  onChange={(e) => updateStyle(row.id, "fontSize", e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white text-xs h-7 mt-1"
                  placeholder="16px"
                />
              </div>
              <div>
                <Label className="text-zinc-500 text-[10px] uppercase">Peso</Label>
                <select
                  value={row.styles.fontWeight || "600"}
                  onChange={(e) => updateStyle(row.id, "fontWeight", e.target.value)}
                  className="w-full mt-1 bg-zinc-800 border border-zinc-700 text-white rounded px-2 py-1 text-xs h-7"
                >
                  {FONT_WEIGHTS.map((w) => (
                    <option key={w.value} value={w.value}>{w.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-zinc-500 text-[10px] uppercase">Padding X</Label>
                <Input
                  value={row.styles.paddingX || ""}
                  onChange={(e) => updateStyle(row.id, "paddingX", e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white text-xs h-7 mt-1"
                  placeholder="32px"
                />
              </div>
              <div>
                <Label className="text-zinc-500 text-[10px] uppercase">Padding Y</Label>
                <Input
                  value={row.styles.paddingY || ""}
                  onChange={(e) => updateStyle(row.id, "paddingY", e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white text-xs h-7 mt-1"
                  placeholder="14px"
                />
              </div>
            </div>

            {/* Border radius, shadow, hover */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-zinc-500 text-[10px] uppercase">Border radius</Label>
                <Input
                  value={row.styles.borderRadius || ""}
                  onChange={(e) => updateStyle(row.id, "borderRadius", e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white text-xs h-7 mt-1"
                  placeholder="9999px"
                />
              </div>
              <div>
                <Label className="text-zinc-500 text-[10px] uppercase">Sombra</Label>
                <Input
                  value={row.styles.shadow || ""}
                  onChange={(e) => updateStyle(row.id, "shadow", e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white text-xs h-7 mt-1"
                  placeholder="0 8px 30px rgba(...)"
                />
              </div>
              <div>
                <Label className="text-zinc-500 text-[10px] uppercase">Hover scale</Label>
                <Input
                  value={row.styles.hoverScale || ""}
                  onChange={(e) => updateStyle(row.id, "hoverScale", e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white text-xs h-7 mt-1"
                  placeholder="1.02"
                />
              </div>
            </div>

            {/* Hover colors */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-zinc-500 text-[10px] uppercase">Hover fondo</Label>
                <div className="flex items-center gap-1.5 mt-1">
                  <input
                    type="color"
                    value={row.styles.hoverBgColor || "#000000"}
                    onChange={(e) => updateStyle(row.id, "hoverBgColor", e.target.value)}
                    className="w-7 h-7 rounded border border-zinc-700 cursor-pointer bg-transparent flex-shrink-0"
                  />
                  <Input
                    value={row.styles.hoverBgColor || ""}
                    onChange={(e) => updateStyle(row.id, "hoverBgColor", e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white text-xs h-7"
                    placeholder="ninguno"
                  />
                </div>
              </div>
              <div>
                <Label className="text-zinc-500 text-[10px] uppercase">Hover texto</Label>
                <div className="flex items-center gap-1.5 mt-1">
                  <input
                    type="color"
                    value={row.styles.hoverTextColor || "#FFFFFF"}
                    onChange={(e) => updateStyle(row.id, "hoverTextColor", e.target.value)}
                    className="w-7 h-7 rounded border border-zinc-700 cursor-pointer bg-transparent flex-shrink-0"
                  />
                  <Input
                    value={row.styles.hoverTextColor || ""}
                    onChange={(e) => updateStyle(row.id, "hoverTextColor", e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white text-xs h-7"
                    placeholder="ninguno"
                  />
                </div>
              </div>
              <div>
                <Label className="text-zinc-500 text-[10px] uppercase">Hover borde</Label>
                <div className="flex items-center gap-1.5 mt-1">
                  <input
                    type="color"
                    value={row.styles.hoverBorderColor || "#000000"}
                    onChange={(e) => updateStyle(row.id, "hoverBorderColor", e.target.value)}
                    className="w-7 h-7 rounded border border-zinc-700 cursor-pointer bg-transparent flex-shrink-0"
                  />
                  <Input
                    value={row.styles.hoverBorderColor || ""}
                    onChange={(e) => updateStyle(row.id, "hoverBorderColor", e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white text-xs h-7"
                    placeholder="ninguno"
                  />
                </div>
              </div>
            </div>

            {/* Icon toggle */}
            <div className="flex items-center gap-3">
              <Switch
                checked={row.styles.hasIcon === true}
                onCheckedChange={(v) => updateStyle(row.id, "hasIcon", v)}
              />
              <span className="text-zinc-400 text-xs">Mostrar ícono (flecha →)</span>
            </div>
          </div>
        ))}
      </div>

      {rows.length === 0 && (
        <div className="text-center py-12 text-zinc-500">
          No hay estilos de CTA definidos. Crea el primero.
        </div>
      )}
    </div>
  );
}
