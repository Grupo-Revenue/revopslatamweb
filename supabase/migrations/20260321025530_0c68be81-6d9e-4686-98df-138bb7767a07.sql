CREATE POLICY "Anon can read conversations"
  ON public.conversations
  FOR SELECT
  TO anon
  USING (true);