import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── palette per screen ─── */
const BG_COLORS = [
  "#1A1033", "#1C1240", "#1E1550", "#16203A",
  "#0F2030", "#0A2028", "#082018", "#0A1F1A",
];

const TOTAL_SCREENS = 8;

/* ─── typing dots animation ─── */
const TypingDots = () => (
  <span className="inline-flex items-center gap-[5px] h-5 px-1">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="w-[6px] h-[6px] rounded-full bg-white/50"
        style={{
          animation: `typingBounce 1.2s ease-in-out ${i * 0.15}s infinite`,
        }}
      />
    ))}
  </span>
);

/* ─── AI bubble ─── */
const AIBubble = ({
  children,
  isTyping = false,
}: {
  children?: React.ReactNode;
  isTyping?: boolean;
}) => (
  <div className="flex flex-col gap-1.5 max-w-[92%]">
    <span className="text-[10px] tracking-[0.12em] uppercase text-white/35 font-medium pl-1">
      Revops LATAM
    </span>
    <div
      className="rounded-2xl rounded-bl-md px-4 py-3 text-[15px] leading-relaxed text-white/90"
      style={{
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(8px)",
      }}
    >
      {isTyping ? <TypingDots /> : children}
    </div>
  </div>
);

/* ─── user bubble ─── */
const UserBubble = ({ children }: { children: React.ReactNode }) => (
  <div className="flex justify-end">
    <div
      className="rounded-2xl rounded-br-md px-4 py-3 text-[15px] leading-relaxed text-white max-w-[85%]"
      style={{ background: "rgba(98,36,190,0.35)", border: "1px solid rgba(98,36,190,0.2)" }}
    >
      {children}
    </div>
  </div>
);

/* ─── text input bar ─── */
const ChatInput = ({
  value,
  onChange,
  onSend,
  placeholder = "Escribe aquí...",
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  placeholder?: string;
}) => (
  <div
    className="flex items-center gap-2 rounded-full px-4 py-2"
    style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.08)" }}
  >
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && value.trim() && onSend()}
      placeholder={placeholder}
      className="flex-1 bg-transparent text-white text-[15px] placeholder:text-white/30 outline-none font-[Lexend]"
    />
    <button
      onClick={onSend}
      disabled={!value.trim()}
      className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 disabled:opacity-30"
      style={{ background: "#6224BE" }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </button>
  </div>
);

/* ─── progress dots ─── */
const ProgressDots = ({ current, total }: { current: number; total: number }) => (
  <div className="flex items-center gap-2 justify-center">
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        className="rounded-full transition-all duration-500"
        style={{
          width: i === current ? 20 : 6,
          height: 6,
          background: i === current ? "#fff" : "rgba(255,255,255,0.2)",
        }}
      />
    ))}
  </div>
);

/* ─── screen transition wrapper ─── */
const screenVariants = {
  initial: { opacity: 0, y: 20, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -12, filter: "blur(4px)", transition: { duration: 0.35 } },
};

/* ════════════════════════════════════════════ */
/*  MAIN COMPONENT                             */
/* ════════════════════════════════════════════ */
const AgenticLandingPage = () => {
  const [screen, setScreen] = useState(0);
  const [chatInputs, setChatInputs] = useState<Record<number, string>>({});
  const [messages, setMessages] = useState<{ role: "ai" | "user"; text: string }[]>([]);
  const [showTyping, setShowTyping] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showTyping]);

  // Simulate typing then show AI message
  const simulateAI = useCallback((text: string, thenScreen?: number) => {
    setShowTyping(true);
    setTimeout(() => {
      setShowTyping(false);
      setMessages((prev) => [...prev, { role: "ai", text }]);
      if (thenScreen !== undefined) setScreen(thenScreen);
    }, 1800);
  }, []);

  const handleUserSend = (screenNum: number) => {
    const val = chatInputs[screenNum]?.trim();
    if (!val) return;
    setMessages((prev) => [...prev, { role: "user", text: val }]);
    setChatInputs((prev) => ({ ...prev, [screenNum]: "" }));

    // Move to next screen with simulated AI response
    const aiResponses: Record<number, { text: string; next: number }> = {
      1: { text: "Interesante. ¿Y qué pasa cuando un vendedor pierde un deal? ¿Tienen visibilidad de por qué se cayó?", next: 2 },
      2: { text: "Última pregunta: si hoy tu CEO te pidiera un forecast confiable para el próximo trimestre, ¿podrías entregarlo en menos de una hora?", next: 3 },
      3: { text: "Una última cosa — ¿qué día y hora te acomoda para conversar? Dime con libertad, algo como 'el martes por la mañana' está perfecto.", next: 4 },
      4: { text: "Perfecto. ¿Cómo te llamas y cuál es tu correo? Así confirmamos la reunión.", next: 5 },
    };

    const resp = aiResponses[screenNum];
    if (resp) {
      simulateAI(resp.text, resp.next);
    }
  };

  const handleConfirmData = () => {
    if (!nameInput.trim() || !emailInput.trim()) return;
    setScreen(6);
    // Simulate booking delay
    setTimeout(() => setScreen(7), 3000);
  };

  const goToScreen1 = () => {
    setMessages([{ role: "ai", text: "Hola 👋 Cuéntame — ¿cuál es el problema más grande que ves hoy en el proceso comercial de tu empresa?" }]);
    setScreen(1);
  };

  /* ─── render current screen ─── */
  const renderScreen = () => {
    switch (screen) {
      /* ── Screen 0: Hook ── */
      case 0:
        return (
          <motion.div key="s0" {...screenVariants} className="flex flex-col items-center justify-center h-full px-6 text-center gap-6">
            <h1 className="text-[28px] sm:text-[32px] font-semibold leading-[1.15] text-white tracking-tight text-balance">
              Cada mes se pierden negocios en tu empresa.
            </h1>
            <p className="text-white/45 text-[17px] leading-relaxed font-light">
              Nadie sabe cuántos. Nadie sabe dónde.
            </p>
            <button
              onClick={goToScreen1}
              className="mt-4 w-full max-w-[320px] py-4 rounded-full text-white font-medium text-[16px] transition-all duration-300 hover:scale-[1.02] active:scale-[0.97]"
              style={{
                background: "#BE1869",
                boxShadow: "0 8px 32px rgba(190,24,105,0.35)",
              }}
            >
              Así es, eso me pasa →
            </button>
          </motion.div>
        );

      /* ── Screens 1–4: Chat ── */
      case 1:
      case 2:
      case 3:
      case 4:
        return (
          <motion.div key={`chat-${screen}`} {...screenVariants} className="flex flex-col h-full">
            {/* chat messages */}
            <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2 flex flex-col gap-3">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.05 }}
                >
                  {m.role === "ai" ? (
                    <AIBubble>{m.text}</AIBubble>
                  ) : (
                    <UserBubble>{m.text}</UserBubble>
                  )}
                </motion.div>
              ))}
              {showTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <AIBubble isTyping />
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
            {/* input */}
            <div className="px-4 pb-4 pt-2">
              <ChatInput
                value={chatInputs[screen] || ""}
                onChange={(v) => setChatInputs((prev) => ({ ...prev, [screen]: v }))}
                onSend={() => handleUserSend(screen)}
              />
            </div>
          </motion.div>
        );

      /* ── Screen 5: Name + Email ── */
      case 5:
        return (
          <motion.div key="s5" {...screenVariants} className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2 flex flex-col gap-3">
              {messages.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                  {m.role === "ai" ? <AIBubble>{m.text}</AIBubble> : <UserBubble>{m.text}</UserBubble>}
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="px-4 pb-4 pt-2 flex flex-col gap-3">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Tu nombre"
                className="w-full rounded-xl px-4 py-3 text-[15px] text-white placeholder:text-white/30 outline-none font-[Lexend]"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.08)" }}
              />
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Tu correo electrónico"
                className="w-full rounded-xl px-4 py-3 text-[15px] text-white placeholder:text-white/30 outline-none font-[Lexend]"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.08)" }}
              />
              <button
                onClick={handleConfirmData}
                disabled={!nameInput.trim() || !emailInput.trim()}
                className="w-full py-3.5 rounded-full text-white font-medium text-[15px] transition-all duration-300 hover:scale-[1.02] active:scale-[0.97] disabled:opacity-40"
                style={{
                  background: "#BE1869",
                  boxShadow: "0 6px 24px rgba(190,24,105,0.3)",
                }}
              >
                Confirmar →
              </button>
            </div>
          </motion.div>
        );

      /* ── Screen 6: Loading / Booking ── */
      case 6:
        return (
          <motion.div key="s6" {...screenVariants} className="flex flex-col items-center justify-center h-full px-6 text-center gap-5">
            {/* pulsing teal dots */}
            <div className="flex items-center gap-3">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-3 h-3 rounded-full"
                  style={{
                    background: "#1CA398",
                    animation: `pulseScale 1.4s ease-in-out ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
            <p className="text-white/70 text-[16px] font-light leading-relaxed max-w-[280px]">
              Estamos buscando el horario más cercano a tu preferencia...
            </p>
          </motion.div>
        );

      /* ── Screen 7: Confirmation ── */
      case 7:
        return (
          <motion.div key="s7" {...screenVariants} className="flex flex-col items-center justify-center h-full px-6 text-center gap-5">
            {/* teal check */}
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: "rgba(28,163,152,0.15)", border: "2px solid rgba(28,163,152,0.3)" }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1CA398" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h2 className="text-[22px] font-semibold text-white leading-snug text-balance">
              {nameInput || "Visitante"}, está todo listo.
              <br />
              <span className="text-white/60 font-normal text-[17px]">
                Te esperamos el martes a las 10:00 AM.
              </span>
            </h2>
            <p className="text-white/40 text-[14px] font-light max-w-[300px]">
              Recibirás una invitación en tu correo con todos los detalles.
            </p>
            <div className="mt-8 text-white/20 text-[11px] tracking-wide leading-relaxed">
              Revops LATAM · HubSpot Platinum Partner · 14 años generando Revenue
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="h-[100dvh] w-full flex flex-col overflow-hidden font-[Lexend] transition-colors"
      style={{
        backgroundColor: BG_COLORS[screen],
        transitionDuration: "1200ms",
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {/* ── header: logo ── */}
      <div className="flex items-center justify-center pt-5 pb-2 shrink-0">
        <span className="text-[11px] tracking-[0.2em] uppercase text-white/25 font-medium select-none">
          Revops LATAM
        </span>
      </div>

      {/* ── main content ── */}
      <div className="flex-1 w-full max-w-[420px] mx-auto overflow-hidden">
        <AnimatePresence mode="wait">
          {renderScreen()}
        </AnimatePresence>
      </div>

      {/* ── footer: progress dots ── */}
      <div className="pb-5 pt-2 shrink-0">
        <ProgressDots current={screen} total={TOTAL_SCREENS} />
      </div>

      {/* ── global keyframes ── */}
      <style>{`
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
        @keyframes pulseScale {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.5); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default AgenticLandingPage;
