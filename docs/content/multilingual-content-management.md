# [LEGACY] 多语言内容管理系统

> **Warning**: 此文档反映了早期的数据库设计（字段级多语言）。当前项目推荐使用 **JSONB Pattern** 和 **Deep Merge** 策略进行数据管理。
> 请参阅 [Development Standards](../technical/development-standards.md) 和 [Data Strategy](../technical/DATA_STRATEGY.md) 获取最新规范。

## 概述

本项目实现了基于 Lovable Cloud 数据库的多语言内容管理系统，支持中英文双语内容。

## 数据库表结构

### 1. devices (设备表)
存储医疗设备信息，支持多语言字段。

**多语言字段：**
- `name_zh` / `name_en` - 设备名称
- `description_zh` / `description_en` - 设备描述
- `features_zh` / `features_en` - 设备特性（数组）
- `applications_zh` / `applications_en` - 应用场景（数组）

**其他字段：**
- `slug` - URL 友好的唯一标识
- `type` - 设备类型（CT, MRI, X-Ray, Ultrasound）
- `manufacturer_id` - 关联制造商 ID
- `specifications` - 技术规格（JSONB）
- `image_url` - 图片 URL
- `price_range` - 价格区间
- `release_year` - 发布年份
- `certifications` - 认证（数组）
- `is_featured` - 是否精选
- `published` - 是否发布

### 2. manufacturers (制造商表)
存储制造商信息，支持多语言字段。

**多语言字段：**
- `name_zh` / `name_en` - 制造商名称
- `description_zh` / `description_en` - 制造商描述

**其他字段：**
- `slug` - URL 友好的唯一标识
- `country` - 国家
- `founded_year` - 成立年份
- `headquarters` - 总部地址
- `website` - 网站
- `logo_url` - Logo URL
- `category` - 产品类别（数组）
- `market_share` - 市场份额
- `is_featured` - 是否精选
- `published` - 是否发布

### 3. articles (文章表)
存储 Markdown 格式的文章内容，支持多语言。

**多语言字段：**
- `title_zh` / `title_en` - 文章标题
- `excerpt_zh` / `excerpt_en` - 文章摘要
- `content_zh` / `content_en` - 文章内容（Markdown）

**其他字段：**
- `slug` - URL 友好的唯一标识
- `category` - 分类
- `tags` - 标签（数组）
- `author` - 作者
- `featured_image` - 特色图片
- `read_time` - 阅读时间（分钟）
- `published` - 是否发布
- `published_at` - 发布时间

### 4. customers (客户案例表)
存储医院客户案例，支持多语言。

**多语言字段：**
- `name_zh` / `name_en` - 医院名称
- `description_zh` / `description_en` - 案例描述

**其他字段：**
- `slug` - URL 友好的唯一标识
- `province` - 省份
- `city` - 城市
- `hospital_type` - 医院类型
- `bed_count` - 床位数
- `devices` - 购买的设备（JSONB 数组）
- `year` - 年份
- `image_url` - 图片 URL
- `published` - 是否发布

## 使用方法

### 1. 使用 Hook 获取多语言内容

```typescript
import { useMultilingualContent, useMultilingualObject } from '@/hooks/useMultilingualContent';

function DeviceCard({ device }) {
  // 方法 1: 获取单个字段
  const name = useMultilingualContent(device.name_zh, device.name_en);
  const description = useMultilingualContent(device.description_zh, device.description_en);
  
  // 方法 2: 转换整个对象
  const localizedDevice = useMultilingualObject(device);
  // localizedDevice.name 会根据当前语言返回 name_zh 或 name_en
  
  return (
    <div>
      <h3>{name}</h3>
      <p>{description}</p>
      {/* 或 */}
      <h3>{localizedDevice.name}</h3>
      <p>{localizedDevice.description}</p>
    </div>
  );
}
```

### 2. 使用 ContentManager 获取数据

```typescript
import { contentManager } from '@/lib/multilingualContentManager';

// 获取所有设备
const devices = await contentManager.getDevices();

// 获取特定类型的设备
const ctDevices = await contentManager.getDevices({ type: 'CT' });

// 获取精选设备
const featuredDevices = await contentManager.getDevices({ is_featured: true });

// 根据 slug 获取设备
const device = await contentManager.getDeviceBySlug('philips-ingenia-ambition-s');

// 获取制造商
const manufacturers = await contentManager.getManufacturers();

// 获取特定国家的制造商
const chinaManufacturers = await contentManager.getManufacturers({ country: 'China' });

// 获取文章
const articles = await contentManager.getArticles({ category: 'guide' });

// 获取统计数据
const stats = await contentManager.getStats();
```

### 3. 在 React 组件中使用

```typescript
import { useEffect, useState } from 'react';
import { contentManager, MultilingualDevice } from '@/lib/multilingualContentManager';
import { useMultilingualObject } from '@/hooks/useMultilingualContent';

function DeviceList() {
  const [devices, setDevices] = useState<MultilingualDevice[]>([]);
  
  useEffect(() => {
    contentManager.getDevices({ type: 'CT' }).then(setDevices);
  }, []);
  
  return (
    <div>
      {devices.map(device => {
        const localizedDevice = useMultilingualObject(device);
        return (
          <div key={device.id}>
            <h3>{localizedDevice.name}</h3>
            <p>{localizedDevice.description}</p>
          </div>
        );
      })}
    </div>
  );
}
```

## 数据迁移

### 从现有数据迁移

现有的数据存储在以下文件中：
- `src/data/seedData.json` - 设备和制造商数据
- `src/data/devicesWithSlugs.ts` - 设备详细信息
- `src/data/manufacturersWithSlugs.ts` - 制造商详细信息
- `src/data/knowledgeHistory.ts` - 历史文章
- `src/data/customers.ts` - 客户案例

需要创建迁移脚本将这些数据导入到数据库中。

## 安全性

### Row Level Security (RLS)

所有表都启用了 RLS，策略如下：
- **读取权限**: 所有已发布的内容（`published = true`）对公众可读
- **写入权限**: 未来将实现管理员认证后才能写入

### 数据验证

- 所有必填字段都有非空约束
- slug 字段有唯一性约束
- 外键约束确保数据完整性
- 自动更新 `updated_at` 时间戳

## 后续计划

### Phase 1: 数据迁移 ✅
- [x] 创建数据库表结构
- [x] 创建 ContentManager 和 Hooks
- [ ] 创建数据迁移脚本
- [ ] 迁移现有数据到数据库

### Phase 2: 集成到前端
- [ ] 更新 DeviceDetailPage 使用新的数据源
- [ ] 更新 ManufacturerDetail 使用新的数据源
- [ ] 更新列表页面使用新的数据源
- [ ] 更新文章页面使用新的数据源

### Phase 3: 简易 CMS
- [ ] 创建管理后台路由
- [ ] 实现设备 CRUD 界面
- [ ] 实现 Markdown 编辑器
- [ ] 添加图片上传功能
- [ ] 添加预览和发布功能

### Phase 4: 高级功能
- [ ] 实现内容版本控制
- [ ] 添加内容审核流程
- [ ] 实现搜索和过滤功能
- [ ] 添加批量导入/导出功能
- [ ] 性能优化和缓存

## 技术栈

- **数据库**: Lovable Cloud (Supabase PostgreSQL)
- **ORM**: Supabase JS Client
- **前端**: React + TypeScript
- **路由**: React Router
- **国际化**: react-i18next + 自定义 Hooks
- **Markdown**: marked (未来实现)

## 性能优化

1. **数据库索引**: 已为常用查询字段创建索引
2. **RLS 策略**: 只返回已发布的内容
3. **懒加载**: 按需加载详细内容
4. **缓存**: 未来可实现 React Query 缓存

## 贡献指南

在添加新内容时：
1. 确保同时提供中英文版本
2. 使用语义化的 slug
3. 设置适当的 published 状态
4. 填写所有必填字段
5. 使用 ContentManager 而不是直接调用 Supabase
