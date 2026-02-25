-- 创建基础表结构
-- 制造商表
CREATE TABLE manufacturers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  country VARCHAR(100) NOT NULL,
  founded_year INTEGER,
  headquarters VARCHAR(255),
  website VARCHAR(500),
  market_share_ct DECIMAL(5,2),
  market_share_mri DECIMAL(5,2),
  employee_scale VARCHAR(100),
  annual_revenue VARCHAR(255),
  description TEXT,
  technical_advantages TEXT,
  service_scope VARCHAR(255),
  logo_url VARCHAR(500),
  is_chinese BOOLEAN DEFAULT false,
  translations JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 设备类型表
CREATE TABLE device_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  category VARCHAR(50) NOT NULL, -- 'ct' or 'mri'
  description TEXT,
  translations JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 设备表
CREATE TABLE devices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  manufacturer_id UUID REFERENCES manufacturers(id) ON DELETE CASCADE,
  device_type_id UUID REFERENCES device_types(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  model VARCHAR(255),
  slug VARCHAR(255) UNIQUE NOT NULL,
  category VARCHAR(50) NOT NULL, -- 'ct' or 'mri'
  price_range_min DECIMAL(12,2),
  price_range_max DECIMAL(12,2),
  price_currency VARCHAR(10) DEFAULT 'CNY',
  detector_type VARCHAR(255),
  slice_count INTEGER, -- for CT scanners
  field_strength DECIMAL(3,1), -- for MRI scanners (Tesla)
  magnet_type VARCHAR(100), -- for MRI scanners
  aperture_size INTEGER, -- in cm
  description TEXT,
  specifications JSONB,
  features JSONB,
  certifications TEXT[],
  release_year INTEGER,
  is_active BOOLEAN DEFAULT true,
  image_url VARCHAR(500),
  brochure_url VARCHAR(500),
  translations JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 客户表
CREATE TABLE customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100), -- 'hospital', 'clinic', 'research_institute'
  location_country VARCHAR(100),
  location_province VARCHAR(100),
  location_city VARCHAR(100),
  address TEXT,
  website VARCHAR(500),
  description TEXT,
  image_url VARCHAR(500),
  translations JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 客户设备关联表
CREATE TABLE customer_devices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
  manufacturer_id UUID REFERENCES manufacturers(id) ON DELETE CASCADE,
  purchase_date DATE,
  quantity INTEGER DEFAULT 1,
  contract_amount DECIMAL(15,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 历史事件表
CREATE TABLE historical_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  year INTEGER NOT NULL,
  category VARCHAR(50) NOT NULL, -- 'ct', 'mri', 'general'
  event_title VARCHAR(500) NOT NULL,
  description TEXT,
  manufacturer_id UUID REFERENCES manufacturers(id) ON DELETE SET NULL,
  importance_level INTEGER DEFAULT 1, -- 1-5, 5 being most important
  translations JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 文章/博客表
CREATE TABLE articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  category VARCHAR(100),
  tags TEXT[],
  author VARCHAR(255),
  featured_image VARCHAR(500),
  seo_title VARCHAR(255),
  seo_description TEXT,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  translations JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_manufacturers_slug ON manufacturers(slug);
CREATE INDEX idx_manufacturers_country ON manufacturers(country);
CREATE INDEX idx_manufacturers_chinese ON manufacturers(is_chinese);
CREATE INDEX idx_devices_slug ON devices(slug);
CREATE INDEX idx_devices_category ON devices(category);
CREATE INDEX idx_devices_manufacturer ON devices(manufacturer_id);
CREATE INDEX idx_devices_active ON devices(is_active);
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_published ON articles(is_published);
CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_historical_events_year ON historical_events(year);
CREATE INDEX idx_historical_events_category ON historical_events(category);

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_manufacturers_updated_at BEFORE UPDATE ON manufacturers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_devices_updated_at BEFORE UPDATE ON devices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
