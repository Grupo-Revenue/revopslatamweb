import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, GripVertical } from "lucide-react";

/* ─── Types ─── */
type Meta = Record<string, unknown>;

interface EditorProps {
  metadata: Meta;
  onChange: (m: Meta) => void;
}

/* ══════════════════════════════════════════════════
   Comparison Table Editor (posicionamiento section)
   ══════════════════════════════════════════════════ */
interface CompRow { label: string; agency: string; revops: string }

export function ComparisonTableEditor({ metadata, onChange }: EditorProps) {
  const rows = (metadata.comparison as CompRow[]) ?? [];
  const callout = (metadata.callout as string) ?? "";

  const update = (updated: CompRow[]) => onChange({ ...metadata, comparison: updated });

  const addRow = () => update([...rows, { label: "", agency: "", revops: "" }]);
  const removeRow = (i: number) => update(rows.filter((_, idx) => idx !== i));
  const updateRow = (i: number, field: keyof CompRow, val: string) => {
    const next = [...rows];
    next[i] = { ...next[i], [field]: val };
    update(next);
  };

  return (
    <div className="space-y-4 p-3 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
      <Label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Tabla Comparativa</Label>

      {rows.map((row, i) => (
        <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-end">
          <div>
            {i === 0 && <Label className="text-zinc-500 text-[10px]">Criterio</Label>}
            <Input value={row.label} onChange={e => updateRow(i, "label", e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white text-xs h-8" placeholder="Ej: Foco" />
          </div>
          <div>
            {i === 0 && <Label className="text-zinc-500 text-[10px]">Agencia</Label>}
            <Input value={row.agency} onChange={e => updateRow(i, "agency", e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white text-xs h-8" placeholder="Implementar la herramienta" />
          </div>
          <div>
            {i === 0 && <Label className="text-zinc-500 text-[10px]">RevOps LATAM</Label>}
            <Input value={row.revops} onChange={e => updateRow(i, "revops", e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white text-xs h-8" placeholder="Operar el motor" />
          </div>
          <button onClick={() => removeRow(i)} className="text-zinc-600 hover:text-red-400 pb-1"><Trash2 className="h-3.5 w-3.5" /></button>
        </div>
      ))}

      <Button onClick={addRow} variant="outline" size="sm" className="border-zinc-700 text-zinc-400 text-xs h-7">
        <Plus className="h-3 w-3 mr-1" /> Agregar fila
      </Button>

      <div>
        <Label className="text-zinc-500 text-[10px] uppercase tracking-wider">Callout (texto destacado)</Label>
        <Textarea value={callout}
          onChange={e => onChange({ ...metadata, callout: e.target.value })}
          className="bg-zinc-800 border-zinc-700 text-white mt-1 text-sm min-h-[60px]"
          placeholder="Nosotros hacemos lo contrario..." />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   Hub Cards Editor (ecosistema section)
   ══════════════════════════════════════════════════ */
interface HubCard { badge: string; badgeColor: string; icon: string; title: string; desc: string; tag: string }

export function HubCardsEditor({ metadata, onChange }: EditorProps) {
  const hubs = (metadata.hubs as HubCard[]) ?? [];

  const update = (updated: HubCard[]) => onChange({ ...metadata, hubs: updated });

  const addHub = () => update([...hubs, { badge: "", badgeColor: "#BE1869", icon: "megaphone", title: "", desc: "", tag: "" }]);
  const removeHub = (i: number) => update(hubs.filter((_, idx) => idx !== i));
  const updateHub = (i: number, field: keyof HubCard, val: string) => {
    const next = [...hubs];
    next[i] = { ...next[i], [field]: val };
    update(next);
  };

  return (
    <div className="space-y-4 p-3 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
      <Label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Hub Cards</Label>

      {hubs.map((hub, i) => (
        <div key={i} className="space-y-2 p-3 bg-zinc-900/50 rounded-lg border border-zinc-700/30">
          <div className="flex items-center justify-between">
            <span className="text-zinc-300 text-xs font-bold">{hub.title || `Hub ${i + 1}`}</span>
            <button onClick={() => removeHub(i)} className="text-zinc-600 hover:text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label className="text-zinc-500 text-[10px]">Título</Label>
              <Input value={hub.title} onChange={e => updateHub(i, "title", e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white text-xs h-8" />
            </div>
            <div>
              <Label className="text-zinc-500 text-[10px]">Badge</Label>
              <Input value={hub.badge} onChange={e => updateHub(i, "badge", e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white text-xs h-8" />
            </div>
            <div>
              <Label className="text-zinc-500 text-[10px]">Color Badge</Label>
              <div className="flex items-center gap-1">
                <input type="color" value={hub.badgeColor} onChange={e => updateHub(i, "badgeColor", e.target.value)}
                  className="w-6 h-6 rounded border border-zinc-700 cursor-pointer bg-transparent" />
                <Input value={hub.badgeColor} onChange={e => updateHub(i, "badgeColor", e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white text-xs h-8 flex-1" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-zinc-500 text-[10px]">Icono (megaphone/chart/heart/settings/globe)</Label>
              <Input value={hub.icon} onChange={e => updateHub(i, "icon", e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white text-xs h-8" />
            </div>
            <div>
              <Label className="text-zinc-500 text-[10px]">Tag chip</Label>
              <Input value={hub.tag} onChange={e => updateHub(i, "tag", e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white text-xs h-8" />
            </div>
          </div>
          <div>
            <Label className="text-zinc-500 text-[10px]">Descripción</Label>
            <Textarea value={hub.desc} onChange={e => updateHub(i, "desc", e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white text-xs min-h-[50px]" />
          </div>
        </div>
      ))}

      <Button onClick={addHub} variant="outline" size="sm" className="border-zinc-700 text-zinc-400 text-xs h-7">
        <Plus className="h-3 w-3 mr-1" /> Agregar Hub
      </Button>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   Timeline Steps Editor (como-trabajamos section)
   ══════════════════════════════════════════════════ */
interface TimelineStep { num: string; title: string; desc: string; chip: string }

export function TimelineStepsEditor({ metadata, onChange }: EditorProps) {
  const steps = (metadata.steps as TimelineStep[]) ?? [];

  const update = (updated: TimelineStep[]) => onChange({ ...metadata, steps: updated });

  const addStep = () => update([...steps, { num: String(steps.length + 1).padStart(2, "0"), title: "", desc: "", chip: "" }]);
  const removeStep = (i: number) => update(steps.filter((_, idx) => idx !== i));
  const updateStep = (i: number, field: keyof TimelineStep, val: string) => {
    const next = [...steps];
    next[i] = { ...next[i], [field]: val };
    update(next);
  };

  return (
    <div className="space-y-4 p-3 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
      <Label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Pasos del Timeline</Label>

      {steps.map((step, i) => (
        <div key={i} className="grid grid-cols-[60px_1fr_1fr_auto] gap-2 items-end">
          <div>
            {i === 0 && <Label className="text-zinc-500 text-[10px]">#</Label>}
            <Input value={step.num} onChange={e => updateStep(i, "num", e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white text-xs h-8" />
          </div>
          <div>
            {i === 0 && <Label className="text-zinc-500 text-[10px]">Título</Label>}
            <Input value={step.title} onChange={e => updateStep(i, "title", e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white text-xs h-8" />
          </div>
          <div>
            {i === 0 && <Label className="text-zinc-500 text-[10px]">Chip</Label>}
            <Input value={step.chip} onChange={e => updateStep(i, "chip", e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white text-xs h-8" />
          </div>
          <button onClick={() => removeStep(i)} className="text-zinc-600 hover:text-red-400 pb-1"><Trash2 className="h-3.5 w-3.5" /></button>
        </div>
      ))}
      {steps.map((step, i) => (
        <div key={`desc-${i}`}>
          <Label className="text-zinc-500 text-[10px]">Descripción paso {step.num}</Label>
          <Textarea value={step.desc} onChange={e => updateStep(i, "desc", e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white text-xs min-h-[40px]" />
        </div>
      ))}

      <Button onClick={addStep} variant="outline" size="sm" className="border-zinc-700 text-zinc-400 text-xs h-7">
        <Plus className="h-3 w-3 mr-1" /> Agregar paso
      </Button>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   FAQ Editor (faq section)
   ══════════════════════════════════════════════════ */
interface FaqItem { q: string; a: string }

export function FaqEditor({ metadata, onChange }: EditorProps) {
  const faqs = (metadata.faqs as FaqItem[]) ?? [];

  const update = (updated: FaqItem[]) => onChange({ ...metadata, faqs: updated });

  const addFaq = () => update([...faqs, { q: "", a: "" }]);
  const removeFaq = (i: number) => update(faqs.filter((_, idx) => idx !== i));
  const updateFaq = (i: number, field: keyof FaqItem, val: string) => {
    const next = [...faqs];
    next[i] = { ...next[i], [field]: val };
    update(next);
  };

  return (
    <div className="space-y-4 p-3 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
      <Label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Preguntas Frecuentes (FAQ)</Label>

      {faqs.map((faq, i) => (
        <div key={i} className="space-y-2 p-3 bg-zinc-900/50 rounded-lg border border-zinc-700/30">
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 text-[10px] font-semibold">Pregunta {i + 1}</span>
            <button onClick={() => removeFaq(i)} className="text-zinc-600 hover:text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
          <Input value={faq.q} onChange={e => updateFaq(i, "q", e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white text-xs" placeholder="¿Pregunta?" />
          <Textarea value={faq.a} onChange={e => updateFaq(i, "a", e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white text-xs min-h-[60px]" placeholder="Respuesta..." />
        </div>
      ))}

      <Button onClick={addFaq} variant="outline" size="sm" className="border-zinc-700 text-zinc-400 text-xs h-7">
        <Plus className="h-3 w-3 mr-1" /> Agregar pregunta
      </Button>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   Fit / No-Fit Lists Editor (para-quien section)
   ══════════════════════════════════════════════════ */
export function FitListEditor({ metadata, onChange }: EditorProps) {
  const yesItems = (metadata.yes_items as string[]) ?? [];
  const noItems = (metadata.no_items as string[]) ?? [];

  const updateYes = (updated: string[]) => onChange({ ...metadata, yes_items: updated });
  const updateNo = (updated: string[]) => onChange({ ...metadata, no_items: updated });

  return (
    <div className="space-y-4 p-3 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
      <Label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Listas "Para quién"</Label>

      {/* Yes items */}
      <div className="space-y-2">
        <Label className="text-emerald-400 text-[10px] uppercase tracking-wider">✓ Somos el partner correcto si:</Label>
        {yesItems.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input value={item} onChange={e => { const next = [...yesItems]; next[i] = e.target.value; updateYes(next); }}
              className="bg-zinc-800 border-zinc-700 text-white text-xs h-8 flex-1" />
            <button onClick={() => updateYes(yesItems.filter((_, idx) => idx !== i))}
              className="text-zinc-600 hover:text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
        ))}
        <Button onClick={() => updateYes([...yesItems, ""])} variant="outline" size="sm" className="border-zinc-700 text-zinc-400 text-xs h-7">
          <Plus className="h-3 w-3 mr-1" /> Agregar
        </Button>
      </div>

      {/* No items */}
      <div className="space-y-2">
        <Label className="text-red-400 text-[10px] uppercase tracking-wider">✗ No somos el partner correcto si:</Label>
        {noItems.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input value={item} onChange={e => { const next = [...noItems]; next[i] = e.target.value; updateNo(next); }}
              className="bg-zinc-800 border-zinc-700 text-white text-xs h-8 flex-1" />
            <button onClick={() => updateNo(noItems.filter((_, idx) => idx !== i))}
              className="text-zinc-600 hover:text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
        ))}
        <Button onClick={() => updateNo([...noItems, ""])} variant="outline" size="sm" className="border-zinc-700 text-zinc-400 text-xs h-7">
          <Plus className="h-3 w-3 mr-1" /> Agregar
        </Button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   Stats Editor (hero stats)
   ══════════════════════════════════════════════════ */
interface StatItem { value: string; label: string; counter?: number }

export function StatsEditor({ metadata, onChange }: EditorProps) {
  const stats = (metadata.stats as StatItem[]) ?? [];

  const update = (updated: StatItem[]) => onChange({ ...metadata, stats: updated });

  const addStat = () => update([...stats, { value: "", label: "" }]);
  const removeStat = (i: number) => update(stats.filter((_, idx) => idx !== i));
  const updateStat = (i: number, field: string, val: string | number | undefined) => {
    const next = [...stats];
    next[i] = { ...next[i], [field]: val };
    update(next);
  };

  return (
    <div className="space-y-3 p-3 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
      <Label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Stats del Hero</Label>

      {stats.map((stat, i) => (
        <div key={i} className="grid grid-cols-[1fr_1fr_80px_auto] gap-2 items-end">
          <div>
            {i === 0 && <Label className="text-zinc-500 text-[10px]">Valor mostrado</Label>}
            <Input value={stat.value} onChange={e => updateStat(i, "value", e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white text-xs h-8" placeholder="Platinum" />
          </div>
          <div>
            {i === 0 && <Label className="text-zinc-500 text-[10px]">Label</Label>}
            <Input value={stat.label} onChange={e => updateStat(i, "label", e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white text-xs h-8" placeholder="Nivel de..." />
          </div>
          <div>
            {i === 0 && <Label className="text-zinc-500 text-[10px]">Counter</Label>}
            <Input type="number" value={stat.counter ?? ""} onChange={e => updateStat(i, "counter", e.target.value ? parseInt(e.target.value) : undefined)}
              className="bg-zinc-800 border-zinc-700 text-white text-xs h-8" placeholder="14" />
          </div>
          <button onClick={() => removeStat(i)} className="text-zinc-600 hover:text-red-400 pb-1"><Trash2 className="h-3.5 w-3.5" /></button>
        </div>
      ))}

      <Button onClick={addStat} variant="outline" size="sm" className="border-zinc-700 text-zinc-400 text-xs h-7">
        <Plus className="h-3 w-3 mr-1" /> Agregar stat
      </Button>
      <p className="text-zinc-600 text-[10px]">Counter: número para animación (ej: 14). Dejar vacío si el valor es texto estático.</p>
    </div>
  );
}
