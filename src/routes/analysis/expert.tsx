import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/analysis/expert')({
  beforeLoad: () => {
    throw redirect({ to: '/reports/expert' });
  },
  component: () => null,
});
