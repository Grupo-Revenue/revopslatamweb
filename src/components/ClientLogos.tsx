import { motion } from "framer-motion";
import type { HomeSection } from "@/hooks/useHomeSections";

const defaultClients = [
  "Empresa Alpha", "TechCorp", "Innova Group", "Soluciones Pro",
  "DataFlow", "CloudBase", "Nexus Digital", "Vertex Labs",
  "Onda Media", "Pulse Commerce",
];

type ClientData = { name: string; logo_url: string };

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

const LogoImage = ({ client }: { client: ClientData }) => (
  <div
    className="flex-shrink-0 flex items-center justify-center mx-6"
    style={{ minWidth: 140, height: 56 }}
  >
    <img
      src={client.logo_url}
      alt={client.name}
      className="h-10 max-w-[140px] object-contain"
    />
  </div>
);

const ClientLogos = ({ section }: { section?: HomeSection }) => {
  const meta = (section?.metadata ?? {}) as Record<string, unknown>;
  const clientsData = meta.clients_data as ClientData[] | undefined;
  const clientNames = (meta.clients as string[]) ?? defaultClients;
  const title = section?.title ?? "Empresas que confían en nosotros";

  const hasLogos = clientsData && clientsData.length > 0 && clientsData.some((c) => c.logo_url);

  // Double items for seamless marquee
  const doubledData = hasLogos ? [...clientsData!, ...clientsData!] : [];
  const doubledNames = !hasLogos ? [...clientNames, ...clientNames] : [];

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
          {hasLogos
            ? doubledData.map((client, i) => <LogoImage key={`${client.name}-${i}`} client={client} />)
            : doubledNames.map((name, i) => <LogoPlaceholder key={`${name}-${i}`} name={name} />)
          }
        </div>
      </div>
    </section>
  );
};

export default ClientLogos;
