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

const defaultLevels = [
  { number: "01", label: "Nivel práctico", text: "Ayudamos a las empresas a escalar ordenando sus sistemas de revenue." },
  { number: "02", label: "Nivel ético", text: "Operamos con altos estándares de integridad, eligiendo trabajar solo con empresas que generen un impacto positivo." },
  { number: "03", label: "Nivel espiritual", text: "Vemos nuestro trabajo como una forma de cumplir el mandato cultural — sirviendo a Dios y a la sociedad a través de la excelencia en los negocios." },
];

const PorQueExistimos = ({ section }: { section?: HomeSection }) => {
  const { getStyle, getBgStyle } = useSectionStyles(section);
  const { hasBg, bgLayerStyle } = useSectionBackground(section);
  const meta = (section?.metadata ?? {}) as Record<string, unknown>;
  const title = section?.title ?? "Por qué existimos";

  const p1 = (meta.p1 as string) ?? "En Latinoamérica, muchas empresas no crecen porque están desordenadas.";
  const p2 = (meta.p2 as string) ?? "Nosotros creemos que puede ser diferente.";
  const p3 = (meta.p3 as string) ?? "Creemos que las empresas en LATAM pueden crecer — no solo en revenue, sino de manera sostenible.";
  const pFinal = (meta.p_final as string) ?? "Por eso existimos: para ordenar la operación comercial de las empresas de LATAM.";
  const closingQuote = (meta.closing_quote as string) ?? "Somos arquitectos del revenue. Pieza a pieza, ordenamos para crecer.";
  const sectionLevels = Array.isArray(meta.levels) ? (meta.levels as typeof defaultLevels) : defaultLevels;
  const sectionLabel = (meta.section_label as string) || "Manifiesto";

  // Style overrides from admin
  const p1Style: React.CSSProperties = {
    color: (meta.p1_color as string) || "rgba(255,255,255,0.6)",
    ...(meta.p1_font_size ? { fontSize: meta.p1_font_size as string } : {}),
    ...getStyle("body"),
  };
  const p2Style: React.CSSProperties = (() => {
    const base: React.CSSProperties = {
      color: (meta.p2_color as string) || "white",
      ...(meta.p2_font_size ? { fontSize: meta.p2_font_size as string } : {}),
      ...getStyle("title"),
    };
    if (meta.p2_gradient) {
      base.background = meta.p2_gradient as string;
      base.WebkitBackgroundClip = "text";
      base.WebkitTextFillColor = "transparent";
      base.backgroundClip = "text";
    }
    return base;
  })();
  const p3Style: React.CSSProperties = {
    color: (meta.p3_color as string) || "rgba(255,255,255,0.6)",
    ...(meta.p3_font_size ? { fontSize: meta.p3_font_size as string } : {}),
    ...getStyle("body"),
  };
  const pFinalStyle: React.CSSProperties = {
    color: (meta.p_final_color as string) || "rgba(255,255,255,0.6)",
    ...(meta.p_final_font_size ? { fontSize: meta.p_final_font_size as string } : {}),
    ...getStyle("body"),
  };

  // Level card styling
  const levelCardBg = (meta.level_card_bg as string) || "rgba(255,255,255,0.04)";
  const levelCardBorder = (meta.level_card_border as string) || "rgba(255,255,255,0.06)";
  const levelNumberColor = (meta.level_number_color as string) || "hsl(var(--pink) / 0.35)";
  const levelLabelColor = (meta.level_label_color as string) || "hsl(var(--pink))";
  const levelTextColor = (meta.level_text_color as string) || "rgba(255,255,255,0.7)";
  const levelNumberSize = (meta.level_number_size as string) || "";
  const labelColor = (meta.section_label_color as string) || "hsl(var(--pink))";

  // Closing quote styling
  const closingStyle: React.CSSProperties = (() => {
    const base: React.CSSProperties = {};
    if (meta.closing_font_size) base.fontSize = meta.closing_font_size as string;
    const grad = (meta.closing_gradient as string) || "var(--gradient-brand)";
    if (meta.closing_color && !meta.closing_gradient) {
      base.color = meta.closing_color as string;
    } else {
      base.background = grad;
      base.WebkitBackgroundClip = "text";
      base.WebkitTextFillColor = "transparent";
      base.backgroundClip = "text";
    }
    return base;
  })();

  const bgStyle = getBgStyle();
  const sectionBg = bgStyle.background ? bgStyle : { background: "linear-gradient(180deg, #0D0D1A 0%, #111127 30%, #171730 100%)" };

  return (
    <section className="relative py-20 sm:py-28 px-6 sm:px-10 overflow-hidden" style={sectionBg}>
      {hasBg && <div style={bgLayerStyle} />}
      <div className="absolute pointer-events-none" style={{ width: 700, height: 400, top: 80, left: "50%", transform: "translateX(-50%)", background: "radial-gradient(ellipse, rgba(190,24,105,0.06) 0%, transparent 70%)", filter: "blur(100px)" }} />

      <div className="relative z-10 max-w-[820px] mx-auto">
        <motion.div {...fadeUp(0)} className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 max-w-[60px]" style={{ background: labelColor }} />
          <span className="text-[12px] font-semibold tracking-[0.2em] uppercase" style={{ color: labelColor, ...getStyle("subtitle") }}>
            {sectionLabel}
          </span>
        </motion.div>

        <motion.h2 {...fadeUp(0.06)} className="text-[36px] sm:text-[44px] md:text-[52px] font-bold leading-[1.1] tracking-tight" style={{ color: "white", ...getStyle("title") }}>
          {title}
        </motion.h2>

        <motion.p {...fadeUp(0.12)} className="mt-10 text-[17px] sm:text-[18px] leading-[1.8]" style={p1Style}>
          {p1}
        </motion.p>

        <motion.p {...fadeUp(0.18)} className="mt-10 text-[24px] sm:text-[28px] md:text-[32px] font-bold leading-[1.25] tracking-tight" style={p2Style}>
          {p2}
        </motion.p>

        <motion.p {...fadeUp(0.22)} className="mt-8 text-[17px] sm:text-[18px] leading-[1.8]" style={p3Style}>
          {p3}
        </motion.p>

        <div className="mt-14 space-y-5">
          {sectionLevels.map((level, i) => (
            <motion.div
              key={i}
              {...fadeUp(0.26 + i * 0.08)}
              className="flex gap-5 sm:gap-6 items-start rounded-2xl p-6 sm:p-7"
              style={{ background: levelCardBg, border: `1px solid ${levelCardBorder}` }}
            >
              <span
                className="text-[36px] sm:text-[42px] font-bold leading-none shrink-0"
                style={{ color: levelNumberColor, ...(levelNumberSize ? { fontSize: levelNumberSize } : {}) }}
              >
                {level.number}
              </span>
              <div>
                <span className="text-[12px] font-semibold tracking-[0.15em] uppercase block mb-2" style={{ color: levelLabelColor }}>
                  {level.label}
                </span>
                <p className="text-[16px] sm:text-[17px] leading-[1.7]" style={{ color: levelTextColor }}>
                  {level.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p {...fadeUp(0.5)} className="mt-12 text-[17px] sm:text-[18px] leading-[1.8]" style={pFinalStyle}>
          {pFinal}
        </motion.p>

        <motion.div {...fadeUp(0.56)} className="mt-16 pt-12 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <p
            className="text-[26px] sm:text-[32px] md:text-[38px] font-bold leading-[1.15] tracking-tight text-center"
            style={closingStyle}
          >
            {closingQuote}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PorQueExistimos;
