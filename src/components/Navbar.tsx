import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrolled } from "@/hooks/use-scrolled";
import LogoWhiteColor from "@/assets/Logo_REVOPSLATAM_Blanco_color.png";

/* ─── Nav data ─── */
const solucionesItems = [
  { label: "Para el CEO / Gerente General", to: "/para-ceos-y-gerentes-generales" },
  { label: "Para el Equipo Comercial", to: "/para-directores-comerciales" },
  { label: "Para Marketing", to: "/para-directores-y-gerentes-de-marketing" },
  { label: "Para Operaciones", to: "#" },
];

const serviciosGroups = [
  {
    label: "DISEÑA TU PISTA",
    color: "#BE1869",
    items: ["Diagnóstico del Motor de Ingresos"],
  },
  {
    label: "CONSTRUYE TU PISTA",
    color: "#6224BE",
    items: ["Implementación HubSpot CRM", "Marketing Ops", "Integraciones y Desarrollo"],
  },
  {
    label: "OPERA TU PISTA",
    color: "#1CA398",
    items: ["RevOps as a Service", "Soporte HubSpot"],
  },
  {
    label: "POTENCIA CON IA",
    color: "#0779D7",
    items: ["IA para tu Motor de Ingresos"],
  },
];

// Flat list for mobile
const serviciosItemsFlat = serviciosGroups.flatMap((g) => g.items.map((item) => ({ label: item, to: "#" })));

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
        className="flex items-center gap-1 text-sm font-medium text-nav-link hover:text-primary-foreground transition-colors duration-200"
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
            className="absolute left-1/2 -translate-x-1/2 top-full mt-3 z-50 min-w-[260px] bg-dark-card border border-[rgba(255,255,255,0.1)] rounded-xl shadow-2xl p-4"
          >
            {items.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 rounded-lg text-sm text-nav-link hover:bg-[rgba(190,24,105,0.1)] hover:text-pink transition-colors duration-150"
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

/* ─── Servicios Grouped Dropdown ─── */
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
        className="flex items-center gap-1 text-sm font-medium text-nav-link hover:text-primary-foreground transition-colors duration-200"
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
            className="absolute left-1/2 -translate-x-1/2 top-full mt-3 z-50 bg-dark-card border border-[rgba(255,255,255,0.1)] rounded-xl shadow-2xl p-5"
            style={{ width: 480 }}
          >
            {serviciosGroups.map((group, gi) => (
              <div key={group.label}>
                {gi > 0 && (
                  <div className="my-2 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
                )}
                <p
                  className="px-4 pt-2 pb-1 select-none"
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    color: group.color,
                  }}
                >
                  {group.label}
                </p>
                {group.items.map((item) => (
                  <Link
                    key={item}
                    to="#"
                    onClick={() => setOpen(false)}
                    className="block rounded-lg text-[14px] text-nav-link transition-colors duration-150"
                    style={{ padding: "10px 16px" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = `${group.color}14`;
                      e.currentTarget.style.color = group.color;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "";
                    }}
                  >
                    {item}
                  </Link>
                ))}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─── Main Navbar ─── */
const Navbar = () => {
  const scrolled = useScrolled(50);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 border-b border-[rgba(255,255,255,0.06)] transition-all duration-300 ${
          scrolled
            ? "h-16 bg-dark-bg"
            : "h-[72px] bg-[rgba(13,13,26,0.85)] backdrop-blur-lg"
        }`}
      >
        <div className="container max-w-7xl mx-auto h-full flex items-center justify-between px-6">
          <Link to="/" className="shrink-0">
            <img src={LogoWhiteColor} alt="Revops LATAM" className="h-8 w-auto" />
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            <NavDropdown label="Soluciones" items={solucionesItems} />
            <ServiciosDropdown />
            <Link to="#" className="text-sm font-medium text-nav-link hover:text-primary-foreground transition-colors duration-200">
              Recursos
            </Link>
            <Link to="#" className="text-sm font-medium text-nav-link hover:text-primary-foreground transition-colors duration-200">
              Nosotros
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-5">
            <Link to="#" className="flex items-center gap-2 text-sm font-semibold text-yellow">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow" />
              </span>
              Pulso Comercial
            </Link>
            <Button size="sm" className="text-sm">Agenda una llamada</Button>
          </div>

          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="lg:hidden relative z-50 text-primary-foreground"
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
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-40 bg-dark-bg flex flex-col pt-24 px-8 pb-10 overflow-y-auto"
          >
            <MobileSection title="Soluciones" items={solucionesItems} onClose={() => setMobileOpen(false)} />
            <MobileSection title="Servicios" items={serviciosItemsFlat} onClose={() => setMobileOpen(false)} />
            <Link to="#" onClick={() => setMobileOpen(false)} className="py-4 text-lg font-semibold text-primary-foreground border-b border-[rgba(255,255,255,0.06)]">
              Recursos
            </Link>
            <Link to="#" onClick={() => setMobileOpen(false)} className="py-4 text-lg font-semibold text-primary-foreground border-b border-[rgba(255,255,255,0.06)]">
              Nosotros
            </Link>

            <div className="mt-auto pt-8 flex flex-col gap-4">
              <Link to="#" className="flex items-center justify-center gap-2 text-base font-semibold text-yellow">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow" />
                </span>
                Pulso Comercial
              </Link>
              <Button className="w-full">Agenda una llamada</Button>
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
    <div className="border-b border-[rgba(255,255,255,0.06)]">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-4 text-lg font-semibold text-primary-foreground"
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
                <Link key={item.label} to={item.to} onClick={onClose} className="block py-2 text-sm text-nav-link hover:text-pink transition-colors">
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

export default Navbar;
