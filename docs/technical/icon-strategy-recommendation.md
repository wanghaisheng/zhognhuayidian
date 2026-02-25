# 图标使用策略建议

## 概述

项目中同时使用 Lucide React 和 Simple Icons，各自发挥不同的作用，不建议完全替换。

## 图标库对比

| 特性 | Lucide React | Simple Icons |
|------|-------------|--------------|
| **主要用途** | UI 界面图标 | 品牌/技术图标 |
| **图标数量** | 1000+ | 2000+ |
| **文件大小** | 轻量级 | 中等 |
| **加载方式** | 静态导入 | 动态导入 |
| **React 支持** | 原生组件 | 需要包装 |
| **自定义样式** | 容易 | 需要处理 SVG |
| **一致性** | 统一设计 | 品牌原始设计 |

## 推荐使用场景

### Lucide React 适用于：

#### 1. 界面操作图标
```tsx
import { Search, Filter, Settings, Menu, X } from 'lucide-react';

// 搜索功能
<Search className="h-4 w-4" />

// 过滤器
<Filter className="h-4 w-4" />

// 设置
<Settings className="h-4 w-4" />
```

#### 2. 状态和反馈图标
```tsx
import { CheckCircle, AlertCircle, XCircle, Info } from 'lucide-react';

// 成功状态
<CheckCircle className="h-5 w-5 text-green-500" />

// 错误状态
<XCircle className="h-5 w-5 text-red-500" />
```

#### 3. 导航和布局图标
```tsx
import { ChevronRight, ArrowLeft, Home, User } from 'lucide-react';

// 面包屑导航
<ChevronRight className="h-4 w-4" />

// 返回按钮
<ArrowLeft className="h-4 w-4" />
```

#### 4. 通用功能图标
```tsx
import { Calendar, Clock, Mail, Phone, Globe } from 'lucide-react';

// 联系信息
<Mail className="h-4 w-4" />
<Phone className="h-4 w-4" />
```

### Simple Icons 适用于：

#### 1. 医疗设备品牌
```tsx
import { BrandIcon } from '@/components/atoms';

// 制造商展示
<BrandIcon brand="Siemens" size="lg" />
<BrandIcon brand="Philips" size="lg" />
<BrandIcon brand="GE" size="lg" />
```

#### 2. 技术栈展示
```tsx
import { SimpleIcon } from '@/components/atoms';

// 技术图标
<SimpleIcon iconName="react" />
<SimpleIcon iconName="typescript" />
<SimpleIcon iconName="nodejs" />
```

#### 3. 社交媒体和平台
```tsx
// 社交媒体链接
<SimpleIcon iconName="twitter" />
<SimpleIcon iconName="linkedin" />
<SimpleIcon iconName="github" />
```

## 实际应用示例

### 制造商卡片组件
```tsx
import { BrandIcon } from '@/components/atoms';
import { MapPin, Globe, Users } from 'lucide-react';

const ManufacturerCard = ({ manufacturer }) => (
  <Card>
    <CardHeader>
      <div className="flex items-center gap-3">
        {/* 品牌图标使用 Simple Icons */}
        <BrandIcon brand={manufacturer.name} size="lg" />
        <div>
          <h3>{manufacturer.name}</h3>
          {/* UI 图标使用 Lucide React */}
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{manufacturer.country}</span>
          </div>
        </div>
      </div>
    </CardHeader>
  </Card>
);
```

### 设备对比页面
```tsx
import { BrandIcon } from '@/components/atoms';
import { TrendingUp, DollarSign, CheckCircle } from 'lucide-react';

const DeviceComparison = ({ deviceA, deviceB }) => (
  <div className="grid grid-cols-2 gap-6">
    <div>
      {/* 品牌图标 */}
      <BrandIcon brand={deviceA.manufacturer} />
      
      {/* 功能图标 */}
      <div className="flex items-center gap-2">
        <TrendingUp className="h-4 w-4" />
        <span>性能评分</span>
      </div>
      
      <div className="flex items-center gap-2">
        <DollarSign className="h-4 w-4" />
        <span>价格范围</span>
      </div>
    </div>
  </div>
);
```

## 性能考虑

### Bundle 大小优化
```typescript
// ✅ 推荐：按需导入 Lucide React
import { Search, Filter } from 'lucide-react';

// ✅ 推荐：动态导入 Simple Icons
const SimpleIcon = ({ iconName }) => {
  const [icon, setIcon] = useState(null);
  
  useEffect(() => {
    import('simple-icons').then(icons => {
      setIcon(icons[iconName]);
    });
  }, [iconName]);
  
  return icon ? <div dangerouslySetInnerHTML={{ __html: icon.svg }} /> : null;
};
```

### 缓存策略
```typescript
// Simple Icons 缓存
const iconCache = new Map();

const loadIcon = async (iconName) => {
  if (iconCache.has(iconName)) {
    return iconCache.get(iconName);
  }
  
  const icons = await import('simple-icons');
  const icon = icons[iconName];
  iconCache.set(iconName, icon);
  return icon;
};
```

## 维护建议

### 1. 图标使用规范
- **UI 操作**: 优先使用 Lucide React
- **品牌展示**: 使用 Simple Icons
- **保持一致性**: 同类功能使用相同图标库

### 2. 组件封装
```typescript
// 统一的图标组件接口
interface IconProps {
  name: string;
  type: 'ui' | 'brand';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Icon: React.FC<IconProps> = ({ name, type, ...props }) => {
  if (type === 'brand') {
    return <SimpleIcon iconName={name} {...props} />;
  }
  
  // 动态导入 Lucide React 图标
  const LucideIcon = lucideIcons[name];
  return LucideIcon ? <LucideIcon {...props} /> : null;
};
```

### 3. 类型安全
```typescript
// 定义可用的图标类型
type LucideIconName = 'search' | 'filter' | 'settings' | ...;
type SimpleIconName = 'siemens' | 'philips' | 'react' | ...;

interface UIIconProps {
  name: LucideIconName;
  // ...
}

interface BrandIconProps {
  name: SimpleIconName;
  // ...
}
```

## 总结

**不建议完全替换**，而是：

1. **保留 Lucide React** 用于 UI 界面图标
2. **使用 Simple Icons** 用于品牌和技术图标
3. **建立清晰的使用规范** 避免混乱
4. **优化性能** 通过按需加载和缓存
5. **统一组件接口** 便于维护和使用

这种混合策略能够：
- 保持 UI 的一致性和专业性
- 提供丰富的品牌图标支持
- 优化 bundle 大小和加载性能
- 便于长期维护和扩展