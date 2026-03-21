import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const HUBSPOT_API = "https://api.hubapi.com";

/* ─── Normalize free-text rubro to HubSpot allowed options ─── */
const VALID_RUBROS = [
  "SaaS B2B", "Servicios B2C", "Servicios B2B", "Venta de productos B2B",
  "Educación Superior", "Inmobiliaria", "Broker Inmobiliario",
  "Retail", "E-commerce", "Salud", "Colegios", "Otros",
];

function normalizeRubro(raw: string): string {
  if (!raw) return "";
  const lower = raw.toLowerCase().trim();
  // Direct match first
  const exact = VALID_RUBROS.find((v) => v.toLowerCase() === lower);
  if (exact) return exact;
  // Keyword matching
  if (lower.includes("saas")) return "SaaS B2B";
  if (lower.includes("software")) return "SaaS B2B";
  if (lower.includes("inmobiliaria") || lower.includes("constructora") || lower.includes("construcción") || lower.includes("construccion") || lower.includes("desarrolladora")) return "Inmobiliaria";
  if (lower.includes("broker") || lower.includes("corretaje") || lower.includes("corredora")) return "Broker Inmobiliario";
  if (lower.includes("retail") || lower.includes("tienda")) return "Retail";
  if (lower.includes("e-commerce") || lower.includes("ecommerce") || lower.includes("comercio electr")) return "E-commerce";
  if (lower.includes("salud") || lower.includes("clínica") || lower.includes("hospital") || lower.includes("médic")) return "Salud";
  if (lower.includes("colegio") || lower.includes("escuela")) return "Colegios";
  if (lower.includes("educación") || lower.includes("educacion") || lower.includes("universidad") || lower.includes("instituto")) return "Educación Superior";
  if (lower.includes("servicio")) {
    if (lower.includes("b2c")) return "Servicios B2C";
    return "Servicios B2B";
  }
  if (lower.includes("producto") || lower.includes("manufactura") || lower.includes("industrial")) return "Venta de productos B2B";
  return "Otros";
}

/* ─── Normalize cantidad de vendedores to HubSpot allowed options (uses en-dash –) ─── */
function normalizeVendedores(raw: string): string {
  if (!raw) return "";
  const lower = raw.toLowerCase().trim();
  if (lower.includes("solo") || lower.includes("dueño")) return "Solo el dueño vende";
  if (lower.includes("1 vendedor") || lower === "1") return "1 vendedor";
  if (lower.includes("2") && lower.includes("3")) return "2–3 vendedores";
  if (lower.includes("4") || lower.includes("10 vend") || (lower.includes("5") && !lower.includes("10+"))) return "4–10 vendedores";
  if (lower.includes("10+") || lower.includes("más de 10") || lower.includes("mas de 10")) return "10+ vendedores";
  return raw;
}

/* ─── Attribution source mapping ─── */
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
  const props: Record<string, string> = {};

  // Only set hs_facebook_click_id — it's writable
  if (attr.fbclid) props.hs_facebook_click_id = attr.fbclid;

  // NOTE: hs_analytics_source*, hs_latest_source*, hs_analytics_first_referrer
  // are READ-ONLY in HubSpot and cannot be set via API.
  // utm_source_original, utm_medium_original, utm_campaign_original, utm_content_original
  // do NOT exist as properties in this HubSpot portal.
  // Attribution is handled by HubSpot automatically via form submissions with pageUri/hutk.

  return props;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const HUBSPOT_API_KEY = Deno.env.get("HUBSPOT_API_KEY");
    if (!HUBSPOT_API_KEY) {
      console.error("[update-contact] HUBSPOT_API_KEY not configured");
      return new Response(
        JSON.stringify({ success: false, error: "HUBSPOT_API_KEY not configured" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { email, properties, createIfNotExists, attribution } = body;

    console.log("[update-contact] called with:", JSON.stringify({
      email,
      properties,
      createIfNotExists,
      hasAttribution: !!attribution,
    }));

    if (!email) {
      return new Response(
        JSON.stringify({ success: false, error: "email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Merge attribution properties with user-provided properties
    const attrProps = attribution ? buildAttributionProperties(attribution as Attribution) : {};
    // Normalize rubro and cantidad_de_vendedores before sending to HubSpot
    if (properties?.rubro) properties.rubro = normalizeRubro(properties.rubro);
    if (properties?.cantidad_de_vendedores) properties.cantidad_de_vendedores = normalizeVendedores(properties.cantidad_de_vendedores);
    const mergedProperties = { ...attrProps, ...(properties || {}) };

    console.log("[update-contact] merged properties to send:", JSON.stringify(mergedProperties));

    const headers = {
      Authorization: `Bearer ${HUBSPOT_API_KEY}`,
      "Content-Type": "application/json",
    };

    // 1. Search contact by email
    const searchRes = await fetch(`${HUBSPOT_API}/crm/v3/objects/contacts/search`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        filterGroups: [{
          filters: [{ propertyName: "email", operator: "EQ", value: email }],
        }],
      }),
    });

    if (!searchRes.ok) {
      const errText = await searchRes.text();
      console.error(`[update-contact] HubSpot search failed [${searchRes.status}]:`, errText);
      return new Response(
        JSON.stringify({ success: false, error: `Search failed: ${errText}` }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const searchData = await searchRes.json();
    const existingContact = searchData.results?.[0];
    console.log("[update-contact] search result:", { found: !!existingContact, contactId: existingContact?.id || null });

    // 2. Contact exists → update
    if (existingContact) {
      const contactId = existingContact.id;
      const updateRes = await fetch(`${HUBSPOT_API}/crm/v3/objects/contacts/${contactId}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ properties: mergedProperties }),
      });

      if (!updateRes.ok) {
        const errText = await updateRes.text();
        console.error(`[update-contact] HubSpot update failed [${updateRes.status}]:`, errText);
        return new Response(
          JSON.stringify({ success: false, error: `Update failed: ${errText}` }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log("[update-contact] updated contact:", contactId);
      return new Response(
        JSON.stringify({ success: true, contactId, created: false }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Contact doesn't exist + createIfNotExists
    if (createIfNotExists) {
      const createRes = await fetch(`${HUBSPOT_API}/crm/v3/objects/contacts`, {
        method: "POST",
        headers,
        body: JSON.stringify({ properties: { email, ...mergedProperties } }),
      });

      if (!createRes.ok) {
        const errText = await createRes.text();
        console.error(`[update-contact] HubSpot create failed [${createRes.status}]:`, errText);
        return new Response(
          JSON.stringify({ success: false, error: `Create failed: ${errText}` }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const createData = await createRes.json();
      console.log("[update-contact] created contact:", createData.id);
      return new Response(
        JSON.stringify({ success: true, contactId: createData.id, created: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 4. Contact doesn't exist + createIfNotExists = false
    console.log("[update-contact] contact not found, createIfNotExists=false — skipping");
    return new Response(
      JSON.stringify({ success: false, contactId: null }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[update-contact] error:", error);
    return new Response(
      JSON.stringify({ success: false, error: String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
