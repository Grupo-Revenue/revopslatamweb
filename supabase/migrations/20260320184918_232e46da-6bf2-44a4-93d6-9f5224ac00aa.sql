ALTER TABLE public.conversations
  ADD COLUMN IF NOT EXISTS scheduled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS scheduled_at timestamptz,
  ADD COLUMN IF NOT EXISTS meeting_date text,
  ADD COLUMN IF NOT EXISTS meeting_time text;