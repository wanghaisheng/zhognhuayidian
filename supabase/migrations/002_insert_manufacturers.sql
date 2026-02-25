-- 插入制造商数据
INSERT INTO manufacturers (name, slug, country, founded_year, headquarters, website, market_share_ct, market_share_mri, employee_scale, annual_revenue, description, technical_advantages, service_scope, logo_url, is_chinese, translations) VALUES

-- 国际制造商
('GE Healthcare', 'ge-healthcare', 'United States', 1994, 'Chicago, Illinois, USA', 'https://www.gehealthcare.com', 2.74, NULL, 'Over 300,000', 'Total revenue of $18.6 billion in 2020', 
'Rich product line covering various types of CT and MRI equipment',
'Efficient full artificial intelligence process, automatically simplifying the scanning process',
'Global', NULL, false,
'{"zh": {"name": "GE医疗", "description": "产品线丰富，涵盖多种类型的CT和MRI设备", "technical_advantages": "高效的全人工智能流程，自动简化扫描流程"}, "en": {"name": "GE Healthcare", "description": "Rich product line covering various types of CT and MRI equipment", "technical_advantages": "Efficient full artificial intelligence process, automatically simplifying the scanning process"}}'),

('Siemens Healthineers', 'siemens-healthineers', 'Germany', 2018, 'Erlangen, Germany', 'https://www.siemens-healthineers.com', 2.93, NULL, 'Approximately 66,000', 'Total revenue of €18 billion in 2021', 
'Provides comprehensive CT and MRI imaging solutions',
'Intelligent user interface, standardizing and simplifying workflow',
'Global', NULL, false,
'{"zh": {"name": "西门子医疗", "description": "提供全面的CT和MRI成像解决方案", "technical_advantages": "智能用户界面，标准化和简化工作流程"}, "en": {"name": "Siemens Healthineers", "description": "Provides comprehensive CT and MRI imaging solutions", "technical_advantages": "Intelligent user interface, standardizing and simplifying workflow"}}'),

('Philips Healthcare', 'philips-healthcare', 'Netherlands', 1891, 'Amsterdam, Netherlands', 'https://www.philips.com', 1.92, NULL, 'Approximately 69,700', 'Sales of €18.2 billion in 2023', 
'Innovation-driven, continuously launching new technologies and features for medical equipment',
'Organic combination of quality, dosage and intelligent workflow',
'Global', NULL, false,
'{"zh": {"name": "飞利浦医疗", "description": "以创新为驱动，不断推出新技术和新功能的医疗设备", "technical_advantages": "质量、剂量和智慧工作流有机结合"}, "en": {"name": "Philips Healthcare", "description": "Innovation-driven, continuously launching new technologies and features for medical equipment", "technical_advantages": "Organic combination of quality, dosage and intelligent workflow"}}'),

('Canon Medical Systems', 'canon-medical-systems', 'Japan', 2016, 'Otawara, Japan', 'https://global.medical.canon', NULL, NULL, NULL, NULL, 
'Advanced CT technology, high imaging quality',
'Intelligent, accurate and fast, efficiently realizing various complex simulation positioning',
'Global', NULL, false,
'{"zh": {"name": "佳能医疗", "description": "CT技术先进，成像质量高", "technical_advantages": "智能、精确、快速，高效实现各种复杂模拟定位"}, "en": {"name": "Canon Medical Systems", "description": "Advanced CT technology, high imaging quality", "technical_advantages": "Intelligent, accurate and fast, efficiently realizing various complex simulation positioning"}}'),

-- 中国制造商
('United Imaging Healthcare', 'united-imaging-healthcare', 'China', 2011, 'Shanghai, China', 'https://www.uihchina.com', 11.15, 62.50, NULL, NULL, 
'Rapid development, high product cost-performance ratio',
'Continuously expanding domestic market share, breakthroughs in high-end CT and MRI fields',
'Domestic and international', NULL, true,
'{"zh": {"name": "联影医疗", "description": "发展迅速，产品性价比高", "technical_advantages": "国内市场份额不断扩大，高端CT和MRI领域取得突破"}, "en": {"name": "United Imaging Healthcare", "description": "Rapid development, high product cost-performance ratio", "technical_advantages": "Continuously expanding domestic market share, breakthroughs in high-end CT and MRI fields"}}'),

('Neusoft Medical Systems', 'neusoft-medical-systems', 'China', 1998, 'Shenyang, China', 'https://www.neusoft.com', 72.35, NULL, NULL, 'Revenue of ¥2.803 billion in 2021', 
'Provides a variety of CT and MRI solutions, stable product performance',
'Affordable price, strong competitiveness in the mid-to-low-end market',
'Domestic and international', NULL, true,
'{"zh": {"name": "东软医疗", "description": "提供多种CT和MRI解决方案，产品性能稳定", "technical_advantages": "价格亲民，中低端市场竞争力强"}, "en": {"name": "Neusoft Medical Systems", "description": "Provides a variety of CT and MRI solutions, stable product performance", "technical_advantages": "Affordable price, strong competitiveness in the mid-to-low-end market"}}'),

('Wandong Medical', 'wandong-medical', 'China', 1955, 'Beijing, China', 'https://www.wandongmedical.com', 0.12, NULL, NULL, NULL, 
'Medical equipment manufacturer, CT and MRI equipment is one of its key products',
'High product cost-performance ratio',
'Domestic', NULL, true,
'{"zh": {"name": "万东医疗", "description": "医疗设备制造商，CT和MRI设备是其重点产品之一", "technical_advantages": "产品性价比高"}, "en": {"name": "Wandong Medical", "description": "Medical equipment manufacturer, CT and MRI equipment is one of its key products", "technical_advantages": "High product cost-performance ratio"}}'),

('Anke Medical', 'anke-medical', 'China', 1986, 'Shenzhen, China', 'https://www.anke.com', 0.18, 4.27, NULL, NULL, 
'Produces a variety of medical equipment, CT and MRI scanners well-known domestically',
'High product cost-performance ratio, good after-sales service',
'Domestic', NULL, true,
'{"zh": {"name": "安科医疗", "description": "生产多种医疗设备，CT和MRI扫描仪在国内有一定知名度", "technical_advantages": "产品性价比高，售后服务好"}, "en": {"name": "Anke Medical", "description": "Produces a variety of medical equipment, CT and MRI scanners well-known domestically", "technical_advantages": "High product cost-performance ratio, good after-sales service"}}'),

('Mingfeng Medical', 'mingfeng-medical', 'China', 2003, 'Shenyang, China', 'https://www.mingfengmedical.com', 0.16, 2.05, NULL, NULL, 
'Medical imaging equipment manufacturer, continuously improving product image quality and performance',
'Products have application advantages in specific fields',
'Domestic', NULL, true,
'{"zh": {"name": "明峰医疗", "description": "医疗影像设备制造商，产品在图像质量和性能方面不断提升", "technical_advantages": "产品在特定领域有应用优势"}, "en": {"name": "Mingfeng Medical", "description": "Medical imaging equipment manufacturer, continuously improving product image quality and performance", "technical_advantages": "Products have application advantages in specific fields"}}'),

('Sino Vision', 'sino-vision', 'China', 2002, 'Beijing, China', 'https://www.sinovision.net', NULL, 1.91, NULL, NULL, 
'Focuses on MRI equipment manufacturing',
'Products have unique features in image processing and diagnostic functions',
'Domestic', NULL, true,
'{"zh": {"name": "赛诺威盛", "description": "专注于MRI设备制造", "technical_advantages": "产品在图像处理和诊断功能方面有特色"}, "en": {"name": "Sino Vision", "description": "Focuses on MRI equipment manufacturing", "technical_advantages": "Products have unique features in image processing and diagnostic functions"}}'),

('Kangda Intercontinental', 'kangda-intercontinental', 'China', 1993, 'Beijing, China', 'https://www.kdicmed.com', NULL, 1.38, NULL, NULL, 
'Medical equipment manufacturer',
'Stable product performance, high cost-performance ratio',
'Domestic', NULL, true,
'{"zh": {"name": "康达洲际", "description": "医疗设备制造商", "technical_advantages": "产品性能稳定，性价比高"}, "en": {"name": "Kangda Intercontinental", "description": "Medical equipment manufacturer", "technical_advantages": "Stable product performance, high cost-performance ratio"}}'),

('Broaden Medical', 'broaden-medical', 'China', 2009, 'Shenzhen, China', 'https://www.broadenmedical.com', NULL, 0.83, NULL, NULL, 
'Medical equipment manufacturer',
'High product cost-performance ratio',
'Domestic', NULL, true,
'{"zh": {"name": "宽腾医疗", "description": "医疗设备制造商", "technical_advantages": "产品性价比高"}, "en": {"name": "Broaden Medical", "description": "Medical equipment manufacturer", "technical_advantages": "High product cost-performance ratio"}}');
