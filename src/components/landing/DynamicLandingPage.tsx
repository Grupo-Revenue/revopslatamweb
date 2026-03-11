import { motion } from "framer-motion";
import {
  ArrowRight,
  Search,
  Settings,
  Rocket,
  RefreshCw,
  BarChart3,
  Wrench,
  Target,
  Building2,
  Megaphone,
  type LucideProps,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DynamicCTA from "@/components/DynamicCTA";
import PistaStorySticky from "@/components/landing/PistaStorySticky";
import { usePageSections } from "@/hooks/usePageSections";
import { useSectionStyles } from "@/hooks/useSectionStyles";
import { useSectionBackground } from "@/hooks/useSectionBackground";
import type { HomeSection } from "@/hooks/useHomeSections";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.5, delay, ease: "easeOut" as const },
});

const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  Search,
  Settings,
  Rocket,
  RefreshCw,
  BarChart3,
  Wrench,
  Target,
  Building2,
  Megaphone,
};

type SectionShellProps = {
  section?: HomeSection;
  className: string;
  defaultBg?: React.CSSProperties;
  children: React.ReactNode;
};

function getMeta(section?: HomeSection): Record<string, unknown> {
  return (section?.metadata as Record<string, unknown>) ?? {};
}

function renderTitle(title: string, gradientText?: string) {
  if (!gradientText || !title.includes(gradientText)) return <>{title}</>;
  const idx = title.indexOf(gradientText);
  return (
    <>
      {title.slice(0, idx)}
      <span className="text-gradient-brand">{gradientText}</span>
      {title.slice(idx + gradientText.length)}
    </>
  );
}

function SectionShell({ section, className, defaultBg, children }: SectionShellProps) {
  const { getBgStyle } = useSectionStyles(section);
  const { hasBg, bgLayerStyle } = useSectionBackground(section);

  return (
    <section className={`relative overflow-hidden ${className}`} style={{ ...(defaultBg ?? {}), ...getBgStyle() }}>
      {hasBg && <div style={bgLayerStyle} />}
      {children}
    </section>
  );
}

function HeroSection({ section }: { section?: HomeSection }) {
  if (!section) return null;

  const meta = getMeta(section);
  const { getStyle } = useSectionStyles(section);
  const badge = meta.badge as string | undefined;

  return (
    <SectionShell section={section} className="gradient-hero pt-32 pb-24 px-6">
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 500,
          height: 500,
          top: -120,
          right: -200,
          background:
            "radial-gradient(circle, hsl(var(--pink) / 0.15) 0%, transparent 70%)",
          filter: "blur(140px)",
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 400,
          height: 400,
          bottom: -100,
          left: -150,
          background:
            "radial-gradient(circle, hsl(var(--purple) / 0.12) 0%, transparent 70%)",
          filter: "blur(120px)",
        }}
      />

      <div className="relative z-10 max-w-[1000px] mx-auto text-center">
        {badge && (
          <motion.span
            {...fadeUp(0)}
            className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase border border-pink/30 text-pink mb-8"
          >
            {badge}
          </motion.span>
        )}

        <motion.h1
          {...fadeUp(0.1)}
          className="text-hero font-bold leading-[1.08] tracking-tight"
          style={getStyle("title")}
        >
          {renderTitle(section.title ?? "", meta.gradient_text as string)}
        </motion.h1>

        {section.subtitle && (
          <motion.p
            {...fadeUp(0.2)}
            className="mt-6 text-lg md:text-xl leading-relaxed text-muted-foreground max-w-[640px] mx-auto"
            style={getStyle("subtitle")}
          >
            {section.subtitle}
          </motion.p>
        )}

        {(section.cta_text || meta.cta2_text) && (
          <motion.div
            {...fadeUp(0.3)}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {section.cta_text && (
              <DynamicCTA
                styleKey={meta.cta_style_key as string}
                onClick={() => section.cta_url && (window.location.href = section.cta_url)}
                className="gap-2"
              >
                {section.cta_text}
              </DynamicCTA>
            )}
            {meta.cta2_text && (
              <DynamicCTA
                styleKey={meta.cta2_style_key as string}
                onClick={() =>
                  meta.cta2_url && (window.location.href = meta.cta2_url as string)
                }
              >
                {meta.cta2_text as string}
              </DynamicCTA>
            )}
          </motion.div>
        )}

        {section.image_url && (
          <motion.div {...fadeUp(0.4)} className="mt-12 max-w-[920px] mx-auto">
            <img
              src={section.image_url}
              alt={section.title ?? "Imagen principal"}
              loading="lazy"
              className="w-full max-h-[560px] object-cover rounded-2xl border border-primary-foreground/10"
            />
          </motion.div>
        )}
      </div>
    </SectionShell>
  );
}

function TextBlockSection({
  section,
  defaultBg,
}: {
  section?: HomeSection;
  defaultBg?: string;
}) {
  if (!section) return null;

  const meta = getMeta(section);
  const { getStyle } = useSectionStyles(section);
  const paragraphs = (section.body ?? "").split("\n\n").filter(Boolean);
  const listItems = (section.body ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const bodyAsList = meta.body_as_list === true;

  return (
    <SectionShell
      section={section}
      className="py-24 px-6"
      defaultBg={defaultBg ? { background: defaultBg } : undefined}
    >
      <div className="relative z-10 max-w-[780px] mx-auto">
        {section.title && (
          <motion.h2
            {...fadeUp(0)}
            className="text-section font-bold leading-[1.15] tracking-tight text-center"
            style={getStyle("title")}
          >
            {renderTitle(section.title, meta.gradient_text as string)}
          </motion.h2>
        )}

        {!bodyAsList &&
          paragraphs.map((p, i) => (
            <motion.p
              key={i}
              {...fadeUp(0.1 + i * 0.05)}
              className="mt-8 text-lg leading-relaxed text-muted-foreground text-center first:mt-8"
              style={getStyle("body")}
            >
              {p}
            </motion.p>
          ))}

        {bodyAsList && listItems.length > 0 && (
          <motion.ul
            {...fadeUp(0.1)}
            className="mt-8 space-y-4 text-muted-foreground max-w-[680px] mx-auto"
            style={getStyle("body")}
          >
            {listItems.map((item, i) => (
              <li key={i} className="flex gap-3 leading-relaxed">
                <span className="text-pink">•</span>
                <span>{item}</span>
              </li>
            ))}
          </motion.ul>
        )}

        {section.image_url && (
          <motion.div {...fadeUp(0.2)} className="mt-10">
            <img
              src={section.image_url}
              alt={section.title ?? "Imagen de sección"}
              loading="lazy"
              className="w-full rounded-2xl border border-primary-foreground/10 object-cover"
            />
          </motion.div>
        )}
      </div>
    </SectionShell>
  );
}

type SolutionCard = {
  icon?: string;
  title: string;
  text: string;
  accent?: string;
  highlighted?: boolean;
  badge?: string;
};

function PainsSection({ section }: { section?: HomeSection }) {
  if (!section) return null;

  const meta = getMeta(section);
  const { getStyle } = useSectionStyles(section);
  const items = (meta.items as string[]) ?? [];
  const cardBg = meta.card_bg as string | undefined;

  return (
    <SectionShell section={section} className="py-24 px-6" defaultBg={{ background: "hsl(240 33% 6%)" }}>
      <div className="relative z-10 max-w-[800px] mx-auto">
        {section.title && (
          <motion.h2
            {...fadeUp(0)}
            className="text-section font-bold leading-[1.2] tracking-tight text-center mb-14"
            style={getStyle("title")}
          >
            {section.title}
          </motion.h2>
        )}

        <div className="space-y-5">
          {items.map((d, i) => (
            <motion.div
              key={i}
              {...fadeUp(0.1 + i * 0.08)}
              className="relative rounded-2xl p-6 md:p-8 border border-pink/10"
              style={{
                background: cardBg ?? "hsl(var(--dark-card))",
                boxShadow: "0 0 30px hsl(var(--pink) / 0.04)",
              }}
            >
              <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-8 rounded-full bg-pink" />
              <p
                className="text-base md:text-lg font-medium leading-relaxed italic text-primary-foreground/90"
                style={getStyle("body")}
              >
                "{d}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

function SolutionsSection({ section }: { section?: HomeSection }) {
  if (!section) return null;

  const meta = getMeta(section);
  const { getStyle } = useSectionStyles(section);
  const solutions = (meta.solutions as SolutionCard[]) ?? [];
  const cardBg = meta.card_bg as string | undefined;

  return (
    <SectionShell section={section} className="py-24 px-6" defaultBg={{ background: "hsl(240 33% 6%)" }}>
      <div className="relative z-10 max-w-[1100px] mx-auto">
        {section.title && (
          <motion.h2
            {...fadeUp(0)}
            className="text-section font-bold leading-[1.2] tracking-tight text-center mb-14"
            style={getStyle("title")}
          >
            {section.title}
          </motion.h2>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {solutions.map((s, i) => {
            const Icon = ICON_MAP[s.icon ?? "Settings"] ?? Settings;
            const hue = s.accent || "337 74% 44%";

            return (
              <motion.div
                key={i}
                {...fadeUp(0.1 + i * 0.1)}
                className={`relative rounded-2xl p-8 border transition-all duration-300 hover:-translate-y-1 ${
                  s.highlighted
                    ? "border-purple/40 shadow-[0_0_60px_hsl(263_70%_44%/0.12)]"
                    : "border-primary-foreground/10"
                }`}
                style={{ background: cardBg ?? "hsl(var(--dark-card))" }}
              >
                {s.highlighted && s.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest gradient-brand text-primary-foreground">
                    {s.badge}
                  </span>
                )}

                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: `hsl(${hue} / 0.12)` }}
                >
                  <Icon size={22} style={{ color: `hsl(${hue})` }} />
                </div>

                <h4 className="text-lg font-bold mb-3" style={getStyle("subtitle")}>
                  {s.title}
                </h4>
                <p className="text-[15px] leading-relaxed text-muted-foreground" style={getStyle("body")}>
                  {s.text}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SectionShell>
  );
}

function CTASection({ section }: { section?: HomeSection }) {
  if (!section) return null;

  const meta = getMeta(section);
  const { getStyle } = useSectionStyles(section);

  return (
    <SectionShell
      section={section}
      className="py-24 px-6"
      defaultBg={{
        background:
          "linear-gradient(135deg, hsl(var(--pink) / 0.15) 0%, hsl(var(--purple) / 0.1) 50%, hsl(240 33% 8%) 100%)",
      }}
    >
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 400,
          height: 400,
          top: -80,
          left: -150,
          background:
            "radial-gradient(circle, hsl(var(--pink) / 0.12) 0%, transparent 70%)",
          filter: "blur(120px)",
        }}
      />

      <div className="relative z-10 max-w-[640px] mx-auto text-center">
        {section.image_url && (
          <motion.img
            {...fadeUp(0)}
            src={section.image_url}
            alt={section.title ?? "Imagen de llamada a la acción"}
            loading="lazy"
            className="w-full rounded-2xl border border-primary-foreground/10 object-cover mb-8"
          />
        )}

        {section.title && (
          <motion.h2
            {...fadeUp(0.05)}
            className="text-section font-bold leading-[1.15] tracking-tight"
            style={getStyle("title")}
          >
            {renderTitle(section.title, meta.gradient_text as string)}
          </motion.h2>
        )}

        {section.body && (
          <motion.p
            {...fadeUp(0.12)}
            className="mt-5 text-lg leading-relaxed text-muted-foreground"
            style={getStyle("body")}
          >
            {section.body}
          </motion.p>
        )}

        <motion.div {...fadeUp(0.25)} className="mt-10 flex flex-col items-center gap-4">
          {section.cta_text && (
            <DynamicCTA
              styleKey={meta.cta_style_key as string}
              onClick={() => section.cta_url && (window.location.href = section.cta_url)}
              className="gap-2"
            >
              {section.cta_text}
            </DynamicCTA>
          )}

          {meta.cta2_text && (
            <a
              href={(meta.cta2_url as string) || "#"}
              className="text-sm font-medium text-muted-foreground hover:text-pink transition-colors"
              style={getStyle("cta")}
            >
              {meta.cta2_text as string}
            </a>
          )}
        </motion.div>
      </div>
    </SectionShell>
  );
}

export default function DynamicLandingPage({ slug }: { slug: string }) {
  const { getSection, loading } = usePageSections(slug);

  if (loading) return <div className="min-h-screen bg-dark-bg" />;

  return (
    <div className="min-h-screen bg-dark-bg text-primary-foreground">
      <Navbar />
      <HeroSection section={getSection("hero")} />
      {getSection("challenge") && <PistaStorySticky section={getSection("challenge")} />}
      <PainsSection section={getSection("pains")} />
      <TextBlockSection section={getSection("bridge")} defaultBg="hsl(240 33% 6%)" />
      <SolutionsSection section={getSection("solutions")} />
      <CTASection section={getSection("cta-final")} />
      <Footer />
    </div>
  );
}
