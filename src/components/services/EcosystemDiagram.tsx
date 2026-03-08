import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

import hubspotLogo from "@/assets/logos/hubspot.svg";
import whatsappLogo from "@/assets/logos/whatsapp.svg";
import slackLogo from "@/assets/logos/slack-icon.png";
import sapLogo from "@/assets/logos/sap.svg";
import defontanaLogo from "@/assets/logos/defontana.png";
import zoomLogo from "@/assets/logos/zoom.svg";
import googleCalendarLogo from "@/assets/logos/google-calendar.svg";
import mailLogo from "@/assets/logos/mail.svg";

const HUBSPOT_COLOR = "#FF7A59";
const GRADIENT = "linear-gradient(135deg, #BE1869, #6224BE)";

interface IntegrationNode {
  label: string;
  logo: string;
  angle: number;
  color: string;
  data: string;
}

const NODES: IntegrationNode[] = [
  { label: "WhatsApp", logo: whatsappLogo, angle: -90, color: "#25D366", data: "Conversaciones y leads automáticos" },
  { label: "Slack", logo: slackLogo, angle: -35, color: "#4A154B", data: "Alertas y notificaciones en tiempo real" },
  { label: "Zoom", logo: zoomLogo, angle: 20, color: "#2D8CFF", data: "Reuniones y grabaciones sincronizadas" },
  { label: "Google Calendar", logo: googleCalendarLogo, angle: 70, color: "#4285F4", data: "Eventos y disponibilidad" },
  { label: "Gmail", logo: mailLogo, angle: 125, color: "#EA4335", data: "Tracking de emails y secuencias" },
  { label: "Defontana", logo: defontanaLogo, angle: 180, color: "#1565C0", data: "Facturación y contabilidad" },
  { label: "SAP", logo: sapLogo, angle: -145, color: "#0070B8", data: "ERP: clientes, pedidos, inventario" },
];

const EcosystemDiagram = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const isMobile = useIsMobile();
  const [hovered, setHovered] = useState<number | null>(null);

  if (isMobile) {
    return (
      <div ref={ref} className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex items-center justify-center gap-3 mb-6">
          <img src={hubspotLogo} alt="HubSpot" className="w-10 h-10" />
          <span className="text-sm font-bold text-white/70 uppercase tracking-wider">HubSpot CRM</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {NODES.map((n, i) => (
            <motion.div key={i} className="flex items-center gap-3 rounded-xl px-3 py-3"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.15 + i * 0.07 }}>
              <img src={n.logo} alt={n.label} className="w-6 h-6 object-contain rounded" />
              <span className="text-xs font-semibold text-white/80">{n.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  const cx = 200, cy = 200, radius = 150;

  return (
    <div ref={ref} className="relative w-full max-w-[460px] mx-auto aspect-square">
      {/* Glassmorphism container */}
      <div className="absolute inset-4 rounded-3xl" style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(12px)",
      }} />

      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
        <defs>
          <linearGradient id="eco-line-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#BE1869" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#6224BE" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        {NODES.map((n, i) => {
          const rad = (n.angle * Math.PI) / 180;
          const nx = cx + radius * Math.cos(rad);
          const ny = cy + radius * Math.sin(rad);
          const isActive = hovered === i;
          return (
            <g key={i}>
              <line x1={cx} y1={cy} x2={nx} y2={ny}
                stroke="url(#eco-line-grad)"
                strokeWidth={isActive ? 2.5 : 1}
                opacity={hovered === null ? 0.4 : isActive ? 1 : 0.15}
                className="transition-all duration-300" />
              {/* Animated particles */}
              <circle r={isActive ? 3.5 : 2} fill={isActive ? HUBSPOT_COLOR : "#BE1869"} opacity={0.8}>
                <animateMotion dur={`${2.5 + i * 0.2}s`} repeatCount="indefinite"
                  path={`M${cx},${cy} L${nx},${ny}`} />
              </circle>
              <circle r={isActive ? 3 : 1.5} fill="#6224BE" opacity={0.5}>
                <animateMotion dur={`${2.5 + i * 0.2}s`} begin={`${1.2 + i * 0.1}s`} repeatCount="indefinite"
                  path={`M${nx},${ny} L${cx},${cy}`} />
              </circle>
            </g>
          );
        })}
      </svg>

      {/* HubSpot center node */}
      <motion.div
        className="absolute z-20 flex items-center justify-center rounded-full"
        style={{
          width: 80, height: 80,
          left: cx - 40, top: cy - 40,
          background: `radial-gradient(circle, ${HUBSPOT_COLOR}, #FF5C35)`,
          boxShadow: `0 0 40px ${HUBSPOT_COLOR}55, 0 0 80px ${HUBSPOT_COLOR}22`,
        }}
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
      >
        <img src={hubspotLogo} alt="HubSpot" className="w-10 h-10 brightness-0 invert" />
      </motion.div>

      {/* Integration nodes */}
      {NODES.map((n, i) => {
        const rad = (n.angle * Math.PI) / 180;
        const nx = cx + radius * Math.cos(rad);
        const ny = cy + radius * Math.sin(rad);
        const isActive = hovered === i;
        const nodeSize = 56;

        return (
          <motion.div
            key={i}
            className="absolute z-10 flex flex-col items-center cursor-pointer"
            style={{
              left: nx - nodeSize / 2,
              top: ny - nodeSize / 2,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ type: "spring", stiffness: 200, delay: 0.3 + i * 0.08 }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <div
              className="flex items-center justify-center rounded-2xl transition-all duration-300"
              style={{
                width: nodeSize, height: nodeSize,
                background: isActive ? `rgba(255,255,255,0.12)` : "rgba(255,255,255,0.05)",
                border: `1.5px solid ${isActive ? n.color : "rgba(255,255,255,0.12)"}`,
                boxShadow: isActive ? `0 0 20px ${n.color}33` : "none",
                transform: isActive ? "scale(1.15)" : "scale(1)",
              }}
            >
              <img src={n.logo} alt={n.label} className="w-7 h-7 object-contain" />
            </div>
            <span className={`mt-1.5 text-[11px] font-semibold whitespace-nowrap transition-colors duration-300 ${isActive ? "text-white" : "text-white/50"}`}>
              {n.label}
            </span>
          </motion.div>
        );
      })}

      {/* Hover tooltip */}
      <AnimatePresence>
        {hovered !== null && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute z-30 left-1/2 -translate-x-1/2 bottom-2 text-sm px-5 py-2.5 rounded-xl whitespace-nowrap"
            style={{
              background: "rgba(26,26,46,0.95)",
              border: `1px solid ${NODES[hovered].color}44`,
              backdropFilter: "blur(8px)",
              boxShadow: `0 4px 20px ${NODES[hovered].color}22`,
            }}
          >
            <span className="font-bold" style={{ color: NODES[hovered].color }}>{NODES[hovered].label}</span>
            <span className="text-white/60 ml-2">{NODES[hovered].data}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EcosystemDiagram;
