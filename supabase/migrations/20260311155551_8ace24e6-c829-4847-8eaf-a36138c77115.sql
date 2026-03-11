
-- Fix page_sections RLS
DROP POLICY IF EXISTS "Admins can manage sections" ON public.page_sections;
DROP POLICY IF EXISTS "Anyone can read visible sections" ON public.page_sections;

CREATE POLICY "Admins can manage sections"
ON public.page_sections FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can read visible sections"
ON public.page_sections FOR SELECT TO public
USING (is_visible = true);

-- Fix cta_styles RLS
DROP POLICY IF EXISTS "Admins can manage cta_styles" ON public.cta_styles;
DROP POLICY IF EXISTS "Anyone can read cta_styles" ON public.cta_styles;

CREATE POLICY "Admins can manage cta_styles"
ON public.cta_styles FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can read cta_styles"
ON public.cta_styles FOR SELECT TO public
USING (true);

-- Fix site_styles RLS
DROP POLICY IF EXISTS "Admins can manage styles" ON public.site_styles;
DROP POLICY IF EXISTS "Anyone can read styles" ON public.site_styles;

CREATE POLICY "Admins can manage styles"
ON public.site_styles FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can read styles"
ON public.site_styles FOR SELECT TO public
USING (true);

-- Fix media_library RLS
DROP POLICY IF EXISTS "Admins can manage media" ON public.media_library;
DROP POLICY IF EXISTS "Anyone can view media" ON public.media_library;

CREATE POLICY "Admins can manage media"
ON public.media_library FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view media"
ON public.media_library FOR SELECT TO public
USING (true);
