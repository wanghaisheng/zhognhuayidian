
# 修复 vite.config.ts TypeScript 构建错误

## 问题分析

构建错误显示 `vite.config.ts` 中的 `configureServer` 插件配置缺少参数类型声明：

```
vite.config.ts(43,23): error TS7006: Parameter 'server' implicitly has an 'any' type.
vite.config.ts(44,45): error TS7006: Parameter 'req' implicitly has an 'any' type.
vite.config.ts(44,50): error TS7006: Parameter 'res' implicitly has an 'any' type.
vite.config.ts(44,55): error TS7006: Parameter 'next' implicitly has an 'any' type.
```

## 解决方案

为 Vite 插件的 `configureServer` 回调函数添加正确的 TypeScript 类型声明。

### 需要的类型导入

从 `vite` 和 `connect` 包导入对应的类型：
- `ViteDevServer` - Vite 开发服务器类型
- `Connect.NextFunction` - Connect 中间件的 next 函数类型
- `IncomingMessage` - Node.js HTTP 请求类型
- `ServerResponse` - Node.js HTTP 响应类型

### 修改内容

**文件**: `vite.config.ts`

```typescript
import { defineConfig, ViteDevServer } from "vite";
import type { IncomingMessage, ServerResponse } from "http";
import type { Connect } from "vite";

// 在插件中添加类型
{
  name: 'serve-root-content',
  configureServer(server: ViteDevServer) {
    server.middlewares.use('/content', (
      req: IncomingMessage, 
      res: ServerResponse, 
      next: Connect.NextFunction
    ) => {
      // 现有逻辑不变
    });
  }
}
```

## 技术细节

| 参数 | 类型 | 来源 |
|------|------|------|
| `server` | `ViteDevServer` | `vite` 包 |
| `req` | `IncomingMessage` | Node.js `http` 模块 |
| `res` | `ServerResponse` | Node.js `http` 模块 |
| `next` | `Connect.NextFunction` | `vite` 包 (内置 Connect 类型) |

## 实施步骤

1. 添加必要的类型导入
2. 为 `configureServer` 的 `server` 参数添加 `ViteDevServer` 类型
3. 为中间件回调函数的 `req`、`res`、`next` 参数添加正确类型
4. 修复 `req.url` 的可选类型问题（添加类型断言或检查）

