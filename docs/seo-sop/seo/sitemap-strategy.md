# 动态站点地图策略文档

## 概述

本项目实施了完整的动态站点地图生成系统，可以自动从数据源和预渲染路由生成多语言站点地图，显著提升 SEO 表现。

## 系统架构

### 1. 核心组件

#### `scripts/generate-dynamic-sitemap.js`
动态站点地图生成器的核心脚本，负责：
- 从 `seedData.json` 读取设备、制造商、品牌数据
- 从 `prerender-routes.json` 读取预渲染路由列表
- 生成多个站点地图文件
- 自动集成到构建流程

#### `scripts/post-build.js`
构建后优化脚本，在构建完成后自动执行：
- 调用动态站点地图生成器
- HTML 文件优化
- 性能清单生成
- .htaccess 文件生成

### 2. 生成的站点地图文件

| 文件名 | 描述 | 用途 |
|--------|------|------|
| `sitemap.xml` | 主站点地图 | 包含所有页面的中英文版本，带 hreflang 标签 |
| `sitemap-zh.xml` | 中文站点地图 | 仅包含中文版本的所有页面 |
| `sitemap-en.xml` | 英文站点地图 | 仅包含英文版本的所有页面 |
| `sitemap-images.xml` | 图片站点地图 | 包含所有设备图片信息 |
| `sitemap-index.xml` | 站点地图索引 | 链接到所有其他站点地图 |
| `robots.txt` | 爬虫规则 | 指向站点地图，配置爬虫行为 |

## 功能特性

### 1. 自动数据源集成

```javascript
// 从种子数据读取
const data = loadSeedData();
// 包含：
// - devices: 设备列表
// - manufacturers: 制造商列表
// - brands: 品牌列表（自动去重）

// 从预渲染路由读取
const prerenderRoutes = loadPrerenderRoutes();
```

### 2. 多语言支持

每个页面都会生成中英文两个版本，并包含完整的 hreflang 标签：

```xml
<url>
  <loc>https://ctscannerinfo.com/devices</loc>
  <xhtml:link rel="alternate" hreflang="zh-CN" href="https://ctscannerinfo.com/devices" />
  <xhtml:link rel="alternate" hreflang="en-US" href="https://ctscannerinfo.com/en/devices" />
  <xhtml:link rel="alternate" hreflang="x-default" href="https://ctscannerinfo.com/devices" />
</url>
```

### 3. 智能优先级分配

| 页面类型 | 中文优先级 | 英文优先级 | 更新频率 |
|----------|-----------|-----------|---------|
| 首页 | 1.0 | 0.9 | daily |
| 设备列表 | 0.9 | 0.81 | weekly |
| 制造商列表 | 0.9 | 0.81 | weekly |
| 品牌列表 | 0.8 | 0.72 | weekly |
| 市场分析 | 0.9 | 0.81 | daily |
| 知识中心 | 0.8 | 0.72 | daily |
| 设备详情 | 0.7 | 0.65 | weekly |
| 制造商详情 | 0.8 | 0.75 | weekly |
| 品牌详情 | 0.75 | 0.7 | weekly |

### 4. 图片 SEO 优化

图片站点地图包含完整的图片信息：

```xml
<url>
  <loc>https://ctscannerinfo.com/device/ge-revolution-ct</loc>
  <image:image>
    <image:loc>https://example.com/image.jpg</image:loc>
    <image:caption>GE Revolution CT Scanner</image:caption>
    <image:title>GE Revolution CT</image:title>
  </image:image>
</url>
```

## 构建流程集成

### 1. 手动执行

```bash
# 生成预渲染路由列表
node scripts/generate-prerender-routes.js

# 生成动态站点地图
node scripts/generate-dynamic-sitemap.js
```

### 2. 自动执行（推荐）

在 `package.json` 中配置 `postbuild` 脚本：

```json
{
  "scripts": {
    "build": "tsc && vite build",
    "postbuild": "node scripts/post-build.js"
  }
}
```

构建时自动执行流程：
1. `npm run build` → Vite 构建
2. `postbuild` 钩子触发
3. `post-build.js` 执行：
   - 生成预渲染路由
   - 生成动态站点地图
   - 优化 HTML 文件
   - 生成性能清单

### 3. CI/CD 集成

```yaml
# .github/workflows/deploy.yml
- name: Build project
  run: npm run build

# 自动执行 postbuild，生成站点地图
```

## SEO 最佳实践

### 1. XML 转义

所有 URL 和文本内容都经过正确的 XML 转义：

```javascript
const escapeXml = (text) => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};
```

### 2. Robots.txt 配置

```txt
User-agent: *
Allow: /

# 站点地图
Sitemap: https://ctscannerinfo.com/sitemap-index.xml
Sitemap: https://ctscannerinfo.com/sitemap.xml
Sitemap: https://ctscannerinfo.com/sitemap-zh.xml
Sitemap: https://ctscannerinfo.com/sitemap-en.xml
Sitemap: https://ctscannerinfo.com/sitemap-images.xml

# AI 爬虫支持
User-agent: GPTBot
User-agent: ChatGPT-User
User-agent: Claude-Web
User-agent: anthropic-ai
User-agent: Google-Extended
Allow: /

# 爬取延迟
Crawl-delay: 1
```

### 3. Google Search Console 提交

1. 访问 [Google Search Console](https://search.google.com/search-console)
2. 添加站点地图索引：`https://ctscannerinfo.com/sitemap-index.xml`
3. 等待 Google 抓取和索引

## 性能优化

### 1. 数据限制

为了控制站点地图大小和生成时间：
- 设备详情页：限制前 100 个（可调整）
- 制造商详情页：全部包含（通常 < 100 个）
- 品牌详情页：全部包含（从设备数据提取）

### 2. 生成速度

- 平均生成时间：< 1 秒
- 文件大小：
  - sitemap.xml: ~500KB（约 500 个 URL）
  - sitemap-zh.xml: ~200KB
  - sitemap-en.xml: ~200KB
  - sitemap-images.xml: ~150KB

### 3. 站点地图分割（未来优化）

如果 URL 数量超过 50,000 或文件大小超过 50MB，可以考虑分割：

```javascript
// 按设备类型分割
const generateDeviceSitemapByCT = () => { /* ... */ };
const generateDeviceSitemapByMRI = () => { /* ... */ };

// 按制造商分割
const generateManufacturerSitemapByRegion = () => { /* ... */ };
```

## 监控和验证

### 1. 验证工具

```bash
# 验证 XML 格式
xmllint --noout public/sitemap.xml

# 检查 URL 可访问性
curl -I https://ctscannerinfo.com/sitemap.xml
```

### 2. Google Search Console 监控

关键指标：
- 已提交的 URL 数量
- 已索引的 URL 数量
- 抓取错误
- 索引覆盖率

### 3. 日志分析

```javascript
console.log('📊 数据统计:');
console.log(`   - 设备数量: ${data.devices.length}`);
console.log(`   - 制造商数量: ${data.manufacturers.length}`);
console.log(`   - 品牌数量: ${data.brands.length}`);
console.log(`   - 预渲染路由: ${prerenderRoutes.length}`);
console.log(`📈 总共生成 ${urlCount} 个 URL 条目`);
```

## 故障排除

### 问题 1: 站点地图未生成

**原因**：`seedData.json` 文件不存在或格式错误

**解决方案**：
```bash
# 检查文件是否存在
ls -la src/data/seedData.json

# 验证 JSON 格式
node -e "require('./src/data/seedData.json')"
```

### 问题 2: 路由缺失

**原因**：`prerender-routes.json` 未生成

**解决方案**：
```bash
# 先生成预渲染路由
node scripts/generate-prerender-routes.js

# 再生成站点地图
node scripts/generate-dynamic-sitemap.js
```

### 问题 3: XML 格式错误

**原因**：URL 或文本包含未转义的特殊字符

**解决方案**：确保使用 `escapeXml()` 函数处理所有文本内容

## 未来改进

### 1. 增量更新

只更新变化的 URL，而不是每次重新生成所有站点地图：

```javascript
const generateIncrementalSitemap = (lastBuildDate) => {
  // 只包含自上次构建以来更新的页面
};
```

### 2. 新闻站点地图

如果添加了博客或新闻功能：

```javascript
const generateNewsSitemap = (articles) => {
  // 包含发布日期和标题
};
```

### 3. 视频站点地图

如果添加了视频内容：

```javascript
const generateVideoSitemap = (videos) => {
  // 包含视频标题、描述、缩略图
};
```

### 4. 自动提交到搜索引擎

```javascript
const submitToSearchEngines = async () => {
  // 自动 ping Google、Bing 等搜索引擎
  await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`);
};
```

## 总结

动态站点地图系统为 CT Scanner Info 网站提供了：

✅ **全面的页面覆盖**：包含所有静态和动态生成的页面  
✅ **多语言支持**：完整的中英文站点地图，带 hreflang 标签  
✅ **自动化集成**：与构建流程无缝集成  
✅ **SEO 最佳实践**：遵循 Google 和 Bing 的站点地图指南  
✅ **性能优化**：快速生成，文件大小合理  
✅ **可扩展性**：易于添加新的页面类型和功能

这套系统将显著提升网站在搜索引擎中的可见性和索引效率。
