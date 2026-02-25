import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Shield, ShieldCheck, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

interface UserRow {
  id: string;
  email: string;
  display_name: string | null;
  role: string;
  created_at: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", displayName: "", role: "editor" as string });

  const fetchUsers = async () => {
    const { data, error } = await supabase.functions.invoke("admin-list-users");
    if (data?.users) {
      setUsers(data.users);
    }
    if (error) {
      toast({ title: "Error cargando usuarios", description: error.message, variant: "destructive" });
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleCreate = async () => {
    if (!form.email || !form.password || form.password.length < 6) {
      toast({ title: "Error", description: "Email y contraseña (mín. 6 caracteres) son requeridos", variant: "destructive" });
      return;
    }
    setCreating(true);
    const { data, error } = await supabase.functions.invoke("admin-create-user", {
      body: { email: form.email, password: form.password, displayName: form.displayName, role: form.role },
    });
    setCreating(false);
    if (error || data?.error) {
      toast({ title: "Error", description: data?.error || error?.message, variant: "destructive" });
      return;
    }
    toast({ title: "Usuario creado", description: `${form.email} registrado como ${form.role}` });
    setDialogOpen(false);
    setForm({ email: "", password: "", displayName: "", role: "editor" });
    fetchUsers();
  };

  const handleDelete = async (user: UserRow) => {
    if (!confirm(`¿Eliminar al usuario "${user.email}"? Esta acción no se puede deshacer.`)) return;
    const { data, error } = await supabase.functions.invoke("admin-delete-user", {
      body: { userId: user.id },
    });
    if (error || data?.error) {
      toast({ title: "Error", description: data?.error || error?.message, variant: "destructive" });
      return;
    }
    toast({ title: "Usuario eliminado" });
    fetchUsers();
  };

  const handleChangeRole = async (user: UserRow, newRole: string) => {
    const { data, error } = await supabase.functions.invoke("admin-change-role", {
      body: { userId: user.id, role: newRole },
    });
    if (error || data?.error) {
      toast({ title: "Error", description: data?.error || error?.message, variant: "destructive" });
      return;
    }
    toast({ title: "Rol actualizado", description: `${user.email} ahora es ${newRole}` });
    fetchUsers();
  };

  const roleColor = (role: string) => {
    switch (role) {
      case "admin": return "text-emerald-400 bg-emerald-400/10";
      case "editor": return "text-blue-400 bg-blue-400/10";
      default: return "text-zinc-400 bg-zinc-400/10";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-zinc-400">
        <Loader2 className="h-4 w-4 animate-spin" /> Cargando usuarios...
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Usuarios</h1>
        <Button
          onClick={() => setDialogOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4 mr-2" /> Nuevo Usuario
        </Button>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-12 text-zinc-500">No hay usuarios registrados.</div>
      ) : (
        <div className="space-y-2">
          {users.map((u) => (
            <div
              key={u.id}
              className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium truncate">{u.display_name || u.email}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleColor(u.role)}`}>
                    {u.role}
                  </span>
                </div>
                <span className="text-zinc-500 text-sm">{u.email}</span>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {u.role !== "admin" && (
                  <button
                    onClick={() => handleChangeRole(u, "admin")}
                    className="p-2 rounded-lg text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800 transition-colors"
                    title="Hacer admin"
                  >
                    <ShieldCheck className="h-4 w-4" />
                  </button>
                )}
                {u.role === "admin" && (
                  <button
                    onClick={() => handleChangeRole(u, "editor")}
                    className="p-2 rounded-lg text-zinc-400 hover:text-blue-400 hover:bg-zinc-800 transition-colors"
                    title="Cambiar a editor"
                  >
                    <Shield className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(u)}
                  className="p-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-colors"
                  title="Eliminar usuario"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create User Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Nuevo Usuario</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-zinc-400 text-sm">Nombre</Label>
              <Input
                value={form.displayName}
                onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
                className="bg-zinc-800 border-zinc-700 text-white mt-1"
                placeholder="Nombre del usuario"
              />
            </div>
            <div>
              <Label className="text-zinc-400 text-sm">Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="bg-zinc-800 border-zinc-700 text-white mt-1"
                placeholder="usuario@ejemplo.com"
                required
              />
            </div>
            <div>
              <Label className="text-zinc-400 text-sm">Contraseña</Label>
              <Input
                type="password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className="bg-zinc-800 border-zinc-700 text-white mt-1"
                placeholder="Mínimo 6 caracteres"
                minLength={6}
                required
              />
            </div>
            <div>
              <Label className="text-zinc-400 text-sm">Rol</Label>
              <select
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm mt-1"
              >
                <option value="editor">Editor</option>
                <option value="admin">Administrador</option>
                <option value="user">Usuario</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)} className="text-zinc-400">
              Cancelar
            </Button>
            <Button onClick={handleCreate} disabled={creating} className="bg-emerald-600 hover:bg-emerald-700">
              {creating ? "Creando..." : "Crear Usuario"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
