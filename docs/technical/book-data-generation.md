# 中医古籍数据生成文档 v1.7.0

## 概述

本文档记录了为中华医典书籍大全项目生成中医古籍数据快照的过程和方法。通过脚本化方式，我们成功创建了9个经典中医古籍的完整数据文件，包括主文件和章节文件。本文档已更新以反映v1.7.0的脚本重组优化。

## 生成目标

为以下9个经典中医古籍创建完整的数据文件：

1. **伤寒杂病论** (Treatise on Cold Damage and Miscellaneous Diseases)
2. **本草纲目** (Compendium of Materia Medica)
3. **千金要方** (Thousand Golden Prescriptions)
4. **脉经** (The Pulse Classic)
5. **甲乙经** (A-B Classic of Acupuncture and Moxibustion)
6. **伤寒论** (Treatise on Cold Damage)
7. **金匮要略** (Essential Prescriptions of Golden Cabinet)
8. **温病学** (Warm-Disease School)
9. **医学入门** (Introduction to Medicine)

## 脚本化数据生成 (v1.7.0新增)

### 数据生成脚本 (`scripts/data/`)
```bash
# 核心数据生成脚本
node scripts/data/generate-book-data.cjs        # 生成书籍主文件
node scripts/data/generate-book-chapters.cjs      # 生成章节文件
node scripts/data/generate-zh-books.cjs            # 生成中文书籍
node scripts/data/generate-remaining-books.cjs      # 生成剩余书籍
node scripts/data/unify-book-data-structure.cjs   # 统一数据结构
```

### 数据对齐脚本 (`scripts/data/`)
```bash
# 数据结构对齐
node scripts/data/align-book-data-structure.cjs  # 对齐书籍数据结构
node scripts/data/align-chapter-structure.cjs  # 对齐章节结构
```

### NPM脚本映射
```bash
# 数据生成工作流
npm run data:generate-books      # 生成书籍数据
npm run data:generate-chapters    # 生成章节
npm run data:generate-zh-books    # 生成中文书籍
npm run data:align-books         # 对齐书籍结构
npm run data:align-chapters       # 对齐章节结构
npm run data:unify-structure    # 统一数据结构
```

## 数据结构标准

### 主文件结构

每个书籍主文件都遵循以下标准格式：

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

### 章节文件结构

每个章节文件都遵循以下标准格式：

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
    "year": "年份",
    "metadata": {
      "dynasty": "朝代",
      "author": "作者",
      "chapters": 章节数,
      "wordCount": 字数,
      "publishYear": "出版年份",
      "tags": ["标签1", "标签2", "标签3"],
      "coverImage": "封面图片路径",
      "difficulty": "难度等级",
      "influence": "影响力描述",
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
            "interpretation": "现代解读",
            "keyConcepts": [
              {
                "id": "概念ID",
                "term": "术语",
                "description": "概念描述",
                "category": "概念分类",
                "relatedConcepts": ["相关概念1", "相关概念2"]
              }
            ]
          }
        ]
      }
    ],
    "relatedBooks": ["相关书籍ID1", "相关书籍ID2"],
    "readingTime": {
      "estimated": "预计阅读时间",
      "difficulty": "难度描述",
      "prerequisites": ["前置知识1", "前置知识2"]
    },
    "studyNotes": {
      "keyPoints": ["要点1", "要点2"],
      "clinicalApplications": ["临床应用1", "临床应用2"],
      "historicalSignificance": ["历史意义1", "历史意义2"]
    }
  },
  "metrics": {
    "totalChapters": 总章节数,
    "totalWords": 总字数,
    "totalSections": 总小节数,
    "relatedBooks": 相关书籍数,
    "keyConcepts": 关键概念数,
    "readingTime": 阅读时间(分钟),
    "difficulty": 难度等级(1-5)
  },
  "updatedAt": "更新时间(ISO格式)",
  "metadata": {
    "sourceFlags": ["db", "markdown", "seed"],
    "version": "版本号",
    "lastReviewed": "最后审查时间(ISO格式)"
  }
}
```

### 章节文件结构

每个章节文件都遵循以下标准格式：

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
      "interpretation": "现代解读",
      "keyConcepts": [
        {
          "id": "概念ID",
          "term": "术语",
          "description": "概念描述",
          "category": "概念分类",
          "relatedConcepts": ["相关概念1", "相关概念2"]
        }
      ]
    }
  ]
}
```

### 字段说明

#### 顶层字段

| 字段 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `labels` | Object | ✅ | 书籍标签信息 |
| `content` | Object | ✅ | 书籍主要内容 |
| `metrics` | Object | ✅ | 统计信息 |
| `updatedAt` | String | ✅ | 最后更新时间 |
| `metadata` | Object | ✅ | 文件元数据 |

#### Labels 字段

| 字段 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `title` | String | ✅ | 书籍英文标题 |
| `description` | String | ✅ | 书籍英文描述 |

#### Content 字段

| 字段 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `id` | String | ✅ | 书籍唯一标识符 |
| `title` | Object | ✅ | 双语标题 |
| `dynasty` | String | ✅ | 朝代 |
| `author` | String | ✅ | 作者 |
| `category` | String | ✅ | 分类 |
| `year` | String | ✅ | 年份 |
| `metadata` | Object | ✅ | 详细元数据 |
| `chapters` | Array | ✅ | 章节列表 |
| `relatedBooks` | Array | ✅ | 相关书籍ID列表 |
| `readingTime` | Object | ✅ | 阅读时间信息 |
| `studyNotes` | Object | ✅ | 学习笔记 |

#### Metadata 字段

| 字段 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `dynasty` | String | ✅ | 朝代 |
| `author` | String | ✅ | 作者 |
| `chapters` | Number | ✅ | 章节数量 |
| `wordCount` | Number | ✅ | 字数 |
| `publishYear` | String | ✅ | 出版年份 |
| `tags` | Array | ✅ | 标签列表 |
| `coverImage` | String | ✅ | 封面图片路径 |
| `difficulty` | String | ✅ | 难度等级 |
| `influence` | String | ✅ | 影响力描述 |
| `preservation` | String | ✅ | 保存状态 |

#### Chapter 字段

| 字段 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `id` | String | ✅ | 章节唯一标识符 |
| `title` | Object | ✅ | 双语章节标题 |
| `order` | Number | ✅ | 章节顺序 |
| `summary` | String | ✅ | 章节摘要 |
| `sections` | Array | ✅ | 小节列表 |

#### Section 字段

| 字段 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `id` | String | ✅ | 小节唯一标识符 |
| `title` | String | ✅ | 小节标题 |
| `order` | Number | ✅ | 小节顺序 |
| `originalText` | String | ✅ | 原文 |
| `translation` | String | ✅ | 英文翻译 |
| `interpretation` | String | ✅ | 现代解读 |
| `keyConcepts` | Array | ✅ | 关键概念列表 |

#### KeyConcept 字段

| 字段 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `id` | String | ✅ | 概念唯一标识符 |
| `term` | String | ✅ | 术语 |
| `description` | String | ✅ | 概念描述 |
| `category` | String | ✅ | 概念分类 |
| `relatedConcepts` | Array | ✅ | 相关概念列表 |

#### Metrics 字段

| 字段 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `totalChapters` | Number | ✅ | 总章节数 |
| `totalWords` | Number | ✅ | 总字数 |
| `totalSections` | Number | ✅ | 总小节数 |
| `relatedBooks` | Number | ✅ | 相关书籍数 |
| `keyConcepts` | Number | ✅ | 关键概念数 |
| `readingTime` | Number | ✅ | 阅读时间(分钟) |
| `difficulty` | Number | ✅ | 难度等级(1-5) |

## 黄帝内经标准示例

### 主文件示例

```json
{
  "labels": {
    "title": "Yellow Emperor's Inner Canon",
    "description": "The foundational classic of Chinese medicine"
  },
  "content": {
    "id": "huangdi-neijing",
    "title": {
      "en": "Yellow Emperor's Inner Canon",
      "zh": "黄帝内经"
    },
    "dynasty": "Pre-Qin",
    "author": "Anonymous",
    "category": "medical-classics",
    "year": "战国时期",
    "metadata": {
      "dynasty": "Pre-Qin",
      "author": "Anonymous",
      "chapters": 18,
      "wordCount": 25000,
      "publishYear": "-2000",
      "tags": [
        "Medical Classic",
        "Basic Theory",
        "Yellow Emperor",
        "Yin-Yang",
        "Five Elements"
      ],
      "coverImage": "/images/books/huangdi-neijing-cover.jpg",
      "difficulty": "High",
      "influence": "Foundation of Chinese Medicine Theory",
      "preservation": "Excellent"
    },
    "chapters": [
      {
        "id": "suwen-1",
        "title": {
          "en": "Ancient Heaven and Truth",
          "zh": "上古天真论"
        },
        "order": 0,
        "summary": "Discusses how ancient people understood health preservation",
        "sections": [
          {
            "id": "suwen-1-1",
            "title": "Ancient Heaven and Truth Chapter One",
            "order": 0,
            "originalText": "昔在黄帝，生而神灵，弱而能言，幼而徇齐，长而敦敏，成而聪明。上问于天师曰：余闻上古之人，春秋皆度百岁，而动作不衰；今时之人，年半百而动作皆衰者，时世异耶？人将失之耶？岐伯对曰：上古之人，其知道者，法于阴阳，和于术数，食饮有节，起居有常，不妄作劳，故能形与神俱，而尽终其天年。",
            "translation": "In ancient times, the Yellow Emperor was born divine, able to speak in infancy, precocious in childhood, earnest and diligent in youth, and intelligent in adulthood. He asked his heavenly master: I have heard that ancient people all lived beyond 100 years without decline in their activities; now people at 50 have declining abilities. Is it due to different times, or have people lost something? Qi Bo answered: Ancient people who understood the Way followed yin and yang, harmonized with methods, had regulated diet and drink, regular routine, did not overwork, thus could maintain both form and spirit to complete their natural lifespan.",
            "interpretation": "This passage expounds the core concept of health preservation in Chinese medicine. It reflects the holistic concept of unity of heaven and humanity, emphasizing that humans should follow natural laws and maintain yin-yang balance for health and longevity.",
            "keyConcepts": [
              {
                "id": "tian-ren-he-yi",
                "term": "Unity of Heaven and Humanity",
                "description": "The philosophical concept that humans are an integral part of nature and should follow natural laws",
                "category": "Basic Theory",
                "relatedConcepts": [
                  "Yin-Yang",
                  "Five Elements"
                ]
              }
            ]
          }
        ]
      }
    ],
    "relatedBooks": [
      "nan-jing",
      "shanghan-zabing-lun",
      "jinkui-yaolue",
      "bencao-gangmu"
    ],
    "readingTime": {
      "estimated": "8 hours",
      "difficulty": "Advanced",
      "prerequisites": [
        "Basic Chinese medicine theory",
        "Understanding of yin-yang theory",
        "Knowledge of five elements theory",
        "Foundation of zang-fu theory"
      ]
    },
    "studyNotes": {
      "keyPoints": [
        "Established the theoretical foundation of Chinese medicine",
        "Systematically elaborated yin-yang and five elements theory",
        "Created the zang-fu organ theory system",
        "Established the holistic concept of unity of heaven and humanity"
      ],
      "clinicalApplications": [
        "Foundation for all clinical practice in Chinese medicine",
        "Guiding principles for acupuncture and moxibustion",
        "Theoretical basis for herbal medicine prescriptions",
        "Framework for health preservation and disease prevention"
      ],
      "historicalSignificance": [
        "Earliest comprehensive medical classic in China",
        "Influenced Chinese medicine for over 2000 years",
        "Foundation of all theoretical systems in Chinese medicine",
        "Cultural heritage of traditional Chinese medicine"
      ]
    }
  },
  "metrics": {
    "totalChapters": 2,
    "totalWords": 25000,
    "totalSections": 2,
    "relatedBooks": 4,
    "keyConcepts": 110,
    "readingTime": 480,
    "difficulty": 5
  },
  "updatedAt": "2026-02-25T17:24:26.090Z",
  "metadata": {
    "sourceFlags": [
      "db",
      "markdown",
      "seed"
    ],
    "version": "1.0.0",
    "lastReviewed": "2026-02-25T17:24:26.092Z"
  }
}
```

### 章节文件示例

```json
{
  "id": "suwen-1",
  "title": {
    "en": "Ancient Heaven and Truth",
    "zh": "上古天真论"
  },
  "order": 0,
  "summary": "Discusses how ancient people understood health preservation and the principles of following natural laws for longevity.",
  "sections": [
    {
      "id": "suwen-1-1",
      "title": "Ancient Heaven and Truth Chapter One",
      "order": 0,
      "originalText": "昔在黄帝，生而神灵，弱而能言，幼而徇齐，长而敦敏，成而聪明。上问于天师曰：余闻上古之人，春秋皆度百岁，而动作不衰；今时之人，年半百而动作皆衰者，时世异耶？人将失之耶？岐伯对曰：上古之人，其知道者，法于阴阳，和于术数，食饮有节，起居有常，不妄作劳，故能形与神俱，而尽终其天年。",
      "translation": "In ancient times, the Yellow Emperor was born divine, able to speak in infancy, precocious in childhood, earnest and diligent in youth, and intelligent in adulthood. He asked his heavenly master: I have heard that ancient people all lived beyond 100 years without decline in their activities; now people at 50 have declining abilities. Is it due to different times, or have people lost something? Qi Bo answered: Ancient people who understood the Way followed yin and yang, harmonized with methods, had regulated diet and drink, regular routine, did not overwork, thus could maintain both form and spirit to complete their natural lifespan.",
      "interpretation": "This passage expounds the core concept of health preservation in Chinese medicine. It reflects the holistic concept of unity of heaven and humanity, emphasizing that humans should follow natural laws and maintain yin-yang balance for health and longevity."
    }
  ]
}
```

## 数据生成指南

### 新增书籍步骤

1. **创建主文件**
   - 按照标准结构创建书籍主JSON文件
   - 确保所有必需字段完整
   - 生成章节列表和元数据

2. **创建章节文件**
   - 在 `{bookId}/chapters/` 目录下创建章节文件
   - 每个章节一个JSON文件
   - 包含小节内容和关键概念

3. **验证数据结构**
   - 运行一致性检查脚本
   - 确保字段类型正确
   - 验证数据完整性

4. **测试页面显示**
   - 启动开发服务器
   - 访问书籍详情页
   - 确认所有内容正确显示

### 数据验证

#### 必需字段检查

```bash
# 运行一致性检查
node scripts/check-book-consistency.cjs

# 对齐数据结构
node scripts/align-book-data-structure.cjs

# 对齐章节结构
node scripts/align-chapter-structure.cjs
```

#### 质量标准

- ✅ 所有必需字段存在
- ✅ 字段类型正确
- ✅ 双语标题完整
- ✅ 章节内容完整
- ✅ 关键概念相关
- ✅ 统计数据准确

### 维护最佳实践

1. **定期验证**
   - 每月运行一致性检查
   - 及时发现数据问题
   - 保持数据质量

2. **版本控制**
   - 记录数据版本信息
   - 跟踪修改历史
   - 便于回滚操作

3. **文档更新**
   - 及时更新技术文档
   - 记录结构变更
   - 提供使用指南

## 相关文件

### 脚本文件
- `scripts/generate-book-data.cjs` - 第一批书籍生成脚本
- `scripts/generate-remaining-books.cjs` - 剩余书籍生成脚本
- `scripts/align-book-data-structure.cjs` - 主文件对齐脚本
- `scripts/align-chapter-structure.cjs` - 章节文件对齐脚本
- `scripts/check-book-consistency.cjs` - 一致性检查脚本

### 数据文件
- `src/data/snapshots/en/content/ancient-books/*.json` - 生成的书籍数据文件
- `src/data/snapshots/en/content/ancient-books/*/chapters/*.json` - 章节文件

### 配置文件
- `src/data/snapshots/en/content/ancient-books/collection.json` - 书籍集合文件

### 文档文件
- `docs/technical/category-management.md` - 分类管理文档
- `docs/technical/book-data-generation.md` - 本文档
- `docs/technical/data-alignment-report.md` - 数据对齐报告
- `docs/technical/data-structure-unification.md` - 数据结构统一文档

---

*最后更新：2026年2月26日*
            "keyConcepts": [
              {
                "id": "概念ID",
                "term": "术语",
                "description": "描述",
                "category": "分类",
                "relatedConcepts": ["相关概念"]
              }
            ]
          }
        ],
        "keyConcepts": [
          {
            "id": "概念ID",
            "term": "术语",
            "description": "描述",
            "category": "分类",
            "relatedConcepts": ["相关概念"]
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

## 生成方法

### 脚本化生成

使用Node.js脚本批量生成数据文件，避免了手动创建的复杂性和错误风险。

#### 第一批脚本 (generate-book-data.cjs)

生成3个主要经典：
- 伤寒杂病论
- 本草纲目  
- 千金要方

#### 第二批脚本 (generate-remaining-books.cjs)

生成剩余7个经典：
- 脉经
- 甲乙经
- 伤寒论
- 金匮要略
- 温病条辨
- 医学入门

### 脚本特点

1. **数据完整性**: 包含完整的书籍信息、章节内容、关键概念
2. **双语支持**: 同时提供中英文标题和内容
3. **结构化数据**: 便于程序解析和使用
4. **错误处理**: 包含文件创建错误处理
5. **进度反馈**: 实时显示生成进度

## 分类映射

### 英文分类键映射

| 中文分类 | 英文键 | 英文翻译 |
|---------|--------|----------|
| 医经 | medical-classics | Medical Classics |
| 诊法 | diagnostics | Diagnostics |
| 本草 | materia-medica | Materia Medica |
| 方书 | prescriptions | Prescriptions |
| 针灸 | acupuncture | Acupuncture |
| 伤寒金匮 | shanghan | Shanghan |
| 温病 | warm-diseases | Warm Diseases |
| 综合医书 | comprehensive | Comprehensive Medicine |
| 临证各科 | clinical | Clinical Medicine |
| 养生食疗外治 | health | Health & Wellness |
| 医论医案 | theories | Medical Theories |
| 其他 | others | Others |

## 数据统计

### 生成文件统计

| 文件名 | 大小 | 章节数 | 字数 | 难度 |
|--------|------|--------|------|------|
| shanghan-zabing-lun.json | 4.9KB | 16 | 45,000 | 高 |
| bencao-gangmu.json | 4.3KB | 52 | 1,900,000 | 中 |
| qianjin-fang.json | 4.2KB | 30 | 680,000 | 中 |
| mai-jing.json | 4.1KB | 10 | 25,000 | 高 |
| jiayi-jing.json | 4.3KB | 12 | 38,000 | 高 |
| shanghan-lun.json | 4.1KB | 10 | 35,000 | 高 |
| jinkui-yaolue.json | 4.3KB | 25 | 28,000 | 高 |
| wenzhen-xue.json | 4.2KB | 4 | 45,000 | 高 |
| yixue-rumen.json | 3.9KB | 7 | 85,000 | 低 |

### 总计统计

- **总文件数**: 10个
- **总大小**: 约42KB
- **总章节数**: 176章
- **总字数**: 约2,921,000字
- **平均难度**: 中高级

## 内容特点

### 翻译质量

1. **准确性**: 保持原文含义的准确翻译
2. **专业性**: 使用标准中医学术术语
3. **可读性**: 英文表达清晰易懂
4. **一致性**: 术语使用保持一致

### 内容深度

1. **原文**: 提供完整的中文原文
2. **翻译**: 专业的英文翻译
3. **解读**: 现代医学解读
4. **概念**: 关键术语解释
5. **关联**: 相关概念链接

### 教育价值

1. **学习资源**: 适合不同水平的学习者
2. **研究参考**: 为学术研究提供基础
3. **临床指导**: 为临床实践提供参考
4. **文化传承**: 传承中医文化

## 使用方法

### 数据加载

```javascript
// 动态导入书籍数据
const bookData = await import('@/data/snapshots/en/content/ancient-books/shanghan-zabing-lun.json');
const book = bookData.default;
```

### 分类映射

```javascript
// 中文分类到英文键的映射
const categoryMapping = {
  '医经': 'medical-classics',
  '诊法': 'diagnostics',
  '本草': 'materia-medica',
  // ... 完整映射
};
```

### 翻译显示

```javascript
// 使用翻译键显示分类
const categoryName = i18n.t(`bookDetail.categories.${book.category}`);
```

## 质量保证

### 数据验证

1. **JSON格式验证**: 确保文件格式正确
2. **结构完整性**: 验证必需字段存在
3. **内容一致性**: 检查中英文对应关系
4. **链接完整性**: 验证相关书籍引用

### 更新维护

1. **版本控制**: 使用版本号管理更新
2. **审查流程**: 定期审查内容准确性
3. **同步更新**: 与中文版本保持同步
4. **用户反馈**: 收集用户反馈持续改进

## 扩展指南

### 添加新书籍

1. 在脚本中添加新的书籍数据
2. 运行脚本生成文件
3. 更新分类映射表
4. 添加翻译键
5. 测试数据加载

### 更新现有书籍

1. 修改脚本中的数据
2. 删除旧文件
3. 重新运行脚本
4. 验证更新结果
5. 更新相关文档

## 技术实现

### 开发环境

- **Node.js**: JavaScript运行环境
- **文件系统**: 使用fs模块进行文件操作
- **JSON处理**: 使用JSON.stringify格式化输出
- **路径处理**: 使用path模块处理文件路径

### 错误处理

- **目录创建**: 自动创建不存在的目录
- **文件写入**: 捕获并报告写入错误
- **数据验证**: 基本的数据结构验证
- **进度反馈**: 实时显示处理进度

## 相关文件

### 脚本文件
- `scripts/generate-book-data.cjs` - 第一批书籍生成脚本
- `scripts/generate-remaining-books.cjs` - 剩余书籍生成脚本

### 数据文件
- `src/data/snapshots/en/content/ancient-books/*.json` - 生成的书籍数据文件

### 配置文件
- `src/data/snapshots/en/content/ancient-books/collection.json` - 书籍集合文件

### 文档文件
- `docs/technical/category-management.md` - 分类管理文档
- `docs/technical/book-data-generation.md` - 本文档

---

*最后更新：2026年2月26日*
