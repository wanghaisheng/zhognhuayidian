-- This migration script is superseded by 001_create_base_tables.sql and subsequent migrations.
-- It previously contained conflicting table definitions with legacy language columns (name_zh, name_en).
-- To align with the entity/translations data strategy (using JSONB translations column),
-- the content of this script has been commented out to prevent execution errors or schema conflicts.
-- The tables (devices, manufacturers, articles, customers) are correctly defined in 001_create_base_tables.sql.

/*
-- Create devices table with multilingual fields
CREATE TABLE IF NOT EXISTS public.devices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name_zh TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_zh TEXT,
  description_en TEXT,
  type TEXT NOT NULL,
  manufacturer_id UUID,
  specifications JSONB DEFAULT '{}'::jsonb,
  features_zh TEXT[] DEFAULT ARRAY[]::TEXT[],
  features_en TEXT[] DEFAULT ARRAY[]::TEXT[],
  applications_zh TEXT[] DEFAULT ARRAY[]::TEXT[],
  applications_en TEXT[] DEFAULT ARRAY[]::TEXT[],
  image_url TEXT,
  price_range TEXT,
  release_year INTEGER,
  certifications TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create manufacturers table with multilingual fields
CREATE TABLE IF NOT EXISTS public.manufacturers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name_zh TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_zh TEXT,
  description_en TEXT,
  country TEXT NOT NULL,
  founded_year INTEGER,
  headquarters TEXT,
  website TEXT,
  logo_url TEXT,
  category TEXT[] DEFAULT ARRAY[]::TEXT[],
  market_share NUMERIC(5,2),
  is_featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create articles table for markdown content
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title_zh TEXT NOT NULL,
  title_en TEXT NOT NULL,
  excerpt_zh TEXT,
  excerpt_en TEXT,
  content_zh TEXT,
  content_en TEXT,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  author TEXT,
  featured_image TEXT,
  read_time INTEGER,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create customers table with multilingual fields
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name_zh TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_zh TEXT,
  description_en TEXT,
  province TEXT NOT NULL,
  city TEXT,
  hospital_type TEXT,
  bed_count INTEGER,
  devices JSONB[] DEFAULT ARRAY[]::JSONB[],
  year INTEGER,
  image_url TEXT,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add foreign key constraint for devices.manufacturer_id
ALTER TABLE public.devices 
ADD CONSTRAINT fk_devices_manufacturer 
FOREIGN KEY (manufacturer_id) 
REFERENCES public.manufacturers(id) 
ON DELETE SET NULL;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_devices_slug ON public.devices(slug);
CREATE INDEX IF NOT EXISTS idx_devices_type ON public.devices(type);
CREATE INDEX IF NOT EXISTS idx_devices_manufacturer ON public.devices(manufacturer_id);
CREATE INDEX IF NOT EXISTS idx_devices_published ON public.devices(published);
CREATE INDEX IF NOT EXISTS idx_devices_featured ON public.devices(is_featured);

CREATE INDEX IF NOT EXISTS idx_manufacturers_slug ON public.manufacturers(slug);
CREATE INDEX IF NOT EXISTS idx_manufacturers_country ON public.manufacturers(country);
CREATE INDEX IF NOT EXISTS idx_manufacturers_published ON public.manufacturers(published);
CREATE INDEX IF NOT EXISTS idx_manufacturers_featured ON public.manufacturers(is_featured);

CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_published ON public.articles(published);
CREATE INDEX IF NOT EXISTS idx_articles_tags ON public.articles USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_customers_slug ON public.customers(slug);
CREATE INDEX IF NOT EXISTS idx_customers_province ON public.customers(province);
CREATE INDEX IF NOT EXISTS idx_customers_published ON public.customers(published);

-- Enable Row Level Security
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manufacturers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access
CREATE POLICY "Public read access for published devices"
ON public.devices FOR SELECT
USING (published = true);

CREATE POLICY "Public read access for published manufacturers"
ON public.manufacturers FOR SELECT
USING (published = true);

CREATE POLICY "Public read access for published articles"
ON public.articles FOR SELECT
USING (published = true);

CREATE POLICY "Public read access for published customers"
ON public.customers FOR SELECT
USING (published = true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_devices_updated_at
BEFORE UPDATE ON public.devices
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_manufacturers_updated_at
BEFORE UPDATE ON public.manufacturers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_articles_updated_at
BEFORE UPDATE ON public.articles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
BEFORE UPDATE ON public.customers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
*/
