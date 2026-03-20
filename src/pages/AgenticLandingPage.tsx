import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import LogoBlanco from "@/assets/Logo_REVOPSLATAM_Blanco.png";

/* ─── palette per screen ─── */
const BG_COLORS = [
  "#1A1033", // Screen 0: Welcome Lidia
  "#1C1240", "#1E1550", "#16203A", "#0F2030",
  "#0A2028", // Screen 5: availability picker / nurturing
  "#0A2028", // Screen 6: name+email
  "#082018", // Screen 7: loading
  "#0A1F1A", // Screen 8: confirmation
];

const TOTAL_SCREENS = 9;
const TYPEWRITER_MS = 18;
const WELCOME_TYPEWRITER_MS = 15;

/* ─── capture UTMs from URL ─── */
function getUTMParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
    utm_content: params.get("utm_content") || "",
  };
}

function getContextFromURL(): "diagnostico" | "hubspot" {
  const utmContent = getUTMParams().utm_content;
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
  const [messages, setMessages] = useState<{ role: "ai" | "user"; text: string; meta?: boolean }[]>([]);
  const [isAITyping, setIsAITyping] = useState(false);
  const [isTypewriting, setIsTypewriting] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [turn, setTurn] = useState(0);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [availabilitySlots, setAvailabilitySlots] = useState<Record<string, { display_date: string; slots: { date: string; startTime: string; endTime: string; display_date: string; display_time: string }[] }>>({});
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; startTime: string; endTime: string; display_date: string; display_time: string } | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [leadScore, setLeadScore] = useState<number | undefined>();
  const [leadFlag, setLeadFlag] = useState<string | undefined>();
  const [nurturingEmail, setNurturingEmail] = useState("");
  const [earlyEmail, setEarlyEmail] = useState("");
  const [earlyEmailSaved, setEarlyEmailSaved] = useState(false);
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [emailCaptureHandled, setEmailCaptureHandled] = useState(false);
  const [pendingClaudeCall, setPendingClaudeCall] = useState<{ messages: { role: "ai" | "user"; text: string }[]; turn: number } | null>(null);
  const [showQ5Buttons, setShowQ5Buttons] = useState(false);
  const [q5Options, setQ5Options] = useState<string[]>([]);
  const [q5FreeText, setQ5FreeText] = useState(false);
  const pendingClaudeCallRef = useRef<{ messages: { role: "ai" | "user"; text: string }[]; turn: number } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const contextRef = useRef(getContextFromURL());
  const utmRef = useRef(getUTMParams());
  const inputDisabled = isAITyping || isTypewriting || showEmailCapture || showQ5Buttons;

  // Scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAITyping, showEmailCapture]);

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

  // Typewriter effect — optionally mark message as meta (not sent to AI)
  const typewriterEffect = useCallback(
    (text: string, meta = false): Promise<void> =>
      new Promise((resolve) => {
        setIsTypewriting(true);
        let i = 0;
        setMessages((prev) => [...prev, { role: "ai", text: "", meta }]);
        const interval = setInterval(() => {
          i++;
          setMessages((prev) => {
            const copy = [...prev];
            copy[copy.length - 1] = { role: "ai", text: text.slice(0, i), meta };
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

  // Call Claude via edge function — filters out meta messages
  const callClaude = useCallback(
    async (allMessages: { role: "ai" | "user"; text: string; meta?: boolean }[], currentTurn: number) => {
      setIsAITyping(true);
      const anthropicMessages = allMessages
        .filter((m) => !m.meta)
        .map((m) => ({
          role: m.role === "ai" ? "assistant" as const : "user" as const,
          content: m.text,
        }));
      try {
        const { data, error } = await supabase.functions.invoke("chat-agent", {
          body: { messages: anthropicMessages, context: contextRef.current, turn: currentTurn },
        });
        setIsAITyping(false);
        if (error || !data?.reply) {
          console.error("chat-agent error:", error, data);
          await typewriterEffect("Disculpa, tuve un problema técnico. ¿Podrías intentar de nuevo?");
          return null;
        }
        return data as { reply: string; phase: string; summary?: string; score?: number; flag?: string; repeat_turn?: boolean };
      } catch (e) {
        setIsAITyping(false);
        console.error("chat-agent exception:", e);
        await typewriterEffect("Disculpa, tuve un problema técnico. ¿Podrías intentar de nuevo?");
        return null;
      }
    },
    [typewriterEffect]
  );

  // Fetch real availability from Febe's calendar
  const fetchAvailability = useCallback(async () => {
    setLoadingSlots(true);
    try {
      const { data, error } = await supabase.functions.invoke("get-availability");
      if (!error && data?.availability) setAvailabilitySlots(data.availability);
    } catch (e) {
      console.error("get-availability error:", e);
    }
    setLoadingSlots(false);
  }, []);

  // Helper to process Claude result and handle phase transitions
  const processClaudeResult = useCallback(
    async (result: { reply: string; phase: string; summary?: string; score?: number; flag?: string; repeat_turn?: boolean }, baseMsgs: { role: "ai" | "user"; text: string; meta?: boolean }[]) => {
      await typewriterEffect(result.reply);
      const finalMessages = [...baseMsgs, { role: "ai" as const, text: result.reply }];
      // If repeat_turn, roll back the turn counter so the question doesn't count
      if (result.repeat_turn) {
        setTurn((prev) => Math.max(prev - 1, 1));
      }
      if (result.score !== undefined) setLeadScore(result.score);
      if (result.flag) setLeadFlag(result.flag);
      if (result.summary) setSummary(result.summary);
      if (conversationId) {
        const extra: Record<string, string> = {};
        if (result.summary) extra.summary = result.summary;
        saveMessages(conversationId, finalMessages, Object.keys(extra).length ? extra : undefined);
      }
      if (result.phase === "nurturing") { setSummary(result.summary || null); setScreen(5); }
      else if (result.phase === "availability") { fetchAvailability(); setScreen(5); }
    },
    [typewriterEffect, conversationId, saveMessages, fetchAvailability]
  );

  // Start conversation — Screen 0 → 1 (chat)
  const startChat = useCallback(async () => {
    setScreen(1);
    const convId = await createConversation();
    const newTurn = 1;
    setTurn(newTurn);
    // First question is deterministic — show instantly without API call
    const ctx = contextRef.current;
    const firstQuestion = ctx === "hubspot"
      ? "Para orientarte bien, ¿cuál es tu cargo o rol en la empresa?"
      : "Para entender bien tu situación, ¿cuál es tu cargo o rol en la empresa?";
    await typewriterEffect(firstQuestion);
    const newMessages = [{ role: "ai" as const, text: firstQuestion }];
    setMessages((prev) => {
      // typewriterEffect already added the message, just use current state
      return prev;
    });
    if (convId) saveMessages(convId, newMessages);
  }, [createConversation, typewriterEffect, saveMessages]);

  // Save early email to Supabase and continue flow
  const handleEarlyEmailSave = useCallback(async (email: string) => {
    if (!email.trim() || !conversationId) return;
    setEarlyEmailSaved(true);
    setShowEmailCapture(false);
    setEmailCaptureHandled(true);
    setEmailInput(email.trim());
    setNurturingEmail(email.trim());
    await supabase
      .from("conversations")
      .update({ availability_preference: `early_email:${email.trim()}` })
      .eq("id", conversationId);
    // Now call Claude to continue the conversation (empathy + next question)
    const pending = pendingClaudeCallRef.current;
    if (pending) {
      pendingClaudeCallRef.current = null;
      setPendingClaudeCall(null);
      // Show a brief thank-you (meta — not sent to AI), then get Claude's response
      await typewriterEffect("Gracias por compartirlo 🙌 Ahora sigamos...", true);
      const result = await callClaude(pending.messages, pending.turn);
      if (result) {
        await processClaudeResult(result, pending.messages);
      }
    }
  }, [conversationId, callClaude, processClaudeResult, typewriterEffect]);

  // Skip email capture
  const handleSkipEmail = useCallback(async () => {
    setShowEmailCapture(false);
    setEmailCaptureHandled(true);
    // Continue with Claude call
    const pending = pendingClaudeCallRef.current;
    if (pending) {
      pendingClaudeCallRef.current = null;
      setPendingClaudeCall(null);
      const result = await callClaude(pending.messages, pending.turn);
      if (result) await processClaudeResult(result, pending.messages);
    }
  }, [callClaude, processClaudeResult]);

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

    // After 2nd user answer (turn 3), show email capture BEFORE calling Claude
    if (newTurn === 3 && !emailCaptureHandled && !earlyEmailSaved) {
      // Store pending call — Claude will be called AFTER email
      const pending = { messages: updatedMessages, turn: newTurn };
      pendingClaudeCallRef.current = pending;
      setPendingClaudeCall(pending);
      // Ask for email naturally
      const emailAsk = "Perfecto, gracias por contarme. Antes de seguir, ¿me darías tu email? Así no perdemos el contacto 😊";
      await typewriterEffect(emailAsk, true);
      setShowEmailCapture(true);
      return;
    }

    const result = await callClaude(updatedMessages, newTurn);
    if (!result) return;
    await processClaudeResult(result, updatedMessages);
  }, [chatInput, inputDisabled, messages, turn, callClaude, typewriterEffect, processClaudeResult, emailCaptureHandled, earlyEmailSaved]);

  // Handle nurturing email submit (unqualified leads)
  const handleNurturingSubmit = useCallback(async () => {
    if (!nurturingEmail.trim()) return;
     setScreen(7); // loading

    try {
      await supabase.functions.invoke("book-meeting", {
        body: {
          name: "",
          email: nurturingEmail.trim(),
          context: contextRef.current,
          summary,
          availability_preference: "",
          conversation_id: conversationId,
          score: leadScore,
          flag: "no_calificado",
          nurturing_only: true,
          conversation_messages: messages,
          ...utmRef.current,
        },
      });
    } catch (e) {
      console.error("nurturing submit error:", e);
    }
    setScreen(8); // confirmation
  }, [nurturingEmail, conversationId, summary, leadScore]);

  const handleConfirmData = useCallback(async () => {
    if (!nameInput.trim() || !emailInput.trim() || !selectedSlot) return;
    setScreen(7); // loading

    try {
      const { data, error } = await supabase.functions.invoke("book-meeting", {
        body: {
          name: nameInput.trim(),
          email: emailInput.trim(),
          context: contextRef.current,
          summary,
          availability_preference: `${selectedSlot.display_date} a las ${selectedSlot.display_time}`,
          selected_slot: selectedSlot,
          conversation_id: conversationId,
          score: leadScore,
          flag: leadFlag || "calificado",
          conversation_messages: messages,
          ...utmRef.current,
        },
      });

      if (error || !data?.success) {
        console.error("book-meeting error:", error, data);
        setMeetingDate("");
        setMeetingTime("");
        setScreen(8);
        return;
      }

      setMeetingDate(data.display_date);
      setMeetingTime(data.display_time);
      setScreen(8);
    } catch (e) {
      console.error("book-meeting exception:", e);
      setScreen(8);
    }
  }, [nameInput, emailInput, selectedSlot, conversationId, summary, leadScore, leadFlag]);

  /* ─── Welcome screen typewriter ─── */
  const [welcomeText, setWelcomeText] = useState("");
  const [welcomeDone, setWelcomeDone] = useState(false);
  const welcomeFullText = "Hola, soy Lidia 👋\n\nSoy asistente virtual de Revops LATAM.\n\nEn 5 preguntas voy a entender tu situación comercial y, si tiene sentido, te conectaré con nuestro equipo.\n\n¿Empezamos?";

  useEffect(() => {
    if (screen !== 0) return;
    setWelcomeText("");
    setWelcomeDone(false);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setWelcomeText(welcomeFullText.slice(0, i));
      if (i >= welcomeFullText.length) {
        clearInterval(interval);
        setWelcomeDone(true);
      }
    }, WELCOME_TYPEWRITER_MS);
    return () => clearInterval(interval);
  }, [screen]);

  /* ─── render current screen ─── */
  const renderScreen = () => {
    switch (screen) {
      /* ── Screen 0: Welcome Lidia ── */
      case 0:
        return (
          <motion.div key="s0" {...screenVariants} className="flex flex-col items-center justify-center h-full px-6 text-center gap-6">
            {/* Lidia Avatar */}
            <div
              className="w-[72px] h-[72px] rounded-full flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #6224BE, #BE1869)" }}
            >
              <span className="text-white text-[24px] font-medium select-none">L</span>
            </div>

            {/* Typewriter text */}
            <div className="text-[16px] leading-relaxed text-white/85 font-light whitespace-pre-line max-w-[320px] min-h-[180px]">
              {welcomeText}
              {!welcomeDone && (
                <span className="inline-block w-[2px] h-[18px] bg-white/50 ml-0.5 align-middle" style={{ animation: "blink 1s step-end infinite" }} />
              )}
            </div>

            {/* CTA button — fade in after typewriter */}
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={welcomeDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => startChat()}
              disabled={!welcomeDone}
              className="w-full max-w-[320px] py-4 rounded-full text-white font-medium text-[16px] transition-all duration-300 hover:scale-[1.02] active:scale-[0.97]"
              style={{ background: "#BE1869", boxShadow: "0 8px 32px rgba(190,24,105,0.35)" }}
            >
              Empecemos →
            </motion.button>
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

            {/* Email capture overlay — replaces the chat input area */}
            {showEmailCapture && !isAITyping && !isTypewriting ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="px-4 pb-4 pt-3"
              >
                <div
                  className="rounded-2xl p-5 flex flex-col gap-3"
                  style={{
                    background: "rgba(98,36,190,0.12)",
                    border: "1px solid rgba(98,36,190,0.25)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <p className="text-white/70 text-[13px] leading-snug text-center">
                    Así no perdemos el contacto si se corta la conversación
                  </p>
                  <div
                    className="flex items-center gap-2 rounded-xl px-4 py-3"
                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    <input
                      type="email"
                      value={earlyEmail}
                      onChange={(e) => setEarlyEmail(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && earlyEmail.trim()) handleEarlyEmailSave(earlyEmail);
                      }}
                      placeholder="tu@email.com"
                      className="flex-1 bg-transparent text-white text-[15px] placeholder:text-white/30 outline-none font-[Lexend]"
                      autoFocus
                    />
                  </div>
                  <button
                    onClick={() => handleEarlyEmailSave(earlyEmail)}
                    disabled={!earlyEmail.trim()}
                    className="w-full py-3 rounded-full text-white font-medium text-[14px] transition-all duration-300 hover:scale-[1.02] active:scale-[0.97] disabled:opacity-30"
                    style={{ background: "#BE1869", boxShadow: "0 4px 16px rgba(190,24,105,0.3)" }}
                  >
                    Continuar →
                  </button>
                  <button
                    onClick={handleSkipEmail}
                    className="text-[12px] text-white/25 hover:text-white/45 transition-colors self-center"
                  >
                    Prefiero no darlo ahora
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="px-4 pb-4 pt-2">
                <ChatInput
                  value={chatInput}
                  onChange={setChatInput}
                  onSend={handleUserSend}
                  disabled={inputDisabled}
                />
              </div>
            )}
          </motion.div>
        );

      /* ── Screen 5: Availability picker (calificado/tibio) OR Nurturing (no_calificado) ── */
      case 5:
        if (leadFlag === "no_calificado") {
          return (
            <motion.div key="s5-nur" {...screenVariants} className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2 flex flex-col gap-3">
                {messages.map((m, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                    {m.role === "ai" ? <AIBubble>{m.text}</AIBubble> : <UserBubble>{m.text}</UserBubble>}
                  </motion.div>
                ))}
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.3 }}>
                  <AIBubble>Déjame tu correo y te mando recursos útiles para tu situación.</AIBubble>
                </motion.div>
                <div ref={messagesEndRef} />
              </div>
              <div className="px-4 pb-4 pt-2 flex flex-col gap-3">
                <input
                  type="email"
                  value={nurturingEmail}
                  onChange={(e) => setNurturingEmail(e.target.value)}
                  placeholder="Tu correo electrónico"
                  className="w-full rounded-xl px-4 py-3 text-[15px] text-white placeholder:text-white/30 outline-none font-[Lexend]"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.08)" }}
                />
                <button
                  onClick={handleNurturingSubmit}
                  disabled={!nurturingEmail.trim()}
                  className="w-full py-3.5 rounded-full text-white font-medium text-[15px] transition-all duration-300 hover:scale-[1.02] active:scale-[0.97] disabled:opacity-40"
                  style={{ background: "#BE1869", boxShadow: "0 6px 24px rgba(190,24,105,0.3)" }}
                >
                  Enviar →
                </button>
              </div>
            </motion.div>
          );
        }
        // Availability picker for qualified/tibio — days first, then times
        return (
          <motion.div key="s5-avail" {...screenVariants} className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2 flex flex-col gap-3">
              {/* Last AI message */}
              {messages.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                  <AIBubble>{messages[messages.length - 1].text}</AIBubble>
                </motion.div>
              )}

              {/* Slots */}
              {loadingSlots ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-3 py-6">
                  <TypingDots />
                  <span className="text-white/40 text-[13px]">Buscando horarios disponibles...</span>
                </motion.div>
              ) : !selectedDay ? (
                /* Step 1: Pick a day */
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="flex flex-col gap-2 mt-2">
                  <AIBubble>¿Qué día te queda mejor?</AIBubble>
                  <div className="flex flex-col gap-2 mt-2 pl-1">
                    {Object.entries(availabilitySlots).map(([dateKey, dayData]) => (
                      <button
                        key={dateKey}
                        onClick={() => setSelectedDay(dateKey)}
                        className="px-4 py-3 rounded-xl text-left text-[14px] font-medium capitalize transition-all duration-200 active:scale-[0.97] hover:scale-[1.01]"
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          color: "rgba(255,255,255,0.75)",
                        }}
                      >
                        📅 {dayData.display_date}
                        <span className="text-white/30 text-[12px] ml-2">
                          ({dayData.slots.length} horarios)
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                /* Step 2: Pick a time for selected day */
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col gap-3 mt-2">
                  <UserBubble>{availabilitySlots[selectedDay]?.display_date}</UserBubble>
                  <AIBubble>Perfecto, ¿a qué hora te acomoda?</AIBubble>
                  <div className="flex flex-wrap gap-2 mt-1 pl-1">
                    {availabilitySlots[selectedDay]?.slots.map((slot) => {
                      const isSelected = selectedSlot?.date === slot.date && selectedSlot?.startTime === slot.startTime;
                      return (
                        <button
                          key={`${slot.date}-${slot.startTime}`}
                          onClick={() => setSelectedSlot(slot)}
                          className="px-4 py-2 rounded-xl text-[14px] font-medium transition-all duration-200 active:scale-[0.95]"
                          style={{
                            background: isSelected ? "#BE1869" : "rgba(255,255,255,0.06)",
                            border: `1px solid ${isSelected ? "rgba(190,24,105,0.5)" : "rgba(255,255,255,0.08)"}`,
                            color: isSelected ? "#fff" : "rgba(255,255,255,0.6)",
                          }}
                        >
                          {slot.display_time}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => { setSelectedDay(null); setSelectedSlot(null); }}
                    className="text-[12px] text-white/30 hover:text-white/50 transition-colors self-start pl-1 mt-1"
                  >
                    ← Elegir otro día
                  </button>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="px-4 pb-4 pt-2">
              <button
                onClick={() => setScreen(6)}
                disabled={!selectedSlot}
                className="w-full py-3.5 rounded-full text-white font-medium text-[15px] transition-all duration-300 hover:scale-[1.02] active:scale-[0.97] disabled:opacity-30"
                style={{ background: "#BE1869", boxShadow: "0 6px 24px rgba(190,24,105,0.3)" }}
              >
                {selectedSlot ? `Confirmar ${selectedSlot.display_date} a las ${selectedSlot.display_time} →` : "Selecciona un horario"}
              </button>
            </div>
          </motion.div>
        );

      /* ── Screen 6: Name + Email ── */
      case 6:
        return (
          <motion.div key="s6" {...screenVariants} className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2 flex flex-col gap-3 justify-center">
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                <AIBubble>
                  {selectedSlot
                    ? `Perfecto, ${selectedSlot.display_date} a las ${selectedSlot.display_time}. ¿Cómo te llamas y cuál es tu correo? Así confirmamos la reunión.`
                    : "¿Cómo te llamas y cuál es tu correo? Así confirmamos la reunión."}
                </AIBubble>
              </motion.div>
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

      /* ── Screen 7: Loading ── */
      case 7:
        return (
          <motion.div key="s7" {...screenVariants} className="flex flex-col items-center justify-center h-full px-6 text-center gap-5">
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
              {leadFlag === "no_calificado"
                ? "Registrando tu información..."
                : "Agendando tu reunión..."}
            </p>
          </motion.div>
        );

      /* ── Screen 8: Confirmation ── */
      case 8:
        return (
          <motion.div key="s8" {...screenVariants} className="flex flex-col items-center justify-center h-full px-6 text-center gap-5">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: "rgba(28,163,152,0.15)", border: "2px solid rgba(28,163,152,0.3)" }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1CA398" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h2 className="text-[22px] font-semibold text-white leading-snug text-balance">
              {leadFlag === "no_calificado" ? (
                <>
                  ¡Listo!
                  <br />
                  <span className="text-white/60 font-normal text-[17px]">
                    Te enviaremos contenido relevante pronto.
                  </span>
                </>
              ) : (
                <>
                  {nameInput || "Visitante"}, está todo listo.
                  <br />
                  <span className="text-white/60 font-normal text-[17px]">
                    {meetingDate && meetingTime
                      ? `Te esperamos el ${meetingDate} a las ${meetingTime}.`
                      : selectedSlot
                        ? `Te esperamos el ${selectedSlot.display_date} a las ${selectedSlot.display_time}.`
                        : "Te contactaremos pronto para confirmar tu reunión."}
                  </span>
                </>
              )}
            </h2>
            <p className="text-white/40 text-[14px] font-light max-w-[300px]">
              {leadFlag === "no_calificado"
                ? "Revisa tu bandeja de entrada en los próximos días."
                : "Recibirás una invitación en tu correo con todos los detalles."}
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
        <img src={LogoBlanco} alt="Revops LATAM" className="h-7 w-auto select-none" />
      </div>

      <div className="flex-1 w-full max-w-[420px] mx-auto overflow-hidden">
        <AnimatePresence mode="wait">
          {renderScreen()}
        </AnimatePresence>
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
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default AgenticLandingPage;
