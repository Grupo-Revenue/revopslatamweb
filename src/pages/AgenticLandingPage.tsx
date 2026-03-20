import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

/* ─── palette per screen ─── */
const BG_COLORS = [
  "#1A1033", "#1C1240", "#1E1550", "#16203A",
  "#0F2030", "#0A2028", "#082018", "#0A1F1A",
];

const TOTAL_SCREENS = 8;
const TYPEWRITER_MS = 30;

/* ─── detect context from UTM ─── */
function getContextFromURL(): "diagnostico" | "hubspot" {
  const params = new URLSearchParams(window.location.search);
  const utmContent = params.get("utm_content") || "";
  if (utmContent === "reel2") return "hubspot";
  return "diagnostico";
}

/* ─── typing dots animation ─── */
const TypingDots = () => (
  <span className="inline-flex items-center gap-[5px] h-5 px-1">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="w-[6px] h-[6px] rounded-full bg-white/50"
        style={{ animation: `typingBounce 1.2s ease-in-out ${i * 0.15}s infinite` }}
      />
    ))}
  </span>
);

/* ─── AI bubble ─── */
const AIBubble = ({ children, isTyping = false }: { children?: React.ReactNode; isTyping?: boolean }) => (
  <div className="flex flex-col gap-1.5 max-w-[92%]">
    <span className="text-[10px] tracking-[0.12em] uppercase text-white/35 font-medium pl-1">
      Revops LATAM
    </span>
    <div
      className="rounded-2xl rounded-bl-md px-4 py-3 text-[15px] leading-relaxed text-white/90"
      style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(8px)" }}
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
  disabled = false,
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  placeholder?: string;
  disabled?: boolean;
}) => (
  <div
    className="flex items-center gap-2 rounded-full px-4 py-2"
    style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.08)" }}
  >
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && value.trim() && !disabled && onSend()}
      placeholder={placeholder}
      disabled={disabled}
      className="flex-1 bg-transparent text-white text-[15px] placeholder:text-white/30 outline-none font-[Lexend] disabled:opacity-40"
    />
    <button
      onClick={onSend}
      disabled={!value.trim() || disabled}
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
        style={{ width: i === current ? 20 : 6, height: 6, background: i === current ? "#fff" : "rgba(255,255,255,0.2)" }}
      />
    ))}
  </div>
);

/* ─── screen transition wrapper ─── */
const screenVariants = {
  initial: { opacity: 0, y: 20, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
  exit: { opacity: 0, y: -12, filter: "blur(4px)", transition: { duration: 0.35 } },
};

/* ════════════════════════════════════════════ */
/*  MAIN COMPONENT                             */
/* ════════════════════════════════════════════ */
const AgenticLandingPage = () => {
  const [screen, setScreen] = useState(0);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<{ role: "ai" | "user"; text: string }[]>([]);
  const [isAITyping, setIsAITyping] = useState(false);
  const [isTypewriting, setIsTypewriting] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [turn, setTurn] = useState(0);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [availabilityPref, setAvailabilityPref] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const contextRef = useRef(getContextFromURL());
  const inputDisabled = isAITyping || isTypewriting;

  // Scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAITyping]);

  // Create conversation in Supabase
  const createConversation = useCallback(async () => {
    const { data, error } = await supabase
      .from("conversations")
      .insert({ context: contextRef.current })
      .select("id")
      .single();
    if (!error && data) {
      setConversationId(data.id);
      return data.id;
    }
    console.error("Failed to create conversation:", error);
    return null;
  }, []);

  // Save messages to Supabase
  const saveMessages = useCallback(
    async (convId: string, msgs: { role: string; text: string }[], extra?: { summary?: string; availability_preference?: string }) => {
      const anthropicMessages = msgs.map((m) => ({
        role: m.role === "ai" ? "assistant" : "user",
        content: m.text,
      }));
      await supabase
        .from("conversations")
        .update({ messages: anthropicMessages as any, ...extra })
        .eq("id", convId);
    },
    []
  );

  // Typewriter effect
  const typewriterEffect = useCallback(
    (text: string): Promise<void> =>
      new Promise((resolve) => {
        setIsTypewriting(true);
        let i = 0;
        // Add empty AI message
        setMessages((prev) => [...prev, { role: "ai", text: "" }]);
        const interval = setInterval(() => {
          i++;
          setMessages((prev) => {
            const copy = [...prev];
            copy[copy.length - 1] = { role: "ai", text: text.slice(0, i) };
            return copy;
          });
          if (i >= text.length) {
            clearInterval(interval);
            setIsTypewriting(false);
            resolve();
          }
        }, TYPEWRITER_MS);
      }),
    []
  );

  // Call Claude via edge function
  const callClaude = useCallback(
    async (allMessages: { role: "ai" | "user"; text: string }[], currentTurn: number) => {
      setIsAITyping(true);

      // Convert to Anthropic format
      const anthropicMessages = allMessages.map((m) => ({
        role: m.role === "ai" ? "assistant" as const : "user" as const,
        content: m.text,
      }));

      try {
        const { data, error } = await supabase.functions.invoke("chat-agent", {
          body: {
            messages: anthropicMessages,
            context: contextRef.current,
            turn: currentTurn,
          },
        });

        setIsAITyping(false);

        if (error || !data?.reply) {
          console.error("chat-agent error:", error, data);
          await typewriterEffect("Disculpa, tuve un problema técnico. ¿Podrías intentar de nuevo?");
          return null;
        }

        return data as { reply: string; phase: string; summary?: string };
      } catch (e) {
        setIsAITyping(false);
        console.error("chat-agent exception:", e);
        await typewriterEffect("Disculpa, tuve un problema técnico. ¿Podrías intentar de nuevo?");
        return null;
      }
    },
    [typewriterEffect]
  );

  // Start conversation — Screen 0 → 1
  const goToScreen1 = useCallback(async () => {
    setScreen(1);
    const convId = await createConversation();
    const newTurn = 1;
    setTurn(newTurn);

    const result = await callClaude([], newTurn);
    if (result) {
      await typewriterEffect(result.reply);
      const newMessages = [{ role: "ai" as const, text: result.reply }];
      if (convId) saveMessages(convId, newMessages);
    }
  }, [createConversation, callClaude, typewriterEffect, saveMessages]);

  // Handle user sending a message
  const handleUserSend = useCallback(async () => {
    const val = chatInput.trim();
    if (!val || inputDisabled) return;

    const userMsg = { role: "user" as const, text: val };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setChatInput("");

    const newTurn = turn + 1;
    setTurn(newTurn);

    const result = await callClaude(updatedMessages, newTurn);
    if (!result) return;

    await typewriterEffect(result.reply);
    const finalMessages = [...updatedMessages, { role: "ai" as const, text: result.reply }];

    // Save to Supabase
    if (conversationId) {
      const extra: Record<string, string> = {};
      if (result.summary) extra.summary = result.summary;
      if (result.phase === "complete") extra.availability_preference = val;
      saveMessages(conversationId, finalMessages, Object.keys(extra).length ? extra : undefined);
    }

    // Phase transitions
    if (result.phase === "availability") {
      setScreen(4);
    } else if (result.phase === "complete") {
      setSummary(result.summary || null);
      setAvailabilityPref(val);
      setScreen(5);
    }
  }, [chatInput, inputDisabled, messages, turn, callClaude, typewriterEffect, conversationId, saveMessages]);

  const handleConfirmData = useCallback(async () => {
    if (!nameInput.trim() || !emailInput.trim()) return;
    setScreen(6);

    // Save contact info
    if (conversationId) {
      await saveMessages(conversationId, messages, {
        summary: `${summary}\n\nContacto: ${nameInput.trim()} - ${emailInput.trim()}`,
        availability_preference: availabilityPref,
      });
    }

    // Simulate booking (placeholder — will be replaced by HubSpot API)
    setTimeout(() => setScreen(7), 3000);
  }, [nameInput, emailInput, conversationId, messages, summary, availabilityPref, saveMessages]);

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
              style={{ background: "#BE1869", boxShadow: "0 8px 32px rgba(190,24,105,0.35)" }}
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
          <motion.div key={`chat`} {...screenVariants} className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2 flex flex-col gap-3">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  {m.role === "ai" ? <AIBubble>{m.text}</AIBubble> : <UserBubble>{m.text}</UserBubble>}
                </motion.div>
              ))}
              {isAITyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <AIBubble isTyping />
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="px-4 pb-4 pt-2">
              <ChatInput
                value={chatInput}
                onChange={setChatInput}
                onSend={handleUserSend}
                disabled={inputDisabled}
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
              {/* Extra AI bubble asking for contact */}
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.3 }}>
                <AIBubble>Perfecto. ¿Cómo te llamas y cuál es tu correo? Así confirmamos la reunión.</AIBubble>
              </motion.div>
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
                style={{ background: "#BE1869", boxShadow: "0 6px 24px rgba(190,24,105,0.3)" }}
              >
                Confirmar →
              </button>
            </div>
          </motion.div>
        );

      /* ── Screen 6: Loading ── */
      case 6:
        return (
          <motion.div key="s6" {...screenVariants} className="flex flex-col items-center justify-center h-full px-6 text-center gap-5">
            <div className="flex items-center gap-3">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-3 h-3 rounded-full"
                  style={{ background: "#1CA398", animation: `pulseScale 1.4s ease-in-out ${i * 0.2}s infinite` }}
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
                Te contactaremos pronto para confirmar tu reunión.
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
      <div className="flex items-center justify-center pt-5 pb-2 shrink-0">
        <span className="text-[11px] tracking-[0.2em] uppercase text-white/25 font-medium select-none">
          Revops LATAM
        </span>
      </div>

      <div className="flex-1 w-full max-w-[420px] mx-auto overflow-hidden">
        <AnimatePresence mode="wait">
          {renderScreen()}
        </AnimatePresence>
      </div>

      <div className="pb-5 pt-2 shrink-0">
        <ProgressDots current={screen} total={TOTAL_SCREENS} />
      </div>

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
