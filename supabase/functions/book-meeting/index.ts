import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/* ── helpers ── */

function getGoogleAuth() {
  const raw = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_JSON");
  if (!raw) throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON not configured");
  return JSON.parse(raw);
}

async function createJWT(sa: any): Promise<string> {
  const header = { alg: "RS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/calendar",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };

  const enc = (obj: any) =>
    btoa(JSON.stringify(obj))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

  const unsignedToken = `${enc(header)}.${enc(claim)}`;

  // Import the private key
  const pemContents = sa.private_key
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\n/g, "");
  const binaryDer = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0));

  const key = await crypto.subtle.importKey(
    "pkcs8",
    binaryDer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(unsignedToken)
  );

  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return `${unsignedToken}.${sigB64}`;
}

async function getAccessToken(sa: any): Promise<string> {
  const jwt = await createJWT(sa);
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Google token error: ${JSON.stringify(data)}`);
  return data.access_token;
}

/* ── interpret availability with Claude ── */
async function interpretAvailability(pref: string): Promise<{
  date: string;
  startTime: string;
  endTime: string;
  display_date: string;
  display_time: string;
}> {
  const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
  if (!ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY not configured");

  const now = new Date();
  const formatter = new Intl.DateTimeFormat("es-CL", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/Santiago",
  });
  const today = formatter.format(now);
  const isoToday = now.toISOString().split("T")[0];

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 200,
      messages: [
        {
          role: "user",
          content: `El visitante dijo que prefiere: "${pref}". Hoy es ${today} (${isoToday}). Horario de trabajo de Febe: lunes a viernes, 9:00 a 18:00, zona horaria America/Santiago. Genera el próximo slot disponible que mejor coincida con su preferencia. La reunión dura 30 minutos. Responde SOLO con este JSON sin ningún texto adicional: {"date": "YYYY-MM-DD", "startTime": "HH:MM", "endTime": "HH:MM", "display_date": "lunes 24 de marzo", "display_time": "10:00"}`,
        },
      ],
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(`Anthropic error: ${JSON.stringify(data)}`);

  const text = data.content?.[0]?.text || "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error(`Could not parse slot JSON from: ${text}`);
  return JSON.parse(jsonMatch[0]);
}

/* ── check availability on Google Calendar ── */
async function checkAvailability(
  accessToken: string,
  calendarId: string,
  date: string,
  startTime: string,
  endTime: string
): Promise<{ available: boolean; nextStart?: string; nextEnd?: string }> {
  const tz = "America/Santiago";
  const timeMin = `${date}T${startTime}:00`;
  const timeMax = `${date}T${endTime}:00`;

  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
    calendarId
  )}/events?timeMin=${encodeURIComponent(
    timeMin + "-04:00"
  )}&timeMax=${encodeURIComponent(
    timeMax + "-04:00"
  )}&singleEvents=true&orderBy=startTime&timeZone=${tz}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await res.json();
  if (!res.ok)
    throw new Error(`Calendar freebusy error: ${JSON.stringify(data)}`);

  const events = data.items || [];
  const busyEvents = events.filter(
    (e: any) => e.status !== "cancelled" && e.transparency !== "transparent"
  );

  if (busyEvents.length === 0) return { available: true };

  // Find next free 30-min slot in same day (9:00-17:30)
  const busySlots = busyEvents.map((e: any) => ({
    start: e.start.dateTime || e.start.date,
    end: e.end.dateTime || e.end.date,
  }));

  for (let hour = 9; hour <= 17; hour++) {
    for (const min of [0, 30]) {
      if (hour === 17 && min === 30) continue;
      const candidateStart = `${date}T${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}:00`;
      const candidateEndHour = min === 30 ? hour + 1 : hour;
      const candidateEndMin = min === 30 ? 0 : 30;
      const candidateEnd = `${date}T${String(candidateEndHour).padStart(2, "0")}:${String(candidateEndMin).padStart(2, "0")}:00`;

      const conflict = busySlots.some((b: any) => {
        const bStart = new Date(b.start).getTime();
        const bEnd = new Date(b.end).getTime();
        const cStart = new Date(candidateStart + "-04:00").getTime();
        const cEnd = new Date(candidateEnd + "-04:00").getTime();
        return cStart < bEnd && cEnd > bStart;
      });

      if (!conflict) {
        return {
          available: false,
          nextStart: `${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}`,
          nextEnd: `${String(candidateEndHour).padStart(2, "0")}:${String(candidateEndMin).padStart(2, "0")}`,
        };
      }
    }
  }

  return { available: false };
}

/* ── create Google Calendar event ── */
async function createCalendarEvent(
  accessToken: string,
  calendarId: string,
  params: {
    name: string;
    email: string;
    context: string;
    summary: string;
    date: string;
    startTime: string;
    endTime: string;
  }
) {
  const body = {
    summary: `Conversación RevOps LATAM — ${params.name}`,
    description: `Contexto: ${params.context}\nResumen IA: ${params.summary}`,
    start: {
      dateTime: `${params.date}T${params.startTime}:00`,
      timeZone: "America/Santiago",
    },
    end: {
      dateTime: `${params.date}T${params.endTime}:00`,
      timeZone: "America/Santiago",
    },
    attendees: [
      { email: params.email },
      { email: calendarId },
    ],
    sendUpdates: "all",
  };

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      calendarId
    )}/events?sendUpdates=all`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  const data = await res.json();
  if (!res.ok) throw new Error(`Calendar insert error: ${JSON.stringify(data)}`);
  return data;
}


/* ── Slack notification ── */
async function notifySlack(params: {
  name: string;
  email: string;
  context: string;
  summary: string;
  display_date: string;
  display_time: string;
}) {
  const SLACK_WEBHOOK_URL = Deno.env.get("SLACK_WEBHOOK_URL");
  if (!SLACK_WEBHOOK_URL) {
    console.warn("SLACK_WEBHOOK_URL not set, skipping Slack notification");
    return;
  }

  await fetch(SLACK_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: `🗓️ *Nueva reunión agendada*\n\n*Nombre:* ${params.name}\n*Email:* ${params.email}\n*Fecha:* ${params.display_date} ${params.display_time}\n*Contexto:* ${params.context}\n*Resumen:* ${params.summary}`,
    }),
  });
}

/* ════════════════════════════ MAIN ════════════════════════════ */

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, context, summary, availability_preference, conversation_id } =
      await req.json();

    if (!name || !email || !availability_preference) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const FEBE_CALENDAR_ID = Deno.env.get("FEBE_CALENDAR_ID");
    if (!FEBE_CALENDAR_ID) throw new Error("FEBE_CALENDAR_ID not configured");

    // Step 1: Interpret availability with Claude
    console.log("Step 1: Interpreting availability...");
    const slot = await interpretAvailability(availability_preference);
    console.log("Slot proposed:", slot);

    // Step 2: Get Google Calendar access token
    console.log("Step 2: Getting Google Calendar access...");
    const sa = getGoogleAuth();
    const accessToken = await getAccessToken(sa);

    // Step 3: Check availability and find free slot
    console.log("Step 3: Checking calendar availability...");
    const avail = await checkAvailability(
      accessToken,
      FEBE_CALENDAR_ID,
      slot.date,
      slot.startTime,
      slot.endTime
    );

    let finalStart = slot.startTime;
    let finalEnd = slot.endTime;
    let finalDisplayTime = slot.display_time;

    if (!avail.available && avail.nextStart && avail.nextEnd) {
      finalStart = avail.nextStart;
      finalEnd = avail.nextEnd;
      finalDisplayTime = avail.nextStart;
      console.log(`Slot busy, using next available: ${finalStart}-${finalEnd}`);
    } else if (!avail.available) {
      throw new Error("No available slots found for the requested day");
    }

    // Step 4: Create Google Calendar event
    console.log("Step 4: Creating calendar event...");
    await createCalendarEvent(accessToken, FEBE_CALENDAR_ID, {
      name,
      email,
      context: context || "diagnostico",
      summary: summary || "",
      date: slot.date,
      startTime: finalStart,
      endTime: finalEnd,
    });

    // Step 5: Notify Slack (non-blocking)
    console.log("Step 5: Notifying Slack...");

    notifySlack({
      name,
      email,
      context: context || "diagnostico",
      summary: summary || "",
      display_date: slot.display_date,
      display_time: finalDisplayTime,
    }).catch((e) => console.error("Slack error (non-blocking):", e));

    // Step 6: Update Supabase conversation
    if (conversation_id) {
      console.log("Step 6: Updating Supabase conversation...");
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      await supabase
        .from("conversations")
        .update({
          summary: `${summary || ""}\n\nContacto: ${name} - ${email}\nReunión: ${slot.display_date} ${finalDisplayTime}`,
          availability_preference,
        })
        .eq("id", conversation_id);
    }

    return new Response(
      JSON.stringify({
        success: true,
        display_date: slot.display_date,
        display_time: finalDisplayTime,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("book-meeting error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
