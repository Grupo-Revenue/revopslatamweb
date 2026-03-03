import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { HomeSection } from "@/hooks/useHomeSections";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

const NosotrosCTA = ({ section }: { section?: HomeSection }) => {
  const meta = (section?.metadata ?? {}) as Record<string, unknown>;
  const title = section?.title ?? "Si esto resuena contigo, probablemente trabajemos bien juntos.";
  const body = section?.body ?? "No trabajamos con todos. Trabajamos con empresas que quieren crecer de forma real, sana y sostenible — y con personas que valoran la honestidad por encima del discurso bonito.";
  const ctaText = section?.cta_text ?? "Hacer el Pulso Comercial";
  const ctaUrl = section?.cta_url ?? "#";
  const cta2Text = (meta.cta2_text as string) ?? "Prefiero hablar directo → Agendar conversación";
  const cta2Url = (meta.cta2_url as string) ?? "#";

  return (
    <section
      className="relative"
      style={{ padding: "100px 5%", textAlign: "center", background: "transparent" }}
    >
      <div className="relative z-10 mx-auto" style={{ maxWidth: 600 }}>
        <motion.h2
          {...fadeUp(0)}
          style={{
            fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            marginBottom: 16,
            color: "#F0F4FF",
          }}
        >
          {title}
        </motion.h2>

        <motion.p
          {...fadeUp(0.1)}
          className="mx-auto"
          style={{
            fontSize: "1rem",
            color: "rgba(240,244,255,0.5)",
            maxWidth: 500,
            marginBottom: 40,
            lineHeight: 1.7,
          }}
        >
          {body}
        </motion.p>

        <motion.div {...fadeUp(0.22)} className="flex flex-col items-center" style={{ gap: 16 }}>
          <Button
            size="lg"
            className="gap-2 text-[16px] px-8"
            onClick={() => window.open(ctaUrl, "_blank")}
          >
            {ctaText}
            <ArrowRight size={18} />
          </Button>

          <a
            href={cta2Url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium transition-colors duration-200"
            style={{ fontSize: "0.9rem", color: "hsl(var(--green))" }}
          >
            {cta2Text}
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default NosotrosCTA;
