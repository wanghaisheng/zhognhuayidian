# 更新日志

## [2026-02-25] v1.1.0 - 数据获取重构

### 🎯 主要更新

#### 🚀 **快照数据架构**
- **完全移除HTTP请求**：所有图书相关数据获取改为使用 `import.meta.glob()` 快照加载
- **统一数据策略**：实现三层回退机制 - 数据库 → 快照文件 → 硬编码数据
- **离线优先**：系统现在完全支持离线运行，无需后端API

#### 📚 **图书数据重构**
- **useBookData.ts 重构**：
  - `fetchBook()` - 使用快照加载单本图书
  - `fetchChapter()` - 使用快照加载章节内容
  - `fetchBookList()` - 使用快照加载图书列表，支持分页和过滤
  - `searchBooks()` - 使用快照实现图书搜索功能
- **useTCMData.ts 重构**：
  - `useAncientBooks()` - 古籍数据快照加载
  - `useResearchPapers()` - 研究论文快照加载
  - `useSymptomsPrescriptions()` - 症状方剂快照加载
  - `useTCMSearch()` - 跨类型搜索功能

#### 💾 **本地存储系统**
- **用户数据本地化**：书签、笔记、阅读进度全部使用 `localStorage`
- **统一存储管理器**：创建 `createLocalStorageManager<T>` 工具函数
- **API兼容性**：保持原有Hook接口不变，用户体验一致

#### 🌐 **多语言优化**
- **智能回退**：`zh` → `en` 自动语言回退机制
- **路径映射**：修复 `suwen` → `huangdi-neijing` 的bookId映射问题
- **翻译键修复**：添加缺失的 `book.navigation.chapter` 和 `book.navigation.minutes` 键

### 🏗️ **架构改进**

#### 数据加载模式
```typescript
// 旧模式 - HTTP请求
const response = await fetch('/api/books/${bookId}')
const data = await response.json()

// 新模式 - 快照加载
const snapshotMap = import.meta.glob('/src/data/snapshots/*/content/**/*.json')
const loader = snapshotMap[snapshotPath]
const data = await loader()
```

#### 本地存储模式
```typescript
// 统一的本地存储管理
const createLocalStorageManager = <T>(key: string) => ({
  get: (): T[] => JSON.parse(localStorage.getItem(key) || '[]'),
  set: (items: T[]) => localStorage.setItem(key, JSON.stringify(items)),
  add: (item: T) => { /* ... */ },
  remove: (id: string) => { /* ... */ }
})
```

### 🐛 修复的问题

- ❌ **SyntaxError JSON解析错误**：HTTP请求返回HTML 404页面导致的JSON解析失败
- ❌ **快照路径错误**：`bookId` 映射问题导致章节数据加载失败
- ❌ **翻译键显示**：`book.navigation.chapter` 和 `book.navigation.minutes` 显示为键名
- ❌ **网络依赖**：完全依赖后端API，离线无法使用
- ❌ **数据一致性问题**：API和快照数据结构不匹配

### ✨ 新增功能

- 🔄 **完全离线支持**：无需网络连接即可使用所有功能
- 📊 **智能数据回退**：多层回退确保数据始终可用
- 🔍 **增强搜索**：支持跨古籍、论文、症状方剂的统一搜索
- 📈 **性能优化**：构建时解析快照，运行时零网络开销
- 🛡️ **容错能力**：数据库访问失败时自动回退到本地数据

### 📈 性能提升

- ⚡ **零网络延迟**：所有数据本地加载，响应速度大幅提升
- 🗂️ **构建时优化**：`import.meta.glob()` 在构建时解析，运行时性能最优
- 💾 **缓存友好**：Vite自动处理模块缓存，避免重复加载
- 📱 **离线优先**：PWA友好，支持完全离线使用

### 🔧 技术细节

#### 修复的文件列表
- `src/hooks/useBookData.ts` - 完全重构，移除所有HTTP请求
- `src/hooks/useTCMData.ts` - 完全重构，使用快照加载
- `src/routes/book.$bookId.chapter.$chapterId.tsx` - 修复快照路径映射
- `src/locales/zh/labels/pages/book-detail.ts` - 添加缺失翻译键
- `src/locales/en/labels/pages/book-detail.ts` - 添加缺失翻译键

#### 数据路径规范
```
src/data/snapshots/
├── zh/content/ancient-books/          # 中文古籍数据
├── en/content/ancient-books/          # 英文古籍数据
├── zh/content/research/               # 中文研究论文
├── en/content/research/               # 英文研究论文
├── zh/content/tcm/                  # 中医症状方剂数据
└── en/content/tcm/                  # 英文症状方剂数据
```

---

## [2026-02-25] v1.0.0 - 中华医典重构

### 🎯 主要更新

#### 🏛️ **国际化重构**
- **重构命名空间结构**：将 `navigation.*` 和 `data.footer.*` 重构为 `header.*` 和 `footer.*`
- **统一翻译文件组织**：将翻译文件按功能分为 `header.ts` 和 `footer.ts`
- **修复键名显示问题**：解决页面显示 `header.about` 等键名而不是内容的问题

#### 🌐 **语言设置优化**
- **设置中文为默认语言**：将 `zh` 设为默认语言，`en` 需要 `/en` 前缀
- **URL路径调整**：
  - 中文页面：`/about` （无前缀）
  - 英文页面：`/en/about` （有前缀）

#### 📂 **文件结构重组**
```
src/locales/[lang]/labels/navigation/
├── header.ts      # 导航相关翻译
└── footer.ts      # 页脚相关翻译
```

#### 🔧 **技术修复**
- **修复引用错误**：更新所有使用旧键路径的文件
  - `src/lib/breadcrumb.ts`
  - `src/lib/routes/slices/pricing.tsx`
  - `src/hooks/data/useNavigationData.ts`
  - `src/config/siteNavigation.ts`
- **补充缺失翻译键**：添加所有必需的导航和页脚翻译键
- **优化i18n配置**：添加开发环境强制重新加载翻译资源

#### 🎨 **内容更新**
- **品牌统一**：所有翻译内容统一使用"中华医典"品牌
- **导航优化**：更新主导航和页脚导航的中文翻译
- **页脚完善**：完善页脚的联系信息和导航链接

### 🐛 修复的问题

- ❌ **键名显示问题**：页面显示 `header.about`、`header.resources`、`header.contact` 等键名
- ❌ **语言环境问题**：默认显示英文而不是中文内容
- ❌ **命名空间冲突**：`data.footer.*` 和 `footer.*` 混用导致的混乱
- ❌ **翻译键缺失**：部分导航项缺少对应的翻译键

### ✨ 新增功能

- 🌐 **完整的中文本地化**：所有界面元素都支持中文显示
- 🎯 **清晰的命名空间**：`header.*` 用于导航，`footer.*` 用于页脚
- 🔄 **动态语言切换**：支持中英文无缝切换
- 📱 **响应式导航**：优化移动端导航体验

### 📈 性能优化

- ⚡ **翻译资源加载优化**：开发环境强制重新加载，避免缓存问题
- 🗂️ **文件结构优化**：减少翻译文件的复杂度，提高维护效率

---

## 开发说明

### 🛠️ 技术栈
- **前端框架**：React + TypeScript + Vite
- **路由系统**：TanStack Router
- **国际化**：react-i18next
- **样式框架**：Tailwind CSS
- **数据策略**：快照优先 + 本地存储

### 📝 维护指南
- **添加新翻译**：在对应的 `header.ts` 或 `footer.ts` 文件中添加
- **修改导航**：更新 `src/config/siteNavigation.ts` 配置
- **语言设置**：修改 `src/config/language.ts` 中的语言配置
- **数据更新**：更新 `src/data/snapshots/` 下的快照文件
- **用户数据**：书签、笔记、进度存储在浏览器 `localStorage` 中

---

*最后更新：2026年2月25日*
