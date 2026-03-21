CREATE POLICY "Admins can delete conversations"
ON public.conversations
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));