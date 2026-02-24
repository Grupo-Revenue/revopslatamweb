import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import IsometricTrack from "@/components/IsometricTrack";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

const Hero = () => {
  return (
    <section className="relative min-h-screen gradient-hero overflow-hidden pt-[140px] pb-20 px-6">
      {/* Orbs */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 500,
          height: 500,
          top: -100,
          left: -200,
          background: "radial-gradient(circle, rgba(190,24,105,0.15) 0%, transparent 70%)",
          filter: "blur(120px)",
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 400,
          height: 400,
          top: 200,
          right: -150,
          background: "radial-gradient(circle, rgba(98,36,190,0.20) 0%, transparent 70%)",
          filter: "blur(120px)",
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 350,
          height: 350,
          bottom: 0,
          left: "40%",
          background: "radial-gradient(circle, rgba(7,121,215,0.12) 0%, transparent 70%)",
          filter: "blur(120px)",
        }}
      />

      {/* Content grid */}
      <div className="relative z-10 container max-w-[1100px] mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        {/* Text column */}
        <div className="flex-1 min-w-0 lg:max-w-[55%] order-2 lg:order-1">
          {/* Pill */}
          <motion.div {...fadeUp(0)}>
            <span className="inline-block px-4 py-1.5 rounded-full border border-[rgba(190,24,105,0.4)] bg-[rgba(190,24,105,0.1)] text-pink text-[13px] font-medium tracking-wider">
              Revenue Operations · LATAM
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            {...fadeUp(0.2)}
            className="mt-7 text-hero font-bold leading-[1.1] tracking-tight"
          >
            <span className="text-primary-foreground">Tu empresa creció.</span>
            <br />
            <span className="text-gradient-brand">Tu motor de ingresos, no.</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            {...fadeUp(0.4)}
            className="mt-6 text-lg leading-relaxed max-w-[520px]"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            Cuando el crecimiento llega más rápido que los procesos, el caos no
            es señal de fracaso. Es señal de que necesitas una pista mejor
            diseñada.
          </motion.p>

          {/* CTAs */}
          <motion.div
            {...fadeUp(0.6)}
            className="mt-8 flex flex-col sm:flex-row gap-4"
          >
            <Button size="lg" className="gap-2">
              Descubre dónde se pierde tu revenue
              <ArrowRight size={18} />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-[rgba(255,255,255,0.3)] text-primary-foreground hover:border-primary-foreground bg-transparent"
            >
              Agenda una conversación
            </Button>
          </motion.div>

          {/* Trust metrics */}
          <motion.p
            {...fadeUp(0.9)}
            className="mt-8 text-[13px]"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            14 años de experiencia · HubSpot Partner · LATAM
          </motion.p>
        </div>

        {/* Track animation column */}
        <motion.div
          className="flex-shrink-0 w-full max-w-[260px] sm:max-w-[300px] lg:max-w-[380px] order-1 lg:order-2 will-change-transform"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" as const }}
        >
          <IsometricTrack />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
