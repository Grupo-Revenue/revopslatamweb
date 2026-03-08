import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

import hubspotLogo from "@/assets/logos/hubspot.svg";
import whatsappLogo from "@/assets/logos/whatsapp.svg";
import slackLogo from "@/assets/logos/slack-icon.png";
import sapLogo from "@/assets/logos/sap.svg";
import defontanaLogo from "@/assets/logos/defontana-real.svg";
import zoomLogo from "@/assets/logos/zoom.svg";
import googleCalendarLogo from "@/assets/logos/google-calendar.svg";
import mailLogo from "@/assets/logos/mail.svg";

const HUBSPOT_COLOR = "#FF7A59";

interface IntegrationNode {
  label: string;
  logo: string;
  angle: number;
  color: string;
  data: string;
  bgLight?: boolean; // some logos need white bg to look good
}

const NODES: IntegrationNode[] = [
  { label: "WhatsApp", logo: whatsappLogo, angle: -90, color: "#25D366", data: "Conversaciones y leads automáticos" },
  { label: "Slack", logo: slackLogo, angle: -38, color: "#E01E5A", data: "Alertas y notificaciones en tiempo real" },
  { label: "Zoom", logo: zoomLogo, angle: 15, color: "#2D8CFF", data: "Reuniones y grabaciones sincronizadas", bgLight: true },
  { label: "Google Calendar", logo: googleCalendarLogo, angle: 62, color: "#4285F4", data: "Eventos y disponibilidad" },
  { label: "Gmail", logo: mailLogo, angle: 118, color: "#EA4335", data: "Tracking de emails y secuencias" },
  { label: "Defontana", logo: defontanaLogo, angle: 168, color: "#1565C0", data: "Facturación y contabilidad", bgLight: true },
  { label: "SAP", logo: sapLogo, angle: -142, color: "#0070B8", data: "ERP: clientes, pedidos, inventario", bgLight: true },
];

const EcosystemDiagram = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const isMobile = useIsMobile();
  const [hovered, setHovered] = useState<number | null>(null);

  /* ── Mobile version ── */
  if (isMobile) {
    return (
      <div ref={ref} className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex items-center justify-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: HUBSPOT_COLOR }}>
            <img src={hubspotLogo} alt="HubSpot" className="w-6 h-6 brightness-0 invert" />
          </div>
          <span className="text-sm font-bold text-white/70 uppercase tracking-wider">HubSpot CRM</span>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {NODES.map((n, i) => (
            <motion.div key={i} className="flex items-center gap-3 rounded-xl px-3 py-3"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.15 + i * 0.07 }}>
              <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center"
                style={{ background: n.bgLight ? "#fff" : "rgba(255,255,255,0.08)" }}>
                <img src={n.logo} alt={n.label} className="w-5 h-5 object-contain" />
              </div>
              <span className="text-xs font-semibold text-white/80">{n.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  /* ── Desktop version ── */
  const cx = 210, cy = 210, radius = 155;
  const nodeSize = 62;

  return (
    <div ref={ref} className="relative w-full max-w-[480px] mx-auto" style={{ aspectRatio: "1" }}>
      {/* Ambient glow behind diagram */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(circle at 50% 50%, ${HUBSPOT_COLOR}12 0%, transparent 60%)`,
      }} />

      {/* Glassmorphism container */}
      <div className="absolute inset-6 rounded-[28px]" style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
        border: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(16px)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), 0 20px 60px rgba(0,0,0,0.3)",
      }} />

      {/* SVG connection lines */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 420 420">
        <defs>
          <linearGradient id="eco-line" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={HUBSPOT_COLOR} stopOpacity="0.5" />
            <stop offset="100%" stopColor="#6224BE" stopOpacity="0.3" />
          </linearGradient>
          <filter id="line-glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {NODES.map((n, i) => {
          const rad = (n.angle * Math.PI) / 180;
          const nx = cx + radius * Math.cos(rad);
          const ny = cy + radius * Math.sin(rad);
          const isActive = hovered === i;
          return (
            <g key={i} filter={isActive ? "url(#line-glow)" : undefined}>
              {/* Dashed line base */}
              <line x1={cx} y1={cy} x2={nx} y2={ny}
                stroke="url(#eco-line)"
                strokeWidth={isActive ? 2 : 0.8}
                strokeDasharray={isActive ? "none" : "4 4"}
                opacity={hovered === null ? 0.5 : isActive ? 1 : 0.12}
                className="transition-all duration-400" />
              {/* Particle outgoing */}
              <circle r={isActive ? 3.5 : 2} fill={HUBSPOT_COLOR} opacity={0.9}>
                <animateMotion dur={`${3 + i * 0.15}s`} repeatCount="indefinite"
                  path={`M${cx},${cy} L${nx},${ny}`} />
              </circle>
              {/* Particle incoming */}
              <circle r={isActive ? 2.5 : 1.2} fill="#BE1869" opacity={0.5}>
                <animateMotion dur={`${3 + i * 0.15}s`} begin={`${1.5 + i * 0.1}s`} repeatCount="indefinite"
                  path={`M${nx},${ny} L${cx},${cy}`} />
              </circle>
            </g>
          );
        })}
      </svg>

      {/* ── HubSpot center ── */}
      <motion.div
        className="absolute z-20 rounded-full flex items-center justify-center"
        style={{
          width: 88, height: 88,
          left: cx - 44, top: cy - 44,
          background: `radial-gradient(circle at 35% 35%, #FF9A7B, ${HUBSPOT_COLOR} 50%, #FF5C35 100%)`,
          boxShadow: `0 0 0 6px rgba(255,122,89,0.12), 0 0 50px ${HUBSPOT_COLOR}44, 0 8px 32px rgba(0,0,0,0.3)`,
        }}
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.15 }}
      >
        <img src={hubspotLogo} alt="HubSpot" className="w-11 h-11 brightness-0 invert drop-shadow-lg" />
      </motion.div>

      {/* ── Integration nodes ── */}
      {NODES.map((n, i) => {
        const rad = (n.angle * Math.PI) / 180;
        const nx = cx + radius * Math.cos(rad);
        const ny = cy + radius * Math.sin(rad);
        const isActive = hovered === i;

        return (
          <motion.div
            key={i}
            className="absolute z-10 flex flex-col items-center cursor-pointer group"
            style={{ left: nx - nodeSize / 2, top: ny - nodeSize / 2 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.25 + i * 0.06 }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Node circle */}
            <div
              className="rounded-full flex items-center justify-center transition-all duration-300 overflow-hidden"
              style={{
                width: nodeSize, height: nodeSize,
                background: isActive ? "#ffffff" : "rgba(255,255,255,0.92)",
                border: `2px solid ${isActive ? n.color : "rgba(255,255,255,0.2)"}`,
                boxShadow: isActive
                  ? `0 0 0 4px ${n.color}22, 0 0 24px ${n.color}33, 0 8px 24px rgba(0,0,0,0.25)`
                  : "0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.5)",
                transform: isActive ? "scale(1.18)" : "scale(1)",
              }}
            >
              <img
                src={n.logo}
                alt={n.label}
                className="object-contain transition-transform duration-300"
                style={{
                  width: nodeSize * 0.52,
                  height: nodeSize * 0.52,
                  transform: isActive ? "scale(1.1)" : "scale(1)",
                }}
              />
            </div>
            {/* Label */}
            <span
              className="mt-2 text-[11px] font-bold whitespace-nowrap transition-all duration-300 tracking-wide"
              style={{
                color: isActive ? "#fff" : "rgba(255,255,255,0.5)",
                textShadow: isActive ? `0 0 12px ${n.color}66` : "none",
              }}
            >
              {n.label}
            </span>
          </motion.div>
        );
      })}

      {/* ── Hover tooltip ── */}
      <AnimatePresence>
        {hovered !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute z-30 left-1/2 -translate-x-1/2 bottom-3 text-sm px-5 py-3 rounded-2xl whitespace-nowrap pointer-events-none"
            style={{
              background: "rgba(15,15,30,0.92)",
              border: `1px solid ${NODES[hovered].color}33`,
              backdropFilter: "blur(12px)",
              boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03) inset`,
            }}
          >
            <span className="font-bold" style={{ color: NODES[hovered].color }}>{NODES[hovered].label}</span>
            <span className="text-white/50 mx-2">·</span>
            <span className="text-white/70">{NODES[hovered].data}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EcosystemDiagram;
