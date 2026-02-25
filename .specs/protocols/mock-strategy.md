# 🧬 Data & Mock Strategy (Schema First)

**Philosophy**: We define the data structure *before* we write the UI. This prevents "Hallucinated Props".

## 1. The Workflow
1.  **Define Type**: Create a TypeScript interface in `src/types/[feature].ts`.
2.  **Create JSON**: Create a static JSON file in `src/mocks/[feature].json`.
3.  **Build Hook**: Create a `use[Feature]` hook that returns the mock data (simulating an async fetch).
4.  **Implement UI**: Build the component using the hook.

## 2. Mock Location
Store mocks in `src/mocks/`. This folder is excluded from the production build but available for Dev and Test.

## 3. Example Implementation

**Step A: Define Type (`src/types/user.ts`)**
```typescript
export interface UserProfile {
  id: string;
  username: string;
  avatarUrl: string;
  tier: 'free' | 'pro';
}
```

**Step B: Create Mock JSON (`src/mocks/user.json`)**
```json
{
  "id": "u_123",
  "username": "AI_Architect",
  "avatarUrl": "https://picsum.photos/200",
  "tier": "pro"
}
```

**Step C: The "Simulator" Hook (`hooks/useUser.ts`)**
```typescript
import { useState, useEffect } from 'react';
import { UserProfile } from '../types/user';
// Direct import of JSON allows TS to infer shape and ensures availability in Sandbox
import mockData from '../mocks/user.json'; 

export const useUser = () => {
  const [data, setData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate Network Latency
    const timer = setTimeout(() => {
      setData(mockData as UserProfile);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return { data, loading };
};
```

## 4. Production Handoff (Lovable)
When moving to production:
*   The `interface` remains the same.
*   The `hook` implementation is swapped to call `supabase.from('users').select('*')`.
*   The `component` **does not need to change**.
