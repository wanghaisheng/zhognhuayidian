import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helpers to convert legacy *_en/*_zh payloads into JSONB translations-only payloads
function toManufacturerPayload(m: Record<string, unknown>) {
  const {
    name_en, name_zh,
    description_en, description_zh,
    ...rest
  } = m as { [key: string]: unknown };
  return {
    ...rest,
    translations: {
      en: {
        name: name_en,
        description: description_en,
      },
      zh: {
        name: name_zh,
        description: description_zh,
      },
    },
  };
}

function toDevicePayload(d: Record<string, unknown>) {
  const {
    name_en, name_zh,
    description_en, description_zh,
    features_en, features_zh,
    applications_en, applications_zh,
    ...rest
  } = d as { [key: string]: unknown };
  return {
    ...rest,
    translations: {
      en: {
        name: name_en,
        description: description_en,
        features: features_en,
        applications: applications_en,
      },
      zh: {
        name: name_zh,
        description: description_zh,
        features: features_zh,
        applications: applications_zh,
      },
    },
  };
}

function toArticlePayload(a: Record<string, unknown>) {
  const {
    title_en, title_zh,
    excerpt_en, excerpt_zh,
    content_en, content_zh,
    ...rest
  } = a as { [key: string]: unknown };
  return {
    ...rest,
    translations: {
      en: {
        title: title_en,
        excerpt: excerpt_en,
        content: content_en,
      },
      zh: {
        title: title_zh,
        excerpt: excerpt_zh,
        content: content_zh,
      },
    },
  };
}

function toCustomerPayload(c: Record<string, unknown>) {
  const {
    name_en, name_zh,
    description_en, description_zh,
    ...rest
  } = c as { [key: string]: unknown };
  return {
    ...rest,
    translations: {
      en: {
        name: name_en,
        description: description_en,
      },
      zh: {
        name: name_zh,
        description: description_zh,
      },
    },
  };
}

// Seed data for manufacturers
const manufacturersData = [
  {
    slug: 'ge-healthcare',
    name_zh: 'GE医疗',
    name_en: 'GE Healthcare',
    description_zh: '全球领先的医疗技术和数字解决方案创新者，提供广泛的CT扫描仪产品线，具备高效的全人工智能流程。',
    description_en: 'Global leader in medical technology and digital solutions innovation, offering a wide range of CT scanners with efficient AI-powered processes.',
    country: 'United States',
    founded_year: 1892,
    headquarters: 'Chicago, Illinois, USA',
    website: 'https://www.gehealthcare.com',
    category: ['CT', 'MRI', 'Ultrasound', 'X-Ray'],
    market_share: 28.0,
    is_featured: true,
    published: true
  },
  {
    slug: 'siemens-healthineers',
    name_zh: '西门子医疗',
    name_en: 'Siemens Healthineers',
    description_zh: '全球医疗技术领导者，提供全面的CT成像解决方案，拥有智能用户界面和标准化工作流程。',
    description_en: 'Global medical technology leader providing comprehensive CT imaging solutions with intelligent user interface and standardized workflows.',
    country: 'Germany',
    founded_year: 1847,
    headquarters: 'Erlangen, Germany',
    website: 'https://www.siemens-healthineers.com',
    category: ['CT', 'MRI', 'Ultrasound', 'X-Ray'],
    market_share: 22.19,
    is_featured: true,
    published: true
  },
  {
    slug: 'philips-healthcare',
    name_zh: '飞利浦医疗',
    name_en: 'Philips Healthcare',
    description_zh: '以创新驱动，持续为CT设备推出新技术和功能，实现质量、剂量和智能工作流程的有机结合。',
    description_en: 'Innovation-driven company continuously launching new technologies for CT equipment, combining quality, dose optimization and intelligent workflows.',
    country: 'Netherlands',
    founded_year: 1891,
    headquarters: 'Amsterdam, Netherlands',
    website: 'https://www.philips.com/healthcare',
    category: ['CT', 'MRI', 'Ultrasound'],
    market_share: 13.32,
    is_featured: true,
    published: true
  },
  {
    slug: 'united-imaging',
    name_zh: '联影医疗',
    name_en: 'United Imaging Healthcare',
    description_zh: '中国领先的高端医疗设备制造商，产品性价比高，持续扩大中国市场份额，在高端CT领域取得突破。',
    description_en: 'Leading Chinese high-end medical equipment manufacturer with excellent cost-performance ratio, continuously expanding China market share with breakthroughs in high-end CT.',
    country: 'China',
    founded_year: 2011,
    headquarters: 'Shanghai, China',
    website: 'https://www.united-imaging.com',
    category: ['CT', 'MRI', 'PET-CT'],
    market_share: 22.32,
    is_featured: true,
    published: true
  },
  {
    slug: 'neusoft-medical',
    name_zh: '东软医疗',
    name_en: 'Neusoft Medical Systems',
    description_zh: '中国医疗设备制造商，提供多种CT解决方案，产品性能稳定，价格实惠，在中低端市场具有强竞争力。',
    description_en: 'Chinese medical equipment manufacturer offering various CT solutions with stable performance, affordable prices, and strong competitiveness in mid-to-low-end market.',
    country: 'China',
    founded_year: 1991,
    headquarters: 'Shenyang, China',
    website: 'https://www.neusoftmedical.com',
    category: ['CT', 'MRI', 'DR'],
    market_share: 8.2,
    is_featured: true,
    published: true
  },
  {
    slug: 'canon-medical',
    name_zh: '佳能医疗',
    name_en: 'Canon Medical Systems',
    description_zh: '前身为东芝医疗，提供创新的CT解决方案，以患者为中心的设计和先进的AI技术。',
    description_en: 'Formerly Toshiba Medical, provides innovative CT solutions with patient-centric design and advanced AI technology.',
    country: 'Japan',
    founded_year: 1930,
    headquarters: 'Otawara, Tochigi, Japan',
    website: 'https://global.medical.canon',
    category: ['CT', 'MRI', 'Ultrasound'],
    market_share: 5.5,
    is_featured: false,
    published: true
  },
  {
    slug: 'mingfeng-medical',
    name_zh: '明峰医疗',
    name_en: 'Mingfeng Medical',
    description_zh: '中国新兴的医疗影像设备制造商，专注于中高端CT设备研发和制造。',
    description_en: 'Emerging Chinese medical imaging equipment manufacturer focusing on mid-to-high-end CT equipment R&D and manufacturing.',
    country: 'China',
    founded_year: 2011,
    headquarters: 'Hangzhou, China',
    website: 'https://www.mfrmed.com',
    category: ['CT', 'PET-CT'],
    market_share: 3.5,
    is_featured: false,
    published: true
  }
];

// Seed data for devices
const devicesData = [
  {
    slug: 'neusoft-neuvue-510-ct',
    name_zh: 'NeuVue 510 CT扫描仪',
    name_en: 'NeuVue 510 CT Scanner',
    description_zh: '东软医疗NeuVue 510是一款64层CT扫描仪，集成了AI智能诊断技术，提供优质的图像质量和检查效率。',
    description_en: 'Neusoft NeuVue 510 is a 64-slice CT scanner integrated with AI intelligent diagnosis technology, providing excellent image quality and examination efficiency.',
    type: 'CT',
    manufacturer_slug: 'neusoft-medical',
    specifications: {
      slices: 64,
      detectorRows: 64,
      gantryAperture: '70cm',
      scanTime: '0.35s',
      reconstruction: 'AI reconstruction'
    },
    features_zh: ['AI智能诊断', '低剂量扫描', '快速重建', '多平面重建'],
    features_en: ['AI Intelligent Diagnosis', 'Low-dose Scanning', 'Fast Reconstruction', 'Multi-planar Reconstruction'],
    applications_zh: ['全身扫描', '心血管成像', '神经影像', '肿瘤筛查'],
    applications_en: ['Whole Body Scan', 'Cardiovascular Imaging', 'Neuroimaging', 'Tumor Screening'],
    price_range: '800-1200万元',
    release_year: 2020,
    certifications: ['NMPA', 'CE'],
    is_featured: true,
    published: true
  },
  {
    slug: 'united-imaging-umr-790-3t-mri',
    name_zh: 'uMR 790 3.0T磁共振',
    name_en: 'uMR 790 3.0T MRI',
    description_zh: '联影uMR 790是3.0T超导磁共振系统，采用AI技术加速成像，提供卓越的图像质量和患者舒适度。',
    description_en: 'United Imaging uMR 790 is a 3.0T superconducting MRI system with AI-accelerated imaging, providing exceptional image quality and patient comfort.',
    type: 'MRI',
    manufacturer_slug: 'united-imaging',
    specifications: {
      fieldStrength: '3.0T',
      gantryAperture: '70cm',
      gradientStrength: '80mT/m',
      slewRate: '200T/m/s'
    },
    features_zh: ['AI加速成像', '静音技术', '大孔径设计', '多参数成像'],
    features_en: ['AI Accelerated Imaging', 'Silent Technology', 'Wide Bore Design', 'Multi-parameter Imaging'],
    applications_zh: ['神经影像', '心血管成像', '肌骨成像', '功能成像'],
    applications_en: ['Neuroimaging', 'Cardiovascular Imaging', 'Musculoskeletal Imaging', 'Functional Imaging'],
    price_range: '2500-3500万元',
    release_year: 2019,
    certifications: ['NMPA', 'FDA', 'CE'],
    is_featured: true,
    published: true
  },
  {
    slug: 'ge-revolution-ct',
    name_zh: 'Revolution CT',
    name_en: 'Revolution CT',
    description_zh: 'GE Revolution CT是256层高端CT系统，具备光谱成像技术和超高时间分辨率。',
    description_en: 'GE Revolution CT is a 256-slice high-end CT system with spectral imaging technology and ultra-high temporal resolution.',
    type: 'CT',
    manufacturer_slug: 'ge-healthcare',
    specifications: {
      slices: 256,
      detectorRows: 256,
      gantryAperture: '80cm',
      scanTime: '0.28s',
      coverage: '16cm'
    },
    features_zh: ['256层成像', 'ASiR-V重建', 'GSI光谱成像', '智能运动矫正'],
    features_en: ['256-slice Imaging', 'ASiR-V Reconstruction', 'GSI Spectral Imaging', 'Smart Motion Correction'],
    applications_zh: ['心血管成像', '神经影像', '肿瘤诊断', '创伤急诊'],
    applications_en: ['Cardiovascular Imaging', 'Neuroimaging', 'Tumor Diagnosis', 'Trauma Emergency'],
    price_range: '3000-5000万元',
    release_year: 2016,
    certifications: ['FDA', 'CE', 'NMPA'],
    is_featured: true,
    published: true
  },
  {
    slug: 'siemens-somatom-force-ct',
    name_zh: 'SOMATOM Force双源CT',
    name_en: 'SOMATOM Force Dual Source CT',
    description_zh: '西门子SOMATOM Force是双源CT的旗舰产品，提供无与伦比的时间分辨率和双能量成像能力。',
    description_en: 'Siemens SOMATOM Force is the flagship dual-source CT providing unparalleled temporal resolution and dual-energy imaging capabilities.',
    type: 'CT',
    manufacturer_slug: 'siemens-healthineers',
    specifications: {
      slices: 192,
      detectorRows: 192,
      gantryAperture: '78cm',
      scanTime: '0.25s',
      dualSource: true
    },
    features_zh: ['双源技术', '双能量成像', 'Tin滤过技术', 'ADMIRE重建'],
    features_en: ['Dual Source Technology', 'Dual Energy Imaging', 'Tin Filter Technology', 'ADMIRE Reconstruction'],
    applications_zh: ['心血管成像', '双能量分析', '肺部筛查', '神经血管成像'],
    applications_en: ['Cardiovascular Imaging', 'Dual Energy Analysis', 'Lung Screening', 'Neurovascular Imaging'],
    price_range: '4000-6000万元',
    release_year: 2014,
    certifications: ['FDA', 'CE', 'NMPA'],
    is_featured: true,
    published: true
  },
  {
    slug: 'uih-uct-960-plus',
    name_zh: 'uCT 960+',
    name_en: 'uCT 960+',
    description_zh: '联影uCT 960+是256层高端CT系统，采用先进的AI重建技术和超低剂量扫描。',
    description_en: 'United Imaging uCT 960+ is a 256-slice high-end CT system with advanced AI reconstruction and ultra-low dose scanning.',
    type: 'CT',
    manufacturer_slug: 'united-imaging',
    specifications: {
      slices: 256,
      detectorRows: 256,
      gantryAperture: '80cm',
      scanTime: '0.25s'
    },
    features_zh: ['AI重建', '超低剂量', '宽体探测器', '智能扫描'],
    features_en: ['AI Reconstruction', 'Ultra-low Dose', 'Wide Detector', 'Intelligent Scanning'],
    applications_zh: ['全身扫描', '心血管成像', '肿瘤筛查', '神经影像'],
    applications_en: ['Whole Body Scan', 'Cardiovascular Imaging', 'Tumor Screening', 'Neuroimaging'],
    price_range: '1400-1800万元',
    release_year: 2019,
    certifications: ['NMPA', 'FDA', 'CE'],
    is_featured: true,
    published: true
  },
  {
    slug: 'philips-iqon-spectral-ct',
    name_zh: 'IQon Spectral CT',
    name_en: 'IQon Spectral CT',
    description_zh: '飞利浦IQon是全球首款光谱探测CT，实现真正的双层光谱成像。',
    description_en: 'Philips IQon is the world\'s first spectral detector CT, enabling true dual-layer spectral imaging.',
    type: 'CT',
    manufacturer_slug: 'philips-healthcare',
    specifications: {
      slices: 128,
      detectorRows: 128,
      gantryAperture: '78cm',
      scanTime: '0.27s',
      spectralDetector: true
    },
    features_zh: ['光谱探测器', '双层成像', 'IMR重建', '低剂量'],
    features_en: ['Spectral Detector', 'Dual-layer Imaging', 'IMR Reconstruction', 'Low Dose'],
    applications_zh: ['肿瘤成像', '心血管分析', '神经血管', '骨关节'],
    applications_en: ['Oncology Imaging', 'Cardiovascular Analysis', 'Neurovascular', 'Musculoskeletal'],
    price_range: '2500-3500万元',
    release_year: 2016,
    certifications: ['FDA', 'CE', 'NMPA'],
    is_featured: false,
    published: true
  }
];

// Seed data for customers
const customersData = [
  {
    slug: 'foshan-gaoming-hospital',
    name_zh: '佛山市高明区人民医院',
    name_en: 'Foshan Gaoming District People\'s Hospital',
    description_zh: '广东省佛山市高明区大型综合性公立医院，拥有先进的医疗影像设备。',
    description_en: 'A large comprehensive public hospital in Gaoming District, Foshan City, Guangdong Province, equipped with advanced medical imaging equipment.',
    province: '广东省',
    city: '佛山市',
    hospital_type: '三级甲等',
    bed_count: 800,
    devices: [{ device_slug: 'ge-revolution-ct', purchase_year: 2021 }],
    year: 2021,
    published: true
  },
  {
    slug: 'taiyuan-tcm-hospital',
    name_zh: '太原市中医医院',
    name_en: 'Taiyuan Traditional Chinese Medicine Hospital',
    description_zh: '山西省太原市中医专科医院，中西医结合诊疗特色突出。',
    description_en: 'A TCM specialty hospital in Taiyuan City, Shanxi Province, known for integrated Chinese and Western medicine.',
    province: '山西省',
    city: '太原市',
    hospital_type: '三级甲等',
    bed_count: 600,
    devices: [{ device_slug: 'uih-uct-960-plus', purchase_year: 2022 }],
    year: 2022,
    published: true
  },
  {
    slug: 'beijing-union-hospital',
    name_zh: '北京协和医院',
    name_en: 'Peking Union Medical College Hospital',
    description_zh: '中国顶级三甲医院，综合医疗实力雄厚，拥有多台高端影像设备。',
    description_en: 'One of China\'s top hospitals with comprehensive medical capabilities and multiple high-end imaging equipment.',
    province: '北京市',
    city: '北京市',
    hospital_type: '三级甲等',
    bed_count: 2000,
    devices: [
      { device_slug: 'siemens-somatom-force-ct', purchase_year: 2020 },
      { device_slug: 'united-imaging-umr-790-3t-mri', purchase_year: 2021 }
    ],
    year: 2020,
    published: true
  },
  {
    slug: 'shanghai-zhongshan-hospital',
    name_zh: '上海中山医院',
    name_en: 'Zhongshan Hospital, Fudan University',
    description_zh: '复旦大学附属中山医院，华东地区重要的医疗中心。',
    description_en: 'Zhongshan Hospital affiliated with Fudan University, a major medical center in East China.',
    province: '上海市',
    city: '上海市',
    hospital_type: '三级甲等',
    bed_count: 1800,
    devices: [{ device_slug: 'ge-revolution-ct', purchase_year: 2019 }],
    year: 2019,
    published: true
  }
];

// Seed data for articles
const articlesData = [
  {
    slug: 'ct-scanner-history-china',
    title_zh: '中国CT扫描仪发展历史',
    title_en: 'History of CT Scanner Development in China',
    excerpt_zh: '回顾中国CT扫描技术的发展历程，从早期的技术引进到现在的自主创新。',
    excerpt_en: 'Review the development of CT scanning technology in China, from early technology introduction to current independent innovation.',
    content_zh: '中国 CT 扫描技术的发展历程始于 1980 年代初期，经历了从引进技术到自主创新的转变过程。1979 年，中国引进了第一台 CT 扫描仪，标志着中国进入 CT 时代。此后，中国制造医疗设备企业开始研发自主品牌的 CT 设备，东软医疗、联影医疗等企业逐渐成长为行业领导者。',
    content_en: 'The development of CT scanning technology in China began in the early 1980s, experiencing a transformation from technology introduction to independent innovation. In 1979, China introduced its first CT scanner, marking China\'s entry into the CT era. Since then, China‑made medical equipment companies began developing their own CT equipment, with companies like Neusoft Medical and United Imaging gradually becoming industry leaders.',
    category: 'history',
    tags: ['CT扫描仪', '中国医疗', '技术发展', '医疗历史'],
    author: '医疗设备专家',
    read_time: 8,
    published: true,
    published_at: '2024-01-15T00:00:00Z'
  },
  {
    slug: 'china-ct-market-2024',
    title_zh: '2024年中国CT市场分析报告',
    title_en: '2024 China CT Market Analysis Report',
    excerpt_zh: '深度分析2024年中国CT扫描仪市场现状、竞争格局和未来发展趋势。',
    excerpt_en: 'In-depth analysis of China\'s CT scanner market status, competitive landscape and future trends in 2024.',
    content_zh: '2024 年中国 CT 扫描仪市场呈现强劲增长态势，中国制造品牌市场份额持续上升。联影医疗、东软医疗等面向中国市场的厂商通过技术创新和性价比优势，逐步提升与国际品牌的竞争力。高端 CT 设备本土化生产比例突破 30%，标志着中国制造医疗设备取得重要进展。',
    content_en: 'China\'s CT scanner market in 2024 shows strong growth, with China‑made brands\' market share continuing to rise. China‑made manufacturers like United Imaging and Neusoft Medical are gradually eroding imported brands\' market share through technological innovation and cost-effectiveness. The localization rate of high-end CT equipment has exceeded 30%, marking a significant breakthrough for China‑made medical equipment.',
    category: 'market',
    tags: ['市场分析', '中国市场', 'CT扫描仪', '2024年'],
    author: '市场研究团队',
    read_time: 12,
    published: true,
    published_at: '2024-02-20T00:00:00Z'
  },
  {
    slug: 'ct-buying-guide',
    title_zh: 'CT扫描仪采购指南',
    title_en: 'CT Scanner Purchasing Guide',
    excerpt_zh: '医院采购CT扫描仪的完整指南，包括选型建议、价格分析和供应商评估。',
    excerpt_en: 'Complete guide for hospitals purchasing CT scanners, including selection advice, price analysis and supplier evaluation.',
    content_zh: '采购CT扫描仪是医院重大设备投资决策，需要综合考虑临床需求、预算限制、设备性能和售后服务等多个因素。本指南将帮助医院采购人员做出明智的选择。',
    content_en: 'Purchasing a CT scanner is a major equipment investment decision for hospitals, requiring comprehensive consideration of clinical needs, budget constraints, equipment performance and after-sales service. This guide will help hospital procurement personnel make informed choices.',
    category: 'guide',
    tags: ['采购指南', 'CT扫描仪', '医疗设备', '选型建议'],
    author: '采购顾问',
    read_time: 15,
    published: true,
    published_at: '2024-03-10T00:00:00Z'
  }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const results = {
      manufacturers: { inserted: 0, errors: [] as string[] },
      devices: { inserted: 0, errors: [] as string[] },
      customers: { inserted: 0, errors: [] as string[] },
      articles: { inserted: 0, errors: [] as string[] }
    };

    // 1. Insert manufacturers first
    console.log('Inserting manufacturers...');
    for (const manufacturer of manufacturersData) {
      const payload = toManufacturerPayload(manufacturer);
      const { error } = await supabase
        .from('manufacturers')
        .upsert(payload, { onConflict: 'slug' });
      
      if (error) {
        console.error(`Error inserting manufacturer ${manufacturer.slug}:`, error);
        results.manufacturers.errors.push(`${manufacturer.slug}: ${error.message}`);
      } else {
        results.manufacturers.inserted++;
      }
    }

    // 2. Get manufacturer IDs for device foreign keys
    const { data: manufacturers } = await supabase
      .from('manufacturers')
      .select('id, slug');
    
    const manufacturerMap = new Map(manufacturers?.map(m => [m.slug, m.id]) || []);

    // 3. Insert devices with manufacturer_id
    console.log('Inserting devices...');
    for (const device of devicesData) {
      const { manufacturer_slug, ...deviceData } = device;
      const manufacturer_id = manufacturerMap.get(manufacturer_slug);
      const payload = toDevicePayload(deviceData);
      const { error } = await supabase
        .from('devices')
        .upsert({ ...payload, manufacturer_id }, { onConflict: 'slug' });
      
      if (error) {
        console.error(`Error inserting device ${device.slug}:`, error);
        results.devices.errors.push(`${device.slug}: ${error.message}`);
      } else {
        results.devices.inserted++;
      }
    }

    // 4. Insert customers
    console.log('Inserting customers...');
    for (const customer of customersData) {
      const payload = toCustomerPayload(customer);
      const { error } = await supabase
        .from('customers')
        .upsert(payload, { onConflict: 'slug' });
      
      if (error) {
        console.error(`Error inserting customer ${customer.slug}:`, error);
        results.customers.errors.push(`${customer.slug}: ${error.message}`);
      } else {
        results.customers.inserted++;
      }
    }

    // 5. Insert articles
    console.log('Inserting articles...');
    for (const article of articlesData) {
      const payload = toArticlePayload(article);
      const { error } = await supabase
        .from('articles')
        .upsert(payload, { onConflict: 'slug' });
      
      if (error) {
        console.error(`Error inserting article ${article.slug}:`, error);
        results.articles.errors.push(`${article.slug}: ${error.message}`);
      } else {
        results.articles.inserted++;
      }
    }

    console.log('Migration completed:', results);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Data migration completed',
        results
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Migration error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: (error as Error).message
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
