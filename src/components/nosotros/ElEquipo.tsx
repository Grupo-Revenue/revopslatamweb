import { motion } from "framer-motion";
import { User } from "lucide-react";
import type { HomeSection } from "@/hooks/useHomeSections";
import { useSectionStyles } from "@/hooks/useSectionStyles";
import { useSectionBackground } from "@/hooks/useSectionBackground";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

interface TeamMember {
  name: string;
  role: string;
  description: string;
  photo_url?: string;
}

const defaultTeam: TeamMember[] = [
  { name: "Nombre del miembro", role: "Rol en el equipo", description: "Línea descriptiva sobre la persona y su aporte al equipo." },
  { name: "Nombre del miembro", role: "Rol en el equipo", description: "Línea descriptiva sobre la persona y su aporte al equipo." },
  { name: "Nombre del miembro", role: "Rol en el equipo", description: "Línea descriptiva sobre la persona y su aporte al equipo." },
  { name: "Nombre del miembro", role: "Rol en el equipo", description: "Línea descriptiva sobre la persona y su aporte al equipo." },
];

const ElEquipo = ({ section }: { section?: HomeSection }) => {
  const { getStyle, getBgStyle } = useSectionStyles(section);
  const { hasBg, bgLayerStyle } = useSectionBackground(section);
  const meta = (section?.metadata ?? {}) as Record<string, unknown>;
  const title = section?.title ?? "Las personas detrás de la pista";
  const subtitle = section?.subtitle ?? "No contratamos técnicos. Buscamos personas íntegras, enseñables y apasionadas por hacer bien su trabajo. Porque una pista solo es tan buena como las personas que la diseñan.";
  const team = Array.isArray(meta.team) ? (meta.team as TeamMember[]) : defaultTeam;

  const bgStyle = getBgStyle();
  const sectionBg = bgStyle.background ? bgStyle : { background: "white" };

  return (
    <section className="relative py-20 sm:py-28 px-6 sm:px-10" style={sectionBg}>
      {hasBg && <div style={bgLayerStyle} />}
      <div className="relative z-10 max-w-[1100px] mx-auto">
        <motion.h2 {...fadeUp(0)} className="text-[32px] sm:text-[40px] md:text-[48px] font-bold leading-[1.12] tracking-tight" style={{ color: "#1A1A2E", ...getStyle("title") }}>
          {title}
        </motion.h2>

        <motion.p {...fadeUp(0.08)} className="mt-5 text-[17px] sm:text-[18px] leading-[1.7] max-w-[700px]" style={{ color: "#6B7280", ...getStyle("subtitle") }}>
          {subtitle}
        </motion.p>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          {team.map((member, i) => (
            <motion.div key={i} {...fadeUp(0.12 + i * 0.06)} className="group">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-5 flex items-center justify-center" style={{ background: "#F3F4F6" }}>
                {member.photo_url ? (
                  <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <User size={48} style={{ color: "#D1D5DB" }} />
                    <span className="text-[13px]" style={{ color: "#9CA3AF" }}>Foto próximamente</span>
                  </div>
                )}
              </div>
              <h3 className="text-[20px] sm:text-[22px] font-bold leading-[1.2]" style={{ color: "#1A1A2E" }}>{member.name}</h3>
              <p className="mt-1 text-[14px] font-semibold tracking-wide uppercase" style={{ color: "hsl(var(--pink))" }}>{member.role}</p>
              <p className="mt-2 text-[15px] leading-[1.6]" style={{ color: "#6B7280", ...getStyle("body") }}>{member.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ElEquipo;
