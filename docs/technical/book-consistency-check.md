# 书籍数据一致性检查与修复报告 v1.7.0

## 概述

本文档记录了对中医古籍数据快照中数据一致性的全面检查过程和修复结果。通过自动化脚本检查，发现并修复了主文件与章节文件之间的不一致问题，以及多语言本地化问题。本文档已更新以反映v1.7.0的脚本重组优化。

## 脚本化一致性检查 (v1.7.0新增)

### 检查脚本 (`scripts/checks/`)
```bash
# 核心检查脚本
node scripts/checks/check-book-consistency.cjs        # 检查书籍一致性
node scripts/checks/check-chinese-display-issues.cjs  # 检查中文显示问题
node scripts/checks/check-locale-consistency.cjs       # 检查语言环境一致性
node scripts/checks/check-all-category-displays.cjs   # 检查所有分类显示
node scripts/checks/check-nested-keys.cjs             # 检查嵌套键
```

### 测试脚本 (`scripts/checks/`)
```bash
# 功能测试脚本
node scripts/checks/test-book-display.cjs           # 测试书籍显示
node scripts/checks/test-category-display.cjs        # 测试分类显示
node scripts/checks/test-chinese-category-keys.cjs   # 测试中文分类键
node scripts/checks/test-locale-home.js             # 测试语言环境首页
```

### NPM脚本映射
```bash
# 一致性检查工作流
npm run check:book-consistency      # 检查书籍一致性
npm run check:chinese-display       # 检查中文显示
npm run check:locale-consistency    # 检查语言环境一致性
npm run check:all-categories        # 检查所有分类

# 功能测试
npm run test:locale-home           # 测试语言环境首页
npm run test:redirects-dev         # 测试重定向开发
npm run test:seo-head             # 测试SEO头部
```

## 检查背景

### 问题描述

在生成书籍详情页数据后，发现以下一致性问题：
1. **章节数量不一致**: 主文件中的章节列表与实际生成的章节文件数量不匹配
2. **字段类型不一致**: 主文件与章节文件中的字段结构不统一
3. **多语言内容缺失**: 中文locale文件中仍包含英文内容
4. **引用关系错误**: 主文件与章节文件之间的ID引用不匹配

### 检查范围

检查了以下9个中医古籍的数据一致性：
1. shanghan-zabing-lun (伤寒杂病论)
2. bencao-gangmu (本草纲目)
3. qianjin-fang (千金要方)
4. mai-jing (脉经)
5. jiayi-jing (甲乙经)
6. shanghan-lun (伤寒论)
7. jinkui-yaolue (金匮要略)
8. wenzhen-xue (温病学)
9. yixue-rumen (医学入门)

## 数据结构标准

### 主文件标准结构
```json
{
  "labels": {
    "title": "书籍标题",
    "description": "书籍描述"
  },
  "content": {
    "id": "book-id",
    "title": { "zh": "中文标题", "en": "English Title" },
    "dynasty": "朝代",
    "author": "作者",
    "category": "分类",
    "metadata": { ... },
    "chapters": [
      {
        "id": "chapter-id",
        "title": { "zh": "中文章节标题", "en": "English Title" },
        "order": 章节顺序,
        "summary": "章节摘要",
        "sections": [...]
      }
    ],
    "relatedBooks": [...],
    "readingTime": { ... },
    "studyNotes": { ... }
  },
  "metrics": { ... },
  "updatedAt": "更新时间",
  "metadata": { ... }
}
```

### 章节文件标准结构
```json
{
  "id": "chapter-id",
  "title": { "zh": "中文章节标题", "en": "English Title" },
  "order": 章节顺序,
  "summary": "章节摘要",
  "sections": [
    {
      "id": "section-id",
      "title": { "zh": "中文节标题", "en": "English Title" },
      "order": 节顺序,
      "originalText": "原文",
      "translation": "白话译文",
      "interpretation": "现代解读",
      "summary": "节摘要",
      "keyConcepts": [...]
    }
  ]
}
```

## 检查过程

### 第一阶段：发现问题

**检查脚本**: `scripts/check-book-consistency.cjs`

**发现的问题**：
```
❌ 发现的问题:
1. 书籍: bencao-gangmu
   问题类型: extra_chapter_files
   详情: 多余的章节文件: huo-bu.json

2. 书籍: jiayi-jing
   问题类型: extra_chapter_files
   详情: 多余的章节文件: shu-xue.json

... (类似问题共9个)
```

**问题分析**：
- 主文件中的chapters数组只包含1个章节
- 实际chapters目录下有2个章节文件
- 章节ID、标题、内容都正确，只是主文件没有包含所有章节

### 第二阶段：修复问题

**修复脚本**: `scripts/update-main-book-chapters.cjs`

**修复策略**：
1. 读取每个书籍的chapters目录下的所有章节文件
2. 按文件名排序确保章节顺序正确
3. 构建完整的chapters数组
4. 更新主文件中的chapters列表
5. 更新相关的统计信息

**修复过程**：
```
📚 更新书籍: shanghan-zabing-lun
  📁 找到章节文件: 2个
  ✅ 添加章节: taiyang-bing
  ✅ 添加章节: yangming-bing
  ✅ 主文件更新完成，包含2个章节
```

### 第三阶段：验证修复

**验证结果**：
```
🎉 所有书籍的标签和内容key都一致！

📊 检查结果总结:
总书籍数: 9
一致书籍数: 9
问题书籍数: 0
总问题数: 0
```

## 修复详情

### 数据结构一致性

#### 修复前
```json
// 主文件中的chapters数组
"chapters": [
  {
    "id": "taiyang-bing",
    "title": {"en": "Taiyang Disease Patterns", "zh": "太阳病脉证并治"},
    "order": 0,
    "summary": "...",
    "sections": [...]
  }
  // 缺少第二个章节
]
```

#### 修复后
```json
// 主文件中的chapters数组
"chapters": [
  {
    "id": "taiyang-bing",
    "title": {"en": "Taiyang Disease Patterns", "zh": "太阳病脉证并治"},
    "order": 0,
    "summary": "...",
    "sections": [...]
  },
  {
    "id": "yangming-bing",
    "title": {"en": "Yangming Disease Patterns", "zh": "阳明病脉证并治"},
    "order": 1,
    "summary": "...",
    "sections": [...]
  }
]
```

### 统计信息更新

修复脚本同时更新了相关的统计信息：

```json
"metadata": {
  "chapters": 2,  // 从1更新为2
  // ...
},
"metrics": {
  "totalChapters": 2,     // 从1更新为2
  "totalSections": 2,      // 根据实际小节数计算
  // ...
}
```

## 检查标准

### 一致性检查项目

1. **章节ID一致性**
   - 主文件中的章节ID与章节文件中的ID匹配
   - 章节文件命名与章节ID一致

2. **章节标题一致性**
   - 主文件中的章节标题与章节文件中的标题完全一致
   - 中英文标题都匹配

3. **小节ID一致性**
   - 主文件中的小节ID与章节文件中的小节ID匹配
   - 小节数量一致

4. **文件完整性**
   - 主文件包含所有章节文件的引用
   - 没有多余的章节文件
   - 没有缺失的章节文件

### 验证方法

**自动化检查**：
- 读取主文件中的章节列表
- 扫描chapters目录下的所有章节文件
- 逐项对比ID、标题、内容
- 报告不一致的问题

**手动验证**：
- 随机抽查章节内容
- 验证页面显示效果
- 确认数据加载正常

## 技术实现

### 检查脚本功能

**文件**: `scripts/check-book-consistency.cjs`

**核心功能**：
```javascript
// 1. 读取主文件中的章节列表
const mainChapters = mainFile.content?.chapters || [];

// 2. 扫描章节文件
const chapterFiles = fs.readdirSync(chaptersDir).filter(file => file.endsWith('.json'));

// 3. 逐项验证
mainChapters.forEach((chapter, index) => {
  // 检查文件存在性
  // 检查ID一致性
  // 检查标题一致性
  // 检查小节一致性
});
```

### 修复脚本功能

**文件**: `scripts/update-main-book-chapters.cjs`

**核心逻辑**：
```javascript
// 1. 读取所有章节文件
const chapterFiles = fs.readdirSync(chaptersDir)
  .filter(file => file.endsWith('.json'))
  .sort();

// 2. 构建章节列表
const chapters = [];
chapterFiles.forEach((fileName, index) => {
  const chapterFile = JSON.parse(fs.readFileSync(chapterFilePath, 'utf8'));
  chapters.push({
    id: chapterFile.id,
    title: chapterFile.title,
    order: chapterFile.order || index,
    summary: chapterFile.summary,
    sections: chapterFile.sections || []
  });
});

// 3. 更新主文件
mainFile.content.chapters = chapters;
mainFile.content.metadata.chapters = chapters.length;
```

## 质量保证

### 数据完整性

**修复前后对比**：
- 修复前：9本书，每本1个章节，总计9个章节
- 修复后：9本书，每本2个章节，总计18个章节
- 完整性：100%的章节都有对应的文件和引用

### 一致性保证

**检查项目通过率**：
- ✅ 章节ID一致性：100%
- ✅ 章节标题一致性：100%
- ✅ 小节ID一致性：100%
- ✅ 文件完整性：100%

### 数据质量

**内容质量**：
- 所有章节都包含完整的原文、翻译、解读
- 章节顺序按逻辑排列
- 小节ID遵循命名规范

## 最佳实践

### 数据生成流程

1. **生成章节文件**：使用脚本生成标准化的章节内容
2. **更新主文件**：自动同步章节列表到主文件
3. **一致性检查**：运行检查脚本验证数据一致性
4. **功能测试**：在应用中测试数据加载和显示

### 维护指南

**添加新章节时**：
1. 在chapters目录下添加新的章节文件
2. 运行更新脚本同步主文件
3. 运行检查脚本验证一致性

**修改现有章节时**：
1. 更新章节文件内容
2. 检查主文件是否需要同步
3. 运行检查脚本验证一致性

## 相关文件

### 脚本文件
- `scripts/check-book-consistency.cjs` - 一致性检查脚本
- `scripts/update-main-book-chapters.cjs` - 主文件更新脚本

### 数据文件
- `src/data/snapshots/en/content/ancient-books/*.json` - 主文件
- `src/data/snapshots/en/content/ancient-books/*/chapters/*.json` - 章节文件

### 文档文件
- `docs/technical/book-consistency-check.md` - 本文档

## 总结

通过系统化的检查和修复流程，成功解决了所有新增书籍的数据一致性问题。现在：

- ✅ **9本书籍**的数据完全一致
- ✅ **18个章节**都有正确的引用和内容
- ✅ **所有标签和key**都匹配
- ✅ **数据加载和显示**正常工作

这次修复确保了书籍详情页的稳定性和可靠性，为用户提供了完整的内容体验。

---

*最后更新：2026年2月26日*
