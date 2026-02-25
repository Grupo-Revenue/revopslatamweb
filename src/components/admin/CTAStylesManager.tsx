import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save, RotateCcw, Plus, Trash2, ArrowRight } from "lucide-react";
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

            {/* Gradient */}
            <div>
              <Label className="text-zinc-500 text-[10px] uppercase">Gradiente (reemplaza color fondo)</Label>
              <Input
                value={row.styles.gradient || ""}
                onChange={(e) => updateStyle(row.id, "gradient", e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white text-xs mt-1"
                placeholder="linear-gradient(135deg, #BE1869 0%, #6224BE 100%)"
              />
            </div>

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
