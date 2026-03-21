import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoSrc from "@/assets/Isotipo_color.svg";

export default function AdminAgentLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(
        `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/admin-agent-auth`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("admin_agent_token", data.token);
        localStorage.setItem("admin_agent_expires", String(data.expiresAt));
        navigate("/admin-agent");
      } else {
        setError(data.error || "Credenciales inválidas");
      }
    } catch {
      setError("Error de conexión");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-sm mx-auto p-8">
        <div className="flex justify-center mb-8">
          <img src={logoSrc} alt="RevOps LATAM" className="h-12" />
        </div>
        <h1 className="text-xl font-semibold text-gray-900 text-center mb-6 font-['Lexend']">
          Panel del Agente
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-gray-600 text-sm font-['Lexend']">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#BE1869] font-['Lexend']"
            />
          </div>
          <div>
            <label className="text-gray-600 text-sm font-['Lexend']">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#BE1869] font-['Lexend']"
            />
          </div>
          {error && <p className="text-red-500 text-sm font-['Lexend']">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#BE1869] text-white rounded-lg font-semibold text-sm hover:bg-[#a01558] transition-colors font-['Lexend'] disabled:opacity-50"
          >
            {loading ? "Ingresando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
