# 🧪 Testing Protocol (TDD)

**Toolchain**: Vitest + React Testing Library.

## 1. The TDD Cycle
1.  **Red**: Write a test that fails (e.g., "Component should render user name").
2.  **Green**: Write the minimal code to pass the test (using Mock Data).
3.  **Refactor**: Clean up the code while keeping tests green.

## 2. Test Location
Co-locate tests with components: `components/[Feature]/__tests__/[Component].test.tsx`.

## 3. Mocking in Tests
Since we use the **Hook Pattern** (see `mock-strategy.md`), testing is easy. We just need to mock the hook.

```tsx
import { render, screen } from '@testing-library/react';
import { UserProfile } from './UserProfile';
import { vi } from 'vitest';

// 1. Mock the Hook
vi.mock('../../hooks/useUser', () => ({
  useUser: () => ({
    data: { username: 'TestUser', tier: 'pro' },
    loading: false
  })
}));

test('renders username', () => {
  render(<UserProfile />);
  expect(screen.getByText('TestUser')).toBeInTheDocument();
});
```
