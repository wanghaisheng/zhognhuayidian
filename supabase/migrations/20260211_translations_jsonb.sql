BEGIN;

-- Add translations JSONB column (with empty object default) to key tables
ALTER TABLE public.manufacturers
  ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}'::jsonb;

ALTER TABLE public.devices
  ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}'::jsonb;

ALTER TABLE public.articles
  ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}'::jsonb;

ALTER TABLE public.customers
  ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}'::jsonb;

-- Backfill manufacturers translations from legacy *_en/*_zh fields
UPDATE public.manufacturers m
SET translations = jsonb_strip_nulls(
  jsonb_build_object(
    'en', jsonb_build_object(
      'name', m.name_en,
      'description', m.description_en
    ),
    'zh', jsonb_build_object(
      'name', m.name_zh,
      'description', m.description_zh
    )
  )
)
WHERE (m.name_en IS NOT NULL OR m.name_zh IS NOT NULL OR m.description_en IS NOT NULL OR m.description_zh IS NOT NULL);

-- Backfill devices translations from legacy *_en/*_zh fields
UPDATE public.devices d
SET translations = jsonb_strip_nulls(
  jsonb_build_object(
    'en', jsonb_build_object(
      'name', d.name_en,
      'description', d.description_en,
      'features', d.features_en,
      'applications', d.applications_en
    ),
    'zh', jsonb_build_object(
      'name', d.name_zh,
      'description', d.description_zh,
      'features', d.features_zh,
      'applications', d.applications_zh
    )
  )
)
WHERE (d.name_en IS NOT NULL OR d.name_zh IS NOT NULL OR d.description_en IS NOT NULL OR d.description_zh IS NOT NULL
   OR d.features_en IS NOT NULL OR d.features_zh IS NOT NULL
   OR d.applications_en IS NOT NULL OR d.applications_zh IS NOT NULL);

-- Backfill articles translations from legacy *_en/*_zh fields
UPDATE public.articles a
SET translations = jsonb_strip_nulls(
  jsonb_build_object(
    'en', jsonb_build_object(
      'title', a.title_en,
      'excerpt', a.excerpt_en,
      'content', a.content_en
    ),
    'zh', jsonb_build_object(
      'title', a.title_zh,
      'excerpt', a.excerpt_zh,
      'content', a.content_zh
    )
  )
)
WHERE (a.title_en IS NOT NULL OR a.title_zh IS NOT NULL 
   OR a.excerpt_en IS NOT NULL OR a.excerpt_zh IS NOT NULL
   OR a.content_en IS NOT NULL OR a.content_zh IS NOT NULL);

-- Backfill customers translations from legacy *_en/*_zh fields
UPDATE public.customers c
SET translations = jsonb_strip_nulls(
  jsonb_build_object(
    'en', jsonb_build_object(
      'name', c.name_en,
      'description', c.description_en
    ),
    'zh', jsonb_build_object(
      'name', c.name_zh,
      'description', c.description_zh
    )
  )
)
WHERE (c.name_en IS NOT NULL OR c.name_zh IS NOT NULL OR c.description_en IS NOT NULL OR c.description_zh IS NOT NULL);

-- Optional: create functional indexes to speed up common lookups (examples)
-- CREATE INDEX IF NOT EXISTS idx_articles_translations_en_title ON public.articles ((translations->'en'->>'title'));
-- CREATE INDEX IF NOT EXISTS idx_manufacturers_translations_en_name ON public.manufacturers ((translations->'en'->>'name'));

COMMIT;
