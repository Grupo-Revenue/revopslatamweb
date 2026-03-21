
CREATE TABLE public.conversions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_email text NOT NULL,
  contact_id_hubspot text,
  fbclid text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  full_url text,
  referrer text,
  conversion_type text NOT NULL DEFAULT 'meeting_booked',
  converted_at timestamp with time zone NOT NULL DEFAULT now(),
  conversation_id uuid REFERENCES public.conversations(id),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.conversions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert conversions" ON public.conversions
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Admins can read conversions" ON public.conversions
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Add attribution columns to conversations table
ALTER TABLE public.conversations
  ADD COLUMN IF NOT EXISTS fbclid text,
  ADD COLUMN IF NOT EXISTS utm_source text,
  ADD COLUMN IF NOT EXISTS utm_medium text,
  ADD COLUMN IF NOT EXISTS utm_campaign text,
  ADD COLUMN IF NOT EXISTS utm_content text,
  ADD COLUMN IF NOT EXISTS utm_term text,
  ADD COLUMN IF NOT EXISTS full_url text,
  ADD COLUMN IF NOT EXISTS referrer text;
