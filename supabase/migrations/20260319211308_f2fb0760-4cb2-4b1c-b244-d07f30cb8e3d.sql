UPDATE page_sections SET metadata = jsonb_set(
  (metadata::jsonb - 'cta2_text'),
  '{partner_badge}',
  '"HubSpot Platinum Partner · 10 años en Chile"'
) WHERE id = 'bf6b2a8e-d899-4e4c-b796-87c1065cc1e2';