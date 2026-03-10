# 书籍章节结构分析 v1.7.0

## 概述

本文档分析了中医古籍数据快照中章节的完整结构，包括主文件和章节文件的数据组织方式。本文档已更新以反映v1.7.0的脚本重组优化。

## 脚本化章节管理 (v1.7.0新增)

### 章节生成脚本 (`scripts/data/`)
```bash
# 章节数据处理
node scripts/data/generate-book-chapters.cjs      # 生成书籍章节
node scripts/data/align-chapter-structure.cjs   # 对齐章节结构
node scripts/data/generate-zh-chapters.cjs        # 生成中文章节
```

### 章节检查脚本 (`scripts/checks/`)
```bash
# 章节相关检查
node scripts/checks/check-nested-keys.cjs         # 检查嵌套键
node scripts/checks/test-section-titles.cjs        # 测试部分标题
node scripts/checks/test-final-section-fix.cjs    # 测试最终部分修复
```

### 修复脚本 (`scripts/fixes/`)
```bash
# 章节相关修复
node scripts/fixes/fix-tabs-simple.cjs            # 简单标签修复
node scripts/fixes/fix-shanghan-zabing-lun.cjs  # 修复伤寒杂病论
node scripts/fixes/continue-fix-interpretation.cjs # 继续修复解释
```

### NPM脚本映射
```bash
# 章节管理工作流
npm run data:generate-chapters    # 生成章节
npm run data:align-chapters      # 对齐章节结构
npm run check:nested-keys        # 检查嵌套键
npm run test:section-titles      # 测试部分标题
npm run fix:tabs-simple         # 修复标签
```

## 数据结构概览

### 主文件结构 (Main Book File)

```json
{
  "labels": {
    "title": "书籍标题",
    "description": "书籍描述"
  },
  "content": {
    "id": "book-id",
    "title": {
      "zh": "中文标题",
      "en": "English Title"
    },
    "dynasty": "朝代",
    "author": "作者",
    "category": "分类",
    "year": "年份",
    "metadata": {
      "dynasty": "朝代",
      "author": "作者",
      "chapters": 章节数量,
      "wordCount": 字数,
      "publishYear": "出版年份",
      "tags": ["标签1", "标签2", ...],
      "coverImage": "封面图片路径",
      "difficulty": "难度级别",
      "influence": "影响力描述",
      "preservation": "保存状况"
    },
    "chapters": [
      {
        "id": "chapter-id",
        "title": {
          "zh": "中文章节标题",
          "en": "English Chapter Title"
        },
        "order": 章节顺序,
        "summary": "章节摘要",
        "sections": [
          {
            "id": "section-id",
            "title": "章节标题",
            "order": 节顺序,
            "originalText": "原文",
            "translation": "白话译文",
            "interpretation": "现代解读",
            "keyConcepts": []
          }
        ]
      }
    ],
    "relatedBooks": ["相关书籍ID"],
    "readingTime": {
      "estimated": "预估时间",
      "difficulty": "难度",
      "prerequisites": ["前置要求"]
    },
    "studyNotes": {
      "keyPoints": ["要点"],
      "clinicalApplications": ["临床应用"],
      "historicalSignificance": ["历史意义"]
    }
  },
  "metrics": {
    "totalChapters": 总章节数,
    "totalWords": 总字数,
    "totalSections": 总节数,
    "relatedBooks": 相关书籍数,
    "keyConcepts": 关键概念数,
    "readingTime": 阅读时间,
    "difficulty": 难度
  },
  "updatedAt": "更新时间",
  "metadata": {
    "sourceFlags": ["数据来源标志"],
    "version": "版本",
    "lastReviewed": "最后审查时间"
  }
}
```

### 章节文件结构 (Chapter File)

```json
{
  "id": "chapter-id",
  "title": {
    "zh": "中文章节标题",
    "en": "English Chapter Title"
  },
  "order": 章节顺序,
  "summary": "章节摘要",
  "sections": [
    {
      "id": "section-id",
      "title": {
        "zh": "中文节标题",
        "en": "English Section Title"
      },
      "order": 节顺序,
      "originalText": "原文",
      "translation": "白话译文",
      "interpretation": "现代解读",
      "summary": "节摘要",
      "keyConcepts": [
        {
          "id": "concept-id",
          "term": "概念术语",
          "description": "概念描述",
          "category": "概念分类",
          "relatedConcepts": ["相关概念"]
        }
      ]
    }
  ]
}
```

**文件路径**: `src/data/snapshots/en/content/ancient-books/{bookId}.json`

```json
{
  "labels": {
    "title": "书籍英文标题",
    "description": "书籍英文描述"
  },
  "content": {
    "id": "书籍ID",
    "title": {
      "en": "英文标题",
      "zh": "中文标题"
    },
    "dynasty": "朝代",
    "author": "作者",
    "category": "分类",
    "metadata": {
      "dynasty": "朝代",
      "author": "作者",
      "chapters": 章节数,
      "wordCount": 字数,
      "publishYear": "出版年份",
      "tags": ["标签1", "标签2"],
      "coverImage": "封面图片路径",
      "difficulty": "难度等级",
      "influence": "影响力",
      "preservation": "保存状态"
    },
    "chapters": [
      {
        "id": "章节ID",
        "title": {
          "en": "英文章节标题",
          "zh": "中文章节标题"
        },
        "order": 章节顺序,
        "summary": "章节摘要",
        "sections": [
          {
            "id": "小节ID",
            "title": "小节标题",
            "order": 小节顺序,
            "originalText": "原文",
            "translation": "英文翻译",
            "interpretation": "解读"
          }
        ]
      }
    ],
    "relatedBooks": ["相关书籍ID"],
    "readingTime": {
      "estimated": "预计阅读时间",
      "difficulty": "难度",
      "prerequisites": ["前置知识"]
    },
    "studyNotes": {
      "keyPoints": ["要点"],
      "clinicalApplications": ["临床应用"],
      "historicalSignificance": ["历史意义"]
    }
  },
  "metrics": {
    "totalChapters": 总章节数,
    "totalWords": 总字数,
    "totalSections": 总小节数,
    "relatedBooks": 相关书籍数,
    "keyConcepts": 关键概念数,
    "readingTime": 阅读时间(分钟),
    "difficulty": 难度等级
  },
  "updatedAt": "更新时间",
  "metadata": {
    "sourceFlags": ["db", "markdown", "seed"],
    "version": "版本号",
    "lastReviewed": "最后审查时间"
  }
}
```

### 章节文件结构

**文件路径**: `src/data/snapshots/en/content/ancient-books/{bookId}/chapters/{chapterId}.json`

```json
{
  "id": "章节ID",
  "title": {
    "en": "英文章节标题",
    "zh": "中文章节标题"
  },
  "order": 章节顺序,
  "summary": "章节摘要",
  "sections": [
    {
      "id": "小节ID",
      "title": "小节标题",
      "order": 小节顺序,
      "originalText": "原文",
      "translation": "英文翻译",
      "interpretation": "解读"
    }
  ]
}
```

## 数据结构特点分析

### 1. 分层设计

**主文件 + 章节文件**：
- 主文件包含书籍基本信息和章节概览
- 章节文件包含详细内容
- 便于按需加载和缓存管理

### 2. 双语支持

**中英文对照**：
- 标题采用对象形式：`{"en": "English", "zh": "中文"}`
- 内容包含原文、翻译、解读三层
- 支持多语言切换显示

### 3. 结构化内容

**标准化字段**：
- `originalText`: 中文原文
- `translation`: 英文翻译
- `interpretation`: 现代解读
- `keyConcepts`: 关键概念解释

### 4. 教育功能

**学习支持**：
- 章节摘要便于快速了解
- 关键概念帮助深入理解
- 学习笔记提供指导
- 临床应用连接实践

## 已完成的书籍数据更新

### 更新列表

| 书籍ID | 书籍名称 | 章节数 | 特点 |
|--------|----------|--------|------|
| shanghan-zabing-lun | 伤寒杂病论 | 2 | 六经辨证理论 |
| bencao-gangmu | 本草纲目 | 2 | 药物学分类 |
| qianjin-fang | 千金要方 | 2 | 临床百科全书 |
| mai-jing | 脉经 | 2 | 脉诊理论 |
| jiayi-jing | 甲乙经 | 2 | 针灸学基础 |
| shanghan-lun | 伤寒论 | 2 | 伤寒专论 |
| jinkui-yaolue | 金匮要略 | 2 | 杂病专论 |
| wenzhen-xue | 温病条辨 | 2 | 温病理论 |
| yixue-rumen | 医学入门 | 2 | 医学教育 |

### 章节内容特点

#### 伤寒杂病论 (shanghan-zabing-lun)
- **太阳病脉证并治**: 六经辨证基础
- **阳明病脉证并治**: 里热证治疗

#### 本草纲目 (bencao-gangmu)
- **水部**: 水类药物分类
- **火部**: 火类药物分类

#### 千金要方 (qianjin-fang)
- **妇人方**: 妇科疾病治疗
- **少小婴孺方**: 儿科疾病治疗

#### 脉经 (mai-jing)
- **脉学**: 脉诊理论基础
- **脉象**: 脉象分类诊断

#### 甲乙经 (jiayi-jing)
- **针灸学**: 针灸理论基础
- **腧穴**: 腧穴功能定位

#### 伤寒论 (shanghan-lun)
- **太阳病脉证并治**: 伤寒专论
- **阳明病脉证并治**: 阳明证治疗

#### 金匮要略 (jinkui-yaolue)
- **脏腑经络先后病脉证**: 脏腑疾病
- **血痹虚劳病脉证**: 血虚疾病

#### 温病条辨 (wenzhen-xue)
- **卫气营血学说**: 四层理论
- **三焦辨证**: 三焦理论

#### 医学入门 (yixue-rumen)
- **医学源流**: 医学发展史
- **医学纲目**: 医学基础理论

## 数据生成脚本

### 脚本功能

**文件**: `scripts/generate-book-chapters.cjs`

**功能特点**：
- 自动创建章节目录结构
- 生成标准化章节内容
- 包含原文、翻译、解读
- 支持批量处理

### 使用方法

```bash
node scripts/generate-book-chapters.cjs
```

**输出结果**：
- 为每本书创建 `chapters/` 目录
- 生成章节JSON文件
- 提供执行进度反馈

## 数据质量标准

### 翻译质量

**准确性**：
- 保持原文含义的准确翻译
- 使用标准中医学术术语
- 确保专业术语一致性

**可读性**：
- 英文表达清晰易懂
- 句式结构符合英文习惯
- 避免直译造成的生硬

### 内容完整性

**原文**：
- 提供完整的中文原文
- 确保文本准确性
- 标注出处和版本

**翻译**：
- 完整的英文翻译
- 保持原文结构
- 添加必要注释

**解读**：
- 现代医学视角解读
- 理论背景说明
- 临床意义分析

### 结构化标准

**字段完整性**：
- 所有必需字段必须存在
- 可选字段提供合理默认值
- 数据类型保持一致

**命名规范**：
- 章节ID使用连字符格式
- 标题对象包含中英文
- 顺序号从0开始

## 扩展指南

### 添加新书籍

1. **创建主文件**：
   ```bash
   # 使用现有脚本生成基础数据
   node scripts/generate-remaining-books.cjs
   ```

2. **生成章节内容**：
   ```bash
   # 生成章节目录和内容
   node scripts/generate-book-chapters.cjs
   ```

3. **验证数据**：
   - 检查JSON格式正确性
   - 验证字段完整性
   - 测试数据加载

### 更新现有书籍

1. **修改脚本**：
   - 更新 `booksChapters` 对象
   - 添加或修改章节内容
   - 重新运行脚本

2. **验证更新**：
   - 检查生成的文件
   - 测试页面显示
   - 验证数据完整性

### 添加新章节

1. **扩展章节定义**：
   ```javascript
   chapters: [
     // 现有章节...
     {
       id: 'new-chapter',
       title: { en: 'New Chapter', zh: '新章节' },
       order: 2,
       summary: '章节摘要',
       sections: [...]
     }
   ]
   ```

2. **重新生成**：
   ```bash
   node scripts/generate-book-chapters.cjs
   ```

## 技术实现细节

### 文件组织

**目录结构**：
```
src/data/snapshots/en/content/ancient-books/
├── book-id.json              # 主文件
├── book-id/
│   └── chapters/
│       ├── chapter-1.json   # 章节文件
│       └── chapter-2.json
```

### 数据加载

**动态导入**：
```javascript
// 加载主文件
const bookData = await import(`./${bookId}.json`)

// 加载章节文件
const chapterData = await import(`./${bookId}/chapters/${chapterId}.json`)
```

### 缓存策略

**React Query缓存**：
- 主文件缓存5分钟
- 章节文件缓存10分钟
- 支持按需加载

## 质量保证

### 验证检查

**自动化验证**：
- JSON格式验证
- 字段完整性检查
- 数据类型验证

**手动验证**：
- 内容准确性检查
- 翻译质量评估
- 用户体验测试

### 更新维护

**版本控制**：
- 使用版本号管理更新
- 记录更新日志
- 保持向后兼容

**定期审查**：
- 定期检查内容准确性
- 更新过时信息
- 收集用户反馈

## 相关文件

### 脚本文件
- `scripts/generate-book-chapters.cjs` - 章节内容生成脚本
- `scripts/generate-remaining-books.cjs` - 剩余书籍生成脚本

### 数据文件
- `src/data/snapshots/en/content/ancient-books/*.json` - 主文件
- `src/data/snapshots/en/content/ancient-books/*/chapters/*.json` - 章节文件

### 文档文件
- `docs/technical/book-chapters-structure-analysis.md` - 本文档
- `docs/technical/book-data-generation.md` - 数据生成文档

---

*最后更新：2026年2月26日*
