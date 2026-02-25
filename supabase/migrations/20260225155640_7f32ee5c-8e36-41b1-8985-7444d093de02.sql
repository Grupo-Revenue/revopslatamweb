
-- CTA Styles table
CREATE TABLE public.cta_styles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  style_key TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  styles JSONB NOT NULL DEFAULT '{}'::jsonb,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.cta_styles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read cta_styles" ON public.cta_styles
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage cta_styles" ON public.cta_styles
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Updated at trigger
CREATE TRIGGER update_cta_styles_updated_at
  BEFORE UPDATE ON public.cta_styles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed with existing CTA patterns
INSERT INTO public.cta_styles (style_key, label, sort_order, styles) VALUES
(
  'primary',
  'Primario (Gradiente)',
  1,
  '{"gradient":"linear-gradient(135deg, #BE1869 0%, #6224BE 100%)","textColor":"#FFFFFF","borderRadius":"9999px","fontSize":"18px","fontWeight":"700","paddingX":"40px","paddingY":"16px","shadow":"0 8px 30px rgba(190,24,105,0.4)","hoverScale":"1.02","hasIcon":true,"iconName":"ArrowRight"}'::jsonb
),
(
  'outline',
  'Secundario (Outline)',
  2,
  '{"bgColor":"transparent","textColor":"#FFFFFF","borderColor":"rgba(255,255,255,0.3)","borderWidth":"2px","borderRadius":"9999px","fontSize":"18px","fontWeight":"600","paddingX":"40px","paddingY":"16px","hoverScale":"1.02","hasIcon":false}'::jsonb
),
(
  'text-link',
  'Enlace de texto',
  3,
  '{"bgColor":"transparent","textColor":"#1CA398","borderRadius":"0","fontSize":"16px","fontWeight":"500","paddingX":"0","paddingY":"0","hasIcon":true,"iconName":"ArrowRight"}'::jsonb
),
(
  'inverted',
  'Invertido (Fondo claro)',
  4,
  '{"bgColor":"#FFFFFF","textColor":"#BE1869","borderRadius":"9999px","fontSize":"18px","fontWeight":"700","paddingX":"48px","paddingY":"18px","shadow":"0 8px 32px rgba(0,0,0,0.2)","hoverScale":"1.03","hasIcon":false}'::jsonb
),
(
  'secondary',
  'Secundario (Color)',
  5,
  '{"bgColor":"transparent","textColor":"#BE1869","borderColor":"#BE1869","borderWidth":"2px","borderRadius":"9999px","fontSize":"16px","fontWeight":"600","paddingX":"24px","paddingY":"10px","hoverScale":"1.02","hasIcon":false}'::jsonb
);
