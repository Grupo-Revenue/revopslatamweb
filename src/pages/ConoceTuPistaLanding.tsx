import { useLeadForm } from "@/hooks/useLeadForm";
import { motion } from "framer-motion";
import { usePageSections } from "@/hooks/usePageSections";
import { useSectionStyles } from "@/hooks/useSectionStyles";
import type { HomeSection } from "@/hooks/useHomeSections";
import logoBlanco from "@/assets/Logo_REVOPSLATAM_Blanco_color.png";
import { Check, ArrowRight, AlertTriangle, BarChart3, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

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
    title: "¿Tu operación comercial\ndebería rendir más?",
    subtitle: "Descubre exactamente qué frena tu crecimiento con un diagnóstico RevOps diseñado para empresas en Chile.",
    cta_text: "Quiero mi diagnóstico →",
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
  diagnosticos: {
    title: "Elige tu diagnóstico",
    subtitle: "El nivel correcto depende de tu tamaño y complejidad.",
    cards: [
      { badge: "STARTER", title: "RevOps Checkup", tagline: "Claridad en 2 semanas", description: "Para equipos pequeños que necesitan claridad rápida.", price: "Desde 80 UF", duration: "2 semanas", href: "/revops-checkup", highlighted: false, badgeHighlight: false },
      { badge: "GROWTH · MÁS ELEGIDO", title: "Diagnóstico RevOps", tagline: "Visión completa en 3 semanas", description: "Para empresas en crecimiento que necesitan un diagnóstico profundo.", price: "Desde 150 UF", duration: "3 semanas", href: "/diagnostico-revops", highlighted: true, badgeHighlight: true },
      { badge: "ENTERPRISE", title: "Motor de Ingresos", tagline: "Transformación en 5 semanas", description: "Para operaciones complejas con múltiples equipos y herramientas.", price: "Desde 250 UF", duration: "5 semanas", href: "/motor-de-ingresos", highlighted: false, badgeHighlight: false },
    ],
  },
  porQue: {
    title: "¿Por qué diagnosticar primero?",
    body: "El 70% de nuestros clientes continúan con un proyecto después del diagnóstico. No porque los convenzamos, sino porque revela oportunidades concretas.",
    stats: [{ value: "14 años", label: "de experiencia" }, { value: "Platinum", label: "HubSpot Partners" }, { value: "Cientos", label: "de equipos alineados" }],
  },
  ctaFinal: {
    title: "¿No sabes cuál necesitas?",
    subtitle: "En 15 minutos te ayudamos a elegir, sin compromiso.",
    cta_text: "Agendar conversación gratuita →",
    cta_url: "#",
  },
};

type CardData = {
  badge: string; badgeHighlight?: boolean; title: string; tagline: string;
  description: string; price: string; duration: string; href: string; highlighted?: boolean;
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
  const { getSection, loading } = usePageSections("conoce-tu-pista");

  const hero = getSection("hero");
  const problema = getSection("problema");
  const diagnosticos = getSection("diagnosticos");
  const porQue = getSection("por-que-diagnosticar");
  const ctaFinal = getSection("cta-final");

  const hm = meta(hero);
  const pm = meta(problema);
  const dm = meta(diagnosticos);
  const pqm = meta(porQue);

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

  const d = {
    title: diagnosticos?.title ?? DEF.diagnosticos.title,
    subtitle: diagnosticos?.subtitle ?? DEF.diagnosticos.subtitle,
    cards: (dm.cards as CardData[]) ?? DEF.diagnosticos.cards,
  };

  const pq = {
    title: porQue?.title ?? DEF.porQue.title,
    body: porQue?.body ?? DEF.porQue.body,
    stats: (pqm.stats as Array<{ value: string; label: string }>) ?? DEF.porQue.stats,
  };

  const cf = {
    title: ctaFinal?.title ?? DEF.ctaFinal.title,
    subtitle: ctaFinal?.subtitle ?? DEF.ctaFinal.subtitle,
    cta_text: ctaFinal?.cta_text ?? DEF.ctaFinal.cta_text,
    cta_url: ctaFinal?.cta_url ?? DEF.ctaFinal.cta_url,
  };

  const ctaOpensForm = meta(ctaFinal).cta1_opens_lead_form === true;
  const heroOpensForm = hm.cta1_opens_lead_form === true;

  const handleHeroCTA = () => {
    if (heroOpensForm) return openLeadForm("lp-conoce-hero");
    if (h.cta_url?.startsWith("#")) {
      document.getElementById(h.cta_url.slice(1))?.scrollIntoView({ behavior: "smooth" });
    } else if (h.cta_url) {
      window.location.href = h.cta_url;
    }
  };

  const handleFinalCTA = () => {
    if (ctaOpensForm) return openLeadForm("lp-conoce-cta-final");
    if (cf.cta_url?.startsWith("#")) {
      document.getElementById(cf.cta_url.slice(1))?.scrollIntoView({ behavior: "smooth" });
    } else if (cf.cta_url) {
      window.location.href = cf.cta_url;
    }
  };

  /* Sort cards: highlighted first on mobile */
  const sortedCards = [...d.cards].sort((a, b) => (b.highlighted ? 1 : 0) - (a.highlighted ? 1 : 0));

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
        {/* Subtle glow */}
        <div className="absolute pointer-events-none" style={{ width: 300, height: 300, top: -80, left: "50%", transform: "translateX(-50%)", background: "radial-gradient(circle, rgba(190,24,105,0.12) 0%, transparent 70%)", filter: "blur(80px)" }} />

        <div className="relative z-10 px-5 pt-16 pb-12 sm:px-8 sm:pt-24 sm:pb-20 max-w-[600px] mx-auto text-center">
          {/* Logo */}
          <motion.img {...fade(0)} src={logoBlanco} alt="Revops LATAM" className="h-7 mx-auto mb-10 sm:h-8 sm:mb-12" />

          {/* Badge */}
          <motion.span
            {...fade(0.05)}
            className="inline-block text-[11px] font-bold uppercase tracking-[0.14em] px-4 py-1.5 rounded-full mb-5"
            style={{ background: "rgba(190,24,105,0.12)", color: "#E84393", border: "1px solid rgba(190,24,105,0.25)" }}
          >
            {h.badge}
          </motion.span>

          {/* Title */}
          <motion.h1
            {...fade(0.1)}
            className="font-extrabold leading-[1.1] tracking-tight whitespace-pre-line"
            style={{ color: "#fff", fontSize: "clamp(28px, 7vw, 52px)", ...heroStyle("title") }}
          >
            {heroTitle}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            {...fade(0.15)}
            className="mt-4 text-[15px] sm:text-[17px] leading-[1.65]"
            style={{ color: "rgba(255,255,255,0.65)", ...heroStyle("body") }}
          >
            {h.subtitle}
          </motion.p>

          {/* CTA */}
          <motion.div {...fade(0.2)} className="mt-7">
            <button
              onClick={handleHeroCTA}
              className="w-full sm:w-auto text-[15px] font-semibold text-white px-8 py-4 rounded-full transition-transform active:scale-[0.97]"
              style={{ background: GRADIENT, boxShadow: "0 4px 24px rgba(190,24,105,0.35)" }}
            >
              {h.cta_text}
            </button>
          </motion.div>

          {/* Trust line */}
          <motion.div {...fade(0.25)} className="mt-6 flex items-center justify-center gap-2">
            <Check size={14} style={{ color: "#1CA398" }} />
            <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.4)" }}>
              Sin compromiso · Respuesta en 24h
            </span>
          </motion.div>
        </div>
      </section>

      {/* ════ PAIN POINTS ════ */}
      <section className="px-5 py-14 sm:px-8 sm:py-20" style={{ background: "#fff" }}>
        <div className="max-w-[520px] mx-auto">
          <motion.h2
            {...fade(0)}
            className="text-[22px] sm:text-[28px] font-bold leading-[1.15] tracking-tight"
            style={{ color: "#1A1A2E" }}
          >
            {p.title}
          </motion.h2>

          <div className="mt-6 flex flex-col gap-3">
            {p.stat_cards.map((sc, i) => (
              <motion.div
                key={i}
                {...fade(0.05 + i * 0.05)}
                className="flex items-start gap-3.5 p-4 rounded-xl"
                style={{ background: "#F8F9FB", border: "1px solid #F0F1F3" }}
              >
                <span className="mt-0.5 flex-shrink-0">
                  {iconMap[sc.icon] || <span className="text-lg">{sc.icon}</span>}
                </span>
                <span className="text-[14px] sm:text-[15px] leading-[1.5] font-medium" style={{ color: "#374151" }}>
                  {sc.text}
                </span>
              </motion.div>
            ))}
          </div>

          <motion.p
            {...fade(0.2)}
            className="mt-6 text-[15px] font-bold leading-[1.5] p-4 rounded-xl border-l-4"
            style={{ color: "#1A1A2E", background: "linear-gradient(90deg, rgba(190,24,105,0.06), transparent)", borderColor: "#BE1869" }}
          >
            {p.highlight}
          </motion.p>
        </div>
      </section>

      {/* ════ DIAGNÓSTICOS ════ */}
      <section id="diagnosticos" className="px-5 py-14 sm:px-8 sm:py-20" style={{ background: "#F8F9FB" }}>
        <div className="max-w-[520px] mx-auto">
          <motion.h2
            {...fade(0)}
            className="text-[22px] sm:text-[28px] font-bold leading-[1.15] tracking-tight text-center"
            style={{ color: "#1A1A2E" }}
          >
            {d.title}
          </motion.h2>
          <motion.p
            {...fade(0.05)}
            className="mt-3 text-[14px] sm:text-[15px] leading-[1.6] text-center"
            style={{ color: "#6B7280" }}
          >
            {d.subtitle}
          </motion.p>

          <div className="mt-8 flex flex-col gap-4">
            {sortedCards.map((card, i) => (
              <motion.div
                key={i}
                {...fade(0.05 + i * 0.06)}
                className="relative rounded-2xl p-[2px]"
                style={{ background: card.highlighted ? GRADIENT : "transparent" }}
              >
                <div
                  className="rounded-[14px] p-5 sm:p-6 flex flex-col"
                  style={{ background: "#fff", border: card.highlighted ? "none" : "1px solid #E5E7EB" }}
                >
                  {/* Badge row */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="text-[10px] font-bold uppercase tracking-[0.12em] px-3 py-1 rounded-full"
                      style={card.badgeHighlight
                        ? { background: GRADIENT, color: "#fff" }
                        : { background: "#F3F4F6", color: "#6B7280" }
                      }
                    >
                      {card.badge}
                    </span>
                    <span className="text-[12px] font-medium" style={{ color: "#9CA3AF" }}>{card.duration}</span>
                  </div>

                  {/* Title & tagline */}
                  <h3 className="text-[18px] font-bold" style={{ color: "#1A1A2E" }}>{card.title}</h3>
                  <p className="text-[13px] font-semibold mt-0.5" style={{ background: GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    {card.tagline}
                  </p>

                  {/* Description */}
                  <p className="mt-3 text-[13px] sm:text-[14px] leading-[1.6]" style={{ color: "#6B7280" }}>
                    {card.description}
                  </p>

                  {/* Price + CTA row */}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[18px] font-bold" style={{ color: "#1A1A2E" }}>{card.price}</span>
                    <Link
                      to={card.href}
                      className="inline-flex items-center gap-1.5 text-[13px] font-semibold transition-colors"
                      style={{ color: "#BE1869" }}
                    >
                      Ver más <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ CREDIBILITY ════ */}
      <section className="px-5 py-14 sm:px-8 sm:py-20" style={{ background: "#0D0D1A" }}>
        <div className="max-w-[520px] mx-auto text-center">
          <motion.h2
            {...fade(0)}
            className="text-[22px] sm:text-[28px] font-bold leading-[1.15] tracking-tight"
            style={{ color: "#fff" }}
          >
            {pq.title}
          </motion.h2>
          <motion.p
            {...fade(0.08)}
            className="mt-4 text-[14px] sm:text-[15px] leading-[1.7]"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            {pq.body.split("\n\n")[0]}
          </motion.p>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-3 gap-4">
            {pq.stats.map((s, i) => (
              <motion.div key={i} {...fade(0.1 + i * 0.06)} className="text-center">
                <p className="text-[22px] sm:text-[28px] font-extrabold tracking-tight" style={{ background: GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {s.value}
                </p>
                <p className="text-[11px] sm:text-[12px] mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ CTA FINAL ════ */}
      <section className="px-5 py-14 sm:px-8 sm:py-20" style={{ background: "#fff" }}>
        <div className="max-w-[480px] mx-auto text-center">
          <motion.h2
            {...fade(0)}
            className="text-[22px] sm:text-[28px] font-bold leading-[1.15] tracking-tight"
            style={{ color: "#1A1A2E", ...cfStyle("title") }}
          >
            {cf.title}
          </motion.h2>
          <motion.p
            {...fade(0.08)}
            className="mt-3 text-[14px] sm:text-[15px] leading-[1.6]"
            style={{ color: "#6B7280", ...cfStyle("body") }}
          >
            {cf.subtitle}
          </motion.p>
          <motion.div {...fade(0.15)} className="mt-7">
            <button
              onClick={handleFinalCTA}
              className="w-full sm:w-auto text-[15px] font-semibold text-white px-8 py-4 rounded-full transition-transform active:scale-[0.97]"
              style={{ background: GRADIENT, boxShadow: "0 4px 24px rgba(190,24,105,0.3)", ...cfStyle("cta") }}
            >
              {cf.cta_text}
            </button>
          </motion.div>
          <motion.div {...fade(0.2)} className="mt-4 flex items-center justify-center gap-2">
            <Check size={14} style={{ color: "#1CA398" }} />
            <span className="text-[12px]" style={{ color: "#9CA3AF" }}>
              Sin compromiso · Respuesta en 24h
            </span>
          </motion.div>
        </div>
      </section>

      {/* ════ MINIMAL FOOTER ════ */}
      <footer className="py-6 text-center" style={{ background: "#0A0A14", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <img src={logoBlanco} alt="Revops LATAM" className="h-5 mx-auto mb-2" />
        <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.25)" }}>
          © 2026 Revops LATAM. Todos los derechos reservados.
        </p>
      </footer>

      {/* ════ STICKY MOBILE CTA ════ */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 sm:hidden px-4 pb-4 pt-2"
        style={{ background: "linear-gradient(to top, rgba(255,255,255,1) 70%, rgba(255,255,255,0))" }}
      >
        <button
          onClick={handleHeroCTA}
          className="w-full text-[15px] font-semibold text-white py-3.5 rounded-full transition-transform active:scale-[0.97]"
          style={{ background: GRADIENT, boxShadow: "0 4px 20px rgba(190,24,105,0.4)" }}
        >
          {h.cta_text}
        </button>
      </div>
    </div>
  );
};

export default ConoceTuPistaLanding;
