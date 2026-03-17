UPDATE page_sections SET subtitle = REPLACE(subtitle, ' — ', ', ') WHERE subtitle LIKE '%—%';
UPDATE page_sections SET body = REPLACE(body, ' — ', ', ') WHERE body LIKE '%—%';
UPDATE page_sections SET title = REPLACE(title, ' — ', ', ') WHERE title LIKE '%—%';
UPDATE page_sections SET cta_text = REPLACE(cta_text, ' — ', ', ') WHERE cta_text LIKE '%—%';