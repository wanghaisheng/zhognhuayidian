-- 混合内容架构数据库扩展
-- 基于 content-architecture-analysis.md 的设计

-- 1. 设备规格详细表
CREATE TABLE device_specifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
  spec_category VARCHAR(50) NOT NULL, -- 'imaging', 'technical', 'physical', 'software'
  spec_name VARCHAR(100) NOT NULL,
  spec_value VARCHAR(200) NOT NULL,
  spec_unit VARCHAR(20),
  display_order INTEGER DEFAULT 0,
  is_key_spec BOOLEAN DEFAULT false, -- 是否为关键规格
  translations JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 设备评价表
CREATE TABLE device_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
  reviewer_name VARCHAR(100) NOT NULL,
  reviewer_title VARCHAR(100),
  hospital_name VARCHAR(200),
  hospital_type VARCHAR(50), -- 'tertiary', 'secondary', 'primary', 'private'
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  pros TEXT,
  cons TEXT,
  use_case VARCHAR(200), -- 主要使用场景
  verified BOOLEAN DEFAULT FALSE,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 品牌对比表
CREATE TABLE brand_comparisons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_a_id UUID REFERENCES manufacturers(id) ON DELETE CASCADE,
  brand_b_id UUID REFERENCES manufacturers(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL, -- 'ct', 'mri', 'general'
  comparison_slug VARCHAR(255) UNIQUE NOT NULL, -- 用于URL路由
  
  -- 对比维度评分 (1-5分)
  image_quality_a DECIMAL(2,1),
  image_quality_b DECIMAL(2,1),
  service_support_a DECIMAL(2,1),
  service_support_b DECIMAL(2,1),
  cost_value_a DECIMAL(2,1),
  cost_value_b DECIMAL(2,1),
  innovation_a DECIMAL(2,1),
  innovation_b DECIMAL(2,1),
  reliability_a DECIMAL(2,1),
  reliability_b DECIMAL(2,1),
  
  -- 元数据
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewer_id VARCHAR(100), -- 评估者ID
  status VARCHAR(20) DEFAULT 'published', -- 'draft', 'published', 'archived'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 对比标准详细表
CREATE TABLE comparison_criteria (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comparison_id UUID REFERENCES brand_comparisons(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL, -- 'image_quality', 'service', 'cost', 'innovation', 'reliability'
  criterion_name VARCHAR(100) NOT NULL,
  brand_a_score DECIMAL(2,1) NOT NULL,
  brand_b_score DECIMAL(2,1) NOT NULL,
  weight DECIMAL(3,2) DEFAULT 1.00, -- 权重 0.00-1.00
  description TEXT,
  evidence TEXT, -- 评分依据
  display_order INTEGER DEFAULT 0,
  translations JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 内容关联表 (连接数据库内容和Markdown文件)
CREATE TABLE content_relationships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source_type VARCHAR(50) NOT NULL, -- 'device', 'manufacturer', 'comparison', 'education'
  source_id UUID, -- 对应的数据库记录ID
  source_slug VARCHAR(255), -- 对应的slug标识
  content_type VARCHAR(50) NOT NULL, -- 'markdown', 'database', 'hybrid'
  content_path VARCHAR(200) NOT NULL, -- markdown文件路径或数据库表名
  relationship_type VARCHAR(50) NOT NULL, -- 'supplement', 'detail', 'related', 'translation'
  locale VARCHAR(10) DEFAULT 'en', -- 语言标识
  priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. 设备应用场景表
CREATE TABLE device_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
  application_name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL, -- 'neurological', 'cardiac', 'musculoskeletal', 'abdominal', 'pediatric'
  effectiveness_score INTEGER CHECK (effectiveness_score >= 1 AND effectiveness_score <= 5),
  description TEXT,
  typical_protocols TEXT[], -- 典型扫描协议
  advantages TEXT,
  limitations TEXT,
  case_studies_count INTEGER DEFAULT 0,
  translations JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. 内容元数据表 (用于SEO和内容管理)
CREATE TABLE content_metadata (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content_path VARCHAR(200) UNIQUE NOT NULL, -- markdown文件路径
  content_type VARCHAR(50) NOT NULL, -- 'education', 'comparison', 'guide', 'case-study'
  funnel_stage VARCHAR(20), -- 'tofu', 'mofu', 'bofu'
  target_keywords TEXT[],
  related_devices UUID[], -- 关联的设备ID数组
  related_manufacturers UUID[], -- 关联的制造商ID数组
  last_modified TIMESTAMP WITH TIME ZONE,
  word_count INTEGER,
  reading_time_minutes INTEGER,
  seo_score INTEGER, -- SEO评分 0-100
  performance_metrics JSONB, -- 页面性能指标
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_device_specifications_device ON device_specifications(device_id);
CREATE INDEX idx_device_specifications_category ON device_specifications(spec_category);
CREATE INDEX idx_device_reviews_device ON device_reviews(device_id);
CREATE INDEX idx_device_reviews_rating ON device_reviews(rating);
CREATE INDEX idx_brand_comparisons_slug ON brand_comparisons(comparison_slug);
CREATE INDEX idx_brand_comparisons_brands ON brand_comparisons(brand_a_id, brand_b_id);
CREATE INDEX idx_comparison_criteria_comparison ON comparison_criteria(comparison_id);
CREATE INDEX idx_content_relationships_source ON content_relationships(source_type, source_id);
CREATE INDEX idx_content_relationships_path ON content_relationships(content_path);
CREATE INDEX idx_device_applications_device ON device_applications(device_id);
CREATE INDEX idx_device_applications_category ON device_applications(category);
CREATE INDEX idx_content_metadata_path ON content_metadata(content_path);
CREATE INDEX idx_content_metadata_type ON content_metadata(content_type);

-- 创建更新时间触发器
CREATE TRIGGER update_device_reviews_updated_at BEFORE UPDATE ON device_reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_metadata_updated_at BEFORE UPDATE ON content_metadata FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 创建视图：设备完整信息 (数据库 + 关联内容)
CREATE VIEW device_full_info AS
SELECT 
  d.*,
  m.name as manufacturer_name,
  m.slug as manufacturer_slug,
  m.country as manufacturer_country,
  dt.name as device_type_name,
  dt.category as device_category,
  
  -- 聚合规格信息
  (
    SELECT json_agg(
      json_build_object(
        'category', spec_category,
        'name', spec_name,
        'value', spec_value,
        'unit', spec_unit,
        'is_key', is_key_spec,
        'translations', translations
      ) ORDER BY display_order
    )
    FROM device_specifications ds 
    WHERE ds.device_id = d.id
  ) as specifications_detailed,
  
  -- 聚合评价信息
  (
    SELECT json_build_object(
      'average_rating', AVG(rating),
      'review_count', COUNT(*),
      'reviews', json_agg(
        json_build_object(
          'reviewer', reviewer_name,
          'hospital', hospital_name,
          'rating', rating,
          'text', review_text,
          'pros', pros,
          'cons', cons
        ) ORDER BY created_at DESC
      )
    )
    FROM device_reviews dr 
    WHERE dr.device_id = d.id AND dr.verified = true
  ) as review_summary,
  
  -- 关联的内容文件
  (
    SELECT json_agg(
      json_build_object(
        'content_path', content_path,
        'relationship_type', relationship_type,
        'locale', locale
      )
    )
    FROM content_relationships cr 
    WHERE cr.source_type = 'device' AND cr.source_id = d.id AND cr.is_active = true
  ) as related_content

FROM devices d
LEFT JOIN manufacturers m ON d.manufacturer_id = m.id
LEFT JOIN device_types dt ON d.device_type_id = dt.id
WHERE d.is_active = true;

-- 创建视图：品牌对比完整信息
CREATE VIEW brand_comparison_full_info AS
SELECT 
  bc.*,
  ma.name as brand_a_name,
  ma.slug as brand_a_slug,
  mb.name as brand_b_name,
  mb.slug as brand_b_slug,
  
  -- 聚合详细对比标准
  (
    SELECT json_agg(
      json_build_object(
        'category', category,
        'criterion', criterion_name,
        'brand_a_score', brand_a_score,
        'brand_b_score', brand_b_score,
        'weight', weight,
        'description', description,
        'evidence', evidence
      ) ORDER BY display_order
    )
    FROM comparison_criteria cc 
    WHERE cc.comparison_id = bc.id
  ) as detailed_criteria,
  
  -- 关联的内容文件
  (
    SELECT json_agg(
      json_build_object(
        'content_path', content_path,
        'relationship_type', relationship_type,
        'locale', locale
      )
    )
    FROM content_relationships cr 
    WHERE cr.source_type = 'comparison' AND cr.source_slug = bc.comparison_slug AND cr.is_active = true
  ) as related_content

FROM brand_comparisons bc
LEFT JOIN manufacturers ma ON bc.brand_a_id = ma.id
LEFT JOIN manufacturers mb ON bc.brand_b_id = mb.id
WHERE bc.status = 'published';

-- 插入一些示例数据
-- 示例：西门子 vs GE 对比数据
INSERT INTO brand_comparisons (
  brand_a_id, brand_b_id, category, comparison_slug,
  image_quality_a, image_quality_b,
  service_support_a, service_support_b,
  cost_value_a, cost_value_b,
  innovation_a, innovation_b,
  reliability_a, reliability_b,
  reviewer_id, status
) VALUES (
  (SELECT id FROM manufacturers WHERE slug = 'siemens' LIMIT 1),
  (SELECT id FROM manufacturers WHERE slug = 'ge-healthcare' LIMIT 1),
  'ct',
  'siemens-vs-ge-ct-scanners',
  4.5, 4.3,  -- image_quality
  4.2, 4.4,  -- service_support  
  3.8, 4.0,  -- cost_value
  4.6, 4.2,  -- innovation
  4.4, 4.1,  -- reliability
  'system',
  'published'
);

-- 插入对比标准详细数据
INSERT INTO comparison_criteria (comparison_id, category, criterion_name, brand_a_score, brand_b_score, weight, description, display_order) VALUES
(
  (SELECT id FROM brand_comparisons WHERE comparison_slug = 'siemens-vs-ge-ct-scanners'),
  'image_quality', 'Spatial Resolution', 4.5, 4.2, 0.25, 'Ability to distinguish small anatomical structures', 1
),
(
  (SELECT id FROM brand_comparisons WHERE comparison_slug = 'siemens-vs-ge-ct-scanners'),
  'image_quality', 'Contrast Resolution', 4.4, 4.3, 0.25, 'Differentiation between tissues with similar densities', 2
),
(
  (SELECT id FROM brand_comparisons WHERE comparison_slug = 'siemens-vs-ge-ct-scanners'),
  'image_quality', 'Noise Reduction', 4.6, 4.4, 0.20, 'Image clarity and artifact reduction', 3
),
(
  (SELECT id FROM brand_comparisons WHERE comparison_slug = 'siemens-vs-ge-ct-scanners'),
  'service_support', 'Technical Support', 4.1, 4.5, 0.30, '24/7 technical assistance quality', 1
),
(
  (SELECT id FROM brand_comparisons WHERE comparison_slug = 'siemens-vs-ge-ct-scanners'),
  'service_support', 'Training Programs', 4.3, 4.3, 0.25, 'Comprehensive staff training offerings', 2
);

-- 插入内容关联示例
INSERT INTO content_relationships (source_type, source_slug, content_type, content_path, relationship_type, locale, priority) VALUES
('comparison', 'siemens-vs-ge-ct-scanners', 'hybrid', 'content/comparisons/en/siemens-vs-ge-ct-scanners.md', 'detail', 'en', 1),
('comparison', 'siemens-vs-ge-ct-scanners', 'hybrid', 'content/comparisons/zh/siemens-vs-ge-ct-scanners.md', 'detail', 'zh', 1);