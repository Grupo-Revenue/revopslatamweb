import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const HUBSPOT_API = "https://api.hubapi.com";

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
  const src = (attr.utm_source || "").toLowerCase();
  const fbclid = attr.fbclid || "";
  const campaign = attr.utm_campaign || "";
  const props: Record<string, string> = {};

  // Determine source category
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

  // First URL — critical for HubSpot
  if (attr.full_url) {
    props.hs_analytics_first_url = attr.full_url;
  }

  // First referrer
  if (attr.referrer) {
    props.hs_analytics_first_referrer = attr.referrer;
  }

  // fbclid — critical for CAPI META
  if (fbclid) {
    props.hs_facebook_click_id = fbclid;
  }

  // UTM originals for reference
  if (attr.utm_source) props.utm_source_original = attr.utm_source;
  if (attr.utm_medium) props.utm_medium_original = attr.utm_medium;
  if (campaign) props.utm_campaign_original = campaign;
  if (attr.utm_content) props.utm_content_original = attr.utm_content;

  return props;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const HUBSPOT_API_KEY = Deno.env.get("HUBSPOT_API_KEY");
    if (!HUBSPOT_API_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: "HUBSPOT_API_KEY not configured" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { email, properties, createIfNotExists, attribution } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ success: false, error: "email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Merge attribution properties with user-provided properties
    const attrProps = attribution ? buildAttributionProperties(attribution as Attribution) : {};
    const mergedProperties = { ...attrProps, ...(properties || {}) };

    const headers = {
      Authorization: `Bearer ${HUBSPOT_API_KEY}`,
      "Content-Type": "application/json",
    };

    // 1. Search contact by email
    const searchRes = await fetch(`${HUBSPOT_API}/crm/v3/objects/contacts/search`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        filterGroups: [
          {
            filters: [
              { propertyName: "email", operator: "EQ", value: email },
            ],
          },
        ],
      }),
    });

    if (!searchRes.ok) {
      const errText = await searchRes.text();
      console.error(`HubSpot search failed [${searchRes.status}]:`, errText);
      return new Response(
        JSON.stringify({ success: false, error: `Search failed: ${errText}` }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const searchData = await searchRes.json();
    const existingContact = searchData.results?.[0];

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
        console.error(`HubSpot update failed [${updateRes.status}]:`, errText);
        return new Response(
          JSON.stringify({ success: false, error: `Update failed: ${errText}` }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

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
        console.error(`HubSpot create failed [${createRes.status}]:`, errText);
        return new Response(
          JSON.stringify({ success: false, error: `Create failed: ${errText}` }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const createData = await createRes.json();
      return new Response(
        JSON.stringify({ success: true, contactId: createData.id, created: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 4. Contact doesn't exist + createIfNotExists = false
    return new Response(
      JSON.stringify({ success: false, contactId: null }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("update-contact error:", error);
    return new Response(
      JSON.stringify({ success: false, error: String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
