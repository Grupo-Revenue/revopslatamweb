CREATE TABLE public.conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  context text NOT NULL DEFAULT 'diagnostico',
  messages jsonb NOT NULL DEFAULT '[]'::jsonb,
  summary text,
  availability_preference text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert conversations"
  ON public.conversations FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update own conversation by id"
  ON public.conversations FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can read conversations"
  ON public.conversations FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));