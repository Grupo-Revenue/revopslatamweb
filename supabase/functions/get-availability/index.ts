import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/* ─── Google Auth (same as book-meeting) ─── */
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
    scope: "https://www.googleapis.com/auth/calendar.readonly",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  })));

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

/* ─── Helpers ─── */
const DAY_NAMES = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const MONTH_NAMES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

interface Slot {
  date: string;       // YYYY-MM-DD
  startTime: string;  // HH:MM
  endTime: string;    // HH:MM
  display_date: string;
  display_time: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GOOGLE_SA_JSON = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_JSON");
    const FEBE_CALENDAR_ID = Deno.env.get("FEBE_CALENDAR_ID");

    if (!GOOGLE_SA_JSON) throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON not configured");
    if (!FEBE_CALENDAR_ID) throw new Error("FEBE_CALENDAR_ID not configured");

    const googleToken = await getGoogleAccessToken(GOOGLE_SA_JSON);

    // Look at next 5 business days
    const now = new Date();
    const businessDays: Date[] = [];
    const cursor = new Date(now);
    
    // If it's past 17:00 Chile time (UTC-3 or UTC-4), skip today
    // Use a simple heuristic: check UTC hour
    while (businessDays.length < 5) {
      cursor.setDate(cursor.getDate() + (businessDays.length === 0 && cursor.toDateString() === now.toDateString() ? 0 : 1));
      if (businessDays.length === 0 && cursor.toDateString() === now.toDateString()) {
        // First iteration — check if today is a weekday
        if (cursor.getDay() === 0 || cursor.getDay() === 6) {
          continue;
        }
        businessDays.push(new Date(cursor));
        continue;
      }
      if (cursor.getDay() !== 0 && cursor.getDay() !== 6) {
        businessDays.push(new Date(cursor));
      }
    }

    // Query FreeBusy for the full range
    const rangeStart = businessDays[0];
    const rangeEnd = new Date(businessDays[businessDays.length - 1]);
    rangeEnd.setDate(rangeEnd.getDate() + 1);

    const timeMin = `${rangeStart.toISOString().split("T")[0]}T09:00:00-03:00`;
    const timeMax = `${rangeEnd.toISOString().split("T")[0]}T18:00:00-03:00`;

    const freeBusyRes = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${googleToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        timeMin,
        timeMax,
        timeZone: "America/Santiago",
        items: [{ id: FEBE_CALENDAR_ID }],
      }),
    });

    let busyPeriods: { start: string; end: string }[] = [];
    if (freeBusyRes.ok) {
      const fbData = await freeBusyRes.json();
      busyPeriods = fbData.calendars?.[FEBE_CALENDAR_ID]?.busy || [];
    } else {
      console.error("FreeBusy error:", await freeBusyRes.text());
    }

    // Generate 30-min slots for each business day, 9:00-17:30
    const allSlots: Slot[] = [];
    
    for (const day of businessDays) {
      const dateStr = day.toISOString().split("T")[0];
      const dayName = DAY_NAMES[day.getDay()];
      const displayDate = `${dayName} ${day.getDate()} de ${MONTH_NAMES[day.getMonth()]}`;

      for (let hour = 9; hour <= 17; hour++) {
        for (const min of [0, 30]) {
          if (hour === 17 && min === 30) continue; // Don't start at 17:30
          
          const startTime = `${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
          const endMin = min + 30;
          const endHour = endMin >= 60 ? hour + 1 : hour;
          const endMinFinal = endMin >= 60 ? endMin - 60 : endMin;
          const endTime = `${String(endHour).padStart(2, "0")}:${String(endMinFinal).padStart(2, "0")}`;

          const slotStart = new Date(`${dateStr}T${startTime}:00-03:00`);
          const slotEnd = new Date(`${dateStr}T${endTime}:00-03:00`);

          // Skip slots in the past
          if (slotStart <= now) continue;

          // Check against busy periods
          const isBusy = busyPeriods.some(bp => {
            const bpStart = new Date(bp.start);
            const bpEnd = new Date(bp.end);
            return slotStart < bpEnd && slotEnd > bpStart;
          });

          if (!isBusy) {
            allSlots.push({
              date: dateStr,
              startTime,
              endTime,
              display_date: displayDate,
              display_time: startTime,
            });
          }
        }
      }
    }

    // Group by date for the frontend
    const grouped: Record<string, { display_date: string; slots: Slot[] }> = {};
    for (const slot of allSlots) {
      if (!grouped[slot.date]) {
        grouped[slot.date] = { display_date: slot.display_date, slots: [] };
      }
      grouped[slot.date].slots.push(slot);
    }

    return new Response(
      JSON.stringify({ availability: grouped }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("get-availability error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
