import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Search, Filter, Eye, RefreshCw, X, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";

interface Conversation {
  id: string;
  created_at: string;
  visitor_name: string | null;
  visitor_email: string | null;
  company: string | null;
  cargo: string | null;
  rubro: string | null;
  equipo_comercial: string | null;
  crm: string | null;
  problema_principal: string | null;
  score: number | null;
  flag: string | null;
  status: string | null;
  utm_source: string | null;
  utm_campaign: string | null;
  messages: any;
  summary: string | null;
  score_breakdown: any;
  hubspot_sync_status: string | null;
  hubspot_sync_error: string | null;
  hubspot_contact_id: string | null;
  meeting_booked: boolean | null;
  meeting_date: string | null;
  meeting_time: string | null;
  scheduled: boolean;
}

const FLAG_COLORS: Record<string, string> = {
  alta: "bg-green-100 text-green-700",
  media: "bg-yellow-100 text-yellow-700",
  baja: "bg-red-100 text-red-700",
  descartado_broker: "bg-gray-100 text-gray-700",
};

const STATUS_LABELS: Record<string, string> = {
  incompleto: "Incompleto",
  agendo: "Agendó",
  nurturing: "Nurturing",
  descartado: "Descartado",
};

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterFlag, setFilterFlag] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [page, setPage] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);
  const PER_PAGE = 25;

  const fetchConversations = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("conversations")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    setConversations((data as any[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchConversations(); }, []);

  const filtered = useMemo(() => {
    return conversations.filter((c) => {
      if (filterFlag && c.flag !== filterFlag) return false;
      const st = c.scheduled ? "agendo" : c.flag === "descartado_broker" ? "descartado" : c.flag === "baja" ? "nurturing" : (c.status || "incompleto");
      if (filterStatus && st !== filterStatus) return false;
      if (searchTerm) {
        const s = searchTerm.toLowerCase();
        if (
          !(c.visitor_name || "").toLowerCase().includes(s) &&
          !(c.visitor_email || "").toLowerCase().includes(s)
        ) return false;
      }
      return true;
    });
  }, [conversations, filterFlag, filterStatus, searchTerm]);

  const paged = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  // Metrics
  const now = new Date();
  const thisMonth = conversations.filter(c => {
    const d = new Date(c.created_at);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const totalThisMonth = thisMonth.length;
  const altaRate = totalThisMonth ? Math.round(thisMonth.filter(c => c.flag === "alta").length / totalThisMonth * 100) : 0;
  const schedRate = totalThisMonth ? Math.round(thisMonth.filter(c => c.scheduled).length / totalThisMonth * 100) : 0;
  const completionRate = totalThisMonth ? Math.round(thisMonth.filter(c => c.scheduled || c.status === "agendo" || c.status === "nurturing" || c.flag === "descartado_broker").length / totalThisMonth * 100) : 0;

  const getStatus = (c: Conversation) =>
    c.scheduled ? "agendo" : c.flag === "descartado_broker" ? "descartado" : c.flag === "baja" ? "nurturing" : (c.status || "incompleto");

  const toggleId = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === paged.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paged.map(c => c.id)));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;
    const confirmed = window.confirm(`¿Eliminar ${selectedIds.size} conversación(es)? Esta acción no se puede deshacer.`);
    if (!confirmed) return;

    setDeleting(true);
    const ids = Array.from(selectedIds);

    try {
      const storedCreds = localStorage.getItem("admin_agent_creds");
      if (!storedCreds) {
        alert("Sesión expirada. Vuelve a iniciar sesión en el admin-agent.");
        return;
      }

      const creds = JSON.parse(storedCreds);
      const { data, error } = await supabase.functions.invoke("delete-conversations", {
        body: {
          ids,
          username: creds.username,
          password: creds.password,
        },
      });

      if (error) {
        alert(`Error al eliminar: ${error.message}`);
        return;
      }

      if (!data?.success) {
        alert(`Error al eliminar: ${data?.error || "Error desconocido"}`);
        return;
      }

      setConversations((prev) => prev.filter((c) => !ids.includes(c.id)));
      setSelectedIds(new Set());

      if (selected?.id && ids.includes(selected.id)) {
        setSelected(null);
      }
    } catch (err: any) {
      alert(`Error al eliminar: ${err?.message || "desconocido"}`);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">📊 Conversaciones</h1>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total este mes", value: totalThisMonth },
          { label: "Tasa Alta", value: `${altaRate}%` },
          { label: "Tasa agendamiento", value: `${schedRate}%` },
          { label: "Tasa completación", value: `${completionRate}%` },
        ].map((m) => (
          <div key={m.label} className="bg-[#F8F8F8] rounded-xl p-4 border border-gray-100">
            <div className="text-2xl font-bold text-gray-900">{m.value}</div>
            <div className="text-xs text-gray-500 mt-1">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#BE1869]/30"
          />
        </div>
        <select
          value={filterFlag}
          onChange={(e) => { setFilterFlag(e.target.value); setPage(0); }}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Calificación</option>
          <option value="alta">Alta</option>
          <option value="media">Media</option>
          <option value="baja">Baja</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => { setFilterStatus(e.target.value); setPage(0); }}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Estado</option>
          <option value="agendo">Agendó</option>
          <option value="nurturing">Nurturing</option>
          <option value="descartado">Descartado</option>
          <option value="incompleto">Incompleto</option>
        </select>
        <button onClick={fetchConversations} className="p-2 hover:bg-gray-100 rounded-lg">
          <RefreshCw className="h-4 w-4 text-gray-500" />
        </button>
        {selectedIds.size > 0 && (
          <button
            onClick={handleDeleteSelected}
            disabled={deleting}
            className="flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            {deleting ? "Eliminando..." : `Eliminar (${selectedIds.size})`}
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#F8F8F8] border-b border-gray-200">
              <th className="px-3 py-2.5 w-8">
                <input
                  type="checkbox"
                  checked={paged.length > 0 && selectedIds.size === paged.length}
                  onChange={toggleAll}
                  className="rounded border-gray-300 text-[#BE1869] focus:ring-[#BE1869]/30"
                />
              </th>
              {["Fecha", "Nombre", "Email", "Empresa", "Cargo", "Rubro", "Equipo", "CRM", "Problema", "Score", "Calif.", "Estado", "Fuente", ""].map(h => (
                <th key={h} className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={15} className="text-center py-8 text-gray-400">Cargando...</td></tr>
            ) : paged.length === 0 ? (
              <tr><td colSpan={15} className="text-center py-8 text-gray-400">Sin resultados</td></tr>
            ) : paged.map((c) => (
              <tr key={c.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${selectedIds.has(c.id) ? "bg-red-50/50" : ""}`}>
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(c.id)}
                    onChange={() => toggleId(c.id)}
                    className="rounded border-gray-300 text-[#BE1869] focus:ring-[#BE1869]/30"
                  />
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600">
                  {format(new Date(c.created_at), "dd MMM HH:mm", { locale: es })}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-xs">{c.visitor_name || "—"}</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{c.visitor_email || "—"}</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs">{c.company || "—"}</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs">{c.cargo || "—"}</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs">{c.rubro || "—"}</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs">{c.equipo_comercial || "—"}</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs">{c.crm || "—"}</td>
                <td className="px-3 py-2 text-xs max-w-[120px] truncate">{c.problema_principal || "—"}</td>
                <td className="px-3 py-2 whitespace-nowrap text-xs font-medium">{c.score ?? "—"}</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {c.flag ? (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${FLAG_COLORS[c.flag] || "bg-gray-100 text-gray-600"}`}>
                      {c.flag === "descartado_broker" ? "Descartado" : c.flag.charAt(0).toUpperCase() + c.flag.slice(1)}
                    </span>
                  ) : "—"}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                  {STATUS_LABELS[getStatus(c)] || getStatus(c)}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-400">
                  {[c.utm_source, c.utm_campaign].filter(Boolean).join(" / ") || "—"}
                </td>
                <td className="px-3 py-2">
                  <button onClick={() => setSelected(c)} className="p-1 hover:bg-[#BE1869]/10 rounded text-[#BE1869]">
                    <Eye className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filtered.length > PER_PAGE && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{filtered.length} conversaciones</span>
          <div className="flex gap-2">
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="p-1 disabled:opacity-30"><ChevronLeft className="h-4 w-4" /></button>
            <span>Pág {page + 1} de {Math.ceil(filtered.length / PER_PAGE)}</span>
            <button disabled={(page + 1) * PER_PAGE >= filtered.length} onClick={() => setPage(p => p + 1)} className="p-1 disabled:opacity-30"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      )}

      {/* Detail Drawer */}
      {selected && <ConversationDrawer conversation={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function ConversationDrawer({ conversation: c, onClose }: { conversation: Conversation; onClose: () => void }) {
  const messages = Array.isArray(c.messages) ? c.messages : [];
  const [syncing, setSyncing] = useState(false);

  const handleResync = async () => {
    setSyncing(true);
    try {
      await fetch(
        `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/update-contact`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: c.visitor_email,
            properties: {
              nivel_del_cargo: c.cargo,
              company: c.company,
              rubro: c.rubro,
              cantidad_de_vendedores: c.equipo_comercial,
              cuenta_con_crm: c.crm,
              problema_principal: c.problema_principal,
              lead_score_ia: c.score,
            },
            createIfNotExists: false,
          }),
        }
      );
    } catch {}
    setSyncing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white shadow-2xl overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="font-semibold text-gray-900">Detalle de conversación</h2>
          <button onClick={onClose}><X className="h-5 w-5 text-gray-400" /></button>
        </div>
        <div className="p-6 space-y-6">
          {/* Properties */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              ["Nombre", c.visitor_name],
              ["Email", c.visitor_email],
              ["Empresa", c.company],
              ["Cargo", c.cargo],
              ["Rubro", c.rubro],
              ["Equipo", c.equipo_comercial],
              ["CRM", c.crm],
              ["Problema", c.problema_principal],
              ["Score", c.score],
              ["Calificación", c.flag],
              ["Reunión", c.meeting_date ? `${c.meeting_date} ${c.meeting_time || ""}` : "No"],
            ].map(([label, val]) => (
              <div key={label as string}>
                <span className="text-xs text-gray-400">{label as string}</span>
                <div className="text-gray-800 font-medium">{val as any || "—"}</div>
              </div>
            ))}
          </div>

          {/* HubSpot sync */}
          <div className="bg-[#F8F8F8] rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">Sincronización HubSpot</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                c.hubspot_sync_status === "synced" ? "bg-green-100 text-green-700" :
                c.hubspot_sync_status === "error" ? "bg-red-100 text-red-700" :
                "bg-yellow-100 text-yellow-700"
              }`}>
                {c.hubspot_sync_status || "pending"}
              </span>
            </div>
            {c.hubspot_sync_error && <p className="text-xs text-red-500">{c.hubspot_sync_error}</p>}
            {c.visitor_email && (
              <button
                onClick={handleResync}
                disabled={syncing}
                className="text-xs text-[#BE1869] hover:underline disabled:opacity-50"
              >
                {syncing ? "Sincronizando..." : "Sincronizar con HubSpot"}
              </button>
            )}
          </div>

          {/* Summary */}
          {c.summary && (
            <div>
              <h3 className="text-xs font-medium text-gray-500 mb-2">Resumen de Lidia</h3>
              <p className="text-sm text-gray-700 bg-[#F8F8F8] rounded-lg p-3 whitespace-pre-wrap">{c.summary}</p>
            </div>
          )}

          {/* Score breakdown */}
          {c.score_breakdown && typeof c.score_breakdown === "object" && Object.keys(c.score_breakdown).length > 0 && (
            <div>
              <h3 className="text-xs font-medium text-gray-500 mb-2">Desglose de Score</h3>
              <div className="space-y-1">
                {Object.entries(c.score_breakdown).map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm">
                    <span className="text-gray-600">{k}</span>
                    <span className="font-medium text-gray-800">{v as any} pts</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div>
            <h3 className="text-xs font-medium text-gray-500 mb-3">Conversación completa</h3>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {messages.map((m: any, i: number) => (
                <div key={i} className={`flex ${m.role === "assistant" ? "justify-start" : "justify-end"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                    m.role === "assistant"
                      ? "bg-[#F8F8F8] text-gray-800"
                      : "bg-[#BE1869] text-white"
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
