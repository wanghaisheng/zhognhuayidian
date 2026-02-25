# [DEPRECATED] 数据管理与网站结构优化策略

此文档已废弃。请参阅统一策略：
[data-strategy.md](file:///e:/workspace/ct-scanner-compass-directory/docs/technical/data-strategy.md)

> **注意**: 本文档侧重于数据架构和URL规划。关于代码规范、TypeScript标准和构建流程，请参阅 [Development Standards](./development-standards.md)。

## 1. 数据分类与管理策略

### 1.3 多语言数据管理策略 (JSONB Column Pattern)

为支持多语言内容并保持架构的灵活性，本项目采用 **JSONB Column Pattern (模式4)**。

#### 核心原则
1. **单一实体定义**：系统只维护一套核心实体类型（如 `Manufacturer`, `Device`），不为每种语言创建单独的类型或表。
2. **全量字段覆盖**：`translations` 对象中的结构应与主实体结构完全一致（即 `DeepPartial<MainEntity>`），支持任何字段的本地化覆盖。
3. **运行时动态合并**：前端/API层在获取数据时，通过深度合并算法（Deep Merge）将 `translations` 中的当前语言内容覆盖到主实体上，从而获得最终的本地化对象。

#### 数据结构示例
所有主要实体（Device, Manufacturer, MarketData）都应包含一个 `translations` 字段：

```json
{
  "id": "ge-healthcare",
  "name": "GE Healthcare",
  "description": "Leading global medical technology company...",
  "website": "https://www.gehealthcare.com",
  "specifications": {
    "dimensions": { "width": "200cm" }
  },
  "translations": {
    "zh": {
      "name": "通用电气医疗",
      "description": "全球领先的医疗技术公司...",
      "website": "https://www.gehealthcare.cn", // 支持特定语言覆盖任意字段
      "specifications": {
        "dimensions": { "width": "200厘米" } // 支持深度嵌套覆盖
      }
    },
    "es": {
      "name": "GE Salud",
      "description": "Empresa líder mundial..."
    }
  }
}
```

#### 优势
- **极致灵活性**：无需修改Schema即可让任何字段支持多语言（例如针对不同市场使用不同的官网链接）。
- **零冗余**：不需要维护 `ManufacturerLocalizableFields` 等中间接口。
- **统一处理逻辑**：所有实体复用同一套深度合并逻辑，降低维护成本。

### 1.1 JSON数据管理（结构化数据）
适用于需要程序化处理、搜索和筛选的结构化数据：

#### 制造商数据 (manufacturers.json)
```json
{
  "id": "string",
  "name": "string",
  "country": "string",
  "region": "string",
  "founded_year": "number",
  "headquarters": "string",
  "website": "string",
  "market_share": "number",
  "product_lines": ["CT", "MRI", "X-Ray"],
  "certifications": ["string"],
  "contact_info": {
    "email": "string",
    "phone": "string",
    "address": "string"
  },
  "financial_data": {
    "annual_revenue": "number",
    "employee_count": "number",
    "market_value": "number"
  },
  "technical_advantages": ["string"],
  "patent_count": "number"
}
```

#### 设备数据 (devices.json)
```json
{
  "id": "string",
  "name": "string",
  "manufacturer_id": "string",
  "type": "CT|MRI|X-Ray|Ultrasound",
  "category": "High-end|Mid-range|Entry-level",
  "model_number": "string",
  "release_year": "number",
  "specifications": {
    "detector_rows": "number", // CT专用
    "field_strength": "number", // MRI专用
    "magnet_type": "string", // MRI专用
    "aperture_size": "number",
    "scan_speed": "string",
    "resolution": "string"
  },
  "price_range": {
    "min": "number",
    "max": "number",
    "currency": "CNY"
  },
  "features": ["string"],
  "certifications": ["CE", "ISO", "FDA"],
  "target_market": ["Hospital", "Clinic", "Research"],
  "availability_regions": ["string"]
}
```

#### 客户案例数据 (customers.json)
```json
{
  "id": "string",
  "hospital_name": "string",
  "location": {
    "city": "string",
    "province": "string",
    "country": "string"
  },
  "hospital_type": "Public|Private|Research|Specialty",
  "bed_count": "number",
  "purchased_devices": [
    {
      "device_id": "string",
      "purchase_date": "string",
      "contract_amount": "number",
      "warranty_period": "string"
    }
  ],
  "contact_person": "string",
  "procurement_budget": "number"
}
```

#### 市场分析数据 (market_analysis.json)
```json
{
  "market_segments": [
    {
      "id": "string",
      "name": "string",
      "type": "CT|MRI",
      "segment": "High-end|Mid-range|Entry-level",
      "market_share": "number",
      "growth_rate": "number",
      "key_players": ["string"],
      "price_range": {
        "min": "number",
        "max": "number"
      },
      "target_customers": ["string"]
    }
  ],
  "technology_trends": [
    {
      "id": "string",
      "name": "string",
      "category": "AI|Hardware|Software",
      "description": "string",
      "impact_level": "High|Medium|Low",
      "timeline": "string",
      "affected_devices": ["string"]
    }
  ]
}
```

### 1.2 Markdown内容管理（非结构化内容）
适用于需要SEO优化、内容阅读和编辑的文档：

#### 历史文档 (history/)
- `ct-scanner-development-timeline.md`
- `mri-development-timeline.md` 
- `first-ct-scanner.md`
- `industry-milestones.md`

#### 技术指南 (guides/)
- `ct-scanner-buying-guide.md`
- `mri-technology-overview.md`
- `device-comparison-guide.md`
- `import-procedures.md`

#### 市场分析报告 (analysis/)
- `china-ct-market-analysis.md`
- `global-mri-trends.md`
- `pricing-analysis.md`
- `competitive-landscape.md`

#### 品牌专题 (brands/)
- `ge-healthcare-profile.md`
- `siemens-healthineers.md`
- `united-imaging-story.md`
- `neusoft-medical.md`

## 2. 用户故事地图

### 2.1 核心用户群体

#### 医院采购经理 (Hospital Procurement Manager)
**用户目标**: 为医院采购最适合的医疗设备
**关键需求**:
- 快速比较不同品牌设备的技术参数和价格
- 了解设备的可靠性和售后服务
- 获取同类医院的采购案例和经验分享
- 掌握市场价格趋势和谈判策略

**用户旅程**:
1. 首页浏览 → 设备分类页面
2. 筛选条件设置 → 设备列表比较
3. 详细规格查看 → 价格区间了解
4. 客户案例参考 → 制造商联系信息
5. 询价表单提交 → 跟进服务

#### 医疗设备经销商 (Medical Equipment Dealer)
**用户目标**: 了解市场动态，寻找合作机会
**关键需求**:
- 掌握各品牌的市场份额和竞争态势
- 了解新产品发布和技术趋势
- 获取潜在客户信息和联系方式
- 分析区域市场机会

**用户旅程**:
1. 市场分析页面 → 品牌对比
2. 技术趋势了解 → 产品发布动态
3. 区域客户分析 → 商机识别
4. 制造商合作信息 → 渠道申请

#### 医疗行业分析师 (Healthcare Industry Analyst)
**用户目标**: 研究行业趋势，撰写分析报告
**关键需求**:
- 获取准确的市场数据和统计信息
- 了解技术发展趋势和创新动向
- 分析竞争格局和市场变化
- 下载报告和数据文件

**用户旅程**:
1. 数据中心页面 → 统计报表查看
2. 趋势分析文章 → 深度研究报告
3. 历史数据对比 → 预测模型建立
4. 专业资料下载 → 引用来源确认

#### 医学影像科医生 (Radiologist)
**用户目标**: 了解设备技术特点，选择最适合的检查设备
**关键需求**:
- 详细的技术规格和成像质量信息
- 设备操作复杂度和学习曲线
- 临床应用案例和图像样本
- 设备维护和故障率信息

**用户旅程**:
1. 技术文档页面 → 规格详细对比
2. 临床案例研究 → 成像效果评估
3. 操作培训资料 → 学习资源获取
4. 专家评价参考 → 设备推荐意见

### 2.2 次要用户群体

#### 医院管理层 (Hospital Administrators)
- 关注投资回报率和运营成本
- 需要整体解决方案和服务包

#### 政府采购官员 (Government Procurement Officers)
- 关注合规性和公开透明的采购流程
- 需要标准化的技术规格和评估标准

#### 医疗投资者 (Healthcare Investors)
- 关注市场增长潜力和投资机会
- 需要行业报告和财务数据

## 3. URL结构与内链规划

### 3.1 SEO友好的URL结构

#### 主要页面结构
```
/ (首页)
├── /devices/ (设备总览)
│   ├── /devices/ct-scanners/ (CT设备)
│   │   ├── /devices/ct-scanners/brands/ (CT品牌)
│   │   │   ├── /devices/ct-scanners/brands/ge/ (GE CT设备)
│   │   │   ├── /devices/ct-scanners/brands/siemens/ (西门子CT设备)
│   │   │   └── /devices/ct-scanners/brands/united-imaging/ (联影CT设备)
│   │   ├── /devices/ct-scanners/categories/ (CT分类)
│   │   │   ├── /devices/ct-scanners/categories/high-end/ (高端CT)
│   │   │   ├── /devices/ct-scanners/categories/mid-range/ (中端CT)
│   │   │   └── /devices/ct-scanners/categories/entry-level/ (入门级CT)
│   │   └── /devices/ct-scanners/[model-name]/ (具体型号页面)
│   └── /devices/mri-scanners/ (MRI设备)
│       ├── /devices/mri-scanners/brands/ (MRI品牌)
│       ├── /devices/mri-scanners/field-strength/ (按磁场强度分类)
│       │   ├── /devices/mri-scanners/field-strength/1.5t/ (1.5T MRI)
│       │   ├── /devices/mri-scanners/field-strength/3t/ (3T MRI)
│       │   └── /devices/mri-scanners/field-strength/5t/ (5T MRI)
│       └── /devices/mri-scanners/[model-name]/ (具体型号页面)
│
├── /manufacturers/ (制造商)
│   ├── /manufacturers/global/ (国际制造商)
│   ├── /manufacturers/china/ (中国制造商)
│   ├── /manufacturers/[brand-name]/ (品牌详情页)
│   └── /manufacturers/[brand-name]/devices/ (品牌设备列表)
│
├── /analysis/ (市场分析)
│   ├── /analysis/market-reports/ (市场报告)
│   ├── /analysis/pricing-trends/ (价格趋势)
│   ├── /analysis/technology-trends/ (技术趋势)
│   └── /analysis/competitive-landscape/ (竞争格局)
│
├── /customers/ (客户案例)
│   ├── /customers/hospitals/ (医院案例)
│   ├── /customers/by-region/ (按地区分类)
│   │   ├── /customers/by-region/beijing/ (北京地区)
│   │   ├── /customers/by-region/shanghai/ (上海地区)
│   │   └── /customers/by-region/guangdong/ (广东地区)
│   └── /customers/success-stories/ (成功案例)
│
├── /guides/ (指南中心)
│   ├── /guides/buying-guide/ (采购指南)
│   ├── /guides/technology-overview/ (技术概览)
│   ├── /guides/import-procedures/ (进口流程)
│   └── /guides/maintenance-tips/ (维护贴士)
│
├── /history/ (历史发展)
│   ├── /history/ct-development/ (CT发展历史)
│   ├── /history/mri-evolution/ (MRI发展历程)
│   └── /history/industry-milestones/ (行业里程碑)
│
└── /contact/ (联系我们)
    ├── /contact/inquiry/ (询价表单)
    ├── /contact/dealers/ (经销商联系)
    └── /contact/support/ (技术支持)
```

### 3.2 内链策略

#### 面包屑导航
每个页面都应该有清晰的面包屑导航：
```html
首页 > 设备 > CT扫描仪 > GE品牌 > Revolution CT
```

#### 相关内容推荐
1. **设备页面内链**:
   - 同品牌其他型号
   - 同类别竞品对比
   - 相关技术文章
   - 客户使用案例

2. **制造商页面内链**:
   - 品牌设备列表
   - 竞争对手对比
   - 市场份额分析
   - 历史发展文章

3. **分析报告内链**:
   - 相关设备推荐
   - 历史数据对比
   - 技术趋势文章
   - 专家观点引用

#### 主题聚类内链
1. **CT扫描仪主题聚类**:
   - 技术原理 → 设备型号 → 制造商 → 客户案例
   - 市场分析 → 价格趋势 → 采购指南 → 询价表单

2. **MRI扫描仪主题聚类**:
   - 磁场强度介绍 → 设备对比 → 临床应用 → 成功案例
   - 技术发展 → 创新趋势 → 未来展望 → 投资机会

## 4. 实施计划

### 第一阶段：数据结构重组 (1-2周)
1. 创建标准化的JSON数据结构
2. 将现有数据迁移到新结构
3. 建立数据验证和质量检查机制
4. 实现数据API接口

### 第二阶段：内容管理系统 (2-3周)
1. 建立Markdown文档管理系统
2. 实现内容版本控制
3. 创建SEO元数据管理
4. 建立内容发布工作流

### 第三阶段：用户体验优化 (2-3周)
1. 实现多维度搜索和筛选
2. 建立个性化推荐系统
3. 优化页面加载性能
4. 实现移动端适配

### 第四阶段：Supabase集成 (1-2周)
1. 设计数据库schema
2. 实现数据同步机制
3. 建立用户管理系统
4. 集成分析和监控

### 数据库集成准备
为了顺利集成Supabase，需要：
1. 设计符合业务逻辑的数据库表结构
2. 建立数据迁移脚本
3. 实现数据备份和恢复机制
4. 建立数据安全和访问控制策略

这个策略将为网站提供强大的数据管理基础，支持未来的功能扩展和用户增长。
