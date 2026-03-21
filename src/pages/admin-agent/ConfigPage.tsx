import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Save, Loader2, Plus, X, Eye, EyeOff } from "lucide-react";

interface AgentConfig {
  agent_name: string;
  meeting_duration: number;
  schedule_start: string;
  schedule_end: string;
  timezone: string;
  working_days: string[];
  messages: Record<string, string>;
  discard_rules: { keyword: string; message: string; active: boolean }[];
  notifications: {
    email: string;
    slack_webhook: string;
    notify_alta_only: boolean;
    notify_all: boolean;
  };
}

const DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const MESSAGE_LABELS: Record<string, string> = {
  welcome_screen: "Mensaje de bienvenida (pantalla 0)",
  first_message: "Primer mensaje al iniciar conversación",
  availability_alta: "Mensaje disponibilidad (Alta)",
  availability_media: "Mensaje disponibilidad (Media)",
  nurturing: "Mensaje para leads no calificados",
  discard_broker: "Mensaje de descarte Broker",
  confirmation: "Mensaje de confirmación final",
};

const DEFAULT_CONFIG: AgentConfig = {
  agent_name: "Lidia",
  meeting_duration: 45,
  schedule_start: "09:00",
  schedule_end: "18:00",
  timezone: "America/Santiago",
  working_days: ["Lun", "Mar", "Mié", "Jue", "Vie"],
  messages: {},
  discard_rules: [],
  notifications: { email: "", slack_webhook: "", notify_alta_only: false, notify_all: true },
};

export default function ConfigPage() {
  const [config, setConfig] = useState<AgentConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showWebhook, setShowWebhook] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("agent_config")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1);
      if (data && data.length > 0) {
        setConfig({ ...DEFAULT_CONFIG, ...((data[0] as any).config || {}) });
      }
      setLoading(false);
    };
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await supabase.from("agent_config").insert({ config: config as any } as any);
    await supabase.from("admin_logs").insert({
      action: "agent_config_updated",
      changed_by: "admin",
      new_value: config as any,
    } as any);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleDay = (day: string) => {
    setConfig((c) => ({
      ...c,
      working_days: c.working_days.includes(day)
        ? c.working_days.filter((d) => d !== day)
        : [...c.working_days, day],
    }));
  };

  const updateMessage = (key: string, value: string) => {
    setConfig((c) => ({ ...c, messages: { ...c.messages, [key]: value } }));
  };

  const addDiscardRule = () => {
    setConfig((c) => ({
      ...c,
      discard_rules: [...c.discard_rules, { keyword: "", message: "", active: true }],
    }));
  };

  const removeDiscardRule = (index: number) => {
    setConfig((c) => ({
      ...c,
      discard_rules: c.discard_rules.filter((_, i) => i !== index),
    }));
  };

  const updateDiscardRule = (index: number, field: string, value: any) => {
    setConfig((c) => ({
      ...c,
      discard_rules: c.discard_rules.map((r, i) => i === index ? { ...r, [field]: value } : r),
    }));
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-gray-400" /></div>;

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">💬 Configuración del Agente</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-[#BE1869] text-white rounded-lg text-sm font-medium hover:bg-[#a01558] disabled:opacity-50 transition-colors"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saved ? "¡Guardado!" : "Guardar configuración"}
        </button>
      </div>

      {/* General */}
      <section className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Configuración General</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500">Nombre del agente</label>
            <input
              value={config.agent_name}
              onChange={(e) => setConfig({ ...config, agent_name: e.target.value })}
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Duración reunión (min)</label>
            <input
              type="number"
              value={config.meeting_duration}
              onChange={(e) => setConfig({ ...config, meeting_duration: Number(e.target.value) })}
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Horario inicio</label>
            <input
              type="time"
              value={config.schedule_start}
              onChange={(e) => setConfig({ ...config, schedule_start: e.target.value })}
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Horario fin</label>
            <input
              type="time"
              value={config.schedule_end}
              onChange={(e) => setConfig({ ...config, schedule_end: e.target.value })}
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Zona horaria</label>
            <input
              value={config.timezone}
              onChange={(e) => setConfig({ ...config, timezone: e.target.value })}
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-2 block">Días hábiles</label>
          <div className="flex gap-2">
            {DAYS.map((day) => (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  config.working_days.includes(day)
                    ? "bg-[#BE1869] text-white"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Messages */}
      <section className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Mensajes Editables</h2>
        {Object.entries(MESSAGE_LABELS).map(([key, label]) => (
          <div key={key}>
            <label className="text-xs text-gray-500">{label}</label>
            <textarea
              value={config.messages[key] || ""}
              onChange={(e) => updateMessage(key, e.target.value)}
              rows={3}
              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
              placeholder={`Escribe el ${label.toLowerCase()}...`}
            />
          </div>
        ))}
      </section>

      {/* Discard Rules */}
      <section className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Reglas de Descarte</h2>
          <button onClick={addDiscardRule} className="flex items-center gap-1 text-xs text-[#BE1869] hover:underline">
            <Plus className="h-3 w-3" /> Agregar regla
          </button>
        </div>
        {config.discard_rules.map((rule, i) => (
          <div key={i} className="border border-gray-100 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <input
                value={rule.keyword}
                onChange={(e) => updateDiscardRule(i, "keyword", e.target.value)}
                placeholder="Keyword o rubro..."
                className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
              />
              <div className="flex items-center gap-2 ml-3">
                <button
                  onClick={() => updateDiscardRule(i, "active", !rule.active)}
                  className={`text-xs px-2 py-0.5 rounded-full ${rule.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                >
                  {rule.active ? "Activo" : "Inactivo"}
                </button>
                <button onClick={() => removeDiscardRule(i)} className="text-red-400 hover:text-red-600">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <textarea
              value={rule.message}
              onChange={(e) => updateDiscardRule(i, "message", e.target.value)}
              placeholder="Mensaje de descarte personalizado..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
        ))}
      </section>

      {/* Notifications */}
      <section className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Notificaciones</h2>
        <div>
          <label className="text-xs text-gray-500">Email de notificación</label>
          <input
            type="email"
            value={config.notifications.email}
            onChange={(e) => setConfig({ ...config, notifications: { ...config.notifications, email: e.target.value } })}
            className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500">Slack Webhook URL</label>
          <div className="relative mt-1">
            <input
              type={showWebhook ? "text" : "password"}
              value={config.notifications.slack_webhook}
              onChange={(e) => setConfig({ ...config, notifications: { ...config.notifications, slack_webhook: e.target.value } })}
              className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg text-sm"
            />
            <button onClick={() => setShowWebhook(!showWebhook)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {showWebhook ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={config.notifications.notify_alta_only}
              onChange={(e) => setConfig({ ...config, notifications: { ...config.notifications, notify_alta_only: e.target.checked, notify_all: e.target.checked ? false : config.notifications.notify_all } })}
              className="rounded"
            />
            Solo leads Alta
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={config.notifications.notify_all}
              onChange={(e) => setConfig({ ...config, notifications: { ...config.notifications, notify_all: e.target.checked, notify_alta_only: e.target.checked ? false : config.notifications.notify_alta_only } })}
              className="rounded"
            />
            Todos los leads
          </label>
        </div>
      </section>
    </div>
  );
}
