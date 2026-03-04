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
import { useCTAStyles } from "@/hooks/useCTAStyles";
import MethodologyEditor from "@/components/admin/MethodologyEditor";
import TestimonialsEditor from "@/components/admin/TestimonialsEditor";
import PainsEditor from "@/components/admin/PainsEditor";
import SolutionsEditor from "@/components/admin/SolutionsEditor";

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

function CertificationsEditor({
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

  const certs = (metadata.certifications as Array<{ name: string; image_url: string }>) ?? [];

  const updateCerts = (updated: Array<{ name: string; image_url: string }>) => {
    onChange({ ...metadata, certifications: updated });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);

    const newCerts = [...certs];
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `sections/${sectionId}/certs/${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${ext}`;
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
      newCerts.push({ name, image_url: urlData.publicUrl });
    }
    updateCerts(newCerts);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
    toast({ title: "Certificaciones subidas" });
  };

  const removeCert = (index: number) => {
    updateCerts(certs.filter((_, i) => i !== index));
  };

  const updateCertName = (index: number, name: string) => {
    const updated = [...certs];
    updated[index] = { ...updated[index], name };
    updateCerts(updated);
  };

  return (
    <div className="space-y-3 p-3 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
      <div className="flex items-center justify-between">
        <Label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Certificaciones (carrusel)</Label>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <Upload className="h-3 w-3" />
          {uploading ? "Subiendo..." : "Subir certificaciones"}
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

      {certs.length === 0 && (
        <div
          onClick={() => inputRef.current?.click()}
          className="border border-dashed border-zinc-700 rounded-lg p-6 text-center cursor-pointer hover:border-zinc-500 transition-colors"
        >
          <Upload className="h-6 w-6 mx-auto text-zinc-600 mb-2" />
          <p className="text-zinc-500 text-xs">Sube imágenes de las certificaciones HubSpot</p>
          <p className="text-zinc-600 text-[10px] mt-1">PNG o SVG recomendados</p>
        </div>
      )}

      {certs.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {certs.map((cert, i) => (
            <div
              key={i}
              className="relative group bg-zinc-800 border border-zinc-700 rounded-lg p-2 flex flex-col items-center gap-1.5"
            >
              <button
                onClick={() => removeCert(i)}
                className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <X className="h-3 w-3" />
              </button>
              <img
                src={cert.image_url}
                alt={cert.name}
                className="h-12 w-full object-contain"
              />
              <Input
                value={cert.name}
                onChange={(e) => updateCertName(i, e.target.value)}
                className="bg-zinc-900 border-zinc-700 text-white text-[10px] h-6 px-1.5 text-center"
                placeholder="Nombre"
              />
            </div>
          ))}
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
  const { ctaStyles } = useCTAStyles();

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

                  {/* Title gradient text & line break (hero controls) */}
                  <div className="grid grid-cols-3 gap-2 p-3 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
                    <div>
                      <Label className="text-zinc-500 text-[10px] uppercase tracking-wider">Texto con gradiente</Label>
                      <Input
                        value={(meta.title_gradient_text as string) ?? ""}
                        onChange={(e) => updateSectionLocal(section.id, "metadata", { ...meta, title_gradient_text: e.target.value })}
                        className="bg-zinc-800 border-zinc-700 text-white mt-1 text-sm"
                        placeholder="Ej: Arquitectos del Revenue"
                      />
                      <p className="text-zinc-600 text-[10px] mt-0.5">Parte del título que tendrá gradiente</p>
                    </div>
                    <div>
                      <Label className="text-zinc-500 text-[10px] uppercase tracking-wider">CSS Gradiente</Label>
                      <Input
                        value={(meta.title_gradient as string) ?? ""}
                        onChange={(e) => updateSectionLocal(section.id, "metadata", { ...meta, title_gradient: e.target.value })}
                        className="bg-zinc-800 border-zinc-700 text-white mt-1 text-sm"
                        placeholder="linear-gradient(90deg, #BE1869, #6224BE)"
                      />
                      <p className="text-zinc-600 text-[10px] mt-0.5">Gradiente CSS para el texto destacado</p>
                    </div>
                    <div>
                      <Label className="text-zinc-500 text-[10px] uppercase tracking-wider">Salto de línea después de</Label>
                      <Input
                        value={(meta.title_line_break as string) ?? ""}
                        onChange={(e) => updateSectionLocal(section.id, "metadata", { ...meta, title_line_break: e.target.value })}
                        className="bg-zinc-800 border-zinc-700 text-white mt-1 text-sm"
                        placeholder="Ej: Revenue."
                      />
                      <p className="text-zinc-600 text-[10px] mt-0.5">Texto tras el cual se fuerza salto de línea</p>
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

                  {/* Body as bullet list toggle */}
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={!!(meta.body_as_list)}
                      onCheckedChange={(v) => updateSectionLocal(section.id, "metadata", { ...meta, body_as_list: v })}
                    />
                    <Label className="text-zinc-400 text-xs">Mostrar contenido como viñetas (separar por líneas)</Label>
                  </div>

                  {/* Row 4: CTA row */}
                  <div className="flex items-start gap-2">
                    <div className="grid grid-cols-3 gap-2 flex-1">
                      <div>
                        <Label className="text-zinc-500 text-[10px] uppercase tracking-wider">Texto CTA 1</Label>
                        <Input
                          value={section.cta_text ?? ""}
                          onChange={(e) => updateSectionLocal(section.id, "cta_text", e.target.value)}
                          className="bg-zinc-800 border-zinc-700 text-white mt-1 text-sm"
                          placeholder="Ej: Descubre dónde se pierde tu revenue"
                        />
                      </div>
                      <div>
                        <Label className="text-zinc-500 text-[10px] uppercase tracking-wider">URL CTA 1</Label>
                        <Input
                          value={section.cta_url ?? ""}
                          onChange={(e) => updateSectionLocal(section.id, "cta_url", e.target.value)}
                          className="bg-zinc-800 border-zinc-700 text-white mt-1 text-sm"
                          placeholder="https://..."
                        />
                      </div>
                      <div>
                        <Label className="text-zinc-500 text-[10px] uppercase tracking-wider">Estilo CTA 1</Label>
                        <select
                          value={(meta.cta_style_key as string) ?? ""}
                          onChange={(e) => updateSectionLocal(section.id, "metadata", { ...meta, cta_style_key: e.target.value || undefined })}
                          className="w-full mt-1 bg-zinc-800 border border-zinc-700 text-white rounded px-2 py-2 text-sm"
                        >
                          <option value="">— Sin estilo —</option>
                          {ctaStyles.map((cs) => (
                            <option key={cs.style_key} value={cs.style_key}>{cs.label}</option>
                          ))}
                        </select>
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

                  {/* Row 4b: CTA 2 row */}
                  <div className="flex items-start gap-2">
                    <div className="grid grid-cols-3 gap-2 flex-1">
                      <div>
                        <Label className="text-zinc-500 text-[10px] uppercase tracking-wider">Texto CTA 2</Label>
                        <Input
                          value={(meta.cta2_text as string) ?? ""}
                          onChange={(e) => updateSectionLocal(section.id, "metadata", { ...meta, cta2_text: e.target.value })}
                          className="bg-zinc-800 border-zinc-700 text-white mt-1 text-sm"
                          placeholder="Ej: Agenda una conversación"
                        />
                      </div>
                      <div>
                        <Label className="text-zinc-500 text-[10px] uppercase tracking-wider">URL CTA 2</Label>
                        <Input
                          value={(meta.cta2_url as string) ?? ""}
                          onChange={(e) => updateSectionLocal(section.id, "metadata", { ...meta, cta2_url: e.target.value })}
                          className="bg-zinc-800 border-zinc-700 text-white mt-1 text-sm"
                          placeholder="https://..."
                        />
                      </div>
                      <div>
                        <Label className="text-zinc-500 text-[10px] uppercase tracking-wider">Estilo CTA 2</Label>
                        <select
                          value={(meta.cta2_style_key as string) ?? ""}
                          onChange={(e) => updateSectionLocal(section.id, "metadata", { ...meta, cta2_style_key: e.target.value || undefined })}
                          className="w-full mt-1 bg-zinc-800 border border-zinc-700 text-white rounded px-2 py-2 text-sm"
                        >
                          <option value="">— Sin estilo —</option>
                          {ctaStyles.map((cs) => (
                            <option key={cs.style_key} value={cs.style_key}>{cs.label}</option>
                          ))}
                        </select>
                      </div>
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

                  {/* Background options row */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={meta.parallax === true}
                        onCheckedChange={(v) => updateSectionLocal(section.id, "metadata", { ...meta, parallax: v })}
                      />
                      <span className="text-zinc-400 text-xs">Parallax</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-zinc-500 text-[10px] uppercase">Opacidad fondo</Label>
                      <Input
                        type="number"
                        min={0}
                        max={1}
                        step={0.1}
                        value={typeof meta.bg_opacity === "number" ? meta.bg_opacity : 1}
                        onChange={(e) => updateSectionLocal(section.id, "metadata", { ...meta, bg_opacity: parseFloat(e.target.value) || 1 })}
                        className="bg-zinc-800 border-zinc-700 text-white text-xs h-7 w-16 px-2"
                      />
                    </div>
                  </div>

                  {/* Client Logos Editor (only for client-logos section) */}
                  {section.section_key === "client-logos" && (
                    <ClientLogosEditor
                      metadata={meta}
                      sectionId={section.id}
                      onChange={(m) => updateSectionLocal(section.id, "metadata", m)}
                    />
                  )}

                  {/* Credibility Certifications Editor */}
                  {section.section_key === "credibility" && (
                    <CertificationsEditor
                      metadata={meta}
                      sectionId={section.id}
                      onChange={(m) => updateSectionLocal(section.id, "metadata", m)}
                    />
                  )}

                  {/* Methodology Editor */}
                  {section.section_key === "methodology" && (
                    <MethodologyEditor
                      metadata={meta}
                      onChange={(m) => updateSectionLocal(section.id, "metadata", m)}
                    />
                  )}

                  {/* Testimonials Editor */}
                  {section.section_key === "testimonials" && (
                    <TestimonialsEditor
                      metadata={meta}
                      onChange={(m) => updateSectionLocal(section.id, "metadata", m)}
                    />
                  )}

                  {/* Pains Editor */}
                  {section.section_key === "pains" && (
                    <PainsEditor
                      metadata={meta}
                      onChange={(m) => updateSectionLocal(section.id, "metadata", m)}
                    />
                  )}

                  {/* Solutions Editor */}
                  {section.section_key === "solutions" && (
                    <SolutionsEditor
                      metadata={meta}
                      onChange={(m) => updateSectionLocal(section.id, "metadata", m)}
                    />
                  )}

                  {/* Gradient text & badge (for hero/text sections) */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-zinc-500 text-[10px] uppercase tracking-wider">Texto con gradiente</Label>
                      <Input
                        value={(meta.gradient_text as string) ?? ""}
                        onChange={(e) => updateSectionLocal(section.id, "metadata", { ...meta, gradient_text: e.target.value || undefined })}
                        className="bg-zinc-800 border-zinc-700 text-white mt-1 text-sm"
                        placeholder="Parte del título que lleva gradiente"
                      />
                    </div>
                    <div>
                      <Label className="text-zinc-500 text-[10px] uppercase tracking-wider">Badge / Etiqueta</Label>
                      <Input
                        value={(meta.badge as string) ?? ""}
                        onChange={(e) => updateSectionLocal(section.id, "metadata", { ...meta, badge: e.target.value || undefined })}
                        className="bg-zinc-800 border-zinc-700 text-white mt-1 text-sm"
                        placeholder="Ej: Quiénes somos"
                      />
                    </div>
                  </div>

                  {/* Symptoms Closing Block Editor */}
                  {section.section_key === "symptoms" && (
                    <div className="space-y-3 p-3 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
                      <Label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Bloque de cierre</Label>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-zinc-500 text-[10px] uppercase">Línea 1</Label>
                          <Input
                            value={(meta.closing_line1 as string) ?? ""}
                            onChange={(e) => updateSectionLocal(section.id, "metadata", { ...meta, closing_line1: e.target.value || undefined })}
                            className="bg-zinc-800 border-zinc-700 text-white text-xs mt-0.5"
                            placeholder="No es un problema de talento."
                          />
                        </div>
                        <div>
                          <Label className="text-zinc-500 text-[10px] uppercase">Línea 2 (bold)</Label>
                          <Input
                            value={(meta.closing_line2 as string) ?? ""}
                            onChange={(e) => updateSectionLocal(section.id, "metadata", { ...meta, closing_line2: e.target.value || undefined })}
                            className="bg-zinc-800 border-zinc-700 text-white text-xs mt-0.5"
                            placeholder="Es un problema de sistema."
                          />
                        </div>
                      </div>

                      <ImageField
                        label="Imagen de fondo del bloque"
                        value={(meta.closing_bg_image as string) ?? ""}
                        onChange={(url) => updateSectionLocal(section.id, "metadata", { ...meta, closing_bg_image: url || undefined })}
                        sectionId={section.id}
                      />

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-zinc-500 text-[10px] uppercase">Color de fondo</Label>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <input
                              type="color"
                              value={(meta.closing_bg_color as string) || "#0D0D1A"}
                              onChange={(e) => updateSectionLocal(section.id, "metadata", { ...meta, closing_bg_color: e.target.value })}
                              className="w-6 h-6 rounded border border-zinc-700 cursor-pointer bg-transparent flex-shrink-0"
                            />
                            <Input
                              value={(meta.closing_bg_color as string) ?? ""}
                              onChange={(e) => updateSectionLocal(section.id, "metadata", { ...meta, closing_bg_color: e.target.value || undefined })}
                              placeholder="#0D0D1A"
                              className="bg-zinc-800 border-zinc-700 text-white text-xs h-7 px-2"
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="text-zinc-500 text-[10px] uppercase">Opacidad imagen</Label>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <Input
                              type="number"
                              min={0}
                              max={1}
                              step={0.05}
                              value={typeof meta.closing_bg_opacity === "number" ? meta.closing_bg_opacity : 1}
                              onChange={(e) => updateSectionLocal(section.id, "metadata", { ...meta, closing_bg_opacity: parseFloat(e.target.value) || 1 })}
                              className="bg-zinc-800 border-zinc-700 text-white text-xs h-7 w-20 px-2"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label className="text-zinc-500 text-[10px] uppercase">Gradiente de fondo</Label>
                        <Input
                          value={(meta.closing_gradient as string) ?? ""}
                          onChange={(e) => updateSectionLocal(section.id, "metadata", { ...meta, closing_gradient: e.target.value || undefined })}
                          placeholder="linear-gradient(135deg, #0D0D1A 0%, #1a1a3e 50%, #0D0D1A 100%)"
                          className="bg-zinc-800 border-zinc-700 text-white text-xs mt-0.5"
                        />
                        {(meta.closing_gradient as string) && (
                          <div
                            className="mt-1.5 h-6 rounded border border-zinc-700"
                            style={{ background: meta.closing_gradient as string }}
                          />
                        )}
                      </div>
                    </div>
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

                  {/* Row 6b: Card background color */}
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Palette className="h-3 w-3 text-zinc-500" />
                      <Label className="text-zinc-500 text-[10px] uppercase tracking-wider">Color de card (si aplica)</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={(meta.card_bg as string) || "#13132A"}
                        onChange={(e) => updateSectionLocal(section.id, "metadata", { ...meta, card_bg: e.target.value })}
                        className="w-10 h-10 rounded-lg cursor-pointer border border-zinc-700 bg-transparent"
                      />
                      <Input
                        value={(meta.card_bg as string) ?? ""}
                        onChange={(e) => updateSectionLocal(section.id, "metadata", { ...meta, card_bg: e.target.value || undefined })}
                        className="bg-zinc-800 border-zinc-700 text-white font-mono text-sm max-w-[140px]"
                        placeholder="#13132A"
                      />
                      {(meta.card_bg as string) && (
                        <button
                          onClick={() => {
                            const { card_bg, ...rest } = meta;
                            updateSectionLocal(section.id, "metadata", rest);
                          }}
                          className="text-xs text-zinc-500 hover:text-red-400"
                        >
                          Resetear
                        </button>
                      )}
                    </div>
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
