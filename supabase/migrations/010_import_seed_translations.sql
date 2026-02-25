-- 010_import_seed_translations.sql
-- Auto-generated from src/data/production/seed/zh/seedData.json

-- Manufacturers Translations
UPDATE manufacturers SET translations = jsonb_set(COALESCE(translations, '{}'::jsonb), '{zh}', '{"name":"GE Healthcare（通用电气）","productFeatures":"产品线丰富，涵盖多种类型的CT设备","technicalAdvantages":"高效的全人工智能流程，自动简化扫描流程","customerReviews":"产品性能卓越，可靠性高","serviceScope":"全球","headquarters":"美国伊利诺伊州芝加哥"}'::jsonb) WHERE slug = 'ge-healthcare';
UPDATE manufacturers SET translations = jsonb_set(COALESCE(translations, '{}'::jsonb), '{zh}', '{"name":"Siemens Healthineers（西门子医疗）","productFeatures":"提供全面的CT成像解决方案","technicalAdvantages":"智能用户界面，标准化和简化工作流程","customerReviews":"图像质量高，诊断功能强","serviceScope":"全球","headquarters":"德国埃尔朗根"}'::jsonb) WHERE slug = 'siemens-healthineers';
UPDATE manufacturers SET translations = jsonb_set(COALESCE(translations, '{}'::jsonb), '{zh}', '{"name":"Philips Healthcare（飞利浦医疗）","productFeatures":"以创新为驱动，不断推出新技术和新功能的CT设备","technicalAdvantages":"质量、剂量和智慧工作流有机结合","customerReviews":"影像质量高，操作便捷","serviceScope":"全球","headquarters":"荷兰阿姆斯特丹"}'::jsonb) WHERE slug = 'philips-healthcare';
UPDATE manufacturers SET translations = jsonb_set(COALESCE(translations, '{}'::jsonb), '{zh}', '{"name":"联影医疗 (United Imaging)","productFeatures":"自研核心技术，全产业链布局","technicalAdvantages":"高端产品突破，AI技术融合，中国芯片","customerReviews":"产品性能达到国际先进水平，服务响应迅速","serviceScope":"全球80多个国家","headquarters":"中国上海"}'::jsonb) WHERE slug = 'united-imaging';
UPDATE manufacturers SET translations = jsonb_set(COALESCE(translations, '{}'::jsonb), '{zh}', '{"name":"东软医疗 (Neusoft)","productFeatures":"提供多种CT/MRI解决方案，产品性能稳定","technicalAdvantages":"价格亲民，中低端市场竞争力强，基层医疗适应性强","customerReviews":"产品性能稳定，性价比高","serviceScope":"全球110多个国家","headquarters":"中国沈阳"}'::jsonb) WHERE slug = 'neusoft-medical';
UPDATE manufacturers SET translations = jsonb_set(COALESCE(translations, '{}'::jsonb), '{zh}', '{"name":"佳能医疗 (Canon Medical Systems)","productFeatures":"先进CT/MRI技术，卓越成像质量","technicalAdvantages":"智能、精确、快速，高效实现复杂影像诊断","customerReviews":"成像质量高，低剂量成像优势明显","serviceScope":"全球","headquarters":"日本东京"}'::jsonb) WHERE slug = 'canon-medical';
UPDATE manufacturers SET translations = jsonb_set(COALESCE(translations, '{}'::jsonb), '{zh}', '{"name":"日立医疗 (Hitachi)","productFeatures":"医疗影像解决方案丰富，技术成熟","technicalAdvantages":"性能稳定，开放式MRI技术先驱","serviceScope":"全球","headquarters":"日本东京"}'::jsonb) WHERE slug = 'hitachi-healthcare';
UPDATE manufacturers SET translations = jsonb_set(COALESCE(translations, '{}'::jsonb), '{zh}', '{"name":"安科医疗","productFeatures":"中国首家MRI设备研发制造商","technicalAdvantages":"深厚的技术积累，性能稳定可靠","customerReviews":"性价比高，维护响应快","serviceScope":"国内","headquarters":"中国深圳"}'::jsonb) WHERE slug = 'anke-medical';
UPDATE manufacturers SET translations = jsonb_set(COALESCE(translations, '{}'::jsonb), '{zh}', '{"name":"万东医疗","productFeatures":"国内历史悠久的医疗影像品牌","technicalAdvantages":"MRI及普放设备性价比极高","serviceScope":"国内","headquarters":"中国北京"}'::jsonb) WHERE slug = 'wandong-medical';
UPDATE manufacturers SET translations = jsonb_set(COALESCE(translations, '{}'::jsonb), '{zh}', '{"name":"明峰医疗","productFeatures":"影像专家，产品矩阵覆盖全面","technicalAdvantages":"高性价比，大孔径设计优势","serviceScope":"国内","headquarters":"中国绍兴"}'::jsonb) WHERE slug = 'mingfeng-medical';

-- Devices Translations
UPDATE devices SET translations = jsonb_set(COALESCE(translations, '{}'::jsonb), '{zh}', '{"name":"Revolution Apex Expert","description":"高端CT系统，集成AI技术的旗舰产品","features":["AI智能扫描","超低剂量技术","快速重建","智能定位"]}'::jsonb) WHERE slug = 'ge-revolution-apex-expert';
UPDATE devices SET translations = jsonb_set(COALESCE(translations, '{}'::jsonb), '{zh}', '{"name":"Revolution CT","description":"先进CT系统，融合创新技术","features":["Revolution技术","宽体孔径","ASiR-V重建"]}'::jsonb) WHERE slug = 'ge-revolution-ct';
UPDATE devices SET translations = jsonb_set(COALESCE(translations, '{}'::jsonb), '{zh}', '{"name":"SOMATOM Drive","description":"高端CT系统，德国工艺","features":["双源技术","Stellar探测器","ADMIRE重建"]}'::jsonb) WHERE slug = 'siemens-somatom-drive';
UPDATE devices SET translations = jsonb_set(COALESCE(translations, '{}'::jsonb), '{zh}', '{"name":"SOMATOM Force","description":"高端CT系统，双源技术","features":["双源双探测器","光谱成像","Tin滤线器"]}'::jsonb) WHERE slug = 'siemens-somatom-force';
UPDATE devices SET translations = jsonb_set(COALESCE(translations, '{}'::jsonb), '{zh}', '{"name":"Spectral CT","description":"高端光谱CT，创新成像","features":["光谱成像技术","iDose重建","低剂量扫描"]}'::jsonb) WHERE slug = 'philips-spectral-ct';
UPDATE devices SET translations = jsonb_set(COALESCE(translations, '{}'::jsonb), '{zh}', '{"name":"uCT 960+","description":"高端CT系统，中国制造的世界级产品","features":["中国芯片","AI智能成像","超低剂量"]}'::jsonb) WHERE slug = 'uih-uct-960-plus';
UPDATE devices SET translations = jsonb_set(COALESCE(translations, '{}'::jsonb), '{zh}', '{"name":"SIGNA Architect Air","description":"3.0T高端MRI系统，具备AI功能","features":["AIR线圈","SIGNA Works AI","宽孔径设计"]}'::jsonb) WHERE slug = 'ge-signa-architect-air';
UPDATE devices SET translations = jsonb_set(COALESCE(translations, '{}'::jsonb), '{zh}', '{"name":"MAGNETOM Vida","description":"3.0T高端MRI系统","features":["BioMatrix技术","智能工作流程","Turbo Suite"]}'::jsonb) WHERE slug = 'siemens-magnetom-vida';
UPDATE devices SET translations = jsonb_set(COALESCE(translations, '{}'::jsonb), '{zh}', '{"name":"uMR 880","description":"3.0T高端MRI系统，创新设计","features":["75cm超大孔径","AI驱动成像","ACS技术"]}'::jsonb) WHERE slug = 'uih-umr-880';

UPDATE manufacturers SET translations = jsonb_set(COALESCE(translations, '{}'::jsonb), '{de}', '{"name":"GE Healthcare","description":"Führendes globales Medizintechnikunternehmen mit Fokus auf fortschrittliche CT‑Bildgebungslösungen","technical_advantages":"Effizienter KI‑Workflow\nAutomatisiertes, vereinfachtes Scannen\nFortschrittliche KI‑Algorithmen","service_scope":"Globaler Service\n24/7‑Support\nTrainingsprogramme","headquarters":"Chicago, IL, Vereinigte Staaten","country":"Vereinigte Staaten"}'::jsonb, true) WHERE slug = 'ge-healthcare';
UPDATE manufacturers SET translations = jsonb_set(COALESCE(translations, '{}'::jsonb), '{de}', '{"name":"Siemens Healthineers","description":"Pionier der medizinischen Bildgebungstechnologie mit innovativer Dual‑Source‑CT‑Technologie","technical_advantages":"Intelligente Benutzeroberfläche\nStandardisierter, vereinfachter Workflow\nDual‑Source‑Technologie","service_scope":"Globaler Service\nRemote‑Monitoring\nUmfassende Schulungen","headquarters":"Erlangen, Deutschland","country":"Deutschland"}'::jsonb, true) WHERE slug = 'siemens-healthineers';
UPDATE manufacturers SET translations = jsonb_set(COALESCE(translations, '{}'::jsonb), '{de}', '{"name":"Philips Healthcare","description":"Medizintechnologie‑Leader mit Fokus auf relevante Innovationen in der CT‑Bildgebung","technical_advantages":"Ganzheitliche Kombination aus Qualität, Dosis und Workflow\niDose‑Rekonstruktion\nSpektrale Bildgebung","service_scope":"Globaler Service\nKlinische Beratung\nSchulungsprogramme","headquarters":"Amsterdam, Niederlande","country":"Niederlande"}'::jsonb, true) WHERE slug = 'philips-healthcare';
UPDATE manufacturers SET translations = jsonb_set(COALESCE(translations, '{}'::jsonb), '{de}', '{"name":"Canon Medical Systems","description":"Japanisches Medizintechnikunternehmen, bekannt für innovative volumetrische CT‑Systeme","technical_advantages":"Intelligent, präzise, schnell\nEffiziente komplexe Simulation\nUltrahohe Auflösung","service_scope":"Globales Netzwerk\nTechnischer Support\nKlinische Weiterbildung","headquarters":"Tokio, Japan","country":"Japan"}'::jsonb, true) WHERE slug IN ('canon-medical', 'canon-medical-systems');
UPDATE manufacturers SET translations = jsonb_set(COALESCE(translations, '{}'::jsonb), '{de}', '{"name":"United Imaging","description":"Führendes chinesisches Medizintechnikunternehmen mit dem Ziel, ein weltweit führender Hersteller zu werden","technical_advantages":"Selbstentwickelte Kerntechnologie\nVollständige Wertschöpfungskette\nDurchbruch im High‑End‑Segment\nKI‑Integration\nEigene Chips","service_scope":"Über 80 Länder\nLokalisierter Service\n24/7‑Support\nCloud‑Diagnostik","headquarters":"Shanghai, China","country":"China"}'::jsonb, true) WHERE slug IN ('united-imaging', 'united-imaging-healthcare');
UPDATE manufacturers SET translations = jsonb_set(COALESCE(translations, '{}'::jsonb), '{de}', '{"name":"Neusoft Medical","description":"Pionier der chinesischen Medizintechnikbranche mit Fokus auf bezahlbare Gesundheitslösungen","technical_advantages":"Umfassende Lösungen\nHervorragende Kostenkontrolle\nHohe Anpassungsfähigkeit für die Grundversorgung\nPerfektes Servicenetz","service_scope":"Über 110 Länder\nLokalisierter Service\n24‑h‑Reaktion\nUnterstützung der Grundversorgung","headquarters":"Shenyang, China","country":"China"}'::jsonb, true) WHERE slug IN ('neusoft-medical', 'neusoft-medical-systems');
UPDATE manufacturers SET translations = jsonb_set(COALESCE(translations, '{}'::jsonb), '{de}', '{"name":"Wandong Medical","description":"Innovatives Unternehmen für medizinische Bildgebungstechnologie.","technical_advantages":"Innovative medizinische Bildgebungstechnologie","service_scope":"Inland","country":"China"}'::jsonb, true) WHERE slug = 'wandong-medical';
UPDATE manufacturers SET translations = jsonb_set(COALESCE(translations, '{}'::jsonb), '{de}', '{"name":"Anke Medical","description":"Unternehmen für CT‑Geräte und medizinische Bildgebungstechnologie.","technical_advantages":"Fortschrittliche Bildgebungslösungen","service_scope":"Inland","country":"China"}'::jsonb, true) WHERE slug = 'anke-medical';
UPDATE manufacturers SET translations = jsonb_set(COALESCE(translations, '{}'::jsonb), '{de}', '{"name":"Mingfeng Medical","description":"Professioneller Anbieter von medizinischen Bildgebungslösungen.","technical_advantages":"Professionelle Bildgebungslösungen","service_scope":"Inland","country":"China"}'::jsonb, true) WHERE slug = 'mingfeng-medical';
UPDATE manufacturers SET translations = jsonb_set(COALESCE(translations, '{}'::jsonb), '{de}', '{"name":"Sino Vision","description":"Hersteller von High‑End‑CT‑Geräten.","technical_advantages":"Deutliche Vorteile bei Bildqualität und Scan‑Geschwindigkeit","service_scope":"Inland und international","country":"China"}'::jsonb, true) WHERE slug = 'sino-vision';
UPDATE manufacturers SET translations = jsonb_set(COALESCE(translations, '{}'::jsonb), '{de}', '{"name":"Kaiying Medical","description":"Hersteller von CT‑ und MRT‑Geräten.","technical_advantages":"Starke Wettbewerbsfähigkeit im Mittel‑ bis Niedrigpreissegment","service_scope":"Inland","country":"China"}'::jsonb, true) WHERE slug = 'kaiying-medical';
UPDATE manufacturers SET translations = jsonb_set(COALESCE(translations, '{}'::jsonb), '{de}', '{"name":"Kangda Intercontinental","description":"Hersteller von 32‑Schicht‑CT‑Geräten.","technical_advantages":"Hohe Kosteneffizienz im Mittel‑ bis Niedrigpreissegment","service_scope":"Inland","country":"China"}'::jsonb, true) WHERE slug = 'kangda-medical';
UPDATE manufacturers SET translations = jsonb_set(COALESCE(translations, '{}'::jsonb), '{de}', '{"name":"Broaden Medical","description":"Hersteller von 32‑Schicht‑CT‑Systemen mit Fokus auf den Primärversorgungsmarkt.","technical_advantages":"Hoher Marktanteil im Primärversorgungsmarkt","service_scope":"Inland","country":"China"}'::jsonb, true) WHERE slug = 'broaden-medical';
UPDATE manufacturers SET translations = jsonb_set(COALESCE(translations, '{}'::jsonb), '{de}', '{"name":"Perlove Medical","description":"Hersteller von medizinischen Bildgebungslösungen und Geräten.","technical_advantages":"C‑Bogen‑Systeme\nDigitale Radiographie\nMobiles DR","service_scope":"Weltweit","country":"China"}'::jsonb, true) WHERE slug = 'perlove-medical';

UPDATE manufacturers
SET translations = jsonb_set(
  COALESCE(translations, '{}'::jsonb),
  '{pt}',
  jsonb_build_object(
    'name', name,
    'description', description,
    'technical_advantages', technical_advantages,
    'service_scope', service_scope,
    'headquarters', headquarters,
    'country', country
  ),
  true
)
WHERE translations IS NULL OR translations->'pt' IS NULL;

UPDATE devices
SET translations = jsonb_set(
  COALESCE(translations, '{}'::jsonb),
  '{de}',
  jsonb_build_object(
    'name', name,
    'description', description,
    'features', features
  ),
  true
)
WHERE translations IS NULL OR translations->'de' IS NULL;

UPDATE devices
SET translations = jsonb_set(
  COALESCE(translations, '{}'::jsonb),
  '{pt}',
  jsonb_build_object(
    'name', name,
    'description', description,
    'features', features
  ),
  true
)
WHERE translations IS NULL OR translations->'pt' IS NULL;
