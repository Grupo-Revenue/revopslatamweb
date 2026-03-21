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

async function getGoogleAccessToken(serviceAccountJson: string, impersonateEmail?: string): Promise<string> {
  const sa = JSON.parse(serviceAccountJson);
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(new TextEncoder().encode(JSON.stringify({ alg: "RS256", typ: "JWT" })));
  const claimPayload: Record<string, unknown> = {
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/calendar",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };
  // Impersonate the target user via Domain-Wide Delegation
  if (impersonateEmail) {
    claimPayload.sub = impersonateEmail;
  }
  const claim = base64url(new TextEncoder().encode(JSON.stringify(claimPayload)));

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

/* ─── Check availability using FreeBusy API ─── */
async function checkAvailability(
  googleToken: string,
  calendarId: string,
  startISO: string,
  endISO: string
): Promise<boolean> {
  const res = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${googleToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      timeMin: startISO,
      timeMax: endISO,
      timeZone: "America/Santiago",
      items: [{ id: calendarId }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`FreeBusy error [${res.status}]:`, err);
    // If FreeBusy fails, assume available and proceed
    return true;
  }

  const data = await res.json();
  const busy = data.calendars?.[calendarId]?.busy || [];
  return busy.length === 0;
}

/* ─── Attribution source mapping (same logic as update-contact) ─── */
interface Attribution {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid?: string;
  full_url?: string;
  referrer?: string;
}

function buildAttributionProperties(attr: Attribution): Record<string, string> {
  const src = (attr.utm_source || "").toLowerCase();
  const fbclid = attr.fbclid || "";
  const campaign = attr.utm_campaign || "";
  const props: Record<string, string> = {};

  if (src === "meta" || src === "facebook" || src === "instagram" || fbclid) {
    props.hs_analytics_source = "PAID_SOCIAL";
    props.hs_analytics_source_data_1 = "META Ads";
    props.hs_analytics_source_data_2 = campaign;
    props.hs_latest_source = "PAID_SOCIAL";
    props.hs_latest_source_data_1 = "META Ads";
    props.hs_latest_source_data_2 = campaign;
  } else if (src === "google" || src === "cpc") {
    props.hs_analytics_source = "PAID_SEARCH";
    props.hs_analytics_source_data_1 = "Google Ads";
    props.hs_analytics_source_data_2 = campaign;
    props.hs_latest_source = "PAID_SEARCH";
    props.hs_latest_source_data_1 = "Google Ads";
    props.hs_latest_source_data_2 = campaign;
  } else if (src === "linkedin") {
    props.hs_analytics_source = "PAID_SOCIAL";
    props.hs_analytics_source_data_1 = "LinkedIn Ads";
    props.hs_analytics_source_data_2 = campaign;
    props.hs_latest_source = "PAID_SOCIAL";
    props.hs_latest_source_data_1 = "LinkedIn Ads";
    props.hs_latest_source_data_2 = campaign;
  } else if (src === "email" || src === "newsletter") {
    props.hs_analytics_source = "EMAIL_MARKETING";
    props.hs_analytics_source_data_1 = campaign;
    props.hs_latest_source = "EMAIL_MARKETING";
    props.hs_latest_source_data_1 = campaign;
  } else if (!src && attr.referrer) {
    props.hs_analytics_source = "ORGANIC_SEARCH";
    props.hs_latest_source = "ORGANIC_SEARCH";
  } else if (!src) {
    props.hs_analytics_source = "DIRECT_TRAFFIC";
    props.hs_latest_source = "DIRECT_TRAFFIC";
  }

  if (attr.full_url) props.hs_analytics_first_url = attr.full_url;
  if (attr.referrer) props.hs_analytics_first_referrer = attr.referrer;
  if (fbclid) props.hs_facebook_click_id = fbclid;
  if (attr.utm_source) props.utm_source_original = attr.utm_source;
  if (attr.utm_medium) props.utm_medium_original = attr.utm_medium;
  if (campaign) props.utm_campaign_original = campaign;
  if (attr.utm_content) props.utm_content_original = attr.utm_content;

  return props;
}

/* ─── Main handler ─── */
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    const GOOGLE_SA_JSON = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_JSON");
    const FEBE_CALENDAR_ID = Deno.env.get("FEBE_CALENDAR_ID"); // febe's email
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
      selected_slot, conversation_id, score, flag, nurturing_only,
      utm_source, utm_medium, utm_campaign, utm_content,
      conversation_messages, answers_buffer, attribution,
    } = await req.json();

    // Build attribution properties from the attribution object
    const attrProps = attribution ? buildAttributionProperties(attribution as Attribution) : {};
    const utmContentValue = attribution?.utm_content || utm_content || "";

    // Format conversation transcript for HubSpot notes
    const formatTranscript = (msgs: { role: string; text: string }[] | undefined): string => {
      if (!msgs || msgs.length === 0) return "Sin conversación registrada";
      return msgs.map((m) => {
        const speaker = m.role === "ai" ? "Lidia" : "Visitante";
        return `${speaker}: ${m.text}`;
      }).join("\n");
    };
    const transcript = formatTranscript(conversation_messages);

    // Use answers_buffer for jobtitle instead of extracting from first message
    const jobTitle = answers_buffer?.nivel_del_cargo || "";

    if (!email) {
      return new Response(JSON.stringify({ error: "Missing email" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    /* ── NURTURING ONLY: no calendar, HubSpot UNQUALIFIED ── */
    if (nurturing_only) {
      // Create HubSpot contact with UNQUALIFIED status + attribution + answers_buffer
      const hubspotNurturingProps: Record<string, string> = {
        email,
        jobtitle: jobTitle,
        hs_lead_status: "OPEN",
        hs_content_membership_notes: `Score: ${score || 0} | Flag: no_calificado\n${summary || ""}`,
        ...attrProps,
        ...(answers_buffer?.company ? { company: answers_buffer.company } : {}),
        ...(answers_buffer?.rubro ? { rubro: answers_buffer.rubro } : {}),
        ...(answers_buffer?.cantidad_de_vendedores ? { cantidad_de_vendedores: answers_buffer.cantidad_de_vendedores } : {}),
        ...(answers_buffer?.cuenta_con_crm ? { cuenta_con_crm: answers_buffer.cuenta_con_crm } : {}),
      };

      try {
        const createRes = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
          method: "POST",
          headers: { Authorization: `Bearer ${HUBSPOT_API_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({ properties: hubspotNurturingProps }),
        });
        let nurturingContactId: string | null = null;
        if (createRes.status === 409) {
          const errData = await createRes.json();
          const existingId = errData?.message?.match(/Existing ID: (\d+)/)?.[1];
          if (existingId) {
            nurturingContactId = existingId;
            await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${existingId}`, {
              method: "PATCH",
              headers: { Authorization: `Bearer ${HUBSPOT_API_KEY}`, "Content-Type": "application/json" },
              body: JSON.stringify({ properties: hubspotNurturingProps }),
            });
          }
        } else if (createRes.ok) {
          const contactData = await createRes.json();
          nurturingContactId = contactData.id;
        } else {
          const err = await createRes.text();
          console.error(`HubSpot nurturing create error [${createRes.status}]:`, err);
        }

        // Create note with full conversation transcript for nurturing contact
        if (nurturingContactId) {
          const noteBody = `🤖 Conversación con agente IA RevOps LATAM\n\nContexto: ${context}\nFuente: ${attrProps.hs_analytics_source_data_1 || "Directo"} — ${utmContentValue || "directo"}\nScore: ${score || 0} | Flag: no_calificado\n\nResumen IA:\n${summary || "Sin resumen"}\n\n──────────────────\n📝 CONVERSACIÓN COMPLETA:\n──────────────────\n${transcript}`;
          const noteRes = await fetch("https://api.hubapi.com/crm/v3/objects/notes", {
            method: "POST",
            headers: { Authorization: `Bearer ${HUBSPOT_API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              properties: { hs_note_body: noteBody, hs_timestamp: String(Date.now()) },
              associations: [{ to: { id: nurturingContactId }, types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 202 }] }],
            }),
          });
          if (!noteRes.ok) console.error(`HubSpot nurturing note error [${noteRes.status}]:`, await noteRes.text());
        }
      } catch (e) {
        console.error("HubSpot nurturing error:", e);
      }

      // Notify Slack
      if (SLACK_WEBHOOK_URL) {
        try {
          await fetch(SLACK_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text: `📋 Lead no calificado (nurturing)\nEmail: ${email}\nScore: ${score || 0}\nFuente: ${attrProps.hs_analytics_source_data_1 || "Directo"} — ${utmContentValue || "directo"}\nResumen: ${summary || "Sin resumen"}`,
            }),
          });
        } catch (e) {
          console.error("Slack nurturing error:", e);
        }
      }

      // Update Supabase conversation
      if (conversation_id && SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
        try {
          const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
          await supabaseAdmin.from("conversations").update({ scheduled: false }).eq("id", conversation_id);
        } catch (e) {
          console.error("Supabase nurturing update error:", e);
        }
      }

      return new Response(
        JSON.stringify({ success: true, nurturing: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!name || !availability_preference) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    /* ── PASO 1: Determine the meeting slot ── */
    let finalStart: string;
    let finalEnd: string;
    let finalDisplayDate: string;
    let finalDisplayTime: string;

    // Impersonate Febe to create event directly on her calendar
    const googleToken = await getGoogleAccessToken(GOOGLE_SA_JSON, FEBE_CALENDAR_ID);
    if (selected_slot) {
      // Use the pre-selected slot from the availability picker
      finalStart = `${selected_slot.date}T${selected_slot.startTime}:00`;
      finalEnd = `${selected_slot.date}T${selected_slot.endTime}:00`;
      finalDisplayDate = selected_slot.display_date;
      finalDisplayTime = selected_slot.display_time;
    } else {
      // Fallback: interpret with Claude (legacy path)
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
        const jsonMatch = rawSlot.match(/\{[\s\S]*\}/);
        slot = JSON.parse(jsonMatch ? jsonMatch[0] : rawSlot);
      } catch {
        throw new Error(`Failed to parse slot JSON: ${rawSlot}`);
      }

      if (!slot.endTime) {
        const [h, m] = slot.startTime.split(":").map(Number);
        const end = new Date(2000, 0, 1, h, m + 45);
        slot.endTime = `${String(end.getHours()).padStart(2, "0")}:${String(end.getMinutes()).padStart(2, "0")}`;
      }

      finalStart = `${slot.date}T${slot.startTime}:00`;
      finalEnd = `${slot.date}T${slot.endTime}:00`;
      finalDisplayDate = slot.display_date;
      finalDisplayTime = slot.display_time;

      // Check availability
      const startISO = `${finalStart}-03:00`;
      const endISO = `${finalEnd}-03:00`;
      const isAvailable = await checkAvailability(googleToken, FEBE_CALENDAR_ID, startISO, endISO);

      if (!isAvailable) {
        const [h] = slot.startTime.split(":").map(Number);
        let found = false;
        for (let tryH = h + 1; tryH <= 17; tryH++) {
          const tryStart = `${slot.date}T${String(tryH).padStart(2, "0")}:00:00`;
          const tryEnd = `${slot.date}T${String(tryH).padStart(2, "0")}:30:00`;
          const tryAvailable = await checkAvailability(
            googleToken, FEBE_CALENDAR_ID,
            `${tryStart}-03:00`, `${tryEnd}-03:00`
          );
          if (tryAvailable) {
            finalStart = tryStart;
            finalEnd = tryEnd;
            finalDisplayTime = `${String(tryH).padStart(2, "0")}:00`;
            found = true;
            break;
          }
        }
        if (!found) {
          const nextDay = new Date(slot.date);
          do { nextDay.setDate(nextDay.getDate() + 1); } while (nextDay.getDay() === 0 || nextDay.getDay() === 6);
          const nextDateStr = nextDay.toISOString().split("T")[0];
          const nextDayName = dayNames[nextDay.getDay()];
          const monthNames = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
          finalStart = `${nextDateStr}T09:00:00`;
          finalEnd = `${nextDateStr}T09:30:00`;
          finalDisplayDate = `${nextDayName} ${nextDay.getDate()} de ${monthNames[nextDay.getMonth()]}`;
          finalDisplayTime = "09:00";
        }
      }
    }

    /* ── PASO 2: Crear evento en calendario ── */
    const eventBody = {
      summary: `Conversación RevOps LATAM — ${name}`,
      description: `Contexto: ${context}\nResumen IA: ${summary || "Sin resumen"}`,
      start: { dateTime: finalStart, timeZone: "America/Santiago" },
      end: { dateTime: finalEnd, timeZone: "America/Santiago" },
      attendees: [
        { email },
      ],
      sendUpdates: "all",
    };

    // Create on Febe's calendar via impersonation
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
    }

    /* ── PASO 4: Crear contacto en HubSpot con atribución ── */
    const nameParts = name.trim().split(/\s+/);
    const firstName = answers_buffer?.firstname || nameParts[0] || "";
    const lastName = answers_buffer?.lastname || nameParts.slice(1).join(" ") || "";

    const hubspotLeadStatus = flag === "tibio" ? "OPEN" : "Agendado";
    const hubspotProps: Record<string, string> = {
      email,
      firstname: firstName,
      lastname: lastName,
      jobtitle: jobTitle,
      hs_lead_status: hubspotLeadStatus,
      hs_content_membership_notes: `Score: ${score || "N/A"} | Flag: ${flag || "N/A"}\n${summary || ""}`,
      ...attrProps,
      ...(answers_buffer?.company ? { company: answers_buffer.company } : {}),
      ...(answers_buffer?.rubro ? { rubro: answers_buffer.rubro } : {}),
      ...(answers_buffer?.cantidad_de_vendedores ? { cantidad_de_vendedores: answers_buffer.cantidad_de_vendedores } : {}),
      ...(answers_buffer?.cuenta_con_crm ? { cuenta_con_crm: answers_buffer.cuenta_con_crm } : {}),
      ...(answers_buffer?.lead_score_ia ? { lead_score_ia: answers_buffer.lead_score_ia } : {}),
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
        const noteBody = `🤖 Conversación con agente IA RevOps LATAM\n\nContexto: ${context}\nFuente: ${attrProps.hs_analytics_source_data_1 || "Directo"} — ${utmContentValue || "directo"}\nPreferencia horario: ${availability_preference}\nReunión agendada: ${finalDisplayDate} ${finalDisplayTime}\n\nResumen IA:\n${summary || "Sin resumen"}\n\n──────────────────\n📝 CONVERSACIÓN COMPLETA:\n──────────────────\n${transcript}`;

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
            text: `🎯 Nueva reunión agendada\n\nNombre: ${name} | Email: ${email}\nFecha: ${finalDisplayDate} a las ${finalDisplayTime}\nFuente: ${attrProps.hs_analytics_source_data_1 || "Directo"} — ${utmContentValue || "directo"}\nContexto: ${context}\nResumen: ${summary || "Sin resumen"}`,
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
