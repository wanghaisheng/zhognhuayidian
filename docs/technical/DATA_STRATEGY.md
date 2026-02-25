# [DEPRECATED] Data Management Strategy

This document is deprecated. Please refer to the unified strategy:
[data-strategy.md](file:///e:/workspace/ct-scanner-compass-directory/docs/technical/data-strategy.md)

> **Note**: This document focuses on data architecture. For broader technical standards (TypeScript, SEO, i18n), please refer to [Development Standards](./development-standards.md).

To ensure maintainability, type safety, and efficient localization, we follow a layered data management strategy. This approach separates data definitions, content, and access logic.

## 1. Strategy Overview

| Layer | Directory | Purpose |
|-------|-----------|---------|
| **1. Constants** | `src/data/constants/` | **Source of Truth**. Language-agnostic keys, enums, IDs, and configuration. |
| **2. Production Data** | `src/data/production/` | Structured data files (JSON/TS) serving as a file-based database or backup. |
| **3. Localization** | `src/locales/{lang}/data/` | **Content**. Localized strings corresponding to keys defined in Layer 1 & 2. |
| **4. Access (Hooks)** | `src/hooks/data/` | **Logic**. Custom hooks that combine constants/data with localization to provide ready-to-use objects for components. |

## 2. Implementation Details

### Step 1: Define Constants
Create type-safe constants in `src/data/constants`. These should not contain display strings.

```typescript
// src/data/constants/inquiry.ts
export const BUDGET_RANGES = [
  'under_1m',
  '1m_3m',
  // ...
] as const;

export type BudgetRange = typeof BUDGET_RANGES[number];
```

### Step 2: Define Localization
Create localization files mirroring the data structure in `src/locales/{lang}/data`.

```typescript
// src/locales/zh/data/inquiry.ts
export const inquiry = {
  budgetRanges: {
    under_1m: '100万以下',
    '1m_3m': '100-300万',
    // ...
  }
};
```

Register these in `src/locales/{lang}/index.ts`.

### Step 3: Create Access Hook
Create a hook to merge structure and content.

```typescript
// src/hooks/data/useInquiryData.ts
import { useTranslation } from 'react-i18next';
import { BUDGET_RANGES } from '@/data/constants/inquiry';

export const useInquiryData = () => {
  const { t } = useTranslation();

  const budgetRanges = BUDGET_RANGES.map((key) => ({
    value: key,
    label: t(`data.inquiry.budgetRanges.${key}`)
  }));

  return { budgetRanges };
};
```

### Step 4: Consume in Components
Components use the hook to get fully localized, typed data.

```tsx
// src/components/InquiryForm.tsx
import { useInquiryData } from '@/hooks/data/useInquiryData';

const InquiryForm = () => {
  const { budgetRanges } = useInquiryData();
  
  return (
    <Select>
      {budgetRanges.map(range => (
        <SelectItem key={range.value} value={range.value}>
          {range.label}
        </SelectItem>
      ))}
    </Select>
  );
};
```

## 3. Benefits

1.  **Separation of Concerns**: Logic, Data, and Content are distinct.
2.  **Type Safety**: TypeScript ensures keys match across layers.
3.  **Localization Ready**: New languages only require adding files in `src/locales`.
4.  **Refactoring Ease**: Changing a value requires updating the Constant; changing a label updates the Locale.

## 4. Entity Data Localization Strategy (Database)

For dynamic entity data (Devices, Manufacturers) stored in the database (Supabase/PostgreSQL), we adopt the **JSONB Column Pattern** (Pattern B) over "Separate Translation Tables" (Pattern A) or "Columns per Language" (Pattern C).

### Why JSONB Pattern?

| Pattern | Description | Pros | Cons |
|---------|-------------|------|------|
| **A. Separate Tables** | `device_translations` table linked by `device_id` | Normalized, standard SQL, clean base table | Requires JOINs for every fetch, complex writes, rigid schema |
| **B. JSONB Column** | `translations` column of type `jsonb` | **Fast reads (no JOINs)**, flexible schema, keeps data together, easy to version | Non-standard SQL (Postgres specific), slightly larger row size |
| **C. Columns/Lang** | `name_en`, `name_zh` columns | Simple for 2 languages | **Not scalable** (adding lang = changing schema), sparse data |

**Decision**: We use **Pattern B**.
- **Schema**: `translations` column (jsonb) in `devices` table.
- **TS Interface**: `translations: Record<LanguageCode, DeviceTranslation>`.
- **Fallback**: UI handles fallback if a specific language key is missing.

## 5. Migration Plan

- [x] Inquiry Data (`src/data/constants/inquiry.ts`)
- [x] Device Constants (`src/data/constants/device.ts`)
- [x] Device Data Structure (Refactored to Pattern B)
- [ ] Navigation/Header Data
- [ ] Footer Links
