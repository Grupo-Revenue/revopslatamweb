import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, useInView } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true, margin: "-60px" } as const,
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

const GRADIENT = "linear-gradient(90deg, #BE1869, #6224BE)";

/* ─── Counter animation hook ─── */
function useCountUp(target: number, duration = 1500) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target, duration]);

  return { ref, value };
}

/* ─── RevOps Scorecard ─── */
const RevOpsScorecard = () => {
  const { ref, value: score } = useCountUp(72, 1500);
  const bars = [
    { label: "Proceso", pct: 78 },
    { label: "Tecnología", pct: 65 },
    { label: "Datos", pct: 58 },
    { label: "Equipo", pct: 82 },
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      className="w-full max-w-[380px] mx-auto lg:mx-0 rounded-[20px] p-7"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      <p className="text-[12px] uppercase tracking-[0.1em] mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>
        RevOps Score™
      </p>
      <p
        className="text-[72px] font-extrabold tracking-tight leading-none"
        style={{ background: GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
      >
        {score}
      </p>
      <div className="mt-8 space-y-4">
        {bars.map((bar, i) => (
          <div key={bar.label}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[13px] text-white/60">{bar.label}</span>
              <span className="text-[13px] font-mono text-white/40">{bar.pct}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: GRADIENT }}
                initial={{ width: 0 }}
                whileInView={{ width: `${bar.pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.6 + i * 0.2, ease: "easeOut" }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-6 text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>
        Basado en benchmarks LATAM
      </p>
    </motion.div>
  );
};

/* ─── Silos Diagram ─── */
const SilosDiagram = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const silos = ["Ventas", "Marketing", "CS"];

  return (
    <div ref={ref} className="w-full max-w-[420px] mx-auto">
      <div className="flex items-center justify-between gap-2">
        {silos.map((silo, i) => (
          <div key={silo} className="flex items-center flex-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.15 }}
              className="flex-1 rounded-xl p-4 sm:p-5 text-center"
              style={{ background: "#F9FAFB", border: "1px solid #E5E7EB" }}
            >
              <p className="text-[14px] font-bold" style={{ color: "#1A1A2E" }}>{silo}</p>
            </motion.div>
            {i < silos.length - 1 && (
              <div className="w-8 sm:w-12 flex-shrink-0 flex items-center justify-center">
                <svg width="100%" height="24" viewBox="0 0 48 24" className="overflow-visible">
                  <motion.line
                    x1="0" y1="12" x2="48" y2="12"
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ stroke: "#D1D5DB", strokeDasharray: "4 4" }}
                    animate={inView ? { stroke: "url(#siloGrad)", strokeDasharray: "none" } : {}}
                    transition={{ duration: 1.2, delay: 0.6 + i * 0.3, ease: "easeOut" }}
                  />
                  <motion.polygon
                    points="40,6 48,12 40,18"
                    initial={{ fill: "#D1D5DB" }}
                    animate={inView ? { fill: "#6224BE" } : {}}
                    transition={{ duration: 0.6, delay: 1 + i * 0.3 }}
                  />
                  <defs>
                    <linearGradient id="siloGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#BE1869" />
                      <stop offset="100%" stopColor="#6224BE" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Accordion Item ─── */
const AccordionItem = ({
  num, title, description, badge, isOpen, onToggle, isLast,
}: {
  num: string; title: string; description: string; badge: string;
  isOpen: boolean; onToggle: () => void; isLast: boolean;
}) => (
  <div style={isLast ? {} : { borderBottom: "1px solid #E5E7EB" }}>
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-4 py-5 text-left transition-colors hover:opacity-80"
    >
      <span
        className="text-[24px] font-extrabold flex-shrink-0 w-10"
        style={{ background: GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
      >
        {num}
      </span>
      <span className="text-[17px] sm:text-[18px] font-bold flex-1" style={{ color: "#1A1A2E" }}>{title}</span>
      <ChevronDown
        size={20}
        className="flex-shrink-0 transition-transform duration-300"
        style={{ color: "#6B7280", transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}
      />
    </button>
    <div
      className="overflow-hidden transition-all duration-300 ease-in-out"
      style={{ maxHeight: isOpen ? 200 : 0, opacity: isOpen ? 1 : 0 }}
    >
      <div className="pb-5 pl-14">
        <p className="text-[15px] leading-[1.7]" style={{ color: "#6B7280" }}>{description}</p>
        <span
          className="inline-block mt-3 text-[12px] font-medium px-3 py-1 rounded-full"
          style={{ background: "#F3F4F6", color: "#6B7280" }}
        >
          {badge}
        </span>
      </div>
    </div>
  </div>
);

/* ─── Horizontal Timeline ─── */
const HorizontalTimeline = () => {
  const weeks = [
    { num: "1", title: "Kick-off ejecutivo" },
    { num: "2", title: "Auditorías profundas" },
    { num: "3", title: "Entregables 1, 2 y 3" },
    { num: "4", title: "Entregables 4 y 5 + QA" },
    { num: "5", title: "Presentación y entrega" },
  ];

  return (
    <div>
      {/* Desktop horizontal */}
      <div className="hidden md:block">
        <div className="flex items-start gap-0">
          {weeks.map((w, i) => (
            <motion.div key={w.num} {...fadeUp(0.1 + i * 0.1)} className="flex-1 flex flex-col items-center text-center">
              <div className="flex items-center w-full">
                {i > 0 && (
                  <motion.div
                    className="flex-1 h-[2px]"
                    style={{ background: GRADIENT, opacity: 0.4 }}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
                  />
                )}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                  style={{ background: GRADIENT }}
                >
                  {w.num}
                </div>
                {i < weeks.length - 1 && (
                  <motion.div
                    className="flex-1 h-[2px]"
                    style={{ background: GRADIENT, opacity: 0.4 }}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 + i * 0.15 }}
                  />
                )}
              </div>
              <p className="mt-3 text-[13px] font-bold" style={{ color: "#1A1A2E" }}>Semana {w.num}</p>
              <p className="mt-1 text-[13px]" style={{ color: "#6B7280" }}>{w.title}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile vertical */}
      <div className="md:hidden space-y-6">
        {weeks.map((w, i) => (
          <motion.div key={w.num} {...fadeUp(0.1 + i * 0.08)} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                style={{ background: GRADIENT }}
              >
                {w.num}
              </div>
              {i < weeks.length - 1 && (
                <div className="w-[2px] flex-1 mt-2" style={{ background: GRADIENT, opacity: 0.3 }} />
              )}
            </div>
            <div className="pt-2 pb-4">
              <p className="text-[15px] font-bold" style={{ color: "#1A1A2E" }}>Semana {w.num} — {w.title}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

/* ─── Chip Link ─── */
const ChipLink = ({ to, label }: { to: string; label: string }) => (
  <Link
    to={to}
    className="inline-flex items-center text-[12px] font-semibold px-3 py-1 rounded-full transition-all duration-200 mt-1.5"
    style={{ background: "rgba(190,24,105,0.08)", color: "#BE1869" }}
    onMouseEnter={(e) => { e.currentTarget.style.background = GRADIENT; e.currentTarget.style.color = "#fff"; }}
    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(190,24,105,0.08)"; e.currentTarget.style.color = "#BE1869"; }}
  >
    {label}
  </Link>
);

/* ─── Result Card ─── */
const ResultCard = ({ title, desc, delay }: { title: string; desc: string; delay: number }) => (
  <motion.div {...fadeUp(delay)} className="p-6">
    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(190,24,105,0.1)" }}>
      <span style={{ background: GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 800, fontSize: 16 }}>✦</span>
    </div>
    <h4 className="text-[16px] font-bold mb-2 text-white">{title}</h4>
    <p className="text-[14px] leading-[1.7]" style={{ color: "rgba(255,255,255,0.6)" }}>{desc}</p>
  </motion.div>
);

/* ═══════════════ PAGE ═══════════════ */
const MotorDeIngresos = () => {
  const [openAccordion, setOpenAccordion] = useState(0);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const entregables = [
    { num: "01", title: "Mapa de Arquitectura de Revenue", desc: "Visualización completa de tu motor de ingresos: etapas, métricas, silos y puntos de fuga — en un solo documento.", badge: "15-20 páginas" },
    { num: "02", title: "Auditoría del Stack Tecnológico", desc: "Inventario de herramientas, estado de integraciones, uso real vs capacidad contratada y oportunidades de IA.", badge: "20-25 páginas" },
    { num: "03", title: "Reporte de Cuellos de Botella", desc: "Los 5 problemas críticos con evidencia, causa raíz, impacto económico cuantificado y recomendaciones.", badge: "25-30 páginas · el más crítico" },
    { num: "04", title: "Roadmap de 90 días", desc: "Plan semana a semana con recursos, dependencias y quick wins priorizados.", badge: "15-20 páginas" },
    { num: "05", title: "RevOps Score™", desc: "Madurez operativa en 4 dimensiones con benchmarks de industria.", badge: "12-15 páginas" },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden pt-32 sm:pt-40 pb-20 sm:pb-28 px-6" style={{ background: "#1A1A2E" }}>
        <div className="max-w-[1100px] mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-1 lg:max-w-[55%]">
            <motion.nav {...fadeUp(0)} className="flex items-center gap-2 text-[12px] mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>
              <Link to="/conoce-tu-pista" className="hover:text-white/60 transition-colors">Conoce tu pista</Link>
              <span>→</span>
              <span className="text-white/60">Diagnóstico Motor de Ingresos</span>
            </motion.nav>

            <motion.span
              {...fadeUp(0.05)}
              className="inline-block text-[11px] font-bold uppercase tracking-[0.12em] px-4 py-1.5 rounded-full mb-6 text-white"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)" }}
            >
              ENTERPRISE
            </motion.span>

            <motion.h1
              {...fadeUp(0.1)}
              className="font-extrabold leading-[1.08] tracking-tight max-w-[700px]"
              style={{ color: "#ffffff", fontSize: "clamp(40px, 5.5vw, 64px)" }}
            >
              De la complejidad a la eficiencia
            </motion.h1>

            <motion.p {...fadeUp(0.18)} className="mt-5 text-[17px] sm:text-[18px] leading-[1.7] max-w-[560px]" style={{ color: "rgba(255,255,255,0.7)" }}>
              Tienes equipo, tecnología y procesos. Pero cada área ve una realidad distinta y el forecast no es confiable. En 5 semanas tienes el diagnóstico más completo de tu operación de revenue — presentable a tu directorio.
            </motion.p>

            <motion.div {...fadeUp(0.26)} className="mt-8 flex flex-wrap items-center gap-5">
              <Link
                to="#"
                className="inline-flex items-center text-[15px] font-semibold text-white transition-all duration-200 hover:shadow-[0_0_24px_rgba(190,24,105,0.4)] hover:scale-[1.03]"
                style={{ background: GRADIENT, borderRadius: 9999, padding: "14px 32px" }}
              >
                Agendar sesión de evaluación →
              </Link>
              <button
                onClick={() => scrollToSection("para-quien")}
                className="text-[14px] font-medium transition-colors duration-200 hover:text-white"
                style={{ color: "rgba(255,255,255,0.6)", textDecoration: "underline", textUnderlineOffset: "3px" }}
              >
                ¿Es este el diagnóstico correcto para mí? ↓
              </button>
            </motion.div>
          </div>

          <div className="flex-1 lg:max-w-[45%] flex justify-center">
            <RevOpsScorecard />
          </div>
        </div>
      </section>

      {/* ─── EL PROBLEMA ─── */}
      <section className="py-20 sm:py-[100px] px-6" style={{ background: "#ffffff" }}>
        <div className="max-w-[1100px] mx-auto flex flex-col lg:flex-row items-center gap-14 lg:gap-20">
          <div className="flex-1 max-w-[520px]">
            <motion.h2
              {...fadeUp(0)}
              className="text-[28px] sm:text-[32px] md:text-[40px] font-bold leading-[1.15] tracking-tight"
              style={{ color: "#1A1A2E" }}
            >
              El problema más difícil de resolver es el que nadie puede ver completo
            </motion.h2>
            <motion.p {...fadeUp(0.1)} className="mt-6 text-[16px] leading-[1.7]" style={{ color: "#6B7280" }}>
              En operaciones complejas, el problema rara vez está en un solo lugar. Está distribuido: en cómo se transfieren leads entre áreas, en los registros del CRM, en las integraciones que fallan silenciosamente.
            </motion.p>
            <motion.p {...fadeUp(0.15)} className="mt-4 text-[16px] leading-[1.7]" style={{ color: "#6B7280" }}>
              Ventas culpa a marketing. Marketing culpa a los datos. Operaciones no tiene capacidad de ver el cuadro completo. Y tú tomas decisiones estratégicas con información que no es confiable.
            </motion.p>
            <motion.p {...fadeUp(0.2)} className="mt-4 text-[18px] font-bold leading-[1.5]" style={{ color: "#1A1A2E" }}>
              El Diagnóstico Motor de Ingresos es la mirada independiente que ningún equipo interno puede darte.
            </motion.p>
          </div>

          <div className="flex-1 w-full flex justify-center">
            <SilosDiagram />
          </div>
        </div>
      </section>

      {/* ─── LOS 5 ENTREGABLES ─── */}
      <section className="py-20 sm:py-[100px] px-6" style={{ background: "#F9FAFB" }}>
        <div className="max-w-[720px] mx-auto">
          <motion.h2
            {...fadeUp(0)}
            className="text-[28px] sm:text-[32px] md:text-[36px] font-bold leading-[1.15] tracking-tight text-center"
            style={{ color: "#1A1A2E" }}
          >
            Cinco entregables. Un cuadro completo.
          </motion.h2>
          <motion.p {...fadeUp(0.08)} className="mt-4 text-center text-[16px]" style={{ color: "#6B7280" }}>
            Cada documento tiene un propósito ejecutivo específico.
          </motion.p>

          <motion.div {...fadeUp(0.15)} className="mt-12 rounded-[20px] p-6 sm:p-8" style={{ background: "#ffffff", border: "1px solid #E5E7EB" }}>
            {entregables.map((e, i) => (
              <AccordionItem
                key={e.num}
                num={e.num}
                title={e.title}
                description={e.desc}
                badge={e.badge}
                isOpen={openAccordion === i}
                onToggle={() => setOpenAccordion(openAccordion === i ? -1 : i)}
                isLast={i === entregables.length - 1}
              />
            ))}
          </motion.div>

          <motion.div {...fadeUp(0.2)} className="mt-8 text-center">
            <span
              className="inline-block text-[13px] font-semibold px-5 py-2.5 rounded-full"
              style={{ background: "rgba(190,24,105,0.06)", color: "#BE1869" }}
            >
              + Presentación Ejecutiva · Deck de 20 slides listo para tu directorio
            </span>
          </motion.div>
        </div>
      </section>

      {/* ─── CÓMO FUNCIONA ─── */}
      <section className="py-20 sm:py-[100px] px-6" style={{ background: "#ffffff" }}>
        <div className="max-w-[1000px] mx-auto">
          <motion.h2
            {...fadeUp(0)}
            className="text-[28px] sm:text-[32px] md:text-[36px] font-bold leading-[1.15] tracking-tight text-center mb-14"
            style={{ color: "#1A1A2E" }}
          >
            El proceso
          </motion.h2>
          <HorizontalTimeline />
        </div>
      </section>

      {/* ─── PARA QUIÉN ES ─── */}
      <section id="para-quien" className="py-20 sm:py-[100px] px-6" style={{ background: "#F9FAFB" }}>
        <div className="max-w-[900px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <motion.div {...fadeUp(0.1)} className="rounded-2xl p-7 sm:p-8" style={{ background: "#ffffff", border: "1px solid #E5E7EB" }}>
            <h3 className="text-[20px] font-bold mb-6" style={{ color: "#1A1A2E" }}>Es para ti si:</h3>
            <div className="space-y-4">
              {[
                "VP, CRO o CEO responsable del revenue",
                "Equipo comercial de 10-50 personas",
                "Facturación $5M-$50M USD",
                "Múltiples equipos de revenue sin alineación",
                "Necesitas entregable presentable a directorio o board",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="text-[14px] mt-0.5 flex-shrink-0" style={{ color: "#22C55E" }}>✓</span>
                  <span className="text-[15px] leading-[1.6]" style={{ color: "#6B7280" }}>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div {...fadeUp(0.2)} className="rounded-2xl p-7 sm:p-8" style={{ background: "#ffffff", border: "1px solid #E5E7EB" }}>
            <h3 className="text-[20px] font-bold mb-6" style={{ color: "#1A1A2E" }}>No es para ti si:</h3>
            <div className="space-y-5">
              <div>
                <div className="flex items-start gap-3">
                  <span className="text-[14px] mt-0.5 flex-shrink-0" style={{ color: "#6B7280" }}>→</span>
                  <span className="text-[15px] leading-[1.6]" style={{ color: "#6B7280" }}>Tu operación no justifica 5 semanas de análisis</span>
                </div>
                <div className="ml-7 mt-1.5"><ChipLink to="/diagnostico-revops" label="Diagnóstico RevOps →" /></div>
              </div>
              <div>
                <div className="flex items-start gap-3">
                  <span className="text-[14px] mt-0.5 flex-shrink-0" style={{ color: "#6B7280" }}>→</span>
                  <span className="text-[15px] leading-[1.6]" style={{ color: "#6B7280" }}>Etapa temprana con equipo pequeño</span>
                </div>
                <div className="ml-7 mt-1.5"><ChipLink to="/revops-checkup" label="RevOps Checkup →" /></div>
              </div>
              <div>
                <div className="flex items-start gap-3">
                  <span className="text-[14px] mt-0.5 flex-shrink-0" style={{ color: "#6B7280" }}>→</span>
                  <span className="text-[15px] leading-[1.6]" style={{ color: "#6B7280" }}>Ya sabes qué cambiar, necesitas ejecución</span>
                </div>
                <div className="ml-7 mt-1.5"><ChipLink to="#" label="Diseña y Construye →" /></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── RESULTADO ─── */}
      <section className="py-20 sm:py-[100px] px-6" style={{ background: "#1A1A2E" }}>
        <div className="max-w-[900px] mx-auto">
          <motion.h2
            {...fadeUp(0)}
            className="text-[26px] sm:text-[32px] md:text-[36px] font-bold leading-[1.15] tracking-tight text-center max-w-[640px] mx-auto"
            style={{ color: "#ffffff" }}
          >
            Al terminar, tienes lo que ningún equipo interno puede darte
          </motion.h2>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ResultCard
              title="Fotografía independiente"
              desc="Visión completa sin sesgos internos de ningún área"
              delay={0.1}
            />
            <ResultCard
              title="Impacto económico cuantificado"
              desc="Cada brecha tiene un costo real documentado"
              delay={0.2}
            />
            <ResultCard
              title="Roadmap ejecutable"
              desc="Quick wins identificados con recursos y dependencias"
              delay={0.25}
            />
            <ResultCard
              title="Listo para el board"
              desc="Entregable que habla el lenguaje de la dirección"
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* ─── PRECIO + CTA ─── */}
      <section className="py-16 sm:py-20 px-6" style={{ background: "#ffffff" }}>
        <div className="max-w-[520px] mx-auto text-center">
          <motion.span
            {...fadeUp(0)}
            className="inline-block text-[12px] font-bold uppercase tracking-[0.1em] px-5 py-2 rounded-full mb-8"
            style={{ background: "rgba(190,24,105,0.06)", color: "#BE1869" }}
          >
            El diagnóstico más completo del mercado
          </motion.span>

          <motion.div
            {...fadeUp(0.1)}
            className="relative rounded-[20px] p-[2px]"
            style={{ background: GRADIENT, boxShadow: "0 32px 80px rgba(190,24,105,0.15)" }}
          >
            <div className="rounded-[18px] bg-white p-12 sm:p-14 text-center">
              <p className="text-[12px] font-bold uppercase tracking-[0.12em] mb-2" style={{ color: "#6B7280" }}>Inversión</p>
              <p className="text-[44px] font-extrabold tracking-tight" style={{ color: "#1A1A2E" }}>Desde 250 UF</p>
              <p className="text-[14px] mt-1" style={{ color: "#6B7280" }}>aprox. $9,500 USD</p>

              <div className="my-6 h-px" style={{ background: "#E5E7EB" }} />

              <p className="text-[13px] italic leading-[1.6]" style={{ color: "#6B7280" }}>
                Los clientes que vienen de un Diagnóstico RevOps pagan solo la diferencia.
              </p>

              <Link
                to="#"
                className="mt-8 w-full inline-flex items-center justify-center text-[15px] font-semibold text-white transition-all duration-200 hover:shadow-[0_0_24px_rgba(190,24,105,0.4)] hover:scale-[1.02]"
                style={{ background: GRADIENT, borderRadius: 9999, padding: "14px 32px" }}
              >
                Agendar sesión de evaluación →
              </Link>

              <Link
                to="#"
                className="block mt-4 text-[14px] font-medium transition-colors duration-200 hover:opacity-80"
                style={{ color: "#BE1869", textDecoration: "underline", textUnderlineOffset: "3px" }}
              >
                El primer paso es una conversación de 30 minutos →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MotorDeIngresos;
