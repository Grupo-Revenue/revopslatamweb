import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logoSrc from "@/assets/Logo_REVOPSLATAM_Blanco_color.png";

export default function AdminSetup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasAdmin, setHasAdmin] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if any admin already exists via edge function
    supabase.functions.invoke("check-admin-exists").then(({ data }) => {
      setHasAdmin(data?.exists ?? false);
    });
  }, []);

  if (hasAdmin === null) return null;
  if (hasAdmin) {
    navigate("/admin/login", { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error: fnError } = await supabase.functions.invoke("create-first-admin", {
      body: { email, password, displayName },
    });

    setLoading(false);
    if (fnError || data?.error) {
      setError(data?.error || fnError?.message || "Error al crear admin");
      return;
    }

    // Sign in with the new account
    await supabase.auth.signInWithPassword({ email, password });
    navigate("/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      <div className="w-full max-w-sm mx-auto p-8">
        <div className="flex justify-center mb-8">
          <img src={logoSrc} alt="RevOps LATAM" className="h-10" />
        </div>
        <h1 className="text-xl font-semibold text-white text-center mb-2">
          Configuración Inicial
        </h1>
        <p className="text-zinc-400 text-sm text-center mb-6">
          Crea tu cuenta de administrador
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-zinc-400 text-sm">Nombre</Label>
            <Input
              id="name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              className="bg-zinc-900 border-zinc-700 text-white mt-1"
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-zinc-400 text-sm">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-zinc-900 border-zinc-700 text-white mt-1"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-zinc-400 text-sm">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="bg-zinc-900 border-zinc-700 text-white mt-1"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700">
            {loading ? "Creando..." : "Crear cuenta admin"}
          </Button>
        </form>
      </div>
    </div>
  );
}
