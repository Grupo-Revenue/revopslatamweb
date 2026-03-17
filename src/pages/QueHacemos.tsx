import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Search, Wrench, Settings, Brain,
  Building2, BarChart3, Megaphone, Heart, Cog,
  ArrowRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PistaStorySticky from "@/components/landing/PistaStorySticky";
import { useLeadForm } from "@/hooks/useLeadForm";
import { usePageSections } from "@/hooks/usePageSections";
import { useSectionStyles } from "@/hooks/useSectionStyles";
import { useSectionBackground } from "@/hooks/useSectionBackground";
import DynamicCTA from "@/components/DynamicCTA";
import type { HomeSection } from "@/hooks/useHomeSections";

/* ─── Helpers ─── */
const GRADIENT = "linear-gradient(135deg, #BE1869, #6224BE)";

const ICON_MAP: Record<string, LucideIcon> = {
  Search, Wrench, Settings, Brain, Building2, BarChart3, Megaphone, Heart, Cog,
};

function mt(section?: HomeSection): Record<string, unknown> {
  return (section?.metadata as Record<string, unknown>) ?? {};
}

function SectionShell({ section, className, defaultBg, children }: {
  section?: HomeSection; className?: string; defaultBg?: React.CSSProperties; children: React.ReactNode;
}) {
  const { getBgStyle } = useSectionStyles(section);
  const { hasBg, bgLayerStyle } = useSectionBackground(section);
  return (
    <section className={`relative overflow-hidden ${className ?? ""}`} style={{ ...(defaultBg ?? {}), ...getBgStyle() }}>
      {hasBg && <div style={bgLayerStyle} />}
      {children}
    </section>
  );
}

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <span
    className="inline-block font-bold uppercase tracking-[0.14em]"
    style={{
      fontSize: 11,
      background: GRADIENT,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    }}
  >
    {children}
  </span>
);

const EyebrowLight = ({ children }: { children: React.ReactNode }) => (
  <span
    className="inline-block font-bold uppercase tracking-[0.14em] px-4 py-1.5 rounded-full"
    style={{
      fontSize: 11,
      background: "linear-gradient(135deg, rgba(190,24,105,0.15), rgba(98,36,190,0.15))",
      color: "#fff",
    }}
  >
    {children}
  </span>
);

/* ─── Defaults ─── */
const DEF_HERO = {
  eyebrow: "QUÉ HACEMOS",
  title: "El problema no es tu equipo.\nEs la pista donde está corriendo.",
  subtitle: "Llevamos 14 años ayudando a empresas B2B en LATAM a diseñar, construir y operar su motor de ingresos. Cada rol lo vive diferente — pero el sistema roto es siempre el mismo.",
  cta_text: "Descubre dónde está rota tu pista →",
  cta_url: "/conoce-tu-pista",
  cta2_text: "Agendar conversación",
  chips: ["14 años en LATAM", "HubSpot Platinum Partner", "Diagnóstico primero, siempre"],
};

type MethodCard = {
  num: string; icon: string; iconColor?: string;
  badge?: string; badgeBg?: string; badgeColor?: string;
  title: string; subtitle: string; desc: string;
  tags: Array<{ label: string; to: string; color?: string; external?: boolean }>;
  link: string;
};

const DEF_METHOD_CARDS: MethodCard[] = [
  { num: "01", icon: "Search", badge: "EL PRIMER PASO", title: "Conoce tu pista", subtitle: "El diagnóstico", desc: "Antes de construir o cambiar cualquier cosa, necesitas saber exactamente qué está fallando y por qué. Mapeamos tu operación e identificamos los cuellos de botella que frenan tu crecimiento.", tags: [{ label: "Diagnóstico del Motor de Ingresos", to: "/diagnostico-revops" }, { label: "Pulso Comercial", to: "https://pulso.revopslatam.com/", external: true }], link: "/conoce-tu-pista" },
  { num: "02", icon: "Wrench", title: "Diseña y construye tu pista", subtitle: "La implementación", desc: "Con claridad del problema, diseñamos e implementamos el sistema. HubSpot configurado para tu proceso real. Integraciones sin silos. Procesos que el equipo realmente sigue.", tags: [{ label: "Implementación HubSpot CRM", to: "/implementacion-hubspot" }, { label: "Marketing Ops", to: "/marketing-ops" }, { label: "Integraciones Custom", to: "/integraciones-desarrollo" }], link: "/diseña-y-construye-tu-pista" },
  { num: "03", icon: "Settings", title: "Opera tu pista", subtitle: "La operación continua", desc: "Una pista bien construida necesita operación constante. Tu consultor asignado y el equipo especialista trabajan sprint a sprint — estrategia y ejecución en paralelo, todos los meses.", tags: [{ label: "RevOps as a Service", to: "/revops-as-a-service" }, { label: "Soporte HubSpot", to: "/soporte-hubspot" }], link: "/opera-tu-pista" },
  { num: "04", icon: "Brain", iconColor: "#6366F1", badge: "LA VENTAJA COMPETITIVA", badgeBg: "rgba(99,102,241,0.08)", badgeColor: "#6366F1", title: "Potencia tu pista con IA", subtitle: "La ventaja competitiva", desc: "Cuando la pista está ordenada, la IA la convierte en una ventaja real. Agentes que califican leads, automatizaciones con contexto, sistemas que aprenden.", tags: [{ label: "IA para tu Motor de Ingresos", to: "/potencia-con-ia", color: "#6366F1" }], link: "/potencia-con-ia" },
];

type RoleCard = {
  icon: string; iconColor?: string; title: string; pain: string;
  symptoms: string[];
  options: Array<{ text: string; chip: string; to: string; chipColor?: string }>;
};

const DEF_ROLE_CARDS: RoleCard[] = [
  { icon: "Building2", title: "CEO / Gerente General", pain: "Pusiste piezas nuevas en una pista que nunca estuvo bien diseñada. El caos siguió.", symptoms: ["Crecemos, pero deberíamos crecer más.", "No puedo predecir el cierre de mes.", "Algo está trabado y no sé qué."], options: [{ text: "No sé qué está mal →", chip: "Diagnóstico", to: "/conoce-tu-pista" }, { text: "Sé el problema, necesito quien lo opere →", chip: "RevOps as a Service", to: "/revops-as-a-service" }, { text: "Quiero escalar lo que funciona →", chip: "IA para tu Motor", to: "/potencia-con-ia", chipColor: "#6366F1" }] },
  { icon: "BarChart3", title: "Director o Gerente Comercial", pain: "Heredaste un equipo sin procesos, un CRM mal configurado y la presión de demostrar resultados.", symptoms: ["Cada vendedor me da un forecast distinto.", "El CRM es un desastre.", "Sé qué está mal pero no tengo cómo probarlo."], options: [{ text: "Necesito mapear los huecos →", chip: "Diagnóstico", to: "/conoce-tu-pista" }, { text: "Necesito el CRM funcionando →", chip: "Implementación HubSpot", to: "/implementacion-hubspot" }, { text: "Necesito mejora continua →", chip: "RevOps as a Service", to: "/revops-as-a-service" }] },
  { icon: "Megaphone", iconColor: "#FF7A59", title: "Director o Gerente de Marketing", pain: "Generas leads. Ventas dice que son malos. Y tú sabes que el problema no es solo tuyo.", symptoms: ["No puedo demostrar el ROI de marketing.", "Armé nurturing que nadie revisa.", "Entrego leads y ventas los rechaza."], options: [{ text: "No sé dónde se rompe el flujo →", chip: "Diagnóstico", to: "/conoce-tu-pista" }, { text: "Necesito HubSpot igual para los dos equipos →", chip: "Marketing Ops", to: "/marketing-ops", chipColor: "#FF7A59" }, { text: "Necesito demostrar ROI →", chip: "RevOps as a Service", to: "/revops-as-a-service" }] },
  { icon: "Heart", iconColor: "#1CA398", title: "Customer Success y Servicio al Cliente", pain: "Tu área retiene clientes y evita churn. Pero si ese impacto no está medido, no existe para el negocio.", symptoms: ["Me entero que un cliente se fue por ventas.", "No tenemos alertas de clientes en riesgo.", "Sabemos que hay upsell. No cómo detectarlo."], options: [{ text: "No tengo visibilidad →", chip: "Diagnóstico", to: "/conoce-tu-pista" }, { text: "Necesito integrar CS al CRM →", chip: "Implementación HubSpot", to: "/implementacion-hubspot" }, { text: "Necesito anticipar churn mes a mes →", chip: "RevOps as a Service", to: "/revops-as-a-service" }] },
  { icon: "Cog", title: "Operaciones / CRM / El que resuelve todo", pain: "Sabes exactamente qué está mal. Lo estás haciendo solo, sin respaldo y sin tiempo.", symptoms: ["Si me voy, HubSpot colapsa.", "Diseño procesos que nadie sigue.", "No tengo cómo justificar el presupuesto."], options: [{ text: "Necesito el diagnóstico que justifique el cambio →", chip: "Diagnóstico", to: "/conoce-tu-pista" }, { text: "Necesito el CRM e integraciones bien hechas →", chip: "Implementación + Integraciones", to: "/implementacion-hubspot" }, { text: "Necesito un socio que comparta la carga →", chip: "RevOps as a Service", to: "/revops-as-a-service" }] },
];

const DEF_METODOLOGIA = { eyebrow: "NUESTRA METODOLOGÍA", title: "Te acompañamos desde el diagnóstico\nhasta la operación completa.", subtitle: "Puedes entrar en cualquier punto — dependiendo de dónde está tu operación hoy." };
const DEF_ROLES = { eyebrow: "SEGÚN TU ROL", title: "El motor de ingresos le importa a todos.\nPero cada rol lo vive diferente.", subtitle: "El problema es el mismo — la pista rota. La entrada depende de cómo lo estás viviendo tú." };
const DEF_CTA = { title: "El primer paso es entender\ndónde está tu pista hoy.", subtitle: "El Pulso Comercial es una evaluación gratuita de 5 minutos. Sin compromiso, sin pitch. Solo claridad sobre qué está frenando tu motor de ingresos.", cta_text: "Hacer el Pulso Comercial →", cta_url: "https://pulso.revopslatam.com/", cta2_text: "Prefiero hablar directo → Agendar conversación" };

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } } };
function renderTitle(raw: string) {
  return raw.split("\n").map((line, i, arr) => (
    <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
  ));
}

/* ═══════════════════════════════════════════════ */
export default function QueHacemos() {
  const { openLeadForm } = useLeadForm();
  const { getSection, loading } = usePageSections("que-hacemos");

  const hero = getSection("hero");
  const metodologia = getSection("metodologia");
  const roles = getSection("roles");
  const ctaFinal = getSection("cta-final");

  const hm = mt(hero);
  const mm = mt(metodologia);
  const rm = mt(roles);
  const cm = mt(ctaFinal);

  const { getStyle: heroStyle } = useSectionStyles(hero);
  const { getStyle: metStyle } = useSectionStyles(metodologia);
  const { getStyle: rolStyle } = useSectionStyles(roles);
  const { getStyle: ctaStyle } = useSectionStyles(ctaFinal);

  // Hero data
  const eyebrow = (hm.eyebrow as string) ?? DEF_HERO.eyebrow;
  const heroTitle = hero?.title ?? DEF_HERO.title;
  const heroSubtitle = hero?.subtitle ?? DEF_HERO.subtitle;
  const heroCtaText = hero?.cta_text ?? DEF_HERO.cta_text;
  const heroCtaUrl = hero?.cta_url ?? DEF_HERO.cta_url;
  const heroCta2Text = (hm.cta2_text as string) ?? DEF_HERO.cta2_text;
  const heroCta2OpensForm = hm.cta2_opens_lead_form === true;
  const heroCtaOpensForm = hm.cta1_opens_lead_form === true;
  const chips = (hm.chips as string[]) ?? DEF_HERO.chips;

  // Metodologia data
  const metEyebrow = (mm.eyebrow as string) ?? DEF_METODOLOGIA.eyebrow;
  const metTitle = metodologia?.title ?? DEF_METODOLOGIA.title;
  const metSubtitle = metodologia?.subtitle ?? DEF_METODOLOGIA.subtitle;
  const methodCards = (mm.method_cards as MethodCard[]) ?? DEF_METHOD_CARDS;

  // Roles data
  const rolEyebrow = (rm.eyebrow as string) ?? DEF_ROLES.eyebrow;
  const rolTitle = roles?.title ?? DEF_ROLES.title;
  const rolSubtitle = roles?.subtitle ?? DEF_ROLES.subtitle;
  const roleCards = (rm.role_cards as RoleCard[]) ?? DEF_ROLE_CARDS;

  // CTA data
  const ctaTitle = ctaFinal?.title ?? DEF_CTA.title;
  const ctaSubtitle = ctaFinal?.subtitle ?? DEF_CTA.subtitle;
  const ctaText = ctaFinal?.cta_text ?? DEF_CTA.cta_text;
  const ctaUrl = ctaFinal?.cta_url ?? DEF_CTA.cta_url;
  const cta2Text = (cm.cta2_text as string) ?? DEF_CTA.cta2_text;
  const cta2OpensForm = cm.cta2_opens_lead_form === true;
  const ctaOpensForm = cm.cta1_opens_lead_form === true;

  if (loading) return <div className="min-h-screen" style={{ background: "#1A1A2E" }} />;

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* ══════ SECTION 1 — HERO ══════ */}
      <SectionShell
        section={hero}
        className="flex items-center justify-center text-center"
        defaultBg={{ minHeight: "80vh", background: "linear-gradient(180deg, #1A1A2E 0%, #0D0D1A 100%)", padding: "160px 24px 100px" }}
      >
        <div className="mx-auto relative z-10" style={{ maxWidth: 760 }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <EyebrowLight>{eyebrow}</EyebrowLight>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="font-bold text-white mt-8"
            style={{ fontSize: "clamp(2.75rem, 5vw, 4.25rem)", lineHeight: 1.1, ...heroStyle("title") }}
          >
            {renderTitle(heroTitle)}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-6"
            style={{ fontSize: 18, color: "rgba(255,255,255,0.65)", maxWidth: 580, lineHeight: 1.6, ...heroStyle("subtitle") }}
          >
            {heroSubtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 mt-10"
          >
            {heroCtaOpensForm ? (
              <button
                onClick={() => openLeadForm("que-hacemos-hero")}
                className="inline-flex items-center gap-2 font-semibold text-white text-base transition-transform duration-200 hover:scale-[1.03]"
                style={{ background: GRADIENT, borderRadius: 999, padding: "14px 32px", boxShadow: "0 8px 30px rgba(190,24,105,0.35)" }}
              >
                {heroCtaText} <ArrowRight size={16} />
              </button>
            ) : (
              <Link
                to={heroCtaUrl}
                className="inline-flex items-center gap-2 font-semibold text-white text-base transition-transform duration-200 hover:scale-[1.03]"
                style={{ background: GRADIENT, borderRadius: 999, padding: "14px 32px", boxShadow: "0 8px 30px rgba(190,24,105,0.35)" }}
              >
                {heroCtaText} <ArrowRight size={16} />
              </Link>
            )}
            {heroCta2OpensForm ? (
              <button
                onClick={() => openLeadForm("que-hacemos-hero")}
                className="font-semibold text-white text-base transition-all duration-200 hover:bg-white/10"
                style={{ border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: 999, padding: "14px 32px", background: "transparent" }}
              >
                {heroCta2Text}
              </button>
            ) : (
              <Link
                to={(hm.cta2_url as string) || "#"}
                className="font-semibold text-white text-base transition-all duration-200 hover:bg-white/10"
                style={{ border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: 999, padding: "14px 32px", background: "transparent" }}
              >
                {heroCta2Text}
              </Link>
            )}
          </motion.div>

          {/* Chips */}
          <motion.div className="flex flex-wrap items-center justify-center mt-10" style={{ gap: 12 }} variants={stagger} initial="hidden" animate="show">
            {chips.map((t) => (
              <motion.span key={t} variants={fadeUp} className="text-white" style={{ fontSize: 13, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 999, padding: "8px 20px" }}>
                {t}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </SectionShell>

      {/* ══════ SECTION 2 — PISTA STORY STICKY ══════ */}
      <PistaStorySticky />

      {/* ══════ SECTION 3 — LO QUE HACEMOS ══════ */}
      <SectionShell section={metodologia} className="" defaultBg={{ background: "#fff", padding: "100px 24px" }}>
        <div ref={sec3Ref} className="mx-auto text-center relative z-10" style={{ maxWidth: 960 }}>
          <Eyebrow>{metEyebrow}</Eyebrow>
          <h2 className="font-bold mt-4" style={{ fontSize: 36, color: "#1A1A2E", lineHeight: 1.2, ...metStyle("title") }}>
            {renderTitle(metTitle)}
          </h2>
          <p className="mx-auto mt-4" style={{ color: "#6B7280", maxWidth: 560, fontSize: 16, lineHeight: 1.6, ...metStyle("subtitle") }}>
            {metSubtitle}
          </p>
        </div>

        <div
          className="mx-auto mt-14 grid gap-6 relative z-10"
          style={{ maxWidth: 960, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}
        >
          {methodCards.map((c, idx) => {
            const Icon = ICON_MAP[c.icon] || Settings;
            const iconColor = c.iconColor || "#BE1869";
            return (
              <motion.div
                key={c.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
                className="relative overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 20, padding: 36 }}
                whileHover={{ borderColor: iconColor, boxShadow: "0 12px 40px rgba(190,24,105,0.1)" }}
              >
                <span className="absolute top-4 right-5 font-bold select-none pointer-events-none" style={{ fontSize: 64, background: GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", opacity: 0.08, lineHeight: 1 }}>
                  {c.num}
                </span>
                <div className="flex items-center justify-center rounded-2xl" style={{ width: 40, height: 40, background: `${iconColor}14` }}>
                  <Icon size={20} style={{ color: iconColor }} />
                </div>
                {c.badge && (
                  <span className="inline-block mt-4 font-bold uppercase tracking-wider" style={{ fontSize: 11, background: c.badgeBg || "rgba(190,24,105,0.08)", color: c.badgeColor || "#BE1869", borderRadius: 999, padding: "4px 12px" }}>
                    {c.badge}
                  </span>
                )}
                <h3 className="font-bold mt-4" style={{ fontSize: 18, color: "#1A1A2E" }}>
                  <Link to={c.link} className="hover:underline">{c.title}</Link>
                </h3>
                <p className="italic mt-1" style={{ fontSize: 14, color: "#6B7280" }}>{c.subtitle}</p>
                <p className="mt-3" style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.6 }}>{c.desc}</p>
                <div className="flex flex-wrap gap-2 mt-5">
                  {c.tags.map((tag) =>
                    tag.external ? (
                      <a key={tag.label} href={tag.to} target="_blank" rel="noopener noreferrer" className="transition-colors duration-200 hover:opacity-80" style={{ fontSize: 11, background: tag.color ? `${tag.color}14` : "#F0F0F0", color: tag.color || "#6B7280", borderRadius: 999, padding: "4px 12px" }}>
                        {tag.label}
                      </a>
                    ) : (
                      <Link key={tag.label} to={tag.to} className="transition-colors duration-200 hover:opacity-80" style={{ fontSize: 11, background: tag.color ? `${tag.color}14` : "#F0F0F0", color: tag.color || "#6B7280", borderRadius: 999, padding: "4px 12px" }}>
                        {tag.label}
                      </Link>
                    )
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </SectionShell>

      {/* ══════ SECTION 4 — SEGÚN TU ROL ══════ */}
      <SectionShell section={roles} className="" defaultBg={{ background: "#F9FAFB", padding: "100px 24px" }}>
        <div ref={sec4Ref} className="mx-auto text-center relative z-10" style={{ maxWidth: 960 }}>
          <Eyebrow>{rolEyebrow}</Eyebrow>
          <h2 className="font-bold mt-4" style={{ fontSize: 34, color: "#1A1A2E", lineHeight: 1.2, ...rolStyle("title") }}>
            {renderTitle(rolTitle)}
          </h2>
          <p className="mx-auto mt-4" style={{ color: "#6B7280", maxWidth: 580, fontSize: 16, lineHeight: 1.6, ...rolStyle("subtitle") }}>
            {rolSubtitle}
          </p>
        </div>

        <div
          className="mx-auto mt-14 grid gap-5 relative z-10"
          style={{ maxWidth: 1000, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}
        >
          {roleCards.map((r, idx) => {
            const Icon = ICON_MAP[r.icon] || Settings;
            const color = r.iconColor || "#BE1869";
            return (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="transition-all duration-300 hover:-translate-y-0.5"
                style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, padding: "28px 24px" }}
                whileHover={{ borderColor: color, boxShadow: `0 8px 24px ${color}14` }}
              >
                <div className="flex items-center justify-center rounded-xl" style={{ width: 32, height: 32, background: `${color}14` }}>
                  <Icon size={16} style={{ color }} />
                </div>
                <h3 className="font-bold mt-3" style={{ fontSize: 16, color: "#1A1A2E" }}>{r.title}</h3>
                <p className="italic mt-2" style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.5 }}>{r.pain}</p>
                <div className="mt-3 space-y-1">
                  {r.symptoms.map((s) => (
                    <p key={s} style={{ fontSize: 12, color: "#9CA3AF" }}>— "{s}"</p>
                  ))}
                </div>
                <div className="my-4" style={{ height: 1, background: "#F0F0F0" }} />
                <p className="uppercase font-bold" style={{ fontSize: 11, color: "#9CA3AF", letterSpacing: "0.06em" }}>
                  Por dónde entrar:
                </p>
                <div className="mt-2 space-y-2">
                  {r.options.map((o) => (
                    <div key={o.text} className="flex items-start gap-2 flex-wrap" style={{ fontSize: 13 }}>
                      <span style={{ color: "#374151" }}>{o.text}</span>
                      <Link
                        to={o.to}
                        className="inline-flex items-center gap-1 font-semibold transition-all duration-200 hover:underline"
                        style={{ color: o.chipColor || "#BE1869", background: o.chipColor ? `${o.chipColor}14` : "rgba(190,24,105,0.08)", borderRadius: 999, padding: "2px 10px", fontSize: 12 }}
                      >
                        {o.chip}
                      </Link>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </SectionShell>

      {/* ══════ SECTION 5 — CTA FINAL ══════ */}
      <SectionShell section={ctaFinal} className="" defaultBg={{ background: "#1A1A2E", padding: "80px 24px" }}>
        <div className="mx-auto text-center relative z-10" style={{ maxWidth: 600 }}>
          <h2 className="font-bold text-white" style={{ fontSize: 30, lineHeight: 1.25, ...ctaStyle("title") }}>
            {renderTitle(ctaTitle)}
          </h2>
          <p className="mx-auto mt-5" style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.6, fontSize: 16, ...ctaStyle("subtitle") }}>
            {ctaSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            {ctaOpensForm ? (
              <button
                onClick={() => openLeadForm("que-hacemos-cta")}
                className="inline-flex items-center gap-2 font-semibold text-white text-base transition-transform duration-200 hover:scale-[1.03]"
                style={{ background: GRADIENT, borderRadius: 999, padding: "16px 36px", boxShadow: "0 8px 30px rgba(190,24,105,0.35)" }}
              >
                {ctaText} <ArrowRight size={16} />
              </button>
            ) : (
              <a
                href={ctaUrl}
                target={ctaUrl.startsWith("http") ? "_blank" : undefined}
                rel={ctaUrl.startsWith("http") ? "noopener noreferrer" : undefined}
                className="inline-flex items-center gap-2 font-semibold text-white text-base transition-transform duration-200 hover:scale-[1.03]"
                style={{ background: GRADIENT, borderRadius: 999, padding: "16px 36px", boxShadow: "0 8px 30px rgba(190,24,105,0.35)" }}
              >
                {ctaText} <ArrowRight size={16} />
              </a>
            )}
            {cta2OpensForm ? (
              <button
                onClick={() => openLeadForm("que-hacemos-cta")}
                className="font-semibold text-white text-sm transition-colors duration-200 hover:text-white/80"
                style={{ background: "transparent", textDecoration: "underline", textUnderlineOffset: 4 }}
              >
                {cta2Text}
              </button>
            ) : (
              <a
                href={(cm.cta2_url as string) || "#"}
                className="font-semibold text-white text-sm transition-colors duration-200 hover:text-white/80"
                style={{ background: "transparent", textDecoration: "underline", textUnderlineOffset: 4 }}
              >
                {cta2Text}
              </a>
            )}
          </div>
        </div>
      </SectionShell>

      <Footer />
    </div>
  );
}
