import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Monitor, Smartphone, Paintbrush } from "lucide-react";

export type ElementStyles = {
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  gradient?: string;
};

export type ResponsiveElementStyles = {
  desktop?: ElementStyles;
  mobile?: ElementStyles;
};

export type SectionMetadataStyles = {
  title?: ResponsiveElementStyles;
  subtitle?: ResponsiveElementStyles;
  body?: ResponsiveElementStyles;
  cta?: ResponsiveElementStyles;
  background?: {
    color?: string;
    gradient?: string;
  };
};

const FONT_WEIGHTS = [
  { label: "Light", value: "300" },
  { label: "Normal", value: "400" },
  { label: "Medium", value: "500" },
  { label: "Semi Bold", value: "600" },
  { label: "Bold", value: "700" },
  { label: "Extra Bold", value: "800" },
];

export function getStyles(metadata: Record<string, unknown>): SectionMetadataStyles {
  return (metadata?.styles as SectionMetadataStyles) ?? {};
}

export function updateElementStyle(
  metadata: Record<string, unknown>,
  element: string,
  device: "desktop" | "mobile",
  field: keyof ElementStyles,
  value: string
): Record<string, unknown> {
  const styles = getStyles(metadata);
  const elKey = element as keyof SectionMetadataStyles;
  if (elKey === "background") return metadata;
  const current = (styles[elKey] as ResponsiveElementStyles) ?? {};
  const deviceStyles = current[device] ?? {};
  return {
    ...metadata,
    styles: {
      ...styles,
      [elKey]: {
        ...current,
        [device]: { ...deviceStyles, [field]: value || undefined },
      },
    },
  };
}

export function updateBackgroundStyle(
  metadata: Record<string, unknown>,
  field: "color" | "gradient",
  value: string
): Record<string, unknown> {
  const styles = getStyles(metadata);
  const bg = styles.background ?? {};
  return {
    ...metadata,
    styles: { ...styles, background: { ...bg, [field]: value || undefined } },
  };
}

/** Inline style button that opens a popover with desktop/mobile font, color, gradient */
export function InlineStylePopover({
  elementKey,
  metadata,
  onChange,
}: {
  elementKey: string;
  metadata: Record<string, unknown>;
  onChange: (m: Record<string, unknown>) => void;
}) {
  const styles = getStyles(metadata);
  const elStyles = (styles[elementKey as keyof SectionMetadataStyles] as ResponsiveElementStyles) ?? {};
  const hasStyles = elStyles.desktop?.fontSize || elStyles.desktop?.color || elStyles.mobile?.fontSize;

  const update = (device: "desktop" | "mobile", field: keyof ElementStyles, value: string) => {
    onChange(updateElementStyle(metadata, elementKey, device, field, value));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={`p-1.5 rounded-md transition-colors ${
            hasStyles
              ? "bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30"
              : "text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800"
          }`}
          title="Editar estilos"
        >
          <Paintbrush className="h-3.5 w-3.5" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 bg-zinc-900 border-zinc-700 p-0"
        side="right"
        align="start"
      >
        <div className="p-3 border-b border-zinc-800">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Estilos — {elementKey}
          </span>
        </div>
        <div className="p-3 space-y-4">
          {/* Desktop */}
          <DeviceSection
            label="Desktop"
            icon={<Monitor className="h-3.5 w-3.5" />}
            styles={elStyles.desktop ?? {}}
            onUpdate={(f, v) => update("desktop", f, v)}
          />
          {/* Mobile */}
          <DeviceSection
            label="Mobile"
            icon={<Smartphone className="h-3.5 w-3.5" />}
            styles={elStyles.mobile ?? {}}
            onUpdate={(f, v) => update("mobile", f, v)}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}

function DeviceSection({
  label,
  icon,
  styles,
  onUpdate,
}: {
  label: string;
  icon: React.ReactNode;
  styles: ElementStyles;
  onUpdate: (field: keyof ElementStyles, value: string) => void;
}) {
  const fontSize = parseInt(styles.fontSize || "0") || 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-medium">
        {icon} {label}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {/* Font Size */}
        <div>
          <Label className="text-zinc-500 text-[10px] uppercase">Tamaño</Label>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Slider
              value={[fontSize || 16]}
              min={10}
              max={96}
              step={1}
              onValueChange={([v]) => onUpdate("fontSize", `${v}px`)}
              className="flex-1"
            />
            <span className="text-white text-xs font-mono w-10 text-right">
              {fontSize || 16}px
            </span>
          </div>
        </div>
        {/* Font Weight */}
        <div>
          <Label className="text-zinc-500 text-[10px] uppercase">Peso</Label>
          <select
            value={styles.fontWeight || "400"}
            onChange={(e) => onUpdate("fontWeight", e.target.value)}
            className="w-full mt-0.5 bg-zinc-800 border border-zinc-700 text-white rounded px-2 py-1 text-xs"
          >
            {FONT_WEIGHTS.map((w) => (
              <option key={w.value} value={w.value}>{w.label}</option>
            ))}
          </select>
        </div>
      </div>
      {/* Color + Gradient */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-zinc-500 text-[10px] uppercase">Color</Label>
          <div className="flex items-center gap-1 mt-0.5">
            <input
              type="color"
              value={styles.color || "#ffffff"}
              onChange={(e) => onUpdate("color", e.target.value)}
              className="w-6 h-6 rounded border border-zinc-700 cursor-pointer bg-transparent flex-shrink-0"
            />
            <Input
              value={styles.color || ""}
              onChange={(e) => onUpdate("color", e.target.value)}
              placeholder="#fff"
              className="bg-zinc-800 border-zinc-700 text-white text-xs h-7 px-2"
            />
          </div>
        </div>
        <div>
          <Label className="text-zinc-500 text-[10px] uppercase">Gradiente</Label>
          <Input
            value={styles.gradient || ""}
            onChange={(e) => onUpdate("gradient", e.target.value)}
            placeholder="linear-gradient(...)"
            className="bg-zinc-800 border-zinc-700 text-white text-xs h-7 px-2 mt-0.5"
          />
        </div>
      </div>
    </div>
  );
}

/** Background style controls inline */
export function BackgroundStyleControls({
  metadata,
  onChange,
}: {
  metadata: Record<string, unknown>;
  onChange: (m: Record<string, unknown>) => void;
}) {
  const styles = getStyles(metadata);
  const bg = styles.background ?? {};

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 flex-1">
        <input
          type="color"
          value={bg.color || "#000000"}
          onChange={(e) => onChange(updateBackgroundStyle(metadata, "color", e.target.value))}
          className="w-6 h-6 rounded border border-zinc-700 cursor-pointer bg-transparent flex-shrink-0"
        />
        <Input
          value={bg.color || ""}
          onChange={(e) => onChange(updateBackgroundStyle(metadata, "color", e.target.value))}
          placeholder="Color fondo"
          className="bg-zinc-800 border-zinc-700 text-white text-xs h-7 px-2"
        />
      </div>
      <div className="flex-1">
        <Input
          value={bg.gradient || ""}
          onChange={(e) => onChange(updateBackgroundStyle(metadata, "gradient", e.target.value))}
          placeholder="Gradiente fondo"
          className="bg-zinc-800 border-zinc-700 text-white text-xs h-7 px-2"
        />
      </div>
      {bg.gradient && (
        <div
          className="w-8 h-6 rounded border border-zinc-700 flex-shrink-0"
          style={{ background: bg.gradient }}
        />
      )}
    </div>
  );
}
