# Customers 页面统计与筛选实现说明

- 本文记录 Customers 页面与 CustomerCard/CustomerDetail 的数据模型扩展、统计汇总、筛选功能，以及多语言标签更新，便于后续维护与扩展。

## 数据模型
- 新增可选字段：
  - annualSurgeryCount：年手术次数（number）
  - annualExamLabCount：年检查/化验次数（number）
- 类型定义：
  - 前端类型：[customer.ts](file:///e:/workspace/ct-scanner-compass-directory/src/types/customer.ts#L66-L69)
  - Supabase 映射类型：[useSupabaseData.ts](file:///e:/workspace/ct-scanner-compass-directory/src/hooks/useSupabaseData.ts#L98-L101)
- 缺省处理：
  - 字段缺失时不展示对应统计项
  - 汇总与平均计算时仅对存在该字段的客户计入分母

## 页面与组件
- 客户详情页（CustomerDetail）
  - 新增统计项展示：
    - 年手术次数、年检查化验次数
  - 代码位置：[CustomerDetail.tsx](file:///e:/workspace/ct-scanner-compass-directory/src/pages/CustomerDetail.tsx#L194-L210)
- 客户摘要卡片（CustomerCard）
  - 新增展示：
    - annualSurgeryCount、annualExamLabCount
  - 代码位置：[CustomerCard.tsx](file:///e:/workspace/ct-scanner-compass-directory/src/components/molecules/CustomerCard.tsx#L138-L151)
- 客户列表页（Customers）
  - 统计区新增卡片：
    - 年手术次数：总数与平均值
    - 年检查化验次数：总数与平均值
  - 统计计算与卡片渲染位置：[Customers.tsx](file:///e:/workspace/ct-scanner-compass-directory/src/pages/Customers.tsx#L31-L67)
  - 统计卡片渲染位置：[Customers.tsx](file:///e:/workspace/ct-scanner-compass-directory/src/pages/Customers.tsx#L200-L216)
- 客户列表组件（CustomerList）
  - 筛选器新增范围筛选：
    - 手术最小/最大
    - 检查最小/最大
  - 过滤逻辑位置：[CustomerList.tsx](file:///e:/workspace/ct-scanner-compass-directory/src/components/organisms/CustomerList.tsx#L69-L95)
  - 控件渲染位置：[CustomerList.tsx](file:///e:/workspace/ct-scanner-compass-directory/src/components/organisms/CustomerList.tsx#L168-L186)

## 多语言标签
- 详情页标签与单位：
  - 中文：[customerDetail.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/labels/pages/customerDetail.ts#L13-L17)
  - 英文：[customerDetail.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/en/labels/pages/customerDetail.ts#L13-L17)
- 列表页标签：
  - 中文新增 annualSurgeries、annualExamsLabs、averageSurgeries、averageExamsLabs
    - [customers.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/zh/labels/pages/customers.ts#L47-L55)
  - 英文新增 annualSurgeries、annualExamsLabs、averageSurgeries、averageExamsLabs
    - [customers.ts](file:///e:/workspace/ct-scanner-compass-directory/src/locales/en/labels/pages/customers.ts#L47-L55)

## 数据来源与兼容
- 数据来源：
  - Supabase customers 表字段映射
  - content 与 snapshots 中的客户数据（可补充新字段）
- 兼容策略：
  - 统计项与筛选器均以可选字段工作，未提供数据的客户不参与对应统计与筛选

## 扩展建议
- 列表页支持常用范围选项（例如 0-1万、1-5万、5-10万）以提升可用性
- 客户类型分布卡片可增加“有手术数据/有检查数据”的计数，观察数据完善度
