import { motion } from "framer-motion";
import type { HomeSection } from "@/hooks/useHomeSections";
import { useSectionStyles } from "@/hooks/useSectionStyles";
import { useSectionBackground } from "@/hooks/useSectionBackground";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

const levels = [
  { number: "01", label: "Nivel práctico", text: "Ayudamos a las empresas a escalar ordenando sus sistemas de revenue." },
  { number: "02", label: "Nivel ético", text: "Operamos con altos estándares de integridad, eligiendo trabajar solo con empresas que generen un impacto positivo." },
  { number: "03", label: "Nivel espiritual", text: "Vemos nuestro trabajo como una forma de cumplir el mandato cultural — sirviendo a Dios y a la sociedad a través de la excelencia en los negocios." },
];

const PorQueExistimos = ({ section }: { section?: HomeSection }) => {
  const { getStyle, getBgStyle } = useSectionStyles(section);
  const { hasBg, bgLayerStyle } = useSectionBackground(section);
  const meta = (section?.metadata ?? {}) as Record<string, unknown>;
  const title = section?.title ?? "Por qué existimos";

  const p1 = (meta.p1 as string) ?? "En Latinoamérica, muchas empresas no crecen porque están desordenadas. La improvisación, los equipos desalineados y la falta de procesos estructurados son parte del ADN empresarial de la región. Esa cultura del caos impide automatizar, medir con precisión y escalar de forma saludable.";
  const p2 = (meta.p2 as string) ?? "Nosotros creemos que puede ser diferente.";
  const p3 = (meta.p3 as string) ?? "Creemos que las empresas en LATAM pueden crecer — no solo en revenue, sino de manera sostenible, con integridad y propósito, contribuyendo al bien común y glorificando a Dios a través del trabajo bien hecho.";
  const pFinal = (meta.p_final as string) ?? "Por eso existimos: para ordenar la operación comercial de las empresas de LATAM, y dar a conocer e implementar Revenue Operations como disciplina estratégica para el crecimiento sostenible. No solo aplicamos RevOps. Lo enseñamos, lo impulsamos y lo usamos para transformar empresas que quieren dejar de improvisar y empezar a liderar.";
  const closingQuote = (meta.closing_quote as string) ?? "Somos arquitectos del revenue. Pieza a pieza, ordenamos para crecer.";
  const sectionLevels = Array.isArray(meta.levels) ? (meta.levels as typeof levels) : levels;

  const bgStyle = getBgStyle();
  const sectionBg = bgStyle.background ? bgStyle : { background: "linear-gradient(180deg, #0D0D1A 0%, #111127 30%, #171730 100%)" };

  return (
    <section className="relative py-20 sm:py-28 px-6 sm:px-10 overflow-hidden" style={sectionBg}>
      {hasBg && <div style={bgLayerStyle} />}
      <div className="absolute pointer-events-none" style={{ width: 700, height: 400, top: 80, left: "50%", transform: "translateX(-50%)", background: "radial-gradient(ellipse, rgba(190,24,105,0.06) 0%, transparent 70%)", filter: "blur(100px)" }} />

      <div className="relative z-10 max-w-[820px] mx-auto">
        <motion.div {...fadeUp(0)} className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 max-w-[60px]" style={{ background: "hsl(var(--pink))" }} />
          <span className="text-[12px] font-semibold tracking-[0.2em] uppercase" style={{ color: "hsl(var(--pink))", ...getStyle("subtitle") }}> Manifiesto </span>
        </motion.div>

        <motion.h2 {...fadeUp(0.06)} className="text-[36px] sm:text-[44px] md:text-[52px] font-bold leading-[1.1] tracking-tight" style={{ color: "white", ...getStyle("title") }}>
          {title}
        </motion.h2>

        <motion.p {...fadeUp(0.12)} className="mt-10 text-[17px] sm:text-[18px] leading-[1.8]" style={{ color: "rgba(255,255,255,0.6)", ...getStyle("body") }}>
          {p1}
        </motion.p>

        <motion.p {...fadeUp(0.18)} className="mt-10 text-[24px] sm:text-[28px] md:text-[32px] font-bold leading-[1.25] tracking-tight" style={{ color: "white", ...getStyle("title") }}>
          {p2}
        </motion.p>

        <motion.p {...fadeUp(0.22)} className="mt-8 text-[17px] sm:text-[18px] leading-[1.8]" style={{ color: "rgba(255,255,255,0.6)", ...getStyle("body") }}>
          {p3}
        </motion.p>

        <div className="mt-14 space-y-5">
          {sectionLevels.map((level, i) => (
            <motion.div key={i} {...fadeUp(0.26 + i * 0.08)} className="flex gap-5 sm:gap-6 items-start rounded-2xl p-6 sm:p-7" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <span className="text-[36px] sm:text-[42px] font-bold leading-none shrink-0" style={{ color: "hsl(var(--pink) / 0.35)" }}>{level.number}</span>
              <div>
                <span className="text-[12px] font-semibold tracking-[0.15em] uppercase block mb-2" style={{ color: "hsl(var(--pink))" }}>{level.label}</span>
                <p className="text-[16px] sm:text-[17px] leading-[1.7]" style={{ color: "rgba(255,255,255,0.7)" }}>{level.text}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p {...fadeUp(0.5)} className="mt-12 text-[17px] sm:text-[18px] leading-[1.8]" style={{ color: "rgba(255,255,255,0.6)", ...getStyle("body") }}>
          {pFinal}
        </motion.p>

        <motion.div {...fadeUp(0.56)} className="mt-16 pt-12 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <p className="text-[26px] sm:text-[32px] md:text-[38px] font-bold leading-[1.15] tracking-tight text-center" style={{ background: "var(--gradient-brand)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            {closingQuote}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PorQueExistimos;
