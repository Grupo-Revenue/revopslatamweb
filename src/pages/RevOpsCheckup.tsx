import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, useMotionValue, useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";

/* ─── animation helper ─── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true, margin: "-60px" } as const,
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

const GRADIENT = "linear-gradient(90deg, #BE1869, #6224BE)";

/* ─── Floating deliverable card ─── */
const DeliverableCard = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, delay: 0.4 }}
    className="w-full max-w-[340px] mx-auto lg:mx-0"
    style={{ animation: "floatCard 3s ease-in-out infinite" }}
  >
    <style>{`@keyframes floatCard { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }`}</style>
    <div
      className="rounded-2xl p-6"
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <p className="text-[14px] font-bold text-white mb-4">Lo que recibes</p>
      <div className="space-y-3">
        {["Diagnóstico Express (8-12 págs.)", "Plan de Acción 30 días"].map((item) => (
          <div key={item} className="flex items-start gap-3">
            <span
              className="mt-0.5 text-sm font-bold flex-shrink-0"
              style={{
                background: GRADIENT,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              ✓
            </span>
            <span className="text-[14px] text-white/80">{item}</span>
          </div>
        ))}
      </div>
      <p className="mt-5 text-[13px]" style={{ color: "rgba(255,255,255,0.5)" }}>
        2 semanas · desde 80 UF
      </p>
    </div>
  </motion.div>
);

/* ─── Deliverable Card (Section 3) ─── */
const BigDeliverableCard = ({
  num,
  title,
  description,
  tag,
  delay,
}: {
  num: string;
  title: string;
  description: string;
  tag: string;
  delay: number;
}) => (
  <motion.div
    {...fadeUp(delay)}
    className="relative rounded-[20px] p-8 sm:p-10 overflow-hidden transition-shadow duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]"
    style={{
      background: "#ffffff",
      border: "1px solid #E5E7EB",
    }}
  >
    <span
      className="absolute top-4 right-6 text-[64px] font-extrabold leading-none select-none pointer-events-none"
      style={{
        background: GRADIENT,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        opacity: 0.12,
      }}
    >
      {num}
    </span>
    <h3 className="text-[20px] font-bold tracking-tight relative z-10" style={{ color: "#1A1A2E" }}>
      {title}
    </h3>
    <p className="mt-3 text-[15px] leading-[1.7] relative z-10" style={{ color: "#6B7280" }}>
      {description}
    </p>
    <span
      className="inline-block mt-5 text-[12px] font-medium px-3 py-1 rounded-full relative z-10"
      style={{ background: "#F3F4F6", color: "#6B7280" }}
    >
      {tag}
    </span>
  </motion.div>
);

/* ─── Timeline Step ─── */
const TimelineStep = ({
  num,
  label,
  items,
  delay,
}: {
  num: string;
  label: string;
  items: string[];
  delay: number;
}) => (
  <motion.div {...fadeUp(delay)} className="flex-1">
    <div className="flex items-center gap-4 mb-5">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
        style={{ background: GRADIENT }}
      >
        {num}
      </div>
      <p className="text-[16px] sm:text-[18px] font-bold" style={{ color: "#1A1A2E" }}>
        {label}
      </p>
    </div>
    <div className="space-y-0 ml-14">
      {items.map((item, i) => (
        <div
          key={i}
          className="py-3 text-[15px]"
          style={{
            color: "#6B7280",
            borderBottom: i < items.length - 1 ? "1px solid #F3F4F6" : "none",
          }}
        >
          {item}
        </div>
      ))}
    </div>
  </motion.div>
);

/* ─── Timeline connector ─── */
const TimelineConnector = () => {
  const ref = useRef<SVGSVGElement>(null);
  const lineRef = useRef<SVGLineElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView && lineRef.current) {
      lineRef.current.style.transition = "stroke-dashoffset 1.2s ease-out";
      lineRef.current.style.strokeDashoffset = "0";
    }
  }, [isInView]);

  return (
    <svg ref={ref} className="hidden lg:block w-full h-[2px] my-auto" style={{ minWidth: 40 }}>
      <defs>
        <linearGradient id="connGrad">
          <stop offset="0%" stopColor="#BE1869" />
          <stop offset="100%" stopColor="#6224BE" />
        </linearGradient>
      </defs>
      <line
        ref={lineRef}
        x1="0"
        y1="1"
        x2="100%"
        y2="1"
        stroke="url(#connGrad)"
        strokeWidth="2"
        strokeDasharray="200"
        strokeDashoffset="200"
      />
    </svg>
  );
};

/* ─── Result item ─── */
const ResultItem = ({ num, text, delay }: { num: string; text: string; delay: number }) => (
  <motion.div {...fadeUp(delay)} className="flex-1 text-center sm:text-left">
    <span
      className="text-[36px] sm:text-[48px] font-extrabold tracking-tight block"
      style={{
        background: GRADIENT,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      {num}
    </span>
    <p className="mt-2 text-[15px] leading-[1.6]" style={{ color: "rgba(255,255,255,0.7)" }}>
      {text}
    </p>
  </motion.div>
);

/* ─── Chip link ─── */
const ChipLink = ({ to, label }: { to: string; label: string }) => (
  <Link
    to={to}
    className="inline-flex items-center text-[12px] font-semibold px-3 py-1 rounded-full transition-all duration-200 mt-1.5"
    style={{
      background: "rgba(190,24,105,0.08)",
      color: "#BE1869",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = GRADIENT;
      e.currentTarget.style.color = "#fff";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "rgba(190,24,105,0.08)";
      e.currentTarget.style.color = "#BE1869";
    }}
  >
    {label}
  </Link>
);

/* ═══════════════ PAGE ═══════════════ */
const RevOpsCheckup = () => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* ─── SECTION 1: HERO ─── */}
      <section className="relative overflow-hidden pt-32 sm:pt-40 pb-20 sm:pb-28 px-6" style={{ background: "#1A1A2E" }}>
        <div className="max-w-[1100px] mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left */}
          <div className="flex-1 lg:max-w-[55%]">
            {/* Breadcrumb */}
            <motion.nav {...fadeUp(0)} className="flex items-center gap-2 text-[12px] mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>
              <Link to="/conoce-tu-pista" className="hover:text-white/60 transition-colors">Conoce tu pista</Link>
              <span>→</span>
              <span className="text-white/60">RevOps Checkup</span>
            </motion.nav>

            {/* Badge */}
            <motion.span
              {...fadeUp(0.05)}
              className="inline-block text-[11px] font-bold uppercase tracking-[0.12em] px-4 py-1.5 rounded-full mb-6"
              style={{ background: "rgba(255,255,255,0.1)", color: "#fff" }}
            >
              STARTER
            </motion.span>

            {/* H1 */}
            <motion.h1
              {...fadeUp(0.1)}
              className="font-extrabold leading-[1.08] tracking-tight"
              style={{ color: "#ffffff", fontSize: "clamp(40px, 5.5vw, 60px)" }}
            >
              Claridad en 2 semanas
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              {...fadeUp(0.18)}
              className="mt-5 text-[17px] sm:text-[18px] leading-[1.7] max-w-[520px]"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              Estás vendiendo, algo entra — pero no sabes por qué a veces funciona y a veces no. En 2 semanas tienes la respuesta exacta.
            </motion.p>

            {/* CTAs */}
            <motion.div {...fadeUp(0.26)} className="mt-8 flex flex-wrap items-center gap-5">
              <Link
                to="#"
                className="inline-flex items-center text-[15px] font-semibold text-white transition-all duration-200 hover:shadow-[0_0_24px_rgba(190,24,105,0.4)] hover:scale-[1.03]"
                style={{ background: GRADIENT, borderRadius: 9999, padding: "14px 32px" }}
              >
                Agendar mi Checkup →
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

          {/* Right */}
          <div className="flex-1 lg:max-w-[45%] flex justify-center">
            <DeliverableCard />
          </div>
        </div>
      </section>

      {/* ─── SECTION 2: EL PROBLEMA ─── */}
      <section className="py-20 sm:py-[100px] px-6" style={{ background: "#ffffff" }}>
        <div className="max-w-[640px] mx-auto text-center">
          <motion.h2
            {...fadeUp(0)}
            className="text-[30px] sm:text-[36px] font-bold leading-[1.15] tracking-tight"
            style={{ color: "#1A1A2E" }}
          >
            Cuando crecer a ojo ya no alcanza
          </motion.h2>
          <motion.p {...fadeUp(0.1)} className="mt-6 text-[16px] leading-[1.7] max-w-[600px] mx-auto" style={{ color: "#6B7280" }}>
            En la etapa temprana, vender con intuición funciona. Pero llega un punto donde eso ya no escala — y no sabes exactamente dónde está el techo.
          </motion.p>
          <motion.div
            {...fadeUp(0.18)}
            className="mt-8 inline-block rounded-full px-6 py-3"
            style={{ background: "rgba(190,24,105,0.08)" }}
          >
            <p className="text-[15px] font-semibold" style={{ color: "#BE1869" }}>
              ¿Es el proceso? ¿La herramienta? ¿El mensaje? ¿El cliente?
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── SECTION 3: QUÉ RECIBES ─── */}
      <section className="py-20 sm:py-[100px] px-6" style={{ background: "#F9FAFB" }}>
        <div className="max-w-[1000px] mx-auto">
          <motion.h2
            {...fadeUp(0)}
            className="text-[28px] sm:text-[32px] md:text-[36px] font-bold leading-[1.15] tracking-tight text-center"
            style={{ color: "#1A1A2E" }}
          >
            Lo que tienes al final de las 2 semanas
          </motion.h2>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <BigDeliverableCard
              num="01"
              title="Diagnóstico Express"
              description="Una fotografía real de tu proceso comercial: cómo llegan tus oportunidades, dónde se pierden, qué herramientas tienes y cómo las estás usando."
              tag="8-12 páginas"
              delay={0.1}
            />
            <BigDeliverableCard
              num="02"
              title="Plan de Acción 30 días"
              description="Las 5 acciones prioritarias ordenadas por impacto, con el paso a paso para ejecutarlas tú mismo. Sin roadmaps de 6 meses que nadie implementa."
              tag="5-8 páginas · ejecutable solo"
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: CÓMO FUNCIONA ─── */}
      <section className="py-20 sm:py-[100px] px-6" style={{ background: "#ffffff" }}>
        <div className="max-w-[900px] mx-auto">
          <motion.h2
            {...fadeUp(0)}
            className="text-[28px] sm:text-[32px] md:text-[36px] font-bold leading-[1.15] tracking-tight text-center mb-14"
            style={{ color: "#1A1A2E" }}
          >
            El proceso
          </motion.h2>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-6 items-stretch">
            <TimelineStep
              num="1"
              label="Semana 1 — Entendemos tu operación"
              items={[
                "Kick-off 60 min",
                "2 entrevistas clave",
                "Revisión CRM y herramientas",
              ]}
              delay={0.1}
            />
            <div className="flex items-center justify-center lg:w-16 flex-shrink-0">
              <TimelineConnector />
              {/* Mobile vertical line */}
              <div
                className="lg:hidden w-[2px] h-10"
                style={{ background: GRADIENT }}
              />
            </div>
            <TimelineStep
              num="2"
              label="Semana 2 — Te entregamos claridad"
              items={[
                "Análisis de hallazgos",
                "Construcción de entregables",
                "Sesión de entrega 60 min",
                "Sesión de preguntas (30 min)",
              ]}
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* ─── SECTION 5: PARA QUIÉN ES ─── */}
      <section id="para-quien" className="py-20 sm:py-[100px] px-6" style={{ background: "#F9FAFB" }}>
        <div className="max-w-[900px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Es para ti */}
          <motion.div
            {...fadeUp(0.1)}
            className="rounded-2xl p-7 sm:p-8"
            style={{ background: "#ffffff", border: "1px solid #E5E7EB" }}
          >
            <h3 className="text-[20px] font-bold mb-6" style={{ color: "#1A1A2E" }}>Es para ti si:</h3>
            <div className="space-y-4">
              {[
                "Eres founder, CEO o responsable de ventas",
                "Tu equipo comercial tiene 1-3 personas",
                "Facturación entre $500K y $1.5M USD",
                "Usas herramientas pero sin proceso estructurado",
                "Necesitas claridad rápida",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="text-[14px] mt-0.5 flex-shrink-0" style={{ color: "#22C55E" }}>✓</span>
                  <span className="text-[15px] leading-[1.6]" style={{ color: "#6B7280" }}>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* No es para ti */}
          <motion.div
            {...fadeUp(0.2)}
            className="rounded-2xl p-7 sm:p-8"
            style={{ background: "#ffffff", border: "1px solid #E5E7EB" }}
          >
            <h3 className="text-[20px] font-bold mb-6" style={{ color: "#1A1A2E" }}>No es para ti si:</h3>
            <div className="space-y-5">
              <div>
                <div className="flex items-start gap-3">
                  <span className="text-[14px] mt-0.5 flex-shrink-0" style={{ color: "#6B7280" }}>→</span>
                  <span className="text-[15px] leading-[1.6]" style={{ color: "#6B7280" }}>
                    Tienes más de 5 vendedores
                  </span>
                </div>
                <div className="ml-7 mt-1.5">
                  <ChipLink to="/diagnostico-revops" label="Diagnóstico RevOps →" />
                </div>
              </div>
              <div>
                <div className="flex items-start gap-3">
                  <span className="text-[14px] mt-0.5 flex-shrink-0" style={{ color: "#6B7280" }}>→</span>
                  <span className="text-[15px] leading-[1.6]" style={{ color: "#6B7280" }}>
                    Múltiples equipos o stack complejo
                  </span>
                </div>
                <div className="ml-7 mt-1.5">
                  <ChipLink to="/motor-de-ingresos" label="Motor de Ingresos →" />
                </div>
              </div>
              <div>
                <div className="flex items-start gap-3">
                  <span className="text-[14px] mt-0.5 flex-shrink-0" style={{ color: "#6B7280" }}>→</span>
                  <span className="text-[15px] leading-[1.6]" style={{ color: "#6B7280" }}>
                    Ya sabes qué cambiar, necesitas ejecución
                  </span>
                </div>
                <div className="ml-7 mt-1.5">
                  <ChipLink to="#" label="Diseña y Construye →" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── SECTION 6: RESULTADO ─── */}
      <section className="py-16 sm:py-20 px-6" style={{ background: "#1A1A2E" }}>
        <div className="max-w-[700px] mx-auto text-center">
          <motion.h2
            {...fadeUp(0)}
            className="text-[26px] sm:text-[32px] md:text-[36px] font-bold leading-[1.15] tracking-tight"
            style={{ color: "#ffffff" }}
          >
            Al terminar, sabes tres cosas que hoy no sabes
          </motion.h2>

          <div className="mt-12 flex flex-col sm:flex-row gap-10 sm:gap-8">
            <ResultItem
              num="01"
              text="Cuál es tu mayor fuga de revenue y dónde ocurre"
              delay={0.1}
            />
            <ResultItem
              num="02"
              text="Si la herramienta que tienes es suficiente o la estás pagando de más"
              delay={0.2}
            />
            <ResultItem
              num="03"
              text="Tus 5 acciones de mayor impacto, en orden"
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* ─── SECTION 7: PRECIO + CTA ─── */}
      <section className="py-16 sm:py-20 px-6" style={{ background: "#ffffff" }}>
        <div className="max-w-[480px] mx-auto">
          <motion.div
            {...fadeUp(0)}
            className="relative rounded-[20px] p-[2px]"
            style={{
              background: GRADIENT,
              boxShadow: "0 24px 64px rgba(190,24,105,0.12)",
            }}
          >
            <div className="rounded-[18px] bg-white p-10 sm:p-12 text-center">
              <p className="text-[12px] font-bold uppercase tracking-[0.12em] mb-2" style={{ color: "#6B7280" }}>
                Inversión
              </p>
              <p className="text-[40px] font-extrabold tracking-tight" style={{ color: "#1A1A2E" }}>
                Desde 80 UF
              </p>
              <p className="text-[14px] mt-1" style={{ color: "#6B7280" }}>
                aprox. $3,000 USD
              </p>

              <div className="my-6 h-px" style={{ background: "#E5E7EB" }} />

              <p className="text-[13px] italic leading-[1.6]" style={{ color: "#6B7280" }}>
                Si continúas con un Diagnóstico RevOps en los siguientes 30 días, descontamos el valor del Checkup.
              </p>

              <Link
                to="#"
                className="mt-8 w-full inline-flex items-center justify-center text-[15px] font-semibold text-white transition-all duration-200 hover:shadow-[0_0_24px_rgba(190,24,105,0.4)] hover:scale-[1.02]"
                style={{ background: GRADIENT, borderRadius: 9999, padding: "14px 32px" }}
              >
                Agendar mi Checkup →
              </Link>

              <Link
                to="#"
                className="block mt-4 text-[14px] font-medium transition-colors duration-200 hover:opacity-80"
                style={{ color: "#BE1869", textDecoration: "underline", textUnderlineOffset: "3px" }}
              >
                Conversemos primero, sin compromiso →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RevOpsCheckup;
