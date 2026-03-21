
-- Add missing columns to conversations
ALTER TABLE public.conversations
  ADD COLUMN IF NOT EXISTS hubspot_sync_status text DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS hubspot_sync_error text,
  ADD COLUMN IF NOT EXISTS hubspot_contact_id text,
  ADD COLUMN IF NOT EXISTS meeting_booked boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS score integer,
  ADD COLUMN IF NOT EXISTS score_breakdown jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS visitor_name text,
  ADD COLUMN IF NOT EXISTS visitor_email text,
  ADD COLUMN IF NOT EXISTS company text,
  ADD COLUMN IF NOT EXISTS cargo text,
  ADD COLUMN IF NOT EXISTS rubro text,
  ADD COLUMN IF NOT EXISTS equipo_comercial text,
  ADD COLUMN IF NOT EXISTS crm text,
  ADD COLUMN IF NOT EXISTS problema_principal text,
  ADD COLUMN IF NOT EXISTS flag text,
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'incompleto';

-- scoring_config table
CREATE TABLE IF NOT EXISTS public.scoring_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  criteria jsonb NOT NULL DEFAULT '{}'::jsonb,
  thresholds jsonb NOT NULL DEFAULT '{"alta": 65, "media": 40}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by text
);
ALTER TABLE public.scoring_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read scoring_config" ON public.scoring_config FOR SELECT TO public USING (true);

-- knowledge_base table
CREATE TABLE IF NOT EXISTS public.knowledge_base (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL DEFAULT 'Otro',
  content text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read active knowledge_base" ON public.knowledge_base FOR SELECT TO public USING (is_active = true);

-- agent_config table
CREATE TABLE IF NOT EXISTS public.agent_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.agent_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read agent_config" ON public.agent_config FOR SELECT TO public USING (true);

-- admin_logs table
CREATE TABLE IF NOT EXISTS public.admin_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action text NOT NULL,
  changed_by text,
  old_value jsonb,
  new_value jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert admin_logs" ON public.admin_logs FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can read admin_logs" ON public.admin_logs FOR SELECT TO public USING (true);
