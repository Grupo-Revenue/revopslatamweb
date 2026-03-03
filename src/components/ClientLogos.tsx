import type { HomeSection } from "@/hooks/useHomeSections";

const defaultClients = [
  "Empresa Alpha", "TechCorp", "Innova Group", "Soluciones Pro",
  "DataFlow", "CloudBase", "Nexus Digital", "Vertex Labs",
  "Onda Media", "Pulse Commerce",
];

type ClientData = { name: string; logo_url: string };

const LogoPlaceholder = ({ name }: { name: string }) => (
  <div
    className="flex-shrink-0 flex items-center justify-center px-5"
    style={{ height: 48 }}
  >
    <span className="text-[13px] font-medium tracking-wide whitespace-nowrap" style={{ color: "rgba(0,0,0,0.3)" }}>
      {name}
    </span>
  </div>
);

const LogoImage = ({ client }: { client: ClientData }) => (
  <div
    className="flex-shrink-0 flex items-center justify-center px-6"
    style={{ height: 64 }}
  >
    <img
      src={client.logo_url}
      alt={client.name}
      className="h-16 max-w-[200px] object-contain"
    />
  </div>
);

const ClientLogos = ({ section }: { section?: HomeSection }) => {
  const meta = (section?.metadata ?? {}) as Record<string, unknown>;
  const clientsData = Array.isArray(meta.clients_data)
    ? meta.clients_data.filter((item): item is ClientData => {
        if (!item || typeof item !== "object") return false;
        const client = item as Record<string, unknown>;
        return typeof client.name === "string" && typeof client.logo_url === "string";
      })
    : undefined;
  const clientNames = Array.isArray(meta.clients)
    ? meta.clients.filter((item): item is string => typeof item === "string")
    : defaultClients;

  const hasLogos = clientsData && clientsData.length > 0 && clientsData.some((c) => c.logo_url);

  // Repeat enough times to ensure seamless loop
  const repeat = <T,>(arr: T[]) => [...arr, ...arr, ...arr, ...arr];
  const logoItems = hasLogos ? repeat(clientsData ?? []) : [];
  const textItems = hasLogos ? [] : repeat(clientNames);

  return (
    <section className="relative py-3 sm:py-5 overflow-hidden" style={{ background: "#FFFFFF" }}>
      <div className="relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-20 z-10" style={{ background: "linear-gradient(to right, #FFFFFF, transparent)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-20 z-10" style={{ background: "linear-gradient(to left, #FFFFFF, transparent)" }} />
        <div className="marquee-track">
          {hasLogos
            ? logoItems.map((client, i) => <LogoImage key={`${client.name}-${i}`} client={client} />)
            : textItems.map((name, i) => <LogoPlaceholder key={`${name}-${i}`} name={name} />)
          }
        </div>
      </div>
    </section>
  );
};

export default ClientLogos;
