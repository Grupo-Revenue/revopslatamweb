import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import LogoBlanco from "@/assets/Logo_REVOPSLATAM_Blanco.png";
import LidiaAvatar from "@/assets/lidia-avatar.png";

/* ─── palette per screen ─── */
const BG_COLORS = [
  "#22262A", // Screen 0: Welcome Lidia
  "#1C1240", "#1E1550", "#16203A", "#0F2030",
  "#0F2030", // Screen 5: same as screen 4 for seamless transition
  "#0F2030", // Screen 6: same as screen 5 for seamless transition
  "#0F2030", // Screen 7: loading
  "#0A1F1A", // Screen 8: confirmation
];

const TOTAL_SCREENS = 9;
const TYPEWRITER_MS = 18;
const WELCOME_TYPEWRITER_MS = 15;

/* ─── capture UTMs + attribution from URL ─── */
function getUTMParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
    utm_content: params.get("utm_content") || "",
  };
}

function getAttributionData() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
    utm_content: params.get("utm_content") || "",
    utm_term: params.get("utm_term") || "",
    fbclid: params.get("fbclid") || "",
    full_url: window.location.href,
    referrer: document.referrer || "",
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
    <span className="text-[11px] tracking-[0.12em] uppercase text-white/35 font-medium pl-1">
      Revops LATAM
    </span>
    <div
      className="rounded-2xl rounded-bl-md px-4 py-3 text-[16px] leading-relaxed text-white/90"
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
      className="rounded-2xl rounded-br-md px-4 py-3 text-[16px] leading-relaxed text-white max-w-[85%]"
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
      className="flex-1 bg-transparent text-white text-[16px] placeholder:text-white/30 outline-none font-[Lexend] disabled:opacity-40"
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
/* ─── HubSpot property mappers (client-side) ─── */
function mapCargoToHubSpot(raw: string): string {
  const l = raw.toLowerCase();
  if (/due[ñn]o|socio|founder|fundador|co-?founder/.test(l)) return "Dueño / Socio / Founder";
  if (/ceo|gerente general|director general/.test(l)) return "CEO / Gerente General";
  if (/gerente.*(comercial|ventas)|director.*(comercial|ventas)|vp.*(ventas|comercial)/.test(l)) return "Gerente Comercial / Ventas";
  if (/gerente.*(marketing|growth|revops)|director.*(marketing|growth|revops)|cmo|cro/.test(l)) return "Gerente Marketing / Growth / RevOps";
  if (/jefe.*(ventas|comercial)|supervisor|coordinador.*(ventas|comercial)/.test(l)) return "Jefe de Ventas / Supervisor Comercial";
  if (/vendedor|ejecutivo|asesor|representante|sdr|bdr|account.executive/.test(l)) return "Vendedor / Ejecutivo Comercial";
  return "Otro";
}

function mapRubroToHubSpot(raw: string): string {
  const l = raw.toLowerCase();
  if (/saas|software/.test(l)) return "SaaS B2B";
  if (/servicio.*b2c|b2c.*servicio/.test(l)) return "Servicios B2C";
  if (/servicio|consultor|agencia/.test(l)) return "Servicios B2B";
  if (/producto.*b2b|b2b.*producto|manufactura|industrial|distribuci/.test(l)) return "Venta de productos B2B";
  if (/educaci[oó]n|universidad|instituto|capacitaci/.test(l)) return "Educación Superior";
  if (/broker|corredor/.test(l)) return "Broker Inmobiliario";
  if (/inmobili|propiedad|bienes.ra[ií]ces/.test(l)) return "Inmobiliaria";
  if (/retail|tienda/.test(l)) return "Retail";
  if (/e-?commerce|comercio.electr[oó]nico|tienda.online/.test(l)) return "E-commerce";
  if (/salud|cl[ií]nica|hospital|m[eé]dico/.test(l)) return "Salud";
  return raw.trim().slice(0, 50);
}

function mapEquipoToHubSpot(raw: string): string {
  const l = raw.toLowerCase();
  if (/solo.*due[ñn]o|yo (solo|mismo)|nadie|no tenemos/.test(l)) return "Solo el dueño vende";
  if (/\b1\b|uno\b|un vendedor/.test(l)) return "1 vendedor";
  if (/\b[23]\b|dos|tres|2-?3|un par/.test(l)) return "2-3 vendedores";
  if (/\b([4-9]|10)\b|cuatro|cinco|seis|siete|ocho|nueve|diez|4-?10/.test(l)) return "4-10 vendedores";
  if (/\b(1[1-9]|[2-9]\d|\d{3,})\b|m[aá]s de 10|m[aá]s de diez|10\+|muchos|grande/.test(l)) return "10+ vendedores";
  return raw.trim().slice(0, 50);
}

function mapCrmToHubSpot(raw: string): { value: string; status: "sin_crm" | "hubspot" | "otro_crm" } {
  const l = raw.toLowerCase();
  if (/hubspot/.test(l)) return { value: "Sí, usamos HubSpot", status: "hubspot" };
  if (/excel|whatsapp|nada|no\s+(tenemos|usamos)|ninguna|cuaderno|libreta/.test(l))
    return { value: "No, usamos Excel / WhatsApp / herramientas básicas", status: "sin_crm" };
  return { value: "Sí, usamos otro CRM", status: "otro_crm" };
}

function getQ5PropertyName(crmStatus: string): string {
  if (crmStatus === "hubspot") return "problema_principal__usan_hubspot";
  if (crmStatus === "sin_crm") return "problema_principal__no_usan_crm";
  return "problema_principal";
}

/* ─── Q5 exact value maps ─── */
const Q5_EXACT_VALUES: Record<string, string[]> = {
  sin_crm: [
    "Llevamos clientes en Excel/WhatsApp y está desordenado",
    "No tenemos visibilidad del funnel",
    "Perdemos oportunidades por falta de seguimiento",
    "Queremos profesionalizar el proceso comercial",
    "Queremos comenzar con HubSpot como nuestro CRM",
    "Solo estoy explorando, no es prioridad",
  ],
  hubspot: [
    "HubSpot no está bien configurado",
    "No estamos aprovechando la herramienta",
    "Reporting / pipelines desordenados",
    "Automatizaciones mal diseñadas",
    "Necesitamos mejores prácticas de RevOps",
    "Problemas de integraciones",
    "Solo estoy explorando, no es prioridad",
  ],
  otro_crm: [
    "El CRM actual es limitado o difícil de usar",
    "No se integra con nuestras herramientas",
    "No tenemos reporting ni visibilidad",
    "El CRM no se adapta al proceso comercial",
    "Queremos migrarnos a HubSpot",
    "Solo estoy explorando, no es prioridad",
  ],
};

/* Maps button label → exact HubSpot value */
const Q5_BUTTON_TO_EXACT: Record<string, string> = {
  "Clientes en Excel/WhatsApp desordenado": "Llevamos clientes en Excel/WhatsApp y está desordenado",
  "No tenemos visibilidad del funnel": "No tenemos visibilidad del funnel",
  "Perdemos oportunidades por falta de seguimiento": "Perdemos oportunidades por falta de seguimiento",
  "Queremos profesionalizar el proceso": "Queremos profesionalizar el proceso comercial",
  "Queremos comenzar con HubSpot": "Queremos comenzar con HubSpot como nuestro CRM",
  "HubSpot no está bien configurado": "HubSpot no está bien configurado",
  "No estamos aprovechando la herramienta": "No estamos aprovechando la herramienta",
  "Reporting / pipelines desordenados": "Reporting / pipelines desordenados",
  "Automatizaciones mal diseñadas": "Automatizaciones mal diseñadas",
  "Necesitamos mejores prácticas de RevOps": "Necesitamos mejores prácticas de RevOps",
  "Problemas de integraciones": "Problemas de integraciones",
  "El CRM actual es limitado o difícil de usar": "El CRM actual es limitado o difícil de usar",
  "No se integra con nuestras herramientas": "No se integra con nuestras herramientas",
  "No tenemos reporting ni visibilidad": "No tenemos reporting ni visibilidad",
  "El CRM no se adapta al proceso comercial": "El CRM no se adapta al proceso comercial",
  "Queremos migrar a HubSpot": "Queremos migrarnos a HubSpot",
};

/* ─── Corporate email validation ─── */
const FREE_EMAIL_DOMAINS = [
  'gmail.com', 'googlemail.com', 'hotmail.com', 'hotmail.cl', 'hotmail.es',
  'outlook.com', 'outlook.cl', 'outlook.es', 'live.com', 'live.cl',
  'yahoo.com', 'yahoo.es', 'yahoo.cl', 'icloud.com', 'me.com', 'mac.com',
  'protonmail.com', 'proton.me', 'tutanota.com', 'zoho.com',
  'yandex.com', 'mail.com', 'aol.com', 'msn.com', 'gmx.com', 'gmx.net',
];

function validateCorporateEmail(email: string): { valid: boolean; error?: 'formato' | 'gratuito' } {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { valid: false, error: 'formato' };
  const domain = email.split('@')[1].toLowerCase();
  if (FREE_EMAIL_DOMAINS.includes(domain)) return { valid: false, error: 'gratuito' };
  return { valid: true };
}

const CORPORATE_EMAIL_ERRORS = {
  formato: 'Ingresa un email válido.',
  gratuito: 'Por favor ingresa tu correo corporativo — no aceptamos cuentas de Gmail, Hotmail u otros proveedores gratuitos.',
};

const AgenticLandingPage = () => {
  const [screen, setScreen] = useState(0);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<{ role: "ai" | "user"; text: string; meta?: boolean }[]>([]);
  const [isAITyping, setIsAITyping] = useState(false);
  const [isTypewriting, setIsTypewriting] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [turn, setTurn] = useState(0);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const conversationIdRef = useRef<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [availabilitySlots, setAvailabilitySlots] = useState<Record<string, { display_date: string; slots: { date: string; startTime: string; endTime: string; display_date: string; display_time: string }[] }>>({});
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; startTime: string; endTime: string; display_date: string; display_time: string } | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [leadScore, setLeadScore] = useState<number | undefined>();
  const [leadFlag, setLeadFlag] = useState<string | undefined>();
  const [nurturingEmail, setNurturingEmail] = useState("");
  const [earlyEmail, setEarlyEmail] = useState("");
  const [earlyEmailSaved, setEarlyEmailSaved] = useState(false);
  const [earlyEmailError, setEarlyEmailError] = useState("");
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [emailCaptureHandled, setEmailCaptureHandled] = useState(false);
  const [pendingClaudeCall, setPendingClaudeCall] = useState<{ messages: { role: "ai" | "user"; text: string }[]; turn: number } | null>(null);
  const [showQ5Buttons, setShowQ5Buttons] = useState(false);
  const [q5Options, setQ5Options] = useState<string[]>([]);
  const [q5FreeText, setQ5FreeText] = useState(false);
  const pendingClaudeCallRef = useRef<{ messages: { role: "ai" | "user"; text: string }[]; turn: number } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const earlyEmailInputRef = useRef<HTMLInputElement>(null);
  const earlyEmailSubmittingRef = useRef(false);
  const earlyEmailLastAttemptRef = useRef(0);
  const contextRef = useRef(getContextFromURL());
  const utmRef = useRef(getUTMParams());
  const attributionRef = useRef(getAttributionData());
  const inputDisabled = isAITyping || isTypewriting || showEmailCapture || showQ5Buttons;

  // Visitor name state (collected before diagnostic)
  const [visitorName, setVisitorName] = useState("");
  const [nameCollected, setNameCollected] = useState(false);

  // Corporate email validation state
  const [freeEmailAttempts, setFreeEmailAttempts] = useState(0);
  const [emailFallbackMode, setEmailFallbackMode] = useState(false);
  const [fallbackPhone, setFallbackPhone] = useState("");
  const [fallbackName, setFallbackName] = useState("");

  // HubSpot real-time sync state
  const [hubspotContactId, setHubspotContactId] = useState<string | null>(null);
  const answersBufferRef = useRef<Record<string, string>>({});
  const detectedCrmStatusRef = useRef<"sin_crm" | "hubspot" | "otro_crm">("sin_crm");

  // Question progress tracker — immune to turn desync from repeat_turn
  // 0=none, 1=cargo done, 2=rubro done, 3=equipo done, 4=crm done, 5=problema done
  const questionProgressRef = useRef(0);

  // Silent HubSpot sync — never interrupts the conversation
  const syncToHubSpot = useCallback(async (email: string, properties: Record<string, string>, createIfNotExists = false) => {
    try {
      console.log("[syncToHubSpot] calling update-contact:", { email, properties, createIfNotExists });
      const { data, error } = await supabase.functions.invoke("update-contact", {
        body: { email, properties, createIfNotExists, attribution: attributionRef.current },
      });
      if (error) {
        console.error("[syncToHubSpot] invoke error:", error);
        return null;
      }
      console.log("[syncToHubSpot] response:", data);
      if (data?.success && data?.contactId) {
        setHubspotContactId(data.contactId);
        return data.contactId;
      }
      if (!data?.success && data?.error) {
        console.error("[syncToHubSpot] HubSpot error:", data.error);
      }
      return null;
    } catch (e) {
      console.error("[syncToHubSpot] exception:", e);
      return null;
    }
  }, []);

  // Helper to get current email from any source
  const getCurrentEmail = useCallback(() => {
    return earlyEmail?.trim() || emailInput?.trim() || nurturingEmail?.trim() || null;
  }, [earlyEmail, emailInput, nurturingEmail]);

  // Save enriched conversation metadata to Supabase
  const saveConversationMeta = useCallback(
    async (convId: string, meta: Record<string, any>) => {
      console.log("[saveConversationMeta] saving:", { convId, meta });
      const { error } = await supabase
        .from("conversations")
        .upsert({ id: convId, ...(meta as any) }, { onConflict: "id" });
      if (error) console.error("[saveConversationMeta] error:", error);
    },
    []
  );

  // Process user answer and sync to HubSpot based on question progress (not turn number)
  const processAnswerForHubSpot = useCallback((userAnswer: string, _answerTurn: number) => {
    const buf = answersBufferRef.current;
    const convMeta: Record<string, any> = {};
    const progress = questionProgressRef.current;

    if (progress === 0) {
      // Q1: cargo + empresa — split intelligently
      buf.nivel_del_cargo = mapCargoToHubSpot(userAnswer);
      convMeta.cargo = buf.nivel_del_cargo;
      // Try to extract company: "cargo en/de empresa", "cargo, empresa", "cargo - empresa"
      const companyMatch = userAnswer.match(/(?:en|de|@)\s+(.+?)(?:\s*[.,]|$)/i)
        || userAnswer.match(/[,\-–—]\s*(.+?)$/i);
      if (companyMatch && companyMatch[1]) {
        buf.company = companyMatch[1].trim();
        convMeta.company = buf.company;
      } else {
        // If no separator found, try splitting: last meaningful words after the role keyword
        const roleParts = userAnswer.toLowerCase();
        const rolePatterns = [
          /(?:gerente\s+general|gerente\s+comercial|gerente\s+de\s+\w+|director\s+\w+|ceo|coo|cfo|cmo|cro|due[ñn]o|socio|founder|fundador|jefe|supervisor|coordinador|vendedor|ejecutivo|asesor)\s+(?:de\s+)?/i,
        ];
        for (const pattern of rolePatterns) {
          const match = userAnswer.match(pattern);
          if (match) {
            const afterRole = userAnswer.slice((match.index || 0) + match[0].length).trim();
            if (afterRole.length > 1) {
              buf.company = afterRole;
              convMeta.company = afterRole;
              break;
            }
          }
        }
      }
      questionProgressRef.current = 1;
    } else if (progress === 1) {
      // Q2: rubro
      buf.rubro = mapRubroToHubSpot(userAnswer);
      convMeta.rubro = buf.rubro;
      questionProgressRef.current = 2;
    } else if (progress === 2) {
      // Q3: equipo
      buf.cantidad_de_vendedores = mapEquipoToHubSpot(userAnswer);
      convMeta.equipo_comercial = buf.cantidad_de_vendedores;
      questionProgressRef.current = 3;
    } else if (progress === 3) {
      // Q4: CRM
      const mapped = mapCrmToHubSpot(userAnswer);
      buf.cuenta_con_crm = mapped.value;
      detectedCrmStatusRef.current = mapped.status;
      convMeta.crm = mapped.value;
      questionProgressRef.current = 4;
    } else if (progress === 4) {
      // Q5: problema
      const propName = getQ5PropertyName(detectedCrmStatusRef.current);
      const exactValue = Q5_BUTTON_TO_EXACT[userAnswer] || userAnswer;
      buf[propName] = exactValue;
      convMeta.problema_principal = exactValue;
      questionProgressRef.current = 5;
    }

    const currentConversationId = conversationIdRef.current || conversationId;
    if (currentConversationId && Object.keys(convMeta).length > 0) {
      void saveConversationMeta(currentConversationId, convMeta);
    }

    const email = getCurrentEmail();
    if (email) {
      console.log(`[processAnswerForHubSpot] progress ${progress}→${questionProgressRef.current}, syncing buffer:`, { ...buf });
      void syncToHubSpot(email, { ...buf }, false);
    } else {
      console.log(`[processAnswerForHubSpot] progress ${progress}→${questionProgressRef.current}, no email yet — buffering:`, { ...buf });
    }
  }, [syncToHubSpot, getCurrentEmail, conversationId, saveConversationMeta]);

  // Sync score and lead status to HubSpot
  const syncScoreToHubSpot = useCallback((score: number, flag: string, _email: string | null) => {
    const statusMap: Record<string, string> = {
      alta: "Calificado",
      media: "En Prospección",
      baja: "No califica",
      no_calificado: "No califica",
    };
    const props: Record<string, string> = {
      hs_lead_status: statusMap[flag] || "OPEN",
    };
    answersBufferRef.current = { ...answersBufferRef.current, ...props };
    const email = _email || getCurrentEmail();
    if (email) {
      console.log("[syncScoreToHubSpot] syncing score:", { score, flag, email });
      void syncToHubSpot(email, { ...answersBufferRef.current }, false);
    }
  }, [syncToHubSpot, getCurrentEmail]);

  // Scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAITyping, showEmailCapture, loadingSlots, availabilitySlots, selectedDay, selectedSlot]);

  // Create conversation in Supabase — generate ID client-side to avoid SELECT RLS restriction
  const createConversation = useCallback(async () => {
    const attr = attributionRef.current;
    const clientId = crypto.randomUUID();
    const { error } = await supabase
      .from("conversations")
      .upsert({
        id: clientId,
        context: contextRef.current,
        fbclid: attr.fbclid || null,
        utm_source: attr.utm_source || null,
        utm_medium: attr.utm_medium || null,
        utm_campaign: attr.utm_campaign || null,
        utm_content: attr.utm_content || null,
        utm_term: attr.utm_term || null,
        full_url: attr.full_url || null,
        referrer: attr.referrer || null,
      } as any, { onConflict: "id" });
    if (!error) {
      conversationIdRef.current = clientId;
      setConversationId(clientId);
      console.log("[createConversation] created with ID:", clientId);
      return clientId;
    }
    console.error("Failed to create conversation:", error);
    return null;
  }, []);

  // Save messages to Supabase
  const saveMessages = useCallback(
    async (convId: string, msgs: { role: string; text: string }[], extra?: Record<string, any>) => {
      const anthropicMessages = msgs.map((m) => ({
        role: m.role === "ai" ? "assistant" : "user",
        content: m.text,
      }));
      const { error } = await supabase
        .from("conversations")
        .upsert({ id: convId, messages: anthropicMessages as any, ...(extra || {}) } as any, { onConflict: "id" });
      if (error) console.error("[saveMessages] error:", error);
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
          body: { messages: anthropicMessages, context: contextRef.current, turn: currentTurn, visitorName },
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
    [typewriterEffect, visitorName]
  );

  // Fetch real availability from Febe's calendar
  const fetchAvailability = useCallback(async () => {
    setLoadingSlots(true);
    setAvailabilityError(null);
    setAvailabilitySlots({});
    setSelectedDay(null);
    setSelectedSlot(null);

    try {
      const { data, error } = await supabase.functions.invoke("get-availability");
      if (error) {
        console.error("get-availability invoke error:", error);
        setAvailabilityError("No pudimos cargar los horarios en este momento.");
        return;
      }

      const nextAvailability = data?.availability ?? {};
      if (Object.keys(nextAvailability).length === 0) {
        setAvailabilityError("No encontré horarios disponibles por ahora.");
        return;
      }

      setAvailabilitySlots(nextAvailability);
    } catch (e) {
      console.error("get-availability error:", e);
      setAvailabilityError("No pudimos cargar los horarios en este momento.");
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  // Detect crm_status from user's Q4 answer
  const detectCrmStatus = useCallback((userAnswer: string): "sin_crm" | "hubspot" | "otro_crm" => {
    const lower = userAnswer.toLowerCase();
    if (/hubspot/.test(lower)) return "hubspot";
    if (/excel|whatsapp|nada|no\s+(tenemos|usamos|tienen)|ninguna|no\s+uso|cuaderno|libreta|agenda/.test(lower)) return "sin_crm";
    if (/salesforce|zoho|pipedrive|monday|bitrix|odoo|dynamics|freshsales|crm|sistema/.test(lower)) return "otro_crm";
    return "sin_crm";
  }, []);

  const Q5_OPTIONS: Record<string, string[]> = {
    sin_crm: [
      "Clientes en Excel/WhatsApp desordenado",
      "No tenemos visibilidad del funnel",
      "Perdemos oportunidades por falta de seguimiento",
      "Queremos profesionalizar el proceso",
      "Queremos comenzar con HubSpot",
    ],
    hubspot: [
      "HubSpot no está bien configurado",
      "No estamos aprovechando la herramienta",
      "Reporting / pipelines desordenados",
      "Automatizaciones mal diseñadas",
      "Necesitamos mejores prácticas de RevOps",
      "Problemas de integraciones",
    ],
    otro_crm: [
      "El CRM actual es limitado o difícil de usar",
      "No se integra con nuestras herramientas",
      "No tenemos reporting ni visibilidad",
      "El CRM no se adapta al proceso comercial",
      "Queremos migrar a HubSpot",
    ],
  };

  // Helper to process Claude result and handle phase transitions
  const processClaudeResult = useCallback(
    async (result: { reply: string; phase: string; summary?: string; score?: number; flag?: string; repeat_turn?: boolean }, baseMsgs: { role: "ai" | "user"; text: string; meta?: boolean }[], currentTurn?: number) => {
      await typewriterEffect(result.reply);
      const finalMessages = [...baseMsgs, { role: "ai" as const, text: result.reply }];
      const currentConversationId = conversationIdRef.current || conversationId;
      // If repeat_turn, roll back the turn counter AND question progress
      if (result.repeat_turn) {
        setTurn((prev) => Math.max(prev - 1, 1));
        questionProgressRef.current = Math.max(questionProgressRef.current - 1, 0);
      }
      if (result.score !== undefined) {
        setLeadScore(result.score);
        const f = result.flag || (result.score >= 65 ? "alta" : result.score >= 40 ? "media" : "baja");
        const currentEmail = earlyEmailSaved ? earlyEmail : emailInput || nurturingEmail || null;
        syncScoreToHubSpot(result.score, f, currentEmail);
        if (currentConversationId) {
          const status = result.phase === "discarded" ? "descartado" : result.phase === "nurturing" ? "nurturing" : result.phase === "availability" ? "incompleto" : "incompleto";
          void saveConversationMeta(currentConversationId, { score: result.score, flag: f, status });
        }
      }
      if (result.flag) setLeadFlag(result.flag);
      if (result.summary) setSummary(result.summary);
      if (currentConversationId) {
        const extra: Record<string, any> = {};
        if (result.summary) extra.summary = result.summary;
        if (result.flag) extra.flag = result.flag;
        saveMessages(currentConversationId, finalMessages, Object.keys(extra).length ? extra : undefined);
      }

      // Detect Q5 — show buttons when CRM was just answered (progress === 4)
      // Uses questionProgressRef instead of turn numbers to avoid desync from repeat_turn
      if (questionProgressRef.current === 4 && result.phase === "conversation" && !result.repeat_turn) {
        const crmStatus = detectedCrmStatusRef.current;
        setQ5Options([...Q5_OPTIONS[crmStatus], "Otro — cuéntame con tus palabras"]);
        setShowQ5Buttons(true);
        setQ5FreeText(false);
      }

       if (result.phase === "discarded") {
         // Broker inmobiliario — end conversation, no email/scheduling
         setSummary(result.summary || "Descartado: Broker Inmobiliario");
         // Don't transition to email/scheduling screens — stay on chat
       } else if (result.phase === "nurturing") { setSummary(result.summary || null); setScreen(5); }
       else if (result.phase === "availability") {
         setScreen(5);
         void fetchAvailability();
       }
    },
    [typewriterEffect, conversationId, saveMessages, fetchAvailability, syncScoreToHubSpot, earlyEmail, earlyEmailSaved, emailInput, nurturingEmail]
  );

  // Start conversation — Screen 0 → 1 (ask name first)
  const startChat = useCallback(async () => {
    setScreen(1);
    const convId = await createConversation();
    setTurn(0); // Turn 0 = name step (not counted for Claude)
    const nameQuestion = "Para comenzar, ¿cómo te llamas?";
    await typewriterEffect(nameQuestion, true); // meta — not sent to Claude
    if (convId) saveMessages(convId, [{ role: "ai", text: nameQuestion }]);
  }, [createConversation, typewriterEffect, saveMessages]);

  const continuePendingClaudeCall = useCallback(async (showThanksMessage = false) => {
    const pending = pendingClaudeCallRef.current;
    if (!pending) return;

    pendingClaudeCallRef.current = null;
    setPendingClaudeCall(null);

    if (showThanksMessage) {
      await typewriterEffect("Gracias por compartirlo 🙌 Ahora sigamos...", true);
    }

    const result = await callClaude(pending.messages, pending.turn);
    if (result) {
      await processClaudeResult(result, pending.messages, pending.turn);
    }
  }, [callClaude, processClaudeResult, typewriterEffect]);

  // Save early email — make chat advance immediately, persist in background
  const handleEarlyEmailSave = useCallback(async (emailArg?: string) => {
    const domValue = earlyEmailInputRef.current?.value ?? "";
    const trimmedEmail = (emailArg ?? domValue ?? earlyEmail ?? "").trim();
    const now = Date.now();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);

    setEarlyEmail(trimmedEmail);

    if (!trimmedEmail) {
      setEarlyEmailError("Escribe un email para continuar o sáltalo.");
      return;
    }

    // Corporate email validation
    const validation = validateCorporateEmail(trimmedEmail);
    if (!validation.valid) {
      if (validation.error === 'gratuito') {
        const newAttempts = freeEmailAttempts + 1;
        setFreeEmailAttempts(newAttempts);
        if (newAttempts >= 2) {
          setEmailFallbackMode(true);
          setEarlyEmailError("");
          return;
        }
      }
      setEarlyEmailError(CORPORATE_EMAIL_ERRORS[validation.error!]);
      return;
    }

    setEarlyEmailError("");
    setEarlyEmailSaved(true);
    setShowEmailCapture(false);
    setEmailCaptureHandled(true);
    setEmailInput(trimmedEmail);
    setNurturingEmail(trimmedEmail);

    const currentConversationId = conversationIdRef.current || conversationId;

    // Save email to conversation
    if (currentConversationId) {
      void saveConversationMeta(currentConversationId, { visitor_email: trimmedEmail });
    }

    void continuePendingClaudeCall(true);

    if (!currentConversationId) return;

    if (earlyEmailSubmittingRef.current) {
      if (now - earlyEmailLastAttemptRef.current < 3000) return;
      earlyEmailSubmittingRef.current = false;
    }

    earlyEmailSubmittingRef.current = true;
    earlyEmailLastAttemptRef.current = now;

    void (async () => {
      try {
        const { error } = await supabase
          .from("conversations")
          .upsert({ id: currentConversationId, availability_preference: `early_email:${trimmedEmail}` } as any, { onConflict: "id" });

        if (error) {
          console.error("early email conversation update error:", error);
        }
      } catch (error) {
        console.error("early email conversation update exception:", error);
      } finally {
        window.setTimeout(() => {
          earlyEmailSubmittingRef.current = false;
        }, 400);
      }
    })();

    void (async () => {
      try {
        await syncToHubSpot(trimmedEmail, { ...answersBufferRef.current }, true);
      } catch (error) {
        console.error("early email HubSpot sync error:", error);
      }
    })();
  }, [conversationId, continuePendingClaudeCall, syncToHubSpot, earlyEmail, freeEmailAttempts]);

  // Fallback: continue without corporate email (phone-only)
  const handleEmailFallbackContinue = useCallback(async () => {
    const normalizedPhone = normalizePhone(fallbackPhone);
    const digits = fallbackPhone.replace(/\D/g, "");
    const local = digits.startsWith("56") ? digits.slice(2) : digits;
    if (local.length !== 9 || !local.startsWith("9")) {
      setEarlyEmailError("Ingresa un número válido de 9 dígitos, por ejemplo: 9 1234 5678");
      return;
    }

    setShowEmailCapture(false);
    setEmailCaptureHandled(true);
    setEarlyEmailError("");

    const currentConversationId = conversationIdRef.current || conversationId;

    // Save fallback info to conversation
    if (currentConversationId) {
      const fallbackMeta: Record<string, any> = {
        phone: normalizedPhone,
        flag: "sin_email_corporativo",
      };
      if (fallbackName.trim() && !visitorName) {
        fallbackMeta.visitor_name = fallbackName.trim();
      }
      void saveConversationMeta(currentConversationId, fallbackMeta);
    }

    void continuePendingClaudeCall(false);
  }, [fallbackPhone, fallbackName, conversationId, visitorName, saveConversationMeta, continuePendingClaudeCall]);

  useEffect(() => {
    return () => {};
  }, []);

  // Skip email capture
  const handleSkipEmail = useCallback(async () => {
    setShowEmailCapture(false);
    setEmailCaptureHandled(true);
    setEarlyEmailError("");
    await continuePendingClaudeCall(false);
  }, [continuePendingClaudeCall]);

  // Handle user sending a message
  const handleUserSend = useCallback(async () => {
    const val = chatInput.trim();
    if (!val || inputDisabled) return;
    const currentConversationId = conversationIdRef.current || conversationId;

    // ── Name step: before diagnostic ──
    if (!nameCollected) {
      const userMsg = { role: "user" as const, text: val, meta: true }; // meta — not sent to Claude
      setMessages((prev) => [...prev, userMsg]);
      setChatInput("");

      // Parse first/last name
      const parts = val.split(/\s+/);
      const capitalize = (w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
      const firstName = capitalize(parts[0] || val);
      const lastName = parts.slice(1).map(capitalize).join(" ") || "";
      const normalizedFull = lastName ? `${firstName} ${lastName}` : firstName;
      setVisitorName(firstName);
      setNameInput(normalizedFull); // pre-fill for booking screen

      // Save to HubSpot buffer
      answersBufferRef.current.firstname = firstName;
      if (lastName) answersBufferRef.current.lastname = lastName;

      setNameCollected(true);

      // Save visitor name to conversation
      if (currentConversationId) {
        void saveConversationMeta(currentConversationId, { visitor_name: normalizedFull });
      }

      // Now show Q1 (cargo+empresa) via typewriter — this IS sent to Claude
      const firstQuestion = `Qué bueno tenerte aquí, ${firstName}. Cuéntame, ¿cuál es tu cargo y en qué empresa trabajas?`;
      setTurn(1);
      await typewriterEffect(firstQuestion);
      if (currentConversationId) {
        saveMessages(currentConversationId, [
          ...messages, userMsg,
          { role: "ai", text: firstQuestion },
        ]);
      }
      return;
    }

    const userMsg = { role: "user" as const, text: val };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setChatInput("");

    const newTurn = turn + 1;
    setTurn(newTurn);

    // Process answer for HubSpot sync
    processAnswerForHubSpot(val, newTurn);

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
    await processClaudeResult(result, updatedMessages, newTurn);
  }, [chatInput, inputDisabled, messages, turn, callClaude, typewriterEffect, processClaudeResult, emailCaptureHandled, earlyEmailSaved, processAnswerForHubSpot, nameCollected, conversationId, saveMessages]);

  // Handle Q5 button click
  const handleQ5ButtonClick = useCallback(async (option: string) => {
    if (option === "Otro — cuéntame con tus palabras") {
      setShowQ5Buttons(false);
      setQ5FreeText(true);
      return;
    }
    setShowQ5Buttons(false);
    const userMsg = { role: "user" as const, text: option };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    const newTurn = turn + 1;
    setTurn(newTurn);
    // Process Q5 answer for HubSpot
    processAnswerForHubSpot(option, newTurn);
    const result = await callClaude(updatedMessages, newTurn);
    if (!result) return;
    await processClaudeResult(result, updatedMessages, newTurn);
  }, [messages, turn, callClaude, processClaudeResult, processAnswerForHubSpot]);

  // Handle Q5 free text send
  const handleQ5FreeTextSend = useCallback(async () => {
    const val = chatInput.trim();
    if (!val) return;
    setQ5FreeText(false);
    const userMsg = { role: "user" as const, text: val };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setChatInput("");
    const newTurn = turn + 1;
    setTurn(newTurn);
    // Process Q5 free text for HubSpot
    processAnswerForHubSpot(val, newTurn);
    const result = await callClaude(updatedMessages, newTurn);
    if (!result) return;
    await processClaudeResult(result, updatedMessages, newTurn);
  }, [chatInput, messages, turn, callClaude, processClaudeResult, processAnswerForHubSpot]);

  // Save conversion record to Supabase
  const saveConversion = useCallback(async (email: string, contactId: string | null, convType = "meeting_booked") => {
    const attr = attributionRef.current;
    const currentConversationId = conversationIdRef.current || conversationId;
    try {
      await supabase.from("conversions").insert({
        contact_email: email,
        contact_id_hubspot: contactId,
        fbclid: attr.fbclid || null,
        utm_source: attr.utm_source || null,
        utm_medium: attr.utm_medium || null,
        utm_campaign: attr.utm_campaign || null,
        utm_content: attr.utm_content || null,
        utm_term: attr.utm_term || null,
        full_url: attr.full_url || null,
        referrer: attr.referrer || null,
        conversion_type: convType,
        conversation_id: currentConversationId,
      } as any);
    } catch (e) {
      console.error("saveConversion error:", e);
    }
  }, [conversationId]);

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
          conversation_id: conversationIdRef.current || conversationId,
          score: leadScore,
          flag: "no_calificado",
          nurturing_only: true,
          conversation_messages: messages,
          answers_buffer: answersBufferRef.current,
          attribution: attributionRef.current,
          ...utmRef.current,
        },
      });
      void saveConversion(nurturingEmail.trim(), hubspotContactId, "nurturing_email");
    } catch (e) {
      console.error("nurturing submit error:", e);
    }
    setScreen(8); // confirmation
  }, [nurturingEmail, conversationId, summary, leadScore, saveConversion, hubspotContactId]);

  // Normalize phone to +56XXXXXXXXX
  const normalizePhone = (raw: string): string => {
    const digits = raw.replace(/\D/g, "");
    if (digits.startsWith("56") && digits.length >= 10) return `+${digits}`;
    return `+56${digits}`;
  };

  const validatePhone = (raw: string): boolean => {
    const digits = raw.replace(/\D/g, "");
    // Remove leading 56 if present
    const local = digits.startsWith("56") ? digits.slice(2) : digits;
    // Chilean mobile numbers must be exactly 9 digits starting with 9
    return local.length === 9 && local.startsWith("9");
  };

  const handleConfirmData = useCallback(async () => {
    // Determine the effective email
    const effectiveEmail = earlyEmail?.trim() || emailInput.trim();
    const currentConversationId = conversationIdRef.current || conversationId;
    setPhoneError("");
    setEmailError("");

    if (!effectiveEmail) {
      setEmailError("Ingresa tu correo electrónico");
      return;
    }
    const emailValidation = validateCorporateEmail(effectiveEmail);
    if (!emailValidation.valid) {
      setEmailError(CORPORATE_EMAIL_ERRORS[emailValidation.error!]);
      return;
    }
    if (!validatePhone(phoneInput)) {
      setPhoneError("Ingresa un número válido, por ejemplo: 9 1234 5678");
      return;
    }
    if (!selectedSlot) return;

    const normalizedPhone = normalizePhone(phoneInput);
    setScreen(7); // loading

    try {
      const { data, error } = await supabase.functions.invoke("book-meeting", {
        body: {
          name: nameInput.trim(),
          email: effectiveEmail,
          phone: normalizedPhone,
          context: contextRef.current,
          summary,
          availability_preference: `${selectedSlot.display_date} a las ${selectedSlot.display_time}`,
          selected_slot: selectedSlot,
          conversation_id: currentConversationId,
          score: leadScore,
          flag: leadFlag || "calificado",
          conversation_messages: messages,
          answers_buffer: answersBufferRef.current,
          attribution: attributionRef.current,
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

      void saveConversion(effectiveEmail, hubspotContactId, "meeting_booked");

      // Sync phone to HubSpot
      void syncToHubSpot(effectiveEmail, { ...answersBufferRef.current, phone: normalizedPhone }, false);

      // Save meeting status to conversation
      if (currentConversationId) {
        void saveConversationMeta(currentConversationId, {
          meeting_booked: true,
          status: "agendo",
          meeting_date: data.display_date,
          meeting_time: data.display_time,
          visitor_email: effectiveEmail,
          phone: normalizedPhone,
          hubspot_sync_status: "synced",
        });
      }

      setMeetingDate(data.display_date);
      setMeetingTime(data.display_time);
      setScreen(8);
    } catch (e) {
      console.error("book-meeting exception:", e);
      setScreen(8);
    }
  }, [nameInput, emailInput, earlyEmail, phoneInput, selectedSlot, conversationId, summary, leadScore, leadFlag, saveConversion, hubspotContactId, syncToHubSpot, saveConversationMeta]);


  /* ─── render current screen ─── */
  const renderScreen = () => {
    switch (screen) {
      /* ── Screen 0: Welcome Lidia ── */
      case 0:
        return (
          <motion.div key="s0" {...screenVariants} className="flex flex-col items-center justify-center h-full text-center" style={{ padding: "0 28px" }}>
            {/* Avatar */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative -mt-2 mb-0"
            >
              <img
                src={LidiaAvatar}
                alt="Lidia — Asistente Virtual"
                className="w-[96px] h-[96px] rounded-full object-cover"
                style={{ objectPosition: "50% 20%" }}
              />
            </motion.div>

            {/* Name + role */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5"
            >
              <p className="text-white text-[20px] font-medium">Hola, soy Lidia 👋</p>
              <p className="text-[14px] font-normal mt-2" style={{ color: "rgba(255,255,255,0.6)" }}>
                Soy asistente virtual de Revops LATAM.
              </p>
            </motion.div>

            {/* Separator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="my-6 mx-auto"
              style={{ width: 40, height: 1, background: "rgba(255,255,255,0.15)" }}
            />

            {/* Main text */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-[320px]"
            >
              <p className="text-[15px] font-normal leading-[1.65] mb-4" style={{ color: "rgba(255,255,255,0.85)" }}>
                Gracias por llegar hasta aquí.{"\n"}
                Si algo del video te resonó,{"\n"}
                probablemente tenemos algo que decirte.
              </p>
              <p className="text-[15px] font-normal leading-[1.65] mb-6" style={{ color: "rgba(255,255,255,0.85)" }}>
                Ayudamos a empresas a ordenar su{"\n"}
                operación comercial para que el{"\n"}
                revenue fluya sin fricción.
              </p>
            </motion.div>

            {/* CTA question */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-white text-[16px] font-medium leading-[1.5] max-w-[300px] mb-8"
            >
              ¿Te parece si te hago algunas preguntas para ver si podemos ayudarte?
            </motion.p>

            {/* Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => startChat()}
              className="w-full py-[14px] rounded-full text-white font-medium text-[16px] transition-all duration-300 hover:scale-[1.02] active:scale-[0.97]"
              style={{ background: "#BE1869", height: 52 }}
            >
              Sí, hablemos →
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

            {/* Email capture overlay — with corporate validation + fallback */}
            {showEmailCapture && !isAITyping && !isTypewriting ? (
              <motion.form
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="px-4 pb-4 pt-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (emailFallbackMode) {
                    void handleEmailFallbackContinue();
                  } else {
                    void handleEarlyEmailSave(earlyEmailInputRef.current?.value ?? earlyEmail);
                  }
                }}
              >
                <div
                  className="rounded-2xl p-5 flex flex-col gap-3"
                  style={{
                    background: "rgba(98,36,190,0.12)",
                    border: "1px solid rgba(98,36,190,0.25)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  {emailFallbackMode ? (
                    /* ── Fallback: phone-only mode ── */
                    <>
                      <p className="text-white/70 text-[14px] leading-snug text-center">
                        Si no tienes correo corporativo aún, igual podemos conversar — ingresa tu nombre completo y te contactamos por teléfono.
                      </p>
                      {!visitorName && (
                        <input
                          type="text"
                          value={fallbackName}
                          onChange={(e) => setFallbackName(e.target.value)}
                          placeholder="Tu nombre completo"
                          className="w-full rounded-xl px-4 py-3 text-[16px] text-white placeholder:text-white/30 outline-none font-[Lexend]"
                          style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
                        />
                      )}
                      <div
                        className="flex items-center rounded-xl overflow-hidden"
                        style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
                      >
                        <span className="pl-4 pr-2 text-[15px] text-white/50 font-[Lexend] select-none whitespace-nowrap">🇨🇱 +56</span>
                        <input
                          type="tel"
                          inputMode="numeric"
                          value={fallbackPhone}
                          onChange={(e) => {
                            let cleaned = e.target.value.replace(/[^\d]/g, "");
                            if (cleaned.startsWith("56") && cleaned.length > 2) cleaned = cleaned.slice(2);
                            setFallbackPhone(cleaned);
                            if (earlyEmailError) setEarlyEmailError("");
                          }}
                          placeholder="9 1234 5678"
                          className="flex-1 py-3 pr-4 text-[16px] text-white placeholder:text-white/30 outline-none font-[Lexend] bg-transparent"
                          autoFocus
                        />
                      </div>
                      {earlyEmailError && (
                        <p className="text-[12px] text-center text-red-400">{earlyEmailError}</p>
                      )}
                      <button
                        type="submit"
                        disabled={!fallbackPhone.trim()}
                        className="w-full py-3 rounded-full text-white font-medium text-[15px] transition-all duration-300 hover:scale-[1.02] active:scale-[0.97] disabled:opacity-30 touch-manipulation"
                        style={{ background: "#BE1869", boxShadow: "0 4px 16px rgba(190,24,105,0.3)" }}
                      >
                        Continuar →
                      </button>
                    </>
                  ) : (
                    /* ── Normal: corporate email capture ── */
                    <>
                      <p className="text-white/70 text-[14px] leading-snug text-center">
                        Así no perdemos el contacto si se corta la conversación.
                      </p>
                      <div
                        className="flex items-center gap-2 rounded-xl px-4 py-3"
                        style={{ background: "rgba(255,255,255,0.08)", border: earlyEmailError ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(255,255,255,0.12)" }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                          <rect width="20" height="16" x="2" y="4" rx="2" />
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                        <input
                          ref={earlyEmailInputRef}
                          name="early-email"
                          type="text"
                          value={earlyEmail}
                          onChange={(e) => {
                            setEarlyEmail(e.target.value);
                            if (earlyEmailError) setEarlyEmailError("");
                          }}
                          placeholder="tu@empresa.com"
                          className="flex-1 bg-transparent text-white text-[16px] placeholder:text-white/30 outline-none font-[Lexend]"
                          autoFocus
                          inputMode="email"
                          enterKeyHint="done"
                          autoCapitalize="none"
                          autoCorrect="off"
                          autoComplete="email"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              void handleEarlyEmailSave((e.currentTarget as HTMLInputElement).value);
                            }
                          }}
                        />
                      </div>
                      {earlyEmailError ? (
                        <p className="text-[12px] text-center text-red-400/90 leading-snug">
                          {earlyEmailError}
                        </p>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => void handleEarlyEmailSave(earlyEmailInputRef.current?.value ?? earlyEmail)}
                        disabled={!earlyEmail.trim()}
                        className="w-full py-3 rounded-full text-white font-medium text-[15px] transition-all duration-300 hover:scale-[1.02] active:scale-[0.97] disabled:opacity-30 touch-manipulation"
                        style={{ background: "#BE1869", boxShadow: "0 4px 16px rgba(190,24,105,0.3)" }}
                      >
                        Continuar →
                      </button>
                      <button
                        type="button"
                        onClick={handleSkipEmail}
                        className="text-[13px] text-white/25 hover:text-white/45 transition-colors self-center"
                      >
                        Prefiero no darlo ahora
                      </button>
                    </>
                  )}
                </div>
              </motion.form>
            ) : showQ5Buttons && !isAITyping && !isTypewriting ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="px-4 pb-4 pt-2 flex flex-col gap-2"
              >
                {q5Options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleQ5ButtonClick(option)}
                    className="w-full text-left text-[15px] text-white transition-all duration-200 active:scale-[0.98]"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      border: "0.5px solid rgba(255,255,255,0.2)",
                      borderRadius: "12px",
                      padding: "14px 16px",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
                  >
                    {option}
                  </button>
                ))}
              </motion.div>
            ) : q5FreeText ? (
              <div className="px-4 pb-4 pt-2">
                <ChatInput
                  value={chatInput}
                  onChange={setChatInput}
                  onSend={handleQ5FreeTextSend}
                  placeholder="Cuéntame con tus palabras..."
                  disabled={isAITyping || isTypewriting}
                />
              </div>
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
                   className="w-full rounded-xl px-4 py-3 text-[16px] text-white placeholder:text-white/30 outline-none font-[Lexend]"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.08)" }}
                />
                <button
                  onClick={handleNurturingSubmit}
                  disabled={!nurturingEmail.trim()}
                   className="w-full py-3.5 rounded-full text-white font-medium text-[16px] transition-all duration-300 hover:scale-[1.02] active:scale-[0.97] disabled:opacity-40"
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
          <motion.div key="chat" {...screenVariants} className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2 flex flex-col gap-3">
              {messages.map((m, i) => (
                <motion.div key={`${m.role}-${i}-${m.text.slice(0, 20)}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: i < messages.length - 3 ? 0 : (i - (messages.length - 3)) * 0.05 }}>
                  {m.role === "ai" ? <AIBubble>{m.text}</AIBubble> : <UserBubble>{m.text}</UserBubble>}
                </motion.div>
              ))}

              {/* Slots */}
              {loadingSlots ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-3 py-6">
                  <TypingDots />
                  <span className="text-white/40 text-[13px]">Buscando horarios disponibles...</span>
                </motion.div>
              ) : availabilityError ? (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="flex flex-col gap-3 mt-2">
                  <AIBubble>Estoy teniendo un problema para traer los horarios.</AIBubble>
                  <div
                    className="rounded-2xl p-4 flex flex-col gap-3"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <p className="text-white/65 text-[14px] leading-relaxed text-center">{availabilityError}</p>
                    <button
                      onClick={() => void fetchAvailability()}
                      className="w-full py-3 rounded-full text-white font-medium text-[15px] transition-all duration-300 active:scale-[0.97]"
                      style={{ background: "#BE1869", boxShadow: "0 4px 16px rgba(190,24,105,0.3)" }}
                    >
                      Reintentar horarios
                    </button>
                  </div>
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
                        className="px-4 py-3 rounded-xl text-left text-[15px] font-medium capitalize transition-all duration-200 active:scale-[0.97] hover:scale-[1.01]"
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          color: "rgba(255,255,255,0.75)",
                        }}
                      >
                        📅 {dayData.display_date}
                        <span className="text-white/30 text-[13px] ml-2">
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
                          className="px-4 py-2 rounded-xl text-[15px] font-medium transition-all duration-200 active:scale-[0.95]"
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
                    className="text-[13px] text-white/30 hover:text-white/50 transition-colors self-start pl-1 mt-1"
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
                className="w-full py-3.5 rounded-full text-white font-medium text-[16px] transition-all duration-300 hover:scale-[1.02] active:scale-[0.97] disabled:opacity-30"
                style={{ background: "#BE1869", boxShadow: "0 6px 24px rgba(190,24,105,0.3)" }}
              >
                {selectedSlot ? `Confirmar ${selectedSlot.display_date} a las ${selectedSlot.display_time} →` : "Selecciona un horario"}
              </button>
            </div>
          </motion.div>
        );

      /* ── Screen 6: Phone + conditional Email ── */
      case 6: {
        const hasEmail = !!(earlyEmail?.trim());
        const displayName = visitorName || nameInput || "amigo";
        const bubbleText = hasEmail
          ? `Casi listo, ${displayName}. ¿A qué teléfono te avisamos para confirmar la reunión?`
          : `Casi listo, ${displayName}. Para confirmar la reunión necesito tu correo y un teléfono donde avisarte.`;

        const handlePhoneChange = (raw: string) => {
          // Strip non-digits, auto-remove leading +56 or 56
          let cleaned = raw.replace(/[^\d]/g, "");
          if (cleaned.startsWith("56") && cleaned.length > 2) cleaned = cleaned.slice(2);
          setPhoneInput(cleaned);
          setPhoneError("");
        };

        const isFormValid = validatePhone(phoneInput) && (hasEmail || validateCorporateEmail(emailInput.trim()).valid);

        return (
          <motion.div key="s6" {...screenVariants} className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2 flex flex-col gap-3 justify-center">
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                <AIBubble>{bubbleText}</AIBubble>
              </motion.div>
            </div>
            <div className="px-4 pb-4 pt-2 flex flex-col gap-3">
              {/* Email field — only if not captured earlier */}
              {!hasEmail && (
                <div>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => { setEmailInput(e.target.value); setEmailError(""); }}
                    placeholder="tu@empresa.com"
                    className="w-full rounded-xl px-4 py-3 text-[16px] text-white placeholder:text-white/30 outline-none font-[Lexend]"
                    style={{ background: "rgba(255,255,255,0.07)", border: emailError ? "1px solid rgba(239,68,68,0.6)" : "1px solid rgba(255,255,255,0.08)" }}
                  />
                  {emailError && <p className="text-red-400 text-[13px] mt-1 pl-1">{emailError}</p>}
                </div>
              )}

              {/* Phone field with +56 prefix */}
              <div>
                <div
                  className="flex items-center w-full rounded-xl overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.07)", border: phoneError ? "1px solid rgba(239,68,68,0.6)" : "1px solid rgba(255,255,255,0.08)" }}
                >
                  <span className="pl-4 pr-2 text-[15px] text-white/50 font-[Lexend] select-none whitespace-nowrap">🇨🇱 +56</span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={phoneInput}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="9 1234 5678"
                    className="flex-1 py-3 pr-4 text-[16px] text-white placeholder:text-white/30 outline-none font-[Lexend] bg-transparent"
                  />
                </div>
                {phoneError && <p className="text-red-400 text-[13px] mt-1 pl-1">{phoneError}</p>}
              </div>

              <button
                onClick={handleConfirmData}
                disabled={!isFormValid}
                className="w-full py-3.5 rounded-full text-white font-medium text-[16px] transition-all duration-300 hover:scale-[1.02] active:scale-[0.97] disabled:opacity-40"
                style={{ background: "#BE1869", boxShadow: "0 6px 24px rgba(190,24,105,0.3)" }}
              >
                Confirmar reunión →
              </button>
            </div>
          </motion.div>
        );
      }

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
            <p className="text-white/40 text-[15px] font-light max-w-[300px]">
              {leadFlag === "no_calificado"
                ? "Revisa tu bandeja de entrada en los próximos días."
                : "Recibirás una invitación en tu correo con todos los detalles."}
            </p>

            {/* CTA: Conoce RevOps LATAM */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.8 }}
              className="w-full max-w-[320px] flex flex-col items-center"
            >
              <div className="w-full" style={{ height: 1, background: "rgba(255,255,255,0.1)", margin: "28px 0" }} />
              <p className="text-[14px] mb-4 text-center" style={{ color: "rgba(255,255,255,0.6)" }}>
                Mientras tanto, conoce cómo trabajamos y qué dicen nuestros clientes.
              </p>
              <a
                href="https://www.revopslatam.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-full text-white text-[14px] font-medium text-center transition-all duration-200"
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.3)",
                  padding: "12px 28px",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.6)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; e.currentTarget.style.background = "transparent"; }}
              >
                Conoce RevOps LATAM →
              </a>
            </motion.div>

            <div className="mt-4 text-white/20 text-[12px] tracking-wide leading-relaxed">
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
