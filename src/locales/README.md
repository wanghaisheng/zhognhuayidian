# 多语言文件结构说明（labels 统一规范）

## 目录结构（当前标准）

```
src/locales/
├── en/
│   └── labels/
│       ├── common/                 # 通用词条（按钮、状态、通用短语）
│       ├── pages/                  # 页面级文案（按路由/页面组织）
│       ├── components/             # 组件级文案（跨页面复用的 UI）
│       ├── data/                   # 可翻译的枚举/映射/列表（导航、页脚、统计项名等）
│       ├── site.ts                 # 站点级词条（品牌、站名等）
│       ├── seo.ts                  # 站点级默认 SEO 词条
│       ├── breadcrumb.ts           # 面包屑词条
│       ├── footer.ts               # 页脚词条（UI）
│       └── index.ts                # 英文翻译汇总
├── zh/
│   └── labels/
│       ├── common/
│       ├── pages/
│       ├── components/
│       ├── data/
│       ├── site.ts
│       ├── seo.ts
│       ├── breadcrumb.ts
│       ├── footer.ts
│       └── index.ts                # 中文翻译汇总
├── en/index.ts                      # 英文聚合（导出 enTranslations）
├── zh/index.ts                      # 中文聚合（导出 zhTranslations）
├── index.ts                         # 多语言资源入口（聚合 en + 覆盖 zh 等）
└── README.md
```

## 职责与落位

- pages/*：页面独有文案（仅用于某个路由/页面）
- components/*：跨页面复用组件文案（例如询价表单 inquiryForm）
- data/*：可翻译的“结构化枚举/映射/列表”名称（导航标题、统计项名、FAQ 条目名等）
- common/* 与顶层文件（site、seo、breadcrumb、footer 等）：全站通用词条

放置决策：
- 只在单页使用 → 放入 pages/ 对应页面文件
- 多页复用 → 放入 components/，根键命名为组件名（如 inquiryForm）
- 属于结构化“名称/标签/枚举” → 放入 data/（注意：仅存放“可翻译标签”，不存内容数据）

与数据层分工：
- labels：UI 文案与键空间（含 data.* 键）
- src/data/snapshots：构建期只读 JSON 内容（文章、设备、报告等“内容数据”）
- seed（如有）：离线/无库的兜底结构化数据，用于生成 snapshots

## 导入与使用规范

- 所有使用方仅从 locales 入口聚合使用，不直接从 labels/* 零散 import：
  - 英文聚合：src/locales/en/index.ts → enTranslations
  - 中文聚合：src/locales/zh/index.ts → zhTranslations
  - 多语言入口：src/locales/index.ts → localeResources

示例：
```ts
import { useTranslation } from 'react-i18next';
const { t } = useTranslation();

// 页面文案
const title = t('resources.meta.title');
// 组件文案
const step = t('inquiryForm.steps.basic');
// 数据枚举（翻译的“名称/标签”）
const k = t('data.stats.overview.totalDevices');
```

## 避免重复与别名复用

- 若同义文案在两个命名空间中出现（如 resources 与 resourceCenter），保留一个“真实源”，另一个用别名转发：
  - 例如：pages/resourceCenter.ts 直接复用 pages/resources.ts 导出的对象
- 统一从 locales 聚合出口导出，避免在业务代码中对具体文件路径产生耦合

## 命名规范

- 使用“点分层级”的键路径：模块.子模块.键名（如 data.stats.overview.totalDevices）
- 键名采用驼峰，语义清晰、可读
- 页面与组件命名与对应路由/组件一致，保持目录与键路径一一对应

## 新增与扩展

新增词条：
1) 确定命名空间（pages/components/data/common）
2) 在 en/ 与 zh/ 下添加对应文件与键
3) 在 en/index.ts 与 zh/index.ts 中聚合导出
4) locales/index.ts 会将 zh 的覆盖合并到 en 基础之上（按现有策略）

扩展新语言：
1) 新建语言目录（如 ja/labels/...）
2) 复制 en/labels 目录结构
3) 补全翻译并在 src/locales/index.ts 中注册

## 维护与检查

- 类型与语法检查：npm run check:syntax
- 翻译完整性检查：npm run i18n:check
- 建议定期巡检“未使用键/重复文件”，保持命名空间纯净

## 2026-02 更新说明（已落地）

- 将 en/data 下内容统一迁移至 en/labels/data，保持“文案权威”在 labels 目录
- data.* 键（例如 data.stats、data.comparison、data.inquiry 等）规范化至 labels/data
- 明确分工：内容数据 → src/data/snapshots；UI 文案/枚举标签 → labels
- 统一复用策略：pages/resourceCenter.ts 别名复用 pages/resources.ts，避免双份维护
