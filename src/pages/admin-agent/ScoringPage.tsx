import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Save, Loader2 } from "lucide-react";

interface ScoringCriteria {
  [key: string]: {
    label: string;
    options: Record<string, number>;
  };
}

export default function ScoringPage() {
  const [criteria, setCriteria] = useState<ScoringCriteria>({});
  const [thresholds, setThresholds] = useState({ alta: 65, media: 40 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("scoring_config")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1);
      if (data && data.length > 0) {
        setCriteria((data[0] as any).criteria || {});
        setThresholds((data[0] as any).thresholds || { alta: 65, media: 40 });
      }
      setLoading(false);
    };
    load();
  }, []);

  const updateScore = (criterionKey: string, optionKey: string, value: number) => {
    setCriteria((prev) => ({
      ...prev,
      [criterionKey]: {
        ...prev[criterionKey],
        options: { ...prev[criterionKey].options, [optionKey]: value },
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    await supabase.from("scoring_config").insert({
      criteria: criteria as any,
      thresholds: thresholds as any,
      created_by: "admin",
    } as any);
    await supabase.from("admin_logs").insert({
      action: "scoring_updated",
      changed_by: "admin",
      new_value: { criteria, thresholds } as any,
    } as any);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-gray-400" /></div>;

  const criteriaOrder = [
    "nivel_del_cargo",
    "rubro",
    "cantidad_de_vendedores",
    "cuenta_con_crm",
    "problema_principal__no_usan_crm",
    "problema_principal__usan_hubspot",
    "problema_principal",
  ];

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">⚙️ Lead Scoring</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-[#BE1869] text-white rounded-lg text-sm font-medium hover:bg-[#a01558] disabled:opacity-50 transition-colors"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saved ? "¡Guardado!" : "Guardar scoring"}
        </button>
      </div>

      {/* Thresholds */}
      <div className="bg-[#F8F8F8] rounded-xl p-6 border border-gray-100">
        <h2 className="font-semibold text-gray-900 mb-4">Umbrales de calificación</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500">Score mínimo ALTA</label>
            <input
              type="number"
              value={thresholds.alta}
              onChange={(e) => setThresholds((t) => ({ ...t, alta: Number(e.target.value) }))}
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Score mínimo MEDIA</label>
            <input
              type="number"
              value={thresholds.media}
              onChange={(e) => setThresholds((t) => ({ ...t, media: Number(e.target.value) }))}
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2">Debajo de {thresholds.media} → BAJA automático</p>
      </div>

      {/* Criteria */}
      {criteriaOrder.filter(k => criteria[k]).map((key) => {
        const c = criteria[key];
        return (
          <div key={key} className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-1">{c.label}</h3>
            <p className="text-xs text-gray-400 mb-4">Campo: {key}</p>
            <div className="space-y-2">
              {Object.entries(c.options).map(([option, pts]) => (
                <div key={option} className="flex items-center justify-between gap-4">
                  <span className="text-sm text-gray-700 flex-1">{option}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateScore(key, option, pts - 5)}
                      className="w-7 h-7 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 text-sm font-bold"
                    >−</button>
                    <input
                      type="number"
                      value={pts}
                      onChange={(e) => updateScore(key, option, Number(e.target.value))}
                      className="w-16 text-center border border-gray-200 rounded-lg py-1 text-sm"
                    />
                    <button
                      onClick={() => updateScore(key, option, pts + 5)}
                      className="w-7 h-7 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 text-sm font-bold"
                    >+</button>
                    <span className="text-xs text-gray-400 w-8">pts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
