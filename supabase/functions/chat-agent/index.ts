import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Eres el asistente de RevOps LATAM, consultora chilena con 14 años de experiencia y HubSpot Platinum Partner. Tu trabajo tiene dos fases:

FASE 1 — DIAGNÓSTICO (turns 1-3):
Haces exactamente 3 preguntas para entender la situación comercial del visitante. Respondes con máximo 2 líneas antes de cada pregunta. Directo, sin floreos, como colega chileno senior.

FASE 2 — DISPONIBILIDAD (turn 4):
Cuando es el turn 4, NO hagas más preguntas de diagnóstico. En cambio responde con: "Entendido. Creo que vale la pena que conversemos. ¿Qué día y hora te acomoda? Puedes decirme algo como 'el martes por la mañana' o 'esta semana en la tarde'."

Cuando recibas la respuesta de disponibilidad del visitante (turn 5), genera un resumen de 3 líneas con: (1) situación del visitante, (2) tamaño del equipo si lo mencionó, (3) preferencia de horario expresada. Sé conciso.

NUNCA menciones que eres IA. NUNCA vendas, solo diagnostica.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY is not configured");
    }

    const { messages, context, turn } = await req.json();

    if (!Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "messages must be an array" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build context-aware system prompt
    const contextDetail =
      context === "hubspot"
        ? "El visitante probablemente ya usa o conoce HubSpot. Enfoca las preguntas en cómo lo están usando, qué problemas tienen con la adopción o configuración, y si están sacando provecho de los datos."
        : "El visitante probablemente tiene problemas con su proceso comercial: leads que se pierden, falta de visibilidad del pipeline, o equipos desalineados. Enfoca las preguntas en entender su operación actual.";

    const fullSystemPrompt = `${SYSTEM_PROMPT}\n\nContexto del visitante: ${contextDetail}\n\nTurn actual: ${turn}`;

    // Ensure messages array is never empty — Anthropic requires at least one message
    const apiMessages = messages.length > 0
      ? messages
      : [{ role: "user", content: "Hola, acabo de llegar. Hazme tu primera pregunta de diagnóstico." }];

    // Call Anthropic API
    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 200,
        system: fullSystemPrompt,
        messages: apiMessages,
      }),
    });

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text();
      console.error(`Anthropic error [${anthropicRes.status}]:`, errText);

      if (anthropicRes.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded, please try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await anthropicRes.json();
    const reply = data.content?.[0]?.text || "";

    // Determine phase based on turn
    let phase: "conversation" | "availability" | "complete" = "conversation";
    let summary: string | undefined;

    if (turn >= 5) {
      phase = "complete";
      summary = reply; // Turn 5 response IS the summary
    } else if (turn === 4) {
      phase = "availability";
    }

    return new Response(
      JSON.stringify({ reply, phase, summary }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("chat-agent error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
