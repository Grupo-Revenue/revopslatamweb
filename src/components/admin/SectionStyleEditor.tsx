import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Monitor, Smartphone, Palette, Type } from "lucide-react";

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

type Props = {
  metadata: Record<string, unknown>;
  onChange: (metadata: Record<string, unknown>) => void;
};

const ELEMENTS = [
  { key: "title", label: "Título", icon: Type },
  { key: "subtitle", label: "Subtítulo", icon: Type },
  { key: "body", label: "Contenido", icon: Type },
  { key: "cta", label: "Botón CTA", icon: Palette },
] as const;

const FONT_SIZES = [
  { label: "12px", value: "12" },
  { label: "14px", value: "14" },
  { label: "16px", value: "16" },
  { label: "18px", value: "18" },
  { label: "20px", value: "20" },
  { label: "24px", value: "24" },
  { label: "28px", value: "28" },
  { label: "32px", value: "32" },
  { label: "36px", value: "36" },
  { label: "40px", value: "40" },
  { label: "48px", value: "48" },
  { label: "56px", value: "56" },
  { label: "64px", value: "64" },
  { label: "72px", value: "72" },
  { label: "80px", value: "80" },
  { label: "96px", value: "96" },
];

const FONT_WEIGHTS = [
  { label: "Light", value: "300" },
  { label: "Normal", value: "400" },
  { label: "Medium", value: "500" },
  { label: "Semi Bold", value: "600" },
  { label: "Bold", value: "700" },
  { label: "Extra Bold", value: "800" },
];

function getStyles(metadata: Record<string, unknown>): SectionMetadataStyles {
  return (metadata?.styles as SectionMetadataStyles) ?? {};
}

function DeviceStyleEditor({
  elementKey,
  device,
  styles,
  onUpdate,
}: {
  elementKey: string;
  device: "desktop" | "mobile";
  styles: ElementStyles;
  onUpdate: (field: keyof ElementStyles, value: string) => void;
}) {
  const fontSize = parseInt(styles.fontSize || "0") || 0;

  return (
    <div className="space-y-3">
      {/* Font Size */}
      <div>
        <Label className="text-zinc-500 text-xs uppercase tracking-wider">
          Tamaño de fuente
        </Label>
        <div className="flex items-center gap-3 mt-1.5">
          <Slider
            value={[fontSize || 16]}
            min={10}
            max={96}
            step={1}
            onValueChange={([v]) => onUpdate("fontSize", `${v}px`)}
            className="flex-1"
          />
          <span className="text-white text-sm font-mono w-14 text-right">
            {fontSize || 16}px
          </span>
        </div>
      </div>

      {/* Font Weight */}
      <div>
        <Label className="text-zinc-500 text-xs uppercase tracking-wider">
          Peso de fuente
        </Label>
        <select
          value={styles.fontWeight || "400"}
          onChange={(e) => onUpdate("fontWeight", e.target.value)}
          className="w-full mt-1 bg-zinc-800 border border-zinc-700 text-white rounded-md px-3 py-2 text-sm"
        >
          {FONT_WEIGHTS.map((w) => (
            <option key={w.value} value={w.value}>
              {w.label} ({w.value})
            </option>
          ))}
        </select>
      </div>

      {/* Color */}
      <div>
        <Label className="text-zinc-500 text-xs uppercase tracking-wider">
          Color
        </Label>
        <div className="flex items-center gap-2 mt-1">
          <input
            type="color"
            value={styles.color || "#ffffff"}
            onChange={(e) => onUpdate("color", e.target.value)}
            className="w-8 h-8 rounded border border-zinc-700 cursor-pointer bg-transparent"
          />
          <Input
            value={styles.color || ""}
            onChange={(e) => onUpdate("color", e.target.value)}
            placeholder="#ffffff o inherit"
            className="bg-zinc-800 border-zinc-700 text-white text-sm"
          />
        </div>
      </div>

      {/* Gradient */}
      <div>
        <Label className="text-zinc-500 text-xs uppercase tracking-wider">
          Gradiente (texto)
        </Label>
        <Input
          value={styles.gradient || ""}
          onChange={(e) => onUpdate("gradient", e.target.value)}
          placeholder="linear-gradient(90deg, #BE1869, #8B5CF6)"
          className="bg-zinc-800 border-zinc-700 text-white text-sm mt-1"
        />
        {styles.gradient && (
          <div
            className="mt-1.5 h-4 rounded-md border border-zinc-700"
            style={{ background: styles.gradient }}
          />
        )}
      </div>
    </div>
  );
}

export default function SectionStyleEditor({ metadata, onChange }: Props) {
  const [activeElement, setActiveElement] = useState<string>("title");
  const currentStyles = getStyles(metadata);

  const updateElementStyle = (
    element: string,
    device: "desktop" | "mobile",
    field: keyof ElementStyles,
    value: string
  ) => {
    const updated: SectionMetadataStyles = { ...currentStyles };
    const elKey = element as keyof SectionMetadataStyles;

    if (elKey === "background") return; // handled separately

    const current = (updated[elKey] as ResponsiveElementStyles) ?? {};
    const deviceStyles = current[device] ?? {};

    const newMetadata = {
      ...metadata,
      styles: {
        ...updated,
        [elKey]: {
          ...current,
          [device]: {
            ...deviceStyles,
            [field]: value || undefined,
          },
        },
      },
    };
    onChange(newMetadata);
  };

  const updateBackgroundStyle = (field: "color" | "gradient", value: string) => {
    const updated = { ...currentStyles };
    const bg = updated.background ?? {};
    const newMetadata = {
      ...metadata,
      styles: {
        ...updated,
        background: { ...bg, [field]: value || undefined },
      },
    };
    onChange(newMetadata);
  };

  const activeStyles = (currentStyles[activeElement as keyof SectionMetadataStyles] as ResponsiveElementStyles) ?? {};

  return (
    <div className="space-y-4">
      {/* Element Selector */}
      <div className="flex flex-wrap gap-1.5">
        {ELEMENTS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveElement(key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeElement === key
                ? "bg-emerald-600 text-white"
                : "bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700"
            }`}
          >
            <Icon className="h-3 w-3" />
            {label}
          </button>
        ))}
        <button
          onClick={() => setActiveElement("background")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeElement === "background"
              ? "bg-emerald-600 text-white"
              : "bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700"
          }`}
        >
          <Palette className="h-3 w-3" />
          Fondo
        </button>
      </div>

      {/* Background Editor */}
      {activeElement === "background" && (
        <div className="space-y-3 bg-zinc-800/50 rounded-lg p-3">
          <div>
            <Label className="text-zinc-500 text-xs uppercase tracking-wider">
              Color de fondo
            </Label>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="color"
                value={currentStyles.background?.color || "#000000"}
                onChange={(e) => updateBackgroundStyle("color", e.target.value)}
                className="w-8 h-8 rounded border border-zinc-700 cursor-pointer bg-transparent"
              />
              <Input
                value={currentStyles.background?.color || ""}
                onChange={(e) => updateBackgroundStyle("color", e.target.value)}
                placeholder="#000000 o transparent"
                className="bg-zinc-800 border-zinc-700 text-white text-sm"
              />
            </div>
          </div>
          <div>
            <Label className="text-zinc-500 text-xs uppercase tracking-wider">
              Gradiente de fondo
            </Label>
            <Input
              value={currentStyles.background?.gradient || ""}
              onChange={(e) => updateBackgroundStyle("gradient", e.target.value)}
              placeholder="linear-gradient(135deg, #000, #1a1a2e)"
              className="bg-zinc-800 border-zinc-700 text-white text-sm mt-1"
            />
            {currentStyles.background?.gradient && (
              <div
                className="mt-1.5 h-6 rounded-md border border-zinc-700"
                style={{ background: currentStyles.background.gradient }}
              />
            )}
          </div>
        </div>
      )}

      {/* Element Responsive Editor */}
      {activeElement !== "background" && (
        <Tabs defaultValue="desktop" className="w-full">
          <TabsList className="bg-zinc-800 border border-zinc-700 w-full">
            <TabsTrigger
              value="desktop"
              className="flex-1 data-[state=active]:bg-zinc-700 data-[state=active]:text-white text-zinc-400 gap-1.5"
            >
              <Monitor className="h-3.5 w-3.5" /> Desktop
            </TabsTrigger>
            <TabsTrigger
              value="mobile"
              className="flex-1 data-[state=active]:bg-zinc-700 data-[state=active]:text-white text-zinc-400 gap-1.5"
            >
              <Smartphone className="h-3.5 w-3.5" /> Mobile
            </TabsTrigger>
          </TabsList>
          <TabsContent value="desktop" className="bg-zinc-800/50 rounded-lg p-3 mt-2">
            <DeviceStyleEditor
              elementKey={activeElement}
              device="desktop"
              styles={activeStyles.desktop ?? {}}
              onUpdate={(field, value) =>
                updateElementStyle(activeElement, "desktop", field, value)
              }
            />
          </TabsContent>
          <TabsContent value="mobile" className="bg-zinc-800/50 rounded-lg p-3 mt-2">
            <DeviceStyleEditor
              elementKey={activeElement}
              device="mobile"
              styles={activeStyles.mobile ?? {}}
              onUpdate={(field, value) =>
                updateElementStyle(activeElement, "mobile", field, value)
              }
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
