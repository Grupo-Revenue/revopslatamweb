import { memo } from "react";

/* ═══════════════════════════════════════════════════════════
   Inline SVG Track — animation-ready with layered groups
   Zones: marketing (blue), sales (pink), service (teal)
   ═══════════════════════════════════════════════════════════ */

type Props = {
  opacity?: number;
  /** Highlight specific zones */
  activeZones?: { marketing?: boolean; sales?: boolean; service?: boolean };
  /** Zone currently glowing */
  glowZone?: string | null;
  className?: string;
};

function TrackSVGRaw({ opacity = 0.7, activeZones, glowZone, className }: Props) {
  const mkt = activeZones?.marketing;
  const sal = activeZones?.sales;
  const svc = activeZones?.service;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 1100"
      fill="none"
      className={className}
      style={{ opacity, transition: "opacity 0.7s ease" }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="g_pink" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#BE1869" />
          <stop offset="100%" stopColor="#88064B" />
        </linearGradient>
        <linearGradient id="g_blue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0779D6" />
          <stop offset="100%" stopColor="#055DA6" />
        </linearGradient>
        <linearGradient id="g_teal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1CA398" />
          <stop offset="100%" stopColor="#148F85" />
        </linearGradient>
        <linearGradient id="pillar_s" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3A3D42" />
          <stop offset="100%" stopColor="#23262A" />
        </linearGradient>
        {/* Glow filters */}
        <filter id="glow_blue" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="18" result="blur" />
          <feFlood floodColor="#0779D6" floodOpacity="0.35" />
          <feComposite in2="blur" operator="in" />
          <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="glow_pink" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="18" result="blur" />
          <feFlood floodColor="#BE1869" floodOpacity="0.35" />
          <feComposite in2="blur" operator="in" />
          <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="glow_teal" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="18" result="blur" />
          <feFlood floodColor="#1CA398" floodOpacity="0.35" />
          <feComposite in2="blur" operator="in" />
          <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* ──── TRACK BASE ──── */}
      <g id="track_base">
        {/* Bottom platform */}
        <polygon points="100,920 400,750 700,920 400,1090" fill="#2A2D32" stroke="#23262A" strokeWidth="2" />
        <polygon points="100,920 400,750 700,920 400,850" fill="#32363B" stroke="#23262A" strokeWidth="1.5" opacity="0.5" />

        {/* Ascending steps */}
        <polygon points="120,900 200,855 220,865 140,910" fill="#32363B" stroke="#3A3D42" strokeWidth="1.5" />
        <polygon points="140,880 220,835 240,845 160,890" fill="#32363B" stroke="#3A3D42" strokeWidth="1.5" />
        <polygon points="160,860 240,815 260,825 180,870" fill="#32363B" stroke="#3A3D42" strokeWidth="1.5" />

        {/* Ramp 1: bottom-left → right */}
        <polygon points="180,830 380,710 400,720 200,840" fill="#2E3136" stroke="#3A3D42" strokeWidth="1.5" />
        {/* Ramp 2: right → left */}
        <polygon points="400,700 600,580 620,590 420,710" fill="#2E3136" stroke="#3A3D42" strokeWidth="1.5" />
        {/* Ramp 3: left → right */}
        <polygon points="200,580 420,460 440,470 220,590" fill="#2E3136" stroke="#3A3D42" strokeWidth="1.5" />
        {/* Ramp 4: right → top */}
        <polygon points="440,440 620,330 640,340 460,450" fill="#2E3136" stroke="#3A3D42" strokeWidth="1.5" />
        {/* Upper platform */}
        <polygon points="500,300 640,220 700,255 560,335" fill="#2E3136" stroke="#3A3D42" strokeWidth="1.5" />

        {/* Pillars */}
        {[
          { cx: 230, cy: 840, h: 60 },
          { cx: 370, cy: 720, h: 70 },
          { cx: 580, cy: 590, h: 100 },
          { cx: 280, cy: 590, h: 90 },
          { cx: 610, cy: 340, h: 80 },
        ].map((p, i) => (
          <g key={`pillar-${i}`}>
            <ellipse cx={p.cx} cy={p.cy} rx={18} ry={10} fill="#2A2D32" stroke="#3A3D42" strokeWidth="1" />
            <rect x={p.cx - 18} y={p.cy - p.h} width={36} height={p.h} fill="url(#pillar_s)" stroke="#3A3D42" strokeWidth="1" />
            <ellipse cx={p.cx} cy={p.cy - p.h} rx={18} ry={10} fill="#32363B" stroke="#3A3D42" strokeWidth="1" />
          </g>
        ))}

        {/* Guard rails */}
        {[
          "180,825 380,705", "200,835 400,715",
          "400,695 600,575", "420,705 620,585",
          "200,575 420,455", "220,585 440,465",
          "440,435 620,325", "460,445 640,335",
        ].map((pts, i) => (
          <polyline key={`rail-${i}`} points={pts} fill="none" stroke="#444" strokeWidth="0.8" strokeDasharray="4,4" />
        ))}

        {/* Direction arrows */}
        {[
          { x: 290, y: 770 }, { x: 500, y: 640 },
          { x: 320, y: 520 }, { x: 540, y: 380 },
        ].map((a, i) => (
          <polygon
            key={`arrow-${i}`}
            points={`${a.x},${a.y} ${a.x + 10},${a.y - 8} ${a.x + 6},${a.y} ${a.x + 10},${a.y + 8}`}
            fill="#F6BD1A"
            opacity="0.6"
          />
        ))}
      </g>

      {/* ──── ZONE: MARKETING (blue) ──── */}
      <g id="zone_marketing" filter={glowZone === "marketing" ? "url(#glow_blue)" : undefined}>
        <polygon points="150,890 250,835 270,845 170,900" fill="url(#g_blue)" opacity={mkt ? 0.4 : 0.15} stroke="#0779D6" strokeWidth="1">
          <animate attributeName="opacity" values={mkt ? "0.3;0.5;0.3" : "0.15"} dur="2s" repeatCount="indefinite" />
        </polygon>
        <polygon points="350,760 450,705 470,715 370,770" fill="url(#g_blue)" opacity={mkt ? 0.4 : 0.15} stroke="#0779D6" strokeWidth="1" />
        <line x1="200" y1="840" x2="200" y2="828" stroke="#0779D6" strokeWidth={mkt ? 4 : 2.5} strokeLinecap="round" opacity={mkt ? 1 : 0.5} />
        <line x1="380" y1="710" x2="400" y2="698" stroke="#0779D6" strokeWidth={mkt ? 4 : 2.5} strokeLinecap="round" opacity={mkt ? 1 : 0.5} />
      </g>

      {/* ──── ZONE: SALES (pink) ──── */}
      <g id="zone_sales" filter={glowZone === "ventas" ? "url(#glow_pink)" : undefined}>
        <polygon points="460,640 560,585 580,595 480,650" fill="url(#g_pink)" opacity={sal ? 0.35 : 0.12} stroke="#BE1869" strokeWidth="1">
          <animate attributeName="opacity" values={sal ? "0.25;0.45;0.25" : "0.12"} dur="2s" repeatCount="indefinite" />
        </polygon>
        <polygon points="250,540 350,485 370,495 270,550" fill="url(#g_pink)" opacity={sal ? 0.35 : 0.12} stroke="#BE1869" strokeWidth="1" />
        <line x1="600" y1="580" x2="620" y2="588" stroke="#BE1869" strokeWidth={sal ? 4 : 2.5} strokeLinecap="round" opacity={sal ? 1 : 0.5} />
        <line x1="420" y1="460" x2="440" y2="468" stroke="#BE1869" strokeWidth={sal ? 4 : 2.5} strokeLinecap="round" opacity={sal ? 1 : 0.5} />
      </g>

      {/* ──── ZONE: SERVICE (teal) ──── */}
      <g id="zone_service" filter={glowZone === "servicio" ? "url(#glow_teal)" : undefined}>
        <polygon points="520,320 600,280 620,290 540,330" fill="url(#g_teal)" opacity={svc ? 0.35 : 0.12} stroke="#1CA398" strokeWidth="1">
          <animate attributeName="opacity" values={svc ? "0.25;0.45;0.25" : "0.12"} dur="2s" repeatCount="indefinite" />
        </polygon>
        <line x1="640" y1="330" x2="650" y2="280" stroke="#1CA398" strokeWidth={svc ? 4 : 2.5} strokeLinecap="round" opacity={svc ? 1 : 0.5} />
      </g>

      {/* ──── GEAR ──── */}
      <g id="gear">
        <circle cx={680} cy={220} r={50} fill="none" stroke="#BE1869" strokeWidth="2.5" opacity={svc ? 0.8 : 0.4}>
          {svc && <animateTransform attributeName="transform" type="rotate" values="0 680 220;360 680 220" dur="6s" repeatCount="indefinite" />}
        </circle>
        <circle cx={680} cy={220} r={35} fill="none" stroke="#88064B" strokeWidth="1.5" opacity="0.3" />
        <circle cx={680} cy={220} r={12} fill="#BE1869" opacity={svc ? 0.5 : 0.2} />

        {/* Teeth */}
        <g stroke="#BE1869" strokeWidth="2.5" opacity={svc ? 0.6 : 0.3}>
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a) => {
            const rad = (a * Math.PI) / 180;
            return (
              <line
                key={a}
                x1={680 + Math.cos(rad) * 48}
                y1={220 + Math.sin(rad) * 48}
                x2={680 + Math.cos(rad) * 58}
                y2={220 + Math.sin(rad) * 58}
              />
            );
          })}
        </g>

        {/* Mounting */}
        <ellipse cx={680} cy={270} rx={30} ry={12} fill="#2A2D32" stroke="#3A3D42" strokeWidth="1.5" />
        <rect x={650} y={250} width={60} height={20} fill="url(#pillar_s)" stroke="#3A3D42" strokeWidth="1" />
        <ellipse cx={680} cy={250} rx={30} ry={12} fill="#32363B" stroke="#3A3D42" strokeWidth="1.5" />
      </g>

      {/* ──── START ──── */}
      <g id="start">
        <polygon points="80,940 160,895 180,905 100,950" fill="#0779D6" opacity="0.3" stroke="#0779D6" strokeWidth="1.5" />
        <polygon points="80,940 100,950 100,965 80,955" fill="#055DA6" opacity="0.3" />
        <polygon points="100,950 180,905 180,920 100,965" fill="#0779D6" opacity="0.2" />
        <line x1={120} y1={930} x2={120} y2={895} stroke="#0779D6" strokeWidth="2" />
        <polygon points="120,895 150,905 120,915" fill="#0779D6" opacity="0.6" />
        <circle cx={120} cy={893} r={3} fill="#0779D6" />
      </g>

      {/* ──── GOAL ──── */}
      <g id="goal">
        <polygon points="700,160 760,128 780,138 720,170" fill="#1CA398" opacity="0.3" stroke="#1CA398" strokeWidth="1.5" />
        <polygon points="700,160 720,170 720,185 700,175" fill="#148F85" opacity="0.3" />
        <polygon points="720,170 780,138 780,153 720,185" fill="#1CA398" opacity="0.2" />
        <line x1={740} y1={155} x2={740} y2={115} stroke="#1CA398" strokeWidth="2" />
        <rect x={740} y={115} width={20} height={14} fill="#1CA398" opacity="0.6" />
        <rect x={740} y={115} width={10} height={7} fill="#148F85" opacity="0.8" />
        <rect x={750} y={122} width={10} height={7} fill="#148F85" opacity="0.8" />
        <circle cx={740} cy={113} r={3} fill="#1CA398" />
        {/* Star */}
        <polygon points="755,100 758,108 766,108 760,113 762,121 755,117 748,121 750,113 744,108 752,108" fill="#F6BD1A" opacity="0.5" />
      </g>

      {/* ──── HOTSPOT AREAS (transparent, for interaction) ──── */}
      <g id="hotspots">
        <rect id="hotspot_marketing" x={100} y={700} width={380} height={320} rx={8} fill="transparent" />
        <rect id="hotspot_sales" x={200} y={430} width={440} height={280} rx={8} fill="transparent" />
        <rect id="hotspot_service" x={440} y={150} width={360} height={290} rx={8} fill="transparent" />
      </g>

      {/* ──── MOTION PATH (hidden, for ball animation reference) ──── */}
      <path
        id="ball_path"
        d="M120,930 L190,835 L290,770 L390,710 L500,645 L600,585 L420,460 L310,520 L220,580 L330,510 L440,450 L540,390 L630,340 L660,280 L680,240 L720,170 L740,150"
        fill="none"
        stroke="none"
      />
    </svg>
  );
}

const TrackSVG = memo(TrackSVGRaw);
export default TrackSVG;
