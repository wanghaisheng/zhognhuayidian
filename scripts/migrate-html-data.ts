import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// 读取HTML站点数据
const htmlDataPath = path.join(process.cwd(), 'data/choose-chinese-made-ct-mri-device-main/data.json');
const htmlData = JSON.parse(fs.readFileSync(htmlDataPath, 'utf-8'));

// 辅助函数
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

const parsePriceRange = (priceStr: string) => {
  // 解析价格字符串，如 "1,468.71万元" 或 "2799700 to 3985000 yuan"
  if (priceStr.includes('to')) {
    const [min, max] = priceStr.split('to').map(p => 
      parseInt(p.replace(/[^0-9]/g, ''))
    );
    return { min: min * 6.5, max: max * 6.5 }; // 转换为美元
  } else if (priceStr.includes('万元')) {
    const value = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
    const usdValue = value * 10000 * 0.14; // 万元转美元
    return { min: usdValue * 0.8, max: usdValue * 1.2 };
  } else {
    const value = parseInt(priceStr.replace(/[^0-9]/g, ''));
    const usdValue = value * 0.14; // 人民币转美元
    return { min: usdValue * 0.8, max: usdValue * 1.2 };
  }
};

const getCountryFromBrand = (brand: string): string => {
  const chineseBrands = ['United Imaging', 'Neusoft', 'Anke', 'Mingfeng', 'Wandong'];
  if (chineseBrands.some(cb => brand.includes(cb))) return 'China';
  if (brand.includes('GE')) return 'USA';
  if (brand.includes('Siemens')) return 'Germany';
  if (brand.includes('Philips')) return 'Netherlands';
  if (brand.includes('Canon') || brand.includes('Toshiba')) return 'Japan';
  return 'Unknown';
};

const isChineseBrand = (brand: string): boolean => {
  const chineseBrands = ['United Imaging', 'Neusoft', 'Anke', 'Mingfeng', 'Wandong', '联影', '东软', '安科', '明峰', '万东'];
  return chineseBrands.some(cb => brand.includes(cb));
};

const generateManufacturerDescription = (brand: string): string => {
  const descriptions: { [key: string]: string } = {
    'GE': 'GE Healthcare is a leading global medical technology company providing innovative healthcare solutions.',
    'Siemens': 'Siemens Healthineers is a leading medical technology company with over 170 years of experience.',
    'Philips': 'Philips Healthcare is a global leader in health technology, focused on improving people\'s health.',
    'United Imaging': 'United Imaging is a leading Chinese medical equipment manufacturer specializing in advanced imaging solutions.',
    'Neusoft': 'Neusoft Medical is China\'s largest medical equipment manufacturer with comprehensive imaging solutions.',
    'Anke': 'Anke Medical is a pioneering Chinese MRI manufacturer with over 30 years of experience.',
    'Mingfeng': 'Mingfeng Medical specializes in advanced CT and imaging equipment manufacturing.',
    'Canon': 'Canon Medical Systems provides innovative medical imaging solutions worldwide.',
    'Toshiba': 'Toshiba Medical Systems (now Canon Medical) offers comprehensive medical imaging equipment.'
  };
  
  for (const [key, desc] of Object.entries(descriptions)) {
    if (brand.includes(key)) return desc;
  }
  
  return `${brand} is a medical equipment manufacturer providing imaging solutions.`;
};

const getManufacturerWebsite = (brand: string): string => {
  const websites: { [key: string]: string } = {
    'GE': 'https://www.gehealthcare.com',
    'Siemens': 'https://www.siemens-healthineers.com',
    'Philips': 'https://www.philips.com/healthcare',
    'United Imaging': 'https://www.united-imaging.com',
    'Neusoft': 'https://www.neusoft.com',
    'Anke': 'https://www.anke.com.cn',
    'Canon': 'https://global.medical.canon',
    'Toshiba': 'https://global.medical.canon'
  };
  
  for (const [key, website] of Object.entries(websites)) {
    if (brand.includes(key)) return website;
  }
  
  return '';
};

interface DeviceModel {
  priceRange: string;
  marketShare?: string;
  [key: string]: unknown;
}

const isHighValueDevice = (model: DeviceModel): boolean => {
  // 基于价格和市场份额判断是否为高价值设备
  const priceRange = parsePriceRange(model.priceRange);
  const marketShare = parseFloat(model.marketShare || '0');
  
  return priceRange.max > 1000000 || marketShare > 5; // 高价格或高市场份额
};

const generateDeviceDescription = (name: string, category: 'ct' | 'mri'): string => {
  if (category === 'ct') {
    if (name.includes('128')) return `${name} is an advanced 128-slice CT scanner providing high-resolution imaging with fast scan times.`;
    if (name.includes('64')) return `${name} is a 64-slice CT scanner offering excellent image quality for routine clinical applications.`;
    if (name.includes('32')) return `${name} is a 32-slice CT scanner suitable for general diagnostic imaging needs.`;
    if (name.includes('16')) return `${name} is a 16-slice CT scanner providing reliable imaging for basic clinical requirements.`;
    return `${name} is a CT scanner providing advanced computed tomography imaging capabilities.`;
  } else {
    if (name.includes('3.0T') || name.includes('3T')) return `${name} is a 3.0T MRI scanner offering superior image quality and advanced clinical applications.`;
    if (name.includes('1.5T')) return `${name} is a 1.5T MRI scanner providing excellent image quality for routine clinical use.`;
    if (name.includes('1.0T')) return `${name} is a 1.0T MRI scanner suitable for general diagnostic imaging applications.`;
    return `${name} is an MRI scanner providing advanced magnetic resonance imaging capabilities.`;
  }
};

// 主要迁移函数
export const migrateHTMLSiteData = async () => {
  console.log('开始迁移HTML站点数据...');
  
  try {
    // 1. 迁移制造商数据
    console.log('迁移制造商数据...');
    const manufacturerMap = new Map<string, string>();
    
    // 处理CT制造商
    for (const ctBrand of htmlData.imagingEquipment.ctScanners) {
      const manufacturerData = {
        name: ctBrand.brand,
        slug: generateSlug(ctBrand.brand),
        country: getCountryFromBrand(ctBrand.brand),
        is_chinese: isChineseBrand(ctBrand.brand),
        description: generateManufacturerDescription(ctBrand.brand),
        website: getManufacturerWebsite(ctBrand.brand),
        logo_url: null,
        founded_year: null,
        market_share_ct: parseFloat(ctBrand.models[0]?.marketShare || '0'),
        market_share_mri: 0,
        total_employees: null,
        annual_revenue: null,
        certifications: ['ISO 13485', 'FDA', 'CE'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { data: manufacturer, error } = await supabase
        .from('manufacturers')
        .upsert(manufacturerData, { onConflict: 'slug' })
        .select()
        .single();
      
      if (error) {
        console.error(`制造商 ${ctBrand.brand} 迁移失败:`, error);
        continue;
      }
      
      manufacturerMap.set(ctBrand.brand, manufacturer.id);
      console.log(`✓ 制造商 ${ctBrand.brand} 迁移成功`);
    }
    
    // 处理MRI制造商
    for (const mriBrand of htmlData.imagingEquipment.mriScanners) {
      if (manufacturerMap.has(mriBrand.brand)) {
        // 更新现有制造商的MRI市场份额
        const manufacturerId = manufacturerMap.get(mriBrand.brand);
        await supabase
          .from('manufacturers')
          .update({ market_share_mri: 5 }) // 默认MRI市场份额
          .eq('id', manufacturerId);
      } else {
        // 创建新的MRI制造商
        const manufacturerData = {
          name: mriBrand.brand,
          slug: generateSlug(mriBrand.brand),
          country: getCountryFromBrand(mriBrand.brand),
          is_chinese: isChineseBrand(mriBrand.brand),
          description: generateManufacturerDescription(mriBrand.brand),
          website: getManufacturerWebsite(mriBrand.brand),
          market_share_ct: 0,
          market_share_mri: 5,
          certifications: ['ISO 13485', 'FDA', 'CE'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        const { data: manufacturer, error } = await supabase
          .from('manufacturers')
          .upsert(manufacturerData, { onConflict: 'slug' })
          .select()
          .single();
        
        if (!error) {
          manufacturerMap.set(mriBrand.brand, manufacturer.id);
          console.log(`✓ MRI制造商 ${mriBrand.brand} 迁移成功`);
        }
      }
    }
    
    // 2. 迁移CT设备数据
    console.log('迁移CT设备数据...');
    for (const ctBrand of htmlData.imagingEquipment.ctScanners) {
      const manufacturerId = manufacturerMap.get(ctBrand.brand);
      if (!manufacturerId) continue;
      
      for (const model of ctBrand.models) {
        const priceRange = parsePriceRange(model.priceRange);
        
// 辅助函数：生成设备slug
const generateDeviceSlug = (name: string, manufacturerName?: string): string => {
  // 1. 基础清理：转小写，移除特殊字符
  let slug = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // 移除特殊字符
    .replace(/\s+/g, '-') // 空格转连字符
    .replace(/-+/g, '-') // 多个连字符合并
    .trim();
  
  // 2. 移除制造商前缀和设备类型后缀
  slug = slug
    .replace(/^(ge|siemens|philips|united-imaging|neusoft)-?/, '')
    .replace(/-(ct|mri|scanner)$/, '')
    .replace(/\b(model|series|system)\b/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  // 3. 处理特殊字符和数字
  slug = slug
    .replace(/\+/g, '-plus')
    .replace(/\./g, '-')
    .replace(/\//g, '-');
  
  // 4. 确保slug有效
  if (slug.length < 3 && manufacturerName) {
    const mfgSlug = manufacturerName.toLowerCase().replace(/[^a-z0-9]/g, '');
    slug = `${mfgSlug}-${slug}`;
  }
  
  return slug || `device-${Date.now()}`;
};

// 在数据迁移中生成slug
for (const model of ctBrand.models) {
  const deviceSlug = generateDeviceSlug(model.name, ctBrand.brand);
  
  const deviceData = {
    name: model.name,
    slug: deviceSlug, // 存储生成的slug
    manufacturer_id: manufacturerId,
    category: 'ct' as const,
    model: model.name,
    description: model.description || generateDeviceDescription(model.name, 'ct'),
    price_range_min: Math.round(priceRange.min),
    price_range_max: Math.round(priceRange.max),
    specifications: {
      detectorType: model.detectorType,
      marketShare: model.marketShare,
      priceRange: model.priceRange,
      sliceCount: extractSliceCount(model.name),
      type: extractDeviceType(model.name)
    },
    is_featured: isHighValueDevice(model),
    status: 'active' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  // 检查slug唯一性
  const { data: existingDevice } = await supabase
    .from('devices')
    .select('id')
    .eq('slug', deviceSlug)
    .single();
  
  if (existingDevice) {
    // 如果slug已存在，添加后缀
    deviceData.slug = `${deviceSlug}-${manufacturerId.slice(-4)}`;
  }
  
  const { error } = await supabase
    .from('devices')
    .upsert(deviceData, { onConflict: 'slug' });
}
        
        if (error) {
          console.error(`CT设备 ${model.name} 迁移失败:`, error);
        } else {
          console.log(`✓ CT设备 ${model.name} 迁移成功`);
        }
      }
    }
    
    // 3. 迁移MRI设备数据
    console.log('迁移MRI设备数据...');
    for (const mriBrand of htmlData.imagingEquipment.mriScanners) {
      const manufacturerId = manufacturerMap.get(mriBrand.brand);
      if (!manufacturerId) continue;
      
      for (const model of mriBrand.models) {
        const priceRange = parsePriceRange(model.priceRange);
        
        const deviceData = {
          name: model.name,
          slug: generateSlug(model.name),
          manufacturer_id: manufacturerId,
          category: 'mri' as const,
          model: model.name,
          description: model.description || generateDeviceDescription(model.name, 'mri'),
          price_range_min: Math.round(priceRange.min),
          price_range_max: Math.round(priceRange.max),
          specifications: {
            fieldStrength: extractFieldStrength(model.name),
            priceRange: model.priceRange
          },
          is_featured: isHighValueDevice(model),
          status: 'active' as const,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        const { error } = await supabase
          .from('devices')
          .upsert(deviceData, { onConflict: 'slug' });
        
        if (error) {
          console.error(`MRI设备 ${model.name} 迁移失败:`, error);
        } else {
          console.log(`✓ MRI设备 ${model.name} 迁移成功`);
        }
      }
    }
    
    // 4. 迁移历史数据
    console.log('迁移历史数据...');
    for (const ctEvent of htmlData.historicalTimeline.ct) {
      const eventData = {
        year: parseInt(ctEvent.year),
        event_title: ctEvent.event,
        event_description: ctEvent.event,
        category: 'ct' as const,
        importance_level: 4,
        created_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('historical_events')
        .upsert(eventData, { onConflict: 'year,event_title' });
      
      if (!error) {
        console.log(`✓ CT历史事件 ${ctEvent.year} 迁移成功`);
      }
    }
    
    for (const mriEvent of htmlData.historicalTimeline.mri) {
      const eventData = {
        year: parseInt(mriEvent.year),
        event_title: mriEvent.event,
        event_description: mriEvent.event,
        category: 'mri' as const,
        importance_level: 4,
        created_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('historical_events')
        .upsert(eventData, { onConflict: 'year,event_title' });
      
      if (!error) {
        console.log(`✓ MRI历史事件 ${mriEvent.year} 迁移成功`);
      }
    }
    
    // 5. 迁移客户数据
    console.log('迁移客户数据...');
    for (const customer of htmlData.customers) {
      for (const location of customer.locations) {
        const customerData = {
          name: location,
          manufacturer: customer.brand,
          country: 'China', // 大部分客户在中国
          city: extractCityFromLocation(location),
          industry: 'Healthcare',
          created_at: new Date().toISOString()
        };
        
        const { error } = await supabase
          .from('customers')
          .upsert(customerData, { onConflict: 'name' });
        
        if (!error) {
          console.log(`✓ 客户 ${location} 迁移成功`);
        }
      }
    }
    
    console.log('✅ HTML站点数据迁移完成！');
    
    // 输出统计信息
    const { data: manufacturersCount } = await supabase
      .from('manufacturers')
      .select('id', { count: 'exact' });
    
    const { data: devicesCount } = await supabase
      .from('devices')
      .select('id', { count: 'exact' });
    
    const { data: eventsCount } = await supabase
      .from('historical_events')
      .select('id', { count: 'exact' });
    
    const { data: customersCount } = await supabase
      .from('customers')
      .select('id', { count: 'exact' });
    
    console.log('\n📊 迁移统计:');
    console.log(`制造商: ${manufacturersCount?.length || 0}`);
    console.log(`设备: ${devicesCount?.length || 0}`);
    console.log(`历史事件: ${eventsCount?.length || 0}`);
    console.log(`客户: ${customersCount?.length || 0}`);
    
  } catch (error) {
    console.error('数据迁移失败:', error);
    throw error;
  }
};

// 辅助函数：提取层数
const extractSliceCount = (name: string): number | null => {
  const match = name.match(/(\d+)[-\s]?slice/i) || name.match(/(\d+)层/);
  return match ? parseInt(match[1]) : null;
};

// 辅助函数：提取磁场强度
const extractFieldStrength = (name: string): number | null => {
  const match = name.match(/(\d+\.?\d*)T/i);
  return match ? parseFloat(match[1]) : null;
};

// 辅助函数：从位置提取城市
const extractCityFromLocation = (location: string): string => {
  // 简单的城市提取逻辑
  const cityMatch = location.match(/^([^市县区]+[市县区])/);
  return cityMatch ? cityMatch[1] : location.split(/[市县区]/)[0] + '市';
};

// 如果直接运行此脚本
if (require.main === module) {
  migrateHTMLSiteData()
    .then(() => {
      console.log('迁移完成');
      process.exit(0);
    })
    .catch((error) => {
      console.error('迁移失败:', error);
      process.exit(1);
    });
}