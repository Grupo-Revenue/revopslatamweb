import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { first_name, last_name, email, phone, job_title, company_name, industry, team_size, has_crm } = body;

    // HubSpot Forms API submission (portal ID & form GUID set via secrets)
    const portalId = Deno.env.get("HUBSPOT_PORTAL_ID");
    const formGuid = Deno.env.get("HUBSPOT_FORM_GUID");

    if (!portalId || !formGuid) {
      console.warn("HubSpot portal/form not configured, skipping HubSpot submission");
      return new Response(JSON.stringify({ success: true, hubspot: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const hubspotUrl = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formGuid}`;

    const hsPayload = {
      fields: [
        { name: "firstname", value: first_name },
        { name: "lastname", value: last_name },
        { name: "email", value: email },
        { name: "phone", value: phone || "" },
        { name: "jobtitle", value: job_title },
        { name: "company", value: company_name },
        { name: "industry", value: industry },
        { name: "equipo_comercial", value: team_size },
        { name: "cuenta_con_crm", value: has_crm },
      ],
      context: {
        pageUri: body.source_page || "",
        pageName: "RevOps LATAM - Lead Form",
      },
    };

    const hsRes = await fetch(hubspotUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(hsPayload),
    });

    if (!hsRes.ok) {
      const errText = await hsRes.text();
      console.error(`HubSpot submission failed [${hsRes.status}]: ${errText}`);
      return new Response(JSON.stringify({ success: true, hubspot: false, error: errText }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, hubspot: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ success: false, error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
