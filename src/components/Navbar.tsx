import { useState, useRef, useEffect } from "react";
import { useLeadForm } from "@/hooks/useLeadForm";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Menu, X, ArrowUpRight, Search, Wrench, Headphones, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrolled } from "@/hooks/use-scrolled";
import LogoWhiteColor from "@/assets/Logo_REVOPSLATAM_Negro_color.png";
import { useScrollDirection } from "@/hooks/use-scroll-direction";

/* ─── Nav data ─── */
/* solucionesItems removed — replaced by direct "Qué hacemos" link */

const serviciosGroups = [
  {
    label: "CONOCE TU PISTA",
    color: "#BE1869",
    icon: Search,
    link: "/conoce-tu-pista",
    items: [
      { label: "RevOps Checkup", desc: "Evaluación rápida del estado de tu operación", to: "/revops-checkup" },
      { label: "Diagnóstico RevOps", desc: "Análisis profundo de procesos, datos y tecnología", to: "/diagnostico-revops" },
      { label: "Motor de Ingresos", desc: "Diagnóstico integral de tu sistema de revenue", to: "/motor-de-ingresos" },
    ],
  },
  {
    label: "DISEÑA Y CONSTRUYE TU PISTA",
    color: "#6224BE",
    icon: Wrench,
    link: "/diseña-y-construye-tu-pista",
    items: [
      { label: "Diseño de Procesos", desc: "Flujos comerciales alineados a tu estrategia", to: "/diseño-de-procesos" },
      { label: "Onboarding HubSpot", desc: "Puesta en marcha guiada de tu CRM", to: "/onboarding-hubspot" },
      { label: "Implementación HubSpot", desc: "Configuración avanzada y personalizada", to: "/implementacion-hubspot" },
      { label: "Personalización CRM", desc: "Adapta HubSpot a tus procesos únicos", to: "/personalizacion-crm" },
      { label: "Integraciones y Desarrollo", desc: "Conecta tus herramientas y sistemas", to: "/integraciones-desarrollo" },
    ],
  },
  {
    label: "OPERA TU PISTA",
    color: "#1CA398",
    icon: Headphones,
    link: "/opera-tu-pista",
    items: [
      { label: "RevOps as a Service", desc: "Equipo dedicado de operaciones de revenue", to: "/revops-as-a-service" },
      { label: "Marketing Ops", desc: "Operación y optimización de marketing", to: "/marketing-ops" },
      { label: "Soporte HubSpot", desc: "Asistencia técnica continua para tu CRM", to: "/soporte-hubspot" },
    ],
  },
  {
    label: "POTENCIA CON IA",
    color: "#0779D7",
    icon: Sparkles,
    link: "/potencia-con-ia",
    items: [{ label: "IA para tu Motor de Ingresos", desc: "Automatización inteligente y predicción", to: "/potencia-con-ia" }],
  },
];

const serviciosItemsFlat = serviciosGroups.flatMap((g) =>
  g.items.map((item) => ({ label: item.label, to: item.to }))
);

/* ─── Simple Dropdown ─── */
const NavDropdown = ({
  label,
  items,
}: {
  label: string;
  items: { label: string; to: string }[];
}) => {
  const [open, setOpen] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const ref = useRef<HTMLDivElement>(null);

  const enter = () => { clearTimeout(timeout.current); setOpen(true); };
  const leave = () => { timeout.current = setTimeout(() => setOpen(false), 150); };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative" onMouseEnter={enter} onMouseLeave={leave}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 text-sm font-medium transition-colors duration-200"
        style={{ color: "#1a1a2e" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#7c3aed")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#1a1a2e")}
      >
        {label}
        <ChevronDown size={14} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute left-1/2 -translate-x-1/2 top-full mt-3 z-50 min-w-[260px] rounded-xl shadow-2xl p-4"
            style={{
              background: "#ffffff",
              border: "1.5px solid rgba(0,0,0,0.08)",
            }}
          >
            {items.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 rounded-lg text-sm transition-colors duration-150"
                style={{ color: "#1a1a2e" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(124,58,237,0.06)";
                  e.currentTarget.style.color = "#7c3aed";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#1a1a2e";
                }}
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─── Servicios Grouped Dropdown (Webflow-style) ─── */
const ServiciosDropdown = () => {
  const [open, setOpen] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const ref = useRef<HTMLDivElement>(null);

  const enter = () => { clearTimeout(timeout.current); setOpen(true); };
  const leave = () => { timeout.current = setTimeout(() => setOpen(false), 150); };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative" onMouseEnter={enter} onMouseLeave={leave}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 text-sm font-medium transition-colors duration-200"
        style={{ color: "#1a1a2e" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#7c3aed")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#1a1a2e")}
      >
        Servicios
        <ChevronDown size={14} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute left-1/2 -translate-x-1/2 top-full mt-3 z-50 rounded-xl shadow-2xl"
            style={{
              width: 720,
              background: "#ffffff",
              border: "1.5px solid rgba(0,0,0,0.08)",
            }}
          >
            <div className="p-6 space-y-5">
              {serviciosGroups.map((group, gi) => {
                const GroupIcon = group.icon;
                return (
                  <div key={group.label}>
                    {gi > 0 && (
                      <div className="mb-5 h-px" style={{ background: "rgba(0,0,0,0.06)" }} />
                    )}
                    {/* Category header */}
                    <div className="flex items-center gap-2 mb-3">
                      <GroupIcon size={14} style={{ color: group.color }} />
                      {group.link ? (
                        <Link
                          to={group.link}
                          onClick={() => setOpen(false)}
                          className="transition-opacity hover:opacity-70"
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: "0.14em",
                            color: group.color,
                          }}
                        >
                          {group.label}
                        </Link>
                      ) : (
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: "0.14em",
                            color: group.color,
                          }}
                        >
                          {group.label}
                        </span>
                      )}
                    </div>
                    {/* Items grid */}
                    <div className="grid grid-cols-3 gap-1">
                      {group.items.map((item) => (
                        <Link
                          key={item.label}
                          to={item.to}
                          onClick={() => setOpen(false)}
                          className="group rounded-lg p-3 transition-colors duration-150"
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = `${group.color}08`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                          }}
                        >
                          <span
                            className="block text-[13px] font-semibold transition-colors duration-150 group-hover:text-[var(--hover-color)]"
                            style={{ color: "#1a1a2e", "--hover-color": group.color } as React.CSSProperties}
                          >
                            {item.label}
                          </span>
                          <span className="block text-[11px] mt-0.5 leading-snug" style={{ color: "#6B7280" }}>
                            {item.desc}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─── Main Navbar ─── */
const Navbar = () => {
  const scrolled = useScrolled(50);
  const hidden = useScrollDirection();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openLeadForm } = useLeadForm();

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      {/* ── Desktop: Two-piece floating navbar ── */}
      <motion.nav
        initial={{ y: 0, opacity: 1 }}
        animate={{
          y: hidden && !mobileOpen ? -100 : 0,
          opacity: hidden && !mobileOpen ? 0 : 1,
        }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="fixed top-0 left-0 w-full z-50 pointer-events-none"
        style={{ padding: "16px 0" }}
      >
        <div className="mx-auto px-6 flex items-stretch pointer-events-auto"
          style={{ gap: 12, maxWidth: 1100 }}
        >
          {/* Piece 1: Logo Box with gradient border */}
          <Link
            to="/"
            className="shrink-0 hidden lg:flex"
            style={{
              background: "linear-gradient(135deg, #BE1869, #6224BE)",
              borderRadius: 14,
              padding: "1.5px",
              boxShadow: "0 2px 16px rgba(0,0,0,0.10)",
            }}
          >
            <div
              className="flex items-center justify-center"
              style={{
                background: "#ffffff",
                borderRadius: 12.5,
                padding: "0 18px",
              }}
            >
              <img src={LogoWhiteColor} alt="Revops LATAM" className="h-7 w-auto" />
            </div>
          </Link>

          {/* Piece 2: Navigation Pill with gradient border */}
          <div
            className="hidden lg:flex items-center flex-1"
            style={{
              background: "linear-gradient(135deg, #BE1869, #6224BE)",
              borderRadius: 14,
              padding: "1.5px",
              boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
            }}
          >
            <div
              className="flex items-center w-full"
              style={{
                background: "#ffffff",
                borderRadius: 12.5,
                padding: "6px 6px 6px 20px",
                gap: 8,
              }}
            >
            <div className="flex items-center" style={{ gap: 24 }}>
              <Link
                to="/que-hacemos"
                className="text-sm font-medium transition-colors duration-200"
                style={{ color: "#1a1a2e" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#7c3aed")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#1a1a2e")}
              >
                Qué hacemos
              </Link>
              <ServiciosDropdown />
              {/* Recursos - temporalmente oculto */}
              <Link
                to="/nosotros"
                className="text-sm font-medium transition-colors duration-200"
                style={{ color: "#1a1a2e" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#7c3aed")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#1a1a2e")}
              >
                Nosotros
              </Link>
              <Link
                to="/hubspot-partner-chile"
                className="text-sm font-medium transition-colors duration-200"
                style={{ color: "#1a1a2e" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#7c3aed")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#1a1a2e")}
              >
                HubSpot Partner
              </Link>
            </div>

            <div className="ml-auto flex items-center" style={{ gap: 16 }}>
              {/* Pulso Comercial */}
              <a
                href="https://pulso.revopslatam.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm transition-colors duration-200"
                style={{ color: "#7c3aed", fontWeight: 600, gap: 6 }}
              >
                <span
                  className="inline-block rounded-full"
                  style={{
                    width: 8,
                    height: 8,
                    background: "#7c3aed",
                    flexShrink: 0,
                  }}
                />
                Pulso Comercial
                <ArrowUpRight size={14} style={{ flexShrink: 0 }} />
              </a>

              {/* CTA Button */}
              <button
                onClick={() => openLeadForm("navbar")}
                className="text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.03] hover:shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #d946a8, #7c3aed)",
                  borderRadius: 10,
                  padding: "10px 22px",
                  whiteSpace: "nowrap",
                }}
              >
                Agendar Reunión
              </button>
            </div>
            </div>
          </div>

          {/* Mobile: single white bar */}
          <div
            className="lg:hidden flex items-center justify-between w-full"
            style={{
              background: "#ffffff",
              borderRadius: 14,
              padding: "10px 16px",
              boxShadow: "0 2px 16px rgba(0,0,0,0.10)",
            }}
          >
            <Link to="/" className="shrink-0">
              <img src={LogoWhiteColor} alt="Revops LATAM" className="h-7 w-auto" />
            </Link>
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="relative z-50"
              style={{ color: "#1a1a2e" }}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Menu size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ── Mobile fullscreen menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-40 flex flex-col pt-24 px-8 pb-10 overflow-y-auto"
            style={{ background: "#ffffff" }}
          >
            <Link
              to="/que-hacemos"
              onClick={() => setMobileOpen(false)}
              className="py-4 text-lg font-semibold"
              style={{ color: "#1a1a2e", borderBottom: "1px solid rgba(0,0,0,0.06)" }}
            >
              Qué hacemos
            </Link>
            <MobileSectionGrouped onClose={() => setMobileOpen(false)} />
            {/* Recursos - temporalmente oculto */}
            <Link
              to="/nosotros"
              onClick={() => setMobileOpen(false)}
              className="py-4 text-lg font-semibold"
              style={{ color: "#1a1a2e", borderBottom: "1px solid rgba(0,0,0,0.06)" }}
            >
              Nosotros
            </Link>
            <Link
              to="/hubspot-partner-chile"
              onClick={() => setMobileOpen(false)}
              className="py-4 text-lg font-semibold"
              style={{ color: "#1a1a2e", borderBottom: "1px solid rgba(0,0,0,0.06)" }}
            >
              HubSpot Partner
            </Link>

            <div className="mt-auto pt-8 flex flex-col gap-4">
              <a
                href="https://pulso.revopslatam.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center text-base font-semibold"
                style={{ color: "#7c3aed", gap: 6 }}
              >
                <span
                  className="inline-block rounded-full"
                  style={{ width: 8, height: 8, background: "#7c3aed" }}
                />
                Pulso Comercial
                <ArrowUpRight size={16} />
              </a>
              <button
                onClick={() => { openLeadForm("navbar-mobile"); setMobileOpen(false); }}
                className="w-full text-base font-semibold text-white"
                style={{
                  background: "linear-gradient(135deg, #d946a8, #7c3aed)",
                  borderRadius: 50,
                  padding: "14px 24px",
                }}
              >
                Agendar Reunión
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

/* ─── Mobile accordion section ─── */
const MobileSection = ({
  title,
  items,
  onClose,
}: {
  title: string;
  items: { label: string; to: string }[];
  onClose: () => void;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-4 text-lg font-semibold"
        style={{ color: "#1a1a2e" }}
      >
        {title}
        <ChevronDown size={18} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="pb-4 pl-4 space-y-1">
              {items.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={onClose}
                  className="block py-2 text-sm transition-colors"
                  style={{ color: "#555" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#7c3aed")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─── Mobile grouped services section ─── */
const MobileSectionGrouped = ({ onClose }: { onClose: () => void }) => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-4 text-lg font-semibold"
        style={{ color: "#1a1a2e" }}
      >
        Servicios
        <ChevronDown size={18} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="pb-4 space-y-5">
              {serviciosGroups.map((group) => {
                const GroupIcon = group.icon;
                return (
                  <div key={group.label}>
                    {/* Category header */}
                    <div className="flex items-center gap-2 mb-2 pl-2">
                      <GroupIcon size={14} style={{ color: group.color }} />
                      {group.link ? (
                        <Link
                          to={group.link}
                          onClick={onClose}
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: "0.14em",
                            color: group.color,
                          }}
                        >
                          {group.label}
                        </Link>
                      ) : (
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: "0.14em",
                            color: group.color,
                          }}
                        >
                          {group.label}
                        </span>
                      )}
                    </div>
                    {/* Items */}
                    <div className="pl-8 space-y-0.5">
                      {group.items.map((item) => (
                        <Link
                          key={item.label}
                          to={item.to}
                          onClick={onClose}
                          className="block py-2 text-sm transition-colors"
                          style={{ color: "#555" }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = group.color)}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
