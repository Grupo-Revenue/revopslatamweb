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
  const clientsData = meta.clients_data as ClientData[] | undefined;
  const clientNames = (meta.clients as string[]) ?? defaultClients;

  const hasLogos = clientsData && clientsData.length > 0 && clientsData.some((c) => c.logo_url);

  // Repeat enough times to ensure seamless loop
  const repeat = (arr: any[]) => [...arr, ...arr, ...arr, ...arr];
  const items = hasLogos ? repeat(clientsData!) : repeat(clientNames);

  return (
    <section className="relative py-5 overflow-hidden" style={{ background: "#FFFFFF" }}>
      <div className="relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-20 z-10" style={{ background: "linear-gradient(to right, #FFFFFF, transparent)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-20 z-10" style={{ background: "linear-gradient(to left, #FFFFFF, transparent)" }} />
        <div className="marquee-track">
          {hasLogos
            ? items.map((client: ClientData, i: number) => <LogoImage key={`${client.name}-${i}`} client={client} />)
            : items.map((name: string, i: number) => <LogoPlaceholder key={`${name}-${i}`} name={name} />)
          }
        </div>
      </div>
    </section>
  );
};

export default ClientLogos;
