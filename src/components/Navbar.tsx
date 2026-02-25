import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Menu, X, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import LogoWhiteColor from "@/assets/Logo_REVOPSLATAM_Blanco_color.png";

/* ─── Nav data ─── */
const solucionesItems = [
  { label: "Para el CEO / Gerente General", to: "/para-ceos-y-gerentes-generales" },
  { label: "Para Directores Comerciales y Head of Sales", to: "/para-directores-comerciales" },
  { label: "Para Directores y Gerentes de Marketing", to: "/para-directores-y-gerentes-de-marketing" },
  { label: "Para los que operan el negocio sin el título", to: "/para-los-que-operan-el-negocio-sin-el-titulo" },
  { label: "Para Customer Success y Servicio al Cliente", to: "/para-customer-success-y-servicio-al-cliente" },
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
        className="flex items-center gap-1 text-sm font-medium text-[hsl(240_33%_14%)] hover:text-[hsl(263_70%_44%)] transition-colors duration-200"
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
            className="absolute left-1/2 -translate-x-1/2 top-full mt-3 z-50 min-w-[260px] bg-white border border-[hsl(220_13%_91%)] rounded-xl shadow-2xl p-4"
          >
            {items.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 rounded-lg text-sm text-[hsl(240_33%_14%)] hover:bg-[hsl(263_70%_44%/0.08)] hover:text-[hsl(263_70%_44%)] transition-colors duration-150"
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
        className="flex items-center gap-1 text-sm font-medium text-[hsl(240_33%_14%)] hover:text-[hsl(263_70%_44%)] transition-colors duration-200"
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
            className="absolute left-1/2 -translate-x-1/2 top-full mt-3 z-50 bg-white border border-[hsl(220_13%_91%)] rounded-xl shadow-2xl p-5"
            style={{ width: 480 }}
          >
            {serviciosGroups.map((group, gi) => (
              <div key={group.label}>
                {gi > 0 && (
                  <div className="my-2 h-px bg-[hsl(220_13%_91%)]" />
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
                    className="block rounded-lg text-[14px] text-[hsl(240_33%_14%)] transition-colors duration-150"
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
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <nav
        className="sticky top-4 z-50 mx-4 md:mx-6"
      >
        <div
          className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 h-16"
          style={{
            background: "#ffffff",
            borderRadius: 50,
            boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
          }}
        >
          {/* Logo in its own box */}
          <Link
            to="/"
            className="shrink-0"
            style={{
              background: "#ffffff",
              borderRadius: 16,
              padding: "10px 16px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
            }}
          >
            <img src={LogoWhiteColor} alt="Revops LATAM" className="h-7 w-auto" />
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-8">
            <NavDropdown label="Soluciones" items={solucionesItems} />
            <ServiciosDropdown />
            <Link to="#" className="text-sm font-medium text-[hsl(240_33%_14%)] hover:text-[hsl(263_70%_44%)] transition-colors duration-200">
              Recursos
            </Link>
            <Link to="#" className="text-sm font-medium text-[hsl(240_33%_14%)] hover:text-[hsl(263_70%_44%)] transition-colors duration-200">
              Nosotros
            </Link>
          </div>

          {/* Desktop right side */}
          <div className="hidden lg:flex items-center gap-5">
            <Link to="#" className="flex items-center gap-2 text-sm font-semibold text-[hsl(263_70%_44%)]">
              <span className="inline-block h-2 w-2 rounded-full bg-[hsl(263_70%_44%)]" />
              Pulso Comercial
              <ArrowUpRight size={14} />
            </Link>
            <Button
              size="sm"
              className="text-sm font-bold uppercase tracking-[0.05em] rounded-lg bg-[hsl(263_70%_44%)] hover:bg-[hsl(263_70%_38%)] text-white shadow-none"
              style={{ background: "hsl(263 70% 44%)" }}
            >
              AGENDAR REUNIÓN
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="lg:hidden relative z-50 text-[hsl(240_33%_14%)]"
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

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-40 bg-white flex flex-col pt-24 px-8 pb-10 overflow-y-auto"
          >
            <MobileSection title="Soluciones" items={solucionesItems} onClose={() => setMobileOpen(false)} />
            <MobileSection title="Servicios" items={serviciosItemsFlat} onClose={() => setMobileOpen(false)} />
            <Link to="#" onClick={() => setMobileOpen(false)} className="py-4 text-lg font-semibold text-[hsl(240_33%_14%)] border-b border-[hsl(220_13%_91%)]">
              Recursos
            </Link>
            <Link to="#" onClick={() => setMobileOpen(false)} className="py-4 text-lg font-semibold text-[hsl(240_33%_14%)] border-b border-[hsl(220_13%_91%)]">
              Nosotros
            </Link>

            <div className="mt-auto pt-8 flex flex-col gap-4">
              <Link to="#" className="flex items-center justify-center gap-2 text-base font-semibold text-[hsl(263_70%_44%)]">
                <span className="inline-block h-2 w-2 rounded-full bg-[hsl(263_70%_44%)]" />
                Pulso Comercial
                <ArrowUpRight size={14} />
              </Link>
              <Button
                className="w-full uppercase tracking-[0.05em] font-bold rounded-lg bg-[hsl(263_70%_44%)] hover:bg-[hsl(263_70%_38%)] text-white shadow-none"
                style={{ background: "hsl(263 70% 44%)" }}
              >
                AGENDAR REUNIÓN
              </Button>
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
    <div className="border-b border-[hsl(220_13%_91%)]">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-4 text-lg font-semibold text-[hsl(240_33%_14%)]"
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
                <Link key={item.label} to={item.to} onClick={onClose} className="block py-2 text-sm text-[hsl(220_9%_46%)] hover:text-[hsl(263_70%_44%)] transition-colors">
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
