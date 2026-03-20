import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const HUBSPOT_API = "https://api.hubapi.com";

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

    const { email, properties, createIfNotExists } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ success: false, error: "email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

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
        body: JSON.stringify({ properties: properties || {} }),
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
        body: JSON.stringify({ properties: { email, ...(properties || {}) } }),
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
