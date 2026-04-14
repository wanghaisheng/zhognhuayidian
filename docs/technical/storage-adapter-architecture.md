# Storage Adapter 架构设计文档

## 概述

本项目正在实施存储层抽象重构，以支持多种存储后端（Supabase、sql.js、Cloudflare D1）并为未来迁移到 Astro 和 Cloudflare Worker 做准备。

## 架构设计

### 核心目标

1. **无硬编码原则**
   - 无硬编码字符串、URL、locale、颜色、样式
   - 使用设计系统设计语言

2. **职责分离**
   - React 负责：纯UI展示、无状态、无硬编码、事件处理、客户端交互
   - Astro 负责：路由控制、数据获取、SEO生成
   - Storage Adapter 负责：数据持久化抽象

3. **数据流**
   ```
   Request → Astro → React → Hooks → Services → Storage
   ```

4. **副作用流**
   ```
   User Action → React Hooks → Services → Storage
   ```

## 已完成的工作

### 1. Storage Adapter 抽象接口 (`src/lib/storage/adapter.ts`)

定义了统一的 CRUD、Auth、Query 契约：

- **CRUD 操作**：`create`, `read`, `query`, `update`, `delete`, `upsert`
- **认证操作**：`signUp`, `signIn`, `signOut`, `getCurrentUser`, `refreshSession`
- **高级查询**：`relatedQuery`, `batch`
- **生命周期**：`initialize`, `close`, `healthCheck`

### 2. 配置系统 (`src/lib/storage/config.ts`)

支持通过环境变量切换存储 provider：

```typescript
export type StorageProvider = 'supabase' | 'sqljs' | 'd1';

export interface StorageConfig {
  provider: StorageProvider;
  supabase?: { url: string; key: string };
  sqljs?: { databasePath?: string; cdnUrl?: string };
  d1?: { bindingName?: string; databaseId?: string };
}
```

环境变量：
- `VITE_STORAGE_PROVIDER`: 选择存储 provider（默认：supabase）
- `VITE_SUPABASE_URL`: Supabase URL
- `VITE_SUPABASE_PUBLISHABLE_KEY`: Supabase 公钥
- `VITE_SQLJS_DATABASE_PATH`: sql.js 数据库路径
- `VITE_SQLJS_CDN_URL`: sql.js CDN URL
- `VITE_D1_BINDING_NAME`: D1 绑定名称
- `VITE_D1_DATABASE_ID`: D1 数据库 ID

### 3. Supabase Adapter 实现 (`src/lib/storage/adapters/supabase.ts`)

实现了完整的 StorageAdapter 接口，使用 Supabase 作为后端存储。

### 4. Sqljs Adapter 实现 (`src/lib/storage/adapters/sqljs.ts`)

实现了 StorageAdapter 接口，使用 sql.js (SQLite WebAssembly) 作为后端存储：
- 支持客户端本地存储
- 支持离线场景
- 自动初始化表结构
- 支持事务操作

### 5. D1 Adapter 实现 (`src/lib/storage/adapters/d1.ts`)

实现了 StorageAdapter 接口，使用 Cloudflare D1 作为后端存储：
- 适用于 Cloudflare Workers 和 Pages Functions
- 支持批量操作
- 自动初始化表结构

### 6. Storage Factory (`src/lib/storage/factory.ts`)

工厂模式创建存储适配器实例，支持单例模式和延迟初始化。

### 7. 重构 db 对象 (`src/lib/supabase.ts`)

将原有的直接 Supabase 调用重构为使用 Storage Adapter 接口，保持向后兼容性：

```typescript
// 之前：直接调用 Supabase
getAll: () => supabase.from('manufacturers').select('*').order('slug')

// 现在：通过 Storage Adapter
getAll: async () => {
  const adapter = await getOrCreateStorageAdapter();
  return adapter.query('manufacturers', { order: { column: 'slug' } });
}
```

## 待完成的工作

### 高优先级

### 中优先级

3. **消除硬编码**
   - ~~字符串：创建 constants/config 集中管理~~ ✅ 已完成
   - ~~URL：创建环境变量配置系统~~ ✅ 已完成
   - ~~locale：使用 i18n 系统统一管理~~ ✅ 已完成
   - ~~颜色：使用 Tailwind CSS 设计系统~~ ✅ 已完成
   - ~~样式：创建 design tokens 和组件样式系统~~ ✅ 已完成

4. **验证 React 组件**
   - ~~确保无状态、无硬编码原则~~ ✅ 已完成

### 低优先级

5. **迁移准备文档**
   - ~~创建 Astro 迁移准备文档~~ ✅ 已完成
   - ~~创建 Cloudflare Worker + D1 迁移准备文档~~ ✅ 已完成

## 项目总结

### 已完成的核心工作

1. **Storage Adapter 架构**
   - 抽象接口定义 (CRUD、Auth、Query)
   - 配置系统 (支持环境变量切换)
   - 三种 Adapter 实现 (Supabase、sql.js、D1)
   - 工厂模式创建适配器
   - 单例模式和延迟初始化

2. **代码重构**
   - 重构 db 对象使用 Storage Adapter
   - 更新 hooks 使用 Storage Adapter
   - 保持向后兼容性

3. **消除硬编码**
   - 应用常量配置 (国家、语言、表名、字段名等)
   - URL 配置系统 (应用 URL、API 端点、路由路径等)
   - 设计令牌 (颜色、间距、字体、圆角、阴影等)
   - 集成现有 i18n 系统

4. **迁移准备**
   - Astro 迁移指南
   - Cloudflare Worker + D1 迁移指南
   - 详细的迁移步骤和注意事项

### 技术架构优势

1. **存储层抽象**: 通过 Storage Adapter 模式实现存储层的完全抽象
2. **易于切换**: 只需修改环境变量即可切换存储后端
3. **零修改迁移**: 迁移到 Astro 或 Cloudflare Workers 无需修改数据层代码
4. **类型安全**: 完整的 TypeScript 类型定义
5. **配置驱动**: 所有配置通过环境变量管理

### 文件结构

```
src/
├── lib/
│   └── storage/
│       ├── adapter.ts              # 抽象接口
│       ├── config.ts               # 配置系统
│       ├── factory.ts              # 工厂模式
│       ├── index.ts                # 模块入口
│       └── adapters/
│           ├── supabase.ts         # Supabase 实现
│           ├── sqljs.ts            # sql.js 实现
│           └── d1.ts               # D1 实现
├── config/
│   ├── app-constants.ts            # 应用常量
│   ├── urls.ts                     # URL 配置
│   ├── design-tokens.ts            # 设计令牌
│   └── index.ts                   # 配置入口
└── hooks/
    ├── useStats.ts                 # 更新使用 Storage Adapter
    └── useHybridContent.ts        # 更新使用 Storage Adapter
```

### 使用方式

```typescript
// 通过环境变量切换存储后端
VITE_STORAGE_PROVIDER=supabase  # 或 sqljs, d1

// 在代码中使用
import { getOrCreateStorageAdapter } from '@/lib/storage/factory';

const adapter = await getOrCreateStorageAdapter();
const result = await adapter.query('manufacturers', {
  order: { column: 'slug' }
});
```

### 下一步

所有计划任务已完成。项目已准备好进行 Astro 或 Cloudflare Workers 迁移。

## 使用示例

### 初始化 Storage Adapter

```typescript
import { getOrCreateStorageAdapter } from '@/lib/storage/factory';

// 在应用启动时初始化
const adapter = await getOrCreateStorageAdapter();
```

### 使用 db 对象（向后兼容）

```typescript
import { db } from '@/lib/supabase';

// 所有方法现在是异步的
const manufacturers = await db.manufacturers.getAll();
const device = await db.devices.getBySlug('some-slug');
```

### 直接使用 Storage Adapter

```typescript
import { getOrCreateStorageAdapter } from '@/lib/storage/factory';

const adapter = await getOrCreateStorageAdapter();
const result = await adapter.query('manufacturers', {
  eq: { country: 'China' },
  order: { column: 'slug' }
});
```

## 切换存储 Provider

### 切换到 sql.js

在 `.env` 文件中设置：

```env
VITE_STORAGE_PROVIDER=sqljs
VITE_SQLJS_DATABASE_PATH=/path/to/database.db
VITE_SQLJS_CDN_URL=https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.js
```

### 切换到 Cloudflare D1

在 `.env` 文件中设置：

```env
VITE_STORAGE_PROVIDER=d1
VITE_D1_DATABASE_ID=your-database-id
VITE_D1_BINDING_NAME=DB
```

## 架构优势

1. **松耦合**：业务逻辑不依赖具体存储实现
2. **可测试**：易于 mock 和单元测试
3. **可扩展**：轻松添加新的存储后端
4. **可迁移**：为 Astro 和 Cloudflare Worker 迁移做准备
5. **向后兼容**：现有代码逐步迁移，不影响功能

## 下一步计划

1. 实现 SqljsAdapter 和 D1Adapter
2. 更新所有 hooks 使用 Storage Adapter
3. 消除项目中的硬编码
4. 创建迁移文档
5. 逐步迁移到 Astro 框架
