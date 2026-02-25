import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Plus, Save, Trash2, GripVertical, ChevronDown, ChevronUp, Image } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import { toast } from "@/hooks/use-toast";

type SitePage = Tables<"site_pages">;
type PageSection = Tables<"page_sections">;

export default function AdminPageSections() {
  const { pageId } = useParams<{ pageId: string }>();
  const [page, setPage] = useState<SitePage | null>(null);
  const [sections, setSections] = useState<PageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [newSectionKey, setNewSectionKey] = useState("");

  useEffect(() => {
    if (!pageId) return;
    const fetchData = async () => {
      const [pageRes, sectionsRes] = await Promise.all([
        supabase.from("site_pages").select("*").eq("id", pageId).single(),
        supabase.from("page_sections").select("*").eq("page_id", pageId).order("sort_order"),
      ]);
      setPage(pageRes.data);
      setSections(sectionsRes.data ?? []);
      // Expand first section by default
      if (sectionsRes.data && sectionsRes.data.length > 0) {
        setExpandedSections(new Set([sectionsRes.data[0].id]));
      }
      setLoading(false);
    };
    fetchData();
  }, [pageId]);

  const toggleExpand = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const updateSectionLocal = (id: string, field: keyof PageSection, value: string | boolean | number) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const saveSection = async (section: PageSection) => {
    setSaving(section.id);
    const { error } = await supabase
      .from("page_sections")
      .update({
        title: section.title,
        subtitle: section.subtitle,
        body: section.body,
        cta_text: section.cta_text,
        cta_url: section.cta_url,
        image_url: section.image_url,
        background_image_url: section.background_image_url,
        is_visible: section.is_visible,
        sort_order: section.sort_order,
      })
      .eq("id", section.id);

    setSaving(null);
    if (error) {
      toast({ title: "Error al guardar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: `Sección "${section.section_key}" guardada` });
    }
  };

  const addSection = async () => {
    if (!newSectionKey.trim() || !pageId) return;
    const key = newSectionKey.trim().toLowerCase().replace(/\s+/g, "-");
    const { data, error } = await supabase
      .from("page_sections")
      .insert({
        page_id: pageId,
        section_key: key,
        sort_order: sections.length,
      })
      .select()
      .single();

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    if (data) {
      setSections((prev) => [...prev, data]);
      setExpandedSections((prev) => new Set([...prev, data.id]));
      setNewSectionKey("");
      toast({ title: `Sección "${key}" creada` });
    }
  };

  const deleteSection = async (section: PageSection) => {
    if (!confirm(`¿Eliminar la sección "${section.section_key}"?`)) return;
    const { error } = await supabase.from("page_sections").delete().eq("id", section.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    setSections((prev) => prev.filter((s) => s.id !== section.id));
    toast({ title: "Sección eliminada" });
  };

  if (loading) return <div className="text-zinc-400">Cargando...</div>;
  if (!page) return <div className="text-red-400">Página no encontrada</div>;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          to="/admin/pages"
          className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">{page.title}</h1>
          <p className="text-zinc-500 text-sm">{page.slug} — {sections.length} secciones</p>
        </div>
      </div>

      {/* Sections List */}
      <div className="space-y-3">
        {sections.map((section) => {
          const isExpanded = expandedSections.has(section.id);
          const isSaving = saving === section.id;
          return (
            <div
              key={section.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
            >
              {/* Section Header */}
              <button
                onClick={() => toggleExpand(section.id)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-800/50 transition-colors"
              >
                <GripVertical className="h-4 w-4 text-zinc-600 flex-shrink-0" />
                <span className="text-white font-medium flex-1 text-left">{section.section_key}</span>
                {!section.is_visible && (
                  <span className="text-xs bg-zinc-700 text-zinc-400 px-2 py-0.5 rounded">Oculta</span>
                )}
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-zinc-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-zinc-400" />
                )}
              </button>

              {/* Section Form */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-zinc-800 pt-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Left: Text fields */}
                    <div className="space-y-3">
                      <div>
                        <Label className="text-zinc-400 text-xs uppercase tracking-wider">Título</Label>
                        <Input
                          value={section.title ?? ""}
                          onChange={(e) => updateSectionLocal(section.id, "title", e.target.value)}
                          className="bg-zinc-800 border-zinc-700 text-white mt-1"
                          placeholder="Título de la sección"
                        />
                      </div>
                      <div>
                        <Label className="text-zinc-400 text-xs uppercase tracking-wider">Subtítulo</Label>
                        <Input
                          value={section.subtitle ?? ""}
                          onChange={(e) => updateSectionLocal(section.id, "subtitle", e.target.value)}
                          className="bg-zinc-800 border-zinc-700 text-white mt-1"
                          placeholder="Subtítulo"
                        />
                      </div>
                      <div>
                        <Label className="text-zinc-400 text-xs uppercase tracking-wider">Contenido</Label>
                        <Textarea
                          value={section.body ?? ""}
                          onChange={(e) => updateSectionLocal(section.id, "body", e.target.value)}
                          className="bg-zinc-800 border-zinc-700 text-white mt-1 min-h-[100px]"
                          placeholder="Texto del cuerpo de la sección"
                        />
                      </div>
                    </div>

                    {/* Right: CTA + Images */}
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-zinc-400 text-xs uppercase tracking-wider">Texto CTA</Label>
                          <Input
                            value={section.cta_text ?? ""}
                            onChange={(e) => updateSectionLocal(section.id, "cta_text", e.target.value)}
                            className="bg-zinc-800 border-zinc-700 text-white mt-1"
                            placeholder="Ej: Agendar llamada"
                          />
                        </div>
                        <div>
                          <Label className="text-zinc-400 text-xs uppercase tracking-wider">URL CTA</Label>
                          <Input
                            value={section.cta_url ?? ""}
                            onChange={(e) => updateSectionLocal(section.id, "cta_url", e.target.value)}
                            className="bg-zinc-800 border-zinc-700 text-white mt-1"
                            placeholder="https://..."
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-zinc-400 text-xs uppercase tracking-wider">
                          <Image className="h-3 w-3 inline mr-1" /> URL Imagen
                        </Label>
                        <Input
                          value={section.image_url ?? ""}
                          onChange={(e) => updateSectionLocal(section.id, "image_url", e.target.value)}
                          className="bg-zinc-800 border-zinc-700 text-white mt-1"
                          placeholder="URL de la imagen principal"
                        />
                        {section.image_url && (
                          <img
                            src={section.image_url}
                            alt="Preview"
                            className="mt-2 rounded-lg max-h-32 object-cover border border-zinc-700"
                          />
                        )}
                      </div>

                      <div>
                        <Label className="text-zinc-400 text-xs uppercase tracking-wider">
                          <Image className="h-3 w-3 inline mr-1" /> URL Fondo
                        </Label>
                        <Input
                          value={section.background_image_url ?? ""}
                          onChange={(e) => updateSectionLocal(section.id, "background_image_url", e.target.value)}
                          className="bg-zinc-800 border-zinc-700 text-white mt-1"
                          placeholder="URL de la imagen de fondo"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <Label className="text-zinc-400 text-sm">Visible</Label>
                        <Switch
                          checked={section.is_visible}
                          onCheckedChange={(v) => updateSectionLocal(section.id, "is_visible", v)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-800">
                    <button
                      onClick={() => deleteSection(section)}
                      className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Eliminar sección
                    </button>
                    <Button
                      onClick={() => saveSection(section)}
                      disabled={isSaving}
                      className="bg-emerald-600 hover:bg-emerald-700"
                      size="sm"
                    >
                      <Save className="h-4 w-4 mr-1.5" />
                      {isSaving ? "Guardando..." : "Guardar sección"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Section */}
      <div className="mt-4 flex items-center gap-2">
        <Input
          value={newSectionKey}
          onChange={(e) => setNewSectionKey(e.target.value)}
          placeholder="Nombre de nueva sección (ej: hero, about, cta)"
          className="bg-zinc-900 border-zinc-800 text-white max-w-xs"
          onKeyDown={(e) => e.key === "Enter" && addSection()}
        />
        <Button onClick={addSection} variant="outline" size="sm" className="border-zinc-700 text-zinc-300">
          <Plus className="h-4 w-4 mr-1" /> Agregar sección
        </Button>
      </div>
    </div>
  );
}
