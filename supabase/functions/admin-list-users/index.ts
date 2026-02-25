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

  // Verify caller is admin
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

  // Check admin role
  const { data: isAdmin } = await supabaseAdmin.rpc("has_role", { _user_id: caller.id, _role: "admin" });
  if (!isAdmin) {
    return new Response(JSON.stringify({ error: "No tienes permisos de administrador" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  // List all users
  const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  // Get roles for all users
  const { data: roles } = await supabaseAdmin.from("user_roles").select("user_id, role");
  const roleMap = new Map((roles || []).map((r: any) => [r.user_id, r.role]));

  // Get profiles
  const { data: profiles } = await supabaseAdmin.from("profiles").select("user_id, display_name");
  const profileMap = new Map((profiles || []).map((p: any) => [p.user_id, p.display_name]));

  const result = users.map((u: any) => ({
    id: u.id,
    email: u.email,
    display_name: profileMap.get(u.id) || null,
    role: roleMap.get(u.id) || "user",
    created_at: u.created_at,
  }));

  return new Response(JSON.stringify({ users: result }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
});
