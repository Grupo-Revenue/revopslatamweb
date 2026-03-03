
-- Insert the nosotros page
INSERT INTO public.site_pages (slug, title, meta_description, is_published, sort_order)
VALUES ('/nosotros', 'Nosotros — RevOps LATAM', 'Conoce al equipo detrás de RevOps LATAM. Arquitectos del Revenue con propósito, integridad y 14 años de experiencia.', true, 2)
ON CONFLICT (slug) DO NOTHING;

-- Insert all 8 sections for the nosotros page
WITH page AS (SELECT id FROM public.site_pages WHERE slug = '/nosotros' LIMIT 1)
INSERT INTO public.page_sections (page_id, section_key, sort_order, title, subtitle, body, is_visible, metadata)
VALUES
  ((SELECT id FROM page), 'nosotros-hero', 1,
   'Somos Arquitectos del Revenue. Y hacemos este trabajo para algo más grande que el revenue.',
   'Quiénes somos',
   'Creemos que el orden, el diseño y el crecimiento sano son formas concretas de hacer bien en el mundo. Por eso construimos sistemas de revenue con la misma convicción con que otros construyen catedrales — pieza a pieza, con propósito, sin atajos.',
   true, '{}'),

  ((SELECT id FROM page), 'por-que-existimos', 2,
   'Por qué existimos', NULL, NULL, true,
   '{"p1":"En Latinoamérica, muchas empresas no crecen porque están desordenadas. La improvisación, los equipos desalineados y la falta de procesos estructurados son parte del ADN empresarial de la región. Esa cultura del caos impide automatizar, medir con precisión y escalar de forma saludable.","p2":"Nosotros creemos que puede ser diferente.","p3":"Creemos que las empresas en LATAM pueden crecer — no solo en revenue, sino de manera sostenible, con integridad y propósito, contribuyendo al bien común y glorificando a Dios a través del trabajo bien hecho.","p_final":"Por eso existimos: para ordenar la operación comercial de las empresas de LATAM, y dar a conocer e implementar Revenue Operations como disciplina estratégica para el crecimiento sostenible. No solo aplicamos RevOps. Lo enseñamos, lo impulsamos y lo usamos para transformar empresas que quieren dejar de improvisar y empezar a liderar.","closing_quote":"Somos arquitectos del revenue. Pieza a pieza, ordenamos para crecer.","levels":[{"number":"01","label":"Nivel práctico","text":"Ayudamos a las empresas a escalar ordenando sus sistemas de revenue."},{"number":"02","label":"Nivel ético","text":"Operamos con altos estándares de integridad, eligiendo trabajar solo con empresas que generen un impacto positivo."},{"number":"03","label":"Nivel espiritual","text":"Vemos nuestro trabajo como una forma de cumplir el mandato cultural — sirviendo a Dios y a la sociedad a través de la excelencia en los negocios."}]}'::jsonb),

  ((SELECT id FROM page), 'por-que-de-esta-forma', 3,
   'Por qué lo hacemos de esta forma', NULL, NULL, true,
   '{"p1":"Somos una empresa fundada sobre principios cristianos. Y eso no es un detalle biográfico — es la razón por la que hacemos lo que hacemos de la forma en que lo hacemos.","p2":"Entendemos nuestro trabajo como parte de algo más grande: el mandato de llenar el mundo de orden, bien y propósito. Cada sistema que diseñamos, cada proceso que conectamos, cada empresa que acompañamos es una oportunidad concreta de hacer bien al mundo y a las personas.","p3":"Por eso no ejecutamos tareas por cumplir. Por eso no vendemos soluciones que no funcionan. Por eso decimos la verdad aunque no sea lo que el cliente quiere oír. No es estrategia comercial — es carácter. Y el carácter define la calidad del trabajo.","p4":"Somos excelentes con nuestros clientes porque en primer lugar nuestro compromiso es con el talento que Dios nos ha dado para hacerle bien al mundo y a las personas.","quote":"Crecemos de forma correcta, honrando a Dios y sirviendo a las personas."}'::jsonb),

  ((SELECT id FROM page), 'como-entendemos', 4,
   'Cómo entendemos lo que hacemos', NULL, NULL, true,
   '{"cards":[{"icon":"search","title":"Somos decodificadores de sistemas","text":"Detrás de cada resultado, bueno o malo, hay un sistema que lo genera. Nuestro trabajo empieza por ver lo que otros no ven — las causas invisibles, los patrones ocultos, las piezas que faltan. Leemos sistemas complejos y los traducimos en acciones claras."},{"icon":"compass","title":"Somos estrategas antes que ejecutores","text":"Pensamos antes de actuar. Diseñamos antes de construir. Priorizamos antes de ejecutar. Ninguna decisión se toma sin un plano, sin un propósito y sin un diseño que sostenga el crecimiento futuro del cliente."},{"icon":"wrench","title":"Somos solucionadores, no señaladores","text":"No venimos a decirte qué está mal y dejarte solo con el problema. Si detectamos una fricción, traemos la propuesta para resolverla. Si algo no genera valor, lo decimos con claridad. Si algo afecta la pista, lo reparamos."},{"icon":"trending","title":"Somos analistas del flujo continuo","text":"El revenue no es un proyecto con principio y fin. Es un sistema vivo que evoluciona. Por eso acompañamos de forma continua — midiendo, ajustando y perfeccionando la pista para que el crecimiento sea sostenible, no un pico aislado."}]}'::jsonb),

  ((SELECT id FROM page), 'los-numeros', 5,
   'Lo que hemos construido hasta aquí', NULL, NULL, true,
   '{"metrics":[{"value":"+50","label":"empresas diagnosticadas en LATAM"},{"value":"$200MM USD","label":"en pipeline analizado"},{"value":"7","label":"servicios especializados en Revenue Operations"},{"value":"1 convicción","label":"una empresa crece cuando su pista está bien armada"}]}'::jsonb),

  ((SELECT id FROM page), 'el-equipo', 6,
   'Las personas detrás de la pista',
   'No contratamos técnicos. Buscamos personas íntegras, enseñables y apasionadas por hacer bien su trabajo. Porque una pista solo es tan buena como las personas que la diseñan.',
   NULL, true,
   '{"team":[{"name":"Nombre del miembro","role":"Rol en el equipo","description":"Línea descriptiva sobre la persona y su aporte al equipo."},{"name":"Nombre del miembro","role":"Rol en el equipo","description":"Línea descriptiva sobre la persona y su aporte al equipo."},{"name":"Nombre del miembro","role":"Rol en el equipo","description":"Línea descriptiva sobre la persona y su aporte al equipo."},{"name":"Nombre del miembro","role":"Rol en el equipo","description":"Línea descriptiva sobre la persona y su aporte al equipo."}]}'::jsonb),

  ((SELECT id FROM page), 'mas-alla-del-revenue', 7,
   'Más allá del revenue', NULL, NULL, true,
   '{"p1":"Parte de lo que generamos como empresa lo destinamos a apoyar iniciativas que promueven una cosmovisión bíblica y la predicación del Evangelio a lo largo de Latinoamérica.","p2":"Creemos que las empresas pueden ser instrumentos de bien en el mundo — no solo máquinas de generar utilidades. Y que el crecimiento sano de una empresa tiene un efecto real en las personas que trabajan en ella, en las familias que dependen de ella, y en las comunidades que la rodean.","p3":"Ese es el para qué detrás de cada pista que diseñamos.","closing_quote":"Una empresa crece cuando su pista está bien armada. Y una pista bien armada hace bien al mundo."}'::jsonb),

  ((SELECT id FROM page), 'nosotros-cta', 8,
   'Si esto resuena contigo, probablemente trabajemos bien juntos.',
   NULL,
   'No trabajamos con todos. Trabajamos con empresas que quieren crecer de forma real, sana y sostenible — y con personas que valoran la honestidad por encima del discurso bonito.',
   true,
   '{"cta2_text":"Prefiero hablar directo → Agendar conversación","cta2_url":"#"}'::jsonb);
