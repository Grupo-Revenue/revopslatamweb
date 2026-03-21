import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit2, Trash2, Loader2, X, Save } from "lucide-react";
import { format } from "date-fns";

interface KBDoc {
  id: string;
  name: string;
  category: string;
  content: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const CATEGORIES = ["Servicios", "Precios", "FAQs", "Empresa", "Otro"];

export default function KnowledgePage() {
  const [docs, setDocs] = useState<KBDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<KBDoc> | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchDocs = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("knowledge_base")
      .select("*")
      .order("created_at", { ascending: true });
    setDocs((data as any[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchDocs(); }, []);

  const handleSave = async () => {
    if (!editing?.name || !editing?.content) return;
    setSaving(true);
    if (editing.id) {
      await supabase.from("knowledge_base").update({
        name: editing.name,
        category: editing.category || "Otro",
        content: editing.content,
        is_active: editing.is_active ?? true,
        updated_at: new Date().toISOString(),
      } as any).eq("id", editing.id);
    } else {
      await supabase.from("knowledge_base").insert({
        name: editing.name,
        category: editing.category || "Otro",
        content: editing.content,
        is_active: editing.is_active ?? true,
      } as any);
    }
    await supabase.from("admin_logs").insert({
      action: editing.id ? "knowledge_updated" : "knowledge_created",
      changed_by: "admin",
      new_value: { name: editing.name } as any,
    } as any);
    setSaving(false);
    setEditing(null);
    fetchDocs();
  };

  const handleToggle = async (doc: KBDoc) => {
    await supabase.from("knowledge_base").update({ is_active: !doc.is_active } as any).eq("id", doc.id);
    fetchDocs();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este documento?")) return;
    await supabase.from("knowledge_base").delete().eq("id", id);
    fetchDocs();
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-gray-400" /></div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">🧠 Base de Conocimiento</h1>
        <button
          onClick={() => setEditing({ name: "", category: "Otro", content: "", is_active: true })}
          className="flex items-center gap-2 px-4 py-2 bg-[#BE1869] text-white rounded-lg text-sm font-medium hover:bg-[#a01558] transition-colors"
        >
          <Plus className="h-4 w-4" /> Agregar documento
        </button>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#F8F8F8] border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Nombre</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Categoría</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 hidden md:table-cell">Actualizado</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Estado</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {docs.map((doc) => (
              <tr key={doc.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{doc.name}</td>
                <td className="px-4 py-3 text-gray-500">{doc.category}</td>
                <td className="px-4 py-3 text-gray-400 text-xs hidden md:table-cell">{format(new Date(doc.updated_at), "dd/MM/yyyy")}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggle(doc)}
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${doc.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                  >
                    {doc.is_active ? "Activo" : "Inactivo"}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => setEditing(doc)} className="p-1.5 hover:bg-gray-100 rounded text-gray-500"><Edit2 className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(doc.id)} className="p-1.5 hover:bg-red-50 rounded text-red-400"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setEditing(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">{editing.id ? "Editar" : "Agregar"} documento</h2>
              <button onClick={() => setEditing(null)}><X className="h-5 w-5 text-gray-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs text-gray-500">Nombre</label>
                <input
                  value={editing.name || ""}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Categoría</label>
                <select
                  value={editing.category || "Otro"}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                >
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500">Contenido (texto o markdown)</label>
                <textarea
                  value={editing.content || ""}
                  onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                  rows={12}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editing.is_active ?? true}
                  onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })}
                  className="rounded"
                />
                <label className="text-sm text-gray-600">Documento activo</label>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button onClick={() => setEditing(null)} className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-lg">Cancelar</button>
              <button
                onClick={handleSave}
                disabled={saving || !editing.name || !editing.content}
                className="flex items-center gap-2 px-4 py-2 bg-[#BE1869] text-white rounded-lg text-sm font-medium disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
