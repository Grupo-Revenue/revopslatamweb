import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LayoutDashboard, FileText, Palette, Image, Users, LogOut, Loader2 } from "lucide-react";
import logoSrc from "@/assets/Isotipo_blanco.svg";

const navItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { to: "/admin/pages", icon: FileText, label: "Páginas" },
  { to: "/admin/styles", icon: Palette, label: "Estilos" },
  { to: "/admin/media", icon: Image, label: "Media" },
  { to: "/admin/users", icon: Users, label: "Usuarios" },
];

export default function AdminLayout() {
  const { user, hasAccess, loading, signOut } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace />;
  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Acceso denegado</h1>
          <p className="text-zinc-400 mb-4">No tienes permisos de administrador.</p>
          <button onClick={signOut} className="text-emerald-400 hover:underline">
            Cerrar sesión
          </button>
        </div>
      </div>
    );
  }

  const isActive = (path: string, exact?: boolean) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  return (
    <div className="min-h-screen flex bg-[#0a0a0a]">
      {/* Sidebar */}
      <aside className="w-60 border-r border-zinc-800 flex flex-col">
        <div className="p-4 border-b border-zinc-800">
          <Link to="/admin" className="flex items-center gap-2">
            <img src={logoSrc} alt="RevOps" className="h-8 w-8" />
            <span className="text-white font-semibold text-sm">Admin CMS</span>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive(item.to, item.exact)
                  ? "bg-emerald-600/20 text-emerald-400"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-zinc-800">
          <button
            onClick={signOut}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 w-full transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>
      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
