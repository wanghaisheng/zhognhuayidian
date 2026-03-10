// ⚠️  OBSOLETE SCRIPT - This script is no longer needed and can be safely removed
// 📅 Marked obsolete on: 2026-03-10T18:57:28.368Z
// 🔄 Purpose: Internationalization fixes (completed)
// 
# H 标签优化指南

## 原则

1. **每个页面只有一个 H1** - 应该是页面的主标题
2. **层级递进** - H1 → H2 → H3，不跳级
3. **语义化** - H 标签用于结构，CSS 用于样式
4. **包含关键词** - H 标签中自然地包含目标关键词

## 页面结构模板

### 首页 (Index.tsx)
```
<h1>CT Scanner Hub - 全球医疗影像设备权威目录</h1>
  <h2>全球数据统计</h2>
  <h2>设备分类导航</h2>
  <h2>专业资源</h2>
  <h2>平台优势</h2>
```

### 设备列表页 (Devices.tsx)
```
<h1>医疗影像设备目录</h1>
  <h2>设备搜索与筛选</h2>
  <h2>设备目录</h2>
    <h3>CT 扫描仪</h3>
    <h3>MRI 设备</h3>
  <h2>设备对比分析</h2>
  <h2>专业文章</h2>
```

### 设备详情页 (DeviceDetailPage.tsx)
```
<h1>[设备名称] - [制造商]</h1>
  <h2>技术规格</h2>
    <h3>成像性能</h3>
    <h3>硬件配置</h3>
  <h2>价格信息</h2>
  <h2>制造商信息</h2>
  <h2>客户评价</h2>
  <h2>相关设备推荐</h2>
```

### 制造商列表页 (Manufacturers.tsx)
```
<h1>全球医疗影像设备制造商目录</h1>
  <h2>制造商统计</h2>
  <h2>筛选与搜索</h2>
  <h2>制造商列表</h2>
    <h3>[按国家分组]</h3>
      <h4>[制造商名称]</h4>
```

### 制造商详情页 (ManufacturerDetail.tsx)
```
<h1>[制造商名称]</h1>
  <h2>公司概览</h2>
  <h2>产品系列</h2>
    <h3>CT 扫描仪</h3>
    <h3>MRI 设备</h3>
  <h2>全球市场</h2>
  <h2>认证资质</h2>
  <h2>客户案例</h2>
```

### 知识中心 (KnowledgeCenter.tsx)
```
<h1>医疗影像设备知识中心</h1>
  <h2>设备发展历史</h2>
  <h2>技术原理解析</h2>
  <h2>选购指南</h2>
  <h2>行业资讯</h2>
```

## 实施步骤

1. ✅ 创建 `<Heading>` 组件
2. ✅ 更新首页 (Index.tsx)
3. ✅ 更新设备列表页 (Devices.tsx)
4. ✅ 更新设备详情组件 (DeviceDetail.tsx)
5. ✅ 更新制造商页面 (Manufacturers.tsx, ManufacturerDetail.tsx)
6. ✅ 更新知识中心页面 (KnowledgeCenter.tsx, History.tsx, Technology.tsx, Guide.tsx)

## 检查清单

- [x] 每个页面只有一个 H1
- [x] H 标签层级不跳级（不出现 H2 后直接 H4）
- [x] H1 包含页面主要关键词
- [x] H2/H3 描述页面主要章节
- [x] 移除用于纯样式目的的 H 标签（改用 className）
- [x] 使用语义化的 `<Heading>` 组件

## 已优化页面列表

### 核心页面
- ✅ Index.tsx - 首页（H1: CT Scanner Hub 主标题）
- ✅ Devices.tsx - 设备列表页（H1: 医疗影像设备目录）
- ✅ Manufacturers.tsx - 制造商列表页（H1: 全球制造商）

### 详情页面
- ✅ DeviceDetail.tsx - 设备详情组件（H1: 设备名称）
- ✅ ManufacturerDetail.tsx - 制造商详情页（H1: 制造商名称）

### 知识中心
- ✅ KnowledgeCenter.tsx - 知识中心主页（H1: 知识中心）
- ✅ History.tsx - 发展历史（H1: 发展历史）
- ✅ Technology.tsx - 技术对比（H1: 技术对比）
- ✅ Guide.tsx - 选购指南（H1: 选购指南）
