# Dynamic页面内容加载修复方案

## 问题分析

所有Dynamic页面组件都在使用模拟数据或数据库查询，而不是读取content目录下的真实Markdown文件。content目录下有丰富的内容文件，应该被这些页面使用。

## 现有content文件结构

```
content/
├── comparisons/en/
│   ├── 16-slice-vs-64-slice-ct.md
│   ├── chinese-vs-western-ct-scanners.md
│   ├── ct-vs-mri.md
│   ├── philips-vs-siemens-ct.md
│   └── siemens-vs-ge-ct-scanners.md
├── education/en/
│   ├── ct-scanner-basics.md
│   ├── ct-scanner-complete-guide.md
│   ├── ct-vs-mri-detailed.md
│   ├── medical-imaging-comparison.md
│   ├── mri-preparation-guide.md
│   ├── mri-scan-cost-complete.md
│   ├── mri-vs-ct-detailed.md
│   ├── mri.md
│   ├── pricing-ct-scanner.md
│   ├── pricing-mri-scan-cost.md
│   ├── what-is-mri-complete.md
│   └── what-is-mri.md
├── guides/en/
│   ├── ct-scanner-buying-guide.md
│   ├── financing.md
│   ├── import.md
│   └── maintenance.md
└── learn/en/
    └── what-is-mri.md
```

## 需要修复的Dynamic页面

### 1. DynamicGuidePage ✅ 已部分修复
- **当前状态**: 已更改为使用`guides`内容类型
- **问题**: 仍需要确保正确映射到真实文件
- **真实文件**: `content/guides/en/import.md`, `financing.md`, `maintenance.md`

### 2. DynamicEducationPage ❌ 需要修复
- **当前状态**: 使用`useEducationContent`钩子，但可能不正确
- **问题**: 应该读取`content/education/en/`下的文件
- **真实文件**: `mri.md`, `ct-scanner-basics.md`, `what-is-mri.md`等

### 3. DynamicComparisonPage ❌ 需要修复
- **当前状态**: 主要依赖数据库查询
- **问题**: 应该优先读取`content/comparisons/en/`下的文件
- **真实文件**: `ct-vs-mri.md`, `philips-vs-siemens-ct.md`等

### 4. DynamicTechnologyComparisonPage ❌ 需要修复
- **当前状态**: 使用`comparison`内容类型，但生成动态内容
- **问题**: 应该读取真实的对比文件
- **真实文件**: `content/comparisons/en/ct-vs-mri.md`

### 5. DynamicPricingPage ❌ 需要修复
- **当前状态**: 使用`education`类型查找`pricing-${priceType}`
- **问题**: 应该读取真实的定价文件
- **真实文件**: `pricing-ct-scanner.md`, `pricing-mri-scan-cost.md`

## 修复策略

### 1. 更新内容类型映射
```typescript
// 正确的内容类型映射
const contentTypeMapping = {
  '/guides/:guideType': 'guides',           // guides/en/import.md
  '/education/:topic': 'education',         // education/en/mri.md
  '/compare/:a/:b': 'comparisons',          // comparisons/en/ct-vs-mri.md
  '/pricing/:type': 'education'             // education/en/pricing-*.md
};
```

### 2. 文件名映射规则
```typescript
// URL参数到文件名的映射
const fileNameMapping = {
  // 教育内容
  'mri': 'mri.md',
  'ct': 'ct-scanner-basics.md',
  'what-is-mri': 'what-is-mri.md',
  
  // 对比内容
  'ct-mri': 'ct-vs-mri.md',
  'philips-siemens': 'philips-vs-siemens-ct.md',
  
  // 定价内容
  'ct-scanner': 'pricing-ct-scanner.md',
  'mri-scan-cost': 'pricing-mri-scan-cost.md'
};
```

### 3. 内容加载优先级
1. **优先**: 读取真实的Markdown文件
2. **回退**: 使用数据库数据（如果存在）
3. **最后**: 生成动态内容

## 具体修复步骤

### Step 1: 修复DynamicEducationPage
```typescript
// 应该使用education内容类型，映射到正确的文件名
const { content, loading, error } = useHybridContent('education', topic || '');
```

### Step 2: 修复DynamicComparisonPage
```typescript
// 应该优先尝试读取comparisons文件
const comparisonSlug = `${brandA}-vs-${brandB}`;
const { content, loading, error } = useHybridContent('comparisons', comparisonSlug);
```

### Step 3: 修复DynamicTechnologyComparisonPage
```typescript
// 应该读取comparisons文件，如ct-vs-mri
const comparisonSlug = `${technologyA}-vs-${technologyB}`;
const { content, loading, error } = useHybridContent('comparisons', comparisonSlug);
```

### Step 4: 修复DynamicPricingPage
```typescript
// 应该读取education目录下的pricing文件
const pricingSlug = `pricing-${priceType}`;
const { content, loading, error } = useHybridContent('education', pricingSlug);
```

### Step 5: 更新Markdown内容管理器
确保`markdownContentManager`能够正确处理所有内容类型：
- `guides` → `content/guides/en/`
- `education` → `content/education/en/`
- `comparisons` → `content/comparisons/en/`
- `learn` → `content/learn/en/`

## 预期效果

修复后，所有Dynamic页面将：
1. 优先显示真实的Markdown内容
2. 保持动态功能（如价格计算器）
3. 在没有对应文件时提供合理的回退
4. 提供更好的SEO和内容管理

## 测试验证

修复后需要测试的URL：
- `/guides/import` → 应该显示`import.md`内容
- `/education/mri` → 应该显示`mri.md`内容
- `/compare/ct/mri` → 应该显示`ct-vs-mri.md`内容
- `/pricing/mri-scan-cost` → 应该显示`pricing-mri-scan-cost.md`内容