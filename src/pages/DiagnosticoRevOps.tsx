import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true, margin: "-60px" } as const,
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

const GRADIENT = "linear-gradient(90deg, #BE1869, #6224BE)";

/* ─── Funnel Visual ─── */
const FunnelVisual = () => {
  const stages = [
    { label: "Prospecto", pct: "100%", conv: "68%", width: 100 },
    { label: "Calificado", pct: "68%", conv: "42%", width: 82 },
    { label: "Propuesta", pct: "29%", conv: "55%", width: 64 },
    { label: "Negociación", pct: "16%", conv: "63%", width: 48 },
    { label: "Cerrado", pct: "10%", conv: "—", width: 34 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      className="w-full max-w-[380px] mx-auto lg:mx-0 rounded-2xl p-6"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      <p className="text-[13px] font-bold text-white/50 uppercase tracking-[0.1em] mb-5">
        Funnel de ventas
      </p>
      <div className="space-y-2">
        {stages.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.5 + i * 0.15 }}
            className="flex items-center gap-3"
          >
            <div
              className="h-8 rounded-md flex items-center justify-center text-[11px] font-semibold text-white flex-shrink-0"
              style={{
                width: `${s.width}%`,
                background: GRADIENT,
                opacity: 1 - i * 0.12,
              }}
            >
              {s.label}
            </div>
            <span className="text-[13px] font-mono text-white/40 flex-shrink-0 w-10 text-right">
              {s.conv}
            </span>
          </motion.div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2 text-[11px] text-white/30">
        <span className="w-3 h-[2px] rounded-full" style={{ background: GRADIENT }} />
        Tasa de conversión entre etapas
      </div>
    </motion.div>
  );
};

/* ─── Problem Column ─── */
const ProblemCol = ({ icon, title, desc, delay }: { icon: string; title: string; desc: string; delay: number }) => (
  <motion.div {...fadeUp(delay)} className="text-center">
    <span className="text-[40px] block mb-4">{icon}</span>
    <h3 className="text-[16px] font-bold mb-2" style={{ color: "#1A1A2E" }}>{title}</h3>
    <p className="text-[14px] leading-[1.7]" style={{ color: "#6B7280" }}>{desc}</p>
  </motion.div>
);

/* ─── Deliverable Card ─── */
const DeliverableCard = ({
  num, title, description, tag, extraBadge, delay,
}: {
  num: string; title: string; description: string; tag: string; extraBadge?: string; delay: number;
}) => (
  <motion.div
    {...fadeUp(delay)}
    className="relative rounded-[20px] p-8 sm:p-10 overflow-hidden transition-shadow duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]"
    style={{ background: "#ffffff", border: "1px solid #E5E7EB" }}
  >
    <span
      className="absolute top-4 right-6 text-[64px] font-extrabold leading-none select-none pointer-events-none"
      style={{ background: GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", opacity: 0.12 }}
    >
      {num}
    </span>
    <h3 className="text-[20px] font-bold tracking-tight relative z-10" style={{ color: "#1A1A2E" }}>{title}</h3>
    <p className="mt-3 text-[15px] leading-[1.7] relative z-10" style={{ color: "#6B7280" }}>{description}</p>
    <div className="mt-5 flex items-center gap-2 relative z-10">
      <span className="inline-block text-[12px] font-medium px-3 py-1 rounded-full" style={{ background: "#F3F4F6", color: "#6B7280" }}>
        {tag}
      </span>
      {extraBadge && (
        <span
          className="inline-block text-[11px] font-bold px-3 py-1 rounded-full"
          style={{ background: "rgba(190,24,105,0.08)", color: "#BE1869" }}
        >
          {extraBadge}
        </span>
      )}
    </div>
  </motion.div>
);

/* ─── Timeline Step ─── */
const TimelineStep = ({ num, label, items, delay }: { num: string; label: string; items: string[]; delay: number }) => (
  <motion.div {...fadeUp(delay)} className="flex-1">
    <div className="flex items-center gap-4 mb-5">
      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ background: GRADIENT }}>
        {num}
      </div>
      <p className="text-[15px] sm:text-[17px] font-bold" style={{ color: "#1A1A2E" }}>{label}</p>
    </div>
    <div className="space-y-0 ml-14">
      {items.map((item, i) => (
        <div key={i} className="py-3 text-[15px]" style={{ color: "#6B7280", borderBottom: i < items.length - 1 ? "1px solid #F3F4F6" : "none" }}>
          {item}
        </div>
      ))}
    </div>
  </motion.div>
);

/* ─── Connector ─── */
const Connector = () => (
  <div className="flex items-center justify-center flex-shrink-0">
    <div className="hidden lg:block w-8 h-[2px]" style={{ background: GRADIENT }} />
    <div className="lg:hidden w-[2px] h-8" style={{ background: GRADIENT }} />
  </div>
);

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

/* ─── Result Item ─── */
const ResultItem = ({ num, text, delay }: { num: string; text: string; delay: number }) => (
  <motion.div {...fadeUp(delay)} className="flex-1 text-center sm:text-left">
    <span
      className="text-[36px] sm:text-[48px] font-extrabold tracking-tight block"
      style={{ background: GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
    >
      {num}
    </span>
    <p className="mt-2 text-[15px] leading-[1.6]" style={{ color: "rgba(255,255,255,0.7)" }}>{text}</p>
  </motion.div>
);

/* ═══════════════ PAGE ═══════════════ */
const DiagnosticoRevOps = () => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

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
              <span className="text-white/60">Diagnóstico RevOps</span>
            </motion.nav>

            <motion.span
              {...fadeUp(0.05)}
              className="inline-block text-[11px] font-bold uppercase tracking-[0.12em] px-4 py-1.5 rounded-full mb-6 text-white"
              style={{ background: GRADIENT }}
            >
              GROWTH
            </motion.span>

            <motion.h1
              {...fadeUp(0.1)}
              className="font-extrabold leading-[1.08] tracking-tight"
              style={{ color: "#ffffff", fontSize: "clamp(40px, 5.5vw, 60px)" }}
            >
              Ve exactamente dónde se rompe tu motor
            </motion.h1>

            <motion.p {...fadeUp(0.18)} className="mt-5 text-[17px] sm:text-[18px] leading-[1.7] max-w-[520px]" style={{ color: "rgba(255,255,255,0.7)" }}>
              Creciste, contrataste, compraste herramientas. Pero el pipeline sigue sin ser predecible. En 3 semanas tienes visibilidad completa — con números, no con intuiciones.
            </motion.p>

            <motion.div {...fadeUp(0.26)} className="mt-8 flex flex-wrap items-center gap-5">
              <Link
                to="#"
                className="inline-flex items-center text-[15px] font-semibold text-white transition-all duration-200 hover:shadow-[0_0_24px_rgba(190,24,105,0.4)] hover:scale-[1.03]"
                style={{ background: GRADIENT, borderRadius: 9999, padding: "14px 32px" }}
              >
                Agendar mi Diagnóstico →
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
            <FunnelVisual />
          </div>
        </div>
      </section>

      {/* ─── EL PROBLEMA ─── */}
      <section className="py-20 sm:py-[100px] px-6" style={{ background: "#ffffff" }}>
        <div className="max-w-[900px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            <ProblemCol
              icon="📈"
              title="Inversión sin respuesta proporcional"
              desc="Contrataste más gente y herramientas, pero el revenue no creció igual."
              delay={0.1}
            />
            <ProblemCol
              icon="🔮"
              title="Forecast que nadie cree"
              desc="Cada área reporta números distintos. Las decisiones se toman con información que nadie confía."
              delay={0.2}
            />
            <ProblemCol
              icon="⚡"
              title="Actividad sin claridad"
              desc="Hay reuniones, hay movimiento — pero sin visibilidad real de qué está funcionando."
              delay={0.3}
            />
          </div>

          <motion.div
            {...fadeUp(0.2)}
            className="mt-12 rounded-xl px-8 py-5 text-center"
            style={{ background: "rgba(190,24,105,0.06)" }}
          >
            <p className="text-[17px] sm:text-[18px] font-bold" style={{ color: "#1A1A2E" }}>
              Ese no es un problema de personas. Es un problema de sistema.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── QUÉ RECIBES ─── */}
      <section className="py-20 sm:py-[100px] px-6" style={{ background: "#F9FAFB" }}>
        <div className="max-w-[1100px] mx-auto">
          <motion.h2
            {...fadeUp(0)}
            className="text-[28px] sm:text-[32px] md:text-[36px] font-bold leading-[1.15] tracking-tight text-center"
            style={{ color: "#1A1A2E" }}
          >
            Lo que tienes al final de las 3 semanas
          </motion.h2>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
            <DeliverableCard
              num="01"
              title="Diagnóstico RevOps"
              description="Análisis completo de tu funnel con métricas reales. Oportunidades priorizadas por impacto económico."
              tag="15-20 páginas"
              delay={0.1}
            />
            <DeliverableCard
              num="02"
              title="Roadmap 90 días"
              description="Plan ejecutable con quick wins y acciones secuenciadas. Diseñado para saber si puedes implementarlo solo o necesitas apoyo externo."
              tag="Ejecutable en 90 días"
              delay={0.2}
            />
            <DeliverableCard
              num="03"
              title="RevOps Score"
              description="Tu nivel de madurez operativa en proceso, tecnología, datos y equipo."
              tag="4 dimensiones · con benchmarks"
              extraBadge="Incluido"
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* ─── CÓMO FUNCIONA ─── */}
      <section className="py-20 sm:py-[100px] px-6" style={{ background: "#ffffff" }}>
        <div className="max-w-[1100px] mx-auto">
          <motion.h2
            {...fadeUp(0)}
            className="text-[28px] sm:text-[32px] md:text-[36px] font-bold leading-[1.15] tracking-tight text-center mb-14"
            style={{ color: "#1A1A2E" }}
          >
            El proceso
          </motion.h2>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-4 items-stretch">
            <TimelineStep
              num="1"
              label="Semana 1 — Entramos a tu operación"
              items={["Kick-off con equipo clave", "Primeras 2 entrevistas", "Inicio auditoría CRM"]}
              delay={0.1}
            />
            <Connector />
            <TimelineStep
              num="2"
              label="Semana 2 — Encontramos lo que no se ve"
              items={["2 entrevistas restantes", "Auditoría completa CRM y herramientas", "Análisis y síntesis de hallazgos"]}
              delay={0.2}
            />
            <Connector />
            <TimelineStep
              num="3"
              label="Semana 3 — Te entregamos claridad ejecutiva"
              items={["Construcción de entregables", "Sesión entrega 60 min", "Sesión preguntas 45 min"]}
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* ─── PARA QUIÉN ES ─── */}
      <section id="para-quien" className="py-20 sm:py-[100px] px-6" style={{ background: "#F9FAFB" }}>
        <div className="max-w-[900px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <motion.div {...fadeUp(0.1)} className="rounded-2xl p-7 sm:p-8" style={{ background: "#ffffff", border: "1px solid #E5E7EB" }}>
            <h3 className="text-[20px] font-bold mb-6" style={{ color: "#1A1A2E" }}>Es para ti si:</h3>
            <div className="space-y-4">
              {[
                "Director Comercial, Head of Sales o CEO",
                "Equipo de ventas entre 4-15 personas",
                "Facturación $1.5M-$5M USD",
                "CRM implementado con brechas en adopción o visibilidad",
                "Necesitas visibilidad real, no más análisis internos",
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
                  <span className="text-[15px] leading-[1.6]" style={{ color: "#6B7280" }}>Operación simple con menos de 3 vendedores</span>
                </div>
                <div className="ml-7 mt-1.5"><ChipLink to="/revops-checkup" label="RevOps Checkup →" /></div>
              </div>
              <div>
                <div className="flex items-start gap-3">
                  <span className="text-[14px] mt-0.5 flex-shrink-0" style={{ color: "#6B7280" }}>→</span>
                  <span className="text-[15px] leading-[1.6]" style={{ color: "#6B7280" }}>Múltiples unidades de negocio o stack complejo</span>
                </div>
                <div className="ml-7 mt-1.5"><ChipLink to="/motor-de-ingresos" label="Motor de Ingresos →" /></div>
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
      <section className="py-16 sm:py-20 px-6" style={{ background: "#1A1A2E" }}>
        <div className="max-w-[800px] mx-auto text-center">
          <motion.h2
            {...fadeUp(0)}
            className="text-[26px] sm:text-[32px] md:text-[36px] font-bold leading-[1.15] tracking-tight"
            style={{ color: "#ffffff" }}
          >
            Al terminar, tienes lo que hoy no tienes
          </motion.h2>
          <div className="mt-12 flex flex-col sm:flex-row gap-10 sm:gap-8">
            <ResultItem num="01" text="Visibilidad completa de tu funnel con métricas reales" delay={0.1} />
            <ResultItem num="02" text="Los 5 problemas más costosos con causa raíz y evidencia" delay={0.2} />
            <ResultItem num="03" text="Un plan de 90 días que sabes exactamente cómo ejecutar" delay={0.3} />
          </div>
        </div>
      </section>

      {/* ─── PRECIO + CTA ─── */}
      <section className="py-16 sm:py-20 px-6" style={{ background: "#ffffff" }}>
        <div className="max-w-[480px] mx-auto">
          <motion.div
            {...fadeUp(0)}
            className="relative rounded-[20px] p-[2px]"
            style={{ background: GRADIENT, boxShadow: "0 24px 64px rgba(190,24,105,0.12)" }}
          >
            <div className="rounded-[18px] bg-white p-10 sm:p-12 text-center">
              <p className="text-[12px] font-bold uppercase tracking-[0.12em] mb-2" style={{ color: "#6B7280" }}>Inversión</p>
              <p className="text-[40px] font-extrabold tracking-tight" style={{ color: "#1A1A2E" }}>Desde 150 UF</p>
              <p className="text-[14px] mt-1" style={{ color: "#6B7280" }}>aprox. $5,700 USD</p>

              <div className="my-6 h-px" style={{ background: "#E5E7EB" }} />

              <p className="text-[13px] italic leading-[1.6]" style={{ color: "#6B7280" }}>
                Si vienes de un RevOps Checkup de los últimos 60 días, descontamos el valor pagado.
              </p>

              <Link
                to="#"
                className="mt-8 w-full inline-flex items-center justify-center text-[15px] font-semibold text-white transition-all duration-200 hover:shadow-[0_0_24px_rgba(190,24,105,0.4)] hover:scale-[1.02]"
                style={{ background: GRADIENT, borderRadius: 9999, padding: "14px 32px" }}
              >
                Agendar mi Diagnóstico →
              </Link>

              <Link
                to="#"
                className="block mt-4 text-[14px] font-medium transition-colors duration-200 hover:opacity-80"
                style={{ color: "#BE1869", textDecoration: "underline", textUnderlineOffset: "3px" }}
              >
                ¿No estás seguro de que este es tu nivel? Conversemos →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DiagnosticoRevOps;
