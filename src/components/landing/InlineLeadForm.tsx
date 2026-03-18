import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

// ── Options ──
const CARGOS = [
  "Dueño / Socio / Founder",
  "CEO / Gerente General",
  "Gerente Comercial / Ventas",
  "Gerente Marketing / Growth / RevOps",
  "Jefe de Ventas / Supervisor Comercial",
  "Vendedor / Ejecutivo Comercial",
  "Otro",
];
const RUBROS = [
  "SaaS B2B", "Servicios B2C", "Servicios B2B", "Venta de productos B2B",
  "Educación Superior", "Inmobiliaria", "Broker Inmobiliario",
  "Retail", "E-commerce", "Salud", "Colegios", "Otros",
];
const EQUIPO = [
  "Solo el dueño vende", "1 vendedor", "2–3 vendedores",
  "4–10 vendedores", "10+ vendedores",
];
const CRM_OPTIONS = [
  "No, usamos Excel / WhatsApp / herramientas básicas",
  "Sí, usamos HubSpot",
  "Sí, usamos otro CRM",
];
const PAIN_NO_CRM = [
  "Llevamos clientes en Excel/WhatsApp y está desordenado",
  "Queremos comenzar con HubSpot como nuestro CRM",
  "Queremos profesionalizar el proceso comercial",
  "No tenemos visibilidad del funnel",
  "Perdemos oportunidades por falta de seguimiento",
  "Solo estoy explorando, no es prioridad",
];
const PAIN_HUBSPOT = [
  "Automatizaciones mal diseñadas",
  "Reporting / pipelines desordenados",
  "No estamos aprovechando la herramienta",
  "Necesitamos mejores prácticas de RevOps",
  "HubSpot no está bien configurado",
  "Problemas de integraciones",
  "Solo estoy explorando, no es prioridad",
];
const PAIN_OTHER_CRM = [
  "No se integra con nuestras herramientas",
  "No tenemos reporting ni visibilidad",
  "Queremos migrarnos a HubSpot",
  "El CRM no se adapta al proceso comercial",
  "El CRM actual es limitado o difícil de usar",
  "Solo estoy explorando, no es prioridad",
];

const CARGO_SCORE: Record<string, number> = {
  "Dueño / Socio / Founder": 5, "CEO / Gerente General": 10,
  "Gerente Comercial / Ventas": 10, "Gerente Marketing / Growth / RevOps": 10,
  "Jefe de Ventas / Supervisor Comercial": 5, "Vendedor / Ejecutivo Comercial": 0, "Otro": 0,
};
const RUBRO_SCORE: Record<string, number> = {
  "SaaS B2B": 20, "Servicios B2C": 20, "Servicios B2B": 20, "Venta de productos B2B": 20,
  "Educación Superior": 20, "Inmobiliaria": 20, "Broker Inmobiliario": -20,
  "Retail": -10, "E-commerce": -10, "Salud": 10, "Colegios": -10, "Otros": 15,
};
const EQUIPO_SCORE: Record<string, number> = {
  "Solo el dueño vende": -20, "1 vendedor": -10, "2–3 vendedores": 10,
  "4–10 vendedores": 20, "10+ vendedores": 25,
};

function getPainOptions(crm: string): string[] {
  if (crm.includes("HubSpot")) return PAIN_HUBSPOT;
  if (crm.includes("otro CRM")) return PAIN_OTHER_CRM;
  return PAIN_NO_CRM;
}

function calculateScore(data: FormData): number {
  let score = 0;
  score += CARGO_SCORE[data.job_title] ?? 0;
  score += RUBRO_SCORE[data.industry] ?? 0;
  score += EQUIPO_SCORE[data.team_size] ?? 0;
  if (data.main_pain === "Solo estoy explorando, no es prioridad") score -= 10;
  else if (data.main_pain) score += 10;
  return score;
}

const step1Schema = z.object({
  first_name: z.string().trim().min(1, "Requerido").max(80),
  last_name: z.string().trim().min(1, "Requerido").max(80),
  email: z.string().trim().email("Correo inválido").max(200),
  phone: z.string().trim().min(7, "Mínimo 7 dígitos").max(20).regex(/^\+?\d[\d\s\-()]*$/, "Solo números válidos"),
});

interface FormData {
  first_name: string; last_name: string; email: string; phone: string;
  consent: boolean; job_title: string; company_name: string; industry: string;
  team_size: string; has_crm: string; main_pain: string;
}

const initial: FormData = {
  first_name: "", last_name: "", email: "", phone: "", consent: false,
  job_title: "", company_name: "", industry: "", team_size: "",
  has_crm: "", main_pain: "",
};

const HUBSPOT_MEETINGS_URL = "https://meetings.hubspot.com/febe-moena/reuniones-landing-revops-usan-hubspot";

const COUNTRY_CODES = [
  { code: "+56", flag: "🇨🇱" }, { code: "+52", flag: "🇲🇽" },
  { code: "+57", flag: "🇨🇴" }, { code: "+54", flag: "🇦🇷" },
  { code: "+51", flag: "🇵🇪" }, { code: "+1", flag: "🇺🇸" },
  { code: "+55", flag: "🇧🇷" }, { code: "+593", flag: "🇪🇨" },
  { code: "+58", flag: "🇻🇪" }, { code: "+34", flag: "🇪🇸" },
];

/* ─── Sub-components ─── */
function StepWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

function Field({ label, value, onChange, error, type = "text", autoFocus, placeholder }: {
  label: string; value: string; onChange: (v: string) => void;
  error?: string; type?: string; autoFocus?: boolean; placeholder?: string;
}) {
  return (
    <div className="mt-3">
      <label className="block text-[13px] font-semibold mb-1" style={{ color: "#1A1A2E" }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        autoFocus={autoFocus}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 rounded-xl text-[14px] outline-none transition-all border"
        style={{
          background: "rgba(255,255,255,0.8)",
          borderColor: error ? "hsl(0 84% 60%)" : "#E5E7EB",
          color: "#1A1A2E",
        }}
      />
      {error && <p className="text-[11px] mt-0.5 font-medium" style={{ color: "hsl(0 84% 60%)" }}>{error}</p>}
    </div>
  );
}

function PhoneField({ label, value, onChange, error }: {
  label: string; value: string; onChange: (v: string) => void; error?: string;
}) {
  const [countryCode, setCountryCode] = useState(COUNTRY_CODES[0].code);
  const numberPart = value.startsWith("+") ? value.replace(/^\+\d{1,3}\s?/, "") : value;

  const handleNumberChange = (raw: string) => {
    const cleaned = raw.replace(/[^\d\s\-]/g, "");
    onChange(cleaned ? `${countryCode} ${cleaned}` : "");
  };

  const handleCodeChange = (newCode: string) => {
    setCountryCode(newCode);
    if (numberPart) onChange(`${newCode} ${numberPart}`);
  };

  return (
    <div className="mt-3">
      <label className="block text-[13px] font-semibold mb-1" style={{ color: "#1A1A2E" }}>{label}</label>
      <div className="flex gap-1.5">
        <select
          value={countryCode}
          onChange={e => handleCodeChange(e.target.value)}
          className="px-1.5 py-2.5 rounded-xl text-[13px] outline-none border cursor-pointer appearance-none text-center w-[80px] shrink-0"
          style={{ background: "rgba(255,255,255,0.8)", borderColor: error ? "hsl(0 84% 60%)" : "#E5E7EB", color: "#1A1A2E" }}
        >
          {COUNTRY_CODES.map(c => (
            <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
          ))}
        </select>
        <input
          type="tel"
          value={numberPart}
          onChange={e => handleNumberChange(e.target.value)}
          placeholder="9 1234 5678"
          className="flex-1 px-3.5 py-2.5 rounded-xl text-[14px] outline-none transition-all border"
          style={{ background: "rgba(255,255,255,0.8)", borderColor: error ? "hsl(0 84% 60%)" : "#E5E7EB", color: "#1A1A2E" }}
        />
      </div>
      {error && <p className="text-[11px] mt-0.5 font-medium" style={{ color: "hsl(0 84% 60%)" }}>{error}</p>}
    </div>
  );
}

function SelectField({ label, value, options, onChange, error }: {
  label: string; value: string; options: string[];
  onChange: (v: string) => void; error?: string;
}) {
  return (
    <div className="mt-3">
      <label className="block text-[13px] font-semibold mb-1" style={{ color: "#1A1A2E" }}>{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-3.5 py-2.5 rounded-xl text-[14px] outline-none transition-all appearance-none cursor-pointer border"
        style={{ background: "rgba(255,255,255,0.8)", borderColor: error ? "hsl(0 84% 60%)" : "#E5E7EB", color: "#1A1A2E" }}
      >
        <option value="" disabled>Seleccionar...</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      {error && <p className="text-[11px] mt-0.5 font-medium" style={{ color: "hsl(0 84% 60%)" }}>{error}</p>}
    </div>
  );
}

function OptionButton({ selected, label, onClick }: { selected: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left px-4 py-3 rounded-xl text-[13px] sm:text-[14px] font-medium transition-all duration-150 border-2 active:scale-[0.98]"
      style={{
        background: selected ? "rgba(190,24,105,0.08)" : "rgba(255,255,255,0.6)",
        borderColor: selected ? "#BE1869" : "rgba(0,0,0,0.06)",
        color: "#1A1A2E",
      }}
    >
      {label}
    </button>
  );
}

/* ═══════════════ MAIN COMPONENT ═══════════════ */
export default function InlineLeadForm({ sourcePage = "lp-conoce-tu-pista" }: { sourcePage?: string }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [score, setScore] = useState(0);

  const set = (key: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => { const n = { ...prev }; delete n[key]; return n; });
  };

  const validateStep = (): boolean => {
    if (step === 0) {
      const result = step1Schema.safeParse(form);
      if (!result.success) {
        const errs: Record<string, string> = {};
        result.error.errors.forEach(e => { errs[e.path[0] as string] = e.message; });
        setErrors(errs);
        return false;
      }
    }
    if (step === 1) {
      const errs: Record<string, string> = {};
      if (!form.job_title) errs.job_title = "Selecciona tu cargo";
      if (!form.company_name.trim()) errs.company_name = "Requerido";
      if (!form.industry) errs.industry = "Selecciona un rubro";
      if (!form.team_size) errs.team_size = "Selecciona el tamaño";
      if (Object.keys(errs).length) { setErrors(errs); return false; }
    }
    if (step === 2) {
      if (!form.has_crm) { setErrors({ has_crm: "Selecciona una opción" }); return false; }
    }
    if (step === 3) {
      if (!form.main_pain) { setErrors({ main_pain: "Selecciona tu principal desafío" }); return false; }
      if (!form.consent) { setErrors(prev => ({ ...prev, consent: "Debes aceptar para continuar" })); return false; }
    }
    return true;
  };

  const next = async () => {
    if (!validateStep()) return;
    if (step < 3) { setStep(step + 1); return; }

    setSubmitting(true);
    const finalScore = calculateScore(form);
    setScore(finalScore);
    const qualified = finalScore >= 40;

    try {
      const leadData = {
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim(),
        phone: form.phone?.trim() || null,
        job_title: form.job_title,
        company_name: form.company_name.trim(),
        industry: form.industry,
        team_size: form.team_size,
        has_crm: form.has_crm,
        main_pain: form.main_pain,
        lead_score: finalScore,
        is_qualified: qualified,
        source_page: sourcePage,
      };

      await Promise.allSettled([
        (supabase as any).from("leads").insert(leadData),
        supabase.functions.invoke("submit-lead-hubspot", { body: leadData }),
      ]);
    } catch (_) { /* best effort */ }

    setSubmitting(false);
    setStep(4);
  };

  const stepLabels = ["Datos", "Empresa", "CRM", "Desafío"];
  const qualified = score >= 40;

  return (
    <div
      className="w-full rounded-2xl sm:rounded-3xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.1)",
      }}
    >
      {/* Progress bar — compact */}
      {step < 4 && (
        <div className="px-5 pt-5 sm:px-6 sm:pt-6">
          <div className="flex gap-1.5">
            {stepLabels.map((label, i) => (
              <div key={i} className="flex-1">
                <div className="h-1 rounded-full overflow-hidden" style={{ background: "#F3F4F6" }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: GRADIENT }}
                    initial={{ width: "0%" }}
                    animate={{ width: i <= step ? "100%" : "0%" }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-[10px] mt-1 text-center font-medium" style={{ color: i <= step ? "#1A1A2E" : "#D1D5DB" }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="px-5 pb-5 pt-3 sm:px-6 sm:pb-6">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <StepWrapper key="s0">
              <h3 className="text-lg sm:text-xl font-bold mb-0.5" style={{ color: "#1A1A2E" }}>Conversemos 👋</h3>
              <p className="text-[13px] mb-3" style={{ color: "#6B7280" }}>Cuéntanos sobre ti</p>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Nombre" value={form.first_name} onChange={v => set("first_name", v)} error={errors.first_name} autoFocus />
                <Field label="Apellido" value={form.last_name} onChange={v => set("last_name", v)} error={errors.last_name} />
              </div>
              <Field label="Correo corporativo" value={form.email} onChange={v => set("email", v)} error={errors.email} type="email" />
              <PhoneField label="Teléfono" value={form.phone} onChange={v => set("phone", v)} error={errors.phone} />
            </StepWrapper>
          )}

          {step === 1 && (
            <StepWrapper key="s1">
              <h3 className="text-lg sm:text-xl font-bold mb-0.5" style={{ color: "#1A1A2E" }}>Tu empresa 🏢</h3>
              <p className="text-[13px] mb-3" style={{ color: "#6B7280" }}>Para entender tu contexto</p>
              <SelectField label="¿Cuál es tu cargo?" value={form.job_title} options={CARGOS} onChange={v => set("job_title", v)} error={errors.job_title} />
              <Field label="¿En qué empresa trabajas?" value={form.company_name} onChange={v => set("company_name", v)} error={errors.company_name} />
              <SelectField label="Rubro" value={form.industry} options={RUBROS} onChange={v => set("industry", v)} error={errors.industry} />
              <SelectField label="Equipo comercial" value={form.team_size} options={EQUIPO} onChange={v => set("team_size", v)} error={errors.team_size} />
            </StepWrapper>
          )}

          {step === 2 && (
            <StepWrapper key="s2">
              <h3 className="text-lg sm:text-xl font-bold mb-0.5" style={{ color: "#1A1A2E" }}>Tu CRM 💻</h3>
              <p className="text-[13px] mb-3" style={{ color: "#6B7280" }}>¿Cuentas con un CRM?</p>
              <div className="flex flex-col gap-2">
                {CRM_OPTIONS.map(opt => (
                  <OptionButton
                    key={opt}
                    label={opt}
                    selected={form.has_crm === opt}
                    onClick={() => { set("has_crm", opt); set("main_pain", ""); }}
                  />
                ))}
              </div>
              {errors.has_crm && <p className="text-[11px] mt-1 font-medium" style={{ color: "hsl(0 84% 60%)" }}>{errors.has_crm}</p>}
            </StepWrapper>
          )}

          {step === 3 && (
            <StepWrapper key="s3">
              <h3 className="text-lg sm:text-xl font-bold mb-0.5" style={{ color: "#1A1A2E" }}>Tu desafío 🎯</h3>
              <p className="text-[13px] mb-3" style={{ color: "#6B7280" }}>¿Cuál problema te resuena más?</p>
              <div className="flex flex-col gap-2">
                {getPainOptions(form.has_crm).map(opt => (
                  <OptionButton
                    key={opt}
                    label={opt}
                    selected={form.main_pain === opt}
                    onClick={() => set("main_pain", opt)}
                  />
                ))}
              </div>
              {errors.main_pain && <p className="text-[11px] mt-1 font-medium" style={{ color: "hsl(0 84% 60%)" }}>{errors.main_pain}</p>}
              <div className="mt-4 pt-3" style={{ borderTop: "1px solid #F3F4F6" }}>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.consent}
                    onChange={e => { setForm(prev => ({ ...prev, consent: e.target.checked })); setErrors(prev => { const n = { ...prev }; delete n.consent; return n; }); }}
                    className="mt-0.5 w-4 h-4 rounded border-2 accent-pink cursor-pointer shrink-0"
                    style={{ borderColor: "#D1D5DB" }}
                  />
                  <span className="text-[11px] leading-relaxed" style={{ color: "#9CA3AF" }}>
                    Acepto recibir información y comunicaciones de Revops LATAM.
                  </span>
                </label>
                {errors.consent && <p className="text-[11px] mt-0.5 font-medium ml-6" style={{ color: "hsl(0 84% 60%)" }}>{errors.consent}</p>}
              </div>
            </StepWrapper>
          )}

          {step === 4 && qualified && (
            <StepWrapper key="qualified">
              <div className="text-center py-2">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 15 }}>
                  <CheckCircle2 size={40} className="mx-auto mb-2" style={{ color: "#1CA398" }} />
                </motion.div>
                <h3 className="text-lg font-bold mb-1" style={{ color: "#1A1A2E" }}>¡Genial, {form.first_name}! 🎉</h3>
                <p className="text-[13px] mb-3" style={{ color: "#6B7280" }}>
                  Tu perfil encaja perfecto. Elige un horario:
                </p>
                <div className="rounded-xl overflow-hidden border" style={{ borderColor: "#E5E7EB" }}>
                  <iframe
                    src={`${HUBSPOT_MEETINGS_URL}?embed=true&firstname=${encodeURIComponent(form.first_name)}&lastname=${encodeURIComponent(form.last_name)}&email=${encodeURIComponent(form.email)}&phone=${encodeURIComponent(form.phone || "")}&company=${encodeURIComponent(form.company_name)}`}
                    width="100%"
                    height="500"
                    frameBorder="0"
                    title="Agendar reunión"
                    className="w-full"
                    style={{ border: "none", minHeight: "500px" }}
                  />
                </div>
              </div>
            </StepWrapper>
          )}

          {step === 4 && !qualified && (
            <StepWrapper key="not-qualified">
              <div className="text-center py-3">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 15 }}>
                  <XCircle size={44} className="mx-auto mb-3" style={{ color: "#E8A817" }} />
                </motion.div>
                <h3 className="text-lg font-bold mb-2" style={{ color: "#1A1A2E" }}>¡Gracias, {form.first_name}! 🙌</h3>
                <p className="text-[13px] mb-4 leading-relaxed" style={{ color: "#6B7280" }}>
                  Nuestras soluciones están enfocadas en equipos comerciales con más de 2 personas.
                  Haz nuestro <strong style={{ color: "#1A1A2E" }}>Pulso Comercial</strong> gratuito:
                </p>
                <a
                  href="https://pulso.revopslatam.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white transition-all hover:scale-[1.03] text-[14px]"
                  style={{ background: GRADIENT }}
                >
                  Hacer el Pulso Comercial
                  <ArrowRight size={16} />
                </a>
              </div>
            </StepWrapper>
          )}
        </AnimatePresence>

        {/* Navigation */}
        {step < 4 && (
          <div className="flex items-center justify-between mt-5">
            {step > 0 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1 text-[13px] font-medium transition-colors active:scale-95"
                style={{ color: "#9CA3AF" }}
              >
                <ArrowLeft size={14} /> Atrás
              </button>
            ) : <div />}
            <button
              onClick={next}
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-white transition-all hover:scale-[1.03] active:scale-[0.98] disabled:opacity-50 text-[14px]"
              style={{ background: GRADIENT }}
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : step === 3 ? "Enviar" : "Siguiente"}
              {!submitting && <ArrowRight size={14} />}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const GRADIENT = "linear-gradient(90deg, #BE1869, #6224BE)";
}
