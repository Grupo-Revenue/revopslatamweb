import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  ArrowLeft, Plus, Save, Trash2, GripVertical,
  ChevronDown, ChevronUp, Upload, X, Palette,
} from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import { toast } from "@/hooks/use-toast";
import {
  InlineStylePopover,
  BackgroundStyleControls,
} from "@/components/admin/SectionStyleEditor";

type SitePage = Tables<"site_pages">;
type PageSection = Tables<"page_sections">;

function ImageField({
  label,
  value,
  onChange,
  sectionId,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  sectionId: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `sections/${sectionId}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage.from("media").upload(path, file, {
      cacheControl: "3600",
      upsert: true,
    });

    if (error) {
      toast({ title: "Error al subir", description: error.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("media").getPublicUrl(path);
    onChange(urlData.publicUrl);
    setUploading(false);
    toast({ title: "Imagen subida" });
  };

  return (
    <div>
      <Label className="text-zinc-500 text-[10px] uppercase tracking-wider">{label}</Label>
      <div className="flex items-center gap-2 mt-1">
        {value ? (
          <div className="relative group">
            <img
              src={value}
              alt="Preview"
              className="h-14 w-20 object-cover rounded-md border border-zinc-700"
            />
            <button
              onClick={() => onChange("")}
              className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="h-14 w-20 rounded-md border border-dashed border-zinc-700 flex flex-col items-center justify-center text-zinc-500 hover:text-zinc-300 hover:border-zinc-500 transition-colors"
          >
            <Upload className="h-4 w-4" />
            <span className="text-[9px] mt-0.5">{uploading ? "Subiendo..." : "Subir"}</span>
          </button>
        )}
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="URL o sube un archivo"
          className="bg-zinc-800 border-zinc-700 text-white text-xs h-8 flex-1"
        />
        {value && (
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="text-zinc-500 hover:text-zinc-300 p-1"
            title="Cambiar imagen"
          >
            <Upload className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
}

function ClientLogosEditor({
  metadata,
  sectionId,
  onChange,
}: {
  metadata: Record<string, unknown>;
  sectionId: string;
  onChange: (m: Record<string, unknown>) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  // clients stored as array of { name, logo_url }
  const clients = ((metadata.clients_data as Array<{ name: string; logo_url: string }>) ?? []);

  const updateClients = (updated: Array<{ name: string; logo_url: string }>) => {
    // Also keep the flat "clients" array for backward compat
    onChange({
      ...metadata,
      clients_data: updated,
      clients: updated.map((c) => c.name),
    });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);

    const newClients = [...clients];
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `sections/${sectionId}/logos/${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${ext}`;
      const { error } = await supabase.storage.from("media").upload(path, file, {
        cacheControl: "3600",
        upsert: true,
      });
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        continue;
      }
      const { data: urlData } = supabase.storage.from("media").getPublicUrl(path);
      const name = file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
      newClients.push({ name, logo_url: urlData.publicUrl });
    }
    updateClients(newClients);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
    toast({ title: "Logos subidos" });
  };

  const removeClient = (index: number) => {
    updateClients(clients.filter((_, i) => i !== index));
  };

  const updateClientName = (index: number, name: string) => {
    const updated = [...clients];
    updated[index] = { ...updated[index], name };
    updateClients(updated);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <Label className="text-zinc-500 text-[10px] uppercase tracking-wider">Logos de Clientes</Label>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <Upload className="h-3 w-3" />
          {uploading ? "Subiendo..." : "Subir logos"}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleUpload}
      />

      {clients.length === 0 && (
        <div
          onClick={() => inputRef.current?.click()}
          className="border border-dashed border-zinc-700 rounded-lg p-6 text-center cursor-pointer hover:border-zinc-500 transition-colors"
        >
          <Upload className="h-6 w-6 mx-auto text-zinc-600 mb-2" />
          <p className="text-zinc-500 text-xs">Arrastra o haz clic para subir logos de clientes</p>
          <p className="text-zinc-600 text-[10px] mt-1">PNG, SVG o JPG recomendados</p>
        </div>
      )}

      {clients.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {clients.map((client, i) => (
            <div
              key={i}
              className="relative group bg-zinc-800 border border-zinc-700 rounded-lg p-2 flex flex-col items-center gap-1.5"
            >
              <button
                onClick={() => removeClient(i)}
                className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <X className="h-3 w-3" />
              </button>
              <img
                src={client.logo_url}
                alt={client.name}
                className="h-10 w-full object-contain"
              />
              <Input
                value={client.name}
                onChange={(e) => updateClientName(i, e.target.value)}
                className="bg-zinc-900 border-zinc-700 text-white text-[10px] h-6 px-1.5 text-center"
                placeholder="Nombre"
              />
            </div>
          ))}
          {/* Add more button */}
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="border border-dashed border-zinc-700 rounded-lg p-2 flex flex-col items-center justify-center text-zinc-500 hover:text-zinc-300 hover:border-zinc-500 transition-colors min-h-[72px]"
          >
            <Plus className="h-5 w-5" />
            <span className="text-[10px] mt-0.5">Agregar</span>
          </button>
        </div>
      )}
    </div>
  );
}


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

  const updateSectionLocal = (id: string, field: keyof PageSection, value: unknown) => {
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
        metadata: section.metadata,
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
      .insert({ page_id: pageId, section_key: key, sort_order: sections.length })
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

      {/* Sections */}
      <div className="space-y-3">
        {sections.map((section) => {
          const isExpanded = expandedSections.has(section.id);
          const isSaving = saving === section.id;
          const meta = (section.metadata as Record<string, unknown>) ?? {};

          return (
            <div
              key={section.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
            >
              {/* Section Header */}
              <div className="flex items-center">
                <button
                  onClick={() => toggleExpand(section.id)}
                  className="flex-1 flex items-center gap-3 px-4 py-3 hover:bg-zinc-800/50 transition-colors"
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
                {/* Quick save from header */}
                {isExpanded && (
                  <Button
                    onClick={() => saveSection(section)}
                    disabled={isSaving}
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 mr-3 h-7 text-xs"
                  >
                    <Save className="h-3 w-3 mr-1" />
                    {isSaving ? "..." : "Guardar"}
                  </Button>
                )}
              </div>

              {/* Section Editor — all inline, no tabs */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-zinc-800 pt-4 space-y-4">
                  {/* Row 1: Title with inline style */}
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      <Label className="text-zinc-500 text-[10px] uppercase tracking-wider">Título</Label>
                      <Input
                        value={section.title ?? ""}
                        onChange={(e) => updateSectionLocal(section.id, "title", e.target.value)}
                        className="bg-zinc-800 border-zinc-700 text-white mt-1 text-sm"
                        placeholder="Título de la sección"
                      />
                    </div>
                    <div className="pt-5">
                      <InlineStylePopover
                        elementKey="title"
                        metadata={meta}
                        onChange={(m) => updateSectionLocal(section.id, "metadata", m)}
                      />
                    </div>
                  </div>

                  {/* Row 2: Subtitle with inline style */}
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      <Label className="text-zinc-500 text-[10px] uppercase tracking-wider">Subtítulo</Label>
                      <Input
                        value={section.subtitle ?? ""}
                        onChange={(e) => updateSectionLocal(section.id, "subtitle", e.target.value)}
                        className="bg-zinc-800 border-zinc-700 text-white mt-1 text-sm"
                        placeholder="Subtítulo"
                      />
                    </div>
                    <div className="pt-5">
                      <InlineStylePopover
                        elementKey="subtitle"
                        metadata={meta}
                        onChange={(m) => updateSectionLocal(section.id, "metadata", m)}
                      />
                    </div>
                  </div>

                  {/* Row 3: Body with inline style */}
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      <Label className="text-zinc-500 text-[10px] uppercase tracking-wider">Contenido</Label>
                      <Textarea
                        value={section.body ?? ""}
                        onChange={(e) => updateSectionLocal(section.id, "body", e.target.value)}
                        className="bg-zinc-800 border-zinc-700 text-white mt-1 min-h-[80px] text-sm"
                        placeholder="Texto del cuerpo"
                      />
                    </div>
                    <div className="pt-5">
                      <InlineStylePopover
                        elementKey="body"
                        metadata={meta}
                        onChange={(m) => updateSectionLocal(section.id, "metadata", m)}
                      />
                    </div>
                  </div>

                  {/* Row 4: CTA row */}
                  <div className="flex items-start gap-2">
                    <div className="grid grid-cols-2 gap-2 flex-1">
                      <div>
                        <Label className="text-zinc-500 text-[10px] uppercase tracking-wider">Texto CTA</Label>
                        <Input
                          value={section.cta_text ?? ""}
                          onChange={(e) => updateSectionLocal(section.id, "cta_text", e.target.value)}
                          className="bg-zinc-800 border-zinc-700 text-white mt-1 text-sm"
                          placeholder="Ej: Agendar llamada"
                        />
                      </div>
                      <div>
                        <Label className="text-zinc-500 text-[10px] uppercase tracking-wider">URL CTA</Label>
                        <Input
                          value={section.cta_url ?? ""}
                          onChange={(e) => updateSectionLocal(section.id, "cta_url", e.target.value)}
                          className="bg-zinc-800 border-zinc-700 text-white mt-1 text-sm"
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                    <div className="pt-5">
                      <InlineStylePopover
                        elementKey="cta"
                        metadata={meta}
                        onChange={(m) => updateSectionLocal(section.id, "metadata", m)}
                      />
                    </div>
                  </div>

                  {/* Row 5: Images side by side */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <ImageField
                      label="Imagen principal"
                      value={section.image_url ?? ""}
                      onChange={(url) => updateSectionLocal(section.id, "image_url", url)}
                      sectionId={section.id}
                    />
                    <ImageField
                      label="Imagen de fondo"
                      value={section.background_image_url ?? ""}
                      onChange={(url) => updateSectionLocal(section.id, "background_image_url", url)}
                      sectionId={section.id}
                    />
                  </div>

                  {/* Client Logos Editor (only for client-logos section) */}
                  {section.section_key === "client-logos" && (
                    <ClientLogosEditor
                      metadata={meta}
                      sectionId={section.id}
                      onChange={(m) => updateSectionLocal(section.id, "metadata", m)}
                    />
                  )}

                  {/* Row 6: Background color/gradient */}
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Palette className="h-3 w-3 text-zinc-500" />
                      <Label className="text-zinc-500 text-[10px] uppercase tracking-wider">Fondo de sección</Label>
                    </div>
                    <BackgroundStyleControls
                      metadata={meta}
                      onChange={(m) => updateSectionLocal(section.id, "metadata", m)}
                    />
                  </div>

                  {/* Row 7: Visibility + Delete */}
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={section.is_visible}
                          onCheckedChange={(v) => updateSectionLocal(section.id, "is_visible", v)}
                        />
                        <span className="text-zinc-400 text-xs">Visible</span>
                      </div>
                      <button
                        onClick={() => deleteSection(section)}
                        className="flex items-center gap-1 text-xs text-zinc-600 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="h-3 w-3" /> Eliminar
                      </button>
                    </div>
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
          <Plus className="h-4 w-4 mr-1" /> Agregar
        </Button>
      </div>
    </div>
  );
}
