import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { HomeSection } from "@/hooks/useHomeSections";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

const defaults = {
  pill: "Revenue Operations · LATAM",
  headline1: "Tu empresa creció.",
  headline2: "Tu motor de ingresos, no.",
  body: "Cuando el crecimiento llega más rápido que los procesos, el caos no es señal de fracaso. Es señal de que necesitas una pista mejor diseñada.",
  cta: "Descubre dónde se pierde tu revenue",
  cta2: "Agenda una conversación",
  trust: "14 años de experiencia · HubSpot Partner · LATAM",
};

const Hero = ({ section }: { section?: HomeSection }) => {
  const meta = (section?.metadata ?? {}) as Record<string, unknown>;
  const title = section?.title ?? `${defaults.headline1}\n${defaults.headline2}`;
  const titleParts = title.split("\n");
  const pill = (section?.subtitle ?? defaults.pill) as string;
  const body = (section?.body ?? defaults.body) as string;
  const cta = (section?.cta_text ?? defaults.cta) as string;
  const cta2 = (meta.cta2_text as string) ?? defaults.cta2;
  const cta2Url = (meta.cta2_url as string) ?? "";
  const trust = (meta.trust_line as string) ?? defaults.trust;
  const bgImage = section?.background_image_url;
  const bgOverlay = meta.bg_overlay === true; // disabled by default, set to true in metadata to enable
  const bgOpacity = typeof meta.bg_opacity === "number" ? meta.bg_opacity : 0.25;
  const sideImage = section?.image_url;

  return (
    <section className="relative min-h-screen gradient-hero overflow-hidden px-6 flex items-center" style={{ paddingTop: "clamp(120px, 15vh, 200px)", paddingBottom: "clamp(60px, 8vh, 120px)" }}>
      {/* Background image overlay */}
      {bgImage && (
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${bgImage})`,
            opacity: bgOverlay ? bgOpacity : 1,
          }}
        />
      )}

      {/* Orbs */}
      <div className="absolute rounded-full pointer-events-none" style={{ width: 500, height: 500, top: -100, left: -200, background: "radial-gradient(circle, rgba(190,24,105,0.15) 0%, transparent 70%)", filter: "blur(120px)" }} />
      <div className="absolute rounded-full pointer-events-none" style={{ width: 400, height: 400, top: 200, right: -150, background: "radial-gradient(circle, rgba(98,36,190,0.20) 0%, transparent 70%)", filter: "blur(120px)" }} />
      <div className="absolute rounded-full pointer-events-none" style={{ width: 350, height: 350, bottom: 0, left: "40%", background: "radial-gradient(circle, rgba(7,121,215,0.12) 0%, transparent 70%)", filter: "blur(120px)" }} />

      <div className="relative z-10 w-full max-w-[960px] xl:max-w-[1100px] 2xl:max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center gap-10 xl:gap-14">
        <div className="relative z-10 max-w-[520px] xl:max-w-[580px] 2xl:max-w-[640px]">
          <motion.div {...fadeUp(0)}>
            <span className="inline-block px-4 py-1.5 rounded-full border border-[rgba(190,24,105,0.4)] bg-[rgba(190,24,105,0.1)] text-pink text-[13px] font-medium tracking-wider">
              {pill}
            </span>
          </motion.div>

          <motion.h1 {...fadeUp(0.2)} className="mt-7 text-hero font-bold leading-[1.1] tracking-tight">
            <span className="text-primary-foreground">{titleParts[0]}</span>
            {titleParts[1] && (
              <>
                <br />
                <span className="text-gradient-brand">{titleParts[1]}</span>
              </>
            )}
          </motion.h1>

          <motion.p {...fadeUp(0.4)} className="mt-6 leading-relaxed max-w-[460px] xl:max-w-[520px]" style={{ color: "rgba(255,255,255,0.7)", fontSize: "clamp(0.95rem, 0.8rem + 0.4vw, 1.125rem)" }}>
            {body}
          </motion.p>

          <motion.div {...fadeUp(0.6)} className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="gap-2" onClick={() => section?.cta_url && window.open(section.cta_url, "_blank")}>
              {cta}
              <ArrowRight size={18} />
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-[rgba(255,255,255,0.3)] text-primary-foreground hover:border-primary-foreground bg-transparent"
              onClick={() => cta2Url && window.open(cta2Url, "_blank")}
            >
              {cta2}
            </Button>
          </motion.div>

          <motion.p {...fadeUp(0.9)} className="mt-8 text-[13px]" style={{ color: "rgba(255,255,255,0.4)" }}>
            {trust}
          </motion.p>
        </div>

        {/* Side image */}
        {sideImage && (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
            className="hidden lg:block flex-1 max-w-[380px] xl:max-w-[440px]"
          >
            <img
              src={sideImage}
              alt={section?.title ?? "Hero"}
              className="w-full h-auto"
            />
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Hero;
