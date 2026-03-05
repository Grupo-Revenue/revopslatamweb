
DO $$
DECLARE
  v_page_id uuid;
BEGIN
  -- Insert page if not exists
  INSERT INTO public.site_pages (slug, title, is_published, sort_order)
  VALUES ('integraciones-desarrollo', 'Integraciones y Desarrollo Custom', true, 16)
  ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, is_published = true
  RETURNING id INTO v_page_id;

  -- Delete existing sections for clean seed
  DELETE FROM public.page_sections WHERE page_id = v_page_id;

  -- Hero
  INSERT INTO public.page_sections (page_id, section_key, sort_order, is_visible, title, subtitle, cta_text, metadata)
  VALUES (v_page_id, 'hero', 1, true,
    'Tu ecosistema tecnológico, finalmente conectado',
    'HubSpot conectado con tu ERP, tus herramientas y apps construidas a medida. Diseñamos cada integración antes de desarrollarla — siempre.',
    'Cuéntanos qué sistemas necesitas conectar →',
    '{"badge":"TÉCNICO","breadcrumb":"Diseña y Construye → Integraciones y Desarrollo","cta2_text":"¿Es este el servicio correcto? ↓","nodes":[{"label":"ERP","sub":"SAP / Oracle","angle":240,"data":"Clientes, pedidos, facturación"},{"label":"WhatsApp","sub":"Business","angle":300,"data":"Conversaciones, leads"},{"label":"Slack","sub":"","angle":0,"data":"Notificaciones, alertas"},{"label":"App","sub":"a medida","angle":60,"data":"Lógica de negocio custom"},{"label":"Portal","sub":"cliente","angle":120,"data":"Tickets, contratos"},{"label":"Facturación","sub":"","angle":180,"data":"Boletas, facturas, pagos"}]}'::jsonb);

  -- Problema
  INSERT INTO public.page_sections (page_id, section_key, sort_order, is_visible, title, body, metadata)
  VALUES (v_page_id, 'problema', 2, true,
    'La información más importante de tu negocio vive en silos',
    'Tu equipo ingresa la misma información dos veces. Los datos son inconsistentes. Las decisiones se toman con información parcial. Y HubSpot es solo una herramienta más del stack — no el centro.',
    '{"silos":["HubSpot","ERP","Otros"]}'::jsonb);

  -- Construimos
  INSERT INTO public.page_sections (page_id, section_key, sort_order, is_visible, title, metadata)
  VALUES (v_page_id, 'construimos', 3, true,
    'Lo que podemos construir',
    '{"cards":[{"icon":"🗄️","title":"Integración HubSpot + ERP","desc":"Conexión bidireccional con SAP, Oracle u otros. Clientes, pedidos, facturación — sincronizado según la lógica de tu negocio.","tags":["SAP","Oracle","Bidireccional"],"badge":null},{"icon":"🔌","title":"Integraciones con terceros","desc":"HubSpot conectado con WhatsApp Business, Slack, plataformas de pago, firma electrónica y cualquier sistema con API disponible.","tags":["WhatsApp","Slack","APIs REST"],"badge":null},{"icon":"💻","title":"Apps a medida","desc":"Cuando la herramienta que necesitas no existe en el mercado. Construimos aplicaciones diseñadas para tu proceso, integradas con HubSpot.","tags":["Full-stack","HubSpot API","A medida"],"badge":"Desarrollo custom"},{"icon":"🌐","title":"Portales y micrositios","desc":"Portales de clientes, plataformas de autoservicio o micrositios construidos sobre HubSpot CMS con lógica de negocio personalizada.","tags":["HubSpot CMS","Portal clientes","Lógica custom"],"badge":null}]}'::jsonb);

  -- Principio
  INSERT INTO public.page_sections (page_id, section_key, sort_order, is_visible, title, metadata)
  VALUES (v_page_id, 'principio', 4, true,
    'Una integración mal pensada es peor que no tener ninguna',
    '{"body1":"Antes de escribir una línea de código, diseñamos la integración completa: arquitectura de datos, flujo de sincronización, manejo de errores y qué pasa cuando algo falla.","body2":"Ese documento de diseño garantiza que la integración sea mantenible, escalable y que no se rompa cuando cambias algo en cualquiera de los sistemas involucrados.","stats":[{"value":"Diseño primero","label":"antes de cada desarrollo"},{"value":"Documentación completa","label":"en cada entrega"},{"value":"Transferencia","label":"al equipo interno"}]}'::jsonb);

  -- Proceso
  INSERT INTO public.page_sections (page_id, section_key, sort_order, is_visible, title, metadata)
  VALUES (v_page_id, 'proceso', 5, true,
    'El proceso',
    '{"phases":[{"badge":"Semana 1-2","title":"Discovery técnico","text":"Mapeamos los sistemas, los flujos de datos, los requerimientos exactos y los casos borde. Nada se asume.","chip":null},{"badge":"Semana 2-3","title":"Diseño de la integración","text":"Arquitectura completa documentada antes de desarrollar. Validada contigo.","chip":"Diseñamos antes de codear"},{"badge":"Semana 3-8","title":"Desarrollo e implementación","text":"Construcción con revisiones de avance. Código documentado y estructurado para que sea mantenible.","chip":null},{"badge":"Semana 8-9","title":"Testing y go-live","text":"Pruebas en ambiente de staging, validación con datos reales, go-live controlado.","chip":null},{"badge":"Post go-live","title":"Documentación y transferencia","text":"Documentación técnica completa y transferencia al equipo interno.","chip":"Siempre incluido"}]}'::jsonb);

  -- Para quién
  INSERT INTO public.page_sections (page_id, section_key, sort_order, is_visible, title, metadata)
  VALUES (v_page_id, 'para-quien', 6, true, 'Para quién es',
    '{"title_yes":"Es para ti si","title_no":"No es para ti si","yes":["HubSpot implementado, necesitas conectarlo con ERP","Tu equipo ingresa la misma información en 2+ sistemas","Necesitas una app que no existe en el mercado","Quieres que HubSpot sea el centro real de tu operación"],"no":[{"text":"HubSpot aún no está bien implementado","chip":{"label":"Implementación a Medida →","href":"/implementacion-hubspot"}},{"text":"Solo necesitas ajustar experiencia visual sin sincronizar","chip":{"label":"Personalización CRM →","href":"/personalizacion-crm"}},{"text":"La integración existe en el marketplace de HubSpot","chip":null}]}'::jsonb);

  -- Precio
  INSERT INTO public.page_sections (page_id, section_key, sort_order, is_visible, title, cta_text, metadata)
  VALUES (v_page_id, 'precio', 7, true, 'Inversión',
    'Cuéntanos qué sistemas necesitas conectar →',
    '{"label":"INVERSIÓN","headline":"Las integraciones son el servicio de mayor variabilidad en alcance y complejidad.","subtext":"Una integración simple con una API puede tomar días. Una integración bidireccional con ERP puede tomar semanas.","calcChip":"🔧 Calculadora de precio → disponible próximamente","link":"Evaluamos la complejidad técnica y te presentamos una propuesta en 48 horas →"}'::jsonb);
END $$;
