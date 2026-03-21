ALTER TABLE public.conversations 
ADD COLUMN IF NOT EXISTS hubspot_form_submitted boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS hubspot_form_submitted_at timestamptz,
ADD COLUMN IF NOT EXISTS hubspot_form_error text;