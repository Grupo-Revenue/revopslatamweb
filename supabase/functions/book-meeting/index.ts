import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/* ─── Google Auth helpers ─── */
function base64url(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function getGoogleAccessToken(serviceAccountJson: string): Promise<string> {
  const sa = JSON.parse(serviceAccountJson);
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(new TextEncoder().encode(JSON.stringify({ alg: "RS256", typ: "JWT" })));
  const claim = base64url(new TextEncoder().encode(JSON.stringify({
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/calendar",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  })));

  // Import private key
  const pemBody = sa.private_key
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s/g, "");
  const keyBuf = Uint8Array.from(atob(pemBody), (c) => c.charCodeAt(0));
  const key = await crypto.subtle.importKey(
    "pkcs8", keyBuf, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]
  );

  const sig = base64url(await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(`${header}.${claim}`)));
  const jwt = `${header}.${claim}.${sig}`;

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
  });

  if (!tokenRes.ok) {
    const err = await tokenRes.text();
    throw new Error(`Google token error [${tokenRes.status}]: ${err}`);
  }
  const { access_token } = await tokenRes.json();
  return access_token;
}

/* ─── Main handler ─── */
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    const GOOGLE_SA_JSON = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_JSON");
    const FEBE_CALENDAR_ID = Deno.env.get("FEBE_CALENDAR_ID");
    const HUBSPOT_API_KEY = Deno.env.get("HUBSPOT_API_KEY");
    const SLACK_WEBHOOK_URL = Deno.env.get("SLACK_WEBHOOK_URL");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY not configured");
    if (!GOOGLE_SA_JSON) throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON not configured");
    if (!FEBE_CALENDAR_ID) throw new Error("FEBE_CALENDAR_ID not configured");
    if (!HUBSPOT_API_KEY) throw new Error("HUBSPOT_API_KEY not configured");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error("Supabase env vars not configured");

    const {
      name, email, context, summary, availability_preference,
      conversation_id,
      utm_source, utm_medium, utm_campaign, utm_content,
    } = await req.json();

    if (!name || !email || !availability_preference) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    /* ── PASO 1: Interpretar disponibilidad con Claude ── */
    const today = new Date();
    const dayNames = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
    const todayStr = today.toISOString().split("T")[0];
    const dayOfWeek = dayNames[today.getDay()];

    const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 150,
        messages: [{
          role: "user",
          content: `El visitante dijo que prefiere: "${availability_preference}". Hoy es ${todayStr}, día ${dayOfWeek}. Horario de trabajo: lunes a viernes, 9:00 a 18:00, zona horaria America/Santiago. Genera el próximo slot disponible que mejor coincida. Responde SOLO con este JSON sin texto adicional: {"date": "YYYY-MM-DD", "startTime": "HH:MM", "endTime": "HH:MM", "display_date": "lunes 24 de marzo", "display_time": "10:00"}`,
        }],
      }),
    });

    if (!claudeRes.ok) {
      const err = await claudeRes.text();
      throw new Error(`Claude slot interpretation error [${claudeRes.status}]: ${err}`);
    }

    const claudeData = await claudeRes.json();
    const rawSlot = claudeData.content?.[0]?.text || "";
    let slot: { date: string; startTime: string; endTime: string; display_date: string; display_time: string };
    try {
      // Extract JSON from response (handle potential wrapping)
      const jsonMatch = rawSlot.match(/\{[\s\S]*\}/);
      slot = JSON.parse(jsonMatch ? jsonMatch[0] : rawSlot);
    } catch {
      throw new Error(`Failed to parse slot JSON: ${rawSlot}`);
    }

    // Default endTime to +30min if missing
    if (!slot.endTime) {
      const [h, m] = slot.startTime.split(":").map(Number);
      const end = new Date(2000, 0, 1, h, m + 30);
      slot.endTime = `${String(end.getHours()).padStart(2, "0")}:${String(end.getMinutes()).padStart(2, "0")}`;
    }

    /* ── PASO 2: Verificar disponibilidad en Google Calendar ── */
    const googleToken = await getGoogleAccessToken(GOOGLE_SA_JSON);

    const startDT = `${slot.date}T${slot.startTime}:00`;
    const endDT = `${slot.date}T${slot.endTime}:00`;

    // Check for conflicts
    const busyRes = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(FEBE_CALENDAR_ID)}/events?` +
      `timeMin=${startDT}-03:00&timeMax=${endDT}-03:00&singleEvents=true&orderBy=startTime`,
      { headers: { Authorization: `Bearer ${googleToken}` } }
    );

    if (!busyRes.ok) {
      const err = await busyRes.text();
      throw new Error(`Google Calendar freebusy error [${busyRes.status}]: ${err}`);
    }

    const busyData = await busyRes.json();
    let finalStart = startDT;
    let finalEnd = endDT;
    let finalDisplayDate = slot.display_date;
    let finalDisplayTime = slot.display_time;

    if (busyData.items && busyData.items.length > 0) {
      // Conflict found — try to find next free 30-min slot same day 9-18
      const [h] = slot.startTime.split(":").map(Number);
      let found = false;
      for (let tryH = h + 1; tryH <= 17; tryH++) {
        const tryStart = `${slot.date}T${String(tryH).padStart(2, "0")}:00:00`;
        const tryEnd = `${slot.date}T${String(tryH).padStart(2, "0")}:30:00`;
        const checkRes = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(FEBE_CALENDAR_ID)}/events?` +
          `timeMin=${tryStart}-03:00&timeMax=${tryEnd}-03:00&singleEvents=true`,
          { headers: { Authorization: `Bearer ${googleToken}` } }
        );
        const checkData = await checkRes.json();
        if (!checkData.items || checkData.items.length === 0) {
          finalStart = tryStart;
          finalEnd = tryEnd;
          finalDisplayTime = `${String(tryH).padStart(2, "0")}:00`;
          found = true;
          break;
        }
      }
      if (!found) {
        // Try next business day at 9:00
        const nextDay = new Date(slot.date);
        do {
          nextDay.setDate(nextDay.getDate() + 1);
        } while (nextDay.getDay() === 0 || nextDay.getDay() === 6);
        const nextDateStr = nextDay.toISOString().split("T")[0];
        const nextDayName = dayNames[nextDay.getDay()];
        const dayNum = nextDay.getDate();
        const monthNames = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
        finalStart = `${nextDateStr}T09:00:00`;
        finalEnd = `${nextDateStr}T09:30:00`;
        finalDisplayDate = `${nextDayName} ${dayNum} de ${monthNames[nextDay.getMonth()]}`;
        finalDisplayTime = "09:00";
      }
    }

    /* ── PASO 3: Crear evento en Google Calendar ── */
    const eventBody = {
      summary: `Conversación RevOps LATAM — ${name}`,
      description: `Contexto: ${context}\nResumen IA: ${summary || "Sin resumen"}`,
      start: { dateTime: `${finalStart}`, timeZone: "America/Santiago" },
      end: { dateTime: `${finalEnd}`, timeZone: "America/Santiago" },
      attendees: [
        { email },
        { email: FEBE_CALENDAR_ID },
      ],
      sendUpdates: "all",
    };

    const createRes = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(FEBE_CALENDAR_ID)}/events?sendUpdates=all`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${googleToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventBody),
      }
    );

    if (!createRes.ok) {
      const err = await createRes.text();
      console.error(`Google Calendar create error [${createRes.status}]:`, err);
      // Don't throw — continue with HubSpot + Slack even if calendar fails
    }

    /* ── PASO 4: Crear contacto en HubSpot con atribución ── */
    const nameParts = name.trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const hubspotProps = {
      email,
      firstname: firstName,
      lastname: lastName,
      hs_lead_status: "NEW",
      hs_analytics_source: "PAID_SOCIAL",
      hs_latest_source: "PAID_SOCIAL",
      hs_latest_source_data_1: "META Ads",
      hs_latest_source_data_2: utm_campaign || "",
      hs_content_membership_notes: summary || "",
    };

    let contactId: string | null = null;

    try {
      const createContactRes = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HUBSPOT_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ properties: hubspotProps }),
      });

      if (createContactRes.status === 409) {
        // Contact exists — get ID from error and update
        const errData = await createContactRes.json();
        const existingId = errData?.message?.match(/Existing ID: (\d+)/)?.[1];
        if (existingId) {
          contactId = existingId;
          await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${existingId}`, {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${HUBSPOT_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ properties: hubspotProps }),
          });
        }
      } else if (createContactRes.ok) {
        const contactData = await createContactRes.json();
        contactId = contactData.id;
      } else {
        const err = await createContactRes.text();
        console.error(`HubSpot create contact error [${createContactRes.status}]:`, err);
      }
    } catch (e) {
      console.error("HubSpot contact error:", e);
    }

    // Create note associated to contact
    if (contactId) {
      try {
        const noteBody = `🤖 Conversación con agente IA RevOps LATAM\n\nContexto: ${context}\nFuente: META Ads — ${utm_content || "directo"}\nPreferencia horario: ${availability_preference}\nReunión agendada: ${finalDisplayDate} ${finalDisplayTime}\n\nResumen IA:\n${summary || "Sin resumen"}`;

        const noteRes = await fetch("https://api.hubapi.com/crm/v3/objects/notes", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${HUBSPOT_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            properties: {
              hs_note_body: noteBody,
              hs_timestamp: String(Date.now()),
            },
            associations: [{
              to: { id: contactId },
              types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 202 }],
            }],
          }),
        });

        if (!noteRes.ok) {
          const err = await noteRes.text();
          console.error(`HubSpot note error [${noteRes.status}]:`, err);
        }
      } catch (e) {
        console.error("HubSpot note error:", e);
      }
    }

    /* ── PASO 5: Notificar Slack ── */
    if (SLACK_WEBHOOK_URL) {
      try {
        await fetch(SLACK_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: `🎯 Nueva reunión agendada\n\nNombre: ${name} | Email: ${email}\nFecha: ${finalDisplayDate} a las ${finalDisplayTime}\nFuente: META Ads — ${utm_content || "directo"}\nContexto: ${context}\nResumen: ${summary || "Sin resumen"}`,
          }),
        });
      } catch (e) {
        console.error("Slack notification error:", e);
      }
    }

    /* ── PASO 6: Actualizar Supabase ── */
    if (conversation_id && SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
        await supabaseAdmin
          .from("conversations")
          .update({
            scheduled: true,
            scheduled_at: new Date().toISOString(),
            meeting_date: finalDisplayDate,
            meeting_time: finalDisplayTime,
          })
          .eq("id", conversation_id);
      } catch (e) {
        console.error("Supabase update error:", e);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        display_date: finalDisplayDate,
        display_time: finalDisplayTime,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("book-meeting error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
