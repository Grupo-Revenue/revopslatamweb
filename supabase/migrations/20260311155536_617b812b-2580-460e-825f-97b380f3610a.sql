
-- Drop restrictive policies and recreate as permissive
DROP POLICY IF EXISTS "Admins can manage pages" ON public.site_pages;
DROP POLICY IF EXISTS "Anyone can read published pages" ON public.site_pages;

-- Recreate as PERMISSIVE so either one passing is sufficient
CREATE POLICY "Admins can manage pages"
ON public.site_pages
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can read published pages"
ON public.site_pages
FOR SELECT
TO public
USING (is_published = true);
