import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "No autorizado" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const supabaseUser = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } }
  );

  const { data: { user: caller } } = await supabaseUser.auth.getUser();
  if (!caller) {
    return new Response(JSON.stringify({ error: "No autorizado" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  const { data: isAdmin } = await supabaseAdmin.rpc("has_role", { _user_id: caller.id, _role: "admin" });
  if (!isAdmin) {
    return new Response(JSON.stringify({ error: "No tienes permisos de administrador" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  const { email, password, displayName, role } = await req.json();

  if (!email || !password || password.length < 6) {
    return new Response(JSON.stringify({ error: "Email y contraseña (mín 6 chars) requeridos" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  const validRoles = ["admin", "editor", "user"];
  const finalRole = validRoles.includes(role) ? role : "user";

  // Create user
  const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { display_name: displayName || email },
  });

  if (userError) {
    return new Response(JSON.stringify({ error: userError.message }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  // Assign role
  const { error: roleError } = await supabaseAdmin
    .from("user_roles")
    .insert({ user_id: userData.user.id, role: finalRole });

  if (roleError) {
    return new Response(JSON.stringify({ error: roleError.message }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  return new Response(JSON.stringify({ success: true, userId: userData.user.id }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
});
