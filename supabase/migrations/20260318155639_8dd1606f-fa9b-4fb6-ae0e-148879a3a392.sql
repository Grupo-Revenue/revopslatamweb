-- Update Hero section: remove LATAM, replace em dashes
UPDATE page_sections SET 
  title = 'Somos HubSpot Platinum Partner en Chile. Pero no somos una agencia.',
  subtitle = 'Llevamos 14 años implementando y operando HubSpot en empresas B2B de Chile. No configuramos la herramienta y nos vamos, construimos el motor de ingresos completo.',
  metadata = jsonb_set(
    metadata::jsonb, '{stats}', '[{"value":"Platinum","label":"Nivel de partnership HubSpot"},{"value":"14 años","label":"Operando en Chile","counter":14},{"value":"5 Hubs","label":"Implementamos todo el ecosistema"}]'::jsonb
  )
WHERE id = 'b0a27b2b-434a-4c43-b29d-3c4e4e998f6a';

-- Update Posicionamiento body: replace em dashes
UPDATE page_sections SET 
  body = 'Hay cientos de partners de HubSpot en el mundo. La diferencia no está en el badge, está en el enfoque.||La mayoría llega, configura HubSpot según las mejores prácticas del manual, entrega el portal y desaparece. El equipo lo adopta parcialmente, los procesos se deterioran en 90 días y seis meses después nadie sabe si HubSpot está sirviendo para algo.'
WHERE id = 'e1d5ad3a-6190-4e7b-8df6-1b4e5e651937';

-- Update Ecosistema: replace em dashes in subtitle and hub descriptions
UPDATE page_sections SET 
  subtitle = 'Cada Hub de HubSpot es una pieza de la pista. La diferencia entre una implementación que funciona y una que no es si las piezas están conectadas entre sí, y con el proceso real del negocio.',
  metadata = jsonb_set(metadata::jsonb, '{hubs}', '[{"badge":"GENERA LA DEMANDA","badgeColor":"#BE1869","icon":"megaphone","title":"Marketing Hub","desc":"Formularios, emails, nurturing, lead scoring, landing pages y atribución. Para que marketing demuestre su impacto real en el pipeline, no solo en clics e impresiones.","tag":"Ideal para equipos de marketing"},{"badge":"CONVIERTE LEADS","badgeColor":"#0779D7","icon":"chart","title":"Sales Hub","desc":"Pipeline con etapas claras, automatizaciones de seguimiento, secuencias, playbooks y forecast confiable. Para que el Director Comercial lidere con datos, no con intuición.","tag":"Ideal para equipos comerciales"},{"badge":"RETIENE Y EXPANDE","badgeColor":"#1CA398","icon":"heart","title":"Service Hub","desc":"Tickets, NPS, CSAT y alertas de churn. Para conectar la postventa al motor de ingresos completo, y que CS deje de ser invisible en la estrategia comercial.","tag":"Ideal para equipos de Customer Success"},{"badge":"CONECTA TODO","badgeColor":"#6224BE","icon":"settings","title":"Operations Hub","desc":"Sincronización de datos, limpieza automática y workflows operativos avanzados. La pieza que hace que el resto del ecosistema funcione bien, cuando los datos están limpios, todas las decisiones mejoran.","tag":"Ideal para empresas con stack complejo"},{"badge":"CIERRA EL CICLO","badgeColor":"#BE1869","icon":"globe","title":"Content Hub","desc":"Sitio web, blog, landing pages y SEO integrado en HubSpot. Para que cada visita, formulario y descarga quede registrada automáticamente en el perfil del contacto.","tag":"Ideal para presencia digital integrada al CRM"}]'::jsonb)
WHERE id = '00c24243-7170-4efa-b75b-d897c1614fe7';

-- Update Como Trabajamos steps: replace em dashes
UPDATE page_sections SET 
  metadata = jsonb_set(metadata::jsonb, '{steps}', '[{"num":"01","title":"Diagnóstico primero","desc":"Mapeamos tu operación comercial real antes de configurar cualquier cosa. Sin este paso, HubSpot queda configurado para una empresa ideal que no existe.","chip":"Siempre el primer paso"},{"num":"02","title":"Diseño antes de construir","desc":"Arquitectura completa documentada y validada con el equipo antes de tocar el portal. Qué propiedades, qué pipeline, qué automatizaciones, qué reportes.","chip":"Cero sorpresas"},{"num":"03","title":"Implementación con el equipo","desc":"Construimos junto al equipo que va a usar el sistema, no para ellos. La adopción no es un problema de capacitación: es un problema de participación en el diseño.","chip":"Adopción garantizada"},{"num":"04","title":"Activación y acompañamiento","desc":"No entregamos el portal y desaparecemos. Acompañamos la activación, medimos el uso real y hacemos los ajustes necesarios. El sistema queda funcionando, no solo configurado.","chip":"Siempre incluido"}]'::jsonb)
WHERE id = '5b85fdbb-969e-44ce-8d87-d0cc67ecd930';