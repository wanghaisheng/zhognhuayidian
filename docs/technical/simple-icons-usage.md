# Simple Icons 使用指南

本项目已集成 Simple Icons，提供了丰富的品牌和技术图标支持。

## 安装的包

- `simple-icons`: 提供超过 2000+ 个品牌图标的 SVG 数据

## 组件说明

### SimpleIcon 组件

基础的 Simple Icons 包装组件，支持动态加载任何 Simple Icons 中的图标。

```tsx
import { SimpleIcon } from '@/components/atoms';

<SimpleIcon 
  iconName="react" 
  size="md" 
  color="#61DAFB" 
/>
```

**Props:**
- `iconName`: Simple Icons 中的图标名称
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `className`: 自定义 CSS 类
- `color`: 图标颜色 (默认: currentColor)

### BrandIcon 组件

专门用于医疗设备品牌的图标组件，包含品牌名称映射和回退显示。

```tsx
import { BrandIcon } from '@/components/atoms';

<BrandIcon 
  brand="Siemens" 
  size="lg" 
  variant="outlined" 
/>
```

**Props:**
- `brand`: 品牌名称
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `variant`: 'default' | 'outlined' | 'filled'
- `className`: 自定义 CSS 类

## 支持的医疗设备品牌

目前支持的品牌图标映射：

- **Siemens** → `siemens`
- **Philips** → `philips`
- **GE / General Electric** → `generalelectric`
- **Canon** → `canon`
- **Toshiba** → `toshiba`
- **Hitachi** → `hitachi`
- **Samsung** → `samsung`
- **Fujifilm** → `fujifilm`
- **Mindray** → `mindray`

对于没有对应图标的品牌，会自动显示品牌首字母缩写。

## 使用示例

### 1. 制造商卡片

```tsx
import { ManufacturerCard } from '@/components/molecules';

<ManufacturerCard
  name="Siemens"
  country="德国"
  founded={1847}
  specialties={['CT', 'MRI', 'X-Ray']}
  marketShare={25}
/>
```

### 2. 设备对比

```tsx
import { DeviceComparisonCard } from '@/components/molecules';

<DeviceComparisonCard
  deviceA={{
    name: "SOMATOM Force",
    manufacturer: "Siemens",
    model: "Force",
    price: 2500000,
    rating: 4.8,
    keySpecs: ["双源", "192层", "高分辨率"]
  }}
  deviceB={{
    name: "Revolution CT",
    manufacturer: "GE",
    model: "Revolution",
    price: 2300000,
    rating: 4.6,
    keySpecs: ["宽体探测器", "0.28s", "低剂量"]
  }}
  winner="A"
/>
```

### 3. 图标展示

```tsx
import { IconShowcase } from '@/components/examples';

<IconShowcase />
```

## 添加新品牌

要添加新的品牌图标支持：

1. 在 `BrandIcon.tsx` 的 `brandIconMap` 中添加映射：

```tsx
const brandIconMap: Record<string, string> = {
  // 现有映射...
  'new-brand': 'newbrandicon',
};
```

2. 确保 Simple Icons 中存在对应的图标名称

## 性能优化

- 图标采用动态导入，只加载需要的图标
- 支持懒加载和缓存
- 未找到图标时显示加载占位符

## 自定义样式

所有图标组件都支持 Tailwind CSS 类名自定义：

```tsx
<BrandIcon 
  brand="Philips" 
  className="hover:scale-110 transition-transform" 
/>

<SimpleIcon 
  iconName="react" 
  className="text-blue-500 hover:text-blue-600" 
/>
```

## 注意事项

1. 图标名称必须与 Simple Icons 中的名称完全匹配
2. 某些品牌可能没有对应的图标，会显示首字母缩写
3. 图标颜色可以通过 CSS 或 color 属性控制
4. 建议在生产环境中预加载常用图标以提升性能