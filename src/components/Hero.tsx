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

type ClientData = { name: string; logo_url: string };

const defaultClients = [
  "Empresa Alpha", "TechCorp", "Innova Group", "Soluciones Pro",
  "DataFlow", "CloudBase", "Nexus Digital", "Vertex Labs",
  "Onda Media", "Pulse Commerce",
];

const LogoPlaceholder = ({ name }: { name: string }) => (
  <div className="flex-shrink-0 flex items-center justify-center px-6 mx-3" style={{ minWidth: 120, height: 40 }}>
    <span className="text-[12px] font-medium tracking-wide whitespace-nowrap" style={{ color: "rgba(255,255,255,0.25)" }}>
      {name}
    </span>
  </div>
);

const LogoImage = ({ client }: { client: ClientData }) => (
  <div className="flex-shrink-0 flex items-center justify-center mx-5" style={{ minWidth: 100, height: 36 }}>
    <img
      src={client.logo_url}
      alt={client.name}
      className="h-7 max-w-[120px] object-contain transition-opacity duration-300"
      style={{ filter: "brightness(0) invert(1)", opacity: 0.45 }}
    />
  </div>
);

const Hero = ({ section, logosSection }: { section?: HomeSection; logosSection?: HomeSection }) => {
  const meta = (section?.metadata ?? {}) as Record<string, unknown>;
  const title = section?.title ?? `${defaults.headline1}\n${defaults.headline2}`;
  const titleParts = title.split("\n");
  const pill = (section?.subtitle ?? defaults.pill) as string;
  const body = (section?.body ?? defaults.body) as string;
  const cta = (section?.cta_text ?? defaults.cta) as string;
  const cta2 = (meta.cta2_text as string) ?? defaults.cta2;
  const trust = (meta.trust_line as string) ?? defaults.trust;
  const bgImage = section?.background_image_url;
  const bgOverlay = meta.bg_overlay === true;
  const bgOpacity = typeof meta.bg_opacity === "number" ? meta.bg_opacity : 0.25;
  const sideImage = section?.image_url;

  // Client logos data
  const logosMeta = (logosSection?.metadata ?? {}) as Record<string, unknown>;
  const clientsData = logosMeta.clients_data as ClientData[] | undefined;
  const clientNames = (logosMeta.clients as string[]) ?? defaultClients;
  const hasLogos = clientsData && clientsData.length > 0 && clientsData.some((c) => c.logo_url);
  const doubledData = hasLogos ? [...clientsData!, ...clientsData!] : [];
  const doubledNames = !hasLogos ? [...clientNames, ...clientNames] : [];
  const logosTitle = logosSection?.title ?? "Empresas que confían en nosotros";

  return (
    <section className="relative min-h-screen gradient-hero overflow-hidden pt-[140px] pb-0 px-6 flex flex-col">
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

      <div className="relative z-10 container max-w-[1100px] mx-auto flex flex-col lg:flex-row items-center gap-12 flex-1">
        <div className="relative z-10 max-w-[600px]">
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

          <motion.p {...fadeUp(0.4)} className="mt-6 text-lg leading-relaxed max-w-[520px]" style={{ color: "rgba(255,255,255,0.7)" }}>
            {body}
          </motion.p>

          <motion.div {...fadeUp(0.6)} className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="gap-2" onClick={() => section?.cta_url && window.open(section.cta_url, "_blank")}>
              {cta}
              <ArrowRight size={18} />
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-[rgba(255,255,255,0.3)] text-primary-foreground hover:border-primary-foreground bg-transparent" onClick={() => { const url = meta.cta2_url as string; if (url) window.open(url, "_blank"); }}>
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
            className="hidden lg:block flex-1 max-w-[460px]"
          >
            <img
              src={sideImage}
              alt={section?.title ?? "Hero"}
              className="w-full h-auto"
            />
          </motion.div>
        )}
      </div>

      {/* Client logos marquee — pinned to bottom of hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.1 }}
        className="relative z-10 w-full mt-auto pb-8 pt-6"
      >
        <p
          className="text-center text-[10px] font-semibold tracking-[0.25em] uppercase mb-4"
          style={{ color: "rgba(255,255,255,0.2)" }}
        >
          {logosTitle}
        </p>
        <div className="relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(to right, var(--hero-edge, rgba(13,13,26,0.9)), transparent)" }} />
          <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(to left, var(--hero-edge, rgba(13,13,26,0.9)), transparent)" }} />
          <div className="flex animate-marquee">
            {hasLogos
              ? doubledData.map((client, i) => <LogoImage key={`${client.name}-${i}`} client={client} />)
              : doubledNames.map((name, i) => <LogoPlaceholder key={`${name}-${i}`} name={name} />)
            }
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
