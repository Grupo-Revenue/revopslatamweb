import { useEffect, useState } from "react";
import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { MessageSquare, Settings, Brain, BarChart3, LogOut, Menu, X } from "lucide-react";
import logoSrc from "@/assets/Isotipo_color.svg";

const navItems = [
  { to: "/admin-agent", icon: MessageSquare, label: "Conversaciones", exact: true },
  { to: "/admin-agent/scoring", icon: BarChart3, label: "Lead Scoring" },
  { to: "/admin-agent/knowledge", icon: Brain, label: "Base de Conocimiento" },
  { to: "/admin-agent/config", icon: Settings, label: "Configuración" },
];

function useAdminAuth() {
  const token = localStorage.getItem("admin_agent_token");
  const expires = localStorage.getItem("admin_agent_expires");
  if (!token || !expires) return false;
  if (Date.now() > Number(expires)) {
    localStorage.removeItem("admin_agent_token");
    localStorage.removeItem("admin_agent_expires");
    return false;
  }
  return true;
}

export default function AdminAgentLayout() {
  const isAuth = useAdminAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuth) return <Navigate to="/admin-agent/login" replace />;

  const isActive = (path: string, exact?: boolean) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  const handleLogout = () => {
    localStorage.removeItem("admin_agent_token");
    localStorage.removeItem("admin_agent_expires");
    window.location.href = "/admin-agent/login";
  };

  return (
    <div className="min-h-screen flex bg-white font-['Lexend']">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-60 bg-[#F8F8F8] border-r border-gray-200 flex flex-col transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <Link to="/admin-agent" className="flex items-center gap-2">
            <img src={logoSrc} alt="RevOps" className="h-8 w-8" />
            <span className="text-gray-900 font-semibold text-sm">Admin Agente</span>
          </Link>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive(item.to, item.exact)
                  ? "bg-[#BE1869]/10 text-[#BE1869] font-medium"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-100 w-full transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-gray-200 flex items-center px-4 lg:hidden">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5 text-gray-700" />
          </button>
          <span className="ml-3 font-semibold text-sm text-gray-900">Admin Agente</span>
        </header>
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
