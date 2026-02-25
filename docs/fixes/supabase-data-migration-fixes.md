# Supabase 数据迁移问题修复

## 问题概述

在运行项目时遇到了以下主要问题：

1. **Supabase 环境变量缺失错误**
2. **数据迁移验证失败** - 设备和制造商 ID 关联问题
3. **缺失制造商数据** - 万东医疗和明峰医疗

## 修复详情

### 1. Supabase 环境变量修复

**问题**: 
```
Uncaught Error: Missing Supabase environment variables
```

**原因**: 
- `.env` 文件中使用 `VITE_SUPABASE_PUBLISHABLE_KEY`
- `supabase.ts` 中期望 `VITE_SUPABASE_ANON_KEY`

**解决方案**:
```typescript
// src/lib/supabase.ts
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
```

### 2. 制造商 ID 映射问题修复

**问题**:
```
迁移验证失败: 20 个设备的制造商ID无效
```

**原因**:
- 制造商数据使用数字字符串 ID: `'1', '2', '3'...`
- 设备数据使用 slug 格式 ID: `'ge-healthcare', 'siemens-healthineers'...`

**解决方案**:
在 `DeviceMigration` 类中创建 ID 映射：

```typescript
private static createManufacturerIdMapping(): Map<string, string> {
  const mapping = new Map<string, string>();
  mapping.set('ge-healthcare', '1');
  mapping.set('siemens-healthineers', '2');
  mapping.set('philips-healthcare', '3');
  // ... 更多映射
  return mapping;
}
```

### 3. 缺失制造商数据补充

**问题**: 设备数据中引用了不存在的制造商

**解决方案**: 在 `manufacturers.ts` 中添加：

```typescript
{
  id: '13',
  name: '万东医疗',
  country: 'China',
  // ... 其他属性
},
{
  id: '14', 
  name: '明峰医疗',
  country: 'China',
  // ... 其他属性
}
```

## 完整的 ID 映射表

| Slug ID | 数字 ID | 制造商名称 |
|---------|---------|------------|
| ge-healthcare | 1 | GE Healthcare |
| siemens-healthineers | 2 | Siemens Healthineers |
| philips-healthcare | 3 | Philips Healthcare |
| canon-medical | 4 | Canon Medical Systems |
| hitachi-healthcare | 5 | Hitachi Healthcare |
| neusoft-medical | 6 | Neusoft Medical |
| united-imaging | 7 | United Imaging |
| samsung-neurologica | 8 | Samsung NeuroLogica |
| carestream-health | 9 | Carestream Health |
| planmed-oy | 10 | Planmed Oy |
| anke-medical | 11 | Anke High-tech |
| mindray-medical | 12 | Mindray Medical |
| wandong-medical | 13 | 万东医疗 |
| mingfeng-medical | 14 | 明峰医疗 |

## 验证工具

### 1. 数据迁移测试工具
- 文件: `src/utils/testDataMigration.ts`
- 功能: 验证数据迁移的完整性和正确性

### 2. 数据验证页面
- 路由: `/data-validation`
- 文件: `src/pages/DataValidationPage.tsx`
- 功能: 可视化的数据验证界面

## 验证结果

修复后的验证应该显示：

```
✅ 所有验证通过！
📊 迁移统计: 14 制造商, 20 设备, 13 客户
🔗 制造商 ID 检查: ✅ 所有制造商 ID 都匹配！
```

## 使用方法

### 访问验证页面
```
http://localhost:8080/data-validation
```

### 手动运行测试
```typescript
import { testDataMigration } from './utils/testDataMigration';
const result = testDataMigration();
```

## 相关文件

- `src/lib/supabase.ts` - Supabase 配置
- `src/lib/migrationUtils.ts` - 数据迁移工具
- `src/data/manufacturers.ts` - 制造商数据
- `src/data/realDevices.ts` - 设备数据
- `src/utils/testDataMigration.ts` - 测试工具
- `src/pages/DataValidationPage.tsx` - 验证页面

## 注意事项

1. **环境变量**: 确保 `.env` 文件包含正确的 Supabase 配置
2. **ID 一致性**: 新增制造商时需要同时更新 ID 映射
3. **数据完整性**: 添加新设备时确保制造商 ID 存在
4. **验证流程**: 每次数据结构变更后都应运行验证

## 下一步建议

1. 考虑统一 ID 格式，避免映射复杂性
2. 添加自动化测试确保数据一致性
3. 实现数据版本控制和迁移脚本
4. 添加更详细的错误日志和调试信息