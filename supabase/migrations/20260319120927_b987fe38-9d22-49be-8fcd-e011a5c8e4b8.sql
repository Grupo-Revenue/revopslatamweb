UPDATE page_sections 
SET 
  title = 'Cada mes se pierden negocios. Nosotros encontramos dónde.',
  subtitle = 'En Revops LATAM no llegamos a decirte que tienes problemas, llegamos a mostrarte cuáles son, dónde están y cuánto te están costando. Con metodología, con datos y con 14 años en el mercado chileno.',
  cta_text = 'Quiero saber dónde se pierden mis negocios →',
  metadata = jsonb_set(metadata, '{title_line_break}', '"Nosotros encontramos dónde."'),
  updated_at = now()
WHERE id = 'e2b5dd37-2a4a-4b9c-9b16-f28cb45f5501';