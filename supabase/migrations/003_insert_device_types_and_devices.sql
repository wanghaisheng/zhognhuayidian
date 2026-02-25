-- 插入设备类型
INSERT INTO device_types (name, slug, category, description, translations) VALUES
('CT Scanner', 'ct-scanner', 'ct', 'Computed Tomography scanner for medical imaging diagnosis', '{"zh": {"name": "CT扫描仪", "description": "计算机断层扫描设备，用于医学影像诊断"}, "en": {"name": "CT Scanner", "description": "Computed Tomography scanner for medical imaging diagnosis"}}'),
('MRI Scanner', 'mri-scanner', 'mri', 'Magnetic Resonance Imaging scanner for medical imaging diagnosis', '{"zh": {"name": "MRI扫描仪", "description": "磁共振成像设备，用于医学影像诊断"}, "en": {"name": "MRI Scanner", "description": "Magnetic Resonance Imaging scanner for medical imaging diagnosis"}}'),
('16-Slice CT', '16-slice-ct', 'ct', '16-slice spiral CT scanner', '{"zh": {"name": "16层CT", "description": "16层螺旋CT扫描仪"}, "en": {"name": "16-Slice CT", "description": "16-slice spiral CT scanner"}}'),
('32-Slice CT', '32-slice-ct', 'ct', '32-slice spiral CT scanner', '{"zh": {"name": "32层CT", "description": "32层螺旋CT扫描仪"}, "en": {"name": "32-Slice CT", "description": "32-slice spiral CT scanner"}}'),
('64-Slice CT', '64-slice-ct', 'ct', '64-slice spiral CT scanner', '{"zh": {"name": "64层CT", "description": "64层螺旋CT扫描仪"}, "en": {"name": "64-Slice CT", "description": "64-slice spiral CT scanner"}}'),
('128-Slice CT', '128-slice-ct', 'ct', '128-slice spiral CT scanner', '{"zh": {"name": "128层CT", "description": "128层螺旋CT扫描仪"}, "en": {"name": "128-Slice CT", "description": "128-slice spiral CT scanner"}}'),
('256-Slice CT', '256-slice-ct', 'ct', '256-slice spiral CT scanner', '{"zh": {"name": "256层CT", "description": "256层螺旋CT扫描仪"}, "en": {"name": "256-Slice CT", "description": "256-slice spiral CT scanner"}}'),
('320-Slice CT', '320-slice-ct', 'ct', '320-slice spiral CT scanner', '{"zh": {"name": "320层CT", "description": "320层螺旋CT扫描仪"}, "en": {"name": "320-Slice CT", "description": "320-slice spiral CT scanner"}}'),
('1.5T MRI', '1-5t-mri', 'mri', '1.5 Tesla MRI scanner', '{"zh": {"name": "1.5T磁共振", "description": "1.5特斯拉磁共振成像设备"}, "en": {"name": "1.5T MRI", "description": "1.5 Tesla MRI scanner"}}'),
('3.0T MRI', '3-0t-mri', 'mri', '3.0 Tesla MRI scanner', '{"zh": {"name": "3.0T磁共振", "description": "3.0特斯拉磁共振成像设备"}, "en": {"name": "3.0T MRI", "description": "3.0 Tesla MRI scanner"}}'),
('5.0T MRI', '5-0t-mri', 'mri', '5.0 Tesla MRI scanner', '{"zh": {"name": "5.0T磁共振", "description": "5.0特斯拉磁共振成像设备"}, "en": {"name": "5.0T MRI", "description": "5.0 Tesla MRI scanner"}}');

-- 插入部分设备数据（基于提供的JSON数据）
-- GE Healthcare CT设备
INSERT INTO devices (manufacturer_id, device_type_id, name, model, slug, category, price_range_min, price_range_max, price_currency, slice_count, description, specifications, release_year, is_active, image_url, brochure_url, translations) 
SELECT 
  m.id,
  dt.id,
  'Revolution Apex Expert',
  'Revolution Apex Expert',
  'ge-revolution-apex-expert',
  'ct',
  201913000,
  201913000,
  'CNY',
  NULL,
  'High-end CT system',
  '{"detector_type": "Not specified", "market_share": "2.74%"}',
  2020,
  true,
  NULL, NULL,
  '{"zh": {"description": "高端CT系统"}, "en": {"description": "High-end CT system"}}'
FROM manufacturers m, device_types dt 
WHERE m.slug = 'ge-healthcare' AND dt.slug = 'ct-scanner';

INSERT INTO devices (manufacturer_id, device_type_id, name, model, slug, category, price_range_min, price_range_max, price_currency, slice_count, description, specifications, release_year, is_active, image_url, brochure_url, translations) 
SELECT 
  m.id,
  dt.id,
  'Revolution CT',
  'Revolution CT',
  'ge-revolution-ct',
  'ct',
  146871000,
  146871000,
  'CNY',
  NULL,
  'Advanced CT System',
  '{"detector_type": "Not specified", "market_share": "2.74%"}',
  2019,
  true,
  NULL, NULL,
  '{"zh": {"description": "先进CT系统"}, "en": {"description": "Advanced CT System"}}'
FROM manufacturers m, device_types dt 
WHERE m.slug = 'ge-healthcare' AND dt.slug = 'ct-scanner';

INSERT INTO devices (manufacturer_id, device_type_id, name, model, slug, category, price_range_min, price_range_max, price_currency, slice_count, description, specifications, release_year, is_active, image_url, brochure_url, translations) 
SELECT 
  m.id,
  dt.id,
  'Optima CT680 Expert',
  'Optima CT680 Expert',
  'ge-optima-ct680-expert',
  'ct',
  64761000,
  64761000,
  'CNY',
  64,
  'Mid-Range CT System',
  '{"detector_type": "Not specified", "market_share": "2.74%"}',
  2018,
  true,
  NULL, NULL,
  '{"zh": {"description": "中端CT系统"}, "en": {"description": "Mid-Range CT System"}}'
FROM manufacturers m, device_types dt 
WHERE m.slug = 'ge-healthcare' AND dt.slug = '64-slice-ct';

-- GE Healthcare MRI设备
INSERT INTO devices (manufacturer_id, device_type_id, name, model, slug, category, price_range_min, price_range_max, price_currency, field_strength, description, specifications, release_year, is_active, image_url, brochure_url, translations) 
SELECT 
  m.id,
  dt.id,
  'SIGNA',
  'SIGNA',
  'ge-signa',
  'mri',
  145499000,
  145499000,
  'CNY',
  1.5,
  'MRI System',
  '{"magnet_type": "Superconducting"}',
  2019,
  true,
  NULL, NULL,
  '{"zh": {"description": "MRI系统"}, "en": {"description": "MRI System"}}'
FROM manufacturers m, device_types dt 
WHERE m.slug = 'ge-healthcare' AND dt.slug = '1-5t-mri';

-- Siemens CT设备
INSERT INTO devices (manufacturer_id, device_type_id, name, model, slug, category, price_range_min, price_range_max, price_currency, slice_count, description, specifications, release_year, is_active, image_url, brochure_url, translations) 
SELECT 
  m.id,
  dt.id,
  'SOMATOM Drive',
  'SOMATOM Drive',
  'siemens-somatom-drive',
  'ct',
  172335000,
  172335000,
  'CNY',
  128,
  'High-end CT system',
  '{"detector_type": "Not specified", "market_share": "2.93%"}',
  2020,
  true,
  NULL, NULL,
  '{"zh": {"description": "高端CT系统"}, "en": {"description": "High-end CT system"}}'
FROM manufacturers m, device_types dt 
WHERE m.slug = 'siemens-healthineers' AND dt.slug = '128-slice-ct';

INSERT INTO devices (manufacturer_id, device_type_id, name, model, slug, category, price_range_min, price_range_max, price_currency, slice_count, description, specifications, release_year, is_active, image_url, brochure_url, translations) 
SELECT 
  m.id,
  dt.id,
  'SOMATOM Force',
  'SOMATOM Force',
  'siemens-somatom-force',
  'ct',
  212027000,
  212027000,
  'CNY',
  128,
  'High-end CT system',
  '{"detector_type": "Not specified", "market_share": "2.93%"}',
  2019,
  true,
  NULL, NULL,
  '{"zh": {"description": "高端CT系统"}, "en": {"description": "High-end CT system"}}'
FROM manufacturers m, device_types dt 
WHERE m.slug = 'siemens-healthineers' AND dt.slug = '128-slice-ct';

-- Siemens MRI设备
INSERT INTO devices (manufacturer_id, device_type_id, name, model, slug, category, price_range_min, price_range_max, price_currency, field_strength, description, specifications, release_year, is_active, image_url, brochure_url, translations) 
SELECT 
  m.id,
  dt.id,
  'MAGNETOM Vida',
  'MAGNETOM Vida',
  'siemens-magnetom-vida',
  'mri',
  198979000,
  198979000,
  'CNY',
  3.0,
  'High-End MRI System',
  '{"magnet_type": "Superconducting"}',
  2020,
  true,
  NULL, NULL,
  '{"zh": {"description": "高端MRI系统"}, "en": {"description": "High-End MRI System"}}'
FROM manufacturers m, device_types dt 
WHERE m.slug = 'siemens-healthineers' AND dt.slug = '3-0t-mri';

-- United Imaging CT设备
INSERT INTO devices (manufacturer_id, device_type_id, name, model, slug, category, price_range_min, price_range_max, price_currency, slice_count, description, specifications, release_year, is_active, image_url, brochure_url, translations) 
SELECT 
  m.id,
  dt.id,
  'uCT 960+',
  'uCT 960+',
  'united-imaging-uct-960-plus',
  'ct',
  142651000,
  142651000,
  'CNY',
  128,
  'High-end CT System',
  '{"detector_type": "Not specified", "market_share": "11.15%"}',
  2021,
  true,
  NULL, NULL,
  '{"zh": {"description": "高端CT系统"}, "en": {"description": "High-end CT System"}}'
FROM manufacturers m, device_types dt 
WHERE m.slug = 'united-imaging-healthcare' AND dt.slug = '128-slice-ct';

INSERT INTO devices (manufacturer_id, device_type_id, name, model, slug, category, price_range_min, price_range_max, price_currency, slice_count, description, specifications, release_year, is_active, image_url, brochure_url, translations) 
SELECT 
  m.id,
  dt.id,
  'uCT 528',
  'uCT 528',
  'united-imaging-uct-528',
  'ct',
  26942000,
  26942000,
  'CNY',
  64,
  'Mid-Range CT System',
  '{"detector_type": "Not specified", "market_share": "11.15%"}',
  2020,
  true,
  NULL, NULL,
  '{"zh": {"description": "中端CT系统"}, "en": {"description": "Mid-Range CT System"}}'
FROM manufacturers m, device_types dt 
WHERE m.slug = 'united-imaging-healthcare' AND dt.slug = '64-slice-ct';

-- United Imaging MRI设备
INSERT INTO devices (manufacturer_id, device_type_id, name, model, slug, category, price_range_min, price_range_max, price_currency, field_strength, description, specifications, release_year, is_active, image_url, brochure_url, translations) 
SELECT 
  m.id,
  dt.id,
  'uMR 880',
  'uMR 880',
  'united-imaging-umr-880',
  'mri',
  180687000,
  180687000,
  'CNY',
  3.0,
  'High-End MRI System',
  '{"magnet_type": "Superconducting"}',
  2021,
  true,
  NULL, NULL,
  '{"zh": {"description": "高端MRI系统"}, "en": {"description": "High-End MRI System"}}'
FROM manufacturers m, device_types dt 
WHERE m.slug = 'united-imaging-healthcare' AND dt.slug = '3-0t-mri';

INSERT INTO devices (manufacturer_id, device_type_id, name, model, slug, category, price_range_min, price_range_max, price_currency, field_strength, description, specifications, release_year, is_active, image_url, brochure_url, translations) 
SELECT 
  m.id,
  dt.id,
  'uMR Jupiter',
  'uMR Jupiter',
  'united-imaging-umr-jupiter',
  'mri',
  NULL,
  NULL,
  'CNY',
  5.0,
  'World''s first whole-body 5.0T MRI scanner',
  '{"magnet_type": "Superconducting", "breakthrough": "World first 5.0T whole body MRI"}',
  2021,
  true,
  NULL, NULL,
  '{"zh": {"description": "世界首台全身5.0T MRI扫描仪"}, "en": {"description": "World''s first whole-body 5.0T MRI scanner"}}'
FROM manufacturers m, device_types dt 
WHERE m.slug = 'united-imaging-healthcare' AND dt.slug = '5-0t-mri';

-- Neusoft Medical CT设备
INSERT INTO devices (manufacturer_id, device_type_id, name, model, slug, category, price_range_min, price_range_max, price_currency, slice_count, description, specifications, release_year, is_active, image_url, brochure_url, translations) 
SELECT 
  m.id,
  dt.id,
  'NeuViz Epoch',
  'NeuViz Epoch',
  'neusoft-neuviz-epoch',
  'ct',
  184830000,
  184830000,
  'CNY',
  128,
  'High-end CT System',
  '{"detector_type": "Not specified", "market_share": "72.35%"}',
  2020,
  true,
  NULL, NULL,
  '{"zh": {"description": "高端CT系统"}, "en": {"description": "High-end CT System"}}'
FROM manufacturers m, device_types dt 
WHERE m.slug = 'neusoft-medical-systems' AND dt.slug = '128-slice-ct';

INSERT INTO devices (manufacturer_id, device_type_id, name, model, slug, category, price_range_min, price_range_max, price_currency, slice_count, description, specifications, release_year, is_active, image_url, brochure_url, translations) 
SELECT 
  m.id,
  dt.id,
  'NeuViz 128',
  'NeuViz 128',
  'neusoft-neuviz-128',
  'ct',
  46488000,
  46488000,
  'CNY',
  128,
  'Mid-Range CT System',
  '{"detector_type": "Not specified", "market_share": "72.35%"}',
  2019,
  true,
  NULL, NULL,
  '{"zh": {"description": "中端CT系统"}, "en": {"description": "Mid-Range CT System"}}'
FROM manufacturers m, device_types dt 
WHERE m.slug = 'neusoft-medical-systems' AND dt.slug = '128-slice-ct';

-- Neusoft Medical MRI设备
INSERT INTO devices (manufacturer_id, device_type_id, name, model, slug, category, price_range_min, price_range_max, price_currency, field_strength, description, specifications, release_year, is_active, image_url, brochure_url, translations) 
SELECT 
  m.id,
  dt.id,
  'NeuMR Rena',
  'NeuMR Rena',
  'neusoft-neumr-rena',
  'mri',
  77000000,
  77000000,
  'CNY',
  1.5,
  'MRI System',
  '{"magnet_type": "Superconducting"}',
  2020,
  true,
  NULL, NULL,
  '{"zh": {"description": "MRI系统"}, "en": {"description": "MRI System"}}'
FROM manufacturers m, device_types dt 
WHERE m.slug = 'neusoft-medical-systems' AND dt.slug = '1-5t-mri';
