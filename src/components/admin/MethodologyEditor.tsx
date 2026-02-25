import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  AlertTriangle,
  Zap,
  Rocket,
  GripVertical,
} from "lucide-react";

interface TrackStateData {
  id: string;
  label: string;
  tagline: string;
  color: string;
  icon: string;
  headline: string;
  validation: string;
  signals: string[];
  consequences: string[];
  approach: string;
  ctaText: string;
  popular?: boolean;
}

const defaultTrackStates: TrackStateData[] = [
  {
    id: "broken",
    label: "Pista rota",
    tagline: "Sin sistema, sin previsibilidad",
    color: "#BE1869",
    icon: "AlertTriangle",
    headline: "Tu crecimiento depende de esfuerzos individuales, no de un sistema.",
    validation: "El 70% de las empresas B2B en LATAM operan así. No estás solo, pero seguir así tiene un costo.",
    signals: [
      "Tus equipos de venta, marketing y CS trabajan con datos distintos",
      "No puedes predecir el revenue del próximo trimestre con confianza",
      "Cada nuevo vendedor reinventa el proceso desde cero",
    ],
    consequences: [
      "Pierdes deals por falta de seguimiento, no por falta de demanda",
      "Tu CAC sube mientras tu pipeline se vuelve impredecible",
      "Escalar significa contratar más personas, no mejorar el sistema",
    ],
    approach: "Primero hay que entender dónde se rompe tu motor de ingresos. Un diagnóstico estructurado revela las 3-5 piezas críticas que están frenando tu revenue.",
    ctaText: "Diagnosticar mi motor de ingresos",
  },
  {
    id: "incomplete",
    label: "Pista incompleta",
    tagline: "Base instalada, fricciones constantes",
    color: "#D4A017",
    icon: "Zap",
    headline: "Tienes herramientas y procesos, pero tu revenue sigue sin ser predecible.",
    validation: "La mayoría de empresas que ya invirtieron en CRM y automatización están aquí. El problema no es la tecnología.",
    signals: [
      "Tienes HubSpot (u otro CRM) pero lo usan al 30% de su capacidad",
      "Los handoffs entre marketing → ventas → CS generan fricción constante",
      "Generas datos, pero no los usas para tomar decisiones de revenue",
    ],
    consequences: [
      "Tu inversión en tecnología no se traduce en crecimiento real",
      "Los equipos culpan a otros departamentos por los resultados",
      "Tus mejores oportunidades se pierden en los gaps entre áreas",
    ],
    approach: "Las piezas existen, pero están desconectadas. Se necesita conectar procesos, alinear equipos y automatizar los puntos de fricción que frenan tu pipeline.",
    ctaText: "Optimizar mi sistema comercial",
    popular: true,
  },
  {
    id: "complete",
    label: "Pista bien armada",
    tagline: "Sistema fluido, listo para escalar",
    color: "#1CA398",
    icon: "Rocket",
    headline: "Tu sistema funciona. Ahora necesitas un equipo que lo potencie sin perder foco.",
    validation: "Pocas empresas llegan aquí. Si ya tienes procesos integrados, el siguiente paso es escalar con operaciones dedicadas.",
    signals: [
      "Tus procesos de venta, marketing y CS están documentados y conectados",
      "Puedes predecir tu revenue con ±15% de precisión trimestral",
      "Cada nuevo rep es productivo en menos de 30 días",
    ],
    consequences: [
      "Sin un equipo de operaciones dedicado, la deuda técnica se acumula",
      "Tu equipo comercial pierde tiempo en tareas operativas en vez de vender",
      "El crecimiento se estanca cuando no hay quién optimice continuamente",
    ],
    approach: "Con la pista armada, lo que necesitas es un equipo de RevOps que opere, optimice y escale tu sistema de revenue con sprints continuos.",
    ctaText: "Escalar con RevOps as a Service",
  },
];

const iconOptions = [
  { value: "AlertTriangle", label: "⚠️ Alerta" },
  { value: "Zap", label: "⚡ Rayo" },
  { value: "Rocket", label: "🚀 Cohete" },
];

interface MethodologyEditorProps {
  metadata: Record<string, unknown>;
  onChange: (m: Record<string, unknown>) => void;
}

export default function MethodologyEditor({ metadata, onChange }: MethodologyEditorProps) {
  const tracks: TrackStateData[] =
    (metadata.track_states as TrackStateData[]) ?? defaultTrackStates;

  const [expandedTrack, setExpandedTrack] = useState<string | null>(null);

  const selectorQuestion = (metadata.selector_question as string) ?? "Identifica el estado de tu sistema comercial";
  const introText = (metadata.intro_text as string) ?? "Tu motor de ingresos es como una pista modular. Cada pieza —proceso, dato, acuerdo, automatización— determina si tu lead llega al final o se pierde en el camino.";

  const updateTracks = (updated: TrackStateData[]) => {
    onChange({ ...metadata, track_states: updated });
  };

  const updateTrack = (index: number, field: keyof TrackStateData, value: unknown) => {
    const updated = [...tracks];
    updated[index] = { ...updated[index], [field]: value };
    updateTracks(updated);
  };

  const updateSignal = (trackIdx: number, sigIdx: number, value: string) => {
    const updated = [...tracks];
    const signals = [...updated[trackIdx].signals];
    signals[sigIdx] = value;
    updated[trackIdx] = { ...updated[trackIdx], signals };
    updateTracks(updated);
  };

  const addSignal = (trackIdx: number) => {
    const updated = [...tracks];
    updated[trackIdx] = { ...updated[trackIdx], signals: [...updated[trackIdx].signals, ""] };
    updateTracks(updated);
  };

  const removeSignal = (trackIdx: number, sigIdx: number) => {
    const updated = [...tracks];
    updated[trackIdx] = { ...updated[trackIdx], signals: updated[trackIdx].signals.filter((_, i) => i !== sigIdx) };
    updateTracks(updated);
  };

  const updateConsequence = (trackIdx: number, conIdx: number, value: string) => {
    const updated = [...tracks];
    const consequences = [...updated[trackIdx].consequences];
    consequences[conIdx] = value;
    updated[trackIdx] = { ...updated[trackIdx], consequences };
    updateTracks(updated);
  };

  const addConsequence = (trackIdx: number) => {
    const updated = [...tracks];
    updated[trackIdx] = { ...updated[trackIdx], consequences: [...updated[trackIdx].consequences, ""] };
    updateTracks(updated);
  };

  const removeConsequence = (trackIdx: number, conIdx: number) => {
    const updated = [...tracks];
    updated[trackIdx] = { ...updated[trackIdx], consequences: updated[trackIdx].consequences.filter((_, i) => i !== conIdx) };
    updateTracks(updated);
  };

  const addTrack = () => {
    const newTrack: TrackStateData = {
      id: `track-${Date.now()}`,
      label: "Nueva pista",
      tagline: "",
      color: "#666666",
      icon: "AlertTriangle",
      headline: "",
      validation: "",
      signals: [""],
      consequences: [""],
      approach: "",
      ctaText: "",
    };
    updateTracks([...tracks, newTrack]);
    setExpandedTrack(newTrack.id);
  };

  const removeTrack = (index: number) => {
    if (!confirm(`¿Eliminar "${tracks[index].label}"?`)) return;
    updateTracks(tracks.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
          Editor de Metodología
        </span>
      </div>

      {/* General fields */}
      <div>
        <Label className="text-zinc-500 text-[10px] uppercase tracking-wider">Pregunta del selector</Label>
        <Input
          value={selectorQuestion}
          onChange={(e) => onChange({ ...metadata, selector_question: e.target.value })}
          className="bg-zinc-800 border-zinc-700 text-white mt-1 text-sm"
        />
      </div>
      <div>
        <Label className="text-zinc-500 text-[10px] uppercase tracking-wider">Texto introductorio</Label>
        <Textarea
          value={introText}
          onChange={(e) => onChange({ ...metadata, intro_text: e.target.value })}
          className="bg-zinc-800 border-zinc-700 text-white mt-1 text-sm min-h-[60px]"
        />
      </div>

      {/* Track states */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-zinc-500 text-[10px] uppercase tracking-wider">Estados de la pista ({tracks.length})</Label>
          <button
            onClick={addTrack}
            className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300"
          >
            <Plus className="h-3 w-3" /> Agregar estado
          </button>
        </div>

        {tracks.map((track, ti) => {
          const isExpanded = expandedTrack === track.id;
          return (
            <div
              key={track.id}
              className="bg-zinc-800/50 border border-zinc-700 rounded-lg overflow-hidden"
            >
              {/* Track header */}
              <button
                onClick={() => setExpandedTrack(isExpanded ? null : track.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-zinc-700/30 transition-colors"
              >
                <GripVertical className="h-3.5 w-3.5 text-zinc-600" />
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ background: track.color }}
                />
                <span className="text-white text-sm font-medium flex-1 text-left">
                  {track.label}
                </span>
                {track.popular && (
                  <span className="text-[9px] bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded font-semibold">
                    MÁS COMÚN
                  </span>
                )}
                {isExpanded ? (
                  <ChevronUp className="h-3.5 w-3.5 text-zinc-400" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
                )}
              </button>

              {isExpanded && (
                <div className="px-3 pb-3 border-t border-zinc-700 pt-3 space-y-3">
                  {/* Basic info row */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-zinc-500 text-[10px] uppercase tracking-wider">Etiqueta</Label>
                      <Input
                        value={track.label}
                        onChange={(e) => updateTrack(ti, "label", e.target.value)}
                        className="bg-zinc-900 border-zinc-700 text-white mt-1 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-zinc-500 text-[10px] uppercase tracking-wider">Tagline</Label>
                      <Input
                        value={track.tagline}
                        onChange={(e) => updateTrack(ti, "tagline", e.target.value)}
                        className="bg-zinc-900 border-zinc-700 text-white mt-1 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label className="text-zinc-500 text-[10px] uppercase tracking-wider">Color</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="color"
                          value={track.color}
                          onChange={(e) => updateTrack(ti, "color", e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer border border-zinc-700 bg-transparent"
                        />
                        <Input
                          value={track.color}
                          onChange={(e) => updateTrack(ti, "color", e.target.value)}
                          className="bg-zinc-900 border-zinc-700 text-white text-sm font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-zinc-500 text-[10px] uppercase tracking-wider">Icono</Label>
                      <select
                        value={track.icon}
                        onChange={(e) => updateTrack(ti, "icon", e.target.value)}
                        className="w-full mt-1 bg-zinc-900 border border-zinc-700 text-white rounded px-2 py-2 text-sm"
                      >
                        {iconOptions.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-end gap-2 pb-1">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={track.popular ?? false}
                          onChange={(e) => updateTrack(ti, "popular", e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-zinc-400 text-xs">Más común</span>
                      </label>
                    </div>
                  </div>

                  {/* Card headline */}
                  <div>
                    <Label className="text-zinc-500 text-[10px] uppercase tracking-wider">Headline (card + desplegable)</Label>
                    <Textarea
                      value={track.headline}
                      onChange={(e) => updateTrack(ti, "headline", e.target.value)}
                      className="bg-zinc-900 border-zinc-700 text-white mt-1 text-sm min-h-[50px]"
                    />
                  </div>

                  {/* Validation */}
                  <div>
                    <Label className="text-zinc-500 text-[10px] uppercase tracking-wider">Validación (desplegable)</Label>
                    <Textarea
                      value={track.validation}
                      onChange={(e) => updateTrack(ti, "validation", e.target.value)}
                      className="bg-zinc-900 border-zinc-700 text-white mt-1 text-sm min-h-[50px]"
                    />
                  </div>

                  {/* Signals */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <Label className="text-zinc-500 text-[10px] uppercase tracking-wider">Señales</Label>
                      <button onClick={() => addSignal(ti)} className="text-[10px] text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5">
                        <Plus className="h-3 w-3" /> Agregar
                      </button>
                    </div>
                    <div className="space-y-1.5">
                      {track.signals.map((sig, si) => (
                        <div key={si} className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: track.color }} />
                          <Input
                            value={sig}
                            onChange={(e) => updateSignal(ti, si, e.target.value)}
                            className="bg-zinc-900 border-zinc-700 text-white text-xs h-7 flex-1"
                            placeholder="Señal..."
                          />
                          <button onClick={() => removeSignal(ti, si)} className="text-zinc-600 hover:text-red-400 p-0.5">
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Consequences */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <Label className="text-zinc-500 text-[10px] uppercase tracking-wider">Consecuencias</Label>
                      <button onClick={() => addConsequence(ti)} className="text-[10px] text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5">
                        <Plus className="h-3 w-3" /> Agregar
                      </button>
                    </div>
                    <div className="space-y-1.5">
                      {track.consequences.map((con, ci) => (
                        <div key={ci} className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full shrink-0 bg-zinc-500" />
                          <Input
                            value={con}
                            onChange={(e) => updateConsequence(ti, ci, e.target.value)}
                            className="bg-zinc-900 border-zinc-700 text-white text-xs h-7 flex-1"
                            placeholder="Consecuencia..."
                          />
                          <button onClick={() => removeConsequence(ti, ci)} className="text-zinc-600 hover:text-red-400 p-0.5">
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Approach */}
                  <div>
                    <Label className="text-zinc-500 text-[10px] uppercase tracking-wider">Enfoque (desplegable)</Label>
                    <Textarea
                      value={track.approach}
                      onChange={(e) => updateTrack(ti, "approach", e.target.value)}
                      className="bg-zinc-900 border-zinc-700 text-white mt-1 text-sm min-h-[50px]"
                    />
                  </div>

                  {/* CTA text */}
                  <div>
                    <Label className="text-zinc-500 text-[10px] uppercase tracking-wider">Texto del CTA</Label>
                    <Input
                      value={track.ctaText}
                      onChange={(e) => updateTrack(ti, "ctaText", e.target.value)}
                      className="bg-zinc-900 border-zinc-700 text-white mt-1 text-sm"
                    />
                  </div>

                  {/* Delete track */}
                  <div className="pt-2 border-t border-zinc-700">
                    <button
                      onClick={() => removeTrack(ti)}
                      className="flex items-center gap-1 text-xs text-zinc-600 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-3 w-3" /> Eliminar este estado
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
