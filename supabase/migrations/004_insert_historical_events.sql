-- 插入历史事件数据
INSERT INTO historical_events (year, category, event_title, description, manufacturer_id, importance_level, translations) VALUES

-- CT发展历史
(1971, 'ct', 'First CT Scanner Invented', 'Godfrey Hounsfield invented the world''s first CT scanner', 
NULL, 5, 
'{"zh": {"event_title": "首台CT扫描仪发明", "description": "Godfrey Hounsfield发明了世界上第一台CT扫描仪"}, "en": {"event_title": "First CT Scanner Invented", "description": "Godfrey Hounsfield invented the world''s first CT scanner"}}'),

(1972, 'ct', 'First Clinical CT Scan', 'First CT scan performed on a patient', 
NULL, 5, 
'{"zh": {"event_title": "首次临床CT扫描", "description": "第一次在患者身上进行CT扫描"}, "en": {"event_title": "First Clinical CT Scan", "description": "First CT scan performed on a patient"}}'),

(1979, 'ct', 'Nobel Prize for CT', 'Godfrey Hounsfield and Allan Cormack won Nobel Prize in Physiology or Medicine for CT technology', 
NULL, 5, 
'{"zh": {"event_title": "CT技术获诺贝尔奖", "description": "Godfrey Hounsfield和Allan Cormack因CT技术获得诺贝尔生理学或医学奖"}, "en": {"event_title": "Nobel Prize for CT", "description": "Godfrey Hounsfield and Allan Cormack won Nobel Prize in Physiology or Medicine for CT technology"}}'),

-- MRI发展历史
(1982, 'mri', 'China Begins MRI Research', 'China began research in MRI Technology', 
NULL, 4, 
'{"zh": {"event_title": "中国开始MRI技术研究", "description": "中国开始进行MRI技术研究"}, "en": {"event_title": "China Begins MRI Research", "description": "China began research in MRI Technology"}}'),

(1986, 'mri', 'Anke Founded', 'Shenzhen Anke High-tech Co., Ltd. was founded', 
(SELECT id FROM manufacturers WHERE slug = 'anke-medical'), 3, 
'{"zh": {"event_title": "安科公司成立", "description": "深圳安科高技术股份有限公司成立"}, "en": {"event_title": "Anke Founded", "description": "Shenzhen Anke High-tech Co., Ltd. was founded"}}'),

(1987, 'mri', 'First Chinese MRI', 'Anke introduced China''s first 0.15T permanent magnet MRI', 
(SELECT id FROM manufacturers WHERE slug = 'anke-medical'), 4, 
'{"zh": {"event_title": "中国首台MRI", "description": "安科推出中国第一台0.15T永磁MRI"}, "en": {"event_title": "First Chinese MRI", "description": "Anke introduced China''s first 0.15T permanent magnet MRI"}}'),

(1992, 'mri', 'First Superconducting MRI', 'Anke produced their first superconducting MRI machine', 
(SELECT id FROM manufacturers WHERE slug = 'anke-medical'), 4, 
'{"zh": {"event_title": "首台超导MRI", "description": "安科生产出第一台超导MRI机器"}, "en": {"event_title": "First Superconducting MRI", "description": "Anke produced their first superconducting MRI machine"}}'),

(2005, 'general', 'United Imaging Founded', 'United Imaging is founded', 
(SELECT id FROM manufacturers WHERE slug = 'united-imaging-healthcare'), 3, 
'{"zh": {"event_title": "联影医疗成立", "description": "联影医疗成立"}, "en": {"event_title": "United Imaging Founded", "description": "United Imaging is founded"}}'),

(2007, 'mri', 'First Chinese 1.5T MRI', 'Austar Medical''s Centauri 1.5T was the first completely China-made superconducting MRI machine', 
NULL, 4, 
'{"zh": {"event_title": "首台国产1.5T MRI", "description": "奥泰医疗的Centauri 1.5T成为第一台完全中国制造的超导MRI机器"}, "en": {"event_title": "First Chinese 1.5T MRI", "description": "Austar Medical''s Centauri 1.5T was the first completely China-made superconducting MRI machine"}}'),

(2008, 'mri', 'First Export to US', 'Austar Medical made history with their first sale of a Chinese-made 1.5T superconducting MRI scanner to an American hospital', 
NULL, 4, 
'{"zh": {"event_title": "首次出口美国", "description": "奥泰医疗创造历史，首次向美国医院销售中国制造的1.5T超导MRI扫描仪"}, "en": {"event_title": "First Export to US", "description": "Austar Medical made history with their first sale of a Chinese-made 1.5T superconducting MRI scanner to an American hospital"}}'),

(2011, 'general', 'United Imaging Launched', 'United Imaging is launched by Dr. Xue Min', 
(SELECT id FROM manufacturers WHERE slug = 'united-imaging-healthcare'), 3, 
'{"zh": {"event_title": "联影医疗正式启动", "description": "联影医疗由薛敏博士正式启动"}, "en": {"event_title": "United Imaging Launched", "description": "United Imaging is launched by Dr. Xue Min"}}'),

(2015, 'mri', '3T MRI and FDA Approval', 'United Imaging entered the 3T MRI space with their own machine, and Austar''s 71cm large-bore 1.5T MRI system received FDA approval', 
(SELECT id FROM manufacturers WHERE slug = 'united-imaging-healthcare'), 4, 
'{"zh": {"event_title": "3T MRI和FDA批准", "description": "联影医疗进入3T MRI领域，奥泰的71cm大孔径1.5T MRI系统获得FDA批准"}, "en": {"event_title": "3T MRI and FDA Approval", "description": "United Imaging entered the 3T MRI space with their own machine, and Austar''s 71cm large-bore 1.5T MRI system received FDA approval"}}'),

(2020, 'mri', 'World First 75cm 3.0T MRI', 'United Imaging launched the world''s first 75cm large-bore 3.0T MRI system', 
(SELECT id FROM manufacturers WHERE slug = 'united-imaging-healthcare'), 5, 
'{"zh": {"event_title": "世界首台75cm 3.0T MRI", "description": "联影医疗推出世界首台75cm大孔径3.0T MRI系统"}, "en": {"event_title": "World First 75cm 3.0T MRI", "description": "United Imaging launched the world''s first 75cm large-bore 3.0T MRI system"}}'),

(2021, 'mri', 'World First 5.0T MRI', 'United Imaging released the world''s first whole-body 5.0T MRI scanner, the uMR Jupiter', 
(SELECT id FROM manufacturers WHERE slug = 'united-imaging-healthcare'), 5, 
'{"zh": {"event_title": "世界首台5.0T MRI", "description": "联影医疗发布世界首台全身5.0T MRI扫描仪uMR Jupiter"}, "en": {"event_title": "World First 5.0T MRI", "description": "United Imaging released the world''s first whole-body 5.0T MRI scanner, the uMR Jupiter"}}');
