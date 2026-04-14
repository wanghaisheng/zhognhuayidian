# Cloudflare Worker + D1 迁移准备文档

## 概述

本文档说明了如何将项目迁移到 Cloudflare Workers 平台，使用 Cloudflare D1 作为数据库。项目已经实现了 D1Adapter，为迁移到 Cloudflare Workers 做好了充分准备。

## 为什么选择 Cloudflare Workers + D1

1. **全球边缘网络**: Cloudflare Workers 在全球 300+ 数据中心运行，提供低延迟访问
2. **D1 数据库**: SQLite 兼容的边缘数据库，提供高性能和可靠性
3. **零冷启动**: Workers 无需冷启动，响应速度快
4. **免费额度**: 每天免费 100,000 个请求
5. **简单部署**: 通过 wrangler CLI 一键部署
6. **Storage Adapter 支持**: 项目已实现 D1Adapter，无需修改数据层代码

## 前置要求

### 1. Cloudflare 账户
- 注册 Cloudflare 账户: https://dash.cloudflare.com/sign-up
- 获取 API Token

### 2. 安装 Wrangler CLI
```bash
npm install -g wrangler
```

### 3. 登录 Cloudflare
```bash
wrangler login
```

## 迁移步骤

### 1. 创建 D1 数据库

```bash
# 创建 D1 数据库
wrangler d1 create zhognhuayidian-db

# 记录返回的 database_id，例如:
# database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### 2. 初始化数据库表结构

创建 SQL 迁移文件:

```sql
-- migrations/0001_init_schema.sql

CREATE TABLE IF NOT EXISTS manufacturers (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name_en TEXT NOT NULL,
  name_zh TEXT NOT NULL,
  country TEXT NOT NULL,
  description_en TEXT,
  description_zh TEXT,
  founded_year INTEGER,
  headquarters TEXT,
  logo_url TEXT,
  is_featured INTEGER DEFAULT 0,
  market_share REAL,
  category TEXT,
  published INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS devices (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name_en TEXT NOT NULL,
  name_zh TEXT NOT NULL,
  type TEXT NOT NULL,
  manufacturer_id TEXT,
  description_en TEXT,
  description_zh TEXT,
  specifications TEXT,
  image_url TEXT,
  is_featured INTEGER DEFAULT 0,
  published INTEGER DEFAULT 1,
  release_year INTEGER,
  price_range TEXT,
  certifications TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (manufacturer_id) REFERENCES manufacturers(id)
);

CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title_en TEXT NOT NULL,
  title_zh TEXT NOT NULL,
  category TEXT NOT NULL,
  content_en TEXT,
  content_zh TEXT,
  excerpt_en TEXT,
  excerpt_zh TEXT,
  featured_image TEXT,
  author TEXT,
  published INTEGER DEFAULT 1,
  published_at TEXT,
  read_time INTEGER,
  tags TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name_en TEXT NOT NULL,
  name_zh TEXT NOT NULL,
  province TEXT NOT NULL,
  city TEXT,
  description_en TEXT,
  description_zh TEXT,
  image_url TEXT,
  hospital_type TEXT,
  bed_count INTEGER,
  year INTEGER,
  devices TEXT,
  published INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS historical_events (
  id TEXT PRIMARY KEY,
  year INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  manufacturer_id TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (manufacturer_id) REFERENCES manufacturers(id)
);

CREATE TABLE IF NOT EXISTS customer_devices (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  device_id TEXT NOT NULL,
  manufacturer_id TEXT NOT NULL,
  purchase_date TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (device_id) REFERENCES devices(id),
  FOREIGN KEY (manufacturer_id) REFERENCES manufacturers(id)
);
```

### 3. 执行数据库迁移

```bash
# 执行本地 D1 数据库迁移
wrangler d1 execute zhognhuayidian-db --local --file=migrations/0001_init_schema.sql

# 执行生产 D1 数据库迁移
wrangler d1 execute zhognhuayidian-db --file=migrations/0001_init_schema.sql
```

### 4. 配置 wrangler.toml

```toml
name = "zhognhuayidian-worker"
main = "src/worker.ts"
compatibility_date = "2024-01-01"

# D1 数据库绑定
[[d1_databases]]
binding = "DB"
database_name = "zhognhuayidian-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"

# 环境变量
[vars]
STORAGE_PROVIDER = "d1"
ENVIRONMENT = "production"

# KV 命名空间（可选，用于缓存）
[[kv_namespaces]]
binding = "CACHE"
id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# R2 存储（可选，用于文件存储）
[[r2_buckets]]
binding = "ASSETS"
bucket_name = "zhognhuayidian-assets"
```

### 5. 创建 Worker 入口文件

```typescript
// src/worker.ts
import { D1Adapter } from './lib/storage/adapters/d1';

export interface Env {
  DB: D1Database;
  STORAGE_PROVIDER?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    
    // 初始化 D1 Adapter
    const adapter = new D1Adapter({
      bindingName: 'DB',
      databaseId: env.DB.databaseId
    });
    await adapter.initialize();
    
    // 路由处理
    if (url.pathname === '/api/manufacturers') {
      const result = await adapter.query('manufacturers', {
        order: { column: 'slug' }
      });
      
      return Response.json({
        data: result.data,
        error: result.error
      });
    }
    
    if (url.pathname === '/api/devices') {
      const result = await adapter.query('devices', {
        eq: { published: 1 },
        order: { column: 'slug' }
      });
      
      return Response.json({
        data: result.data,
        error: result.error
      });
    }
    
    // 其他路由...
    
    return new Response('Not Found', { status: 404 });
  }
};
```

### 6. 配置 Storage Adapter

更新 `.env` 文件:

```env
VITE_STORAGE_PROVIDER=d1
VITE_D1_DATABASE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
VITE_D1_BINDING_NAME=DB
```

### 7. 本地开发

```bash
# 启动本地 D1 数据库
wrangler d1 execute zhognhuayidian-db --local --file=migrations/0001_init_schema.sql

# 启动本地开发服务器
wrangler dev
```

### 8. 数据迁移

从 Supabase 迁移数据到 D1:

```typescript
// scripts/migrate-to-d1.ts
import { createClient } from '@supabase/supabase-js';
import { D1Adapter } from '../src/lib/storage/adapters/d1';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

async function migrateData() {
  const d1Adapter = new D1Adapter({
    bindingName: 'DB',
    databaseId: process.env.D1_DATABASE_ID!
  });
  await d1Adapter.initialize();
  
  // 迁移 manufacturers
  const { data: manufacturers } = await supabase.from('manufacturers').select('*');
  for (const manufacturer of manufacturers || []) {
    await d1Adapter.upsert('manufacturers', manufacturer);
  }
  
  // 迁移其他表...
  
  console.log('Migration completed');
}

migrateData();
```

### 9. 部署到 Cloudflare

```bash
# 部署到 Cloudflare Workers
wrangler deploy

# 部署到特定环境
wrangler deploy --env production
```

## API 端点

### Manufacturers API
```http
GET /api/manufacturers
GET /api/manufacturers/:slug
```

### Devices API
```http
GET /api/devices
GET /api/devices/:slug
GET /api/devices?category=ct
```

### Articles API
```http
GET /api/articles
GET /api/articles/:slug
GET /api/articles?category=news
```

### Customers API
```http
GET /api/customers
GET /api/customers/:slug
```

## 性能优化

### 1. 使用 KV 缓存

```typescript
// 在 Worker 中使用 KV 缓存
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const cacheKey = `data:${url.pathname}`;
    const cached = await env.CACHE.get(cacheKey);
    
    if (cached) {
      return new Response(cached, {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 获取数据
    const data = await fetchData();
    
    // 缓存结果（5分钟）
    await env.CACHE.put(cacheKey, JSON.stringify(data), {
      expirationTtl: 300
    });
    
    return Response.json(data);
  }
};
```

### 2. 使用 R2 存储静态资源

```typescript
// 上传图片到 R2
await env.ASSETS.put(`images/${filename}`, fileBuffer, {
  httpMetadata: {
    contentType: 'image/jpeg'
  }
});

// 从 R2 获取图片
const object = await env.ASSETS.get(`images/${filename}`);
```

## 监控和日志

### 1. Cloudflare Analytics

访问 Cloudflare Dashboard 查看：
- 请求统计
- 错误率
- 响应时间
- 地理分布

### 2. Wrangler Tail

实时查看 Worker 日志：

```bash
wrangler tail
```

## 成本估算

### Cloudflare Workers
- 免费额度: 每天 100,000 个请求
- 超出: $0.50/百万请求

### D1 数据库
- 免费额度: 每天 5,000,000 次读取，100,000 次写入
- 存储空间: 5GB 免费
- 超出: $0.15/百万读取，$5/百万写入

### KV 存储
- 免费额度: 每天 100,000 次读取，1,000 次写入
- 存储空间: 1GB 免费
- 超出: $0.50/百万读取， $5/百万写入

## 迁移清单

- [ ] 创建 Cloudflare 账户
- [ ] 安装 Wrangler CLI
- [ ] 登录 Cloudflare
- [ ] 创建 D1 数据库
- [ ] 创建数据库表结构
- [ ] 执行数据库迁移
- [ ] 配置 wrangler.toml
- [ ] 创建 Worker 入口文件
- [ ] 配置 Storage Adapter
- [ ] 本地测试
- [ ] 数据迁移
- [ ] 部署到 Cloudflare
- [ ] 配置域名
- [ ] 设置缓存
- [ ] 监控和日志
- [ ] 性能优化

## 注意事项

1. **D1 限制**: D1 有读写限制，需要合理设计查询
2. **冷启动**: 虽然 Workers 无冷启动，但 D1 可能有延迟
3. **数据一致性**: D1 最终一致性，需要考虑业务场景
4. **存储大小**: D1 有存储大小限制，大数据量需要考虑分表
5. **认证**: D1 不支持认证，需要单独实现

## 回滚方案

如果需要回滚到 Supabase：

1. 修改环境变量:
```env
VITE_STORAGE_PROVIDER=supabase
```

2. 无需修改代码，Storage Adapter 会自动切换

## 总结

通过 D1Adapter 的实现，项目已经为 Cloudflare Workers + D1 迁移做好了充分准备。迁移过程主要是：
1. 创建 Cloudflare 资源
2. 配置 wrangler
3. 迁移数据
4. 部署应用

Storage Adapter 的抽象使得切换存储后端非常简单，只需修改配置即可。
