import { motion } from "framer-motion";
import type { HomeSection } from "@/hooks/useHomeSections";

const defaultClients = [
  "Empresa Alpha", "TechCorp", "Innova Group", "Soluciones Pro",
  "DataFlow", "CloudBase", "Nexus Digital", "Vertex Labs",
  "Onda Media", "Pulse Commerce",
];

const LogoPlaceholder = ({ name }: { name: string }) => (
  <div
    className="flex-shrink-0 flex items-center justify-center rounded-lg px-8 py-4 mx-4"
    style={{
      minWidth: 160, height: 56,
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.08)",
    }}
  >
    <span className="text-[14px] font-semibold tracking-wide whitespace-nowrap" style={{ color: "rgba(255,255,255,0.35)" }}>
      {name}
    </span>
  </div>
);

const ClientLogos = ({ section }: { section?: HomeSection }) => {
  const meta = (section?.metadata ?? {}) as Record<string, unknown>;
  const clients = (meta.clients as string[]) ?? defaultClients;
  const title = section?.title ?? "Empresas que confían en nosotros";
  const doubled = [...clients, ...clients];

  return (
    <section className="relative py-10 overflow-hidden" style={{ background: "#0D0D1A" }}>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center text-[11px] font-semibold tracking-[0.2em] uppercase mb-6"
        style={{ color: "rgba(255,255,255,0.3)" }}
      >
        {title}
      </motion.p>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10" style={{ background: "linear-gradient(to right, #0D0D1A, transparent)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10" style={{ background: "linear-gradient(to left, #0D0D1A, transparent)" }} />
        <div className="flex animate-marquee">
          {doubled.map((name, i) => (
            <LogoPlaceholder key={`${name}-${i}`} name={name} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientLogos;
