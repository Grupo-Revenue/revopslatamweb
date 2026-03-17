
-- Insert page
INSERT INTO public.site_pages (slug, title, meta_description, is_published, sort_order)
VALUES (
  'hubspot-partner-chile',
  'Partner HubSpot Chile y LATAM',
  'RevOps LATAM es HubSpot Platinum Partner en Chile y LATAM. No somos una agencia. Somos la consultora que implementa HubSpot y opera tu motor de ingresos completo. 14 años de experiencia en la región.',
  true,
  20
);

-- Insert sections using the page id
INSERT INTO public.page_sections (page_id, section_key, sort_order, title, subtitle, body, cta_text, metadata)
SELECT p.id, v.section_key, v.sort_order, v.title, v.subtitle, v.body, v.cta_text, v.metadata::jsonb
FROM public.site_pages p
CROSS JOIN (VALUES
  ('hero', 0,
   'Somos HubSpot Platinum Partner en Chile y LATAM. Pero no somos una agencia.',
   'Llevamos 14 años implementando y operando HubSpot en empresas B2B de Chile, México, Colombia, Perú y Argentina. No configuramos la herramienta y nos vamos — construimos el motor de ingresos completo.',
   NULL,
   'Agenda una conversación →',
   '{"cta1_opens_lead_form": true, "cta2_text": "Ver cómo trabajamos ↓", "stats": [{"value": "Platinum", "label": "Nivel de partnership HubSpot"}, {"value": "14 años", "label": "Operando en Chile y LATAM", "counter": 14}, {"value": "5 Hubs", "label": "Implementamos todo el ecosistema"}]}'
  ),
  ('posicionamiento', 1,
   'Ser partner de HubSpot no nos hace buenos. Saber operar el negocio detrás de la herramienta, sí.',
   NULL,
   'Hay cientos de partners de HubSpot en el mundo. La diferencia no está en el badge — está en el enfoque.||La mayoría llega, configura HubSpot según las mejores prácticas del manual, entrega el portal y desaparece. El equipo lo adopta parcialmente, los procesos se deterioran en 90 días y seis meses después nadie sabe si HubSpot está sirviendo para algo.',
   NULL,
   '{"callout": "Nosotros hacemos lo contrario. Antes de abrir HubSpot, entendemos tu proceso comercial real. El resultado: un HubSpot que tu equipo usa, que produce datos confiables y que se convierte en la pista por donde fluye tu revenue.", "comparison": [{"label": "Foco", "agency": "Implementar la herramienta", "revops": "Operar el motor de ingresos"}, {"label": "Punto de partida", "agency": "El software", "revops": "Tu proceso comercial"}, {"label": "Entrega", "agency": "Portal configurado", "revops": "Sistema funcionando"}, {"label": "Después de implementar", "agency": "Se van", "revops": "Operamos contigo"}, {"label": "Éxito medido en", "agency": "HubSpot bien configurado", "revops": "Revenue predecible"}, {"label": "Estrategia incluida", "agency": "No siempre", "revops": "Siempre primero"}]}'
  ),
  ('ecosistema', 2,
   'Implementamos todo el ecosistema HubSpot. Siempre desde la lógica del motor de ingresos.',
   'Cada Hub de HubSpot es una pieza de la pista. La diferencia entre una implementación que funciona y una que no es si las piezas están conectadas entre sí — y con el proceso real del negocio.',
   NULL,
   NULL,
   '{"eyebrow": "LO QUE IMPLEMENTAMOS", "hubs": [{"badge": "GENERA LA DEMANDA", "badgeColor": "#BE1869", "icon": "megaphone", "title": "Marketing Hub", "desc": "Formularios, emails, nurturing, lead scoring, landing pages y atribución. Para que marketing demuestre su impacto real en el pipeline — no solo en clics e impresiones.", "tag": "Ideal para equipos de marketing"}, {"badge": "CONVIERTE LEADS", "badgeColor": "#0779D7", "icon": "chart", "title": "Sales Hub", "desc": "Pipeline con etapas claras, automatizaciones de seguimiento, secuencias, playbooks y forecast confiable. Para que el Director Comercial lidere con datos — no con intuición.", "tag": "Ideal para equipos comerciales"}, {"badge": "RETIENE Y EXPANDE", "badgeColor": "#1CA398", "icon": "heart", "title": "Service Hub", "desc": "Tickets, NPS, CSAT y alertas de churn. Para conectar la postventa al motor de ingresos completo — y que CS deje de ser invisible en la estrategia comercial.", "tag": "Ideal para equipos de Customer Success"}, {"badge": "CONECTA TODO", "badgeColor": "#6224BE", "icon": "settings", "title": "Operations Hub", "desc": "Sincronización de datos, limpieza automática y workflows operativos avanzados. La pieza que hace que el resto del ecosistema funcione bien — cuando los datos están limpios, todas las decisiones mejoran.", "tag": "Ideal para empresas con stack complejo"}, {"badge": "CIERRA EL CICLO", "badgeColor": "#BE1869", "icon": "globe", "title": "Content Hub", "desc": "Sitio web, blog, landing pages y SEO integrado en HubSpot. Para que cada visita, formulario y descarga quede registrada automáticamente en el perfil del contacto.", "tag": "Ideal para presencia digital integrada al CRM"}]}'
  ),
  ('como-trabajamos', 3,
   'Nuestra forma de implementar',
   'No empezamos con HubSpot. Empezamos con tu proceso.',
   NULL,
   NULL,
   '{"steps": [{"num": "01", "title": "Diagnóstico primero", "desc": "Mapeamos tu operación comercial real antes de configurar cualquier cosa. Sin este paso, HubSpot queda configurado para una empresa ideal que no existe.", "chip": "Siempre el primer paso"}, {"num": "02", "title": "Diseño antes de construir", "desc": "Arquitectura completa documentada y validada con el equipo antes de tocar el portal. Qué propiedades, qué pipeline, qué automatizaciones, qué reportes.", "chip": "Cero sorpresas"}, {"num": "03", "title": "Implementación con el equipo", "desc": "Construimos junto al equipo que va a usar el sistema — no para ellos. La adopción no es un problema de capacitación: es un problema de participación en el diseño.", "chip": "Adopción garantizada"}, {"num": "04", "title": "Activación y acompañamiento", "desc": "No entregamos el portal y desaparecemos. Acompañamos la activación, medimos el uso real y hacemos los ajustes necesarios. El sistema queda funcionando — no solo configurado.", "chip": "Siempre incluido"}]}'
  ),
  ('para-quien', 4,
   'No somos el partner correcto para todos. Y eso está bien.',
   NULL,
   NULL,
   NULL,
   '{"yes_items": ["Tienes entre 10 y 200 empleados y equipo comercial activo", "Quieres que HubSpot sea el centro de tu operación — no una herramienta más", "Buscas un partner que entienda el negocio, no solo la plataforma", "Quieres que alguien opere contigo después de la implementación", "Estás en Chile, México, Colombia, Perú, Argentina o cualquier país de LATAM", "Quieres resultados medibles, no promesas"], "no_items": ["Solo necesitas configuración técnica sin estrategia", "Buscas el partner más barato del directorio", "No tienes equipo comercial activo ni proceso definido", "Quieres resultados en 2 semanas sin involucrarte"]}'
  ),
  ('faq', 5,
   'Lo que más nos preguntan sobre ser partner HubSpot en Chile y LATAM',
   NULL,
   NULL,
   NULL,
   '{"eyebrow": "PREGUNTAS FRECUENTES", "faqs": [{"q": "¿Qué es un HubSpot Partner?", "a": "Un HubSpot Partner es una empresa certificada por HubSpot para implementar, configurar y operar sus productos. Los partners están organizados en niveles según su experiencia y volumen de clientes: Starter, Gold, Platinum, Diamond y Elite. RevOps LATAM es HubSpot Platinum Partner en Chile — uno de los niveles más altos del ecosistema de partners en la región."}, {"q": "¿Cuál es la diferencia entre un partner Platinum y uno Gold?", "a": "El nivel Platinum refleja mayor experiencia acumulada, mayor volumen de implementaciones exitosas y certificaciones más avanzadas del equipo. En el directorio global de HubSpot hay miles de partners — los niveles más altos representan una fracción pequeña. En Chile y LATAM, los partners Platinum son especialmente escasos."}, {"q": "¿Cómo elegir un partner de HubSpot en Chile?", "a": "Más allá del nivel de partnership, hay tres preguntas que importan: ¿El partner entiende tu tipo de negocio y proceso comercial? ¿Tiene experiencia operando HubSpot después de la implementación — o solo configura y se va? ¿Puede mostrarte implementaciones reales en empresas similares a la tuya? El nivel Platinum es una señal de experiencia, pero no reemplaza el fit estratégico."}, {"q": "¿Cuánto cuesta implementar HubSpot con un partner en Chile?", "a": "El costo depende de la complejidad del proyecto: los módulos a implementar, el tamaño del equipo, las integraciones requeridas y el nivel de personalización. En RevOps LATAM trabajamos con una calculadora de precios que entrega un rango según las características de cada proyecto. El punto de partida siempre es el diagnóstico — para no cotizar una implementación sin entender qué necesita realmente la empresa."}, {"q": "¿Puedo contratar HubSpot directamente sin un partner?", "a": "Sí. HubSpot se puede contratar directamente en hubspot.com. Un partner agrega valor en la implementación, la configuración estratégica, la integración con otras herramientas y la operación continua. Si solo necesitas la licencia, no necesitas un partner. Si quieres que HubSpot funcione de verdad en tu operación, un partner con experiencia hace la diferencia entre una inversión que rinde y una que se desperdicia."}, {"q": "¿RevOps LATAM solo trabaja con HubSpot?", "a": "Sí. HubSpot es el ecosistema central de todo lo que hacemos. No somos technology-agnostic — somos especialistas. Esa especialización profunda es lo que nos permite implementar y operar HubSpot con el nivel de detalle que los resultados requieren. Podemos integrarlo con prácticamente cualquier herramienta del stack del cliente, pero el motor siempre es HubSpot."}, {"q": "¿Son partner de HubSpot en México, Colombia, Perú o Argentina?", "a": "Sí. Somos HubSpot Platinum Partner con operación en toda LATAM. Nuestro equipo trabaja con empresas en México, Colombia, Perú y Argentina con la misma metodología que aplicamos en Chile. El horario, el idioma, la cultura comercial y la realidad del mercado latinoamericano son el contexto en el que operamos todos los días."}, {"q": "¿Qué diferencia a RevOps LATAM de otras consultoras HubSpot?", "a": "Tres cosas concretas: primero, siempre empezamos con diagnóstico — nunca proponemos soluciones antes de entender el problema. Segundo, no entregamos y desaparecemos — ofrecemos operación continua post-implementación. Tercero, no somos una agencia que configura HubSpot: somos una consultora de Revenue Operations que usa HubSpot como motor central para construir operaciones comerciales que escalan."}]}'
  ),
  ('cta-final', 6,
   '¿Buscas un partner de HubSpot que entienda tu negocio — no solo la herramienta?',
   'El primer paso es una conversación. En 30 minutos entendemos tu situación, te decimos con honestidad si somos el equipo correcto para ti y qué tendría más impacto en tu operación.',
   NULL,
   'Agenda una conversación →',
   '{"cta1_opens_lead_form": true, "badge": "HABLEMOS", "cta2_text": "Ver el Pulso Comercial gratuito →", "cta2_url": "https://pulso.revopslatam.com/"}'
  )
) AS v(section_key, sort_order, title, subtitle, body, cta_text, metadata)
WHERE p.slug = 'hubspot-partner-chile';
