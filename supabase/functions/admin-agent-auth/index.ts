import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { username, password } = await req.json();
    const ADMIN_USER = Deno.env.get("ADMIN_AGENT_USER");
    const ADMIN_PASSWORD = Deno.env.get("ADMIN_AGENT_PASSWORD");

    if (!ADMIN_USER || !ADMIN_PASSWORD) {
      return new Response(
        JSON.stringify({ error: "Admin credentials not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (username === ADMIN_USER && password === ADMIN_PASSWORD) {
      const token = crypto.randomUUID();
      const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
      return new Response(
        JSON.stringify({ success: true, token, expiresAt }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: "Credenciales inválidas" }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
