import { motion } from "framer-motion";
import { User } from "lucide-react";
import type { HomeSection } from "@/hooks/useHomeSections";

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
  is_founder?: boolean;
}

const defaultTeam: TeamMember[] = [
  { name: "Nombre del miembro", role: "Rol en el equipo", description: "Línea descriptiva sobre la persona y su aporte al equipo." },
  { name: "Nombre del miembro", role: "Rol en el equipo", description: "Línea descriptiva sobre la persona y su aporte al equipo." },
  { name: "Nombre del miembro", role: "Rol en el equipo", description: "Línea descriptiva sobre la persona y su aporte al equipo." },
  { name: "Nombre del miembro", role: "Rol en el equipo", description: "Línea descriptiva sobre la persona y su aporte al equipo." },
];

const ElEquipo = ({ section }: { section?: HomeSection }) => {
  const meta = (section?.metadata ?? {}) as Record<string, unknown>;
  const title = section?.title ?? "Las personas detrás de la pista";
  const subtitle = section?.subtitle ?? "No contratamos técnicos. Buscamos personas íntegras, enseñables y apasionadas por hacer bien su trabajo. Porque una pista solo es tan buena como las personas que la diseñan.";
  const team = Array.isArray(meta.team) ? (meta.team as TeamMember[]) : defaultTeam;

  return (
    <section className="relative" style={{ padding: "100px 5%" }}>
      <div className="relative z-10 max-w-[1100px] mx-auto">
        <motion.h2
          {...fadeUp(0)}
          style={{
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: 800,
            lineHeight: 1.12,
            letterSpacing: "-0.03em",
            color: "#F0F4FF",
          }}
        >
          {title}
        </motion.h2>

        <motion.p
          {...fadeUp(0.08)}
          className="max-w-[700px]"
          style={{ marginTop: 20, fontSize: "1.05rem", lineHeight: 1.7, color: "rgba(240,244,255,0.5)" }}
        >
          {subtitle}
        </motion.p>

        {/* Asymmetric team grid */}
        <div
          className="mt-14 grid gap-6"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          }}
        >
          {team.map((member, i) => (
            <motion.div
              key={i}
              {...fadeUp(0.12 + i * 0.06)}
              className="group relative overflow-hidden cursor-pointer"
              style={{
                borderRadius: 16,
                ...(member.is_founder ? { gridColumn: "span 2", maxWidth: 400 } : {}),
              }}
            >
              {/* Photo area */}
              <div
                className="relative overflow-hidden"
                style={{
                  aspectRatio: "4/5",
                  background: "rgba(15,21,32,1)",
                  borderRadius: 16,
                }}
              >
                {member.photo_url ? (
                  <img
                    src={member.photo_url}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    style={{ filter: "grayscale(20%)" }}
                    loading="lazy"
                    onMouseEnter={(e) => (e.currentTarget.style.filter = "grayscale(0%)")}
                    onMouseLeave={(e) => (e.currentTarget.style.filter = "grayscale(20%)")}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-3">
                    <User size={48} style={{ color: "rgba(240,244,255,0.15)" }} />
                    <span style={{ fontSize: "0.8rem", color: "rgba(240,244,255,0.25)" }}>
                      Foto próximamente
                    </span>
                  </div>
                )}

                {/* Overlay */}
                <div
                  className="absolute bottom-0 left-0 right-0 transition-transform duration-300 group-hover:translate-y-0"
                  style={{
                    background: "linear-gradient(transparent, rgba(8,12,16,0.95))",
                    padding: "48px 24px 24px",
                    transform: "translateY(8px)",
                  }}
                >
                  <p style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 4, color: "#F0F4FF" }}>
                    {member.name}
                  </p>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "hsl(var(--green))",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      marginBottom: 8,
                    }}
                  >
                    {member.role}
                  </p>
                  <p
                    className="opacity-0 translate-y-2 transition-all duration-300 delay-100 group-hover:opacity-100 group-hover:translate-y-0"
                    style={{ fontSize: "0.85rem", color: "rgba(240,244,255,0.6)", fontStyle: "italic" }}
                  >
                    {member.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ElEquipo;
