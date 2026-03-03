import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X, GripVertical } from "lucide-react";

type Props = {
  metadata: Record<string, unknown>;
  onChange: (m: Record<string, unknown>) => void;
};

export default function PainsEditor({ metadata, onChange }: Props) {
  const items = ((metadata.items as string[]) ?? []);

  const update = (newItems: string[]) => {
    onChange({ ...metadata, items: newItems });
  };

  const addItem = () => update([...items, ""]);
  const removeItem = (i: number) => update(items.filter((_, idx) => idx !== i));
  const updateItem = (i: number, val: string) => {
    const copy = [...items];
    copy[i] = val;
    update(copy);
  };

  return (
    <div className="space-y-3 p-3 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
      <div className="flex items-center justify-between">
        <Label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
          Frases de dolor ({items.length})
        </Label>
        <button
          onClick={addItem}
          className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <Plus className="h-3 w-3" /> Agregar
        </button>
      </div>

      {items.length === 0 && (
        <p className="text-zinc-600 text-xs text-center py-4">No hay frases. Haz clic en Agregar.</p>
      )}

      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <GripVertical className="h-3.5 w-3.5 text-zinc-600 flex-shrink-0" />
            <Input
              value={item}
              onChange={(e) => updateItem(i, e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white text-xs flex-1"
              placeholder={`Frase ${i + 1}`}
            />
            <button
              onClick={() => removeItem(i)}
              className="text-zinc-600 hover:text-red-400 transition-colors p-1"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
