import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Eye, EyeOff, GripVertical } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

type SitePage = Tables<"site_pages">;

export default function AdminPages() {
  const [pages, setPages] = useState<SitePage[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<SitePage | null>(null);
  const [form, setForm] = useState({ title: "", slug: "", meta_description: "", is_published: true, sort_order: 0 });

  const fetchPages = async () => {
    const { data } = await supabase
      .from("site_pages")
      .select("*")
      .order("sort_order", { ascending: true });
    setPages(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchPages(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ title: "", slug: "", meta_description: "", is_published: true, sort_order: pages.length });
    setDialogOpen(true);
  };

  const openEdit = (page: SitePage) => {
    setEditing(page);
    setForm({
      title: page.title,
      slug: page.slug,
      meta_description: page.meta_description ?? "",
      is_published: page.is_published,
      sort_order: page.sort_order,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.slug) {
      toast({ title: "Error", description: "Título y slug son requeridos", variant: "destructive" });
      return;
    }

    if (editing) {
      const { error } = await supabase
        .from("site_pages")
        .update({
          title: form.title,
          slug: form.slug,
          meta_description: form.meta_description || null,
          is_published: form.is_published,
          sort_order: form.sort_order,
        })
        .eq("id", editing.id);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return;
      }
      toast({ title: "Página actualizada" });
    } else {
      const { error } = await supabase
        .from("site_pages")
        .insert({
          title: form.title,
          slug: form.slug,
          meta_description: form.meta_description || null,
          is_published: form.is_published,
          sort_order: form.sort_order,
        });
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return;
      }
      toast({ title: "Página creada" });
    }
    setDialogOpen(false);
    fetchPages();
  };

  const handleDelete = async (page: SitePage) => {
    if (!confirm(`¿Eliminar "${page.title}"? Esto también eliminará todas sus secciones.`)) return;
    const { error } = await supabase.from("site_pages").delete().eq("id", page.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Página eliminada" });
    fetchPages();
  };

  const togglePublished = async (page: SitePage) => {
    await supabase.from("site_pages").update({ is_published: !page.is_published }).eq("id", page.id);
    fetchPages();
  };

  const generateSlug = (title: string) => {
    return "/" + title
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  if (loading) return <div className="text-zinc-400">Cargando...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Páginas</h1>
        <Button onClick={openCreate} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4 mr-2" /> Nueva Página
        </Button>
      </div>

      {pages.length === 0 ? (
        <div className="text-center py-12 text-zinc-500">
          <p>No hay páginas aún. Crea la primera.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {pages.map((page) => (
            <div
              key={page.id}
              className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3"
            >
              <GripVertical className="h-4 w-4 text-zinc-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium truncate">{page.title}</span>
                  {!page.is_published && (
                    <span className="text-xs bg-zinc-700 text-zinc-400 px-2 py-0.5 rounded">Borrador</span>
                  )}
                </div>
                <span className="text-zinc-500 text-sm">{page.slug}</span>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => togglePublished(page)}
                  className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                  title={page.is_published ? "Ocultar" : "Publicar"}
                >
                  {page.is_published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <Link
                  to={`/admin/pages/${page.id}`}
                  className="p-2 rounded-lg text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800 transition-colors"
                  title="Editar secciones"
                >
                  <Pencil className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => openEdit(page)}
                  className="p-2 rounded-lg text-zinc-400 hover:text-blue-400 hover:bg-zinc-800 transition-colors"
                  title="Editar datos"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(page)}
                  className="p-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-colors"
                  title="Eliminar"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Página" : "Nueva Página"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-zinc-400 text-sm">Título</Label>
              <Input
                value={form.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setForm((f) => ({
                    ...f,
                    title,
                    ...(!editing ? { slug: generateSlug(title) } : {}),
                  }));
                }}
                className="bg-zinc-800 border-zinc-700 text-white mt-1"
                placeholder="Nombre de la página"
              />
            </div>
            <div>
              <Label className="text-zinc-400 text-sm">Slug (URL)</Label>
              <Input
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                className="bg-zinc-800 border-zinc-700 text-white mt-1"
                placeholder="/mi-pagina"
              />
            </div>
            <div>
              <Label className="text-zinc-400 text-sm">Meta descripción</Label>
              <Input
                value={form.meta_description}
                onChange={(e) => setForm((f) => ({ ...f, meta_description: e.target.value }))}
                className="bg-zinc-800 border-zinc-700 text-white mt-1"
                placeholder="Descripción para SEO"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-zinc-400 text-sm">Publicada</Label>
              <Switch
                checked={form.is_published}
                onCheckedChange={(v) => setForm((f) => ({ ...f, is_published: v }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)} className="text-zinc-400">
              Cancelar
            </Button>
            <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
              {editing ? "Guardar" : "Crear"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
