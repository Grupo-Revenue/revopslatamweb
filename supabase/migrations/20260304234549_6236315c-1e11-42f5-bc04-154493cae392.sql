
-- Insert the page
INSERT INTO public.site_pages (slug, title, meta_description, is_published, sort_order)
VALUES ('diseña-y-construye-tu-pista', 'Diseña y Construye tu Pista', 'Diseñamos la pista antes de construirla. Proceso primero, HubSpot después. Partner Platinum con +10 años.', true, 50)
ON CONFLICT (slug) DO NOTHING;

-- Insert sections
WITH pid AS (SELECT id FROM public.site_pages WHERE slug = 'diseña-y-construye-tu-pista' LIMIT 1)
INSERT INTO public.page_sections (page_id, section_key, sort_order, title, subtitle, body, cta_text, cta_url, is_visible, metadata) VALUES
(
  (SELECT id FROM pid), 'hero', 0,
  'Nadie construye un circuito poniendo el asfalto primero',
  'Diseñamos la pista antes de construirla — siempre. Proceso primero. HubSpot después.',
  NULL,
  'Quiero construir mi pista →',
  '#servicios',
  true,
  '{"eyebrow":"DISEÑA Y CONSTRUYE TU PISTA","cta2_text":"Primero quiero un diagnóstico →","cta2_url":"/conoce-tu-pista","steps":["Diseño de Procesos","Onboarding HubSpot","Implementación a Medida","Personalización CRM","Integraciones Custom"]}'::jsonb
),
(
  (SELECT id FROM pid), 'problema', 1,
  'La mayoría de los CRM fallan antes de ser implementados',
  NULL,
  NULL,
  NULL, NULL, true,
  '{"cards":[{"icon":"😤","title":"Lo implementaron sin proceso","text":"Meses después, el equipo sigue en Excel."},{"icon":"🏢","title":"Lo implementó una agencia de marketing","text":"Técnicamente correcto. Operacionalmente inútil."},{"icon":"💸","title":"Licencias caras que nadie usa","text":"La inversión existe. El retorno, no."}],"pill":"Proceso primero. Tecnología después. Siempre."}'::jsonb
),
(
  (SELECT id FROM pid), 'servicios', 2,
  'Cinco servicios. Un principio.',
  'Proceso antes que tecnología — en cada proyecto, sin excepción.',
  NULL,
  NULL, NULL, true,
  '{"services":[{"badge":"EL FUNDAMENTO","badgeType":"hubspot","title":"Diseño de Procesos Comerciales","tagline":"El plano de tu operación comercial","description":"Diseñamos tu proceso completo antes de tocar cualquier herramienta.","price":"Desde 45 UF + IVA","href":"/diseño-de-procesos"},{"badge":"MÁS RÁPIDO","badgeType":"hubspot","title":"Onboarding HubSpot","tagline":"En marcha en 3 semanas","description":"La forma más eficiente de arrancar con HubSpot. Con proceso, sin sobreingeniería.","price":"Desde 50 UF + IVA","href":"/onboarding-hubspot"},{"badge":"MÁS POPULAR","badgeType":"brand","title":"Implementación HubSpot a Medida","tagline":"Tu proceso exacto en HubSpot","description":"Para procesos complejos o implementaciones que necesitan rehacerse desde las bases.","price":"calc","href":"/implementacion-hubspot"},{"badge":"AVANZADO","badgeType":"default","title":"Personalización del CRM","tagline":"HubSpot que funciona como tu negocio","description":"UI Extensions, CRM Cards personalizadas y vistas a medida por rol.","price":"calc","href":"/personalizacion-crm"},{"badge":"TÉCNICO","badgeType":"default","title":"Integraciones y Desarrollo Custom","tagline":"Tu ecosistema, finalmente conectado","description":"ERP, apps a medida, WhatsApp, portales — HubSpot como centro de tu operación.","price":"calc","href":"/integraciones-desarrollo"}]}'::jsonb
),
(
  (SELECT id FROM pid), 'diferencia', 3,
  'Por qué una agencia de marketing no debería implementar tu CRM',
  NULL,
  'El CRM es el corazón de tu operación comercial. Implementarlo bien requiere entender procesos de ventas, pipelines, automatizaciones de negocio y arquitectura de datos — no campañas ni creatividad.\n\nNosotros somos especialistas en operaciones de revenue. No hacemos marketing. Hacemos que tu operación comercial funcione.',
  NULL, NULL, true,
  '{"credential":"HubSpot Platinum Partner · +10 años","comparison":{"left":{"header":"Agencia de Marketing","items":["Implementa sin diseñar proceso","Configura por Hub, no por negocio","Entrega el portal y desaparece"]},"right":{"header":"RevOps LATAM","items":["Proceso diseñado antes de construir","Implementamos según tu operación","Acompañamos hasta que funciona"]}}}'::jsonb
),
(
  (SELECT id FROM pid), 'cta-final', 4,
  '¿No sabes por dónde partir?',
  NULL,
  'Si aún no tienes claridad de qué necesitas construir, el primer paso es un diagnóstico.',
  'Quiero construir mi pista →',
  '#servicios',
  true,
  '{"cta2_text":"Primero quiero un diagnóstico →","cta2_url":"/conoce-tu-pista"}'::jsonb
);
