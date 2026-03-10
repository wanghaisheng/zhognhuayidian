# 分类管理系统技术文档 v1.7.0

## 概述

本文档描述了中华医典书籍大全项目中分类管理系统的实现，包括分类映射、翻译键管理和多语言支持。该系统确保在不同语言环境下，分类信息能够正确显示和筛选。本文档已更新以反映v1.7.0的脚本重组优化。

## 脚本化分类管理 (v1.7.0新增)

### 分类检查脚本 (`scripts/checks/`)
```bash
# 分类相关检查
node scripts/checks/check-all-category-displays.cjs   # 检查所有分类显示
node scripts/checks/test-category-display.cjs        # 测试分类显示
node scripts/checks/test-chinese-category-keys.cjs  # 测试中文分类键
```

### 分类修复脚本 (`scripts/fixes/`)
```bash
# 分类相关修复
node scripts/fixes/fix-category-keys.cjs  # 修复分类键
```

### NPM脚本映射
```bash
# 分类管理工作流
npm run check:all-categories        # 检查所有分类显示
npm run test:category-display        # 测试分类显示
npm run fix:category-keys          # 修复分类键
```

## 分类数据结构

### 数据源

分类数据主要来源于：
- `src/data/snapshots/zh/content/ancient-books/collection.json` - 中文分类数据
- `src/locales/{lang}/labels/pages/book-detail.ts` - 翻译键映射

### 分类映射关系

```typescript
// 中文分类到英文键的映射
const categoryMapping: Record<string, string> = {
  '医经': 'medical-classics',
  '诊法': 'diagnostics', 
  '本草': 'materia-medica',
  '方书': 'prescriptions',
  '针灸': 'acupuncture',
  '伤寒金匮': 'shanghan',
  '温病': 'warm-diseases',
  '综合医书': 'comprehensive',
  '临证各科': 'clinical',
  '养生食疗外治': 'health',
  '医论医案': 'theories',
  '其他': 'others'
}
```

## 翻译键规范

### 键名结构

翻译键遵循 `bookDetail.categories.{categoryKey}` 的格式：

```typescript
bookDetail: {
  categories: {
    'all': '全部',
    'medical-classics': '医经类',
    'diagnostics': '诊断类',
    'materia-medica': '本草类',
    // ... 更多分类
  }
}
```

### 支持的分类列表

| 英文键 | 中文翻译 | 英文翻译 | 说明 |
|--------|----------|----------|------|
| all | 全部 | All | 全部分类 |
| medical-classics | 医经类 | Medical Classics | 中医基础理论著作 |
| diagnostics | 诊断类 | Diagnostics | 诊断方法著作 |
| materia-medica | 本草类 | Materia Medica | 药物学著作 |
| prescriptions | 方剂类 | Prescriptions | 方剂学著作 |
| acupuncture | 针灸类 | Acupuncture | 针灸学和推拿按摩著作 |
| shanghan | 伤寒金匮 | Shanghan | 伤寒杂病论相关著作 |
| warm-diseases | 温病 | Warm Diseases | 温病学派相关著作 |
| comprehensive | 综合医书 | Comprehensive Medicine | 综合性医学著作 |
| clinical | 临证各科 | Clinical Medicine | 临床各科专著 |
| health | 养生食疗外治 | Health & Wellness | 养生、食疗、外治法著作 |
| theories | 医论医案 | Medical Theories | 医学理论和医案著作 |
| others | 其他 | Others | 其他医学著作 |

## 实现细节

### Library页面分类处理

```typescript
// src/routes/library.tsx
useEffect(() => {
  const loadBooks = async () => {
    try {
      const collectionModule = await import('@/data/snapshots/zh/content/ancient-books/collection.json')
      const collection = collectionModule.default
      
      // 分类映射
      const categoryMapping: Record<string, string> = {
        '医经': 'medical-classics',
        '诊法': 'diagnostics',
        // ... 完整映射
      }
      
      // 数据转换
      const booksData = collection.books.map((book: any) => ({
        id: book.id,
        title: book.title,
        author: book.author,
        dynasty: book.dynasty,
        category: categoryMapping[book.category] || book.category.toLowerCase().replace(/\s+/g, '-'),
        year: book.year,
        description: book.description,
        tags: book.tags,
        chapters: book.chapters,
        characters: book.characters
      }))
      
      setBooks(booksData)
    } catch (error) {
      console.error('Failed to load books collection:', error)
      // 错误处理
    }
  }
  
  loadBooks()
}, [])
```

### 分类筛选实现

```typescript
const categories = [
  { id: 'all', name: i18n.t('bookDetail.categories.all') || '全部', count: books.length },
  { id: 'medical-classics', name: i18n.t('bookDetail.categories.medical-classics') || '医经类', count: books.filter(b => b.category === 'medical-classics').length },
  { id: 'diagnostics', name: i18n.t('bookDetail.categories.diagnostics') || '诊断类', count: books.filter(b => b.category === 'diagnostics').length },
  // ... 其他分类
]
```

### 书籍详情页分类显示

```typescript
// 图片下方分类标签
{i18n.t(`bookDetail.categories.${book.category}`) || book.category}

// 元数据区域分类
{i18n.t(`bookDetail.categories.${book.category}`)}
```

## 添加新分类的步骤

### 1. 更新数据源

在 `src/data/snapshots/zh/content/ancient-books/collection.json` 中添加新分类：

```json
{
  "categories": [
    // 现有分类...
    {
      "id": "new-category",
      "name": "新分类",
      "description": "新分类描述",
      "count": 0,
      "icon": "🆕"
    }
  ]
}
```

### 2. 更新分类映射

在 `src/routes/library.tsx` 中添加映射：

```typescript
const categoryMapping: Record<string, string> = {
  // 现有映射...
  '新分类': 'new-category'
}
```

### 3. 添加翻译键

#### 中文翻译
`src/locales/zh/labels/pages/book-detail.ts`:
```typescript
categories: {
  // 现有键...
  'new-category': '新分类翻译'
}
```

#### 英文翻译
`src/locales/en/labels/pages/book-detail.ts`:
```typescript
categories: {
  // 现有键...
  'new-category': 'New Category Translation'
}
```

### 4. 更新分类筛选列表

在 `src/routes/library.tsx` 中添加新分类到筛选列表：

```typescript
const categories = [
  // 现有分类...
  { id: 'new-category', name: i18n.t('bookDetail.categories.new-category') || '新分类翻译', count: books.filter(b => b.category === 'new-category').length }
]
```

## 添加新语言支持

### 1. 创建新语言目录

```bash
mkdir -p src/locales/{新语言代码}/labels/pages
```

### 2. 创建翻译文件

`src/locales/{新语言代码}/labels/pages/book-detail.ts`:
```typescript
export const bookDetail = {
  // 其他翻译...
  categories: {
    'all': 'All',
    'medical-classics': 'Medical Classics',
    'diagnostics': 'Diagnostics',
    'materia-medica': 'Materia Medica',
    'prescriptions': 'Prescriptions',
    'acupuncture': 'Acupuncture',
    'shanghan': 'Shanghan',
    'warm-diseases': 'Warm Diseases',
    'comprehensive': 'Comprehensive Medicine',
    'clinical': 'Clinical Medicine',
    'health': 'Health & Wellness',
    'theories': 'Medical Theories',
    'others': 'Others'
  }
}
```

### 3. 更新语言索引

`src/locales/{新语言代码}/index.ts`:
```typescript
import { bookDetail } from './labels/pages/book-detail'

export default {
  // 其他模块...
  bookDetail
}
```

### 4. 更新i18n配置

在i18n配置文件中添加新语言支持。

## 数据验证

### 分类映射验证

确保所有中文分类都有对应的英文键：

```typescript
const validateCategoryMapping = () => {
  const chineseCategories = ['医经', '诊法', '本草', '方书', '针灸', '伤寒金匮', '温病', '综合医书', '临证各科', '养生食疗外治', '医论医案', '其他']
  const mappingKeys = Object.values(categoryMapping)
  
  chineseCategories.forEach(category => {
    if (!categoryMapping[category]) {
      console.warn(`Missing mapping for category: ${category}`)
    }
  })
}
```

### 翻译键验证

确保所有分类键都有对应的翻译：

```typescript
const validateTranslationKeys = (i18n: any) => {
  const categoryKeys = ['all', 'medical-classics', 'diagnostics', 'materia-medica', 'prescriptions', 'acupuncture', 'shanghan', 'warm-diseases', 'comprehensive', 'clinical', 'health', 'theories', 'others']
  
  categoryKeys.forEach(key => {
    const translation = i18n.t(`bookDetail.categories.${key}`)
    if (translation === `bookDetail.categories.${key}`) {
      console.warn(`Missing translation for key: bookDetail.categories.${key}`)
    }
  })
}
```

## 常见问题

### Q: 为什么需要分类映射？

A: 因为数据源中的分类是中文（如"医经"），而翻译键需要英文格式（如"medical-classics"），映射确保了正确的翻译键解析。

### Q: 如何处理分类名称的变更？

A: 需要同时更新：
1. 数据源中的分类名称
2. 分类映射表
3. 所有语言的翻译键

### Q: 如何添加子分类？

A: 可以扩展翻译键结构：
```typescript
categories: {
  'medical-classics': '医经类',
  'medical-classics.suwen': '素问',
  'medical-classics.lingshu': '灵枢'
}
```

### Q: 如何处理分类的层级关系？

A: 可以在数据结构中添加parent字段：
```json
{
  "id": "suwen",
  "name": "素问",
  "parent": "medical-classics",
  "level": 2
}
```

## 最佳实践

1. **保持一致性**: 确保所有语言环境下的分类键名一致
2. **使用后备方案**: 翻译键缺失时提供中文后备名称
3. **验证数据**: 定期验证分类映射和翻译键的完整性
4. **文档更新**: 添加新分类时及时更新本文档
5. **测试覆盖**: 确保所有分类在不同语言环境下都能正确显示

## 相关文件

- `src/routes/library.tsx` - Library页面实现
- `src/data/snapshots/zh/content/ancient-books/collection.json` - 分类数据源
- `src/locales/zh/labels/pages/book-detail.ts` - 中文翻译
- `src/locales/en/labels/pages/book-detail.ts` - 英文翻译
- `src/components/book/molecules/BookHeader.tsx` - 书籍头部组件
- `src/components/book/molecules/RelatedBooks.tsx` - 相关书籍组件

---

*最后更新：2026年2月26日*
