BEGIN;
DELETE FROM public.articles a
USING public.articles b
WHERE a.slug = b.slug
  AND a.category = 'analysis'
  AND b.category = 'reports';
UPDATE public.articles
SET category = 'reports'
WHERE category = 'analysis';
ALTER TABLE public.articles
ADD CONSTRAINT articles_category_slug_unique UNIQUE (category, slug);
COMMIT;
