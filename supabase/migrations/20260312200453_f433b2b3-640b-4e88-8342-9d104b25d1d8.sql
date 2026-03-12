-- Insert the site page for Potencia con IA
INSERT INTO public.site_pages (title, slug, meta_description, is_published, sort_order)
VALUES (
  'Potencia con IA',
  'potencia-con-ia',
  'Automatización inteligente e IA integrada a tu operación de revenue con HubSpot',
  true,
  40
);

-- Insert all sections for the page
INSERT INTO public.page_sections (page_id, section_key, sort_order, title, subtitle, body, cta_text, cta_url, is_visible, metadata)
VALUES
  ((SELECT id FROM public.site_pages WHERE slug = 'potencia-con-ia'), 'hero', 0,
   'La ventaja que tus competidores aún no tienen',
   'No implementamos IA por implementar. Mapeamos tu operación, identificamos dónde genera más impacto y construimos la solución correcta — integrada a HubSpot desde el primer día.',
   NULL,
   'Quiero saber dónde la IA impacta mi operación →',
   NULL,
   true,
   '{"badge": "VANGUARDIA OPERATIVA", "cta2_text": "¿Es este el servicio correcto? ↓"}'::jsonb
  ),
  ((SELECT id FROM public.site_pages WHERE slug = 'potencia-con-ia'), 'problema', 1,
   'El problema no es la IA.\nEs cómo se está implementando.',
   NULL,
   'La mayoría de los intentos fallan por la misma razón: alguien compró una herramienta, la instaló sobre un proceso que ya tenía problemas y esperó resultados. La IA amplificó los problemas — no los resolvió.',
   NULL, NULL,
   true,
   '{"highlight": "La IA que genera ventaja real no se instala. Se diseña.", "bad_items": ["Herramienta comprada, proceso sin ordenar", "Solución genérica, sin integración al CRM", "El equipo no la entiende, nadie la usa"], "good_items": ["Proceso diseñado antes de implementar", "Integrada a HubSpot, sin silos", "El equipo la opera desde el día 1"]}'::jsonb
  ),
  ((SELECT id FROM public.site_pages WHERE slug = 'potencia-con-ia'), 'capacidades', 2,
   'Cuatro capacidades.\nUna sola lógica: IA integrada a tu operación.',
   NULL, NULL, NULL, NULL,
   true,
   '{}'::jsonb
  ),
  ((SELECT id FROM public.site_pages WHERE slug = 'potencia-con-ia'), 'consultoria', 3,
   'Antes de implementar: el mapa.',
   NULL,
   'Todo proyecto de IA en RevOps LATAM parte con una pregunta: ¿dónde está el mayor impacto en tu motor de ingresos?\n\nMapeamos tu operación e identificamos los 3-5 puntos donde la IA genera más resultado. Ese mapa es lo que separa una implementación que funciona de una que se abandona en 60 días.',
   NULL, NULL,
   true,
   '{"badge": "SIEMPRE EL PRIMER PASO"}'::jsonb
  ),
  ((SELECT id FROM public.site_pages WHERE slug = 'potencia-con-ia'), 'proceso', 4,
   'El proceso',
   NULL, NULL, NULL, NULL,
   true,
   '{}'::jsonb
  ),
  ((SELECT id FROM public.site_pages WHERE slug = 'potencia-con-ia'), 'contratacion', 5,
   'Dos formas de incorporar IA a tu operación',
   NULL, NULL, NULL, NULL,
   true,
   '{}'::jsonb
  ),
  ((SELECT id FROM public.site_pages WHERE slug = 'potencia-con-ia'), 'para-quien', 6,
   NULL, NULL, NULL, NULL, NULL,
   true,
   '{"yes_items": ["Tienes HubSpot funcionando y quieres dar el siguiente paso", "Tu equipo pierde tiempo en tareas repetitivas", "Quieres calificar más leads sin contratar más personas", "Intentaste implementar IA antes y no funcionó"], "no_items": [{"text": "Tu proceso no está ordenado", "chip": "Diseña y Construye →", "chipTo": "/diseña-y-construye-tu-pista"}, {"text": "Buscas una demo sin aplicación real", "note": "eso no hacemos"}, {"text": "No tienes HubSpot", "note": "nuestras soluciones viven en ese ecosistema"}]}'::jsonb
  ),
  ((SELECT id FROM public.site_pages WHERE slug = 'potencia-con-ia'), 'cta-final', 7,
   'El primer paso es el mapa,\nno la herramienta',
   'En 30 minutos identificamos dónde la IA tiene más impacto en tu operación — antes de hablar de soluciones.',
   NULL,
   'Quiero saber dónde la IA impacta mi operación',
   NULL,
   true,
   '{"cta2_text": "Primero necesito ordenar mi operación →", "cta2_url": "/conoce-tu-pista"}'::jsonb
  );
