BEGIN;

-- Manufacturers: expression indexes for common lookups/sorts
CREATE INDEX IF NOT EXISTS idx_manufacturers_translations_en_name
ON public.manufacturers ((translations->'en'->>'name'));

CREATE INDEX IF NOT EXISTS idx_manufacturers_translations_zh_name
ON public.manufacturers ((translations->'zh'->>'name'));

CREATE INDEX IF NOT EXISTS idx_manufacturers_translations_de_name
ON public.manufacturers ((translations->'de'->>'name'));

-- Devices: expression indexes for localized names
CREATE INDEX IF NOT EXISTS idx_devices_translations_en_name
ON public.devices ((translations->'en'->>'name'));

CREATE INDEX IF NOT EXISTS idx_devices_translations_zh_name
ON public.devices ((translations->'zh'->>'name'));

CREATE INDEX IF NOT EXISTS idx_devices_translations_de_name
ON public.devices ((translations->'de'->>'name'));

-- Articles: titles for localized queries
CREATE INDEX IF NOT EXISTS idx_articles_translations_en_title
ON public.articles ((translations->'en'->>'title'));

CREATE INDEX IF NOT EXISTS idx_articles_translations_zh_title
ON public.articles ((translations->'zh'->>'title'));

CREATE INDEX IF NOT EXISTS idx_articles_translations_de_title
ON public.articles ((translations->'de'->>'title'));

COMMIT;
