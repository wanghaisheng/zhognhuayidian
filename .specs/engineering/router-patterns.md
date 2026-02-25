# 🧩 Engineering Spec: TanStack Router Nesting Patterns

**Problem**: URL changes, but the page content remains static (Parent component shadows child).
**Solution**: The "Logic Sinking" Ritual.

---

## 1. The Core Anti-Pattern: Shadowing
In TanStack Router, route files map to the render hierarchy:
- `routes/$lang.blog.tsx` = **Layout (Parent)**
- `routes/$lang.blog.index.tsx` = **List View (Child A)**
- `routes/$lang.blog.$slug.tsx` = **Detail View (Child B)**

**Error**: If you write the *List View* UI inside `routes/$lang.blog.tsx`:
1.  The User navigates to `$slug`.
2.  The Router renders the Parent (`blog.tsx`) and tries to put the Child (`$slug.tsx`) into the `<Outlet />`.
3.  **Failure**: Since `blog.tsx` is full of list code and has no `<Outlet />`, the child is never rendered visually.

---

## 2. The Fix: Logic Sinking (Push Down)

### Step 1: Purge the Parent (`routes/$lang.blog.tsx`)
The Parent must only serve as a container/layout.
```tsx
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/$lang/blog')({
  component: () => (
    <div className="blog-layout min-h-screen">
      <Outlet /> {/* The Holy Grail */}
    </div>
  ),
});
```

### Step 2: Sink the List (`routes/$lang.blog.index.tsx`)
Move the list rendering logic here.
```tsx
export const Route = createFileRoute('/$lang/blog/')({
  component: BlogList,
});
```

### Step 3: Isolate the Detail (`routes/$lang.blog.$slug.tsx`)
This ensures that when the route matches, the **List unmounts** and the **Detail mounts** into the Parent's Outlet.

---

## 3. Checklist for Routing Bugs
1.  **Outlet Check**: Does the parent file contain `<Outlet />`?
2.  **Splat Check**: Are you using `state.prid` to bypass URL parsing issues in Sandboxes?
3.  **Link Check**: Are you using the typesafe `<Link to="...">` component?
