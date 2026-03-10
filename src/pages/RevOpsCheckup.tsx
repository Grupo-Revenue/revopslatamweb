import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { usePageSections } from "@/hooks/usePageSections";
import { useSectionStyles } from "@/hooks/useSectionStyles";
import { useSectionBackground } from "@/hooks/useSectionBackground";
import type { HomeSection } from "@/hooks/useHomeSections";
import BackgroundOrbs from "@/components/services/BackgroundOrbs";
import SectionDivider from "@/components/services/SectionDivider";
import DotPattern from "@/components/services/DotPattern";
import GradientMesh from "@/components/services/GradientMesh";
import NoiseOverlay from "@/components/services/NoiseOverlay";


const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true, margin: "-60px" } as const,
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

const GRADIENT = "linear-gradient(90deg, #BE1869, #6224BE)";

function m(section?: HomeSection): Record<string, unknown> {
  return (section?.metadata as Record<string, unknown>) ?? {};
}

function SectionShell({ section, className, defaultBg, children }: {
  section?: HomeSection; className: string; defaultBg?: React.CSSProperties; children: React.ReactNode;
}) {
  const { getBgStyle } = useSectionStyles(section);
  const { hasBg, bgLayerStyle } = useSectionBackground(section);
  return (
    <section className={`relative overflow-hidden ${className}`} style={{ ...(defaultBg ?? {}), ...getBgStyle() }}>
      {hasBg && <div style={bgLayerStyle} />}
      {children}
    </section>
  );
}

/* ─── Floating deliverable card ─── */
const DeliverableCard = ({ data }: { data: { title: string; items: string[]; footer: string } }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, delay: 0.4 }}
    className="w-full max-w-[340px] mx-auto lg:mx-0"
    style={{ animation: "floatCard 3s ease-in-out infinite" }}
  >
    <style>{`@keyframes floatCard { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }`}</style>
    <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
      <p className="text-[15px] font-bold text-white mb-4">{data.title}</p>
      <div className="space-y-3">
        {data.items.map((item) => (
          <div key={item} className="flex items-start gap-3">
            <span className="mt-0.5 text-sm font-bold flex-shrink-0" style={{ background: GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>✓</span>
            <span className="text-[15px] text-white/80">{item}</span>
          </div>
        ))}
      </div>
      <p className="mt-5 text-[14px]" style={{ color: "rgba(255,255,255,0.5)" }}>{data.footer}</p>
    </div>
  </motion.div>
);

/* ─── Deliverable Card (Section 3) ─── */
const BigDeliverableCard = ({ num, title, description, tag, delay }: {
  num: string; title: string; description: string; tag: string; delay: number;
}) => (
  <motion.div
    {...fadeUp(delay)}
    className="relative rounded-[20px] p-8 sm:p-10 overflow-hidden transition-shadow duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]"
    style={{ background: "#ffffff", border: "1px solid #E5E7EB" }}
  >
    <span className="absolute top-4 right-6 text-[64px] font-extrabold leading-none select-none pointer-events-none" style={{ background: GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", opacity: 0.12 }}>
      {num}
    </span>
    <h3 className="text-[20px] font-bold tracking-tight relative z-10" style={{ color: "#1A1A2E" }}>{title}</h3>
    <p className="mt-3 text-base leading-[1.7] relative z-10" style={{ color: "#6B7280" }}>{description}</p>
    <span className="inline-block mt-5 text-[13px] font-medium px-3 py-1 rounded-full relative z-10" style={{ background: "#F3F4F6", color: "#6B7280" }}>{tag}</span>
  </motion.div>
);

/* ─── Timeline Step ─── */
const TimelineStep = ({ num, label, items, delay }: { num: string; label: string; items: string[]; delay: number }) => (
  <motion.div {...fadeUp(delay)} className="flex-1">
    <div className="flex items-center gap-4 mb-5">
      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[15px] font-bold flex-shrink-0" style={{ background: GRADIENT }}>{num}</div>
      <p className="text-base sm:text-[18px] font-bold" style={{ color: "#1A1A2E" }}>{label}</p>
    </div>
    <div className="space-y-0 ml-14">
      {items.map((item, i) => (
        <div key={i} className="py-3 text-base" style={{ color: "#6B7280", borderBottom: i < items.length - 1 ? "1px solid #F3F4F6" : "none" }}>{item}</div>
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
      <defs><linearGradient id="connGrad"><stop offset="0%" stopColor="#BE1869" /><stop offset="100%" stopColor="#6224BE" /></linearGradient></defs>
      <line ref={lineRef} x1="0" y1="1" x2="100%" y2="1" stroke="url(#connGrad)" strokeWidth="2" strokeDasharray="200" strokeDashoffset="200" />
    </svg>
  );
};

/* ─── Result item ─── */
const ResultItem = ({ num, text, delay }: { num: string; text: string; delay: number }) => (
  <motion.div {...fadeUp(delay)} className="flex-1 text-center sm:text-left">
    <span className="text-[36px] sm:text-[48px] font-extrabold tracking-tight block" style={{ background: GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{num}</span>
    <p className="mt-2 text-base leading-[1.6]" style={{ color: "rgba(255,255,255,0.7)" }}>{text}</p>
  </motion.div>
);

/* ─── Chip link ─── */
const ChipLink = ({ to, label }: { to: string; label: string }) => (
  <Link
    to={to}
    className="inline-flex items-center text-[13px] font-semibold px-3 py-1 rounded-full transition-all duration-200 mt-1.5"
    style={{ background: "rgba(190,24,105,0.08)", color: "#BE1869" }}
    onMouseEnter={(e) => { e.currentTarget.style.background = GRADIENT; e.currentTarget.style.color = "#fff"; }}
    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(190,24,105,0.08)"; e.currentTarget.style.color = "#BE1869"; }}
  >
    {label}
  </Link>
);

/* ─── Defaults ─── */
const DEF = {
  hero: { title: "Claridad en 2 semanas", subtitle: "Estás vendiendo, algo entra — pero no sabes por qué a veces funciona y a veces no. En 2 semanas tienes la respuesta exacta.", cta_text: "Agendar mi Checkup →", badge: "STARTER", breadcrumb_parent: "Conoce tu pista", breadcrumb_current: "RevOps Checkup", deliverable_card: { title: "Lo que recibes", items: ["Diagnóstico Express (8-12 págs.)", "Plan de Acción 30 días"], footer: "2 semanas · desde 80 UF" } },
  problema: { title: "Cuando crecer a ojo ya no alcanza", body: "En la etapa temprana, vender con intuición funciona. Pero llega un punto donde eso ya no escala — y no sabes exactamente dónde está el techo.", highlight: "¿Es el proceso? ¿La herramienta? ¿El mensaje? ¿El cliente?" },
  entregables: { title: "Lo que tienes al final de las 2 semanas", cards: [{ num: "01", title: "Diagnóstico Express", description: "Una fotografía real de tu proceso comercial: cómo llegan tus oportunidades, dónde se pierden, qué herramientas tienes y cómo las estás usando.", tag: "8-12 páginas" }, { num: "02", title: "Plan de Acción 30 días", description: "Las 5 acciones prioritarias ordenadas por impacto, con el paso a paso para ejecutarlas tú mismo. Sin roadmaps de 6 meses que nadie implementa.", tag: "5-8 páginas · ejecutable solo" }] },
  proceso: { title: "El proceso", steps: [{ num: "1", label: "Semana 1 — Entendemos tu operación", items: ["Kick-off 60 min", "2 entrevistas clave", "Revisión CRM y herramientas"] }, { num: "2", label: "Semana 2 — Te entregamos claridad", items: ["Análisis de hallazgos", "Construcción de entregables", "Sesión de entrega 60 min", "Sesión de preguntas (30 min)"] }] },
  paraQuien: { for_you_title: "Es para ti si:", for_you_items: ["Eres founder, CEO o responsable de ventas", "Tu equipo comercial tiene 1-3 personas", "Facturación entre $500K y $1.5M USD", "Usas herramientas pero sin proceso estructurado", "Necesitas claridad rápida"], not_for_you_title: "No es para ti si:", not_for_you_items: [{ text: "Tienes más de 5 vendedores", chip_label: "Diagnóstico RevOps →", chip_href: "/diagnostico-revops" }, { text: "Múltiples equipos o stack complejo", chip_label: "Motor de Ingresos →", chip_href: "/motor-de-ingresos" }, { text: "Ya sabes qué cambiar, necesitas ejecución", chip_label: "Diseña y Construye →", chip_href: "#" }] },
  resultado: { title: "Al terminar, sabes tres cosas que hoy no sabes", items: [{ num: "01", text: "Cuál es tu mayor fuga de revenue y dónde ocurre" }, { num: "02", text: "Si la herramienta que tienes es suficiente o la estás pagando de más" }, { num: "03", text: "Tus 5 acciones de mayor impacto, en orden" }] },
  precio: { price: "Desde 80 UF", price_sub: "aprox. $3,000 USD", note: "Si continúas con un Diagnóstico RevOps en los siguientes 30 días, descontamos el valor del Checkup.", cta_text: "Agendar mi Checkup →", cta2_text: "Conversemos primero, sin compromiso →" },
};

/* ═══════════════ PAGE ═══════════════ */
const RevOpsCheckup = () => {
  const { getSection, loading } = usePageSections("revops-checkup");

  const hero = getSection("hero");
  const problema = getSection("problema");
  const entregables = getSection("entregables");
  const proceso = getSection("proceso");
  const paraQuien = getSection("para-quien");
  const resultado = getSection("resultado");
  const precio = getSection("precio");

  const hm = m(hero);
  const pm = m(problema);
  const em = m(entregables);
  const prm = m(proceso);
  const pqm = m(paraQuien);
  const rm = m(resultado);
  const pcm = m(precio);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) { window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" }); }
  };

  const { getStyle: heroStyle } = useSectionStyles(hero);
  const { getStyle: probStyle } = useSectionStyles(problema);
  const { getStyle: entStyle } = useSectionStyles(entregables);
  const { getStyle: procStyle } = useSectionStyles(proceso);
  const { getStyle: resStyle } = useSectionStyles(resultado);

  if (loading) return <div className="min-h-screen" style={{ background: "#1A1A2E" }} />;

  const breadcrumbParent = (hm.breadcrumb_parent as string) ?? DEF.hero.breadcrumb_parent;
  const breadcrumbParentUrl = (hm.breadcrumb_parent_url as string) ?? "/conoce-tu-pista";
  const breadcrumbCurrent = (hm.breadcrumb_current as string) ?? DEF.hero.breadcrumb_current;
  const badge = (hm.badge as string) ?? DEF.hero.badge;
  const cta2Text = (hm.cta2_text as string) ?? "¿Es este el diagnóstico correcto para mí? ↓";
  const cta2Target = (hm.cta2_scroll_target as string) ?? "para-quien";
  const delivCard = (hm.deliverable_card as { title: string; items: string[]; footer: string }) ?? DEF.hero.deliverable_card;

  const cards = (em.cards as Array<{ num: string; title: string; description: string; tag: string }>) ?? DEF.entregables.cards;
  const steps = (prm.steps as Array<{ num: string; label: string; items: string[] }>) ?? DEF.proceso.steps;

  const forYouTitle = (pqm.for_you_title as string) ?? DEF.paraQuien.for_you_title;
  const forYouItems = (pqm.for_you_items as string[]) ?? DEF.paraQuien.for_you_items;
  const notForYouTitle = (pqm.not_for_you_title as string) ?? DEF.paraQuien.not_for_you_title;
  const notForYouItems = (pqm.not_for_you_items as Array<{ text: string; chip_label: string; chip_href: string }>) ?? DEF.paraQuien.not_for_you_items;

  const resultItems = (rm.items as Array<{ num: string; text: string }>) ?? DEF.resultado.items;
  const priceData = {
    price: (pcm.price as string) ?? DEF.precio.price,
    price_sub: (pcm.price_sub as string) ?? DEF.precio.price_sub,
    note: (pcm.note as string) ?? DEF.precio.note,
    cta_text: precio?.cta_text ?? DEF.precio.cta_text,
    cta_url: precio?.cta_url ?? "#",
    cta2_text: (pcm.cta2_text as string) ?? DEF.precio.cta2_text,
    cta2_url: (pcm.cta2_url as string) ?? "#",
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* ─── HERO ─── */}
      <SectionShell section={hero} className="pt-32 sm:pt-40 pb-20 sm:pb-28 px-6" defaultBg={{ background: "#1A1A2E" }}>
        <BackgroundOrbs variant="hero" />
        <div className="relative z-10 max-w-[1100px] mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-1 lg:max-w-[55%]">
            <motion.nav {...fadeUp(0)} className="flex items-center gap-2 text-[13px] mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>
              <Link to={breadcrumbParentUrl} className="hover:text-white/60 transition-colors">{breadcrumbParent}</Link>
              <span>→</span>
              <span className="text-white/60">{breadcrumbCurrent}</span>
            </motion.nav>
            <motion.span {...fadeUp(0.05)} className="inline-block text-[12px] font-bold uppercase tracking-[0.12em] px-4 py-1.5 rounded-full mb-6" style={{ background: (hm.badge_bg as string) || "rgba(255,255,255,0.1)", color: (hm.badge_color as string) || "#fff" }}>{badge}</motion.span>
            <motion.h1 {...fadeUp(0.1)} className="font-extrabold leading-[1.08] tracking-tight" style={{ color: "#ffffff", fontSize: "clamp(40px, 5.5vw, 60px)", ...heroStyle("title") }}>
              {hero?.title ?? DEF.hero.title}
            </motion.h1>
            <motion.p {...fadeUp(0.18)} className="mt-5 text-[17px] sm:text-[18px] leading-[1.7] max-w-[520px]" style={{ color: "rgba(255,255,255,0.7)", ...heroStyle("body") }}>
              {hero?.subtitle ?? DEF.hero.subtitle}
            </motion.p>
            <motion.div {...fadeUp(0.26)} className="mt-8 flex flex-wrap items-center gap-5">
              <Link to={hero?.cta_url ?? "#"} className="inline-flex items-center text-[15px] font-semibold text-white transition-all duration-200 hover:shadow-[0_0_24px_rgba(190,24,105,0.4)] hover:scale-[1.03]" style={{ background: GRADIENT, borderRadius: 9999, padding: "14px 32px" }}>
                {hero?.cta_text ?? DEF.hero.cta_text}
              </Link>
              <button onClick={() => scrollToSection(cta2Target)} className="text-[15px] font-medium transition-colors duration-200 hover:text-white" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "underline", textUnderlineOffset: "3px" }}>
                {cta2Text}
              </button>
            </motion.div>
          </div>
          <div className="flex-1 lg:max-w-[45%] flex justify-center">
            <DeliverableCard data={delivCard} />
          </div>
        </div>
      </SectionShell>

      <WaveDivider fromColor="#1A1A2E" toColor="#ffffff" />

      {/* ─── PROBLEMA ─── */}
      <SectionShell section={problema} className="py-24 sm:py-[120px] px-6" defaultBg={{ background: "#ffffff" }}>
        <GradientMesh variant="light" />
        <NoiseOverlay />
        <div className="relative z-10 max-w-[640px] mx-auto text-center">
          <motion.h2 {...fadeUp(0)} className="text-[30px] sm:text-[36px] font-bold leading-[1.15] tracking-tight" style={{ color: "#1A1A2E", ...probStyle("title") }}>
            {problema?.title ?? DEF.problema.title}
          </motion.h2>
          <motion.p {...fadeUp(0.1)} className="mt-6 text-[16px] leading-[1.7] max-w-[600px] mx-auto" style={{ color: "#6B7280", ...probStyle("body") }}>
            {problema?.body ?? DEF.problema.body}
          </motion.p>
          <motion.div {...fadeUp(0.18)} className="mt-8 inline-block rounded-full px-6 py-3" style={{ background: "rgba(190,24,105,0.08)" }}>
            <p className="text-[15px] font-semibold" style={{ color: "#BE1869" }}>
              {(pm.highlight as string) ?? DEF.problema.highlight}
            </p>
          </motion.div>
        </div>
      </SectionShell>

      <SectionDivider />

      {/* ─── ENTREGABLES ─── */}
      <SectionShell section={entregables} className="py-24 sm:py-[120px] px-6" defaultBg={{ background: "#F9FAFB" }}>
        <DotPattern />
        <GradientMesh variant="muted" />
        <NoiseOverlay />
        <div className="relative z-10 max-w-[1000px] mx-auto">
          <motion.h2 {...fadeUp(0)} className="text-[28px] sm:text-[32px] md:text-[36px] font-bold leading-[1.15] tracking-tight text-center" style={{ color: "#1A1A2E", ...entStyle("title") }}>
            {entregables?.title ?? DEF.entregables.title}
          </motion.h2>
          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {cards.map((c, i) => (
              <BigDeliverableCard key={i} num={c.num} title={c.title} description={c.description} tag={c.tag} delay={0.1 + i * 0.1} />
            ))}
          </div>
        </div>
      </SectionShell>

      {/* ─── PROCESO ─── */}
      <SectionShell section={proceso} className="py-20 sm:py-[100px] px-6" defaultBg={{ background: "#ffffff" }}>
        <div className="relative z-10 max-w-[900px] mx-auto">
          <motion.h2 {...fadeUp(0)} className="text-[28px] sm:text-[32px] md:text-[36px] font-bold leading-[1.15] tracking-tight text-center mb-14" style={{ color: "#1A1A2E", ...procStyle("title") }}>
            {proceso?.title ?? DEF.proceso.title}
          </motion.h2>
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-6 items-stretch">
            {steps.map((step, i) => (
              <div key={i} className="contents">
                {i > 0 && (
                  <div className="flex items-center justify-center lg:w-16 flex-shrink-0">
                    <TimelineConnector />
                    <div className="lg:hidden w-[2px] h-10" style={{ background: GRADIENT }} />
                  </div>
                )}
                <TimelineStep num={step.num} label={step.label} items={step.items} delay={0.1 + i * 0.1} />
              </div>
            ))}
          </div>
        </div>
      </SectionShell>

      {/* ─── PARA QUIÉN ES ─── */}
      <SectionShell section={paraQuien} className="py-20 sm:py-[100px] px-6" defaultBg={{ background: "#F9FAFB" }}>
        <div className="relative z-10 max-w-[900px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8" id="para-quien">
          <motion.div {...fadeUp(0.1)} className="rounded-2xl p-7 sm:p-8" style={{ background: "#ffffff", border: "1px solid #E5E7EB" }}>
            <h3 className="text-[20px] font-bold mb-6" style={{ color: "#1A1A2E" }}>{forYouTitle}</h3>
            <div className="space-y-4">
              {forYouItems.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="text-[15px] mt-0.5 flex-shrink-0" style={{ color: "#22C55E" }}>✓</span>
                  <span className="text-base leading-[1.6]" style={{ color: "#6B7280" }}>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div {...fadeUp(0.2)} className="rounded-2xl p-7 sm:p-8" style={{ background: "#ffffff", border: "1px solid #E5E7EB" }}>
            <h3 className="text-[20px] font-bold mb-6" style={{ color: "#1A1A2E" }}>{notForYouTitle}</h3>
            <div className="space-y-5">
              {notForYouItems.map((item, i) => (
                <div key={i}>
                  <div className="flex items-start gap-3">
                    <span className="text-[15px] mt-0.5 flex-shrink-0" style={{ color: "#6B7280" }}>→</span>
                    <span className="text-base leading-[1.6]" style={{ color: "#6B7280" }}>{item.text}</span>
                  </div>
                  <div className="ml-7 mt-1.5"><ChipLink to={item.chip_href} label={item.chip_label} /></div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </SectionShell>

      {/* ─── RESULTADO ─── */}
      <SectionShell section={resultado} className="py-16 sm:py-20 px-6" defaultBg={{ background: "#1A1A2E" }}>
        <div className="relative z-10 max-w-[700px] mx-auto text-center">
          <motion.h2 {...fadeUp(0)} className="text-[26px] sm:text-[32px] md:text-[36px] font-bold leading-[1.15] tracking-tight" style={{ color: "#ffffff", ...resStyle("title") }}>
            {resultado?.title ?? DEF.resultado.title}
          </motion.h2>
          <div className="mt-12 flex flex-col sm:flex-row gap-10 sm:gap-8">
            {resultItems.map((item, i) => (
              <ResultItem key={i} num={item.num} text={item.text} delay={0.1 + i * 0.1} />
            ))}
          </div>
        </div>
      </SectionShell>

      {/* ─── PRECIO + CTA ─── */}
      <SectionShell section={precio} className="py-16 sm:py-20 px-6" defaultBg={{ background: "#ffffff" }}>
        <div className="relative z-10 max-w-[480px] mx-auto">
          <motion.div {...fadeUp(0)} className="relative rounded-[20px] p-[2px]" style={{ background: GRADIENT, boxShadow: "0 24px 64px rgba(190,24,105,0.12)" }}>
            <div className="rounded-[18px] bg-white p-10 sm:p-12 text-center">
              <p className="text-[13px] font-bold uppercase tracking-[0.12em] mb-2" style={{ color: "#6B7280" }}>Inversión</p>
              <p className="text-[40px] font-extrabold tracking-tight" style={{ color: "#1A1A2E" }}>{priceData.price}</p>
              <p className="text-[15px] mt-1" style={{ color: "#6B7280" }}>{priceData.price_sub}</p>
              <div className="my-6 h-px" style={{ background: "#E5E7EB" }} />
              <p className="text-[14px] italic leading-[1.6]" style={{ color: "#6B7280" }}>{priceData.note}</p>
              <Link to={priceData.cta_url} className="mt-8 w-full inline-flex items-center justify-center text-[15px] font-semibold text-white transition-all duration-200 hover:shadow-[0_0_24px_rgba(190,24,105,0.4)] hover:scale-[1.02]" style={{ background: GRADIENT, borderRadius: 9999, padding: "14px 32px" }}>
                {priceData.cta_text}
              </Link>
              <Link to={priceData.cta2_url} className="block mt-4 text-[15px] font-medium transition-colors duration-200 hover:opacity-80" style={{ color: "#BE1869", textDecoration: "underline", textUnderlineOffset: "3px" }}>
                {priceData.cta2_text}
              </Link>
            </div>
          </motion.div>
        </div>
      </SectionShell>

      <Footer />
    </div>
  );
};

export default RevOpsCheckup;
