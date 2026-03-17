import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";

type Props = {
  metadata: Record<string, unknown>;
  onChange: (m: Record<string, unknown>) => void;
  fieldKey?: string;
  label?: string;
};

export default function ChipsEditor({ metadata, onChange, fieldKey = "chips", label = "Chips informativos" }: Props) {
  const chips = ((metadata[fieldKey] as string[]) ?? []);

  const update = (newChips: string[]) => {
    onChange({ ...metadata, [fieldKey]: newChips });
  };

  return (
    <div className="space-y-2 p-3 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
      <div className="flex items-center justify-between">
        <Label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
          {label} ({chips.length})
        </Label>
        <button onClick={() => update([...chips, ""])} className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
          <Plus className="h-3 w-3" /> Agregar
        </button>
      </div>
      {chips.map((chip, i) => (
        <div key={i} className="flex items-center gap-1">
          <Input
            value={chip}
            onChange={(e) => {
              const copy = [...chips];
              copy[i] = e.target.value;
              update(copy);
            }}
            className="bg-zinc-800 border-zinc-700 text-white text-xs h-7 flex-1"
            placeholder="Texto del chip"
          />
          <button onClick={() => update(chips.filter((_, idx) => idx !== i))} className="text-zinc-600 hover:text-red-400">
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  );
}
