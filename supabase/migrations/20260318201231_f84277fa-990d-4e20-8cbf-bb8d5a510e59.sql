UPDATE public.page_sections 
SET metadata = jsonb_set(
  metadata,
  '{faqs}',
  (
    SELECT jsonb_agg(
      CASE 
        WHEN faq->>'q' LIKE '%RevOps LATAM%' OR faq->>'a' LIKE '%RevOps LATAM%'
        THEN jsonb_build_object(
          'q', replace(faq->>'q', 'RevOps LATAM', 'Revops LATAM'),
          'a', replace(faq->>'a', 'RevOps LATAM', 'Revops LATAM')
        )
        ELSE faq
      END
    )
    FROM jsonb_array_elements(metadata->'faqs') AS faq
  )
)
WHERE id = '812a865a-10ea-44b8-a259-51480650fc4e';