import { useLeadForm } from "@/hooks/useLeadForm";
import { motion } from "framer-motion";
import { usePageSections } from "@/hooks/usePageSections";
import { useSectionStyles } from "@/hooks/useSectionStyles";
import type { HomeSection } from "@/hooks/useHomeSections";
import logoBlanco from "@/assets/Logo_REVOPSLATAM_Blanco_color.png";
import { Check, ArrowRight, AlertTriangle, BarChart3, RefreshCw } from "lucide-react";

/* ─── helpers ─── */
const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true, margin: "-40px" } as const,
  transition: { duration: 0.45, delay, ease: "easeOut" as const },
});

function meta(s?: HomeSection): Record<string, unknown> {
  return (s?.metadata as Record<string, unknown>) ?? {};
}

const GRADIENT = "linear-gradient(135deg, #BE1869, #6224BE)";

/* ─── default data ─── */
const DEF = {
  hero: {
    badge: "Conoce tu pista",
    title: "Cada mes se pierden negocios.\nNosotros encontramos dónde.",
    subtitle: "En Revops LATAM no llegamos a decirte que tienes problemas, llegamos a mostrarte cuáles son, dónde están y cuánto te están costando. Con metodología, con datos y con 14 años en el mercado chileno.",
    cta_text: "Quiero conversar mi caso →",
    cta_url: "#diagnosticos",
  },
  problema: {
    title: "Estos síntomas te suenan?",
    stat_cards: [
      { icon: "alert", text: "Pipeline impredecible: no sabes qué vas a cerrar este mes" },
      { icon: "chart", text: "Datos inconsistentes: cada área tiene su propia verdad" },
      { icon: "loop", text: "Inversión sin retorno claro: gastas pero no puedes medir" },
    ],
    highlight: "El problema casi nunca es la gente. Casi siempre es el sistema.",
  },
  queRecibes: {
    title: "Qué recibes al terminar",
    items: [
      { num: "01", title: "Mapa de tu operación comercial", desc: "Cómo funciona hoy tu proceso de ventas: etapas, responsables, herramientas y dónde se pierde la información." },
      { num: "02", title: "Reporte de oportunidades con impacto", desc: "Dónde se están cayendo los negocios, cuánto vale cada fuga y qué tiene más sentido resolver primero." },
      { num: "03", title: "Roadmap de 90 días", desc: "Las acciones prioritarias en orden, con responsables sugeridos y KPIs para medir el avance." },
    ],
  },
  diagnosticos: {
    title: "Tu diagnóstico en 3 semanas",
    subtitle: "Visión completa de dónde se pierden tus negocios, con números reales y un plan concreto para corregirlo.",
    growth_badge: "GROWTH · El más elegido",
    growth_tagline: "Si tienes entre 3 y 10 vendedores, este es tu diagnóstico.",
    growth_title: "Diagnóstico RevOps",
    growth_subtitle: "Visión completa en 3 semanas",
    growth_description: "Para empresas con equipos comerciales de 3 a 15 vendedores que necesitan visibilidad real de su operación.",
    growth_price: "Desde 150 UF",
    growth_cta: "Quiero mi diagnóstico →",
    alternativa_text: "¿Tu realidad es distinta? Tenemos otros planes para equipos más pequeños y para operaciones más complejas. Lo mejor es contarnos tu situación, en 15 minutos encontramos el enfoque correcto para ti.",
    alternativa_cta: "Conversemos tu caso →",
  },
  credibility: {
    title: "El diagnóstico no es un gasto. Es el inicio.",
    body_1: "El 70% de nuestros clientes continúa con implementación después del diagnóstico.",
    body_2: "No porque los convenzamos — porque el diagnóstico muestra oportunidades que no querían dejar pasar.",
    stats: [{ value: "14 años", label: "de experiencia" }, { value: "Platinum", label: "HubSpot Partners" }, { value: "Cientos", label: "de equipos alineados" }],
  },
  ctaFinal: {
    title: "¿Listo para saber dónde se pierden tus negocios?",
    subtitle: "En 15 minutos te mostramos si el Diagnóstico RevOps es lo que necesitas y cómo funciona el proceso.",
    cta_text: "Quiero agendar mi diagnóstico →",
    cta_url: "#",
  },
};

/* ─── Icon map ─── */
const iconMap: Record<string, React.ReactNode> = {
  alert: <AlertTriangle size={20} className="text-pink-400" />,
  chart: <BarChart3 size={20} className="text-purple-400" />,
  loop: <RefreshCw size={20} className="text-blue-400" />,
};

/* ═══════════════ LANDING PAGE ═══════════════ */
const ConoceTuPistaLanding = () => {
  const { openLeadForm } = useLeadForm();
  const { getSection, loading } = usePageSections("lp-conoce-tu-pista");

  const hero = getSection("hero");
  const problema = getSection("problema");
  const queRecibes = getSection("que-recibes");
  const diagnosticos = getSection("diagnosticos");
  const credibility = getSection("credibility");
  const ctaFinal = getSection("cta-final");

  const hm = meta(hero);
  const pm = meta(problema);
  const qrm = meta(queRecibes);
  const dm = meta(diagnosticos);
  const crm = meta(credibility);

  const { getStyle: heroStyle } = useSectionStyles(hero);
  const { getStyle: cfStyle } = useSectionStyles(ctaFinal);

  if (loading) return <div className="min-h-screen" style={{ background: "#0D0D1A" }} />;

  /* resolved data */
  const h = {
    badge: (hm.badge as string) ?? DEF.hero.badge,
    title: hero?.title ?? DEF.hero.title,
    subtitle: hero?.subtitle ?? DEF.hero.subtitle,
    cta_text: hero?.cta_text ?? DEF.hero.cta_text,
    cta_url: hero?.cta_url ?? DEF.hero.cta_url,
  };

  const p = {
    title: problema?.title ?? DEF.problema.title,
    highlight: (pm.highlight as string) ?? DEF.problema.highlight,
    stat_cards: (pm.stat_cards as Array<{ icon: string; text: string }>) ?? DEF.problema.stat_cards,
  };

  const qr = {
    title: queRecibes?.title ?? DEF.queRecibes.title,
    items: (qrm.items as Array<{ num: string; title: string; desc: string }>) ?? DEF.queRecibes.items,
  };

  const d = {
    title: diagnosticos?.title ?? DEF.diagnosticos.title,
    subtitle: diagnosticos?.subtitle ?? DEF.diagnosticos.subtitle,
    growth_badge: (dm.growth_badge as string) ?? DEF.diagnosticos.growth_badge,
    growth_tagline: (dm.growth_tagline as string) ?? DEF.diagnosticos.growth_tagline,
    growth_title: (dm.growth_title as string) ?? DEF.diagnosticos.growth_title,
    growth_subtitle: (dm.growth_subtitle as string) ?? DEF.diagnosticos.growth_subtitle,
    growth_description: (dm.growth_description as string) ?? DEF.diagnosticos.growth_description,
    growth_price: (dm.growth_price as string) ?? DEF.diagnosticos.growth_price,
    growth_cta: (dm.growth_cta as string) ?? DEF.diagnosticos.growth_cta,
    alternativa_text: (dm.alternativa_text as string) ?? DEF.diagnosticos.alternativa_text,
    alternativa_cta: (dm.alternativa_cta as string) ?? DEF.diagnosticos.alternativa_cta,
  };

  const cr = {
    title: credibility?.title ?? DEF.credibility.title,
    body_1: (crm.body_1 as string) ?? DEF.credibility.body_1,
    body_2: (crm.body_2 as string) ?? DEF.credibility.body_2,
    stats: (crm.stats as Array<{ value: string; label: string }>) ?? DEF.credibility.stats,
  };

  const cf = {
    title: ctaFinal?.title ?? DEF.ctaFinal.title,
    subtitle: ctaFinal?.subtitle ?? DEF.ctaFinal.subtitle,
    cta_text: ctaFinal?.cta_text ?? DEF.ctaFinal.cta_text,
    cta_url: ctaFinal?.cta_url ?? DEF.ctaFinal.cta_url,
  };

  const handleHeroCTA = () => openLeadForm("lp-conoce-hero");
  const handleFinalCTA = () => openLeadForm("lp-conoce-cta-final");

  const heroTitle = (() => {
    const lb = hm.title_line_break as string;
    if (lb && h.title.includes(lb)) {
      const idx = h.title.indexOf(lb);
      return h.title.slice(0, idx).trimEnd() + "\n" + h.title.slice(idx);
    }
    return h.title;
  })();

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Lexend', sans-serif" }}>

      {/* ════ HERO ════ */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(180deg, #0D0D1A 0%, #151528 100%)" }}>
        <div className="absolute pointer-events-none" style={{ width: 300, height: 300, top: -80, left: "50%", transform: "translateX(-50%)", background: "radial-gradient(circle, rgba(190,24,105,0.12) 0%, transparent 70%)", filter: "blur(80px)" }} />

        <div className="relative z-10 px-5 pt-16 pb-12 sm:px-8 sm:pt-24 sm:pb-20 max-w-[600px] mx-auto text-center">
          <motion.img {...fade(0)} src={logoBlanco} alt="Revops LATAM" className="h-7 mx-auto mb-10 sm:h-8 sm:mb-12" />

          <motion.span
            {...fade(0.05)}
            className="inline-block text-[12px] font-bold uppercase tracking-[0.14em] px-4 py-1.5 rounded-full mb-5"
            style={{ background: "rgba(190,24,105,0.12)", color: "#E84393", border: "1px solid rgba(190,24,105,0.25)" }}
          >
            {h.badge}
          </motion.span>

          <motion.h1
            {...fade(0.1)}
            className="font-extrabold leading-[1.1] tracking-tight whitespace-pre-line"
            style={{ color: "#fff", fontSize: "clamp(28px, 7vw, 52px)", ...heroStyle("title") }}
          >
            {heroTitle}
          </motion.h1>

          <motion.p
            {...fade(0.15)}
            className="mt-4 text-[16px] sm:text-[17px] leading-[1.65]"
            style={{ color: "rgba(255,255,255,0.65)", ...heroStyle("body") }}
          >
            {h.subtitle}
          </motion.p>

          <motion.p
            {...fade(0.18)}
            className="mt-4 text-[13px] tracking-wide"
            style={{ color: "rgba(255,255,255,0.38)" }}
          >
            Diagnóstico RevOps · 3 semanas · Desde 150 UF
          </motion.p>

          <motion.div {...fade(0.2)} className="mt-7">
            <button
              onClick={handleHeroCTA}
              className="w-full sm:w-auto text-[15px] font-semibold text-white px-7 py-3.5 rounded-full transition-transform active:scale-[0.97] whitespace-nowrap"
              style={{ background: GRADIENT, boxShadow: "0 4px 24px rgba(190,24,105,0.35)" }}
            >
              {h.cta_text}
            </button>
          </motion.div>
        </div>
      </section>

      {/* ════ QUÉ RECIBES ════ */}
      <section className="px-5 py-14 sm:px-8 sm:py-20" style={{ background: "#fff" }}>
        <div className="max-w-[520px] mx-auto">
          <motion.h2
            {...fade(0)}
            className="text-[24px] sm:text-[28px] font-bold leading-[1.15] tracking-tight text-center"
            style={{ color: "#1A1A2E" }}
          >
            {qr.title}
          </motion.h2>

          <div className="mt-8 flex flex-col gap-4">
            {qr.items.map((item, i) => (
              <motion.div
                key={i}
                {...fade(0.05 + i * 0.06)}
                className="flex gap-4 p-5 rounded-2xl"
                style={{ background: "#F8F9FB", border: "1px solid #F0F1F3" }}
              >
                <span
                  className="text-[20px] font-extrabold leading-none mt-0.5 flex-shrink-0"
                  style={{ background: GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                >
                  {item.num}
                </span>
                <div>
                  <h3 className="text-[16px] font-bold" style={{ color: "#1A1A2E" }}>{item.title}</h3>
                  <p className="mt-1.5 text-[14px] sm:text-[15px] leading-[1.6]" style={{ color: "#6B7280" }}>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ DIAGNÓSTICO GROWTH ════ */}
      <section id="diagnosticos" className="px-5 py-14 sm:px-8 sm:py-20" style={{ background: "#F8F9FB" }}>
        <div className="max-w-[520px] mx-auto">
          <motion.h2
            {...fade(0)}
            className="text-[24px] sm:text-[28px] font-bold leading-[1.15] tracking-tight text-center"
            style={{ color: "#1A1A2E" }}
          >
            {d.title}
          </motion.h2>
          <motion.p
            {...fade(0.05)}
            className="mt-3 text-[15px] sm:text-[16px] leading-[1.6] text-center"
            style={{ color: "#6B7280" }}
          >
            {d.subtitle}
          </motion.p>

          <motion.div
            {...fade(0.1)}
            className="mt-8 rounded-2xl p-[2px]"
            style={{ background: GRADIENT }}
          >
            <div className="rounded-[14px] p-6 sm:p-8 flex flex-col" style={{ background: "#fff" }}>
              <span
                className="self-start text-[11px] font-bold uppercase tracking-[0.12em] px-3 py-1 rounded-full text-white"
                style={{ background: GRADIENT }}
              >
                {d.growth_badge}
              </span>

              <p className="text-[13px] mt-3" style={{ background: GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {d.growth_tagline}
              </p>

              <h3 className="text-[22px] sm:text-[26px] font-bold mt-2" style={{ color: "#1A1A2E" }}>
                {d.growth_title}
              </h3>
              <p className="text-[15px] font-semibold mt-0.5" style={{ background: GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {d.growth_subtitle}
              </p>

              <p className="mt-4 text-[15px] sm:text-[16px] leading-[1.6]" style={{ color: "#6B7280" }}>
                {d.growth_description}
              </p>

              <p className="mt-5 text-[24px] sm:text-[28px] font-extrabold" style={{ color: "#1A1A2E" }}>
                {d.growth_price}
              </p>

              <button
                onClick={() => openLeadForm("lp-conoce-growth")}
                className="mt-5 w-full text-[15px] font-semibold text-white py-3.5 rounded-full transition-transform active:scale-[0.97]"
                style={{ background: GRADIENT, boxShadow: "0 4px 24px rgba(190,24,105,0.35)" }}
              >
                {d.growth_cta}
              </button>
            </div>
          </motion.div>

          <motion.div {...fade(0.18)} className="mt-8 flex flex-col items-center text-center">
            <p className="text-[15px] sm:text-[16px] leading-[1.65] max-w-[420px]" style={{ color: "#6B7280" }}>
              {d.alternativa_text}
            </p>
            <button
              onClick={() => openLeadForm("lp-conoce-alternativa")}
              className="mt-4 text-[14px] font-semibold px-6 py-2.5 rounded-full transition-all active:scale-[0.97] hover:opacity-90"
              style={{ color: "#BE1869", border: "1.5px solid rgba(190,24,105,0.35)", background: "transparent" }}
            >
              {d.alternativa_cta}
            </button>
          </motion.div>
        </div>
      </section>

      {/* ════ CREDIBILITY ════ */}
      <section className="px-5 py-14 sm:px-8 sm:py-20" style={{ background: "#0D0D1A" }}>
        <div className="max-w-[520px] mx-auto text-center">
          <motion.h2
            {...fade(0)}
            className="text-[24px] sm:text-[28px] font-bold leading-[1.15] tracking-tight"
            style={{ color: "#fff" }}
          >
            {cr.title}
          </motion.h2>
          <motion.p
            {...fade(0.08)}
            className="mt-5 text-[15px] sm:text-[16px] leading-[1.7]"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            {cr.body_1}
          </motion.p>
          <motion.p
            {...fade(0.12)}
            className="mt-2 text-[15px] sm:text-[16px] leading-[1.7]"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            {cr.body_2}
          </motion.p>

          <div className="mt-10 grid grid-cols-3 gap-4">
            {cr.stats.map((s, i) => (
              <motion.div key={i} {...fade(0.1 + i * 0.06)} className="text-center">
                <p className="text-[22px] sm:text-[28px] font-extrabold tracking-tight" style={{ background: GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {s.value}
                </p>
                <p className="text-[12px] sm:text-[13px] mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ CTA FINAL + FOOTER ════ */}
      <div>
        <section className="px-5 py-14 pb-24 sm:pb-20 sm:px-8 sm:py-20" style={{ background: "#fff" }}>
          <div className="max-w-[480px] mx-auto text-center">
            <motion.h2
              {...fade(0)}
              className="text-[24px] sm:text-[28px] font-bold leading-[1.15] tracking-tight"
              style={{ color: "#1A1A2E", ...cfStyle("title") }}
            >
              {cf.title}
            </motion.h2>
            <motion.p
              {...fade(0.08)}
              className="mt-3 text-[15px] sm:text-[16px] leading-[1.6]"
              style={{ color: "#6B7280", ...cfStyle("body") }}
            >
              {cf.subtitle}
            </motion.p>
            <motion.div {...fade(0.15)} className="mt-7">
              <button
                onClick={handleFinalCTA}
                className="w-full sm:w-auto text-[15px] font-semibold text-white px-7 py-3.5 rounded-full transition-transform active:scale-[0.97] whitespace-nowrap"
                style={{ background: GRADIENT, boxShadow: "0 4px 24px rgba(190,24,105,0.3)", ...cfStyle("cta") }}
              >
                {cf.cta_text}
              </button>
            </motion.div>
          </div>
        </section>

        <footer className="py-6 text-center" style={{ background: "#0A0A14", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <img src={logoBlanco} alt="Revops LATAM" className="h-5 mx-auto mb-2" />
          <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.25)" }}>
            © 2026 Revops LATAM. Todos los derechos reservados.
          </p>
        </footer>
      </div>

    </div>
  );
};

export default ConoceTuPistaLanding;
