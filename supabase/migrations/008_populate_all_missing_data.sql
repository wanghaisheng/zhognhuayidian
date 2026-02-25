-- 008_populate_all_missing_data.sql
-- 同步制造商、设备以及添加客户数据

-- 1. 补充缺失的制造商
INSERT INTO manufacturers (name, slug, country, website, is_chinese, translations)
VALUES 
('Kaiying Medical', 'kaiying-medical', 'China', 'https://www.kaiyingmedical.com/', true, '{"zh": {"name": "开影医疗"}, "en": {"name": "Kaiying Medical"}}'),
('Nanjing Perlove Medical Equipment Co., Ltd', 'perlove-medical', 'China', 'https://www.perlove.com.cn/', true, '{"zh": {"name": "普朗医疗"}, "en": {"name": "Nanjing Perlove Medical Equipment Co., Ltd"}}'),
('Hitachi Healthcare', 'hitachi-healthcare', 'Japan', 'https://www.hitachi.co.jp/', false, '{"zh": {"name": "日立医疗"}, "en": {"name": "Hitachi Healthcare"}}'),
('Samsung Healthcare', 'samsung-healthcare', 'South Korea', 'https://www.samsung.com/', false, '{"zh": {"name": "三星医疗"}, "en": {"name": "Samsung Healthcare"}}'),
('Carestream Health', 'carestream-health', 'United States', 'https://www.carestream.com/', false, '{"zh": {"name": "锐珂医疗"}, "en": {"name": "Carestream Health"}}'),
('Shimadzu Corporation', 'shimadzu', 'Japan', 'https://www.shimadzu.co.jp/', false, '{"zh": {"name": "岛津制作所"}, "en": {"name": "Shimadzu Corporation"}}'),
('Mindray', 'mindray', 'China', 'https://www.mindray.com/', true, '{"zh": {"name": "迈瑞医疗"}, "en": {"name": "Mindray"}}')
ON CONFLICT (slug) DO NOTHING;

-- 统一制造商Slug (如果需要的话，但由于关联关系，建议保持现状或小心处理)
-- 这里我们暂时只同步元数据

-- 2. 补充缺失的设备
-- GE
INSERT INTO devices (manufacturer_id, device_type_id, name, model, slug, category, price_range_min, price_range_max, is_active, translations)
SELECT 
  (SELECT id FROM manufacturers WHERE slug = 'ge-healthcare'),
  (SELECT id FROM device_types WHERE slug = '1-5t-mri'),
  'SIGNA Pioneer', 'SIGNA Pioneer', 'ge-signa-pioneer', 'mri', 16718600, 16718600, true, '{"en": {"name": "SIGNA Pioneer"}}'
WHERE NOT EXISTS (SELECT 1 FROM devices WHERE slug = 'ge-signa-pioneer');

-- Siemens
INSERT INTO devices (manufacturer_id, device_type_id, name, model, slug, category, price_range_min, price_range_max, is_active, translations)
SELECT 
  (SELECT id FROM manufacturers WHERE slug = 'siemens-healthineers'),
  (SELECT id FROM device_types WHERE slug = '3-0t-mri'),
  'MAGNETOM Lumina', 'MAGNETOM Lumina', 'siemens-magnetom-lumina', 'mri', 18800300, 18800300, true, '{"en": {"name": "MAGNETOM Lumina"}}'
WHERE NOT EXISTS (SELECT 1 FROM devices WHERE slug = 'siemens-magnetom-lumina');

INSERT INTO devices (manufacturer_id, device_type_id, name, model, slug, category, price_range_min, price_range_max, is_active, translations)
SELECT 
  (SELECT id FROM manufacturers WHERE slug = 'siemens-healthineers'),
  (SELECT id FROM device_types WHERE slug = '1-5t-mri'),
  'MAGNETOM Mica', 'MAGNETOM Mica', 'siemens-magnetom-mica', 'mri', 8981600, 8981600, true, '{"en": {"name": "MAGNETOM Mica"}}'
WHERE NOT EXISTS (SELECT 1 FROM devices WHERE slug = 'siemens-magnetom-mica');

-- Philips
INSERT INTO devices (manufacturer_id, device_type_id, name, model, slug, category, price_range_min, price_range_max, is_active, translations)
SELECT 
  (SELECT id FROM manufacturers WHERE slug = 'philips-healthcare'),
  (SELECT id FROM device_types WHERE slug = '3-0t-mri'),
  'Ingenia Elition S', 'Ingenia Elition S', 'philips-ingenia-elition-s', 'mri', 21492300, 21492300, true, '{"en": {"name": "Ingenia Elition S"}}'
WHERE NOT EXISTS (SELECT 1 FROM devices WHERE slug = 'philips-ingenia-elition-s');

-- UIH (United Imaging) - 修正Slug引用
INSERT INTO devices (manufacturer_id, device_type_id, name, model, slug, category, price_range_min, price_range_max, is_active, translations)
SELECT 
  (SELECT id FROM manufacturers WHERE slug IN ('united-imaging-healthcare', 'united-imaging') LIMIT 1),
  (SELECT id FROM device_types WHERE slug = '3-0t-mri'),
  'uMR 870', 'uMR 870', 'uih-umr-870', 'mri', 18430000, 18430000, true, '{"en": {"name": "uMR 870"}, "zh": {"name": "uMR 870"}}'
WHERE NOT EXISTS (SELECT 1 FROM devices WHERE slug = 'uih-umr-870');

-- 3. 插入客户数据
INSERT INTO customers (name, type, location_country, location_province, location_city, website, translations)
VALUES 
('Foshan Gaoming District People''s Hospital', 'hospital', 'China', '广东省', '佛山市', 'http://www.fsgmry.com/', '{"zh": {"name": "佛山市高明区人民医院"}, "en": {"name": "Foshan Gaoming District People''s Hospital"}}'),
('Jiande First People''s Hospital', 'hospital', 'China', '浙江省', '杭州市', 'http://www.jdyy.com/', '{"zh": {"name": "建德市第一人民医院"}, "en": {"name": "Jiande First People''s Hospital"}}'),
('Zhejiang Provincial Hospital of Traditional Chinese Medicine', 'hospital', 'China', '浙江省', '杭州市', 'http://www.zjhtcm.com/', '{"zh": {"name": "浙江省中医院"}, "en": {"name": "Zhejiang Provincial Hospital of Traditional Chinese Medicine"}}'),
('Haiyan County People''s Hospital', 'hospital', 'China', '浙江省', '嘉兴市', NULL, '{"zh": {"name": "海盐县人民医院"}, "en": {"name": "Haiyan County People''s Hospital"}}'),
('Changxing County TCM Hospital', 'hospital', 'China', '浙江省', '湖州市', NULL, '{"zh": {"name": "长兴县中医院"}, "en": {"name": "Changxing County TCM Hospital"}}'),
('Taiyuan Traditional Chinese Medicine Hospital', 'hospital', 'China', '山西省', '太原市', NULL, '{"zh": {"name": "太原市中医医院"}, "en": {"name": "Taiyuan Traditional Chinese Medicine Hospital"}}'),
('Hebei Gucheng County Hospital', 'hospital', 'China', '河北省', '衡水市', NULL, '{"zh": {"name": "河北省故城县医院"}, "en": {"name": "Hebei Gucheng County Hospital"}}'),
('Sun Yat-sen University First Affiliated Hospital Guangxi Hospital', 'hospital', 'China', '广西壮族自治区', '南宁市', NULL, '{"zh": {"name": "中山大学附属第一医院广西医院"}, "en": {"name": "Sun Yat-sen University First Affiliated Hospital Guangxi Hospital"}}'),
('Yining County People''s Hospital', 'hospital', 'China', '新疆维吾尔自治区', '伊犁哈萨克自治州', NULL, '{"zh": {"name": "伊宁县人民医院"}, "en": {"name": "Yining County People''s Hospital"}}'),
('Shuguang Hospital Affiliated to Shanghai University of TCM', 'hospital', 'China', '上海市', '上海市', NULL, '{"zh": {"name": "上海中医药大学附属曙光医院"}, "en": {"name": "Shuguang Hospital Affiliated to Shanghai University of TCM"}}'),
('Peking University Third Hospital', 'hospital', 'China', '北京市', '北京市', NULL, '{"zh": {"name": "北京大学第三医院"}, "en": {"name": "Peking University Third Hospital"}}'),
('Shanghai Zhongshan Hospital', 'hospital', 'China', '上海市', '上海市', NULL, '{"zh": {"name": "上海中山医院"}, "en": {"name": "Shanghai Zhongshan Hospital"}}'),
('Fudan University Shanghai Cancer Center', 'hospital', 'China', '上海市', '上海市', NULL, '{"zh": {"name": "复旦大学附属肿瘤医院"}, "en": {"name": "Fudan University Shanghai Cancer Center"}}');

-- 4. 建立客户与设备关联 (购买历史)
-- 注意：这里使用英文名称查询客户ID
INSERT INTO customer_devices (customer_id, device_id, manufacturer_id, purchase_date, contract_amount)
VALUES 
(
  (SELECT id FROM customers WHERE name = 'Foshan Gaoming District People''s Hospital'),
  (SELECT id FROM devices WHERE slug = 'ge-revolution-apex-expert'),
  (SELECT id FROM manufacturers WHERE slug = 'ge-healthcare'),
  '2024-01-15', 20191300
),
(
  (SELECT id FROM customers WHERE name = 'Jiande First People''s Hospital'),
  (SELECT id FROM devices WHERE slug = 'siemens-somatom-drive'),
  (SELECT id FROM manufacturers WHERE slug = 'siemens-healthineers'),
  '2024-02-20', 17233500
),
(
  (SELECT id FROM customers WHERE name = 'Taiyuan Traditional Chinese Medicine Hospital'),
  (SELECT id FROM devices WHERE slug = 'united-imaging-uct-960-plus'),
  (SELECT id FROM manufacturers WHERE slug IN ('united-imaging-healthcare', 'united-imaging') LIMIT 1),
  '2024-01-08', 14265100
);
-- 更多关联可以继续添加...
